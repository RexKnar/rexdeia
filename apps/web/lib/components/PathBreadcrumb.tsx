'use client';

import { Slash } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from 'ui';

const formatText = (text: string) => {
  const textWithoutHyphen = text.replace(/-/g, ' ');
  return textWithoutHyphen.charAt(0).toUpperCase() + textWithoutHyphen.slice(1);
};

export function PathBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((seg) => seg);

  return (
    <Breadcrumb
      separator={<Slash className="rotate-[-30deg] text-gray-900" size={12} />}
      className="hidden lg:block"
    >
      {pathSegments.map((segment, index) => {
        const key = segment + index;
        const isCurrentPage = index === pathSegments.length - 1;
        const href = '/' + pathSegments.slice(0, index + 1).join('/');

        return (
          <BreadcrumbItem key={key} isCurrentPage={isCurrentPage}>
            <BreadcrumbLink as={Link} href={href}>
              <div
                className={
                  isCurrentPage
                    ? 'text-primary'
                    : 'flex items-center justify-center text-gray-700'
                }
              >
                {formatText(segment)}
              </div>
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}
