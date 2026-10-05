import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

export interface ExportStaffAnalyticsParams {
  examName: string;
  className: string;
  sectionName: string;
  summary: {
    totalStudents: number;
    appeared: number;
    absent: number;
    pending: number;
    pass: number;
    fail: number;
    passPercentage: number;
    failPercentage: number;
    averageMark: number;
    highestMark: number;
    lowestMark: number;
  } | null;
  staffAnalytics: Array<{
    id: string;
    name: string;
    email?: string;
    analytics: Array<{
      section: { id: string; name: string; class?: { id: string; name: string } };
      subject: { id: string; name: string };
      totalStudents: { male: number; female: number; overall: number };
      appeared: { male: number; female: number; overall: number };
      absent: { male: number; female: number; overall: number };
      pendingMarkEntry: { male: number; female: number; overall: number };
      numberOfPassStudents: { male: number; female: number; overall: number };
      numberOfFailStudents: { male: number; female: number; overall: number };
      passPercentage: { male: number; female: number; overall: number };
      failPercentage: { male: number; female: number; overall: number };
      averageMark: { male: number; female: number; overall: number };
      highestMark: { male: number; female: number; overall: number };
      highestMarkStudentName: { male: string; female: string; overall: string };
      lowestMark: { male: number; female: number; overall: number };
      lowestMarkStudentName: { male: string; female: string; overall: string };
    }>;
    overall: {
      totalStudents: { male: number; female: number; overall: number };
      appeared: { male: number; female: number; overall: number };
      absent: { male: number; female: number; overall: number };
      pendingMarkEntry: { male: number; female: number; overall: number };
      numberOfPassStudents: { male: number; female: number; overall: number };
      numberOfFailStudents: { male: number; female: number; overall: number };
      passPercentage: { male: number; female: number; overall: number };
      failPercentage: { male: number; female: number; overall: number };
      averageMark: { male: number; female: number; overall: number };
      highestMark: { male: number; female: number; overall: number };
      lowestMark: { male: number; female: number; overall: number };
    };
  }>;
}

const num = (v: any) => (Number(v) || 0);

/**
 * Generates an executive PDF report and prompts user to save / share / download.
 */
export async function exportStaffAnalyticsToPDF(params: ExportStaffAnalyticsParams): Promise<void> {
  const { examName, className, sectionName, summary, staffAnalytics } = params;
  const timestamp = new Date().toLocaleString();

  let staffRowsHtml = '';
    (staffAnalytics || []).forEach((staff) => {
      (staff.analytics || []).forEach((sub, subIdx) => {
        const isFirst = subIdx === 0;
        const rowSpan = staff.analytics.length > 1 ? staff.analytics.length + 1 : 1;
        staffRowsHtml += `
          <tr>
            ${
              isFirst
                ? `<td rowspan="${rowSpan}" style="background-color: #F8FAFC; font-weight: 700; color: #1E293B; vertical-align: top; padding: 8px;">
                    ${staff.name || 'Staff'}
                    ${staff.email ? `<div style="font-size: 8px; color: #64748B; font-weight: normal;">${staff.email}</div>` : ''}
                  </td>`
                : ''
            }
            <td style="font-weight: 600; background-color: #FEF9C3; text-align: center;">
              <div>${sub.section?.name || ''}</div>
              <div style="color: #475569; font-size: 8.5px;">${sub.subject?.name || ''}</div>
            </td>
            <td style="text-align: center;">
              <div style="font-weight: 700;">${sub.totalStudents?.overall ?? 0}</div>
              <div style="font-size: 8px; color: #475569;">M:${sub.totalStudents?.male ?? 0} F:${sub.totalStudents?.female ?? 0}</div>
            </td>
            <td style="text-align: center;">
              <div style="font-weight: 700;">${sub.appeared?.overall ?? 0}</div>
              <div style="font-size: 8px; color: #475569;">M:${sub.appeared?.male ?? 0} F:${sub.appeared?.female ?? 0}</div>
            </td>
            <td style="text-align: center;">
              <div style="font-weight: 700; color: ${num(sub.absent?.overall) > 0 ? '#DC2626' : '#1E293B'};">${sub.absent?.overall ?? 0}</div>
              <div style="font-size: 8px; color: #475569;">M:${sub.absent?.male ?? 0} F:${sub.absent?.female ?? 0}</div>
            </td>
            <td style="text-align: center;">
              <div style="font-weight: 700;">${num(sub.averageMark?.overall).toFixed(1)}</div>
              <div style="font-size: 8px; color: #475569;">M:${num(sub.averageMark?.male).toFixed(1)} F:${num(sub.averageMark?.female).toFixed(1)}</div>
            </td>
            <td style="text-align: center;">
              <div style="font-weight: 700; color: #16A34A;">${sub.numberOfPassStudents?.overall ?? 0}</div>
              <div style="font-size: 8px; color: #15803D;">M:${sub.numberOfPassStudents?.male ?? 0} F:${sub.numberOfPassStudents?.female ?? 0}</div>
            </td>
            <td style="text-align: center;">
              <div style="font-weight: 700; color: ${num(sub.numberOfFailStudents?.overall) > 0 ? '#DC2626' : '#64748B'};">${sub.numberOfFailStudents?.overall ?? 0}</div>
              <div style="font-size: 8px; color: #B91C1C;">M:${sub.numberOfFailStudents?.male ?? 0} F:${sub.numberOfFailStudents?.female ?? 0}</div>
            </td>
            <td style="text-align: center;">
              <div style="font-weight: 700; color: #15803D;">${num(sub.passPercentage?.overall).toFixed(1)}%</div>
              <div style="font-size: 8px; color: #475569;">M:${num(sub.passPercentage?.male).toFixed(1)}% F:${num(sub.passPercentage?.female).toFixed(1)}%</div>
            </td>
            <td style="text-align: center;">
              <div style="font-weight: 700; color: #B91C1C;">${num(sub.failPercentage?.overall).toFixed(1)}%</div>
            </td>
            <td style="text-align: center; font-weight: 700; color: #1E293B;">${sub.highestMark?.overall ?? '-'}</td>
            <td style="text-align: center; font-weight: 700; color: #475569;">${sub.lowestMark?.overall ?? '-'}</td>
          </tr>
        `;
      });

      // Staff Overall Summary Row if more than 1 subject
      if (staff.analytics && staff.analytics.length > 1) {
        staffRowsHtml += `
          <tr style="background-color: #F1F5F9; font-weight: 700; border-top: 1.5px solid #CBD5E1;">
            <td style="text-align: center; color: #475569; font-size: 9px;">OVERALL</td>
            <td style="text-align: center;">${staff.overall?.totalStudents?.overall ?? 0}</td>
            <td style="text-align: center;">${staff.overall?.appeared?.overall ?? 0}</td>
            <td style="text-align: center;">${staff.overall?.absent?.overall ?? 0}</td>
            <td style="text-align: center;">${num(staff.overall?.averageMark?.overall).toFixed(1)}</td>
            <td style="text-align: center; color: #16A34A;">${staff.overall?.numberOfPassStudents?.overall ?? 0}</td>
            <td style="text-align: center; color: #DC2626;">${staff.overall?.numberOfFailStudents?.overall ?? 0}</td>
            <td style="text-align: center; color: #15803D;">${num(staff.overall?.passPercentage?.overall).toFixed(1)}%</td>
            <td style="text-align: center; color: #B91C1C;">${num(staff.overall?.failPercentage?.overall).toFixed(1)}%</td>
            <td style="text-align: center;">${staff.overall?.highestMark?.overall ?? '-'}</td>
            <td style="text-align: center;">${staff.overall?.lowestMark?.overall ?? '-'}</td>
          </tr>
        `;
      }
    });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Staff Analysis - ${examName}</title>
        <style>
          @page { size: landscape A4; margin: 10mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 12px;
            color: #0F172A;
            font-size: 9px;
          }
          .header-box {
            border-bottom: 2px solid #6559FC;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .brand-title {
            font-size: 18px;
            font-weight: 800;
            color: #6559FC;
            margin: 0 0 4px 0;
          }
          .report-title {
            font-size: 13px;
            font-weight: 700;
            color: #1E293B;
            margin: 0;
          }
          .meta-strip {
            display: flex;
            gap: 16px;
            margin-top: 6px;
            font-size: 9.5px;
            color: #475569;
          }
          .meta-item strong { color: #0F172A; }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 8px;
            margin-bottom: 14px;
          }
          .summary-card {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            padding: 6px 8px;
            text-align: center;
          }
          .summary-val {
            font-size: 14px;
            font-weight: 800;
            color: #0F172A;
          }
          .summary-label {
            font-size: 8px;
            font-weight: 600;
            color: #64748B;
            text-transform: uppercase;
            margin-top: 2px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8.5px;
          }
          th {
            background-color: #6559FC;
            color: #FFFFFF;
            font-weight: 700;
            padding: 6px 4px;
            text-align: center;
            border: 1px solid #E2E8F0;
          }
          td {
            padding: 5px 4px;
            border: 1px solid #E2E8F0;
          }
          .footer {
            margin-top: 14px;
            font-size: 8px;
            color: #94A3B8;
            text-align: right;
          }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div class="brand-title">Rexdeia Academic System</div>
          <div class="report-title">Staff-Wise Subject Mark Analysis & Performance Report</div>
          <div class="meta-strip">
            <span class="meta-item">Exam: <strong>${examName}</strong></span>
            <span class="meta-item">Class: <strong>${className}</strong></span>
            <span class="meta-item">Section: <strong>${sectionName}</strong></span>
            <span class="meta-item">Generated: <strong>${timestamp}</strong></span>
          </div>
        </div>

        ${
          summary
            ? `
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-val">${summary.totalStudents}</div>
              <div class="summary-label">Total Students</div>
            </div>
            <div class="summary-card">
              <div class="summary-val">${summary.appeared} (${summary.absent} Abs)</div>
              <div class="summary-label">Appeared / Absent</div>
            </div>
            <div class="summary-card">
              <div class="summary-val" style="color: #16A34A;">${num(summary.passPercentage).toFixed(1)}%</div>
              <div class="summary-label">Pass Percentage</div>
            </div>
            <div class="summary-card">
              <div class="summary-val" style="color: #DC2626;">${num(summary.failPercentage).toFixed(1)}%</div>
              <div class="summary-label">Fail Percentage</div>
            </div>
            <div class="summary-card">
              <div class="summary-val">${num(summary.averageMark).toFixed(1)}</div>
              <div class="summary-label">Average Mark</div>
            </div>
            <div class="summary-card">
              <div class="summary-val">${summary.highestMark ?? '-'} / ${summary.lowestMark ?? '-'}</div>
              <div class="summary-label">High / Low Score</div>
            </div>
          </div>
        `
            : ''
        }

        <table>
          <thead>
            <tr>
              <th style="width: 14%;">Staff Name</th>
              <th style="width: 10%;">Sec / Sub</th>
              <th style="width: 8%;">Total</th>
              <th style="width: 8%;">Appeared</th>
              <th style="width: 8%;">Absent</th>
              <th style="width: 8%;">Average</th>
              <th style="width: 8%;">Pass</th>
              <th style="width: 8%;">Fail</th>
              <th style="width: 9%;">Pass %</th>
              <th style="width: 7%;">Fail %</th>
              <th style="width: 6%;">High</th>
              <th style="width: 6%;">Low</th>
            </tr>
          </thead>
          <tbody>
            ${staffRowsHtml}
          </tbody>
        </table>

        <div class="footer">
          Confidential document generated automatically by Rexdeia • ${timestamp}
        </div>
      </body>
    </html>
  `;

  if (Platform.OS === 'web') {
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        return;
      }
    } catch {}
    const sanitized = `${examName}_${className}_${sectionName}_Staff_Analytics`.replace(/[^a-zA-Z0-9_-]/g, '_');
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${sanitized}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  try {
    const { uri } = await Print.printToFileAsync({ html, margins: { left: 10, top: 10, right: 10, bottom: 10 } });
    const sanitized = `${examName}_${className}_${sectionName}_Staff_Analytics`.replace(/[^a-zA-Z0-9_-]/g, '_');
    const baseDir = FileSystem.cacheDirectory || FileSystem.documentDirectory;
    let targetPdfUri = uri;
    if (baseDir) {
      const safeBaseDir = baseDir.endsWith('/') ? baseDir : `${baseDir}/`;
      targetPdfUri = `${safeBaseDir}${sanitized}.pdf`;
      try {
        await FileSystem.copyAsync({ from: uri, to: targetPdfUri });
      } catch {
        targetPdfUri = uri;
      }
    }

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(targetPdfUri, {
        UTI: 'com.adobe.pdf',
        mimeType: 'application/pdf',
        dialogTitle: `Download ${examName} Staff Analytics PDF`,
      });
    } else {
      Alert.alert('PDF Ready', `Report generated at: ${targetPdfUri}`);
    }
  } catch (err: any) {
    Alert.alert('Export Failed', err?.message || 'Could not generate PDF.');
  }
}

/**
 * Generates an Excel-compatible CSV spreadsheet and triggers download/share.
 */
export async function exportStaffAnalyticsToExcel(params: ExportStaffAnalyticsParams): Promise<void> {
  const { examName, className, sectionName, summary, staffAnalytics } = params;
  const timestamp = new Date().toLocaleString();

  const lines: string[] = [];

  // Helper: CSV cell escape
  const esc = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Header Title
  lines.push([esc('Rexdeia Academic System - Staff-Wise Subject Mark Analysis')].join(','));
  lines.push([esc('Exam'), esc(examName), esc('Class'), esc(className), esc('Section'), esc(sectionName), esc('Generated On'), esc(timestamp)].join(','));
  lines.push('');

  // Summary row if present
  if (summary) {
    lines.push([esc('SUMMARY STATISTICS')].join(','));
    lines.push([
      esc('Total Students'),
      esc(summary.totalStudents),
      esc('Appeared'),
      esc(summary.appeared),
      esc('Absent'),
      esc(summary.absent),
      esc('Pending Marks'),
      esc(summary.pending),
      esc('Pass Count'),
      esc(summary.pass),
      esc('Fail Count'),
      esc(summary.fail),
      esc('Pass %'),
      esc(`${num(summary.passPercentage).toFixed(2)}%`),
      esc('Fail %'),
      esc(`${num(summary.failPercentage).toFixed(2)}%`),
      esc('Average Mark'),
      esc(num(summary.averageMark).toFixed(2)),
      esc('Highest'),
      esc(summary.highestMark ?? ''),
      esc('Lowest'),
      esc(summary.lowestMark ?? ''),
    ].join(','));
    lines.push('');
  }

  // Multi-tier Table Headers
  lines.push([
    esc('Staff Name'),
    esc('Section'),
    esc('Subject'),
    esc('Total Count'),
    '',
    '',
    esc('Pending Entry'),
    '',
    '',
    esc('Appeared'),
    '',
    '',
    esc('Absent'),
    '',
    '',
    esc('Average Mark'),
    '',
    '',
    esc('No. of Pass'),
    '',
    '',
    esc('No. of Failures'),
    '',
    '',
    esc('Pass %'),
    '',
    '',
    esc('Failure %'),
    '',
    '',
    esc('Highest Mark'),
    '',
    '',
    esc('Lowest Mark'),
    '',
    '',
  ].join(','));

  lines.push([
    '',
    '',
    '',
    esc('Overall'), esc('Male'), esc('Female'),
    esc('Overall'), esc('Male'), esc('Female'),
    esc('Overall'), esc('Male'), esc('Female'),
    esc('Overall'), esc('Male'), esc('Female'),
    esc('Overall'), esc('Male'), esc('Female'),
    esc('Overall'), esc('Male'), esc('Female'),
    esc('Overall'), esc('Male'), esc('Female'),
    esc('Overall'), esc('Male'), esc('Female'),
    esc('Overall'), esc('Male'), esc('Female'),
    esc('Overall'), esc('Male'), esc('Female'),
    esc('Overall'), esc('Male'), esc('Female'),
  ].join(','));

  staffAnalytics.forEach((staff) => {
    staff.analytics.forEach((sub) => {
      lines.push([
        esc(staff.name),
        esc(sub.section?.name || ''),
        esc(sub.subject?.name || ''),
        esc(sub.totalStudents?.overall ?? 0), esc(sub.totalStudents?.male ?? 0), esc(sub.totalStudents?.female ?? 0),
        esc(sub.pendingMarkEntry?.overall ?? 0), esc(sub.pendingMarkEntry?.male ?? 0), esc(sub.pendingMarkEntry?.female ?? 0),
        esc(sub.appeared?.overall ?? 0), esc(sub.appeared?.male ?? 0), esc(sub.appeared?.female ?? 0),
        esc(sub.absent?.overall ?? 0), esc(sub.absent?.male ?? 0), esc(sub.absent?.female ?? 0),
        esc(num(sub.averageMark?.overall).toFixed(2)), esc(num(sub.averageMark?.male).toFixed(2)), esc(num(sub.averageMark?.female).toFixed(2)),
        esc(sub.numberOfPassStudents?.overall ?? 0), esc(sub.numberOfPassStudents?.male ?? 0), esc(sub.numberOfPassStudents?.female ?? 0),
        esc(sub.numberOfFailStudents?.overall ?? 0), esc(sub.numberOfFailStudents?.male ?? 0), esc(sub.numberOfFailStudents?.female ?? 0),
        esc(`${num(sub.passPercentage?.overall).toFixed(2)}%`), esc(`${num(sub.passPercentage?.male).toFixed(2)}%`), esc(`${num(sub.passPercentage?.female).toFixed(2)}%`),
        esc(`${num(sub.failPercentage?.overall).toFixed(2)}%`), esc(`${num(sub.failPercentage?.male).toFixed(2)}%`), esc(`${num(sub.failPercentage?.female).toFixed(2)}%`),
        esc(sub.highestMark?.overall ?? '-'), esc(sub.highestMark?.male ?? '-'), esc(sub.highestMark?.female ?? '-'),
        esc(sub.lowestMark?.overall ?? '-'), esc(sub.lowestMark?.male ?? '-'), esc(sub.lowestMark?.female ?? '-'),
      ].join(','));
    });

    // Staff Overall Summary Row
    if (staff.analytics && staff.analytics.length > 1) {
      lines.push([
        esc(`${staff.name || 'Staff'} - OVERALL`),
        esc('All Sections'),
        esc('All Subjects'),
        esc(staff.overall?.totalStudents?.overall ?? 0), esc(staff.overall?.totalStudents?.male ?? 0), esc(staff.overall?.totalStudents?.female ?? 0),
        esc(staff.overall?.pendingMarkEntry?.overall ?? 0), esc(staff.overall?.pendingMarkEntry?.male ?? 0), esc(staff.overall?.pendingMarkEntry?.female ?? 0),
        esc(staff.overall?.appeared?.overall ?? 0), esc(staff.overall?.appeared?.male ?? 0), esc(staff.overall?.appeared?.female ?? 0),
        esc(staff.overall?.absent?.overall ?? 0), esc(staff.overall?.absent?.male ?? 0), esc(staff.overall?.absent?.female ?? 0),
        esc(num(staff.overall?.averageMark?.overall).toFixed(2)), esc(num(staff.overall?.averageMark?.male).toFixed(2)), esc(num(staff.overall?.averageMark?.female).toFixed(2)),
        esc(staff.overall?.numberOfPassStudents?.overall ?? 0), esc(staff.overall?.numberOfPassStudents?.male ?? 0), esc(staff.overall?.numberOfPassStudents?.female ?? 0),
        esc(staff.overall?.numberOfFailStudents?.overall ?? 0), esc(staff.overall?.numberOfFailStudents?.male ?? 0), esc(staff.overall?.numberOfFailStudents?.female ?? 0),
        esc(`${num(staff.overall?.passPercentage?.overall).toFixed(2)}%`), esc(`${num(staff.overall?.passPercentage?.male).toFixed(2)}%`), esc(`${num(staff.overall?.passPercentage?.female).toFixed(2)}%`),
        esc(`${num(staff.overall?.failPercentage?.overall).toFixed(2)}%`), esc(`${num(staff.overall?.failPercentage?.male).toFixed(2)}%`), esc(`${num(staff.overall?.failPercentage?.female).toFixed(2)}%`),
        esc(staff.overall?.highestMark?.overall ?? '-'), esc(staff.overall?.highestMark?.male ?? '-'), esc(staff.overall?.highestMark?.female ?? '-'),
        esc(staff.overall?.lowestMark?.overall ?? '-'), esc(staff.overall?.lowestMark?.male ?? '-'), esc(staff.overall?.lowestMark?.female ?? '-'),
      ].join(','));
    }
  });

  // UTF-8 BOM ensures Excel displays UTF-8 strings accurately
  const csvContent = '\uFEFF' + lines.join('\r\n');
  const safeName = `${examName}_Staff_Analysis`.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${safeName}.csv`;

  if (Platform.OS === 'web') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  try {
    const baseDir = FileSystem.cacheDirectory || FileSystem.documentDirectory;
    if (!baseDir) {
      throw new Error('Local file storage is unavailable on this device.');
    }
    const safeBaseDir = baseDir.endsWith('/') ? baseDir : `${baseDir}/`;
    const fileUri = `${safeBaseDir}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: `Download / Share ${filename}`,
        UTI: 'public.comma-separated-values-text',
      });
    } else {
      Alert.alert('Excel Sheet Saved', `File saved to: ${fileUri}`);
    }
  } catch (err: any) {
    Alert.alert('Export Failed', err?.message || 'Could not export Excel sheet.');
  }
}

export interface StudentSubjectPartition {
  formatId: string;
  formatName: string;
  mark: number | null;
  rawMark?: number | null;
  isAbsent: boolean;
  hasEntry: boolean;
}

export interface StudentSubjectItem {
  subjectId: string;
  subjectName: string;
  marks: number;
  subjectTotalMark?: number;
  totalMarks: number;
  minMark: number;
  isPass: boolean;
  isAbsent: boolean;
  hasEntry: boolean;
  partitions?: StudentSubjectPartition[];
  grade?: string;
  centum?: boolean;
}

export interface StudentMarkItem {
  id: string;
  name: string;
  gender: 'male' | 'female';
  className: string;
  sectionName: string;
  subjects: StudentSubjectItem[];
  totalMark: number;
  maxTotalMark: number;
  percentage: number;
  isPass: boolean;
  isAbsent: boolean;
  hasEntry: boolean;
  rank: number | null;
  grade?: string | null;
  centumCount?: number;
}

export interface ExportStudentMarkListParams {
  examName: string;
  className: string;
  sectionName: string;
  students: StudentMarkItem[];
}

/**
 * Export Student-Wise Mark List to PDF
 */
export async function exportStudentMarkListToPDF(params: ExportStudentMarkListParams): Promise<void> {
  const { examName = 'Exam', className = 'Class', sectionName = 'Section', students = [] } = params;

  // Extract distinct subject names in order
  const subjectList: string[] = [];
  (students || []).forEach((s) => {
    (s?.subjects || []).forEach((sub) => {
      if (sub?.subjectName && !subjectList.includes(sub.subjectName)) {
        subjectList.push(sub.subjectName);
      }
    });
  });

  const total = (students || []).length;
  const passed = (students || []).filter((s) => s?.isPass).length;
  const failed = (students || []).filter((s) => !s?.isPass && !s?.isAbsent).length;
  const absent = (students || []).filter((s) => s?.isAbsent).length;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';

  const rowsHtml = (students || [])
    .map((s, idx) => {
      const subjectCells = subjectList
        .map((subName) => {
          const sub = (s?.subjects || []).find((item) => item?.subjectName === subName);
          if (!sub || !sub.hasEntry) return '<td style="text-align: center; color: #94a3b8;">-</td>';
          if (sub.isAbsent) return '<td style="text-align: center; color: #dc2626; font-weight: bold;">A</td>';
          const partsStr = sub.partitions && sub.partitions.length > 0
            ? sub.partitions.map((p) => (p.isAbsent ? 'A' : (p.mark !== null && p.mark !== undefined) ? p.mark : '-')).join(' ') + ' '
            : '';
          const totStr = `${sub.subjectTotalMark ?? sub.marks ?? '-'}${sub.grade ? `(${sub.grade})` : ''}`;
          return `<td style="text-align: center; color: ${sub.isPass ? '#16a34a' : '#dc2626'}; font-weight: bold;">${partsStr}${totStr}</td>`;
        })
        .join('');

      const rankStr = s?.rank ? `${s.rank} (${s.grade || '-'})` : `- (${s.grade || '-'})`;
      const percentageStr = Number(s?.percentage ?? 0).toFixed(2);

      return `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="text-align: center; color: #64748b; font-size: 11px;">${idx + 1}</td>
          <td style="font-weight: 600; color: #0f172a;">${s?.name || 'Unnamed'}</td>
          <td style="text-align: center; color: #475569; font-size: 11px;">${s?.sectionName || sectionName || '-'}</td>
          ${subjectCells}
          <td style="text-align: center; font-weight: 700; color: ${s?.isPass ? '#16a34a' : '#dc2626'};">
            ${s?.isAbsent ? '(A)' : s?.isPass ? '(P)' : '(F)'} ${s?.totalMark ?? 0} (${percentageStr}%)
          </td>
          <td style="text-align: center; font-weight: 700; color: #3730a3;">
            ${rankStr}<br/><span style="font-size: 9px; color: #64748b; font-weight: normal;">Centum: ${s?.centumCount ?? 0}</span>
          </td>
        </tr>
      `;
    })
    .join('');

  const subjectHeaderCells = subjectList
    .map((name) => `<th style="text-align: center; font-size: 11px; padding: 8px;">${name}</th>`)
    .join('');

  const sanitized = `${examName}_${className}_${sectionName}_MarkList`.replace(/[^a-zA-Z0-9_-]/g, '_');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Student Mark List - ${examName}</title>
        <style>
          @page { size: landscape A4; margin: 10mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; color: #0f172a; font-size: 11px; }
          .header { border-bottom: 2px solid #6559fc; padding-bottom: 12px; margin-bottom: 16px; }
          .title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0; }
          .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
          .kpi-row { display: flex; gap: 12px; margin-bottom: 20px; }
          .kpi { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; flex: 1; }
          .kpi-val { font-size: 16px; font-weight: 800; color: #0f172a; }
          .kpi-lbl { font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #ede9fe; color: #3730a3; font-weight: 700; padding: 8px 6px; text-align: left; border: 1px solid #ddd6fe; }
          td { padding: 8px 6px; border: 1px solid #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">Student-Wise Mark List</h1>
          <div class="subtitle">${examName} • ${className} • ${sectionName}</div>
        </div>
        <div class="kpi-row">
          <div class="kpi"><div class="kpi-val">${total}</div><div class="kpi-lbl">Total Students</div></div>
          <div class="kpi"><div class="kpi-val" style="color: #16a34a;">${passed}</div><div class="kpi-lbl">Passed</div></div>
          <div class="kpi"><div class="kpi-val" style="color: #dc2626;">${failed}</div><div class="kpi-lbl">Failed</div></div>
          <div class="kpi"><div class="kpi-val" style="color: #64748b;">${absent}</div><div class="kpi-lbl">Absent</div></div>
          <div class="kpi"><div class="kpi-val" style="color: #6559fc;">${passRate}%</div><div class="kpi-lbl">Pass Rate</div></div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 25px; text-align: center;">#</th>
              <th>Student Name</th>
              <th style="text-align: center;">Sec</th>
              ${subjectHeaderCells}
              <th style="text-align: center;">Total</th>
              <th style="text-align: center;">Rank</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
    </html>
  `;

  if (Platform.OS === 'web') {
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        return;
      }
    } catch {}
    // Fallback: download HTML directly if window.open was blocked
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${sanitized}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  try {
    const { uri } = await Print.printToFileAsync({
      html,
      margins: { left: 10, top: 10, right: 10, bottom: 10 },
    });

    const baseDir = FileSystem.cacheDirectory || FileSystem.documentDirectory;
    let targetPdfUri = uri;
    if (baseDir) {
      const safeBaseDir = baseDir.endsWith('/') ? baseDir : `${baseDir}/`;
      targetPdfUri = `${safeBaseDir}${sanitized}.pdf`;
      try {
        await FileSystem.copyAsync({ from: uri, to: targetPdfUri });
      } catch {
        targetPdfUri = uri;
      }
    }

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(targetPdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: `Student Mark List - ${examName}`,
        UTI: 'com.adobe.pdf',
      });
    } else {
      Alert.alert('PDF Created', `File saved to: ${targetPdfUri}`);
    }
  } catch (err: any) {
    Alert.alert('PDF Export Failed', err?.message || 'Could not generate PDF report.');
  }
}

/**
 * Export Student-Wise Mark List to Excel (.csv)
 */
export async function exportStudentMarkListToExcel(params: ExportStudentMarkListParams): Promise<void> {
  const { examName = 'Exam', className = 'Class', sectionName = 'Section', students = [] } = params;

  // Extract distinct subjects
  const subjectList: string[] = [];
  (students || []).forEach((s) => {
    (s?.subjects || []).forEach((sub) => {
      if (sub?.subjectName && !subjectList.includes(sub.subjectName)) {
        subjectList.push(sub.subjectName);
      }
    });
  });

  const headers = [
    '#',
    'Student Name',
    'Gender',
    'Class',
    'Section',
    ...subjectList,
    'Total Marks',
    'Max Marks',
    'Percentage (%)',
    'Status',
    'Rank',
    'Centum',
  ];

  const esc = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const lines: string[] = [];
  lines.push(`"Exam: ${String(examName || '').replace(/"/g, '""')}"`);
  lines.push(`"Class: ${String(className || '').replace(/"/g, '""')}"`);
  lines.push(`"Section: ${String(sectionName || '').replace(/"/g, '""')}"`);
  lines.push('');
  lines.push(headers.map((h) => esc(h)).join(','));

  (students || []).forEach((s, idx) => {
    const subjectValues = subjectList.map((subName) => {
      const sub = (s?.subjects || []).find((item) => item?.subjectName === subName);
      if (!sub || !sub.hasEntry) return '""';
      if (sub.isAbsent) return '"A"';
      const partsStr = sub.partitions && sub.partitions.length > 0
        ? sub.partitions.map((p) => (p.isAbsent ? 'A' : (p.mark !== null && p.mark !== undefined) ? p.mark : '-')).join(' ') + ' '
        : '';
      const totStr = `${sub.subjectTotalMark ?? sub.marks ?? ''}${sub.grade ? `(${sub.grade})` : ''}`;
      return esc(`${partsStr}${totStr}`);
    });

    const statusStr = s?.isAbsent ? 'ABSENT' : s?.isPass ? 'PASS' : 'FAIL';
    const rankStr = s?.rank ? `${s.rank} (${s.grade || '-'})` : `- (${s.grade || '-'})`;
    const percentageStr = `${Number(s?.percentage ?? 0).toFixed(2)}%`;

    const row = [
      esc(idx + 1),
      esc(s?.name || 'Unnamed'),
      esc(s?.gender || '-'),
      esc(s?.className || className || '-'),
      esc(s?.sectionName || sectionName || '-'),
      ...subjectValues,
      esc(s?.totalMark ?? 0),
      esc(s?.maxTotalMark ?? 0),
      esc(percentageStr),
      esc(statusStr),
      esc(rankStr),
      esc(s?.centumCount ?? 0),
    ];
    lines.push(row.join(','));
  });

  const csvContent = '\uFEFF' + lines.join('\r\n');
  const sanitized = `${examName || 'Exam'}_${className || 'Class'}_${sectionName || 'Section'}_MarkList`.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${sanitized}.csv`;

  if (Platform.OS === 'web') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  try {
    const baseDir = FileSystem.cacheDirectory || FileSystem.documentDirectory;
    if (!baseDir) {
      throw new Error('Local file storage is unavailable on this device.');
    }
    const safeBaseDir = baseDir.endsWith('/') ? baseDir : `${baseDir}/`;
    const fileUri = `${safeBaseDir}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: `Download / Share ${filename}`,
        UTI: 'public.comma-separated-values-text',
      });
    } else {
      Alert.alert('Excel Sheet Saved', `File saved to: ${fileUri}`);
    }
  } catch (err: any) {
    Alert.alert('Export Failed', err?.message || 'Could not export Excel sheet.');
  }
}
