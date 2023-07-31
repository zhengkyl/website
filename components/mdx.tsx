export function P(props) {
  if (typeof props.children !== "string" && props.children.type === "img") {
    return <>{props.children}</>;
  }

  return <p className="my-4">{props.children}</p>;
}

export function A(props) {
  const text = props.children ?? props.href;
  const url = props.href ?? props.children;
  return (
    <a className="hover:underline" href={url} target="_blank">
      {typeof text === "string" ? text.replace("https://", "") : text}
    </a>
  );
}

export function BlockLink(props) {
  return (
    <div className="rounded border p-4 my-4">
      {props.title && <p className="font-bold">{props.title}</p>}
      <A {...props} />
    </div>
  );
}

export function Img(props) {
  return <img alt="" {...props} border="~ rounded" />;
}
