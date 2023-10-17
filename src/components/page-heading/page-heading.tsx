import "./page-heading.scss";

interface PageHeadingProps {
  heading: string;
  subHeading: string;
  children?: React.ReactNode;
}

export default function PageHeading({
  heading,
  subHeading,
  children,
}: PageHeadingProps) {
  return (
    <div className="page-heading">
      <div className="header">
        <h1>{heading}</h1>
        {children}
      </div>
      <p>{subHeading}</p>
    </div>
  );
}
