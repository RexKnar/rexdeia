import { ChevronDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

export function RegulationListTable() {
  return (
    <section>
      <div className="mt-7">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Regulation Name</TableHead>
              <TableHead>Announced Year</TableHead>
              <TableHead>End Year</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Example Regulation</TableCell>
              <TableCell>2021</TableCell>
              <TableCell>2041</TableCell>
              <TableCell>...</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>Regulation Two</TableCell>
              <TableCell>2023</TableCell>
              <TableCell>2044</TableCell>
              <TableCell>...</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div>
        <div className="mt-7 flex justify-between">
          <div className="flex items-center text-sm font-normal text-gray-700">
            Entries per page
            <div className="flex items-center border">
              <span className="px-2 py-1 text-black ">10</span>
              <ChevronDown size={14} className="mr-1" />
            </div>
          </div>
          <div className="flex">
            <div className="px-3 py-1 text-sm font-normal text-gray-700">
              First
            </div>
            <div className="px-3 py-1 text-sm font-normal text-gray-700">1</div>
            <div className="bg-gray-200 px-3 py-1 text-sm font-normal text-primary-800">
              2
            </div>
            <div className="px-3 py-1 text-sm font-normal text-gray-700">
              ...
            </div>
            <div className="px-3 py-1 text-sm font-normal text-gray-700">7</div>
            <div className="px-3 py-1 text-sm font-normal text-gray-700">8</div>
            <div className="px-3 py-1 text-sm font-normal text-gray-700">
              Last
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
