import { HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from 'ui';

export function DashboardBreadcrumb() {
  return (
    <Breadcrumb separator="/">
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} href="/">
          <div className="flex items-center justify-center">
            <HomeIcon size={16} className="mr-2" />
            Home
          </div>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink as={Link} href="/admission/dashboard">
          Dashboard
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
