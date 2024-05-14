import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function ExamConfigurationNameCard(props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <div
      className="cursor-pointer border-b-2 border-white p-2 font-medium"
      onClick={() => {
        const params = new URLSearchParams(searchParams);
        if (props.examProps.Section) {
          params.set('classId', props.examProps.id);
        } else if (props.examProps.mediumId) {
          params.set('sectionId', props.examProps.id);
        } else if (props.examProps.regulationId) {
          params.set('subjectId', props.examProps.id);
          params.set('isExamConfigureFlyoutOpen', 'true');
        } else {
          params.set('subjectTypeId', props.examProps.id);
        }
        router.replace(pathname + '?' + params.toString());
      }}
    >
      {props.examProps.name}
    </div>
  );
}
