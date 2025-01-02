import { useGetStudentHistoryListByIdQuery } from 'lib/queries/students/useGetStudentHistoryByIdQuery';
import { useParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';

export default function AcademicHistoryList() {
  const { id } = useParams<{ id: string }>();

  const { data: getStudentAcademicHistoryByIdResponse } =
    useGetStudentHistoryListByIdQuery(id);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>#</TableCell>
          <TableCell>Academic Year</TableCell>
          <TableCell>Class</TableCell>
          <TableCell> Section</TableCell>
          <TableCell> Roll Number</TableCell>
          <TableCell> Group</TableCell>
          <TableCell> Medium</TableCell>
          <TableCell> Remark</TableCell>
          <TableCell> Status</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {getStudentAcademicHistoryByIdResponse?.map(
          (academicHistory, index) => {
            const {
              batch,
              class: studentClass,
              section,
              medium,
              remark,
              isCurrent: status,
              group,
              rollNumber,
            } = academicHistory;
            return (
              <TableRow key={academicHistory.id}>
                <TableCell key={index}>{index + 1}</TableCell>
                <TableCell>{batch?.name}</TableCell>
                <TableCell>{studentClass?.name}</TableCell>
                <TableCell>{section?.name}</TableCell>
                <TableCell>{rollNumber}</TableCell>
                <TableCell>{group?.name}</TableCell>
                <TableCell>{medium?.name}</TableCell>
                <TableCell>{remark}</TableCell>
                <TableCell>{status ? 'Current Student' : 'Archived'}</TableCell>
              </TableRow>
            );
          }
        )}
      </TableBody>
    </Table>
  );
}
