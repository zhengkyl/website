import type { MDXComponents } from "mdx/types";
import { A } from "./components/mdx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    p: (props: any /* ts is shitting itself */) => {
      if (typeof props.children !== "string" && props.children.type === "img") {
        return <>{props.children}</>;
      }

      return <p>{props.children}</p>;
    },
    img: (props) => <img className="w-full" {...props} />,
    a: A,
    code: (props) => (
      <code className="bg-stone-200 rounded py-0.4 px-1 text-sm">
        {props.children}
      </code>
    ),
    pre: (props) => <pre className="">{props.children}</pre>,
    h2: (props) => <h2 {...props} className="text-xl font-bold pt-4" />,
    ol: (props) => <ol className="ps-4 list-decimal">{props.children}</ol>,
    ul: (props) => <ul className="ps-4 list-disc">{props.children}</ul>,
  };
}
