import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function ExamConfigurationNameCard(props) {
  const { type, queryValue, name, openFlyout } = props;
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const paramsKeyVal = params.get(type);

  return (
    <div
      className="cursor-pointer border-b-2 border-white p-2 font-medium"
      onClick={() => {
        params.set(type, queryValue);

        openFlyout ? params.set('isExamConfigureFlyoutOpen', 'true') : null;
        router.replace(pathname + '?' + params.toString());
      }}
    >
      <div>
        {paramsKeyVal == queryValue ? (
          <p className="text-green-500">{name}</p>
        ) : (
          <p>{name}</p>
        )}
      </div>
    </div>
  );
}
