import { DepartmentList } from '../../../lib/components/department/departmentList';
import { db } from '../../../lib/db';

export default async function Page() {
  try {
    const apiResponse = await db.department.findMany({
      where: { isDeleted: false },
    });
    return (
      <div className="flex flex-col">
        <DepartmentList departmentList={apiResponse} />
      </div>
    );
  } catch (error) {
    console.log(error);
  }
}
