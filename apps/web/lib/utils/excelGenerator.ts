import * as XLSX from 'xlsx';

export const excelGenerator = () => {
  // Sample data
  const data = [
    { Name: 'John Doe', Age: 28, Email: 'john@example.com' },
    { Name: 'Jane Smith', Age: 34, Email: 'jane@example.com' },
    { Name: 'Sam Johnson', Age: 22, Email: 'sam@example.com' },
  ];

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, 'generated.xlsx');
};
