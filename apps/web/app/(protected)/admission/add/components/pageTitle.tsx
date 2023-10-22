interface PageTitleProps {
  title: string;
}

export function PageTitle(props: PageTitleProps) {
  return (
    <div className="text-black text-xl font-medium">
      <h1>{props.title}</h1>
    </div>
  );
}
