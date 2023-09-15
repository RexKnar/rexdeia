import { DepartmentList } from '../../../lib/components/department/departmentList';

export default async function Page() {
  return (
    <>
      <div className="flex flex-col">
        <DepartmentList />
      </div>
    </>
  );
}
