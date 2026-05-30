'use client';

import { useQuery } from '@tanstack/react-query';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { Button } from 'ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'ui/components/ui/Dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'ui/components/ui/Table';
import { titilize } from 'utils';

import type {
  DashboardRosterFilter,
  RosterRow,
} from '../../../../api/student/service';
import { exportRosterToExcel, exportRosterToPdf } from './rosterExport';

type StudentRosterDialogProps = {
  readonly filter: DashboardRosterFilter | null;
  readonly title: string;
  readonly onClose: () => void;
};

async function fetchRoster(filter: DashboardRosterFilter): Promise<RosterRow[]> {
  const params = new URLSearchParams({ scope: filter.scope });
  if (filter.mediumId) params.set('mediumId', filter.mediumId);
  if (filter.classId) params.set('classId', filter.classId);

  const res = await fetch(`/api/student/dashboard-roster?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load students');
  return res.json();
}

export function StudentRosterDialog({
  filter,
  title,
  onClose,
}: StudentRosterDialogProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-roster', filter],
    queryFn: () => fetchRoster(filter as DashboardRosterFilter),
    enabled: filter !== null,
  });

  const rows = data ?? [];

  return (
    <Dialog open={filter !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] w-[95vw] max-w-5xl flex-col">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center justify-between gap-3">
            <span>
              {title}
              {!isLoading && !isError && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({rows.length})
                </span>
              )}
            </span>
            <span className="mr-4 flex items-center gap-2">
              <Button
                variant="mild"
                className="h-auto gap-2 px-3 py-2 text-sm"
                disabled={rows.length === 0}
                onClick={() => exportRosterToExcel(rows, title)}
              >
                <FileSpreadsheet size={16} className="text-green-700" />
                Excel
              </Button>
              <Button
                variant="mild"
                className="h-auto gap-2 px-3 py-2 text-sm"
                disabled={rows.length === 0}
                onClick={() => exportRosterToPdf(rows, title)}
              >
                <FileText size={16} className="text-red-600" />
                PDF
              </Button>
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-auto rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow>
                <TableHead className="w-12">S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Medium</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary" />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-red-600"
                  >
                    Failed to load students.
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {student.name}
                    </TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell>{student.sectionName}</TableCell>
                    <TableCell>{student.mediumName}</TableCell>
                    <TableCell>{titilize(student.gender)}</TableCell>
                    <TableCell>{student.rollNumber ?? '-'}</TableCell>
                    <TableCell>{student.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="flex items-center gap-1 text-xs text-gray-500">
          <Download size={12} /> Exports include all {rows.length} students in
          this list.
        </p>
      </DialogContent>
    </Dialog>
  );
}
