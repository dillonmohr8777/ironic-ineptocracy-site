import { CastGallery } from "@/components/Cast";
import { Folio } from "@/components/Folio";
export const metadata = { title: "The cast index" };
export default function Characters() {
  return (
    <div className="shell sub">
      <Folio label="CHARACTER INDEX" />
      <div className="sub-intro">
        <span className="over micro">
          <b />
          THE BIOMETRIC COLLECTION
        </span>
        <h1>
          The cast <em>index.</em>
        </h1>
        <p>
          Ten subjects. Ten voices. A public file on every person caught in the
          machinery.
        </p>
      </div>
      <CastGallery />
    </div>
  );
}
