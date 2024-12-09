import { utils as XLSX_utils, writeFile as XLSX_writeFile } from 'xlsx';

export function downloadSubjectWiseOverallXLSX(
  subjectList: any[],
  analytics: any,
  examDetails: { name: any },
  classDetails: { name: any },
  overallStats: any,
  sectionDetails: { name: any }
) {
  const ws = XLSX_utils.aoa_to_sheet([
    ['ARUNACHALAM HIGHER SECONDARY SCHOOL'],
    ['Overall Subject-wise Analysis'],
    [
      'Exam',
      examDetails?.name,
      'Class  ',
      classDetails.name || '',
      'Section  ',
      sectionDetails?.name || 'All',

      `Overall Avg.`,
      ` ${overallStats.avgMark?.toFixed(2)} `,
      'Overall Pass Count',
      ` ${overallStats.passCount} `,
      'Overall Fail Count',
      ` ${overallStats.failCount}`,
      'Overall Pass Percentage',
      ` ${overallStats.passPercentage?.toFixed(2)} %`,
      'Overall Fail Percentage',
      ` ${overallStats.failPercentage?.toFixed(2)}%`,
      'Overall Highest Mark',
      ` ${overallStats.highestMark} `,
      'Overall Lowest Mark',
      ` ${overallStats.lowestMark}`,
    ],
    [
      'Subject',
      'Total Count',
      null,
      null,
      'Pending Entry',
      null,
      null,
      'Appeared',
      null,
      null,
      'Absent',
      null,
      null,
      'Average',
      null,
      null,
      'No. of Pass',
      null,
      null,
      'No. of Failures',
      null,
      null,
      'Pass %',
      null,
      null,
      'Failure %',
      null,
      null,
      'Highest',
      null,
      null,
      'Lowest',
      null,
      null,
      'Centum',
      null,
      null,
    ],
    [
      '',
      'Overall',
      'M',
      'F',
      'Overall',
      'M',
      'F',
      'Overall',
      'M',
      'F',
      'Overall',
      'M',
      'F',
      'Overall',
      'M',
      'F',
      'Overall',
      'M',
      'F',
      'Overall',
      'M',
      'F',
      'Overall',
      'M',
      'F',
      'Overall',
      'M',
      'F',
      'Overall',
      'M',
      'F',
      'Overall',
      'M',
      'F',
      'Overall',
      'M',
      'F',
    ],
  ]);

  subjectList.map((subject: any) => {
    const row = analytics.get(subject.id);

    XLSX_utils.sheet_add_aoa(
      ws,
      [
        [
          subject?.subject?.name || subject?.name,
          `${row?.totalStudents.overall}`,
          ` ${row.totalStudents.male} `,
          ` ${row.totalStudents.female}`,
          `${row.markEntry.overall} `,
          ` ${row.markEntry.male} `,
          ` ${row.markEntry.female}`,
          `${row.attendance.overall} `,
          ` ${row.attendance.male} `,
          ` ${row.attendance.female}`,
          `${row.absent.overall} `,
          ` ${row.absent.male} `,
          ` ${row.absent.female}`,
          `${((row.averageMark.male + row.averageMark.female) / 2).toFixed(2)} `,
          ` ${row.averageMark.male.toFixed(2)} `,
          ` ${row.averageMark.female.toFixed(2)}`,
          `${row.numberOfPassStudents.overall} `,
          ` ${row.numberOfPassStudents.male} `,
          ` ${row.numberOfPassStudents.female}`,
          `${row.numberOfFailStudents.overall} `,
          ` ${row.numberOfFailStudents.male} `,
          ` ${row.numberOfFailStudents.female}`,
          `${row.passPercentage.overall.toFixed(2)}%`,
          ` ${row.passPercentage.male.toFixed(2)}% `,
          `${row.passPercentage.female.toFixed(2)}%`,
          `${row.failPercentage.overall.toFixed(2)}% `,
          ` ${row.failPercentage.male.toFixed(2)}% `,
          ` ${row.failPercentage.female.toFixed(2)}%`,
          `${Math.max(row.highestMark.overall)} `,
          ` ${row.highestMark.male} `,
          ` ${row.highestMark.female}`,
          `${Math.min(row.lowestMark.overall)} `,
          ` ${row.lowestMark.male} `,
          ` ${row.lowestMark.female}`,
          `${row.centum.overall} `,
          ` ${row.centum.male} `,
          ` ${row.centum.female}`,
        ],
      ],
      { origin: -1 }
    );
  });

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 36 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 36 } },
    { s: { r: 3, c: 1 }, e: { r: 3, c: 3 } },
    { s: { r: 3, c: 4 }, e: { r: 3, c: 6 } },
    { s: { r: 3, c: 7 }, e: { r: 3, c: 9 } },
    { s: { r: 3, c: 10 }, e: { r: 3, c: 12 } },
    { s: { r: 3, c: 13 }, e: { r: 3, c: 15 } },
    { s: { r: 3, c: 16 }, e: { r: 3, c: 18 } },
    { s: { r: 3, c: 19 }, e: { r: 3, c: 21 } },
    { s: { r: 3, c: 22 }, e: { r: 3, c: 24 } },
    { s: { r: 3, c: 25 }, e: { r: 3, c: 27 } },
    { s: { r: 3, c: 28 }, e: { r: 3, c: 30 } },
    { s: { r: 3, c: 31 }, e: { r: 3, c: 33 } },
    { s: { r: 3, c: 34 }, e: { r: 3, c: 36 } },
  ];

  ws['!cols'] = [{ wch: 15 }, { wch: 8 }, { wch: 8 }];

  const wb = XLSX_utils.book_new();
  XLSX_utils.book_append_sheet(wb, ws, 'Results');

  XLSX_writeFile(
    wb,
    `Overall_${examDetails?.name}_${classDetails?.name}_${sectionDetails?.name || 'All'}.xlsx`
  );
}

export function downloadMarkListXLSX(
  xlsxTableHeader: any,
  pdfTableHeader: any,
  pdfTableValues: any,
  examDetails: any,
  classDetails: any,
  sectionDetails: any
) {
  const wb = XLSX_utils.book_new();
  const ws = XLSX_utils.aoa_to_sheet([
    ['ARUNACHALAM HIGHER SECONDARY SCHOOL'],
    ['Overall Subject-wise Analysis'],
    [
      'Exam',
      examDetails?.name,
      'Class  ',
      classDetails.name || '',
      'Section  ',
      sectionDetails?.name || 'All',
    ],
    ...xlsxTableHeader,
  ]);

  pdfTableValues.forEach((row) => {
    XLSX_utils.sheet_add_aoa(ws, [row], { origin: -1 });
  });

  ws['!merges'] = [];
  let columnStart = 3;
  pdfTableHeader.forEach((row) => {
    const subtitleLength = row.subTitle?.length || 1;

    let columnEnd = columnStart + subtitleLength - 1;

    ws['!merges'].push({
      s: { r: 0, c: columnStart },
      e: { r: 0, c: columnEnd },
    });

    columnStart = columnEnd + 1;
  });

  // ws['!cols'] = [{ wch: 15 }, { wch: 8 }, { wch: 8 }];

  XLSX_utils.book_append_sheet(wb, ws, 'Results');

  XLSX_writeFile(
    wb,
    `Marklist${examDetails?.name}_${classDetails?.name}_${sectionDetails?.name || 'All'}.xlsx`
  );
}
