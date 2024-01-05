import React, { useState } from 'react';
import { Button } from 'ui';

export function ClassWidget() {
  const [buttons, setButtons] = useState([
    { label: 'A', className: 'h-7 w-7 rounded p-1 text-sm' },
    { label: 'C', className: 'h-7 w-7 rounded p-1 text-sm' },
    { label: 'D', className: 'h-7 w-7 rounded p-1 text-sm' },
  ]);

  const handleAddButtonClick = () => {
    const lastLabel =
      buttons.length > 0 ? buttons[buttons.length - 1].label : 'A';
    const nextLabel = String.fromCharCode(lastLabel.charCodeAt(0) + 1);

    const newButton = {
      label: nextLabel,
      className: 'h-7 w-7 gap-1 rounded p-1 text-sm',
    };

    setButtons([...buttons, newButton]);
  };

  return (
    <div className="widget-container space-y-4">
      <div className="widget h-32 min-w-80 rounded-lg border border-primary-200 bg-white p-4 shadow-md">
        <div className="widget-title  flex items-center text-lg font-semibold">
          Class Name
          <Button
            variant="outline"
            className="w-18 ml-auto h-6 rounded border-primary-300 p-2 text-sm text-black"
          >
            Students
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap content-center items-center gap-2 self-stretch">
          {buttons.map((button, index) => (
            <Button key={index} className={button.className}>
              {button.label}
            </Button>
          ))}
          <Button
            variant="outline"
            className="h-7 w-7 gap-1 rounded p-1"
            onClick={handleAddButtonClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"
                fill="#6559FC"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 4C12.5523 4 13 4.44772 13 5V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V5C11 4.44772 11.4477 4 12 4Z"
                fill="#6559FC"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
