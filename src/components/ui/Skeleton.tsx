export function Skeleton({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return <div className={`skeleton ${className ?? ''}`} style={style} />
}
