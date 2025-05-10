'use client';
export const DynamicHeading = ({
  level,
  content,
}: {
  level: number;
  content: string;
}) => {
  // eslint-disable-next-line no-undef
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  const headingClasses = {
    1: 'text-4xl font-bold',
    2: 'text-3xl font-semibold',
    3: 'text-2xl font-semibold',
    4: 'text-xl font-medium',
    5: 'text-lg font-medium',
    6: 'text-base font-medium uppercase tracking-wide',
  };

  return <HeadingTag className={headingClasses[level]}>{content}</HeadingTag>;
};
