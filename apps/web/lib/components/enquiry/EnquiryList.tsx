'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { makeAPICall } from '../../api';
import { LIST_ENQUIRY } from '../../endpoints';

export function EnquiryList() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? '1';
  const router = useRouter();
  const [enquiryList, setEnquiryList] = useState([]);
  useEffect(() => {
    (async function ListAdmissionHandler() {
      try {
        const pageValue = (Number(page) - 1) * 10;
        setEnquiryList(await makeAPICall(LIST_ENQUIRY, { pageValue }));
      } catch (error) {
        console.error(error);
      }
    })();
  }, [page]);
  return (
    <section className="w-full">
      <h1 className="mt-3 text-center text-3xl font-semibold text-primary">
        Enquiry List
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
        {enquiryList.map((item, index) => (
          <tr key={index}>
            <td className="border border-slate-300 px-4">{index + 1}</td>
            <td className="border border-slate-300 px-4">{item.name}</td>
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
      <div className="flex flex-row gap-5">
        <button
          type="submit"
          className="text-primary-foreground mt-6 h-6 cursor-pointer rounded-md bg-primary text-white hover:bg-primary/90"
          onClick={() => {
            router.push(`?page=${Number(page) - 1}`);
          }}
        >
          privious
        </button>
        <button
          type="submit"
          className="text-primary-foreground mt-6 h-6 cursor-pointer rounded-md bg-primary text-white hover:bg-primary/90"
          onClick={() => {
            router.push(`?page=${Number(page) + 1}`);
          }}
        >
          next
        </button>
      </div>
    </section>
  );
}
