/** Server-only. Never record addresses, credentials, or upstream response bodies in logs. */
export type LeadEnv = { MAILERLITE_API_KEY?: string; MAILERLITE_GROUP_ID?: string; LEADS_WEBHOOK_URL?: string; DOSSIER_LEADS_URL?: string; DOSSIER_LEADS_TOKEN?: string };
export const health=(env:LeadEnv)=>({ok:true,mailerliteConfigured:!!env.MAILERLITE_API_KEY?.trim(),mailerliteGroupConfigured:!!env.MAILERLITE_GROUP_ID?.trim(),webhookConfigured:!!env.LEADS_WEBHOOK_URL?.trim(),collectorConfigured:!!env.DOSSIER_LEADS_URL?.trim()});
export async function deliver(input:unknown,env:LeadEnv):Promise<[number,{ok:boolean;error?:string}]>{
  const data=(input && typeof input==='object'?input:{}) as Record<string,unknown>;
  const text=(key:string)=>typeof data[key]==='string'?(data[key] as string).trim().slice(0,2048)||null:null;
  const email=text('email')?.toLowerCase();if(!email||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return [400,{ok:false,error:'A valid email is required.'}];
  const lead={email, firstName:text('firstName'), source:text('source'), project:text('project')||'The Ironic Ineptocracy',pageUrl:text('pageUrl'),sourcePage:text('sourcePage'),capturedAt:new Date().toISOString(),utmSource:text('utmSource'),utmMedium:text('utmMedium'),utmCampaign:text('utmCampaign'),utmContent:text('utmContent'),utmTerm:text('utmTerm')};
  async function post(url:string,body:unknown,token?:string,mailer=false){
    try {if(new URL(url).protocol!=='https:')return false;const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify(body),redirect:token?'error':'follow',signal:AbortSignal.timeout(7000)});return r.ok || (mailer && r.status===409)} catch{return false}
  }
  const jobs:Promise<boolean>[]=[];
  const key=env.MAILERLITE_API_KEY?.trim(),group=env.MAILERLITE_GROUP_ID?.trim();
  if(key)jobs.push(post('https://connect.mailerlite.com/api/subscribers',{email,fields:{name:lead.firstName||undefined,source:lead.source||undefined,utm_source:lead.utmSource||undefined,utm_medium:lead.utmMedium||undefined,utm_campaign:lead.utmCampaign||undefined},...(group?{groups:[group]}:{})},key,true));
  if(env.LEADS_WEBHOOK_URL?.trim())jobs.push(post(env.LEADS_WEBHOOK_URL.trim(),lead));
  if(env.DOSSIER_LEADS_URL?.trim())jobs.push(post(env.DOSSIER_LEADS_URL.trim(),lead,env.DOSSIER_LEADS_TOKEN?.trim()));
  if((await Promise.all(jobs)).some(Boolean))return [200,{ok:true}];
  return [jobs.length?502:503,{ok:false,error:'Signup is temporarily offline.'}];
}
