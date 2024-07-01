import { Helmet } from "react-helmet-async";
import { FC } from "react";

interface ILayoutProps {
  children: any;
  title: string;
  description: string;
  keywords: string;
}

const Layout: FC<ILayoutProps> = ({
  children,
  title,
  description,
  keywords,
}) => {
  return (
    <>
      <div className="content m-2 p-2">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{title}</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="robots" content="index, follow" />
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link
            rel="stylesheet"
            href="/bootstrap-icons/bootstrap-icons.min.css"
          />
        </Helmet>
        {children}
      </div>
    </>
  );
};

export default Layout;
