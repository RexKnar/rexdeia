import { useUpdateStudentMutationById } from 'lib/queries/students/useUpdateStudentMutationByIdQuery';
import { Camera, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, useToast } from 'ui';

const ProfilePicture = ({
  firstName,
  lastName,
  profileImage,
  studentId,
}: {
  firstName: string;
  lastName: string;
  studentId: string;
  profileImage?: string;
}) => {
  const [imageHover, setImageHover] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const initials = `${firstName[0]}${lastName?.[0] || firstName[1] || ''}`;
  const { mutateAsync: updateStudentMutationAsync } =
    useUpdateStudentMutationById();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please upload an image file',
      });
      return;
    }

    if (file.size > 0.5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
      });
      return;
    }

    try {
      const url = new URL(`${window.location.origin}/api/upload`);

      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const imageResponse = await fetch(url.toString(), {
        method: 'POST',
        body: formData,
      });

      if (!imageResponse.ok) {
        throw new Error('Upload failed');
      }

      const { data: fileData } = await imageResponse.json();
      if (!fileData?.filePath) {
        toast({
          title: 'Failed!',
          variant: 'destructive',
          description: 'Something went wrong, please try again!',
        });
      } else {
        const payload = {
          profileImage: fileData?.filePath,
        };
        const response = await updateStudentMutationAsync({
          id: studentId,
          ...payload,
        });
        if (response) {
          toast({
            title: 'Success',
            description: 'Profile picture updated successfully',
          });
        } else {
          toast({
            title: 'Failed!',
            variant: 'destructive',
            description: 'Something went wrong, please try again!',
          });
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'There was an error uploading your image',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog>
      <div className="flex justify-center">
        {isUploading ? (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
            <span className="text-xl font-bold">Loading...</span>
          </div>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setImageHover(true)}
            onMouseLeave={() => setImageHover(false)}
          >
            {profileImage ? (
              <DialogTrigger>
                <div className="h-20 w-20 overflow-hidden rounded-full">
                  <Image
                    src={`${profileImage}`}
                    objectFit="cover"
                    layout="fill"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              </DialogTrigger>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                <span className="text-xl font-bold">{initials}</span>
              </div>
            )}

            {imageHover && (
              <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-50 transition-all duration-200">
                <DialogTrigger>
                  <ZoomIn className="text-white" />
                </DialogTrigger>
              </div>
            )}
          </div>
        )}
      </div>

      <DialogContent className="max-w-3xl">
        <div className="relative">
          <label className="absolute right-2 top-2 cursor-pointer rounded-full bg-white p-2 shadow-lg transition-colors hover:bg-gray-100">
            <Camera className="h-5 w-5" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
          {!isUploading ? (
            <span>
              {profileImage ? (
                <div className="aspect-square w-full">
                  <Image
                    src={`${profileImage}`}
                    objectFit="cover"
                    layout="fill"
                    alt="Profile"
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-gray-200">
                  <span className="text-6xl font-bold">{initials}</span>
                </div>
              )}
            </span>
          ) : (
            <div className="flex aspect-square w-full items-center justify-center bg-gray-200">
              <span className="text-6xl font-bold">Uploading...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePicture;
