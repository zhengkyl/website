import type { ComponentChildren, ComponentProps } from "preact";

export function Sa(props: { href?: string; children?: ComponentChildren }) {
  const text = props.children ?? props.href;
  const url =
    props.href ??
    (typeof props.children === "string" ? props.children : undefined);
  return (
    <a className="@hover-underline font-semibold" href={url} target="_blank">
      {typeof text === "string" ? text.replace("https://", "") : text}
    </a>
  );
}

export const components = {
  a: (props: ComponentProps<"a">) => (
    <a
      className="@hover-underline font-semibold text-rose-600"
      target="_blank"
      {...props}
    />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="text-xl font-bold pt-4" {...props} />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="text-lg font-bold pt-2" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="ps-4 list-decimal flex flex-col gap-2" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="ps-4 list-circle" {...props} />
  ),
};
