'use client';
import { Eye, EyeOff, Mail, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import {
  Avatar,
  AvatarImage,
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from 'ui';

export function EditProfileComponent() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <section className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center">
          <Avatar className="h-32 w-32 cursor-pointer">
            <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
          </Avatar>
          <Text variant="xl-bold" className="mt-4 text-center">
            Olivia Ryhe
          </Text>
          <span className="text-sm font-semibold text-gray-500">@Olivia</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input placeholder="Enter your name" className="mt-2" />
          </div>

          <div>
            <label className="text-sm font-medium">Mobile Number</label>
            <Input placeholder="Enter your number" className="mt-2" />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Input
                placeholder="Enter your email"
                className="mt-2 pl-10"
                type="email"
              />
              <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <Input
              placeholder="Enter password"
              className="mt-2"
              type="password"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <Input
                placeholder="Confirm password"
                className="mt-2 pr-10"
                type={showPassword ? 'text' : 'password'}
              />
              <div
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-gray-300 transition hover:border-gray-500">
            <div className="flex flex-col items-center">
              <div className="rounded-full border-4 border-gray-400 p-2">
                <UploadCloud className="h-6 w-6 text-gray-600" />
              </div>
              <p className="mt-2 text-sm">
                <span className="font-semibold text-indigo-600">
                  Click to Upload
                </span>{' '}
                or drag & drop
              </p>
              <p className="text-xs text-gray-500">
                SVG, PNG, JPG, GIF (Max: 800x400px)
              </p>
            </div>
            <Input type="file" className="hidden" />
          </label>
        </div>

        <div className="mt-6">
          <label className="text-sm font-medium">Address</label>
          <Input placeholder="Enter your address" className="mt-2" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">City</label>
            <Input placeholder="Enter city name" className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium">State</label>
            <Input placeholder="Enter state name" className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium">District</label>
            <Input placeholder="Enter district name" className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Nationality</label>
            <Select>
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Select nationality" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm font-semibold text-gray-700">Verify</label>
          <div className="mt-2 grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input placeholder="Enter email" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input placeholder="Enter phone number" className="mt-2" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Button
            variant="outline"
            className="border-gray-300 text-black hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button variant="default">Save</Button>
        </div>
      </section>
    </div>
  );
}
