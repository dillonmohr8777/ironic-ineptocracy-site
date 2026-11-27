import records from "./dispatches.json";
export type Block = {type: "h2" | "h3"; text:string} | {type:"p"; html:string} | {type:"ul" | "ol"; items:string[]; start?:number} | {type:"table"; caption:string; rows:string[][]};
type Dispatch = Omit<(typeof records)[number], "blocks"> & {blocks:Block[]};
export const essays = records as Dispatch[];
export const pathFor = (slug: string) => `/dispatches/${slug}/`;
export const groups = ["Core Dossier", "Satire & Craft", "Reading Guides"];
