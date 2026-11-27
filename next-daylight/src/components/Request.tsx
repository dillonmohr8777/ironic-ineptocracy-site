"use client";
import { useState, type FormEvent } from "react";
import { collector } from "@/lib/contact";
import { Icon } from "./Icon";
export function Request({compact=false}:{compact?:boolean}) {
  const [status,set]=useState<"idle"|"sending"|"received"|"offline">("idle");
  const jump=compact?"#dossier-reader":"/dossier/#dossier-reader";
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); if(status==="sending")return; const form=e.currentTarget;set("sending");
    try {
      const url=new URL(location.href);
      const q=url.searchParams;
      const payload=JSON.stringify({
        email:String(new FormData(form).get("email")).trim(),
        source:"public-archive",
        project:"The Ironic Ineptocracy",
        consent:"garnier-dossier-v1",
        pageUrl:url.origin+url.pathname,
        utmSource:q.get("utm_source"),
        utmMedium:q.get("utm_medium"),
        utmCampaign:q.get("utm_campaign"),
      });
      const response=await fetch(collector+"/api/dossier-leads",{
        method:"POST",headers:{"Content-Type":"application/json"},body:payload,
        credentials:"omit",referrerPolicy:"no-referrer",signal:AbortSignal.timeout(12000),
      });
      if(!response.ok||(await response.json()).accepted!==true)throw Error("Request not accepted");
      form.reset();set("received");
    } catch { set("offline"); return; }
    try { window.gtag?.("event", "generate_lead", {event_category:"dossier",event_label:"garnier_dossier"}); }
    catch { /* Analytics does not change the receipt shown to the reader. */ }
  }
  return <section className={compact?"delivery-card":"access"} id="request"><div className="folder-tab micro"><Icon name="folder" size={15}/> {compact?"REQUEST SLIP":"FILE DG–04"}</div><div className="request-content"><div><span className="micro over"><b/>{compact?"READER SERVICES":"06 / DOSSIER ACCESS"}</span>{compact?<h2>Request the file.</h2>:<h2>The Garnier<br/><em>Dossier.</em></h2>}<p>{compact?"Leave your address for dossier correspondence. All seven leaves are open to read here.":"Private capital. Public policy. Request the reader file on the man who confuses ownership with jurisdiction."}</p></div><form onSubmit={submit}><label htmlFor="request-email" className="micro">READER’S EMAIL ADDRESS</label><input id="request-email" name="email" type="email" required placeholder="you@example.com" autoComplete="email" maxLength={254}/><button className="btn primary" disabled={status==="sending"}>{status==="sending"?"Requesting…":"Email me the dossier"}<Icon name="right" size={16}/></button><div role="status" aria-live="polite">{(status==="received"||status==="offline")&&<p className="form-status">{status==="received"?"Request received. Check your inbox for The Garnier Dossier from ironicineptocracy@agentmail.to, or read all seven leaves below.":"Email delivery could not be confirmed. You can read the entire file now."} <a href={jump}>Open the full Garnier Dossier →</a></p>}</div><a className="direct-read" href={jump}>Read without email →</a></form></div></section>;
}
