import 'configs/tailwind/styles.css';

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return <main className="bg-white">{children}</main>;
}
