import { useState } from 'react';
import { Button, Checkbox, Slider } from 'ui';

export function AnalyticStudentList() {
  const [sliderValues, setSliderValues] = useState([0, 100]);
  const handleValueChange = (newValue) => {
    setSliderValues(newValue);
  };

  const subjects = [
    {
      id: 'subjectd',
      value: 'Tamil',
    },
    {
      id: 'subjectd',
      value: 'English',
    },
    {
      id: 'subjectd',
      value: 'Maths',
    },
    {
      id: 'subjectd',
      value: 'Science',
    },
    {
      id: 'subjectd',
      value: 'Social',
    },
  ];

  return (
    <section>
      <div>
        <div className="mt-7 flex gap-4">
          <div className="w-8/12">
            <label className="mt-2 text-gray-700">Filter By Mark</label>
            <div className="mt-2 flex">
              <input
                className="mt-2 w-8 text-center"
                type="number"
                maxLength={sliderValues[1]}
                value={sliderValues[0]}
                onChange={(e) => {
                  setSliderValues([parseInt(e.target.value), sliderValues[1]]);
                }}
              />
              <Slider
                sliderValues={sliderValues}
                value={sliderValues}
                onValueChange={(value) => handleValueChange(value)}
                defaultValue={sliderValues}
                max={100}
                step={1}
                className="ml-3"
              />
              <input
                className="ml-3 mt-2 w-8 text-center "
                type="number"
                minLength={sliderValues[0]}
                maxLength={100}
                value={sliderValues[1]}
                onChange={(e) => {
                  setSliderValues([sliderValues[0], parseInt(e.target.value)]);
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 grid-rows-2 gap-3">
            {subjects.map((item, index) => (
              <div className="flex items-center gap-2" key={index}>
                <Checkbox value={item.id} key={index} />
                <span>{item.value}</span>
              </div>
            ))}{' '}
          </div>
        </div>
      </div>
      <div className="mt-10 flex items-center justify-center ">
        <Button className="mt-10 rounded px-4 py-2 font-bold text-white ">
          {'Apply'}
        </Button>
      </div>
    </section>
  );
}
