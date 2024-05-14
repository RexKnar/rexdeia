import {
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Text,
} from 'ui';

export function StudentAnalytics() {
  return (
    <section className=" ">
      <section className="space-y-2 rounded-md bg-white p-6">
        <div className="flex gap-4">
          <div className="w-4/12">
            <label className="mt-1 block text-sm text-gray-700">Exam</label>
            <Select autoComplete="off">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={'weekly'}>{'Weekly'}</SelectItem>
                  <SelectItem value={'monthly'}>{'Monthly'}</SelectItem>
                  <SelectItem value={'term'}>{'Term'}</SelectItem>
                  <SelectItem value={'anual'}>{'Anual'}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-4/12">
            <label className="mt-1 block text-sm text-gray-700">Class</label>
            <Select autoComplete="off">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={'9th'}>{'9th'}</SelectItem>
                  <SelectItem value={'10th'}>{'10th'}</SelectItem>
                  <SelectItem value={'11th'}>{'11th'}</SelectItem>
                  <SelectItem value={'12th'}>{'12th'}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-4/12">
            <label className="mt-1 block text-sm text-gray-700">Section</label>
            <Select autoComplete="off">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={'a'}>{'A'}</SelectItem>
                  <SelectItem value={'b'}>{'B'}</SelectItem>
                  <SelectItem value={'c'}>{'C'}</SelectItem>
                  <SelectItem value={'d'}>{'D'}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mt-1 block text-sm text-gray-700">Status</label>
            <RadioGroup className="mt-3 flex gap-2">
              <RadioGroupItem className="mr-1 mt-1" value={'pass'} /> {'Pass'}
              <RadioGroupItem className="ml-3 mr-1 mt-1 " value={'fail'} />
              {'Fail'}
            </RadioGroup>
          </div>
        </div>
        <div>
          <div className="mt-7 flex gap-4">
            <div className="w-full">
              <label className="mt-2 text-gray-700">Filter By Mark</label>
              <Slider
                sliderValues={[1]}
                defaultValue={[0, 100]}
                max={100}
                step={1}
                className="w-12/12 mt-3"
              />
            </div>
            <div className="mt-10 ">
              <label className="flex justify-center gap-2">
                <Checkbox /> <span>Tamil</span>
              </label>
            </div>
            <div className="mt-10">
              <label className="flex gap-2">
                <Checkbox /> <span>English</span>
              </label>
            </div>
            <div className="mt-10">
              <label className="flex gap-2">
                <Checkbox /> <span>Maths</span>
              </label>
            </div>
            <div className="w-6/12">
              <label className="mt-1 block text-sm text-gray-700">
                No of Subjects
              </label>
              <Select autoComplete="off">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={'1'}>{'1'}</SelectItem>
                    <SelectItem value={'2'}>{'2'}</SelectItem>
                    <SelectItem value={'3'}>{'3'}</SelectItem>
                    <SelectItem value={'4'}>{'4'}</SelectItem>
                    <SelectItem value={'5'}>{'5'}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-4 space-y-4 rounded-md bg-white p-6">
        <div className="flex gap-4">
          <div>
            <Card className="w-72 rounded-md bg-white">
              <CardHeader>
                <div>
                  <Text variant="base-bold">{'Pass Percentage'}</Text>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center gap-5">
                  <Text>{'Pass'}</Text>
                  <Text
                    variant="base-regular"
                    className=" rounded-lg border bg-violet-100 px-2"
                  >
                    {'90 %'}
                  </Text>
                </div>
                <div className="mt-6 flex gap-4">
                  <div className="flex justify-center gap-3">
                    <Text>{'Girls'}</Text>
                    <Text
                      variant="base-regular"
                      className=" rounded-lg border bg-violet-100 px-2"
                    >
                      {'90 %'}
                    </Text>
                  </div>
                  <div className="flex justify-center gap-3">
                    <Text>{'Boys'}</Text>
                    <Text
                      variant="base-regular"
                      className=" rounded-lg border bg-violet-100 px-2"
                    >
                      {'85 %'}
                    </Text>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="w-72 rounded-md bg-white">
              <CardHeader>
                <div>
                  <Text variant="base-bold">{'Fail Percentage'}</Text>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center gap-5">
                  <Text>{'Fail'}</Text>
                  <Text
                    variant="base-regular"
                    className=" rounded-lg border bg-violet-100 px-2"
                  >
                    {'10 %'}
                  </Text>
                </div>
                <div className="mt-6 flex gap-4">
                  <div className="flex justify-center gap-3">
                    <Text>{'Girls'}</Text>
                    <Text
                      variant="base-regular"
                      className=" rounded-lg border bg-violet-100 px-2"
                    >
                      {'7 %'}
                    </Text>
                  </div>
                  <div className="flex justify-center gap-3">
                    <Text>{'Boys'}</Text>
                    <Text
                      variant="base-regular"
                      className=" rounded-lg border bg-violet-100 px-2"
                    >
                      {'3 %'}
                    </Text>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <div>
            <Card className="w-72 rounded-md bg-white">
              <CardHeader>
                <div>
                  <Text variant="base-bold">{'First Mark'}</Text>
                </div>
              </CardHeader>
              <CardContent>
                <div className="my-auto flex justify-center px-5 pb-2 ">
                  <Text variant="base-bold">{'Name'}</Text>
                </div>
                <div className="flex justify-center gap-5">
                  <Text>{'Mark'}</Text>
                  <Text
                    variant="base-regular"
                    className=" rounded-lg border bg-violet-100 px-2"
                  >
                    {'485'}
                  </Text>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="w-72 rounded-md bg-white">
              <CardHeader>
                <div>
                  <Text variant="base-bold">{'Last Mark'}</Text>
                </div>
              </CardHeader>
              <CardContent>
                <div className="my-auto flex justify-center px-5 pb-2 ">
                  <Text variant="base-bold">{'Name'}</Text>
                </div>
                <div className="flex justify-center gap-5">
                  <Text>{'Mark'}</Text>
                  <Text
                    variant="base-regular"
                    className=" rounded-lg border bg-violet-100 px-2"
                  >
                    {'285'}
                  </Text>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </section>
  );
}
