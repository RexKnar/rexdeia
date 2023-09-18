'use client';
import { useEffect, useState } from 'react';
import { makeAPICall } from '../../api';
import { DELETE_DEPARTMENT, LIST_DEPARTMENT } from '../../endpoints';
import React from 'react';
import { useRouter } from 'next/navigation';

export function DepartmentList() {
  const rout = useRouter();
  const [departmentList, setDepartmentList] = useState([]);
  useEffect(() => {
    (async function ListDepartmentHandler() {
      try {
        setDepartmentList(await makeAPICall(LIST_DEPARTMENT));
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
          onClick={() => {
            rout.push(`/admission/department/departmentForm`);
          }}
        >
          Add Department
        </button>
      </div>

      <h1 className="mt-3 text-center text-3xl font-semibold text-primary">
        Department List
      </h1>
      <table className="m-auto mt-5 table-auto border-collapse border border-slate-400 px-4">
        <tr>
          <th className="border border-slate-300 px-4">Sl.No</th>
          <th className="border border-slate-300 px-4">Department Name</th>
          <th className="border border-slate-300 px-4">Current HOD</th>
          <th className="border border-slate-300 px-4">No of Faculty</th>
          <th className="border border-slate-300 px-4">Code</th>
          <th className="border border-slate-300 px-4">No of Students</th>
          <th className="border border-slate-300 px-4">No of Years</th>
          <th className="border border-slate-300 px-4">Action</th>
        </tr>
        {departmentList.map((item, index) => (
          <tr>
            <td className="border border-slate-300 px-4">{index + 1}</td>
            <td className="border border-slate-300 px-4">
              {item.departmentName}
            </td>
            <td className="border border-slate-300 px-4">{item.currentHod}</td>
            <td className="border border-slate-300 px-4">{item.noOfFaculty}</td>
            <td className="border border-slate-300 px-4">
              {item.departmentCode}
            </td>
            <td className="border border-slate-300 px-4">
              {item.noOfStudents}
            </td>
            <td className="border border-slate-300 px-4">{item.noOfYears}</td>
            <td className="border border-slate-300 px-4">
              <button
                className="text-primary-foreground cursor-pointer rounded-md bg-primary text-white hover:bg-primary/90"
                onClick={() => {
                  rout.push(
                    `/admission/department/departmentForm?id=${item._id.$oid}`,
                  );
                }}
              >
                Edit
              </button>
              <button
                className="text-primary-foreground cursor-pointer rounded-md bg-primary text-white hover:bg-primary/90"
                onClick={() => {
                  DeleteDepartmentHandler(item._id.$oid);
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
