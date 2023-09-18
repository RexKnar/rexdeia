"use client";

import { Button } from "ui";
import { useCallback, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  ListMinus,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { UserMenu } from "./header/UserMenu";
import { useSession } from "next-auth/react";
import Link from "next/link";

type MenuItem =
  | "admission-dashboard"
  | "admission-students"
  | "admission-staffs"
  | "admission-academics"
  | "admission-page"
  | "admission-configure"
  | "admission-analytics"
  | "admission-addnew";

const menuItemPaths: Record<MenuItem, string> = {
  "admission-dashboard": "/admission/dashboard",
  "admission-students": "/admission/students",
  "admission-staffs": "/admission/staffs",
  "admission-academics": "/admission/academics",
  "admission-page": "/admission/dashboard",
  "admission-configure":"/admission/configure",
  "admission-analytics":"/admission/analytics",
  "admission-addnew":"/admission/addnew"
};

export function Sidebar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const currentURL = usePathname();
  const getKeyByValue = (object: object, value: string) => {
    return Object.keys(object).find((key) => object[key] === value);
  };

  const [activeMenu, setActiveMenu] = useState(
    getKeyByValue(menuItemPaths, currentURL)
  );

  const handleMenuClick = useCallback(
    (item: MenuItem) => {
      const path = menuItemPaths[item];
      if (path) {
        router.push(path);
      }
      // if (item !== "admission-page") {
      //   setShowSubmenu(false);
      //   setIsArrowDown(false);
      // }     
      setActiveMenu(item);
    },
    [router]
  );

  const handleAdmissionsClick = () => {
    toggleArrowDirection();
    handleMenuClick("admission-page");
  };

  const [isArrowDown, setIsArrowDown] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);

  const toggleArrowDirection = () => {
    setIsArrowDown(!isArrowDown);
    setShowSubmenu(!showSubmenu);
  };

  return (
    <div className="border w-72 pb-12">
      <div className="space-y-4 py-4">
        <div className=" py-2">
          <div className="w-[292px] gap-3 flex items-center justify-start mb-2 px-4 text-lg font-semibold tracking-tight">
            <UserMenu />
            <div className="w-[128px] text-left">
              <h1 className="inter text-sm font-semibold">
                St'Xaviers College
              </h1>
              <h2 className="inter text-sm font-normal text-gray-700">Admin</h2>
            </div>
          </div>
          <div className="w-full border mb-8">
            <hr />
          </div>
          <div>
            <div className="space-y-1 mb-6 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white hover:bg-primary hover:text-white ${
                  activeMenu == "admission-dashboard"
                    ? "bg-primary text-white"
                    : ""
                } `}
                onClick={() => handleMenuClick("admission-dashboard")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </div>
            <div className="space-y-1 mb-6 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white hover:bg-primary hover:text-white ${
                  activeMenu == "admission-students"
                    ? "bg-primary text-white"
                    : ""
                } `}
                onClick={() => handleMenuClick("admission-students")}
              >
                <ListMinus className="mr-2 h-4 w-4" />
                Students
              </Button>
            </div>
            <div className="space-y-1 mb-6 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white hover:bg-primary hover:text-white ${
                  activeMenu == "admission-staffs"
                    ? "bg-primary text-white"
                    : ""
                } `}
                onClick={() => handleMenuClick("admission-staffs")}
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Staff
              </Button>
            </div>
            <div className="space-y-1 mb-6 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white hover:bg-primary hover:text-white ${
                  activeMenu == "admission-enquiry-academics"
                    ? "bg-primary text-white"
                    : ""
                } `}
                onClick={() => handleMenuClick("admission-academics")}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Academics
              </Button>
            </div>
            <div className="space-y-1 mb-6 px-2">
              <Button
                variant="secondary"
                className={`w-full justify-start bg-white hover:bg-primary hover:text-white ${
                  activeMenu == "admission-page" ? "bg-primary text-white" : ""
                } `}
                onClick={handleAdmissionsClick}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                <div className="w-full flex justify-between items-center ">
                  Admissions
                  {isArrowDown ? (
                    <ChevronDown className="mr-2 h-4 w-4" /> // Display downwards arrow
                  ) : (
                    <ChevronRight className="mr-2 h-4 w-4" /> // Display right arrow
                  )}
                </div>
              </Button>
              {showSubmenu && (
                <div className="px-2 ml-4 border-l-2">
                  <div className="p-2 inter text-sm font-normal text-gray-800 rounded-lg">
                    <Button 
                     className={`w-[174px] justify-start bg-white hover:bg-gray-100 hover:text-gray-800 ${
                      activeMenu == "admission-addnew"
                        ? "bg-gray-100 text-gray-800"
                        : ""
                    } `}
                    onClick={() => handleMenuClick("admission-addnew")}
                    >Add new</Button>
                  </div>
                  <div className="p-2 inter text-sm font-normal text-gray-800 rounded-lg">
                    <Button 
                     className={`w-[174px] justify-start bg-white hover:bg-gray-100 hover:text-gray-800 ${
                      activeMenu == "admission-analytics"
                        ? "bg-gray-100 text-gray-800"
                        : ""
                    } `}
                    onClick={() => handleMenuClick("admission-analytics")}
                    >Analytics</Button>
                  </div>
                  <div className="p-2 inter text-sm font-normal text-gray-800 rounded-lg">
                    <Button 
                     className={`w-[174px] justify-start bg-white hover:bg-gray-100 hover:text-gray-800 ${
                      activeMenu == "admission-configure"
                        ? "bg-gray-100 text-gray-800"
                        : ""
                    } `}
                    onClick={() => handleMenuClick("admission-configure")}
                    >Configure</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
