import { CastGallery } from "@/components/Cast";
import { Folio } from "@/components/Folio";
import { StructuredData } from "@/components/StructuredData";
import cast from "@/lib/cast.json";
import { edition } from "@/lib/publication";
import { characterPath, collection } from "@/lib/schema";
const description = "Meet ten subjects of Dillon Mohr’s political thriller through portrait studies, voice auditions, and spoiler-safe public records.";
export const metadata = edition("/characters/", "The cast index", description, false, ["The Ironic Ineptocracy characters", "Darnell Covington", "Javon Whitfield", "Dijon Garnier", "Alec Daheim", "Ronald McNulty", "political thriller cast"]);
export default function Characters() {
  return (
    <div className="shell sub">
      <StructuredData value={collection("/characters/", "The cast index", description, cast.map((c) => ({ name: c.name, path: characterPath(c.slug) })))} />
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
