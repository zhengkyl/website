import type { MDXComponents } from "mdx/types";
import { A } from "./components/mdx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    p: (props: any /* ts is shitting itself */) => {
      if (typeof props.children !== "string" && props.children.type === "img") {
        return <>{props.children}</>;
      }

      return <p {...props}/>;
    },
    img: (props) => <img className="w-full" {...props} />,
    a: A,
    code: (props) => (
      <code className="bg-gray-100 px-1">
        {props.children}
      </code>
    ),
    pre: (props) => <pre className="bg-gray-100 border p-2 overflow-scroll">{props.children}</pre>,
    h2: (props) => <h2 {...props} className="text-xl font-bold pt-4" />,
    ol: (props) => <ol className="ps-4 list-decimal">{props.children}</ol>,
    ul: (props) => <ul className="ps-4 list-disc">{props.children}</ul>,
  };
}
