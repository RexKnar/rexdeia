import { UpdateCourseChapterItemRequestModel } from 'lib/domain/institute/chapterItem';
import { useGetChapterItemByIdQuery } from 'lib/queries/institute/course/chapterItem/useGetChapterItemByIdQuery';
import { useUpdateChapterItemMutationQuery } from 'lib/queries/institute/course/chapterItem/useUpdateChapterItemMutationQuery';
import {
  FileText,
  FileVideo2,
  MonitorPlay,
  SquarePlay,
  Upload,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, useToast } from 'ui';
import { v4 as uuidv4 } from 'uuid';

import ContentBuilder from '@/components/shared/ContentBuilder';
import { DynamicHeading } from '@/components/shared/DynamicHeading';
import VideoPlayer from '@/components/video/VideoPlayer';
import { useQueryParams } from '@/hooks/useQueryParams';

import VideoOptionCard from './VideoOptionCard';

export default function ChapterItemContentArea({
  editable,
}: {
  editable: boolean;
}) {
  const { getParam } = useQueryParams();
  const itemId = getParam('chapterItemId');
  const [videoType, setVideoType] = useState('youtube');
  const [pdfType, setPdfType] = useState('pdfUrl');
  const [isEditable, setIsEditable] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors: fieldErrors },
  } = useForm();
  const { toast } = useToast();
  const { data: chapterItemDetails, isLoading: isGetChapterItemLoading } =
    useGetChapterItemByIdQuery(itemId);
  const { mutateAsync: mutateUpdateChapterItemAsync } =
    useUpdateChapterItemMutationQuery(itemId);
  const handleFormSubmit = async (
    payload: UpdateCourseChapterItemRequestModel
  ) => {
    try {
      const response = await mutateUpdateChapterItemAsync(payload);
      if (response?.id) {
        toast({
          title: 'Success',
          variant: 'default',
          description: 'Changes saved successfully',
        });
        setIsEditable(false);
      } else {
        toast({
          title: 'Error',
          variant: 'default',
          description: 'Error while saving changes',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/') || file.size > 100 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Invalid file',
        description: 'Only images under 100MB are allowed.',
      });
      return;
    }

    try {
      const url = new URL(`${window.location.origin}/api/upload/video`);
      const formData = new FormData();
      formData.append('file', file);

      const imageResponse = await fetch(url.toString(), {
        method: 'POST',
        body: formData,
      });

      if (!imageResponse.ok) throw new Error('Upload failed');

      const { data } = await imageResponse.json();
      const key = data?.filePath;

      if (!key) {
        toast({
          title: 'Failed!',
          variant: 'destructive',
          description: 'No file key returned.',
        });
        return;
      } else {
        setValue('videoUrl', key);

        toast({ title: 'Success', description: 'Video uploaded.' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'An error occurred during upload.',
      });
    }
  };

  useEffect(() => {
    reset();
    if (chapterItemDetails?.youtubeUrl) {
      setValue('youtubeUrl', chapterItemDetails?.youtubeUrl);
    }
    if (chapterItemDetails?.vimeoUrl) {
      setValue('vimeoUrl', chapterItemDetails?.vimeoUrl);
    }
    if (chapterItemDetails?.videoUrl) {
      setValue('videoUrl', chapterItemDetails?.videoUrl);
    }
    if (chapterItemDetails?.pdfUrl) {
      setValue('pdfUrl', chapterItemDetails?.pdfUrl);
    }
    if (chapterItemDetails?.textContent) {
      setValue('textContent', chapterItemDetails?.textContent);
    }
    if (chapterItemDetails?.imageUrl) {
      setValue('imageUrl', chapterItemDetails?.imageUrl);
    }
  }, [chapterItemDetails, setValue]);

  function extractVideoId(url: String): String | null {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }
  return isGetChapterItemLoading ? (
    <h1>Loading...</h1>
  ) : (
    <section>
      {isEditable ? (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="flex justify-between">
            <h1 className="text-xl font-bold ">{chapterItemDetails?.name}</h1>
            <Button type="submit" variant="default" size="sm">
              Save Changes
            </Button>
          </div>
          {chapterItemDetails?.itemType === 'video' && (
            <section className="w-full pt-4">
              <div className="mb-2 flex px-2">
                <p className="text-sm text-gray-700">
                  Please select the type of video you are creating.
                </p>
              </div>
              <div className="flex px-2 pb-2">
                <VideoOptionCard
                  name="Youtube"
                  IconComponent={SquarePlay}
                  isSelected={videoType === 'youtube'}
                  onClick={() => setVideoType('youtube')}
                />
                <VideoOptionCard
                  name="Vimeo"
                  IconComponent={MonitorPlay}
                  isSelected={videoType === 'vimeo'}
                  onClick={() => setVideoType('vimeo')}
                />
                <VideoOptionCard
                  name="Upload"
                  IconComponent={FileVideo2}
                  isSelected={videoType === 'upload'}
                  onClick={() => setVideoType('upload')}
                />
              </div>
              <section className="w-full p-3">
                <div>
                  {videoType === 'youtube' && (
                    <Input
                      type="text"
                      placeholder="Paste the Youtube url"
                      errorMessage={fieldErrors?.youtubeUrl?.message.toString()}
                      {...register('youtubeUrl', {
                        required: 'Please enter a valid youtube url',
                      })}
                    />
                  )}
                  {videoType === 'vimeo' && (
                    <Input
                      type="text"
                      placeholder="Paste the Vimeo url"
                      errorMessage={fieldErrors?.vimeoUrl?.message.toString()}
                      {...register('vimeoUrl', {
                        required: 'Please enter a valid vimeo url',
                      })}
                    />
                  )}
                  {videoType === 'upload' && (
                    <input
                      type="file"
                      onChange={handleVideoUpload}
                      placeholder="Upload your video"
                      // errorMessage={fieldErrors?.videoUrl?.message.toString()}
                      // {...register('videoUrl', {
                      //   required: 'Please enter a valid video url',
                      // })}
                    />
                  )}
                </div>
              </section>
            </section>
          )}
          {chapterItemDetails?.itemType === 'pdf' && (
            <section>
              <div className="mb-2 flex px-2">
                <p className="text-sm text-gray-700">
                  Please upload the pdf file.
                </p>
              </div>
              <div className="flex px-2 pb-2">
                <VideoOptionCard
                  name="PDF url"
                  IconComponent={FileText}
                  isSelected={pdfType === 'pdfUrl'}
                  onClick={() => setPdfType('pdfUrl')}
                />
                <VideoOptionCard
                  name="Upload PDF"
                  IconComponent={Upload}
                  isSelected={pdfType === 'uploadPdf'}
                  onClick={() => setPdfType('uploadPdf')}
                />
              </div>
              <section className="w-full p-3">
                <div>
                  {pdfType === 'pdfUrl' && (
                    <Input
                      type="text"
                      placeholder="Paste the PDF url"
                      errorMessage={fieldErrors?.pdfUrl?.message.toString()}
                      {...register('pdfUrl', {
                        required: 'Please enter a valid PDF File url',
                      })}
                    />
                  )}
                  {pdfType === 'uploadPdf' && (
                    <Input
                      type="file"
                      placeholder="Upload your PDF"
                      errorMessage={fieldErrors?.pdfUrl?.message.toString()}
                      {...register('pdfUrl', {
                        required: 'Please upload a valid PDF File',
                      })}
                    />
                  )}
                </div>
              </section>
            </section>
          )}
          {chapterItemDetails?.itemType === 'text' && (
            <ContentBuilder
              preFillContent={
                chapterItemDetails?.textContent || [
                  {
                    id: uuidv4(),
                    type: 'heading',
                    level: 2,
                    content: 'Sample Title',
                  },
                ]
              }
              onChange={(data) => {
                setValue('textContent', data);
              }}
            />
          )}
        </form>
      ) : (
        <div className="w-full px-5">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold ">{chapterItemDetails?.name}</h1>
            {editable && (
              <Button
                type="button"
                onClick={() => setIsEditable(true)}
                variant="default"
                size="sm"
              >
                Edit
              </Button>
            )}
          </div>
          {chapterItemDetails?.youtubeUrl && (
            <div className="w-full pt-4">
              <div className="flex flex-wrap gap-2">
                {chapterItemDetails?.youtubeUrl && (
                  <div className="aspect-video w-full">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${extractVideoId(chapterItemDetails?.youtubeUrl)}`}
                      title="YouTube Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {chapterItemDetails?.videoUrl && (
            <div className="w-full pt-4">
              <div className="flex flex-wrap gap-2">
                {/* <iframe
                  width="100%"
                  height="100%"
                  src={chapterItemDetails?.videoUrl}
                  title="YouTube Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                /> */}
                <VideoPlayer
                  // videoSrc={chapterItemDetails?.videoUrl}
                  filePath={chapterItemDetails?.videoUrl}
                  watermark="Your LMS Name • User: john.doe@example.com"
                />
              </div>
            </div>
          )}
          {chapterItemDetails?.textContent &&
            chapterItemDetails?.textContent?.map((item) => (
              <div className="w-full pt-4" key={item.id}>
                {item.type === 'heading' && (
                  <DynamicHeading level={item.level} content={item.content} />
                )}
                {item.type === 'paragraph' && (
                  <p className="text-md font-normal">{item.content}</p>
                )}
                {item.type === 'list' &&
                  (item.style === 'unordered' ? (
                    <ul
                      style={{ listStyleType: 'disc' }}
                      className="text-md pl-4 font-normal"
                    >
                      {item.items.map((li, idx) => (
                        <li key={idx}>{li}</li>
                      ))}
                    </ul>
                  ) : (
                    <ol
                      style={{ listStyleType: 'decimal' }}
                      className="text-md pl-4 font-normal"
                    >
                      {item.items.map((li, idx) => (
                        <li key={idx}>{li}</li>
                      ))}
                    </ol>
                  ))}
                {item.type === 'image' && (
                  <div className="w-full">
                    <img src={item.src} alt={item.alt} className="w-full" />
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </section>
  );
}
