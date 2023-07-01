import { Button, Header } from 'ui';
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
  }

  return (
    <>
      <Header text="Web" />
      <Button />
    </>
  );
}
