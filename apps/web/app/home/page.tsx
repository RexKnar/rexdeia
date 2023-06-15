import { cn } from 'utils';

export default function Page() {
  return (
    <>
      <p className="ml-4 rounded-full uppercase">Save Changes</p>
      <button className={cn('ml-4 rounded-full bg-amber-500 uppercase')}>
        Save Changes
      </button>
    </>
  );
}
