import { RegulationList } from '../../../lib/components/regulation/regulationList';

export default async function Page() {
  return (
    <>
      <div className="flex flex-col">
        <RegulationList />
      </div>
    </>
  );
}
