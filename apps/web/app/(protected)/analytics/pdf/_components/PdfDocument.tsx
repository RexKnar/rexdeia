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

const StudentMarksPDFGenerator: React.FC<StudentMarksPDFGeneratorProps> = ({
  headingList,
  tableValues,
}) => {
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

    // Get page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header function
    const addHeader = (doc: jsPDF) => {
      // Add school logo (if needed)
      // doc.addImage(logoData, 'PNG', 14, 10, 20, 20);

      // School name and address
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('AMMAHSS', pageWidth / 2, 15, { align: 'center' });

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Thiruvatar', pageWidth / 2, 22, { align: 'center' });

      // Title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Student Marks Table', pageWidth / 2, 30, { align: 'center' });

      // Add horizontal line
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(10, 35, pageWidth - 10, 35);
    };

    // Footer function
    const addFooter = (doc: jsPDF) => {
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Add horizontal line
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);

        // Add page number
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Page ${i} of ${totalPages}`,
          pageWidth - 20,
          pageHeight - 10,
          { align: 'right' }
        );

        // Add timestamp
        const timestamp = new Date().toLocaleString();
        doc.text(`Generated on: ${timestamp}`, 14, pageHeight - 10);
      }
    };

    // Add initial header
    addHeader(doc);

    doc.setFontSize(16);
    doc.text('Student Marks Table', 14, 10);
    const complexHeaders =
      headingList?.length > 0
        ? [
            [
              { content: '#', rowSpan: 2 },
              { content: 'Student Name', rowSpan: 2 },
              { content: 'Section', rowSpan: 2 },
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

    // Generate the table
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      didDrawPage: () => {
        // Add header and footer on each new page
        addHeader(doc);
      },
    });

    addFooter(doc);
    doc.save('student-marks-table.pdf');
  };

  return <Button onClick={generatePDF}>Download PDF</Button>;
};

export default StudentMarksPDFGenerator;
