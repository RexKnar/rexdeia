import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AttendanceReportRow } from 'lib/domain/timetable';
import { utils as XLSX_utils, writeFile as XLSX_writeFile } from 'xlsx';

const HEADERS = [
  'S.No',
  'Roll',
  'Student',
  'Present',
  'Absent',
  'Leave',
  'Total',
  '%',
];

function toRow(r: AttendanceReportRow, i: number) {
  return [
    i + 1,
    r.rollNumber ?? '-',
    r.name,
    r.present,
    r.absent,
    r.leave,
    r.total,
    `${r.percentage}%`,
  ];
}

function fileSafe(title: string) {
  return title.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');
}

export function exportAttendanceExcel(
  rows: AttendanceReportRow[],
  title: string
) {
  const ws = XLSX_utils.aoa_to_sheet([
    [title],
    [],
    HEADERS,
    ...rows.map((r, i) => toRow(r, i)),
  ]);
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: HEADERS.length - 1 } }];
  ws['!cols'] = [
    { wch: 6 },
    { wch: 8 },
    { wch: 28 },
    { wch: 9 },
    { wch: 9 },
    { wch: 9 },
    { wch: 9 },
    { wch: 8 },
  ];
  const wb = XLSX_utils.book_new();
  XLSX_utils.book_append_sheet(wb, ws, 'Attendance');
  XLSX_writeFile(wb, `${fileSafe(title)}.xlsx`);
}

export function exportAttendancePdf(
  rows: AttendanceReportRow[],
  title: string
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 16);

  autoTable(doc, {
    head: [HEADERS],
    body: rows.map((r, i) => toRow(r, i)),
    startY: 22,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [79, 70, 229], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(`${fileSafe(title)}.pdf`);
}
