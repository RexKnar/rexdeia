'use client';
import { useRouter } from 'next/navigation';

import { makeAPICall } from '../../api';
import { DELETE_DEPARTMENT } from '../../endpoints';

export function RegulationList({ regulationList }) {
  const rout = useRouter();

  async function DeleteRegulationHandler(regulationId) {
    // TODO
    try {
      await makeAPICall(DELETE_DEPARTMENT, { regulationId });
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
        {regulationList.map((item, index) => (
          <tr key={index}>
            <td className="border border-slate-300 px-4">{index + 1}</td>
            <td className="border border-slate-300 px-4">
              {item.regulationName}
            </td>
            <td className="border border-slate-300 px-4">
              {item.announcedYear}
            </td>
            <td className="border border-slate-300 px-4">{item.endYear}</td>
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
                  DeleteRegulationHandler(item.id);
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
