import { FileInput } from 'lucide-react';
import Image from 'next/image';
import { Button } from 'ui';

import admissionrequest from '../../../../public/assets/images/admission-request.svg';
import inprogress from '../../../../public/assets/images/in-progress.svg';
import rejected from '../../../../public/assets/images/rejected.svg';
import shortlisted from '../../../../public/assets/images/short-listed.svg';
import { getAdmissionList } from '../../../api/admissionlist/service';
import { AdmissionListModel, columns } from './columns';
import { DataTable } from './data-table';

async function getData(): Promise<AdmissionListModel[]> {
  const admissionList = await getAdmissionList();
  const data: AdmissionListModel[] = JSON.parse(JSON.stringify(admissionList));
  return data.map((x, i) => ({ slNo: i + 1, ...x }));
}

export default async function Page() {
  const data = await getData();
  return (
    <>
      <section className="h-screen w-full bg-gray-50 p-3">
        <div className="mx-6 mt-8">
          <div className="flex justify-between">
            <div>
              <span className="text-xs font-medium text-gray-700">Acadx</span>{' '}
              <span className="text-gray-700">/</span>
              <span className="text ml-2 text-sm font-semibold text-gray-700">
                Dashboard
              </span>
              <h1 className="mt-2 font-semibold">Dashboard</h1>
            </div>
            <div className="relative flex">
              <Button className="text-white">
                <FileInput size={16} className="mr-2" />
                Admission Form
              </Button>
            </div>
          </div>

          <div>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:flex-row md:grid md:grid-cols-2 lg:grid lg:grid-cols-3 xl:grid xl:grid-cols-4">
              <div className="flex rounded-md border border-blue-100 bg-white p-3 shadow">
                <div className="rounded-full bg-blue-50">
                  <Image
                    src={admissionrequest}
                    alt={'icon'}
                    width={50}
                    height={50}
                  ></Image>
                </div>
                <div className="ml-4">
                  <span className="text-xs text-gray-700">
                    Admission Request
                  </span>
                  <h1 className="font-semibold">1.5K</h1>
                </div>
              </div>
              <div className="flex rounded-md border border-blue-100 bg-white p-3 shadow">
                <div className="rounded-full bg-blue-50">
                  <Image
                    src={shortlisted}
                    alt={'icon'}
                    width={50}
                    height={50}
                  ></Image>
                </div>
                <div className="ml-4">
                  <span className="text-xs text-gray-700">Short listed</span>
                  <h1 className="font-semibold">450</h1>
                </div>
              </div>
              <div className="flex rounded-md border border-blue-100 bg-white p-3 shadow">
                <div className="rounded-full bg-blue-50">
                  <Image
                    src={rejected}
                    alt={'icon'}
                    width={50}
                    height={50}
                  ></Image>
                </div>
                <div className="ml-4">
                  <span className="text-xs text-gray-700">Rejected</span>
                  <h1 className="font-semibold">3.5</h1>
                </div>
              </div>
              <div className="flex rounded-md border border-blue-100 bg-white p-3 shadow">
                <div className="rounded-full bg-blue-50">
                  <Image
                    src={inprogress}
                    alt={'icon'}
                    width={50}
                    height={50}
                  ></Image>
                </div>
                <div className="ml-4">
                  <span className="text-xs text-gray-700">In-progress</span>
                  <h1 className="font-semibold">3K</h1>
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid md:grid-cols-2">
              <div className="rounded-md border border-blue-100 bg-white p-3 shadow">
                Generating random paragraphs can be an excellent way for writers
                to get their creative flow going at the beginning of the day.
                The writer has no idea what topic the random paragraph will be
                about when it appears. This forces the writer to use creativity
                to complete one of three common writing challenges. The writer
                can use the paragraph as the first one of a short story and
                build upon it. A second option is to use the random paragraph
                somewhere in a short story they create. The third option is to
                have the random paragraph be the ending paragraph in a short
                story. No matter which of these challenges is undertaken, the
                writer is forced to use creativity to incorporate the paragraph
                into their writing
              </div>
              <div className="rounded-md border border-blue-100 bg-white p-3 shadow">
                Generating random paragraphs can be an excellent way for writers
                to get their creative flow going at the beginning of the day.
                The writer has no idea what topic the random paragraph will be
                about when it appears. This forces the writer to use creativity
                to complete one of three common writing challenges. The writer
                can use the paragraph as the first one of a short story and
                build upon it. A second option is to use the random paragraph
                somewhere in a short story they create. The third option is to
                have the random paragraph be the ending paragraph in a short
                story. No matter which of these challenges is undertaken, the
                writer is forced to use creativity to incorporate the paragraph
                into their writing
              </div>
            </div>
          </div>
          <h1 className="mt-96 text-center text-3xl font-semibold text-primary">
            Admission List
          </h1>
          <div className="mx-auto py-10">
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </section>
    </>
  );
}
