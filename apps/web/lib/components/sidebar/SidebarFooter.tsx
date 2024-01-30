import Image from 'next/image';
import { Text } from 'ui';

import logo from '../../../public/assets/images/acadx-logo.png';

export function SidebarFooter() {
  return (
    <footer className="flex w-full flex-col items-center align-middle">
      <Image
        src={logo}
        alt="acadx Logo"
        aria-label="acadx Logo"
        className="pointer-events-none w-24"
      />
      <Text variant="sm-regular" className="mt-2 text-gray-700">
        acadx v1.2, 2023
      </Text>
    </footer>
  );
}
