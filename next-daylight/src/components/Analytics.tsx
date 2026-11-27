"use client";
import Script from "next/script";
import { useEffect, useState } from "react";

declare global { interface Window { gtag?: (command: string, event: string, params: Record<string,string>) => void } }
export function Analytics() {
  const [production, enable] = useState(false);
  useEffect(() => enable(["ironicineptocracy.com", "www.ironicineptocracy.com"].includes(location.hostname)), []);
  // Do not record local readers or preview traffic in the book's production property.
  return production ? <><Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','G-H06CG798DT');`}</Script><Script src="https://www.googletagmanager.com/gtag/js?id=G-H06CG798DT" strategy="afterInteractive" /></> : null;
}
