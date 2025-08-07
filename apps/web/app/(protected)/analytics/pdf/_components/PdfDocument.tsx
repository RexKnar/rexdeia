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
  examDetails: any;
  classDetails: any;
  sectionDetails: any;
}

const StudentMarksPDFGenerator: React.FC<StudentMarksPDFGeneratorProps> = ({
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

    let totalCell = 5;
    let complexHeaders =
      headingList?.length > 0
        ? [
            [
              { content: '#', rowSpan: 2 },
              { content: 'Student Name', rowSpan: 2 },
              { content: 'Section', rowSpan: 2 },
              ...headingList.map((heading) => {
                totalCell += heading.subTitle?.length || 2;
                return {
                  content: heading.subjectName,
                  colSpan: heading.subTitle?.length || 2,
                };
              }),
              { content: 'Total', rowSpan: 2 },
              { content: 'Rank', rowSpan: 2 },
            ],
            headingList.flatMap((heading) => heading.subTitle),
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
          colSpan: 4,
        },
        {
          content: examDetails?.name,
          colSpan: 4,
        },
        {
          content: 'Class  ',
          colSpan: headingList.length > 5 ? 2 : 1,
        },
        {
          content: classDetails?.name || '',
          colSpan: 1,
        },

        {
          content: `Section  `,
          colSpan: headingList.length > 5 ? 2 : 1,
        },
        {
          content: sectionDetails?.name || 'All',
          colSpan: 1,
        },
        {
          content: '',
          colSpan: totalCell - 12,
        },
      ],
      ...complexHeaders,
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
      columnStyles: {
        0: { cellWidth: 6 },
        1: { cellWidth: 45 },
        2: { cellWidth: 7 },
        [totalCell - 2]: { cellWidth: 15 }, // Total column
        [totalCell - 1]: { cellWidth: 11 },
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

export default StudentMarksPDFGenerator;
