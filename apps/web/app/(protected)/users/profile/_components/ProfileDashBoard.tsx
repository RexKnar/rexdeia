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

export function ProfileDashBoard() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center">
      <section className="flex flex-col justify-center space-y-2 rounded-md bg-white p-4">
        <div className="mb-4 flex flex-col items-center justify-center">
          <Avatar className="h-32 w-32 cursor-pointer">
            <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
          </Avatar>
          <Text variant="xl-bold" className="mt-4 text-center">
            Olivia Ryhe
          </Text>
          <label className="text-sm font-semibold text-gray-700">@Olivia</label>
        </div>
        <div className="grid grid-cols-2 justify-between gap-6">
          <div className="mt-4">
            <label htmlFor="name" className="text-sm font-medium">
              First Name
            </label>
            <Input
              placeholder="First Name"
              autoFocus
              className="mt-2"
              id="name"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="name" className="text-sm font-medium">
              Last Name
            </label>
            <Input placeholder="Last Name" className="mt-2" id="name" />
          </div>
          <div>
            <label className="text-sm font-medium">Mobile Number</label>
            <Input placeholder="Mobile Number" className="mt-2" id="name" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Input
                placeholder="Email"
                className="mt-2 pl-8"
                id="name"
                type="email"
              />
              <div className="absolute inset-y-0 left-0 flex cursor-pointer items-center pl-2">
                <Mail size={20} strokeWidth={0.5} />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input placeholder="Password" className="mt-2" id="name" />
          </div>
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <Input
                placeholder="Confirm Password"
                className="mt-2"
                id="name"
                type={showPassword ? 'text' : 'password'}
              />
              <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2">
                <div onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <Eye size={20} strokeWidth={0.5} />
                  ) : (
                    <EyeOff size={20} strokeWidth={0.5} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-3 pt-5">
          <div className="mt-2 basis-2.5">
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
            </Avatar>
          </div>
          <div className="flex w-full items-center justify-center">
            <label className="flex h-32 w-full flex-col items-center justify-center border-2 ">
              <div className="flex flex-col items-center justify-center">
                <div className=" rounded-full border-4 border-gray-400 p-2">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="mb-2 text-sm">
                  <span className="font-semibold text-indigo-600">
                    {' '}
                    Click to Upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-xs">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
              <Input type="file" className="hidden" />
            </label>
          </div>
        </div>
        <div className="pt-2">
          <label className="text-sm font-medium">Address line 1</label>
          <Input placeholder="Address" className="mt-2 w-full" id="name" />
        </div>
        <div className="grid grid-cols-2 justify-between gap-6">
          <div>
            <label className="text-sm font-medium">City</label>
            <Input placeholder="City Name" className="mt-2" id="name" />
          </div>
          <div>
            <label className="text-sm font-medium">State</label>
            <Input placeholder="State Name" className="mt-2" id="name" />
          </div>
          <div>
            <label className="text-sm font-medium">District</label>
            <Input
              placeholder="District Name"
              className="mb-2 mt-2"
              id="name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Nationality</label>
            <Select>
              <SelectTrigger className="mt-2 w-full border-primary-200">
                <SelectValue
                  placeholder="Select a Nationality"
                  className="text-gray-700"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Afghanistan">Afghanistan</SelectItem>
                  <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                  <SelectItem value="Brazil">Brazil</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <hr className="border-t border-gray-300"></hr>
        <label className="pt-3 text-sm font-semibold text-gray-700">
          Verify
        </label>
        <div className="grid grid-cols-2 justify-between gap-6">
          <div>
            <label className="font-font-medium text-sm">Email</label>
            <Input placeholder="Enter Email" className="mb-3 mt-2" id="name" />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              placeholder="Enter Phone Number"
              className="mt-2"
              id="name"
            />
          </div>
        </div>
        <hr className="border-t border-gray-300"></hr>
        <section className="flex justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-primary-200 text-black"
          >
            Cancel
          </Button>
          <Button variant="default" size="sm">
            Save
          </Button>
        </section>
      </section>
    </div>
  );
}
