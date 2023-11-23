'use client';

import { useRouter } from 'next/navigation';
import { makeAPICall } from '../../api';
import { DELETE_REGULATION } from '../../endpoints';
import { RegulationShareFlyout } from '../../../app/(protected)/academics/regulation/components/RegulationShareFlyout';

export function RegulationList({ regulationList }) {
  const router = useRouter();

  async function DeleteCourseHandler(regulationId: string) {
    try {
      await makeAPICall(DELETE_REGULATION, { regulationId });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className="bg-gray-50 p-3">
      <div className="mx-7  flex justify-end">
        <div>
          <RegulationShareFlyout></RegulationShareFlyout>
        </div>
      </div>
      <h1 className="mt-3 text-center text-3xl font-semibold text-primary">
        Regulation List
      </h1>
      <table className="m-auto mt-5 table-auto border-collapse border border-slate-400 px-4">
        <tr>
          <th className="border border-slate-300 px-4">Sl.No</th>
          <th className="border border-slate-300 px-4">Regulation Name</th>
          <th className="border border-slate-300 px-4">Announced Year</th>
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
            <td className="border border-slate-300 px-4">
              <button
                className="text-primary-foreground cursor-pointer rounded-md bg-primary text-white hover:bg-primary/90"
                onClick={() => {
                  router.push(`/academics/regulation/${item.id}/edit`);
                }}
              >
                Edit
              </button>
              <button
                className="text-primary-foreground cursor-pointer rounded-md bg-primary text-white hover:bg-primary/90"
                onClick={() => {
                  DeleteCourseHandler(item.id);
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
