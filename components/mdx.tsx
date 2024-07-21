
export function A(props) {
  const text = props.children ?? props.href;
  const url = props.href ?? props.children;
  return (
    <a
      className="@hover-underline font-semibold text-rose-600"
      href={url}
      target="_blank"
    >
      {typeof text === "string" ? text.replace("https://", "") : text}
    </a>
  );
}

export function Sa(props) {
  const text = props.children ?? props.href;
  const url = props.href ?? props.children;
  return (
    <a className="@hover-underline font-semibold" href={url} target="_blank">
      {typeof text === "string" ? text.replace("https://", "") : text}
    </a>
  );
}

export function Card(props) {
  return (
    <div className={`rounded border p-4 my-4 ${props.className}`}>
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
