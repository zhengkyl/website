export function P({ children }) {
  if (typeof children !== "string" && children.type === "img") {
    return <>{children}</>;
  }

  return <p className="my-4">{children}</p>;
}

export function A(props) {
  const text = props.children ?? props.href;
  const url = props.href ?? props.children;
  return (
    <a className="hover:underline" href={url} target="_blank">
      {text.replace("https://", "")}
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
  return <img {...props} className="rounded border" />;
}
