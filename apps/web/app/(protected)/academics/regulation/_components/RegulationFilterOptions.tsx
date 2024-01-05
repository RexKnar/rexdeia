import { ChevronDown, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui';

export function RegulationFilterOptions() {
  return (
    <section className="flex justify-end gap-3">
      <div className="mt-3">
        <Select>
          <SelectTrigger>
            <SelectValue
              className="text-sm font-normal text-gray-800"
              placeholder="Sort by: Date Created"
            />
            <ChevronDown className="ml-3" size={18} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={'defaultValue'}>
                Sort by: Date Created
              </SelectItem>
              <SelectItem value={'option1'}>Option 1</SelectItem>
              <SelectItem value={'option2'}>Option 2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-3">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Filter" />
            <Filter className="ml-3" size={14} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={'option1'}>Option 1</SelectItem>
              <SelectItem value={'option2'}>Option 2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-3">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Edit Columns" />
            <ChevronDown className="ml-3" size={18} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={'option1'}>Option 1</SelectItem>
              <SelectItem value={'option2'}>Option 2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
