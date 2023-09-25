'use client';

import {
  ChevronDown,
  ChevronRight,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  ListMinus,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Button } from 'ui';

import { UserMenu } from './header/UserMenu';

type MenuItem =
  | 'admission-dashboard'
  | 'students'
  | 'staffs'
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
          <div className="mb-2 flex w-[292px] items-center justify-start gap-3 px-4 text-lg font-semibold tracking-tight">
            <UserMenu />
            <div className="w-[128px] text-left">
              <h1 className="inter text-sm font-semibold">ABC College</h1>
              <h2 className="inter text-sm font-normal text-gray-700">Admin</h2>
            </div>
          </div>
          <div className="mb-8 w-full border">
            <hr />
          </div>
          <div>
            <div className="mb-6 space-y-1 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white hover:bg-primary hover:text-white ${
                  activeMenu == 'admission-dashboard'
                    ? 'bg-primary text-white'
                    : ''
                } `}
                onClick={() => handleMenuClick('admission-dashboard')}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </div>
            <div className="mb-6 space-y-1 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white hover:bg-primary hover:text-white ${
                  activeMenu == 'students' ? 'bg-primary text-white' : ''
                } `}
                onClick={() => handleMenuClick('students')}
              >
                <ListMinus className="mr-2 h-4 w-4" />
                Students
              </Button>
            </div>
            <div className="mb-6 space-y-1 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white hover:bg-primary hover:text-white ${
                  activeMenu == 'staffs' ? 'bg-primary text-white' : ''
                } `}
                onClick={() => handleMenuClick('staffs')}
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Staff
              </Button>
            </div>
            <div className="mb-6 space-y-1 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white hover:bg-primary hover:text-white ${
                  activeMenu == 'admission-page' ? 'bg-primary text-white' : ''
                } `}
                onClick={handleAdmissionsClick}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                <div className="flex w-full items-center justify-between ">
                  Admissions
                  {isArrowDown ? (
                    <ChevronDown className="mr-2 h-4 w-4" /> // Display downwards arrow
                  ) : (
                    <ChevronRight className="mr-2 h-4 w-4" /> // Display right arrow
                  )}
                </div>
              </Button>
              {showSubmenu && (
                <div className="ml-4 border-l-2 px-2">
                  <div className="inter rounded-lg p-2 text-sm font-normal text-gray-800">
                    <Button
                      className={`w-[174px] justify-start bg-white hover:bg-gray-100 hover:text-gray-800 ${
                        activeMenu == 'admission-addnew'
                          ? 'bg-gray-100 text-gray-800'
                          : ''
                      } `}
                      onClick={() => handleMenuClick('admission-add')}
                    >
                      Add new
                    </Button>
                  </div>
                  <div className="inter rounded-lg p-2 text-sm font-normal text-gray-800">
                    <Button
                      className={`w-[174px] justify-start bg-white hover:bg-gray-100 hover:text-gray-800 ${
                        activeMenu == 'admission-analytics'
                          ? 'bg-gray-100 text-gray-800'
                          : ''
                      } `}
                      onClick={() => handleMenuClick('admission-analytics')}
                    >
                      Analytics
                    </Button>
                  </div>
                  <div className="inter rounded-lg p-2 text-sm font-normal text-gray-800">
                    <Button
                      className={`w-[174px] justify-start bg-white hover:bg-gray-100 hover:text-gray-800 ${
                        activeMenu == 'admission-configure'
                          ? 'bg-gray-100 text-gray-800'
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
          </div>
          <div className="space-y-1">
            <Button
              variant="secondary"
              className={`w-full justify-start bg-white hover:bg-primary hover:text-white ${
                activeMenu == 'academics-department-student'
                  ? 'bg-primary text-white'
                  : ''
              } `}
              onClick={() => handleMenuClick('academics-department-student')}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Department
            </Button>
          </div>
          <div className="space-y-1">
            <Button
              variant="secondary"
              className={`w-full justify-start bg-white hover:bg-primary hover:text-white ${
                activeMenu == 'academics-regulation-student'
                  ? 'bg-primary text-white'
                  : ''
              } `}
              onClick={() => handleMenuClick('academics-regulation-student')}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Regulation
            </Button>
          </div>
          <div className="space-y-1">
            <Button
              variant="secondary"
              className={`w-full justify-start bg-white hover:bg-primary hover:text-white ${
                activeMenu == 'academics-course-student'
                  ? 'bg-primary text-white'
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
  );
}
