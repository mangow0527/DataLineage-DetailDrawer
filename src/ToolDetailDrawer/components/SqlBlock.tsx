type SqlBlockProps = {
  content: string
}

export default function SqlBlock({ content }: SqlBlockProps) {
  return <div className="code-block">{content}</div>
}
