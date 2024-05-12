import { EditStudentDetail } from './components/EditStudentForm';
import { EditStudentHeader } from './components/EditstudentHeader';

export default async function Page() {
  return (
    <section>
      <EditStudentHeader />
      <EditStudentDetail />
    </section>
  );
}
