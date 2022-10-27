import classnames from "classnames";
import React from "react";

export const Container = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={classnames("px-8 max-w-screen-lg m-auto", className)}
    {...props}
  >
    {children}
  </div>
);

export const SplitAlign = ({
  children,
  className,
}: React.HtmlHTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={classnames("flex justify-between items-end", className)}>
      {children}
    </div>
  );
};
