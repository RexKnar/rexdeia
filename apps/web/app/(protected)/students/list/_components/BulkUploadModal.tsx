'use client';

import React, { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from 'ui';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Loader2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useGetGroupListQuery } from '../../../../../lib/queries/group/useGetGroupListQuery';
import { GET_STUDENTS_LIST } from '../../../../../lib/endpoints';

interface CSVRow {
  [key: string]: string;
}

// Custom CSV Parser that handles double quotes (e.g. for addresses with commas)
function parseCSV(text: string): { headers: string[]; rows: CSVRow[] } {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentValue = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentValue += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentValue += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(currentValue.trim());
        currentValue = '';
      } else if (char === '\r' || char === '\n') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(currentValue.trim());
        if (row.some((val) => val !== '')) {
          lines.push(row);
        }
        row = [];
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
  }
  if (currentValue || row.length > 0) {
    row.push(currentValue.trim());
    if (row.some((val) => val !== '')) {
      lines.push(row);
    }
  }

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const rawHeaders = lines[0];
  const dataRows = lines.slice(1);

  // Normalize headers to match what the backend service expects
  const normalizedHeaders = rawHeaders.map((h) => {
    const clean = h.trim().toLowerCase().replace(/[\s._-]/g, '');
    if (clean === 'slno' || clean === 'sl.no' || clean === 'slno') return 'SlNo';
    if (clean === 'emisid' || clean === 'emis') return 'EMISId';
    if (clean === 'name') return 'Name';
    if (clean === 'class') return 'Class';
    if (clean === 'section') return 'Section';
    if (clean === 'fathername') return 'FatherName';
    if (clean === 'mothername') return 'MotherName';
    if (clean === 'aadhaarnumber' || clean === 'aadhar') return 'AadhaarNumber';
    if (clean === 'phonenumber' || clean === 'phone' || clean === 'mobile') return 'PhoneNumber';
    if (clean === 'dataofbirth' || clean === 'dateofbirth' || clean === 'dob') return 'DataOfBirth';
    if (clean === 'gender') return 'Gender';
    if (clean === 'dataofjoining' || clean === 'dateofjoining') return 'DateOfJoining';
    if (clean === 'address') return 'Address';
    if (clean === 'pincode' || clean === 'zipcode') return 'PinCode';
    if (clean === 'group') return 'Group';
    if (clean === 'medium') return 'Medium';
    if (clean === 'mothertongue') return 'MotherTongue';
    return h;
  });

  const rows = dataRows.map((line) => {
    const obj: CSVRow = {};
    normalizedHeaders.forEach((header, index) => {
      obj[header] = line[index] || '';
    });
    return obj;
  });

  return { headers: normalizedHeaders, rows };
}

// Custom CSV Rebuilder
function buildCSV(headers: string[], rows: CSVRow[]): string {
  const escapeField = (val: string) => {
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeField).join(',');
  const rowLines = rows.map((row) =>
    headers.map((h) => escapeField(row[h] || '')).join(',')
  );

  return [headerLine, ...rowLines].join('\n');
}

export function BulkUploadModal() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    count?: number;
    message?: string;
    failedStudents?: Array<{ name: string; error: string }>;
  } | null>(null);

  // CSV States
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<CSVRow[]>([]);
  const [detectedSections, setDetectedSections] = useState<string[]>([]);
  const [sectionGroupMap, setSectionGroupMap] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Fetch groups list (limit 100 to get all of them for dropdowns)
  const { data: groupsResponse } = useGetGroupListQuery({
    page: 1,
    limit: 100,
  });
  const groupsList = groupsResponse?.data || [];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload a valid CSV file.',
        variant: 'default',
      });
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers, rows } = parseCSV(text);

      setParsedHeaders(headers);
      setParsedRows(rows);

      // Extract unique sections
      const sections = Array.from(new Set(rows.map((r) => r.Section).filter(Boolean)));
      setDetectedSections(sections);

      // Reset section map
      const initialMap: Record<string, string> = {};
      sections.forEach((sec) => {
        initialMap[sec] = 'General'; // Default mapping to General group
      });
      setSectionGroupMap(initialMap);
    };
    reader.readAsText(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const downloadSampleCSV = () => {
    const headers = [
      'Sl. No',
      'EMIS Id',
      'Name',
      'Class',
      'Section',
      'Father Name',
      'Father Occupation',
      'Father Education',
      'Mother Name',
      'Mother Occupation',
      'Mother Education',
      'Guardian Name',
      'Guardian Occupation',
      'Aadhaar Number',
      'Phone Number',
      'Phone Number Verify Status',
      'Data of Birth',
      'Gender',
      'Data of joining',
      'Address',
      'Pin code',
    ];
    const row = [
      '1',
      '1026461920',
      'John Doe',
      'VI',
      'A',
      'Richard Doe',
      'Daily wages',
      '3',
      'Jane Doe',
      'Un-employed',
      '3',
      '',
      '',
      '123456789012',
      '9876543210',
      'Verified',
      '04-08-2015',
      'Male',
      '2026-06-17',
      '9/189, ANDIPOTTAI, PECHIPPARAI',
      '629161',
    ];
    const csvContent = [headers.join(','), row.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample_student_upload.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async () => {
    if (!file || parsedRows.length === 0) return;

    setIsLoading(true);
    setUploadResult(null);

    try {
      // Map sections to their assigned groups dynamically in each row
      const updatedRows = parsedRows.map((row) => {
        const mappedGroup = sectionGroupMap[row.Section] || 'General';
        return {
          ...row,
          Group: mappedGroup,
        };
      });

      // Add 'Group' to headers if not present
      const finalHeaders = parsedHeaders.includes('Group')
        ? parsedHeaders
        : [...parsedHeaders, 'Group'];

      // Rebuild CSV string with normalized headers and mapped groups
      const rebuiltCSV = buildCSV(finalHeaders, updatedRows);

      const blob = new Blob([rebuiltCSV], { type: 'text/csv' });
      const fileToUpload = new File([blob], file.name, { type: 'text/csv' });

      const formData = new FormData();
      formData.append('file', fileToUpload);

      const response = await fetch('/api/csv-upload/student', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server error while uploading CSV.');
      }

      const result = await response.json();

      // Check if result is the new structured success/failure object
      if (result && result.success) {
        const count = result.createdCount;
        const failedCount = result.failedCount;
        const failedList = result.failedStudents || [];

        if (failedCount > 0) {
          setUploadResult({
            success: true,
            count: count,
            message: `Import completed with warnings: ${count} students successfully imported. ${failedCount} students failed to import due to duplicate credentials or missing references.`,
            failedStudents: failedList,
          });

          toast({
            title: 'Import Completed with Warnings',
            description: `Imported ${count} students. ${failedCount} failed.`,
            variant: 'default',
          });
        } else {
          setUploadResult({
            success: true,
            count: count,
            message: `All ${count} students successfully imported and assigned to classes, sections, and groups.`,
          });

          toast({
            title: 'Import Successful',
            description: `Successfully imported all ${count} students.`,
            variant: 'default',
          });
        }

        // Invalidate query to refresh the student list
        await queryClient.refetchQueries({
          queryKey: [GET_STUDENTS_LIST],
        });
      } else {
        // Fallback for old API format (if it returns an array of promises)
        if (Array.isArray(result)) {
          const count = Math.ceil(result.length / 2);
          setUploadResult({
            success: true,
            count: count,
            message: `${count} students successfully imported and assigned to classes, sections, and groups.`,
          });

          toast({
            title: 'Import Successful',
            description: `Successfully imported ${count} students.`,
            variant: 'default',
          });

          await queryClient.refetchQueries({
            queryKey: [GET_STUDENTS_LIST],
          });
        } else {
          setUploadResult({
            success: false,
            message: result?.message || 'An error occurred during bulk upload. Please verify that all referenced Classes and Sections exist in the system.',
          });
        }
      }
    } catch (error: any) {
      console.error(error);
      setUploadResult({
        success: false,
        message: error.message || 'An unexpected error occurred during upload.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const resetState = () => {
    setFile(null);
    setParsedHeaders([]);
    setParsedRows([]);
    setDetectedSections([]);
    setSectionGroupMap({});
    setUploadResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetState(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10">
          <Upload size={16} />
          Bulk Upload (CSV)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-slate-950 text-slate-100 border-slate-800 p-6 shadow-2xl rounded-xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
            Bulk Upload Students
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Upload student records from a CSV file, normalize headers, and map student sections to academic groups.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main upload state */}
          {!file && !uploadResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Drag Zone */}
              <div className="md:col-span-2">
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[220px] ${dragActive
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="p-4 bg-slate-900 rounded-full text-indigo-400 mb-3 border border-slate-800 shadow-inner group-hover:scale-110 transition-transform">
                    <Upload size={28} className={dragActive ? 'animate-bounce' : ''} />
                  </div>
                  <p className="text-sm font-medium text-slate-200">
                    Drag and drop your CSV file here, or <span className="text-indigo-400 font-semibold hover:underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Supports standard CSV files up to 10MB</p>
                </div>
              </div>

              {/* Template & Help */}
              <div className="bg-slate-900/50 border border-slate-900 rounded-xl p-4 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1">
                    <Info size={14} /> Getting Started
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Make sure your CSV file includes columns like <code className="text-slate-200">Name</code>, <code className="text-slate-200">Aadhaar Number</code>, <code className="text-slate-200">Class</code>, and <code className="text-slate-200">Section</code>.
                  </p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Slight spelling errors in column headers are automatically resolved (e.g. `Pin code` or `EMIS Id`).
                  </p>
                </div>
                <Button
                  onClick={downloadSampleCSV}
                  variant="outline"
                  className="w-full text-xs flex items-center justify-center gap-2 border-slate-800 text-slate-300 hover:bg-slate-800"
                >
                  <Download size={14} />
                  Download Sample CSV
                </Button>
              </div>
            </div>
          )}

          {/* Mapping & File details State */}
          {file && !uploadResult && !isLoading && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              {/* Selected File Header */}
              <div className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024).toFixed(1)} KB • {parsedRows.length} students detected
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={resetState}
                  className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-8 px-2"
                >
                  Clear File
                </Button>
              </div>

              {/* Section to Group Mapping Section */}
              {detectedSections.length > 0 ? (
                <div className="border border-slate-900 rounded-xl bg-slate-900/30 p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
                      <RefreshCw size={16} className="animate-spin-slow text-indigo-400" />
                      Section-to-Group Mapping Required
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Map each unique section detected in the CSV file to an academic group in the system.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[200px] overflow-y-auto pr-1">
                    {detectedSections.map((section) => (
                      <div
                        key={section}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-900"
                      >
                        <span className="text-sm font-medium text-slate-300">
                          Section <span className="text-indigo-400 font-bold">{section}</span>
                        </span>
                        <div className="w-[180px]">
                          <Select
                            value={sectionGroupMap[section] || 'General'}
                            onValueChange={(val) =>
                              setSectionGroupMap((prev) => ({ ...prev, [section]: val }))
                            }
                          >
                            <SelectTrigger className="w-full text-xs h-8 bg-slate-900 border-slate-800 text-slate-200">
                              <SelectValue placeholder="Select Group" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                              <SelectItem value="General" className="text-xs hover:bg-slate-800">
                                General
                              </SelectItem>
                              {groupsList.map((group) => (
                                <SelectItem
                                  key={group.id}
                                  value={group.name}
                                  className="text-xs hover:bg-slate-800"
                                >
                                  {group.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
                  <AlertTriangle size={18} />
                  <span className="text-xs">
                    No Section column detected. Students will be imported without section-to-group mappings.
                  </span>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleUpload}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center gap-2 px-6 shadow-lg shadow-indigo-600/20"
                >
                  Import {parsedRows.length} Students
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
              <Loader2 className="animate-spin text-indigo-500" size={40} />
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-200">Uploading and assigning students...</p>
                <p className="text-xs text-slate-500 mt-1">
                  Parsing details, creating users, and establishing mappings. Do not close this modal.
                </p>
              </div>
            </div>
          )}

          {/* Result State */}
          {uploadResult && (
            <div className="p-6 rounded-xl border animate-in zoom-in-95 duration-200 flex flex-col items-center text-center space-y-4 bg-slate-900/20 border-slate-900 w-full">
              {uploadResult.success ? (
                <>
                  <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">Upload Completed!</h3>
                  <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                    {uploadResult.message}
                  </p>

                  {uploadResult.failedStudents && uploadResult.failedStudents.length > 0 && (
                    <div className="w-full text-left bg-slate-950/80 border border-slate-800 rounded-lg p-4 mt-2 max-h-[220px] overflow-y-auto">
                      <p className="text-xs font-semibold text-rose-400 mb-2 flex items-center gap-1.5">
                        <AlertTriangle size={14} />
                        Failed Records ({uploadResult.failedStudents.length})
                      </p>
                      <div className="space-y-1.5">
                        {uploadResult.failedStudents.map((f, idx) => (
                          <div key={idx} className="text-xs border-b border-slate-900 pb-1.5 last:border-0 last:pb-0 font-sans">
                            <span className="font-semibold text-slate-300">{f.name}</span>: <span className="text-slate-400">{f.error}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="p-3 bg-rose-500/10 rounded-full text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                    <AlertTriangle size={36} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">Upload Failed</h3>
                  <p className="text-sm text-rose-400 max-w-md leading-relaxed">
                    {uploadResult.message}
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Please ensure that the classes and sections listed in your CSV exist in the system and are spelled exactly matching the database.
                  </p>
                </>
              )}

              <div className="flex gap-3 pt-4 w-full justify-center">
                {!uploadResult.success && (
                  <Button
                    onClick={resetState}
                    variant="outline"
                    className="border-slate-800 text-slate-300 hover:bg-slate-800"
                  >
                    Try Again
                  </Button>
                )}
                <Button
                  onClick={() => setOpen(false)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
