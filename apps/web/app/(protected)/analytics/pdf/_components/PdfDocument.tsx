import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import React from 'react';
import { Button } from 'ui';

interface Heading {
  subjectName: string;
  subTitle: string[];
}

interface StudentMarksPDFGeneratorProps {
  headingList: Heading[];
  tableValues: string[];
}

const StudentMarksPDFGenerator: React.FC = ({
  headingList,
  tableValues,
}: StudentMarksPDFGeneratorProps) => {
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    doc.setProperties({
      title: 'Student Marks Table',
      subject: 'Academic Results',
      author: 'School Administration',
      keywords: 'student marks, academic results',
      creator: 'Student Management System',
    });

    doc.setFontSize(16);
    doc.text('Student Marks Table', 14, 10);
    const complexHeaders =
      headingList?.length > 0
        ? [
            [
              { content: '#', rowSpan: 2 },
              { content: 'Student Name', rowSpan: 2 },
              ...headingList.map((heading) => ({
                content: heading.subjectName,
                colSpan: heading.subTitle?.length || 2,
              })),
              { content: 'Total', rowSpan: 2 },
              { content: 'Rank', rowSpan: 2 },
            ],
            headingList.flatMap((heading) => heading.subTitle),
          ]
        : [];

    autoTable(doc, {
      head: complexHeaders,
      body: (tableValues as any[]) || [],
      startY: 5,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 1, lineColor: 40, lineWidth: 0.1 },
      headStyles: {
        minCellHeight: 8,
        valign: 'middle',
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 30 },
      },
      didDrawCell: (data) => {
        const doc = data.doc;
        const cell = data.cell;
        doc.setDrawColor(40);
        doc.setLineWidth(0.1);
        doc.line(cell.x, cell.y, cell.x + cell.width, cell.y);
        doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height
        );
        doc.line(cell.x, cell.y, cell.x, cell.y + cell.height);
        doc.line(
          cell.x + cell.width,
          cell.y,
          cell.x + cell.width,
          cell.y + cell.height
        );
      },
    });

    doc.save('student-marks-table.pdf');
  };

  return <Button onClick={generatePDF}>Download PDF</Button>;
};

export default StudentMarksPDFGenerator;
