export function Folio({ label }: { label: string }) {
  return (
    <div className="folio micro">
      <span>
        <a href="/">PUBLIC ARCHIVE</a>
        <b>/</b>
        {label}
      </span>
      <span>
        CASE 017 <b>—</b> TIER 01
      </span>
    </div>
  );
}
