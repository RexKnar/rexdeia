import { RegulationList } from '../../../lib/components/regulation/regulationList';
import { db } from '../../../lib/db';

export default async function Page() {
  try {
    const apiResponse = await db.regulation.findMany({
      where: { isDeleted: false },
    });
    return (
      <div className="flex flex-col">
        <RegulationList regulationList={apiResponse} />
      </div>
    );
  } catch (error) {
    console.log(error);
  }
}
