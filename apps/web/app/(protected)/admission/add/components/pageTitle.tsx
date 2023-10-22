interface PageTitleProps {
  title: string;
}

export function PageTitle(props: PageTitleProps) {
  return (
    <div className="text-xl font-medium text-black">
      <h1>{props.title}</h1>
    </div>
  );
}
