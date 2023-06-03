import { UserButton } from '@clerk/nextjs';
import { Button, Header } from 'ui';

export default function Page() {
  return (
    <>
      <Header text="Web" />
      <Button />
      <div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
}
