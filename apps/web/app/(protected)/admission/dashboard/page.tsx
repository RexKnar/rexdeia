import { FileText } from 'lucide-react';
import { formatNumberWithSuffix } from 'utils';

import { LinkButton } from '../../../../lib/components/LinkButton';
import { PageTitle } from '../../../../lib/components/PageTitle';
import admissionRequestIcon from '../../../../public/assets/images/admission-request.svg';
import inProgressIcon from '../../../../public/assets/images/in-progress.svg';
import rejectedIcon from '../../../../public/assets/images/rejected.svg';
import shortlistedIcon from '../../../../public/assets/images/short-listed.svg';
import { AdmissionsList } from './_components/AdmissionsList';
import { DashboardCard } from './_components/DashboardCard';

export default async function Page() {
  const statisticsCardList = [
    { count: 1500, title: 'Admission Request', icon: admissionRequestIcon },
    { count: 450, title: 'Shortlisted', icon: shortlistedIcon },
    { count: 3500, title: 'Rejected', icon: rejectedIcon },
    { count: 300, title: 'In-progress', icon: inProgressIcon },
  ];

  return (
    <section>
      <div className="mt-3 flex items-center justify-end">
        <LinkButton variant="primary" url="/admission/add">
          <FileText size={16} className="mr-2" />
          Admission Form
        </LinkButton>
      </div>

      <div className="lg:grid-cols-3s mt-8 grid grid-cols-1 gap-3 sm:flex-row md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardList.map((item, index) => (
          <DashboardCard
            key={index}
            icon={item.icon}
            title={item.title}
            count={formatNumberWithSuffix(item.count)}
          />
        ))}
      </div>

      <div className="mx-auto my-5 rounded-md bg-white p-6">
        <PageTitle title="Admission List" className="mb-3" />
        <AdmissionsList />
      </div>
    </section>
  );
}
