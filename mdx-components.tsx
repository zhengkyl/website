import type { MDXComponents } from "mdx/types";
import { A, Code } from "./components/mdx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    p: (props: any /* ts is shitting itself */) => {
      if (typeof props.children !== "string" && props.children.type === "img") {
        return <>{props.children}</>;
      }

      return <p {...props} />;
    },
    img: (props) => <img className="w-full" {...props} />,
    a: A,
    code: Code,
    pre: (props) => (
      <pre className="bg-gray-100 border p-2 overflow-scroll">
        {props.children}
      </pre>
    ),
    h2: (props) => <h2 {...props} className="text-xl font-bold pt-4" />,
    h3: (props) => <h3 {...props} className="text-lg font-bold pt-2" />,
    ol: (props) => <ol className="ps-4 list-decimal flex flex-col gap-2">{props.children}</ol>,
    ul: (props) => <ul className="ps-4 list-circle">{props.children}</ul>,
  };
}
