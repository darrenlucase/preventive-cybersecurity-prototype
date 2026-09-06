"use client";
import { useState } from "react";
import { organisations } from "../security/identity";
import { Icon } from "./icons";

export function UrlCheckForm({ t, initialUrl="", initialOrg="", compact=false, onCheck }: { t:Record<string,string>; initialUrl?:string; initialOrg?:string; compact?:boolean; onCheck:(url:string,org:string)=>void }) {
  const [url,setUrl]=useState(initialUrl); const [org,setOrg]=useState(initialOrg); const [error,setError]=useState("");
  function submit(e:React.FormEvent){e.preventDefault();try{const value=/^[a-z][a-z\d+.-]*:\/\//i.test(url)?url:`https://${url}`;const parsed=new URL(value);if(!['http:','https:'].includes(parsed.protocol))throw new Error();setError("");onCheck(url,org);}catch{setError(t.invalid)}}
  return <form className={`check-card ${compact?"compact":""}`} onSubmit={submit} noValidate>
    <div className="form-grid"><div className="field"><label htmlFor="url">{t.address}</label><div className="url-input"><Icon name="globe"/><input id="url" inputMode="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder={t.placeholder} aria-describedby={error?"url-error":"privacy-note"}/></div></div>
    <div className="field claim-field"><label htmlFor="claim">{t.claim}</label><select id="claim" value={org} onChange={e=>setOrg(e.target.value)}><option value="">{t.noClaim}</option>{organisations.map(o=><option key={o.id} value={o.id}>{o.name} · DEMO</option>)}</select></div>
    <button className="primary-button" type="submit"><Icon name="search"/>{t.check}<Icon name="arrow"/></button></div>
    {error&&<p id="url-error" className="form-error" role="alert"><Icon name="alert"/>{error}</p>}
    {!compact&&<p id="privacy-note" className="privacy-note"><Icon name="lock" size={14}/>{t.privacy}</p>}
  </form>
}
