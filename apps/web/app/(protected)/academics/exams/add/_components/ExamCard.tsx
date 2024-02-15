import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function ExamCard(props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <div
      className="cursor-pointer border-b-2 border-white p-2 font-medium"
      onClick={() => {
        const params = new URLSearchParams(searchParams);
        params.set('classId', props.examProps.id);

        router.push(pathname + '?' + params.toString());
      }}
    >
      {props.examProps.name}
    </div>
  );
}
