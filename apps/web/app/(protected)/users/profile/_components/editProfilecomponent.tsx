'use client';
import { useState } from 'react';
import { Eye, EyeOff, Mail, UploadCloud } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <section className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center">
          <Avatar className="w-32 h-32 cursor-pointer">
            <AvatarImage src="https://avatars.githubusercontent.com/u/124599?v=4" />
          </Avatar>
          <Text variant="xl-bold" className="mt-4 text-center">
            Olivia Ryhe
          </Text>
          <span className="text-sm font-semibold text-gray-500">@Olivia</span>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input placeholder="Enter your name" className="mt-2" />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="text-sm font-medium">Mobile Number</label>
            <Input placeholder="Enter your number" className="mt-2" />
          </div>

          {/* Email */}
          <div className="col-span-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Input placeholder="Enter your email" className="pl-10 mt-2" type="email" />
              <Mail className="absolute text-gray-500 left-3 top-3" size={18} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input placeholder="Enter password" className="mt-2" type="password" />
          </div>

          {/* Confirm Password with Eye Icon */}
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <Input
                placeholder="Confirm password"
                className="pr-10 mt-2"
                type={showPassword ? 'text' : 'password'}
              />
              <div
                className="absolute text-gray-500 cursor-pointer right-3 top-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mt-6">
          <label className="flex flex-col items-center justify-center w-full h-32 transition border-2 border-gray-300 rounded-md cursor-pointer hover:border-gray-500">
            <div className="flex flex-col items-center">
              <div className="p-2 border-4 border-gray-400 rounded-full">
                <UploadCloud className="w-6 h-6 text-gray-600" />
              </div>
              <p className="mt-2 text-sm">
                <span className="font-semibold text-indigo-600">Click to Upload</span> or drag & drop
              </p>
              <p className="text-xs text-gray-500">SVG, PNG, JPG, GIF (Max: 800x400px)</p>
            </div>
            <Input type="file" className="hidden" />
          </label>
        </div>

        {/* Address Section */}
        <div className="mt-6">
          <label className="text-sm font-medium">Address</label>
          <Input placeholder="Enter your address" className="mt-2" />
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
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
              <SelectTrigger className="w-full mt-2">
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

        {/* Verify Section */}
        <div className="mt-6">
          <label className="text-sm font-semibold text-gray-700">Verify</label>
          <div className="grid grid-cols-2 gap-6 mt-2">
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

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <Button variant="outline" className="text-black border-gray-300 hover:bg-gray-200">
            Cancel
          </Button>
          <Button variant="default">Save</Button>
        </div>
      </section>
    </div>
  );
}
