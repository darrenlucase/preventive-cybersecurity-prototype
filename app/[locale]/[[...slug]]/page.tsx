import { AppShell } from "../../../components/AppShell";
import type { Locale } from "../../../i18n/messages";
import type { Metadata } from "next";

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
  const {locale}=await params;
  const pt=locale==="pt-PT";
  const title=pt?"Protótipo de Cibersegurança Preventiva":"Preventive Cybersecurity Prototype";
  const description=pt?"Uma demonstração bilingue e controlada para verificar sites antes de confiar.":"A controlled bilingual demonstration for checking websites before trusting them.";
  return {title,description,openGraph:{title,description,images:[{url:"/og.png",width:1672,height:941,alt:pt?"Verifique um site antes de confiar — protótipo de cibersegurança preventiva":"Check a website before you trust it — preventive cybersecurity prototype"}]},twitter:{card:"summary_large_image",title,description,images:["/og.png"]}};
}

export default async function LocalisedPage({params}:{params:Promise<{locale:string;slug?:string[]}>}){
  const {locale,slug=[]}=await params;
  return <AppShell locale={(locale==="pt-PT"?"pt-PT":"en") as Locale} slug={slug}/>;
}
