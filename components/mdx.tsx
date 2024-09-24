export function A(props) {
  if (props["data-footnote-ref"] != null) {
    return (
      <a
        className="@hover-underline font-semibold text-rose-600"
        id={props.id}
        href={props.href}
        data-footnote-ref={true}
        aria-describedby={props["aria-describedby"]}
      >
        {props.children}
      </a>
    );
  }
  if (props["data-footnote-backref"] != null) {
    return (
      <a
        className="@hover-underline font-semibold text-rose-600"
        href={props.href}
        data-footnote-backref=""
        aria-label={props["aria-label"]}
      >
        {props.children}
      </a>
    );
  }
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

export function Link(props) {
  return (
    <div>
      <span className="font-bold mr-2">{props.title}</span>
      <A {...props} />
    </div>
  );
}
