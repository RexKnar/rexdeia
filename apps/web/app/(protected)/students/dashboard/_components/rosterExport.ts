import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils as XLSX_utils, writeFile as XLSX_writeFile } from 'xlsx';

import type { RosterRow } from '../../../../api/student/service';
import { titilize } from 'utils';

const HEADERS = [
  'S.No',
  'Name',
  'Class',
  'Section',
  'Medium',
  'Gender',
  'Roll No',
  'Status',
];

function toRow(student: RosterRow, index: number) {
  return [
    index + 1,
    student.name,
    student.className,
    student.sectionName,
    student.mediumName,
    titilize(student.gender),
    student.rollNumber ?? '-',
    student.status,
  ];
}

function fileSafe(title: string) {
  return title.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');
}

export function exportRosterToExcel(rows: RosterRow[], title: string) {
  const ws = XLSX_utils.aoa_to_sheet([
    [title],
    [`Total: ${rows.length}`],
    [],
    HEADERS,
    ...rows.map((student, index) => toRow(student, index)),
  ]);

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: HEADERS.length - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: HEADERS.length - 1 } },
  ];
  ws['!cols'] = [
    { wch: 6 },
    { wch: 28 },
    { wch: 12 },
    { wch: 10 },
    { wch: 12 },
    { wch: 10 },
    { wch: 8 },
    { wch: 26 },
  ];

  const wb = XLSX_utils.book_new();
  XLSX_utils.book_append_sheet(wb, ws, 'Students');
  XLSX_writeFile(wb, `${fileSafe(title)}.xlsx`);
}

export function exportRosterToPdf(rows: RosterRow[], title: string) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  doc.setProperties({
    title,
    creator: 'Student Management System',
  });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 16);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total: ${rows.length}`, 14, 22);

  autoTable(doc, {
    head: [HEADERS],
    body: rows.map((student, index) => toRow(student, index)),
    startY: 28,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [79, 70, 229], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    didDrawPage: () => {
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageCount = (doc as any).internal.getNumberOfPages();
      const current = (doc as any).internal.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        14,
        pageHeight - 8
      );
      doc.text(
        `Page ${current} of ${pageCount}`,
        pageWidth - 30,
        pageHeight - 8
      );
    },
  });

  doc.save(`${fileSafe(title)}.pdf`);
}
