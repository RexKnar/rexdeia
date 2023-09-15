import { AdmissionListModel, columns } from './columns';
import { DataTable } from './data-table';
import { getAdmissionList } from '../../api/admissionlist/service';
async function getData(): Promise<AdmissionListModel[]> {
  const admissionList = await getAdmissionList();
  const data: AdmissionListModel[] = JSON.parse(JSON.stringify(admissionList));
  return data.map((x,i)=>({slNo:i+1,...x}));
}
export default async function Page() {
  const data = await getData();
  return (
    <>
      <section className="w-full p-3">
        <h1 className="mt-4 text-center text-3xl font-semibold text-primary">
          Admission List
        </h1>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={data} />
        </div>
      </section>
    </>
  );
}
