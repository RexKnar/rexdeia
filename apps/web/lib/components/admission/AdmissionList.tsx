'use client';
import { DataTable } from '../../../app/admission/dashboard/data-table';
import { AdmissionListModel, columns } from '../../../app/admission/dashboard/columns';
import { useEffect, useState } from 'react';
import { makeAPICall } from '../../api';
import { LIST_ADMISSION } from '../../endpoints';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../../packages/ui/components/ui/Table';
export function AdmissionList() {
  const [admissionLists, setAdmissionList] = useState([]);
  useEffect(() => {
    (async function ListAdmissionHandler() {
      try {
        setAdmissionList(await makeAPICall(LIST_ADMISSION));
      } catch (error) {
        console.log(error);
        // TODO: Handle error
      }
    })();
  }, []);

  return (
    <section className="w-full">
      <h1 className="text-primary mt-3 text-center text-3xl font-semibold">
        Admission List
      </h1>
      <table className="m-auto mt-5 table-auto border-collapse border border-slate-400 px-4">
        <tr>
          <th className="border border-slate-300 px-4">Sl.No</th>
          <th className="border border-slate-300 px-4">
            Name of the Candidate
          </th>
          <th className="border border-slate-300 px-4">Email ID</th>
          <th className="border border-slate-300 px-4">Contact Number</th>
          <th className="border border-slate-300 px-4">Address</th>
        </tr>
        {admissionLists.map((item, index) => (
          <tr key={item.id}>
            <td className="border border-slate-300 px-4">{index + 1}</td>
            <td className="border border-slate-300 px-4">
              {item.firstName + ' ' + item.lastName}
            </td>
            <td className="border border-slate-300 px-4">{item.emailId}</td>
            <td className="border border-slate-300 px-4">
              {item.contactNumber}
            </td>
            <td className="border border-slate-300 px-4">
              {item.addressLine1 + ', ' + item.addressLine2}
            </td>
          </tr>
        ))}
      </table>

    </section>
  );
}
