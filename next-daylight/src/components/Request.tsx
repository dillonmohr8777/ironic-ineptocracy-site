"use client";
import { useRef, useState } from "react";
import { Icon } from "./Icon";
export function Request() {
  const [status, set] = useState(""),
    [busy, wait] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  return (
    <section className="access" id="request">
      <div className="folder-tab micro">
        <Icon name="folder" size={15} /> FILE DG–04
      </div>
      <div className="request-content">
        <div>
          <span className="micro over">
            <b />
            06 / DOSSIER ACCESS
          </span>
          <h2>
            The Garnier
            <br />
            <em>Dossier.</em>
          </h2>
          <p>
            Private capital. Public policy. Request the reader file on the man
            who confuses ownership with jurisdiction.
          </p>
        </div>
        <form
          ref={form}
          onSubmit={async (e) => {
            e.preventDefault();
            if (busy) return;
            if (process.env.NEXT_PUBLIC_DOSSIER_BACKEND !== "enabled") {
              set(
                "Preview edition — no address was sent or saved. The public subject file is open below.",
              );
              return;
            }
            wait(true);
            set("");
            try {
              const email = new FormData(form.current!).get("email");
              const r = await fetch("/api/dossier-leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, source: "public-archive" }),
              });
              if (
                !r.ok ||
                !r.headers.get("content-type")?.includes("application/json")
              )
                throw Error();
              const result = await r.json();
              if (result.ok !== true && result.success !== true) throw Error();
              set("Request received. Your dossier request is on file.");
              form.current?.reset();
            } catch {
              set(
                "The request could not be confirmed. Try again later or read the public file below.",
              );
            } finally {
              wait(false);
            }
          }}
        >
          <label htmlFor="request-email" className="micro">
            READER’S EMAIL ADDRESS
          </label>
          <input
            name="email"
            id="request-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            maxLength={254}
          />
          <button className="btn primary" disabled={busy}>
            {busy ? "Requesting…" : "Request the dossier"}
            <Icon name="right" size={16} />
          </button>
          {status && (
            <div className="form-status" role="status">
              {status}{" "}
              <a href="/characters/dijon-garnier/">Read Garnier’s file ↗</a>
            </div>
          )}
          <small className="micro">TIER 01 / SPOILER-SAFE READER FILE</small>
        </form>
      </div>
    </section>
  );
}
