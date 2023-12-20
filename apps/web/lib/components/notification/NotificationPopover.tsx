import { BellDot } from 'lucide-react';
import { useState } from 'react';
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from 'ui';
import { cn } from 'utils';

import { NotificationItem } from './NotificationItem';

export function NotificationPopover() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const notificationCount = 10;

  return (
    <Popover>
      <PopoverTrigger
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        className={cn('rounded-full p-2', { 'bg-gray-300': isPopoverOpen })}
      >
        <BellDot size={20} className="text-gray-700" />
      </PopoverTrigger>
      <PopoverContent
        onCloseAutoFocus={() => setIsPopoverOpen(false)}
        className="w-auto p-0"
      >
        <PopoverArrow className="h-4 w-4 fill-white" />
        <header className="flex items-center justify-between px-4 py-3">
          <Text variant="base-semibold">Notifications</Text>
          <Text variant="sm-medium" className="p-0 text-sm text-gray-800">
            Mark all as read
          </Text>
        </header>
        <section>
          <Tabs>
            <TabsList className="flex justify-between rounded-none border-b-2 px-4">
              <TabsTrigger value="inbox" className="px-0 py-2">
                Inbox
                <div className="ml-1">
                  <Text
                    variant="xs-medium"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 p-1 text-primary"
                  >
                    {notificationCount}
                  </Text>
                </div>
              </TabsTrigger>

              <TabsTrigger value="general" className="px-0 py-2">
                General
                <div className="ml-1">
                  <Text
                    variant="xs-medium"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 p-1 text-primary"
                  >
                    {notificationCount}
                  </Text>
                </div>
              </TabsTrigger>
              <TabsTrigger value="archieved" className="px-0 py-2">
                Archieved
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inbox">
              <NotificationItem />
              <NotificationItem />
              <NotificationItem />
              <NotificationItem />
            </TabsContent>
            <TabsContent value="general">
              <NotificationItem />
              <NotificationItem />
              <NotificationItem />
              <NotificationItem />
            </TabsContent>
            <TabsContent value="archieved">
              <NotificationItem />
              <NotificationItem />
              <NotificationItem />
              <NotificationItem />
            </TabsContent>
          </Tabs>
          <div className="flex items-center justify-center p-1">
            <Button variant="destructive" className=" text-xs text-gray-800">
              View All
            </Button>
          </div>
        </section>
      </PopoverContent>
    </Popover>
  );
}
