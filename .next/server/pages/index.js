"use strict";(()=>{var e={};e.id=405,e.ids=[405,660],e.modules={6030:(e,s,t)=>{t.a(e,async(e,a)=>{try{t.r(s),t.d(s,{config:()=>g,default:()=>h,getServerSideProps:()=>u,getStaticPaths:()=>x,getStaticProps:()=>m,reportWebVitals:()=>f,routeModule:()=>k,unstable_getServerProps:()=>y,unstable_getServerSideProps:()=>w,unstable_getStaticParams:()=>b,unstable_getStaticPaths:()=>j,unstable_getStaticProps:()=>v});var i=t(7093),r=t(5244),n=t(1323),l=t(1072),o=t.n(l),c=t(1788),d=t(8522),p=e([c,d]);[c,d]=p.then?(await p)():p;let h=(0,n.l)(d,"default"),m=(0,n.l)(d,"getStaticProps"),x=(0,n.l)(d,"getStaticPaths"),u=(0,n.l)(d,"getServerSideProps"),g=(0,n.l)(d,"config"),f=(0,n.l)(d,"reportWebVitals"),v=(0,n.l)(d,"unstable_getStaticProps"),j=(0,n.l)(d,"unstable_getStaticPaths"),b=(0,n.l)(d,"unstable_getStaticParams"),y=(0,n.l)(d,"unstable_getServerProps"),w=(0,n.l)(d,"unstable_getServerSideProps"),k=new i.PagesRouteModule({definition:{kind:r.x.PAGES,page:"/index",pathname:"/",bundlePath:"",filename:""},components:{App:c.default,Document:o()},userland:d});a()}catch(e){a(e)}})},2332:(e,s,t)=>{t.a(e,async(e,a)=>{try{t.d(s,{Z:()=>d});var i=t(7101),r=t(6689),n=t(3139),l=t(9017),o=t(3766),c=e([i,n,o]);[i,n,o]=c.then?(await c)():c;let p=(0,n.css)("display:flex;flex-direction:column;gap:10px;"),h=(0,n.css)("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-bottom:10px;@media (max-width:768px){flex-direction:column;align-items:flex-start;}"),m=(0,n.css)("flex:1;margin-right:10px;@media (max-width:768px){width:100%;margin-bottom:10px;}"),x=(0,n.css)("cursor:pointer;background:#737373;color:white;padding:3px 10px;align-self:flex-end;transition:box-shadow 0.3s ease,background .3s ease;&:hover{box-shadow:0px 4px 8px rgba(0,0,0,0.1);background:var(--link);text-decoration:none;}@media (max-width:768px){}"),u=(0,n.css)("display:flex;gap:10px;flex-wrap:wrap;justify-content:center;"),g=(0,n.css)("flex:1 1 23%;display:flex;align-items:center;justify-content:center;min-width:150px;max-width:23%;padding:10px;border:1px solid var(--gray4);background-color:var(--gray0);text-align:center;box-sizing:border-box;"),f=(0,n.css)("background-color:#ffdddd;color:#d8000c;border:1px solid #d8000c;padding:10px;border-radius:5px;margin-bottom:10px;font-size:16px;font-weight:bold;display:flex;align-items:center;white-space:pre-wrap;svg{margin-right:10px;}"),v=(0,n.css)("border:1px solid var(--gray6);background-color:var(--gray1);padding:1em;margin-bottom:1em;.ledein{font-weight:bold;text-transform:uppercase;}form{display:flex;flex-wrap:wrap;margin-top:0.5em;margin-bottom:1em;}input{margin:-1px;flex:4 1 15rem;height:2em;padding:0.25em;}button{margin:-1px;flex:1 1 auto;background-color:var(--tan5);color:white;font-weight:normal;}button:hover{background-color:var(--link);}"),j=(0,n.css)("flex:1 1 auto;background-color:var(--tan5);color:white;font-weight:normal;transition:background-color 0.3s ease;text-align:center;padding:0.5em 1em;width:120px;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;");function d({selDistricts:e,setSelDistricts:s}){let{usHouse:t,psc:a,mtHouse:n,mtSenate:c,matchedAddress:d}=e,[b,y]=(0,r.useState)(null),[w,k]=(0,r.useState)(null),[S,D]=(0,r.useState)(!1),N=new o.Z,H={usHouse:(0,l.Z)(e.usHouse),psc:(0,l.Z)(e.psc),mtHouse:(0,l.Z)(e.mtHouse),mtSenate:(0,l.Z)(e.mtSenate)};return(0,i.jsxs)("div",{css:v,children:[i.jsx("div",{className:"ledein",children:"Show only candidates for your voting address"}),(0,i.jsxs)("form",{children:[i.jsx("input",{onChange:function(e){let s=e.target.value;y(s),k(null)},type:"address",value:b||"",placeholder:"Enter address (e.g., 1301 E 6th Ave, Helena)"}),i.jsx("button",{onClick:function(e){e.preventDefault(),D(!0),N.matchAddressToDistricts(b,e=>{s(e),k(null),D(!1)},e=>{k(" Invalid address, please make sure you enter it in this format: 1301 E 6th Ave, Helena"),D(!1)})},disabled:S,css:j,children:S?"Searching...":"Look up"})]}),(0,i.jsxs)("div",{className:"message",children:[w&&(0,i.jsxs)("div",{css:f,children:[i.jsx("strong",{children:"Error:"})," ",w]}),null===d&&!w&&i.jsx("div",{children:"Look up districts for your address by entering it above."}),null!==d&&!w&&(0,i.jsxs)("div",{css:p,children:[i.jsx("div",{css:h,children:(0,i.jsxs)("div",{css:m,children:["Districts for ",i.jsx("strong",{children:d}),":"]})}),(0,i.jsxs)("div",{css:u,children:[i.jsx("div",{css:g,children:H.usHouse}),i.jsx("div",{css:g,children:H.mtHouse}),i.jsx("div",{css:g,children:H.mtSenate}),i.jsx("div",{css:g,children:H.psc})]}),i.jsx("a",{onClick:function(){s({usHouse:null,psc:null,mtHouse:"HD-1",mtSenate:"SD-1",matchedAddress:null}),y(null),k(null)},css:x,children:"Reset"})]})]})]})}a()}catch(e){a(e)}})},9211:(e,s,t)=>{t.a(e,async(e,a)=>{try{t.d(s,{Z:()=>l});var i=t(7101),r=t(3135),n=e([i,r]);function l({ballotIssues:e}){return e&&0!==e.length?i.jsx("div",{children:e.map(e=>{let{number:s,description:t}=e;return(0,i.jsxs)("div",{children:[i.jsx("h3",{children:s}),i.jsx(r.default,{children:t})]},s)})}):null}[i,r]=n.then?(await n)():n,a()}catch(e){a(e)}})},3327:(e,s,t)=>{t.a(e,async(e,a)=>{try{t.d(s,{Z:()=>o});var i=t(7101);t(6689);var r=t(3139),n=t(5696),l=e([i,r,n]);[i,r,n]=l.then?(await l)():l;let c=(0,r.css)("display:flex;flex-wrap:wrap;justify-content:center;select{appearance:none;outline:none;cursor:pointer;color:var(--link);background-color:#fff;border:1px solid var(--tan5);border-radius:3px;height:60px;font-size:1em;padding:10px 5px;margin:0 0.2em;box-shadow:2px 2px 3px #aaa;text-align:center;}select:focus{outline:2px solid var(--highlight);}button{height:60px;width:40px;border:1px solid var(--tan5);border-radius:3px;background-color:#fff;color:#aaa;box-shadow:2px 2px 3px #aaa;}button.disabled{opacity:0.6;}button:hover{background-color:#eee;color:var(--link);}");function o(e){let{houseDistrictOptions:s,setLegislativeDistricts:t,selHd:a}=e;function r(e){let s=`SD-${(0,n.Dr)(e)}`;t(e,s)}return(0,i.jsxs)("div",{css:c,children:[i.jsx("button",{onClick:function(){let e=(0,n.i3)(a)-1;0===e&&(e=100),r(`HD-${e}`)},children:"<"}),i.jsx("select",{onChange:function(e){return r(e.target.value)},value:a,children:s.map(e=>(0,i.jsxs)("option",{value:e,children:["House District ",e.replace("HD-","")," / Senate District ",(0,n.Dr)(e)]},e))}),i.jsx("button",{onClick:function(){let e=(0,n.i3)(a)+1;101===e&&(e=1),r(`HD-${e}`)},children:">"})]})}a()}catch(e){a(e)}})},233:(e,s,t)=>{t.a(e,async(e,a)=>{try{t.d(s,{Z:()=>x});var i=t(7101);t(6689);var r=t(3139),n=t(5675),l=t.n(n),o=t(1664),c=t.n(o),d=t(5696),p=t(430),h=e([i,r,d,p]);[i,r,d,p]=h.then?(await h)():h;let u=(0,r.css)("display:flex;flex-wrap:wrap;justify-content:space-around;align-items:stretch;.col{flex:1 0 300px;margin:0.5em;}"),g=(0,r.css)("border:1px solid var(--tan5);box-shadow:2px 2px 3px #aaa;height:calc(100% - 1em);padding:0.5em;.corresponding-district{text-align:center;margin-bottom:0.5em;}.locale{padding:0.2em;min-height:2.5em;}.map-container{display:flex;justify-content:center;img{border:1px solid var(--tan5);}}.out-of-cycle-note{background:var(--gray1);border:1px solid var(--tan5);margin:0.5em 0;padding:1em;font-size:1.1em;text-align:center;}.candidates{margin-bottom:1em;}.holdover{display:inline-block;border:1px solid var(--tan5);background:var(--gray1);height:37px;padding-right:1em;box-shadow:2px 2px 3px #aaa;margin-bottom:0.5em;color:black;}.holdover:hover{opacity:0.8;text-decoration:none;color:var(--link);}.holdover-party-icon{display:inline-block;color:white;width:40px;height:30px;font-size:1.1em;margin-right:0.5em;position:relative;top:0px;padding-top:7px;}.holdover-name{font-size:1.1em;text-transform:uppercase;}"),f=(0,r.css)("margin-top:0.5em;border:1px solid var(--tan5);box-shadow:2px 2px 3px #aaa;a{min-height:40px;display:flex;align-items:stretch;background-color:var(--tan1);color:black;}a:hover{opacity:0.8;text-decoration:none;color:var(--link);}.party{width:40px;height:100%;display:flex;justify-content:center;align-items:center;font-size:1.2em;color:white;}.info-col{flex:1 1 100px;padding:0.5em 0.5em;position:relative;display:flex;align-items:center;}.name{font-size:1.1em;margin-bottom:0;}.tag-line{font-size:0.8em;margin-top:0.2em;}.tag{}.tag:not(:last-child):after{content:' •'}.current{font-size:0.9em;font-style:italic;color:var(--gray3);}.summary-line{font-style:italic;font-size:0.9em;}.fakelink{position:absolute;bottom:3px;right:8px;color:var(--tan4);}");function m(e){let{slug:s,displayName:t,party:a,cap_tracker_2023_link:r,hasResponses:n,numMTFParticles:l}=e,o=p.gO.find(e=>e.key===a);return i.jsx("div",{css:f,style:{borderTop:`3px solid ${o.color}`},children:(0,i.jsxs)(c(),{href:`/legislature/${s}`,children:[i.jsx("div",{className:"portrait-col",children:i.jsx("div",{className:"party",style:{background:o.color},children:a})}),(0,i.jsxs)("div",{className:"info-col",children:[(0,i.jsxs)("div",{children:[i.jsx("div",{className:"name",children:t}),r&&i.jsx("div",{className:"current",children:"Sitting lawmaker"}),(0,i.jsxs)("div",{className:"tag-line",children:[n&&i.jsx("span",{className:"tag",children:"✏️ Candidate Q&A"}),l>0&&(0,i.jsxs)("span",{className:"tag",children:["\uD83D\uDCF0 ",i.jsx("strong",{children:l})," ",1===l?"article":"articles"]})]})]}),i.jsx("div",{className:"fakelink",children:"See more \xbb"})]})]})})}let v=e=>{let{districtKey:s,district:t,chamber:a,region:r,locale:n,in_cycle_2024:o,holdover_senator:h,holdover_party:x,holdover_link:u,candidates:f}=e,v=[];"senate"===a&&(v=(0,d.kg)(s));let j=null;"house"===a&&(j=(0,d.Dr)(s));let b=p.gO.find(e=>e.key===x),y=f.filter(e=>"active"===e.status),w=f.filter(e=>"active"!==e.status);return(0,i.jsxs)("div",{css:g,children:[i.jsx("h3",{children:t.replace("HD","House District").replace("SD","Senate District")}),(0,i.jsxs)("div",{className:"locale",children:[i.jsx("strong",{children:r})," — ",n]}),i.jsx("div",{className:"map-container",children:i.jsx(l(),{src:`https://apps.montanafreepress.org/maps/legislative-districts/1200px/${s}.png`,width:300,height:300,alt:`Map of ${t}`,priority:!0})}),"house"===a&&(0,i.jsxs)("div",{className:"note corresponding-district",children:["Part of SD ",j]}),"senate"===a&&(0,i.jsxs)("div",{className:"note corresponding-district",children:["Composed of HD ",v[0]," and HD ",v[1]]}),"senate"===a&&"no"===o&&i.jsx("div",{children:(0,i.jsxs)("div",{className:"out-of-cycle-note",children:[(0,i.jsxs)("div",{children:[i.jsx("strong",{children:t})," is out of cycle in 2024"]}),i.jsx("br",{}),(0,i.jsxs)("div",{children:[(0,i.jsxs)(c(),{className:"holdover",href:u,style:{borderTop:`3px solid ${b.color}`},children:[i.jsx("span",{className:"holdover-party-icon",style:{backgroundColor:b.color},children:x}),(0,i.jsxs)("span",{className:"holdover-name",children:["Sen. ",h]})]}),i.jsx("div",{children:"will represent the district as a holdover"})]})]})}),i.jsx("div",{className:"candidates",children:y.map(e=>i.jsx(m,{...e},e.slug))}),w.length>0&&(0,i.jsxs)("details",{children:[i.jsx("summary",{children:"Candidates defeated in June 4 primary election or who withdrew post-primary"}),i.jsx("div",{children:w.map(e=>i.jsx(m,{...e},e.slug))})]})]})};function x({selHouseDistrict:e,selSenateDistrict:s}){return(0,i.jsxs)("div",{css:u,children:[i.jsx("div",{className:"col house",children:e&&i.jsx(v,{...e})}),i.jsx("div",{className:"col senate",children:s&&i.jsx(v,{...s})})]})}a()}catch(e){a(e)}})},7013:(e,s,t)=>{t.a(e,async(e,a)=>{try{t.d(s,{Z:()=>u});var i=t(7101),r=t(3139),n=t(1163),l=t(1664),o=t.n(l),c=t(5675),d=t.n(c),p=t(430),h=t(5696),m=e([i,r,p,h]);[i,r,p,h]=m.then?(await m)():m;let g=(0,r.css)("margin-bottom:2em;.map-row{display:flex;justify-content:center;margin-top:1em;margin-bottom:1em;}.map-container{max-width:600px;}.party-buckets{display:flex;flex-wrap:wrap;justify-content:space-around;margin-top:0.5em;}.party-bucket{padding:0 0.5em;h4{margin:0;text-transform:uppercase;}border-left:3px solid gray;margin-bottom:1em;}"),f=(0,r.css)("margin-top:0.5em;a{width:310px;display:flex;align-items:stretch;background-color:var(--tan1);box-shadow:2px 2px 3px #aaa;color:black;}a:hover{opacity:0.8;text-decoration:none;color:var(--link);}.portrait-col{flex:0 0 100px;}.portrait-container{width:100px;height:100px;background-color:#666;display:flex;justify-content:center;align-items:center;color:white;}.info-col{flex:0 1 200px;padding:0.5em 0.5em;position:relative;}.name{font-weight:bold;font-size:1.2em;}.tag-line{font-size:0.8em;margin-top:0.3em;}.tag{margin-right:0.5em;}.tag:not(:last-child):after{}.summary-line{font-style:italic;font-size:0.9em;}.fakelink{position:absolute;bottom:3px;right:8px;color:var(--tan5);font-size:0.9em;}");function x(e){let{slug:s,displayName:t,summaryLine:a,party:r,numMTFParticles:l,hasResponses:c}=e,h=p.gO.find(e=>e.key===r),m=(0,n.useRouter)(),x=`${m.basePath}/portraits/${s}.png`;return i.jsx("div",{css:f,style:{borderTop:`5px solid ${h.color}`},children:(0,i.jsxs)(o(),{href:`/candidates/${s}`,children:[i.jsx("div",{className:"portrait-col",children:i.jsx("div",{className:"portrait-container",children:i.jsx(d(),{alt:`${t}`,src:x,width:100,height:100,style:{width:"100%",height:"auto"}})})}),(0,i.jsxs)("div",{className:"info-col",children:[i.jsx("div",{className:"name",children:t}),i.jsx("div",{className:"summary-line",children:a}),(0,i.jsxs)("div",{className:"tag-line",children:[c&&i.jsx("span",{className:"tag",children:"✏️ Candidate Q&A"}),!c&&i.jsx("span",{className:"tag",children:"\uD83D\uDEAB No Q&A response"}),l>0&&(0,i.jsxs)("span",{className:"tag",children:["\uD83D\uDCF0 ",i.jsx("strong",{children:l})," ",1===l?"article":"articles"]})]}),i.jsx("div",{className:"fakelink",children:i.jsx("span",{children:"See more \xbb"})})]})]})})}function u({race:e,showMap:s}){let{raceSlug:t,displayName:a,description:r,candidates:l,inactiveCandidates:o,note:c}=e,m=null,u=(0,n.useRouter)();return s&&(m=`${u.basePath}/maps/${t}.png`),(0,i.jsxs)("div",{css:g,children:[i.jsx("h3",{children:a}),i.jsx("div",{className:"description",children:r}),s&&i.jsx("div",{className:"map-row",children:i.jsx("div",{className:"map-container",children:i.jsx(d(),{alt:`Map of ${a}`,src:m,width:1200,height:800,style:{width:"100%",height:"auto"}})})}),i.jsx("div",{className:"party-buckets",children:p.gO.map(e=>{let s=l.filter(s=>s.party===e.key);return 0===s.length?null:(0,i.jsxs)("div",{className:"party-bucket",style:{borderLeft:`3px solid ${e.color}`},children:[i.jsx("h4",{style:{color:e.color},children:(0,h._6)(e.noun,s.length)}),i.jsx("div",{children:s.map(e=>i.jsx(x,{...e},e.slug))})]},e.key)})}),o.length>0&&(0,i.jsxs)("details",{children:[i.jsx("summary",{children:"Candidates defeated in June 4 primary election"}),i.jsx("div",{className:"party-buckets",children:p.gO.map(e=>{let s=o.filter(s=>s.party===e.key);return 0===s.length?null:(0,i.jsxs)("div",{className:"party-bucket",style:{borderLeft:`3px solid ${e.color}`},children:[i.jsx("h4",{style:{color:e.color},children:(0,h._6)(e.noun,s.length)}),i.jsx("div",{children:s.map(e=>i.jsx(x,{...e},e.slug))})]},e.key)})})]}),i.jsx("div",{className:"note",children:c})]},t)}a()}catch(e){a(e)}})},1931:(e,s,t)=>{t.a(e,async(e,a)=>{try{t.d(s,{Z:()=>h});var i=t(7101),r=t(6689),n=t(3139),l=t(1664),o=t.n(l),c=t(430),d=e([i,n,c]);[i,n,c]=d.then?(await d)():d;let m=(0,n.css)("border:1px solid var(--gray6);background-color:var(--gray1);padding:1em;margin-bottom:1em;.ledein{font-weight:bold;text-transform:uppercase;}form{display:flex;flex-wrap:wrap;margin-top:0.5em;margin-bottom:1em;}input{margin:-1px;flex:4 1 15rem;height:2em;padding:0.25em;}button{margin:-1px;flex:1 1 auto;background-color:var(--tan5);color:white;font-weight:normal;}button:hover{background-color:var(--link);}"),x=(0,n.css)("margin:0.5em auto;margin-top:0.5em;border:1px solid var(--tan5);box-shadow:2px 2px 3px #aaa;max-width:400px;a{min-height:40px;display:flex;align-items:stretch;background-color:var(--tan1);color:black;}a:hover{opacity:0.8;text-decoration:none;color:var(--link);}.party{width:40px;height:100%;display:flex;justify-content:center;align-items:center;font-size:1.2em;color:white;}.info-col{flex:1 1 100px;padding:0.5em 0.5em;position:relative;display:flex;align-items:center;}.name{font-size:1.2em;margin-bottom:0;font-weight:bold;text-transform:uppercase;}.tag-line{font-size:0.8em;margin-top:0.2em;}.tag{}.tag:not(:last-child):after{content:' •'}.position{}.status{margin:0.3em 0;background:var(--tan2);border:1px solid var(--tan4);padding:0.5em 0.5em;width:100%}.current{font-size:0.9em;font-style:italic;color:var(--gray3);}.summary-line{font-style:italic;font-size:0.9em;}.fakelink{position:absolute;bottom:3px;right:8px;color:var(--tan4);}");function p(e){let{slug:s,path:t,displayName:a,party:r,status:n,race:l,summaryLine:d,cap_tracker_2023_link:p,hasResponses:h,numMTFParticles:m}=e,u=c.gO.find(e=>e.key===r),g=c.Q_.find(e=>e.key===n);return i.jsx("div",{css:x,style:{borderTop:`3px solid ${u.color}`},children:(0,i.jsxs)(o(),{href:`/${t}/${s}`,children:[i.jsx("div",{className:"portrait-col",children:i.jsx("div",{className:"party",style:{background:u.color},children:r})}),(0,i.jsxs)("div",{className:"info-col",children:[(0,i.jsxs)("div",{children:[i.jsx("div",{className:"name",children:a}),d&&i.jsx("div",{className:"current",children:d}),p&&i.jsx("div",{className:"current",children:"Sitting lawmaker"}),(0,i.jsxs)("div",{className:"position",children:[i.jsx("span",{style:{color:u.color},children:u.noun})," for ",l]}),i.jsx("div",{className:"status",children:g.label}),(0,i.jsxs)("div",{className:"tag-line",children:[h&&i.jsx("span",{className:"tag",children:"✏️ Candidate Q&A"}),m>0&&(0,i.jsxs)("span",{className:"tag",children:["\uD83D\uDCF0 ",i.jsx("strong",{children:m})," ",1===m?"article":"articles"]})]})]}),i.jsx("div",{className:"fakelink",children:"See more \xbb"})]})]})})}function h({candidates:e}){let[s,t]=(0,r.useState)(""),a=null!==s&&s.length<3?[]:e.filter(e=>e.displayName.toUpperCase().includes(s.toUpperCase())).slice(0,5);return(0,i.jsxs)("div",{css:m,children:[i.jsx("div",{className:"ledein",children:"Search 2024 Montana candidates by name"}),i.jsx("div",{className:"note",children:"This guide includes federal, state-level and legislative candidates. County commissioners and other local positions are excluded."}),i.jsx("form",{children:i.jsx("input",{onChange:function(e){let s=e.target.value;t(s)},type:"text",value:s,placeholder:"Enter candidate (e.g., Greg Gianforte)"})}),i.jsx("div",{children:a.map(e=>i.jsx(p,{...e},e.slug))})]})}a()}catch(e){a(e)}})},7109:(e,s,t)=>{t.d(s,{G:()=>a});let a={19:"psc-1",20:"psc-1",21:"psc-1",22:"psc-1",23:"psc-1",26:"psc-1",27:"psc-1",28:"psc-1",29:"psc-1",30:"psc-1",31:"psc-1",32:"psc-1",33:"psc-1",34:"psc-1",35:"psc-1",36:"psc-1",38:"psc-1",43:"psc-1",44:"psc-1",45:"psc-1",39:"psc-2",40:"psc-2",41:"psc-2",42:"psc-2",46:"psc-2",47:"psc-2",48:"psc-2",49:"psc-2",50:"psc-2",51:"psc-2",52:"psc-2",53:"psc-2",54:"psc-2",55:"psc-2",56:"psc-2",57:"psc-2",58:"psc-2",59:"psc-2",61:"psc-2",62:"psc-2",37:"psc-3",60:"psc-3",63:"psc-3",64:"psc-3",65:"psc-3",66:"psc-3",67:"psc-3",68:"psc-3",69:"psc-3",70:"psc-3",71:"psc-3",72:"psc-3",73:"psc-3",74:"psc-3",75:"psc-3",77:"psc-3",78:"psc-3",79:"psc-3",85:"psc-3",86:"psc-3",1:"psc-4",2:"psc-4",6:"psc-4",8:"psc-4",9:"psc-4",10:"psc-4",12:"psc-4",13:"psc-4",14:"psc-4",87:"psc-4",88:"psc-4",89:"psc-4",90:"psc-4",93:"psc-4",94:"psc-4",95:"psc-4",96:"psc-4",97:"psc-4",98:"psc-4",100:"psc-4",3:"psc-5",4:"psc-5",5:"psc-5",7:"psc-5",11:"psc-5",15:"psc-5",16:"psc-5",17:"psc-5",18:"psc-5",24:"psc-5",25:"psc-5",76:"psc-5",80:"psc-5",81:"psc-5",82:"psc-5",83:"psc-5",84:"psc-5",91:"psc-5",92:"psc-5",99:"psc-5"}},771:(e,s,t)=>{t.a(e,async(e,a)=>{try{t.d(s,{Z:()=>l});var i=t(7101),r=t(3139),n=e([i,r]);[i,r]=n.then?(await n)():n;let o=(0,r.css)("display:block;background-color:var(--gray5);border:1px solid black;color:white;padding:1em;margin:0 -5px;text-align:center;.message{font-size:1.2em;margin-bottom:1em;}a{display:block;border:2px solid var(--link);color:var(--highlight);font-weight:bold;margin:0.5em auto;padding:0.5em 1em;font-size:1.3em;max-width:22em;}a:hover{color:white;text-decoration:none;border:2px solid var(--highlight);}.outro{color:#eee;font-style:italic;}");function l(){return(0,i.jsxs)("div",{css:o,children:[i.jsx("div",{className:"message",children:"Want original Montana Free Press reporting and analysis sent to your inbox each week?"}),i.jsx("a",{href:"https://montanafreepress.org/mt-lowdown/",children:i.jsx("div",{className:"button",children:"Sign up for the free MT LOWDOWN newsletter"})}),i.jsx("div",{className:"outro",children:"Delivered Friday afternoons"})]})}a()}catch(e){a(e)}})},3766:(e,s,t)=>{t.a(e,async(e,a)=>{try{t.d(s,{Z:()=>p});var i=t(7109),r=t(5696),n=e([r]);r=(n.then?(await n)():n)[0];let l="https://39tcu96a0k.execute-api.us-west-2.amazonaws.com/prod",o=`${l}/hd-lookup`,c=`${l}/congressional-lookup`,d=`${l}/geocode`;class p{async matchAddressToDistricts(e,s,t){let a=await this.geocode(e),n=this.pickAddress(a.candidates);if(n){let e=n.address,t=await this.getDistrict({apiUrl:o,coords:n.location,fields:"District"}),a=t&&t.features[0].attributes.District||null,l=(0,r.Dr)(a),d=i.G[a],p=await this.getDistrict({apiUrl:c,coords:n.location,fields:"DistrictNumber"}),h=p&&p.features[0].attributes.DistrictNumber||null;s({matchedAddress:e,mtHouse:`HD-${a}`,mtSenate:`SD-${l}`,psc:d,usHouse:`us-house-${h}`})}else t()}async geocode(e){let s=this.makeQuery(d,{SingleLine:e,f:"pjson",outSR:"102100"});return await fetch(s).then(e=>e.json()).catch(e=>console.log(e))}async getDistrict({apiUrl:e,coords:s,fields:t}){let a={f:"pjson",where:"",returnGeometry:"false",spatialRel:"esriSpatialRelIntersects",geometry:`{"x":${s.x},"y":${s.y},"spatialReference":{"wkid":102100,"latestWkid":3857}}`,geometryType:"esriGeometryPoint",outFields:t},i=this.makeQuery(e,a);console.log(i);let r=await fetch(i).then(e=>e.json()).then(e=>e).catch(e=>console.log(e));return r&&r.features?r:null}constructor(){this.makeQuery=(e,s)=>{let t=e+"?";for(let e in s)t+=`${encodeURIComponent(e)}=${encodeURIComponent(s[e])}&`;return t.slice(0,-1)},this.pickAddress=e=>void 0===e?null:e[0]}}a()}catch(e){a(e)}})},8522:(e,s,t)=>{t.a(e,async(e,a)=>{try{t.r(s),t.d(s,{default:()=>k,getStaticProps:()=>w});var i=t(7101),r=t(6689),n=t.n(r),l=t(3139),o=t(1062),c=t(771),d=t(1664),p=t.n(d),h=t(3135),m=t(2332),x=t(1931),u=t(7013),g=t(233),f=t(3327),v=t(9211),j=t(5696),b=t(6745),y=e([i,l,o,c,h,m,x,u,g,f,v,j]);[i,l,o,c,h,m,x,u,g,f,v,j]=y.then?(await y)():y;let S=["Federal Delegation","State Officials","Montana Supreme Court","Public Service Commission"],D=(0,l.css)("section{display:block;padding:0 0.5em;}h2{text-align:center;padding:0.3em 0.5em;padding-bottom:0.2em;background-color:var(--tan2);color:var(--tan6);border-top:4px solid var(--tan5);font-weight:normal;text-transform:uppercase;margin-bottom:1em;margin-top:1em;margin-left:-1em;margin-right:-1em;}h3{text-align:center;margin-top:0.2em;background-color:var(--tan6);padding:0.3em 0.5em;color:white;text-transform:uppercase;}");async function w(){let e=(0,b.ES)(),s=(0,b.D9)(),t=(0,b.oN)(),a=(0,b.rm)(),i=(0,b.Xm)(),r=(0,b.J3)();return{props:{races:e,legislativeRaces:s,ballotIssues:a,text:t,votingFAQ:i,fullCandidateList:r}}}function k({races:e,legislativeRaces:s,ballotIssues:t,text:a,votingFAQ:r,fullCandidateList:l}){let[d,b]=n().useState({usHouse:null,psc:null,mtHouse:"HD-1",mtSenate:"SD-1",matchedAddress:null}),{overviewLedeIn:y,overviewBallotInitiatives:w,overviewLegislatureLedeIn:k,overviewAlsoOnYourBallot:N,overviewAboutThisProject:H}=a,$=S.map(s=>{let t=e.filter(e=>e.level===s);return{level:s,races:t}}),P=s.find(e=>e.districtKey===d.mtHouse),C=s.find(e=>e.districtKey===d.mtSenate),z="Candidates seeking state, federal and legislative office in Montana's 2024 elections. The Montana Free press voter guide includes biographical details and issue questionnaires.";return(0,i.jsxs)(o.Z,{home:!0,pageCss:D,relativePath:"/",pageTitle:"Montana's 2024 Candidates | 2024 Montana Election Guide",pageDescription:z,siteSeoTitle:"Montana's 2024 Candidates | MFTP 2024 Election Guide",seoDescription:z,socialTitle:"The MTFP 2024 Election Guide",socialDescription:"Federal, state and legislative candidates seeking Montana office in 2024.",children:[i.jsx(h.default,{children:y}),i.jsx(x.Z,{candidates:l}),i.jsx(m.Z,{selDistricts:d,setSelDistricts:b}),i.jsx("section",{children:i.jsx("div",{children:$.slice(0,2).map(e=>(0,i.jsxs)("div",{children:[i.jsx("a",{className:"link-anchor",id:(0,j.Pg)(e.level)}),i.jsx("h2",{children:e.level}),e.races.filter(e=>"us-house"===e.category&&null!==d.usHouse?d.usHouse===e.raceSlug:"psc"!==e.category||null===d.psc||d.psc===e.raceSlug).map(e=>i.jsx(u.Z,{race:e,showMap:["Federal Delegation","Public Service Commission"].includes(e.level)},e.raceSlug))]},e.level))})}),i.jsx("hr",{}),i.jsx(c.Z,{}),(0,i.jsxs)("section",{children:[i.jsx("a",{className:"link-anchor",id:"legislature"}),i.jsx("h2",{children:"Montana State Legislature"}),i.jsx(h.default,{children:k}),i.jsx(f.Z,{houseDistrictOptions:s.filter(e=>"house"===e.chamber).map(e=>e.districtKey),senateDistrictOptions:s.filter(e=>"senate"===e.chamber).map(e=>e.districtKey),selHd:d.mtHouse,selSd:d.mtSenate,setLegislativeDistricts:(e,s)=>{b({...d,mtHouse:e,mtSenate:s})}}),i.jsx(g.Z,{selHouseDistrict:P,selSenateDistrict:C}),i.jsx("div",{className:"note",children:i.jsx(p(),{href:"/legislative-candidates-by-district/",children:"See all candidates listed by district."})})]}),i.jsx("section",{children:i.jsx("div",{children:$.slice(2).map(e=>(0,i.jsxs)("div",{children:[i.jsx("a",{className:"link-anchor",id:(0,j.Pg)(e.level)}),i.jsx("h2",{children:e.level}),e.races.filter(e=>"us-house"===e.category&&null!==d.usHouse?d.usHouse===e.raceSlug:"psc"!==e.category||null===d.psc||d.psc===e.raceSlug).map(e=>i.jsx(u.Z,{race:e,showMap:["Federal Delegation","Public Service Commission"].includes(e.level)},e.raceSlug))]},e.level))})}),i.jsx("hr",{}),(0,i.jsxs)("section",{children:[i.jsx("a",{className:"link-anchor",id:"ballot-initiatives"}),i.jsx("h2",{children:"Ballot initiatives"}),i.jsx(h.default,{children:w}),i.jsx(v.Z,{ballotIssues:t})]}),(0,i.jsxs)("section",{children:[i.jsx("h2",{children:"Other ballot items"}),i.jsx(h.default,{children:N})]}),(0,i.jsxs)("section",{children:[i.jsx("a",{className:"link-anchor",id:"voter-faq"}),i.jsx("h2",{children:"Common Voting Questions"}),i.jsx(h.default,{children:r})]}),(0,i.jsxs)("section",{children:[i.jsx("a",{className:"link-anchor",id:"about"}),i.jsx("h2",{children:"About this project"}),i.jsx(h.default,{children:H})]})]})}a()}catch(e){a(e)}})},9017:(e,s,t)=>{t.d(s,{Z:()=>a});function a(e){if(!e)return"";let s={"us-house":e=>`U.S. House District ${e} (${"1"===e?"West":"East"})`,psc:"Public Service Commission District",HD:"MT House District",SD:"MT Senate District"},t=e.match(/(us-house|psc|HD|SD)-(\d+)/);if(t){let[,e,a]=t;return"us-house"===e?s[e](a):`${s[e]} ${a}`}return e}},2785:e=>{e.exports=require("next/dist/compiled/next-server/pages.runtime.prod.js")},968:e=>{e.exports=require("next/head")},6689:e=>{e.exports=require("react")},6405:e=>{e.exports=require("react-dom")},997:e=>{e.exports=require("react/jsx-runtime")},3139:e=>{e.exports=import("@emotion/react")},7101:e=>{e.exports=import("@emotion/react/jsx-runtime")},7648:e=>{e.exports=import("d3-format")},6742:e=>{e.exports=import("d3-time-format")},3135:e=>{e.exports=import("react-markdown")},7147:e=>{e.exports=require("fs")},1017:e=>{e.exports=require("path")},2781:e=>{e.exports=require("stream")},9796:e=>{e.exports=require("zlib")}};var s=require("../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),a=s.X(0,[72,384,5],()=>t(6030));module.exports=a})();