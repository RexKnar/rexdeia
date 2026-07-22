'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  ShieldCheck,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  Copy,
  Check,
  RefreshCw,
  Users,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { Button, Input } from 'ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from 'ui/components/ui/Dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';
import { cn } from 'utils';

// String similarity function (Levenshtein + Token match)
function calculateNameSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
  const s2 = str2.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');

  if (s1 === s2) return 1.0;

  // Token matching (handles "Rahul Kumar" vs "Kumar Rahul")
  const tokens1 = s1.split(/\s+/).filter(Boolean);
  const tokens2 = s2.split(/\s+/).filter(Boolean);
  const commonTokens = tokens1.filter((t) => tokens2.includes(t));
  const tokenRatio = (2 * commonTokens.length) / (tokens1.length + tokens2.length);

  // Levenshtein distance
  const track = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = track[s2.length][s1.length];
  const maxLength = Math.max(s1.length, s2.length);
  const levenshteinRatio = maxLength === 0 ? 1 : (maxLength - distance) / maxLength;

  return Math.max(tokenRatio, levenshteinRatio);
}

export type MasterCSVRecord = {
  emisId: string;
  name: string;
  className: string;
  sectionName: string;
  fatherName: string;
  motherName: string;
  aadhaarNumber: string;
  phoneNumber: string;
  dob: string;
  gender: string;
  dateOfJoining: string;
  email: string;
  address: string;
  pinCode: string;
  bloodGroup: string;
  religion: string;
  medium: string;
  admissionNo: string;
  community: string;
  rawRow: Record<string, string>;
};

export type SystemStudentItem = {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
  emisNumber?: string | null;
  admissionNumber?: string | null;
  section?: { name?: string | null } | null;
  gender?: string | null;
  emailId?: string | null;
};

export type VerificationResultItem = {
  id: string;
  status:
    | 'MATCHED'
    | 'SIMILAR_NAME'
    | 'SECTION_MISMATCH'
    | 'MISSING_IN_SYSTEM'
    | 'EXTRA_IN_SYSTEM'
    | 'SYSTEM_DUPLICATE';
  issueSeverity: 'none' | 'warning' | 'error' | 'info';
  issueDescription: string;
  similarityScore?: number;
  csvRecord?: Partial<MasterCSVRecord>;
  systemRecord?: SystemStudentItem;
};

export type VerifyStudentListModalProps = {
  isOpen: boolean;
  onClose: () => void;
  systemStudents: SystemStudentItem[];
  classNameTitle?: string;
};

export function VerifyStudentListModal({
  isOpen,
  onClose,
  systemStudents = [],
  classNameTitle,
}: VerifyStudentListModalProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvRecords, setCsvRecords] = useState<MasterCSVRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'SIMILAR' | 'DISCREPANCY' | 'MISSING' | 'EXTRA' | 'DUPLICATE' | 'MATCHED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to parse CSV content according to header order
  const parseCSVText = (text: string): MasterCSVRecord[] => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return [];

    // Parse CSV line preserving quotes
    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseLine(lines[0]).map((h) => h.replace(/^["']|["']$/g, '').trim());

    // Map header names dynamically or by standard order:
    // Order: EMIS Id, Name, Class, Section, Father Na, Mother Na, Aadhaar N, Phone Nu, Data of Bli, Gender, Data of Jo, Email, Address, Pin code, Blood Gro, Religion, Medium o, Admissio, Community
    const findHeaderIndex = (patterns: string[], fallbackIndex: number) => {
      const idx = headers.findIndex((h) =>
        patterns.some((p) => h.toLowerCase().includes(p.toLowerCase()))
      );
      return idx !== -1 ? idx : fallbackIndex < headers.length ? fallbackIndex : -1;
    };

    const idxEmis = findHeaderIndex(['emis', 'emis id', 'emisid', 'emis_id'], 0);
    const idxName = findHeaderIndex(['name', 'student name', 'student_name', 'fullname'], 1);
    const idxClass = findHeaderIndex(['class'], 2);
    const idxSection = findHeaderIndex(['section'], 3);
    const idxFather = findHeaderIndex(['father', 'father na', 'father_name'], 4);
    const idxMother = findHeaderIndex(['mother', 'mother na', 'mother_name'], 5);
    const idxAadhaar = findHeaderIndex(['aadhaar', 'aadhaar n', 'aadhar'], 6);
    const idxPhone = findHeaderIndex(['phone', 'phone nu', 'mobile'], 7);
    const idxDob = findHeaderIndex(['data of bli', 'date of birth', 'dob', 'birth'], 8);
    const idxGender = findHeaderIndex(['gender'], 9);
    const idxDoj = findHeaderIndex(['data of jo', 'date of joining', 'doj'], 10);
    const idxEmail = findHeaderIndex(['email'], 11);
    const idxAddress = findHeaderIndex(['address'], 12);
    const idxPin = findHeaderIndex(['pin', 'pin code'], 13);
    const idxBlood = findHeaderIndex(['blood', 'blood gro'], 14);
    const idxReligion = findHeaderIndex(['religion'], 15);
    const idxMedium = findHeaderIndex(['medium', 'medium o'], 16);
    const idxAdmission = findHeaderIndex(['admissio', 'admission', 'admission number', 'adm no'], 17);
    const idxCommunity = findHeaderIndex(['community'], 18);

    const records: MasterCSVRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseLine(lines[i]).map((c) => c.replace(/^["']|["']$/g, '').trim());
      if (cols.length === 0 || cols.every((c) => c === '')) continue;

      const getCol = (idx: number) => (idx !== -1 && idx < cols.length ? cols[idx] : '');

      const rawRow: Record<string, string> = {};
      headers.forEach((h, index) => {
        rawRow[h] = cols[index] || '';
      });

      records.push({
        emisId: getCol(idxEmis),
        name: getCol(idxName),
        className: getCol(idxClass),
        sectionName: getCol(idxSection),
        fatherName: getCol(idxFather),
        motherName: getCol(idxMother),
        aadhaarNumber: getCol(idxAadhaar),
        phoneNumber: getCol(idxPhone),
        dob: getCol(idxDob),
        gender: getCol(idxGender),
        dateOfJoining: getCol(idxDoj),
        email: getCol(idxEmail),
        address: getCol(idxAddress),
        pinCode: getCol(idxPin),
        bloodGroup: getCol(idxBlood),
        religion: getCol(idxReligion),
        medium: getCol(idxMedium),
        admissionNo: getCol(idxAdmission),
        community: getCol(idxCommunity),
        rawRow,
      });
    }

    return records;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSVText(text);
        setCsvRecords(parsed);
      } catch (err) {
        console.error('Failed to parse CSV:', err);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleResetFile = () => {
    setCsvFile(null);
    setCsvRecords([]);
    setActiveTab('ALL');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Perform Comprehensive Verification Analysis
  const verificationResults = useMemo(() => {
    const results: VerificationResultItem[] = [];

    // Helper: System Student Full Name
    const getSysName = (s: SystemStudentItem) =>
      [s.firstName, s.middleName, s.lastName].filter(Boolean).join(' ').trim();

    // 1. Identify Internal System Duplicates (EMIS, Admission No, or Exact Name & Section)
    const emisMap = new Map<string, SystemStudentItem[]>();
    const admMap = new Map<string, SystemStudentItem[]>();
    const nameSectionMap = new Map<string, SystemStudentItem[]>();

    systemStudents.forEach((s) => {
      if (s.emisNumber) {
        const key = s.emisNumber.trim().toLowerCase();
        emisMap.set(key, [...(emisMap.get(key) || []), s]);
      }
      if (s.admissionNumber) {
        const key = s.admissionNumber.trim().toLowerCase();
        admMap.set(key, [...(admMap.get(key) || []), s]);
      }
      const fullName = getSysName(s).toLowerCase();
      const sec = (s.section?.name || '').toLowerCase();
      if (fullName) {
        const key = `${fullName}-${sec}`;
        nameSectionMap.set(key, [...(nameSectionMap.get(key) || []), s]);
      }
    });

    const flaggedSystemStudentIds = new Set<string>();

    // Add internal duplicate warnings for System Students
    systemStudents.forEach((s) => {
      const fullSysName = getSysName(s);
      const emis = s.emisNumber?.trim().toLowerCase();
      const adm = s.admissionNumber?.trim().toLowerCase();
      const secKey = `${fullSysName.toLowerCase()}-${(s.section?.name || '').toLowerCase()}`;

      let isDuplicate = false;
      let dupReason = '';

      if (emis && (emisMap.get(emis)?.length || 0) > 1) {
        isDuplicate = true;
        dupReason = `Duplicate EMIS Number (${s.emisNumber}) found in system list across ${emisMap.get(emis)?.length} students`;
      } else if (adm && (admMap.get(adm)?.length || 0) > 1) {
        isDuplicate = true;
        dupReason = `Duplicate Admission Number (${s.admissionNumber}) found in system list`;
      } else if ((nameSectionMap.get(secKey)?.length || 0) > 1) {
        isDuplicate = true;
        dupReason = `Duplicate Student Name ("${fullSysName}") found in Section ${s.section?.name || 'Unassigned'}`;
      }

      if (isDuplicate) {
        flaggedSystemStudentIds.add(s.id);
        results.push({
          id: `sys-dup-${s.id}`,
          status: 'SYSTEM_DUPLICATE',
          issueSeverity: 'warning',
          issueDescription: dupReason,
          systemRecord: s,
        });
      }
    });

    // 2. If NO CSV uploaded, return the internal system audit results
    if (csvRecords.length === 0) {
      return results;
    }

    // 3. Match Master CSV Records vs System Students
    const matchedSystemStudentIds = new Set<string>();

    csvRecords.forEach((csv, idx) => {
      const csvName = csv.name.trim();
      const csvEmis = csv.emisId.trim().toLowerCase();
      const csvAdm = csv.admissionNo.trim().toLowerCase();
      const csvSec = csv.sectionName.trim().toLowerCase();

      // Attempt matching:
      // Priority 1: Match by EMIS ID
      let matchedSys = csvEmis
        ? systemStudents.find((s) => s.emisNumber?.trim().toLowerCase() === csvEmis)
        : undefined;

      // Priority 2: Match by Admission Number
      if (!matchedSys && csvAdm) {
        matchedSys = systemStudents.find((s) => s.admissionNumber?.trim().toLowerCase() === csvAdm);
      }

      // Priority 3: Exact Name & Section match
      if (!matchedSys && csvName) {
        matchedSys = systemStudents.find((s) => {
          const sysName = getSysName(s).toLowerCase();
          const sysSec = (s.section?.name || '').toLowerCase();
          return sysName === csvName.toLowerCase() && (sysSec === csvSec || !csvSec || !sysSec);
        });
      }

      // Priority 4: Fuzzy Name match (high similarity >= 70%)
      let bestFuzzyMatch: SystemStudentItem | undefined;
      let highestSimilarity = 0;

      if (!matchedSys && csvName) {
        systemStudents.forEach((s) => {
          if (matchedSystemStudentIds.has(s.id)) return;
          const sysName = getSysName(s);
          const sim = calculateNameSimilarity(csvName, sysName);
          if (sim > highestSimilarity) {
            highestSimilarity = sim;
            bestFuzzyMatch = s;
          }
        });

        if (highestSimilarity >= 0.7 && bestFuzzyMatch) {
          matchedSys = bestFuzzyMatch;
        }
      }

      if (matchedSys) {
        matchedSystemStudentIds.add(matchedSys.id);
        const sysName = getSysName(matchedSys);
        const nameSim = calculateNameSimilarity(csvName, sysName);
        const sysSec = matchedSys.section?.name || '';

        const isExactName = nameSim >= 0.95;
        const isExactSec = !csvSec || !sysSec || csvSec === sysSec.toLowerCase();

        if (isExactName && isExactSec) {
          results.push({
            id: `csv-match-${idx}`,
            status: 'MATCHED',
            issueSeverity: 'none',
            issueDescription: 'Master CSV & System records match perfectly',
            similarityScore: 100,
            csvRecord: csv,
            systemRecord: matchedSys,
          });
        } else if (!isExactSec && isExactName) {
          results.push({
            id: `csv-sec-mismatch-${idx}`,
            status: 'SECTION_MISMATCH',
            issueSeverity: 'error',
            issueDescription: `Section Mismatch! CSV: "${csv.sectionName}" vs System: "${sysSec}"`,
            similarityScore: Math.round(nameSim * 100),
            csvRecord: csv,
            systemRecord: matchedSys,
          });
        } else {
          // Similar / Mismatched name
          results.push({
            id: `csv-similar-${idx}`,
            status: 'SIMILAR_NAME',
            issueSeverity: 'warning',
            issueDescription: `Similar Name / Spelling Variance (${Math.round(nameSim * 100)}% match). CSV: "${csvName}" vs System: "${sysName}"`,
            similarityScore: Math.round(nameSim * 100),
            csvRecord: csv,
            systemRecord: matchedSys,
          });
        }
      } else {
        // Missing in system
        results.push({
          id: `csv-missing-${idx}`,
          status: 'MISSING_IN_SYSTEM',
          issueSeverity: 'error',
          issueDescription: `Student "${csvName}" (EMIS: ${csv.emisId || 'N/A'}) exists in Master CSV but is MISSING in System`,
          csvRecord: csv,
        });
      }
    });

    // 4. Identify Extra System Students (In DB, but not found in Master CSV)
    systemStudents.forEach((s) => {
      if (!matchedSystemStudentIds.has(s.id) && !flaggedSystemStudentIds.has(s.id)) {
        const sysName = getSysName(s);
        results.push({
          id: `sys-extra-${s.id}`,
          status: 'EXTRA_IN_SYSTEM',
          issueSeverity: 'info',
          issueDescription: `Student "${sysName}" (EMIS: ${s.emisNumber || 'N/A'}) exists in System but NOT found in Master CSV`,
          systemRecord: s,
        });
      }
    });

    return results;
  }, [csvRecords, systemStudents]);

  // Statistics Summary
  const stats = useMemo(() => {
    const totalSystem = systemStudents.length;
    const totalCSV = csvRecords.length;
    const matched = verificationResults.filter((r) => r.status === 'MATCHED').length;
    const similar = verificationResults.filter((r) => r.status === 'SIMILAR_NAME').length;
    const sectionMismatch = verificationResults.filter((r) => r.status === 'SECTION_MISMATCH').length;
    const missing = verificationResults.filter((r) => r.status === 'MISSING_IN_SYSTEM').length;
    const extra = verificationResults.filter((r) => r.status === 'EXTRA_IN_SYSTEM').length;
    const duplicates = verificationResults.filter((r) => r.status === 'SYSTEM_DUPLICATE').length;

    const issuesCount = similar + sectionMismatch + missing + extra + duplicates;
    const matchRate = totalCSV > 0 ? Math.round((matched / totalCSV) * 100) : 100;

    return {
      totalSystem,
      totalCSV,
      matched,
      similar,
      sectionMismatch,
      missing,
      extra,
      duplicates,
      issuesCount,
      matchRate,
    };
  }, [systemStudents.length, csvRecords.length, verificationResults]);

  // Filtered Results
  const filteredResults = useMemo(() => {
    let list = verificationResults;

    if (activeTab === 'SIMILAR') list = list.filter((r) => r.status === 'SIMILAR_NAME');
    else if (activeTab === 'DISCREPANCY') list = list.filter((r) => r.status === 'SECTION_MISMATCH');
    else if (activeTab === 'MISSING') list = list.filter((r) => r.status === 'MISSING_IN_SYSTEM');
    else if (activeTab === 'EXTRA') list = list.filter((r) => r.status === 'EXTRA_IN_SYSTEM');
    else if (activeTab === 'DUPLICATE') list = list.filter((r) => r.status === 'SYSTEM_DUPLICATE');
    else if (activeTab === 'MATCHED') list = list.filter((r) => r.status === 'MATCHED');

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((r) => {
        const csvName = r.csvRecord?.name?.toLowerCase() || '';
        const csvEmis = r.csvRecord?.emisId?.toLowerCase() || '';
        const sysName = [r.systemRecord?.firstName, r.systemRecord?.lastName].filter(Boolean).join(' ').toLowerCase();
        const sysEmis = r.systemRecord?.emisNumber?.toLowerCase() || '';
        const desc = r.issueDescription.toLowerCase();
        return csvName.includes(q) || csvEmis.includes(q) || sysName.includes(q) || sysEmis.includes(q) || desc.includes(q);
      });
    }

    return list;
  }, [verificationResults, activeTab, searchQuery]);

  // Export Verification Summary Report
  const handleExportReport = () => {
    if (verificationResults.length === 0) return;

    const headers = [
      'Verification Status',
      'Issue Description',
      'CSV EMIS ID',
      'CSV Student Name',
      'CSV Section',
      'CSV Admission No',
      'System EMIS ID',
      'System Student Name',
      'System Section',
      'System Admission No',
    ];

    const rows = verificationResults.map((r) => [
      r.status,
      `"${r.issueDescription.replace(/"/g, '""')}"`,
      r.csvRecord?.emisId || '',
      `"${(r.csvRecord?.name || '').replace(/"/g, '""')}"`,
      r.csvRecord?.sectionName || '',
      r.csvRecord?.admissionNo || '',
      r.systemRecord?.emisNumber || '',
      `"${([r.systemRecord?.firstName, r.systemRecord?.lastName].filter(Boolean).join(' ')).replace(/"/g, '""')}"`,
      r.systemRecord?.section?.name || '',
      r.systemRecord?.admissionNumber || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `student_verification_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-gray-50 border border-gray-200 rounded-xl shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-5 bg-white border-b border-gray-200 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 shadow-inner">
              <ShieldCheck size={24} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Verify Student List & Master CSV Audit
                {classNameTitle && (
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
                    {classNameTitle}
                  </span>
                )}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 mt-0.5">
                Check for duplicate entries, spelling variations in student names, section mismatches, and missing students against master copy.
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 mr-6">
            {csvFile && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFile}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <RotateCcw size={14} /> Reset Master CSV
              </Button>
            )}
            {verificationResults.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportReport}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                <Download size={14} /> Export Report
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Modal Main Content Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* CSV File Upload Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <FileSpreadsheet size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Upload Master CSV Copy</h4>
                  <p className="text-xs text-gray-500">
                    Expected columns: <span className="font-mono text-indigo-600 font-medium">EMIS Id, Name, Class, Section, Father Name, Mother Name, Aadhaar Number, Phone Number, DOB, Gender, DOJ, Email, Address, Pincode, Blood Group, Religion, Medium, Admission Number, Community</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {csvFile ? (
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                      <CheckCircle size={15} className="text-emerald-600" />
                      <span className="truncate max-w-[180px]">{csvFile.name}</span>
                      <span className="text-emerald-600 font-normal">({csvRecords.length} rows)</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetFile}
                      className="h-7 px-2 text-xs text-red-600 hover:text-red-800 hover:bg-red-100/60 flex items-center gap-1 font-semibold"
                      title="Reset Master CSV File"
                    >
                      <RotateCcw size={13} />
                      <span>Reset CSV</span>
                    </Button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors w-full md:w-auto">
                    <Upload size={15} />
                    <span>Upload CSV File</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv, .xlsx, .xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Stats KPI Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Match Score</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={cn('text-2xl font-bold', stats.matchRate >= 90 ? 'text-emerald-600' : stats.matchRate >= 70 ? 'text-amber-600' : 'text-red-600')}>
                  {stats.matchRate}%
                </span>
              </div>
            </div>

            <div
              onClick={() => setActiveTab('MATCHED')}
              className={cn(
                'bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-sm',
                activeTab === 'MATCHED' ? 'border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/20' : 'border-gray-200 hover:border-emerald-300'
              )}
            >
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle size={12} /> Matched
              </span>
              <span className="text-2xl font-bold text-gray-900 block mt-1">{stats.matched}</span>
            </div>

            <div
              onClick={() => setActiveTab('SIMILAR')}
              className={cn(
                'bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-sm',
                activeTab === 'SIMILAR' ? 'border-amber-500 ring-2 ring-amber-100 bg-amber-50/20' : 'border-gray-200 hover:border-amber-300'
              )}
            >
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle size={12} /> Similar Name
              </span>
              <span className="text-2xl font-bold text-amber-600 block mt-1">{stats.similar}</span>
            </div>

            <div
              onClick={() => setActiveTab('DISCREPANCY')}
              className={cn(
                'bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-sm',
                activeTab === 'DISCREPANCY' ? 'border-rose-500 ring-2 ring-rose-100 bg-rose-50/20' : 'border-gray-200 hover:border-rose-300'
              )}
            >
              <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                <XCircle size={12} /> Sec Mismatch
              </span>
              <span className="text-2xl font-bold text-rose-600 block mt-1">{stats.sectionMismatch}</span>
            </div>

            <div
              onClick={() => setActiveTab('MISSING')}
              className={cn(
                'bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-sm',
                activeTab === 'MISSING' ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20' : 'border-gray-200 hover:border-red-300'
              )}
            >
              <span className="text-[11px] font-semibold text-red-700 uppercase tracking-wider flex items-center gap-1">
                <HelpCircle size={12} /> Missing in Sys
              </span>
              <span className="text-2xl font-bold text-red-600 block mt-1">{stats.missing}</span>
            </div>

            <div
              onClick={() => setActiveTab('EXTRA')}
              className={cn(
                'bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-sm',
                activeTab === 'EXTRA' ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/20' : 'border-gray-200 hover:border-indigo-300'
              )}
            >
              <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                <Users size={12} /> Extra in Sys
              </span>
              <span className="text-2xl font-bold text-indigo-600 block mt-1">{stats.extra}</span>
            </div>

            <div
              onClick={() => setActiveTab('DUPLICATE')}
              className={cn(
                'bg-white p-3 rounded-xl border transition-all cursor-pointer shadow-sm',
                activeTab === 'DUPLICATE' ? 'border-purple-500 ring-2 ring-purple-100 bg-purple-50/20' : 'border-gray-200 hover:border-purple-300'
              )}
            >
              <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                <RefreshCw size={12} /> Sys Duplicates
              </span>
              <span className="text-2xl font-bold text-purple-600 block mt-1">{stats.duplicates}</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
              {(
                [
                  { id: 'ALL', label: `All Results (${verificationResults.length})` },
                  { id: 'SIMILAR', label: `Similar Names (${stats.similar})` },
                  { id: 'DISCREPANCY', label: `Discrepancies (${stats.sectionMismatch})` },
                  { id: 'MISSING', label: `Missing (${stats.missing})` },
                  { id: 'EXTRA', label: `Extra (${stats.extra})` },
                  { id: 'DUPLICATE', label: `Duplicates (${stats.duplicates})` },
                  { id: 'MATCHED', label: `Matched (${stats.matched})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <Input
                type="text"
                placeholder="Filter results by name, EMIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs border-gray-300 focus:border-indigo-500 rounded-lg"
              />
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {filteredResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-500 mb-3 opacity-80" />
                <h4 className="text-base font-bold text-gray-800">No Discrepancies or Results Found</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-1">
                  {csvRecords.length === 0
                    ? 'Upload a Master CSV file above to start cross-verifying student list.'
                    : 'All records match the selected filter criteria cleanly.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80 hover:bg-gray-50">
                      <TableHead className="w-[140px] pl-4 text-xs font-bold">Status & Tag</TableHead>
                      <TableHead className="text-xs font-bold">Master CSV Copy Details</TableHead>
                      <TableHead className="text-xs font-bold">System Database Details</TableHead>
                      <TableHead className="text-xs font-bold">Verification Finding</TableHead>
                      <TableHead className="w-[80px] text-right pr-4 text-xs font-bold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((item) => {
                      const csvName = item.csvRecord?.name || '-';
                      const csvEmis = item.csvRecord?.emisId || '-';
                      const csvSec = item.csvRecord?.sectionName || '-';
                      const csvAdm = item.csvRecord?.admissionNo || '-';

                      const sysName = item.systemRecord
                        ? [item.systemRecord.firstName, item.systemRecord.middleName, item.systemRecord.lastName]
                            .filter(Boolean)
                            .join(' ')
                        : '-';
                      const sysEmis = item.systemRecord?.emisNumber || '-';
                      const sysSec = item.systemRecord?.section?.name || '-';
                      const sysAdm = item.systemRecord?.admissionNumber || '-';

                      return (
                        <TableRow key={item.id} className="hover:bg-indigo-50/20 transition-colors">
                          {/* Status Tag */}
                          <TableCell className="pl-4 align-top py-3">
                            {item.status === 'MATCHED' && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                <CheckCircle size={12} /> Matched
                              </span>
                            )}
                            {item.status === 'SIMILAR_NAME' && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-700">
                                <AlertTriangle size={12} /> Similar Name
                              </span>
                            )}
                            {item.status === 'SECTION_MISMATCH' && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs font-bold text-rose-700">
                                <XCircle size={12} /> Sec Mismatch
                              </span>
                            )}
                            {item.status === 'MISSING_IN_SYSTEM' && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-bold text-red-700">
                                <HelpCircle size={12} /> Missing Sys
                              </span>
                            )}
                            {item.status === 'EXTRA_IN_SYSTEM' && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-xs font-bold text-indigo-700">
                                <Users size={12} /> Extra Sys
                              </span>
                            )}
                            {item.status === 'SYSTEM_DUPLICATE' && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 border border-purple-200 px-2.5 py-1 text-xs font-bold text-purple-700">
                                <RefreshCw size={12} /> Sys Duplicate
                              </span>
                            )}
                          </TableCell>

                          {/* Master CSV Details */}
                          <TableCell className="align-top py-3">
                            <div className="space-y-0.5">
                              <p className="font-semibold text-gray-900 text-xs">{csvName}</p>
                              <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                                <span>EMIS: <strong className="font-mono text-gray-700">{csvEmis}</strong></span>
                                <span>•</span>
                                <span>Sec: <strong className="text-gray-700">{csvSec}</strong></span>
                                {csvAdm !== '-' && (
                                  <>
                                    <span>•</span>
                                    <span>Adm: <strong className="font-mono text-gray-700">{csvAdm}</strong></span>
                                  </>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          {/* System Database Details */}
                          <TableCell className="align-top py-3">
                            <div className="space-y-0.5">
                              <p className="font-semibold text-gray-900 text-xs">{sysName}</p>
                              <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
                                <span>EMIS: <strong className="font-mono text-gray-700">{sysEmis}</strong></span>
                                <span>•</span>
                                <span>Sec: <strong className="text-gray-700">{sysSec}</strong></span>
                                {sysAdm !== '-' && (
                                  <>
                                    <span>•</span>
                                    <span>Adm: <strong className="font-mono text-gray-700">{sysAdm}</strong></span>
                                  </>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          {/* Issue / Finding Description */}
                          <TableCell className="align-top py-3">
                            <p className={cn(
                              'text-xs font-medium',
                              item.issueSeverity === 'error' ? 'text-red-700' : item.issueSeverity === 'warning' ? 'text-amber-800' : 'text-gray-600'
                            )}>
                              {item.issueDescription}
                            </p>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="text-right pr-4 align-top py-3">
                            {(csvEmis !== '-' || sysEmis !== '-') && (
                              <button
                                onClick={() => copyToClipboard(csvEmis !== '-' ? csvEmis : sysEmis, item.id)}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
                                title="Copy EMIS Number"
                              >
                                {copiedId === item.id ? (
                                  <>
                                    <Check size={12} className="text-emerald-600" />
                                    <span className="text-emerald-600">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={12} />
                                    <span>EMIS</span>
                                  </>
                                )}
                              </button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
