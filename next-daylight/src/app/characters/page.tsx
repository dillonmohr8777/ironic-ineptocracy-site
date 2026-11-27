import { CastGallery } from "@/components/Cast";
import { Folio } from "@/components/Folio";
import { edition } from "@/lib/publication";
export const metadata = edition("/characters/", "The cast index", "Meet ten subjects of Dillon Mohr’s political thriller through portrait studies, voice auditions, and spoiler-safe public records.");
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
