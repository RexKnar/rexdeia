'use client';
import { useEffect, useState } from 'react';
import { makeAPICall } from '../../api';
import { DELETE_DEPARTMENT, LIST_REGULATION } from '../../endpoints';
import React from 'react';
import { useRouter } from 'next/navigation';

export function RegulationList() {
  const rout = useRouter();
  const [departmentList, setDepartmentList] = useState([]);
  useEffect(() => {
    (async function ListDepartmentHandler() {
      try {
        setDepartmentList(await makeAPICall(LIST_REGULATION));
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  async function DeleteDepartmentHandler(departmentId) {
    try {
      await makeAPICall(DELETE_DEPARTMENT, { departmentId });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className="w-full">
      <div className="flex justify-end">
        <button
          className="text-primary-foreground mt-6 h-12 cursor-pointer rounded-md bg-primary px-5 text-white hover:bg-primary/90"
          type="button"
        //   onClick={() => {
        //     rout.push(`/admission/department/departmentForm`);
        //   }}
        >
          Add Regulation
        </button>
      </div>

      <h1 className="mt-3 text-center text-3xl font-semibold text-primary">
        Regulation List
      </h1>
      <table className="m-auto mt-5 table-auto border-collapse border border-slate-400 px-4">
        <tr>
          <th className="border border-slate-300 px-4">Sl.No</th>
          <th className="border border-slate-300 px-4">Regulation Name</th>
          <th className="border border-slate-300 px-4">Announced Year</th>
          <th className="border border-slate-300 px-4">End Year</th>
          <th className="border border-slate-300 px-4">Action</th>
        </tr>
        {departmentList.map((item, index) => (
          <tr>
            <td className="border border-slate-300 px-4">{index + 1}</td>
            <td className="border border-slate-300 px-4">
              {item.regulationName}
            </td>
            <td className="border border-slate-300 px-4">{item.currentHod}</td>
            <td className="border border-slate-300 px-4">{item.noOfFaculty}</td>
            <td className="border border-slate-300 px-4">
              <button
                className="text-primary-foreground cursor-pointer rounded-md bg-primary text-white hover:bg-primary/90"
                onClick={() => {
                  rout.push(
                    `/admission/department/departmentForm?id=${item.id}`,
                  );
                }}
              >
                Edit
              </button>
              <button
                className="text-primary-foreground cursor-pointer rounded-md bg-primary text-white hover:bg-primary/90"
                onClick={() => {
                  DeleteDepartmentHandler(item.id);
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </table>
    </section>
  );
}
