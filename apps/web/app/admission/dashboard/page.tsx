import { AdmissionList } from '../../../lib/components/admission/AdmissionList';
import { EnquiryList } from '../../../lib/components/enquiry/EnquiryList';

export default async function Page() {
  return (
    <>
      <div className="flex flex-col">
        <AdmissionList />
        <EnquiryList />
      </div>
    </>
  );
}
