'use client';

import {
  ChevronDown,
  ChevronRight,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  User2,
  UserCircle2,
  UserPlus2,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Button } from 'ui';

import { UserMenu } from './header/UserMenu';

type MenuItem =
  | 'admission-dashboard'
  | 'students'
  | 'staffs'
  | 'academics'
  | 'admission-page'
  | 'admission-configure'
  | 'admission-analytics'
  | 'admission-addnew'
  | 'academics-department-student'
  | 'academics-regulation-student'
  | 'academics-course-student'
  | 'admission-add';

const menuItemPaths: Record<MenuItem, string> = {
  'admission-dashboard': '/admission/dashboard',
  students: '/students',
  staffs: '/staffs',
  academics: '/academics',
  'admission-page': '/admission/dashboard',
  'admission-configure': '/admission/configure',
  'admission-analytics': '/admission/analytics',
  'admission-addnew': '/admission/addnew',
  'academics-department-student': '/academics/department',
  'academics-regulation-student': '/academics/regulation',
  'academics-course-student': '/academics/course',
  'admission-add': '/admission/add',
};

export function Sidebar() {
  const router = useRouter();
  const currentURL = usePathname();
  const getKeyByValue = (object: object, value: string) => {
    return Object.keys(object).find((key) => object[key] === value);
  };

  const [activeMenu, setActiveMenu] = useState(
    getKeyByValue(menuItemPaths, currentURL),
  );

  const handleMenuClick = useCallback(
    (item: MenuItem) => {
      const path = menuItemPaths[item];
      if (path) {
        router.push(path);
      }
      setActiveMenu(item);
    },
    [router],
  );

  const handleAdmissionsClick = () => {
    toggleArrowDirection();
    handleMenuClick('admission-page');
  };

  const [isArrowDown, setIsArrowDown] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);

  const toggleArrowDirection = () => {
    setIsArrowDown(!isArrowDown);
    setShowSubmenu(!showSubmenu);
  };

  return (
    <div className="w-72 border pb-12">
      <div className="space-y-4 py-4">
        <div className=" py-2">
          <div className="mb-2 flex w-[292px] items-center justify-between gap-3 px-4 text-lg font-semibold tracking-tight">
            <div className="flex w-[140px] text-left">
              <UserMenu />

              <div className="ml-2">
                <h1 className="text-sm font-semibold">ABC College</h1>
                <h2 className="text-sm font-normal text-gray-700">Admin</h2>
              </div>
            </div>
            <ChevronDown className="mr-2  h-4 w-4" />
          </div>
          <div className="mb-8 w-full border">
            <hr />
          </div>

          <div>
            <div className="mb-6 space-y-1 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white text-sm font-normal text-gray-800 hover:bg-gray-200  ${
                  activeMenu == 'admission-dashboard'
                    ? 'bg-gray-200 font-semibold'
                    : ''
                } `}
                onClick={() => handleMenuClick('admission-dashboard')}
              >
                <LayoutDashboard size={16} className="mr-2" />
                Dashboard
              </Button>
            </div>
            <div className="mb-6 space-y-1 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white text-sm font-normal text-gray-800 hover:bg-gray-200  ${
                  activeMenu == 'students' ? 'bg-gray-50 font-semibold' : ''
                } `}
                onClick={() => handleMenuClick('students')}
              >
                <UserCircle2 size={16} className="mr-2" />
                <div className="flex w-full items-center justify-between ">
                  Students
                  {isArrowDown ? (
                    <ChevronDown className="mr-2 h-4 w-4" />
                  ) : (
                    <ChevronRight className="mr-2 h-4 w-4" />
                  )}
                </div>
              </Button>
            </div>
            <div className="mb-6 space-y-1 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white text-sm font-normal text-gray-800 hover:bg-gray-200 ${
                  activeMenu == 'staffs' ? 'bg-gray:200 font-semibold' : ''
                } `}
                onClick={() => handleMenuClick('staffs')}
              >
                <User2 size={16} className="mr-2" />
                <div className="flex w-full items-center justify-between ">
                  Staff
                  {isArrowDown ? (
                    <ChevronDown className="mr-2 h-4 w-4" />
                  ) : (
                    <ChevronRight className="mr-2 h-4 w-4" />
                  )}
                </div>
              </Button>
            </div>
            <div className="mb-6 space-y-1 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white text-sm font-normal text-gray-800 hover:bg-gray-200 ${
                  activeMenu == 'academics' ? 'bg-gray-200 font-semibold' : ''
                } `}
                onClick={() => handleMenuClick('academics')}
              >
                <GraduationCap size={16} className="mr-2" />
                <div className="flex w-full items-center justify-between ">
                  Academics
                  {isArrowDown ? (
                    <ChevronDown className="mr-2 h-4 w-4" />
                  ) : (
                    <ChevronRight className="mr-2 h-4 w-4" />
                  )}
                </div>
              </Button>
            </div>
            <div className="mb-6 space-y-1 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white text-sm font-normal text-gray-800 hover:bg-gray-200 ${
                  activeMenu === 'admission-page'
                    ? 'bg-gray-50 font-semibold'
                    : ''
                } `}
                onClick={handleAdmissionsClick}
              >
                <UserPlus2 size={18} className="mr-2" />
                <div className="flex w-full items-center justify-between ">
                  Admissions
                  {isArrowDown ? (
                    <ChevronDown className="mr-2 h-4 w-4" />
                  ) : (
                    <ChevronRight className="mr-2 h-4 w-4" />
                  )}
                </div>
              </Button>
              {showSubmenu && (
                <div className="ml-4 border-l-2 px-2">
                  <div className="rounded-lg p-2 text-sm font-normal text-gray-800">
                    <Button
                      className={`w-[174px] justify-start bg-white hover:bg-gray-200  ${
                        activeMenu == 'admission-addnew'
                          ? 'bg-gray-200 font-semibold'
                          : ''
                      } `}
                      onClick={() => handleMenuClick('admission-add')}
                    >
                      Add new
                    </Button>
                  </div>
                  <div className="rounded-lg p-2 text-sm font-normal text-gray-800">
                    <Button
                      className={`w-[174px] justify-start bg-white hover:bg-gray-200 ${
                        activeMenu == 'admission-analytics'
                          ? 'bg-gray-200 font-semibold'
                          : ''
                      } `}
                      onClick={() => handleMenuClick('admission-analytics')}
                    >
                      Analytics
                    </Button>
                  </div>
                  <div className="rounded-lg p-2 text-sm font-normal text-gray-800">
                    <Button
                      className={`w-[174px] justify-start bg-white hover:bg-gray-200 ${
                        activeMenu == 'admission-configure'
                          ? 'bg-gray-200 font-semibold'
                          : ''
                      } `}
                      onClick={() => handleMenuClick('admission-configure')}
                    >
                      Configure
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="mb-6 space-y-1 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white text-sm font-normal text-gray-800 hover:bg-gray-200 ${
                  activeMenu == 'academics-department-student'
                    ? 'bg-gray-200 font-semibold'
                    : ''
                } `}
                onClick={() => handleMenuClick('academics-department-student')}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Department
              </Button>
            </div>
            <div className="mb-6 space-y-1 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white text-sm font-normal text-gray-800 hover:bg-gray-200 ${
                  activeMenu == 'academics-regulation-student'
                    ? 'bg-gray-200 font-semibold'
                    : ''
                } `}
                onClick={() => handleMenuClick('academics-regulation-student')}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Regulation
              </Button>
            </div>
            <div className="mb-6 space-y-1 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white text-sm font-normal text-gray-800 hover:bg-gray-200 ${
                  activeMenu == 'academics-course-student'
                    ? 'bg-gray-200 font-semibold'
                    : ''
                } `}
                onClick={() => handleMenuClick('academics-course-student')}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Course
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
