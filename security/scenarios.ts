export const scenarios = [
  { id:"clear-phishing", title:"Clear phishing signals", url:"https://lusitania-bank-login.test/secure", organisationId:"lusitania-bank", sensitive:"password" as const, expected:"CRITICAL" },
  { id:"identity-mismatch", title:"Identity mismatch", url:"https://atlantic-support.test/account", organisationId:"lusitania-bank", sensitive:null, expected:"CAUTION" },
  { id:"unknown-new", title:"Unknown new domain", url:"https://unknown-new-domain.test/login", organisationId:undefined, sensitive:"password" as const, expected:"CAUTION" },
  { id:"verified", title:"Verified demo domain", url:"https://lusitaniabank.test/account", organisationId:"lusitania-bank", sensitive:null, expected:"LOW_EVIDENCE" },
  { id:"misleading-subdomain", title:"Misleading subdomain", url:"https://lusitaniabank.test.attacker-demo.test/login", organisationId:"lusitania-bank", sensitive:"password" as const, expected:"HIGH" },
  { id:"legitimate-https", title:"Legitimate HTTPS website", url:"https://community-library.test/information", organisationId:undefined, sensitive:null, expected:"LOW_EVIDENCE" },
  { id:"benign-unfamiliar", title:"Benign unfamiliar domain", url:"https://quietgarden.test/about", organisationId:undefined, sensitive:null, expected:"LOW_EVIDENCE" },
  { id:"similar-word", title:"Legitimate domain with a similar-looking word", url:"https://lusitania-library.test/events", organisationId:undefined, sensitive:null, expected:"LOW_EVIDENCE" },
  { id:"verified-sensitive", title:"Verified fictional domain requesting credentials", url:"https://lusitaniabank.test/account", organisationId:"lusitania-bank", sensitive:"password" as const, expected:"CAUTION" },
];
