'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Text,
} from 'ui';

const EditUserPasswordFlyOut = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('isUserPasswordFlyoutOpen') === 'true';

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const closeFlyout = () => {
    const params = new URLSearchParams(searchParams);
    params.set('isUserPasswordFlyoutOpen', 'false');
    router.replace(pathname + '?' + params.toString());
  };

  return (
    <section>
      <Sheet open={isOpen}>
        <SheetContent side="right" widthSize="sm" className="p-10 bg-white">
          <SheetHeader>
            <SheetTitle className="flex items-center mb-6">
              <Lock size={20} strokeWidth={1.5} />
              <Text variant="lg-semibold" className="ml-2">Change Password</Text>
            </SheetTitle>
            <hr className="mb-6 border-t border-gray-300" />
          </SheetHeader>
          <div className="space-y-4">
            <Input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={formData.oldPassword}
              onChange={handleChange}
            />
            <Input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="outline" onClick={closeFlyout}>
              Cancel
            </Button>
            <Button>Update Password</Button>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default EditUserPasswordFlyOut;
