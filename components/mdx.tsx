import clsx from "clsx";

export function P(props) {
  if (typeof props.children !== "string" && props.children.type === "img") {
    return <>{props.children}</>;
  }

  return <p>{props.children}</p>;
}

export function A(props) {
  const text = props.children ?? props.href;
  const url = props.href ?? props.children;
  return (
    <a
      className="hover:underline font-semibold text-rose-6"
      href={url}
      target="_blank"
    >
      {typeof text === "string" ? text.replace("https://", "") : text}
    </a>
  );
}

export function Card(props) {
  return (
    <div className={clsx("rounded border p-4 my-4", props.className)}>
      {props.children}
    </div>
  );
}

export function Link(props) {
  return (
    <div>
      <span className="font-bold mr-2">{props.title}</span>
      <A {...props} />
    </div>
  );
}

export function Img(props) {
  return <img alt="" {...props} border="~ rounded" />;
}

export function Code(props) {
  return (
    <code color="black" bg="stone-200" border="rounded" p="y-0.5 x-1" text="sm">
      {props.children}
    </code>
  );
}
