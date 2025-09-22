import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import React from 'react';
import { Button } from 'ui';

interface Heading {
  subjectName: string;
  subTitle: string[];
}

interface OverallForStaffPDFGeneratorProps {
  headingList: Heading[];
  tableValues: string[];
  examDetails: any;
  classDetails: any;
  sectionDetails: any;
}

const OverallForStaffPDFGenerator: React.FC<
  OverallForStaffPDFGeneratorProps
> = ({
  headingList,
  tableValues,
  examDetails,
  classDetails,
  sectionDetails,
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
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const addFooter = (doc: jsPDF) => {
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        doc.setDrawColor(0);
        doc.setLineWidth(0.3);
        doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Page ${i}`, pageWidth - 20, pageHeight - 10, {
          align: 'right',
        });

        const timestamp = new Date().toLocaleString();
        doc.text(`Generated on: ${timestamp}`, 14, pageHeight - 10);
      }
    };

    let totalCell = 13;
    let complexHeaders: any =
      headingList?.length > 0
        ? [
            [
              { content: 'Subject Name' },
              { content: 'Total' },
              { content: 'Appeared' },
              { content: 'Absent' },
              { content: 'No. of Pass' },
              { content: 'No. of Failures(App)' },
              { content: 'Pass%(App)' },
              { content: 'Average(App)' },
              { content: 'Highest' },
              { content: 'Lowest' },
              { content: 'Centum' },
            ],
          ]
        : [];

    complexHeaders = [
      [
        {
          content: 'ARUNACHALAM HIGHER SECONDARY SCHOOL',
          colSpan: totalCell,
        },
      ],
      [
        {
          content: 'Mark List',
        },
        {
          content: examDetails?.name,
        },
        {
          content: 'Class  ',
        },
        {
          content: classDetails?.name || '',
        },

        {
          content: `Section  `,
        },
        {
          content: sectionDetails?.name || 'All',
        },
        {
          content: '',
        },
      ],
      [
        { content: 'Subject Name' },
        { content: 'Total' },
        { content: 'Appeared' },
        { content: 'Absent' },
        { content: 'No. of Pass' },
        { content: 'No. of Failures(App)' },
        { content: 'Pass%(App)' },
        { content: 'Average(App)' },
        { content: 'Highest' },
        { content: 'Lowest' },
        { content: 'Centum' },
      ],
    ];
    autoTable(doc, {
      head: complexHeaders,
      body: (tableValues as any[]) || [],
      startY: 5,
      theme: 'grid',
      showHead: 'everyPage',
      styles: { fontSize: 9, cellPadding: 1, lineColor: 40, lineWidth: 0.1 },
      headStyles: {
        minCellHeight: 8,
        valign: 'middle',
        halign: 'center',
        cellWidth: 'auto',
      },
      didParseCell: function (data) {
        if (data.section === 'head') {
          if (data.row.index === 0) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fontSize = 14;
            data.cell.styles.fillColor = undefined;
            data.cell.styles.textColor = '#000000';
          }

          if (data.row.index === 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = undefined;
            data.cell.styles.textColor = '#000000';
          }
        }
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
      didDrawPage: () => {
        addFooter(doc);
      },
    });

    doc.save('student-marks-table.pdf');
  };

  return <Button onClick={generatePDF}>Download PDF</Button>;
};

export default OverallForStaffPDFGenerator;
