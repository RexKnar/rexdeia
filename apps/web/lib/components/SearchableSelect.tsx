'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui';

interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: string; name: string }[];
  placeholder?: string;
  disabled?: boolean;
}

// eslint-disable-next-line no-undef
export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select',
  disabled = false,
}) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filteredOptions = options.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      <Select
        value={value}
        onValueChange={(val) => {
          onChange(val);
          setSearch('');
        }}
        disabled={disabled}
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setSearch('');
          }
        }}
      >
        <SelectTrigger className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          className="max-h-64 overflow-y-auto"
          onMouseDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 border-b bg-white p-2">
            <Input
              ref={inputRef}
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>

          <SelectGroup>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.id}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-100"
                >
                  {item.name}
                </SelectItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No results found
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
