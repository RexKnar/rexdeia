import { FileInput } from 'lucide-react';
import { Button } from 'ui';

import { ShareFlyout } from '../../../../lib/components/admission/ShareFlyout';
import admissionRequestIcon from '../../../../public/assets/images/admission-request.svg';
import inProgressIcon from '../../../../public/assets/images/in-progress.svg';
import rejectedIcon from '../../../../public/assets/images/rejected.svg';
import shortlistedIcon from '../../../../public/assets/images/short-listed.svg';
import { AdmissionListModel, columns } from './columns';
import { DashboardBreadcrumb } from './components/DashboardBreadcrumb';
import { DataTable } from './data-table';
import { DashboardCard } from './components/DashboardCard';
import { formatNumberWithSuffix } from 'utils';
import { getAdmissionList } from '../../../api/admissionlist/service';
import { db } from '../../../../lib/db';

async function getData(): Promise<AdmissionListModel[]> {
  const admissionList = await getAdmissionList(1, 1);
  const data: AdmissionListModel[] = JSON.parse(JSON.stringify(admissionList));
  return data.map((x, i) => ({ slNo: i + 1, ...x }));
}

export default async function Page() {
  const data = await getData();

  const cardsStatistics = [
    { count: 1500, title: 'Admission Request', icon: admissionRequestIcon },
    { count: 450, title: 'Shortlisted', icon: shortlistedIcon },
    { count: 3500, title: 'Rejected', icon: rejectedIcon },
    { count: 300, title: 'In-progress', icon: inProgressIcon },
  ];
  const totalCount = await db.admissionForm.count();
  return (
    <section className="w-full bg-gray-50 p-3">
      <section>
        <section className="mx-6 mt-8 flex items-center justify-between">
          <DashboardBreadcrumb />

          <Button className="text-white">
            <FileInput size={16} className="mr-2" />
            Admission Form
          </Button>
        </section>

        <div>
          <div className="lg:grid-cols-3s mt-8 grid grid-cols-1 gap-3 sm:flex-row md:grid-cols-2 xl:grid-cols-4">
            {cardsStatistics.map((item, index) => (
              <DashboardCard
                key={index}
                icon={item.icon}
                title={item.title}
                count={formatNumberWithSuffix(item.count)}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid md:grid-cols-2">
            <div className="rounded-md border border-blue-100 bg-white p-3 shadow">
              Generating random paragraphs can be an excellent way for writers
              to get their creative flow going at the beginning of the day. The
              writer has no idea what topic the random paragraph will be about
              when it appears. This forces the writer to use creativity to
              complete one of three common writing challenges. The writer can
              use the paragraph as the first one of a short story and build upon
              it. A second option is to use the random paragraph somewhere in a
              short story they create. The third option is to have the random
              paragraph be the ending paragraph in a short story. No matter
              which of these challenges is undertaken, the writer is forced to
              use creativity to incorporate the paragraph into their writing
            </div>
            <div className="rounded-md border border-blue-100 bg-white p-3 shadow">
              Generating random paragraphs can be an excellent way for writers
              to get their creative flow going at the beginning of the day. The
              writer has no idea what topic the random paragraph will be about
              when it appears. This forces the writer to use creativity to
              complete one of three common writing challenges. The writer can
              use the paragraph as the first one of a short story and build upon
              it. A second option is to use the random paragraph somewhere in a
              short story they create. The third option is to have the random
              paragraph be the ending paragraph in a short story. No matter
              which of these challenges is undertaken, the writer is forced to
              use creativity to incorporate the paragraph into their writing
            </div>
          </div>
        </div>
        <ShareFlyout></ShareFlyout>
        <h1 className="mt-96 text-center text-3xl font-semibold text-primary">
          Admission List
        </h1>
        <div className="mx-auto py-10">
          <DataTable columns={columns} data={[]} totalCount={totalCount} />
        </div>
      </section>
    </section>
  );
}
