'use client';

import React, { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Text,
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

  const handleOnOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetState();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOnOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10">
          <Upload size={16} />
          Bulk Upload (CSV)
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-white p-10 sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="mb-5">
            <div className="flex items-center">
              <Upload size={20} strokeWidth={1.5} className="text-gray-700" />
              <Text variant="lg-semibold" className="ml-2 text-gray-800">
                Bulk Upload Students
              </Text>
            </div>
          </SheetTitle>
          <hr className="border-t border-gray-300" />
        </SheetHeader>

        <div className="space-y-6 mt-5">
          {/* Main upload state */}
          {!file && !uploadResult && (
            <div className="flex flex-col space-y-6">
              {/* Drag Zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[200px] ${
                  dragActive
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="p-4 bg-white rounded-full text-primary mb-3 border border-gray-200 shadow-sm group-hover:scale-110 transition-transform">
                  <Upload size={28} className={dragActive ? 'animate-bounce' : ''} />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Drag and drop your CSV file here, or <span className="text-primary font-semibold hover:underline">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">Supports standard CSV files up to 10MB</p>
              </div>

              {/* Template & Help */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                    <Info size={16} className="text-primary" /> Getting Started
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Make sure your CSV file includes columns like <code className="bg-gray-200 px-1 rounded text-gray-800 font-mono text-[11px]">Name</code>, <code className="bg-gray-200 px-1 rounded text-gray-800 font-mono text-[11px]">Aadhaar Number</code>, <code className="bg-gray-200 px-1 rounded text-gray-800 font-mono text-[11px]">Class</code>, and <code className="bg-gray-200 px-1 rounded text-gray-800 font-mono text-[11px]">Section</code>.
                  </p>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Slight spelling errors in column headers are automatically resolved (e.g. `Pin code` or `EMIS Id`).
                  </p>
                </div>
                <Button
                  onClick={downloadSampleCSV}
                  variant="outline"
                  className="w-full text-xs flex items-center justify-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 bg-white"
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
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="text-primary" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB • {parsedRows.length} students detected
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={resetState}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 px-2"
                >
                  Clear File
                </Button>
              </div>

              {/* Section to Group Mapping Section */}
              {detectedSections.length > 0 ? (
                <div className="border border-gray-200 rounded-xl bg-gray-50 p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <RefreshCw size={16} className="animate-spin-slow text-primary" />
                      Section-to-Group Mapping Required
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Map each unique section detected in the CSV file to an academic group in the system.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 max-h-[220px] overflow-y-auto pr-1">
                    {detectedSections.map((section) => (
                      <div
                        key={section}
                        className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          Section <span className="text-primary font-bold">{section}</span>
                        </span>
                        <div className="w-[180px]">
                          <Select
                            value={sectionGroupMap[section] || 'General'}
                            onValueChange={(val) =>
                              setSectionGroupMap((prev) => ({ ...prev, [section]: val }))
                            }
                          >
                            <SelectTrigger className="w-full text-xs h-8 bg-white border-gray-200 text-gray-800">
                              <SelectValue placeholder="Select Group" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 text-gray-800">
                              <SelectGroup>
                                <SelectItem value="General" className="text-xs hover:bg-gray-50">
                                  General
                                </SelectItem>
                                {groupsList.map((group) => (
                                  <SelectItem
                                    key={group.id}
                                    value={group.name}
                                    className="text-xs hover:bg-gray-50"
                                  >
                                    {group.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-600 rounded-lg">
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
                  className="bg-primary hover:bg-primary/90 text-white font-medium text-sm flex items-center gap-2 px-6 shadow-md"
                >
                  Import {parsedRows.length} Students
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800">Uploading and assigning students...</p>
                <p className="text-xs text-gray-500 mt-1">
                  Parsing details, creating users, and establishing mappings. Do not close this modal.
                </p>
              </div>
            </div>
          )}

          {/* Result State */}
          {uploadResult && (
            <div className="p-6 rounded-xl border animate-in zoom-in-95 duration-200 flex flex-col items-center text-center space-y-4 bg-gray-50 border-gray-200 w-full">
              {uploadResult.success ? (
                <>
                  <div className="p-3 bg-emerald-50 rounded-full text-emerald-600 border border-emerald-100 shadow-sm">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Upload Completed!</h3>
                  <p className="text-sm text-gray-600 max-w-md leading-relaxed">
                    {uploadResult.message}
                  </p>

                  {uploadResult.failedStudents && uploadResult.failedStudents.length > 0 && (
                    <div className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 mt-2 max-h-[220px] overflow-y-auto">
                      <p className="text-xs font-semibold text-rose-600 mb-2 flex items-center gap-1.5">
                        <AlertTriangle size={14} />
                        Failed Records ({uploadResult.failedStudents.length})
                      </p>
                      <div className="space-y-1.5">
                        {uploadResult.failedStudents.map((f, idx) => (
                          <div key={idx} className="text-xs border-b border-gray-100 pb-1.5 last:border-0 last:pb-0 font-sans">
                            <span className="font-semibold text-gray-700">{f.name}</span>: <span className="text-gray-500">{f.error}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="p-3 bg-rose-50 rounded-full text-rose-600 border border-rose-100 shadow-sm">
                    <AlertTriangle size={36} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Upload Failed</h3>
                  <p className="text-sm text-rose-600 max-w-md leading-relaxed">
                    {uploadResult.message}
                  </p>
                  <p className="text-xs text-gray-500 max-w-sm mt-1">
                    Please ensure that the classes and sections listed in your CSV exist in the system and are spelled exactly matching the database.
                  </p>
                </>
              )}

              <div className="flex gap-3 pt-4 w-full justify-center">
                {!uploadResult.success && (
                  <Button
                    onClick={resetState}
                    variant="outline"
                    className="border-gray-200 text-gray-700 hover:bg-gray-100"
                  >
                    Try Again
                  </Button>
                )}
                <Button
                  onClick={() => setOpen(false)}
                  className="bg-primary hover:bg-primary/90 text-white px-6"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
