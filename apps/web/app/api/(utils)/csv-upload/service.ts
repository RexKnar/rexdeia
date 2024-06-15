import { Buffer } from 'buffer';
import { parse } from 'csv-parse';

/**
 * Process the uploaded file and parse the CSV data.
 *
 * @param fileName - The name of the uploaded file.
 * @param fileBuffer - The buffer containing the file data.
 * @returns A promise that resolves to an array of parsed CSV data.
 */
const fileHandler = async (fileName: string, fileBuffer: Buffer) => {
  const results: Array<{ [key: string]: string }> = [];

  return new Promise((resolve, reject) => {
    const parser = parse({ columns: true });
    parser.on('data', (data) => results.push(data));
    parser.on('end', () => resolve(results));
    parser.on('error', (error) => reject(error));

    parser.write(fileBuffer);
    parser.end();
  });
};

export default fileHandler;
