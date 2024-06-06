import { EditStaffDetails } from './components/EditStaffForm';
import { EditStaffHeader } from './components/EditStaffHeader';

export default async function Page() {
  return (
    <section>
      <EditStaffHeader />
      <EditStaffDetails />
    </section>
  );
}
