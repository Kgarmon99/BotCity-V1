const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/NPCBots-BRV-2Wnf.js","assets/r3f-3xDdeR5R.js","assets/three-DlEJylon.js","assets/CitizenBots-COx_pWMD.js","assets/index-cPqT_7UV.js","assets/index-CFdQMc2U.css","assets/Billboards-Drgv8npP.js","assets/CityDetails-BfVu2koj.js","assets/Statues-8QUN-aAE.js","assets/CityBuildings-DAfQazaO.js","assets/CityExpansion-BEax6koH.js","assets/Landmarks-DVd8P27N.js","assets/CityDistricts-CzayGaNg.js","assets/CityDistrictsExtra-CakW4tTN.js","assets/NewDistricts-BO-2pwJC.js","assets/ExpansionQuarters-MttXgcRa.js","assets/KioskDecor-cbVrbIuj.js","assets/CityHallPlaza-D7XhLePa.js","assets/CityMedia-BVkcgtOI.js","assets/DistrictGateways-8gBSIjT6.js","assets/Particles-Ce7ihhU9.js","assets/Blimp-D2Im_Grq.js","assets/Streetscape-Slg0tGpM.js","assets/BuildingAccents-Al9GiRLm.js","assets/ObservationTower-J_GV8OxA.js","assets/AmbientLife-BVNAMQBO.js","assets/BotLand-gHY7vHXl.js","assets/GroundDetails-CcXtAQnI.js","assets/StreetFurniture-DRrPGaD9.js"])))=>i.map(i=>d[i]);
import{r as i,u as mt,b as Mt,j as e,d as N,T as Z,e as Ne,P as kt,S as jt,C as Nt,_ as O}from"./r3f-3xDdeR5R.js";import{aq as Lt,i as _,a2 as U,ad as he,u as Ot,e as q,ay as Pt}from"./three-DlEJylon.js";import{u as S,s as H,a as et,B as me,e as pe,c as Bt,m as Dt}from"./index-cPqT_7UV.js";function Ft(t){const o=new Map,s=new Map,a=t.clone();return pt(t,a,function(r,l){o.set(l,r),s.set(r,l)}),a.traverse(function(r){if(!r.isSkinnedMesh)return;const l=r,c=o.get(r),n=c.skeleton.bones;l.skeleton=c.skeleton.clone(),l.bindMatrix.copy(c.bindMatrix),l.skeleton.bones=n.map(function(p){return s.get(p)}),l.bind(l.skeleton,l.bindMatrix)}),a}function pt(t,o,s){s(t,o);for(let a=0;a<t.children.length;a++)pt(t.children[a],o.children[a],s)}const ft="/BotCity-V1/moneybot.glb";function Ut({scale:t=1.5,animation:o="Idle",phase:s=0,paused:a=!1}){const r=i.useRef(null),{scene:l,animations:c}=mt(ft),n=i.useMemo(()=>Ft(l),[l]);i.useEffect(()=>{n.position.set(0,0,0),n.updateMatrixWorld(!0);const f=new Lt().setFromObject(n);Number.isFinite(f.min.y)&&(n.position.y=-f.min.y),n.traverse(x=>{const g=x;g.isMesh&&(g.castShadow=!0,g.receiveShadow=!0)})},[n]);const{actions:p}=Mt(c,r);return i.useEffect(()=>{const f=p[o];if(!f)return;f.reset().play();const x=f.getClip().duration;return a?(x>0&&(f.time=s%1*x),f.paused=!0):(x>0&&(f.time=s%1*x),f.fadeIn(.4)),()=>{f.fadeOut(.2),f.stop()}},[p,o,s,a]),e.jsx("group",{ref:r,scale:t,children:e.jsx("primitive",{object:n})})}mt.preload(ft);function yt({pos:t,color:o,accent:s,taillight:a="#ef4444"}){return e.jsxs("group",{position:t,children:[e.jsxs("mesh",{position:[0,.4,0],castShadow:!0,children:[e.jsx("boxGeometry",{args:[2,.55,1.05]}),e.jsx("meshStandardMaterial",{color:o,emissive:s,emissiveIntensity:.35,metalness:.75,roughness:.3})]}),e.jsxs("mesh",{position:[-.1,.95,0],castShadow:!0,children:[e.jsx("boxGeometry",{args:[1.2,.5,.92]}),e.jsx("meshStandardMaterial",{color:"#0b1220",emissive:s,emissiveIntensity:.55,metalness:.5,roughness:.35})]}),e.jsxs("mesh",{position:[1.01,.45,0],children:[e.jsx("boxGeometry",{args:[.04,.12,.75]}),e.jsx("meshStandardMaterial",{color:s,emissive:s,emissiveIntensity:2.2,toneMapped:!1})]}),e.jsxs("mesh",{position:[-1.01,.45,0],children:[e.jsx("boxGeometry",{args:[.04,.12,.75]}),e.jsx("meshStandardMaterial",{color:a,emissive:a,emissiveIntensity:1.8,toneMapped:!1})]}),[[-.7,-.55],[.7,-.55],[-.7,.55],[.7,.55]].map(([r,l],c)=>e.jsxs("mesh",{position:[r,.22,l],rotation:[Math.PI/2,0,0],castShadow:!0,children:[e.jsx("cylinderGeometry",{args:[.22,.22,.18,12]}),e.jsx("meshStandardMaterial",{color:"#0a0a0a",roughness:.7})]},`wheel-${c}`))]})}function Gt({pos:t,color:o="#dc2626",accent:s="#fde047",taillight:a="#ef4444"}){const r=i.useRef([]);return N((l,c)=>{for(const n of r.current)n&&(n.rotation.x+=c*22)}),e.jsxs("group",{position:t,children:[e.jsxs("mesh",{position:[0,.28,0],castShadow:!0,children:[e.jsx("boxGeometry",{args:[2.8,.32,1.15]}),e.jsx("meshStandardMaterial",{color:o,emissive:o,emissiveIntensity:.4,metalness:.9,roughness:.18})]}),e.jsxs("mesh",{position:[1.5,.32,0],rotation:[0,0,-Math.PI/2],castShadow:!0,children:[e.jsx("coneGeometry",{args:[.55,.5,4]}),e.jsx("meshStandardMaterial",{color:o,metalness:.9,roughness:.18})]}),e.jsxs("mesh",{position:[.55,.5,0],castShadow:!0,children:[e.jsx("boxGeometry",{args:[.5,.08,.4]}),e.jsx("meshStandardMaterial",{color:"#0b1220",metalness:.7,roughness:.4})]}),e.jsxs("mesh",{position:[-.15,.66,0],castShadow:!0,children:[e.jsx("boxGeometry",{args:[1.1,.38,.95]}),e.jsx("meshStandardMaterial",{color:"#0b1220",emissive:s,emissiveIntensity:.7,metalness:.7,roughness:.2})]}),e.jsxs("mesh",{position:[-1.25,.62,0],castShadow:!0,children:[e.jsx("boxGeometry",{args:[.22,.05,1.15]}),e.jsx("meshStandardMaterial",{color:"#0b1220",metalness:.8,roughness:.3})]}),e.jsxs("mesh",{position:[-1.35,.5,.5],castShadow:!0,children:[e.jsx("boxGeometry",{args:[.05,.25,.05]}),e.jsx("meshStandardMaterial",{color:"#0b1220"})]}),e.jsxs("mesh",{position:[-1.35,.5,-.5],castShadow:!0,children:[e.jsx("boxGeometry",{args:[.05,.25,.05]}),e.jsx("meshStandardMaterial",{color:"#0b1220"})]}),e.jsxs("mesh",{position:[0,.35,.58],children:[e.jsx("boxGeometry",{args:[2.4,.06,.01]}),e.jsx("meshStandardMaterial",{color:s,emissive:s,emissiveIntensity:1.5,toneMapped:!1})]}),e.jsxs("mesh",{position:[0,.35,-.58],children:[e.jsx("boxGeometry",{args:[2.4,.06,.01]}),e.jsx("meshStandardMaterial",{color:s,emissive:s,emissiveIntensity:1.5,toneMapped:!1})]}),e.jsxs("mesh",{position:[1.32,.32,.38],children:[e.jsx("sphereGeometry",{args:[.1,10,8]}),e.jsx("meshStandardMaterial",{color:s,emissive:s,emissiveIntensity:3,toneMapped:!1})]}),e.jsxs("mesh",{position:[1.32,.32,-.38],children:[e.jsx("sphereGeometry",{args:[.1,10,8]}),e.jsx("meshStandardMaterial",{color:s,emissive:s,emissiveIntensity:3,toneMapped:!1})]}),e.jsxs("mesh",{position:[-1.4,.34,.3],children:[e.jsx("boxGeometry",{args:[.04,.1,.25]}),e.jsx("meshStandardMaterial",{color:a,emissive:a,emissiveIntensity:2.4,toneMapped:!1})]}),e.jsxs("mesh",{position:[-1.4,.34,-.3],children:[e.jsx("boxGeometry",{args:[.04,.1,.25]}),e.jsx("meshStandardMaterial",{color:a,emissive:a,emissiveIntensity:2.4,toneMapped:!1})]}),e.jsxs("mesh",{position:[-1.42,.18,.22],rotation:[0,0,Math.PI/2],children:[e.jsx("cylinderGeometry",{args:[.07,.07,.08,10]}),e.jsx("meshStandardMaterial",{color:"#94a3b8",metalness:.9,roughness:.2})]}),e.jsxs("mesh",{position:[-1.42,.18,-.22],rotation:[0,0,Math.PI/2],children:[e.jsx("cylinderGeometry",{args:[.07,.07,.08,10]}),e.jsx("meshStandardMaterial",{color:"#94a3b8",metalness:.9,roughness:.2})]}),[[-.95,-.58],[.95,-.58],[-.95,.58],[.95,.58]].map(([l,c],n)=>e.jsxs("mesh",{ref:p=>{p&&(r.current[n]=p)},position:[l,.26,c],rotation:[Math.PI/2,0,0],castShadow:!0,children:[e.jsx("cylinderGeometry",{args:[.28,.28,.2,16]}),e.jsx("meshStandardMaterial",{color:"#0a0a0a",roughness:.6,metalness:.4})]},`vette-wheel-${n}`)),e.jsxs("mesh",{position:[0,.06,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("planeGeometry",{args:[2.6,1]}),e.jsx("meshBasicMaterial",{color:s,transparent:!0,opacity:.35,toneMapped:!1})]})]})}const le={yaw:0,pitch:.45,distance:14},Ee={pitchMin:.08,pitchMax:1.4,distMin:6,distMax:28},F={moveX:0,moveZ:0,interactTick:0,rideHeld:!1,jetHeld:!1},ce={x:0,z:0,yaw:0},fe=160,Ht=fe,gt=[-150,-120,-54,-27,0,27,54,120,150],bt=[-150,-120,-54,-27,0,27,54,120,150],$t=fe+5,je={0:{width:3,color:"#22c55e"},27:{width:2.2,color:"#4ade80"},54:{width:2.2,color:"#86efac"},120:{width:2.6,color:"#a7f3d0"},150:{width:2.6,color:"#fef3c7"}},ba=8;function Se(t,o,s){return[{id:`${s}-c`,position:[t,o]},{id:`${s}-n`,position:[t,o-8]},{id:`${s}-s`,position:[t,o+8]},{id:`${s}-e`,position:[t+8,o]},{id:`${s}-w`,position:[t-8,o]}]}function ve(t,o){return o.map((s,a)=>({id:`${t}-${a+1}`,position:s}))}const xt=[{id:"foundations",name:"Foundations",emoji:"🧠",hudTitle:"Foundations",color:"#22d3ee",signpost:[-22,0,-91],signpostRotY:-Math.PI/2,lots:Se(-13,-91,"fnd")},{id:"borrowing",name:"Borrowing & Credit",emoji:"💳",hudTitle:"Borrowing & Credit",color:"#f472b6",signpost:[117,0,-117],signpostRotY:-Math.PI/4,lots:Se(103,-103,"bor")},{id:"investing",name:"Investing",emoji:"📈",hudTitle:"Investing",color:"#fbbf24",signpost:[117,0,117],signpostRotY:3*Math.PI/4,lots:Se(103,103,"inv")},{id:"lifeevents",name:"Life Events",emoji:"💍",hudTitle:"Life Events",color:"#a78bfa",signpost:[-117,0,142],signpostRotY:-(3*Math.PI)/4,lots:Se(-103,135,"life")},{id:"consumer",name:"Consumer & Behavioral",emoji:"🛒",hudTitle:"Consumer & Behavioral",color:"#34d399",signpost:[0,0,-117],signpostRotY:Math.PI,lots:ve("csm",[[-95,-103],[-13,-103],[40,-103],[95,-103],[3,-91]])},{id:"macro",name:"Macro & Money",emoji:"🌐",hudTitle:"Macro & Money",color:"#fb923c",signpost:[0,0,117],signpostRotY:0,lots:ve("mac",[[-40,103],[-13,103],[22,103],[95,103],[70,-103]])},{id:"ai",name:"AI & Bots",emoji:"🤖",hudTitle:"AI & Bots",color:"#06b6d4",signpost:[142,0,-142],signpostRotY:-Math.PI/4,lots:ve("ai",[[130,-130],[138,-130],[130,-122],[138,-122],[134,-138]])},{id:"botland",name:"BotLand Amusement Park",emoji:"🎢",hudTitle:"BotLand",color:"#dc2626",signpost:[42,0,42],signpostRotY:Math.PI/4,lots:ve("bl",[[50,50],[45,45],[65,50],[50,65],[60,70],[40,60],[70,60],[55,80],[42,75],[58,52]])}];xt.flatMap(t=>t.lots.map(o=>({...o,quarter:t.id,color:t.color})));const Yt=14,Wt=34,_t=60,zt=32,Vt=9,Kt=1.4,De=45,Xt=22,Fe=55,qt=-30,Jt=-12;function Qt({onPositionChange:t,onInteract:o,isMoving:s}){const a=i.useRef(null),r=i.useRef(new _),l=i.useRef(new _),c=i.useRef(0),n=i.useRef({forward:!1,back:!1,left:!1,right:!1,jet:!1}),p=i.useRef(!1),[f,x]=i.useState(!1),g=i.useRef(!1),[E,y]=i.useState(!1),[u,b]=i.useState(!1),[C,h]=i.useState("Idle"),d=i.useRef(!1),m=i.useRef(!1),A=i.useRef(null),w=i.useRef(0),v=i.useRef(!1),L=S(j=>j.cameraMode),M=S(j=>j.pendingTeleport),R=S(j=>j.clearTeleport);i.useEffect(()=>{if(!M||!a.current)return;const[j,P,B]=M;a.current.position.set(j,P,B),r.current.set(0,0,0),c.current=0,p.current=!1,g.current=!1,x(!1),y(!1),t(a.current.position.clone()),R()},[M,R,t]);const k=i.useRef(F.interactTick),I=i.useRef(!1);return i.useEffect(()=>{const j=T=>{const ee=T;return!!ee&&(ee.tagName==="INPUT"||ee.tagName==="TEXTAREA"||ee.isContentEditable)},P=()=>{p.current&&(p.current=!1,x(!1))},B=()=>{g.current&&(g.current=!1,y(!1)),P()},G=T=>{j(T.target)||((T.key==="ArrowUp"||T.key==="w"||T.key==="W")&&(n.current.forward=!0),(T.key==="ArrowDown"||T.key==="s"||T.key==="S")&&(n.current.back=!0),(T.key==="ArrowLeft"||T.key==="a"||T.key==="A")&&(n.current.left=!0),(T.key==="ArrowRight"||T.key==="d"||T.key==="D")&&(n.current.right=!0),(T.key==="Shift"||T.code==="ShiftLeft"||T.code==="ShiftRight")&&(n.current.jet=!0),(T.key==="e"||T.key==="E")&&a.current&&o(a.current.position.clone()),(T.code==="Space"||T.key===" ")&&(T.preventDefault(),p.current||(p.current=!0,x(!0))),(T.key==="v"||T.key==="V")&&(g.current||(g.current=!0,y(!0)),p.current||(p.current=!0,x(!0))))},$=T=>{(T.key==="ArrowUp"||T.key==="w"||T.key==="W")&&(n.current.forward=!1),(T.key==="ArrowDown"||T.key==="s"||T.key==="S")&&(n.current.back=!1),(T.key==="ArrowLeft"||T.key==="a"||T.key==="A")&&(n.current.left=!1),(T.key==="ArrowRight"||T.key==="d"||T.key==="D")&&(n.current.right=!1),(T.key==="Shift"||T.code==="ShiftLeft"||T.code==="ShiftRight")&&(n.current.jet=!1),(T.code==="Space"||T.key===" ")&&P(),(T.key==="v"||T.key==="V")&&B()},z=()=>{n.current.forward=!1,n.current.back=!1,n.current.left=!1,n.current.right=!1,n.current.jet=!1,B()};return window.addEventListener("keydown",G),window.addEventListener("keyup",$),window.addEventListener("blur",z),()=>{window.removeEventListener("keydown",G),window.removeEventListener("keyup",$),window.removeEventListener("blur",z),H.setJetpack(!1),d.current=!1}},[o]),N((j,P)=>{if(F.interactTick!==k.current&&(k.current=F.interactTick,a.current&&o(a.current.position.clone())),F.rideHeld!==I.current&&(I.current=F.rideHeld,F.rideHeld?p.current||(p.current=!0,x(!0)):p.current&&(p.current=!1,x(!1))),S.getState().editMode){r.current.set(0,0,0);return}const{forward:B,back:G,left:$,right:z}=n.current,T=(z?1:0)-($?1:0),ee=(G?1:0)-(B?1:0),qe=(Y,oe)=>Math.abs(Y)>=Math.abs(oe)?Y:oe,Le=qe(T,F.moveX),Oe=qe(ee,F.moveZ*-1),te=l.current.set(0,0,0);if(L===4){const Y=le.yaw,oe=-Math.sin(Y),ye=-Math.cos(Y),Je=-ye,Pe=oe;te.x+=oe*-Oe+Je*Le,te.z+=ye*-Oe+Pe*Le}else te.x+=Le,te.z+=Oe;te.length()>1&&te.normalize();const At=a.current?a.current.position.y:0,wt=(n.current.jet||F.jetHeld)&&!p.current,Rt=At>.5&&wt?Kt:1,Ct=(g.current?_t:p.current?Wt:Yt)*Rt;if(te.multiplyScalar(Ct*P),r.current.lerp(te,.3),a.current){a.current.position.x+=r.current.x,a.current.position.z+=r.current.z;const Y=(n.current.jet||F.jetHeld)&&!p.current;m.current=Y,Y!==d.current&&(Y&&a.current.position.y<.6&&(c.current=Math.max(c.current,Vt)),d.current=Y,H.setJetpack(Y));const oe=a.current.position.y,ye=oe>De?Math.max(0,1-(oe-De)/(Fe-De)):1,Pe=(Y?zt*ye:0)-Xt;c.current=Math.max(qt,c.current+Pe*P),a.current.position.y+=c.current*P,a.current.position.y<=0&&(c.current<Jt&&(H.step(!1),H.step(!0)),a.current.position.y=0,c.current<0&&(c.current=0)),a.current.position.y>=Fe&&(a.current.position.y=Fe,c.current>0&&(c.current=0));const ge=a.current.position.y>.01,Qe=Y||ge;Qe!==u&&b(Qe);let be="Idle";ge?be=c.current>=0?"FlyUp":"FlyDown":s.current&&(be="TwistJump"),be!==C&&h(be);const xe=fe;a.current.position.x=Math.max(-xe,Math.min(xe,a.current.position.x)),a.current.position.z=Math.max(-xe,Math.min(xe,a.current.position.z)),s.current=r.current.length()>.02;const Ze=3;if(s.current&&!ge&&!p.current?(w.current+=r.current.length(),w.current>=Ze&&(w.current-=Ze,v.current=!v.current,H.step(v.current))):w.current=0,s.current){const Be=Math.atan2(r.current.x,r.current.z);a.current.rotation.y=he.lerp(a.current.rotation.y,Be,.2)}if(A.current){const Be=ge?he.clamp(-c.current*.022,-.55,.4):s.current?.18:0;A.current.rotation.x=he.lerp(A.current.rotation.x,Be,.16)}ce.x=a.current.position.x,ce.z=a.current.position.z,ce.yaw=a.current.rotation.y,t(a.current.position.clone())}}),e.jsxs("group",{ref:a,position:[0,0,0],children:[e.jsx(eo,{}),u&&!f&&e.jsx(Zt,{thrustingRef:m,playerRef:a}),f?e.jsx("group",{rotation:[0,-Math.PI/2,0],children:E?e.jsx(Gt,{pos:[0,0,0],color:"#dc2626",accent:"#fde047"}):e.jsx(yt,{pos:[0,0,0],color:"#dc2626",accent:"#fde047"})}):e.jsx("group",{ref:A,children:e.jsx(Ut,{scale:.4,animation:C})})]})}function Zt({thrustingRef:t,playerRef:o}){const s=i.useRef(null),a=i.useRef(null),r=i.useRef(null),l=i.useRef(null),c=i.useRef(null),n=i.useRef(null),p=i.useRef(null),f=i.useRef(null),x=i.useRef(null),g=i.useRef(null),E=i.useRef(null),y=[f,x,g,E];N(({clock:d})=>{const m=d.elapsedTime,A=t.current,w=o.current?.position.y??0,v=A?1:.3,L=v+Math.sin(m*40)*.2+Math.cos(m*31)*.13,M=Math.max(.15,L),R=.78+Math.sin(m*22)*.08,k=.78+Math.cos(m*24)*.08;s.current&&s.current.scale.set(R,M*1.85,R),a.current&&a.current.scale.set(k,M*1.85,k);const I=Math.max(.1,v*1.05+Math.sin(m*55)*.18);r.current&&r.current.scale.set(.45,I*1.5,.45),l.current&&l.current.scale.set(.45,I*1.5,.45),c.current&&(c.current.intensity=A?5.5+Math.sin(m*30)*1.3:1.2,c.current.color.setHex(A?16486972:16096779));const j=Math.max(0,1-w/6),P=A?j:0;if(n.current){const B=.7+(1-j)*.6+Math.sin(m*9)*.07;n.current.scale.set(B,B,B),n.current.position.y=-w-.07}p.current&&(p.current.opacity=P*(.55+Math.sin(m*12)*.18)),y.forEach((B,G)=>{if(!B.current)return;const $=(m*1.8+G*.25)%1,z=G%2===0?-.28:.28;B.current.position.x=z+Math.sin(m*3+G)*.07,B.current.position.y=-.15-$*1.7,B.current.position.z=-.55+Math.cos(m*2.5+G)*.05;const T=A?.2+$*.55:.06;B.current.scale.set(T,T,T);const ee=B.current.material;ee.opacity=A?(1-$)*.4:0})});const u=-.42,b=.28,C=.55,h=.05;return e.jsxs("group",{position:[0,.15,0],children:[e.jsxs("group",{position:[0,.7,u],children:[e.jsxs("mesh",{castShadow:!0,children:[e.jsx("boxGeometry",{args:[.7,.85,.32]}),e.jsx("meshStandardMaterial",{color:"#1e293b",metalness:.7,roughness:.35,emissive:"#f97316",emissiveIntensity:.18})]}),e.jsxs("mesh",{position:[0,.05,-.165],children:[e.jsx("boxGeometry",{args:[.55,.12,.02]}),e.jsx("meshStandardMaterial",{color:"#fbbf24",emissive:"#fbbf24",emissiveIntensity:.6,toneMapped:!1})]}),[-.18,.18].map((d,m)=>e.jsxs("mesh",{position:[d,-.25,-.17],children:[e.jsx("sphereGeometry",{args:[.04,8,8]}),e.jsx("meshBasicMaterial",{color:"#22c55e",toneMapped:!1})]},`fuel-${m}`)),[-.22,.22].map((d,m)=>e.jsxs("mesh",{position:[d,.15,.2],rotation:[.15,0,0],children:[e.jsx("boxGeometry",{args:[.1,.55,.05]}),e.jsx("meshStandardMaterial",{color:"#0f172a",metalness:.4,roughness:.6})]},`strap-${m}`))]}),[-b,b].map((d,m)=>e.jsxs("group",{position:[d,C,u],children:[e.jsxs("mesh",{castShadow:!0,children:[e.jsx("cylinderGeometry",{args:[.13,.17,.5,14]}),e.jsx("meshStandardMaterial",{color:"#0f172a",metalness:.9,roughness:.25,emissive:"#f97316",emissiveIntensity:.6})]}),e.jsxs("mesh",{position:[0,-.26,0],rotation:[Math.PI/2,0,0],children:[e.jsx("torusGeometry",{args:[.16,.035,8,18]}),e.jsx("meshBasicMaterial",{color:"#fbbf24",toneMapped:!1})]})]},`pod-${m}`)),[-b,b].map((d,m)=>e.jsxs("mesh",{ref:d<0?s:a,position:[d,h,u],rotation:[Math.PI-.15,0,0],renderOrder:2,children:[e.jsx("coneGeometry",{args:[.22,1.4,14,1,!0]}),e.jsx("meshStandardMaterial",{color:"#fde047",emissive:"#f97316",emissiveIntensity:4.5,transparent:!0,opacity:.85,side:U,toneMapped:!1,depthWrite:!1})]},`flame-${m}`)),[-b,b].map((d,m)=>e.jsxs("mesh",{ref:d<0?r:l,position:[d,h+.04,u],rotation:[Math.PI-.15,0,0],renderOrder:3,children:[e.jsx("coneGeometry",{args:[.1,.95,10,1,!0]}),e.jsx("meshBasicMaterial",{color:"#e0f2fe",transparent:!0,opacity:.95,side:U,toneMapped:!1,depthWrite:!1})]},`core-${m}`)),y.map((d,m)=>e.jsxs("mesh",{ref:d,position:[0,-.15,-.55],renderOrder:1,children:[e.jsx("sphereGeometry",{args:[.32,8,8]}),e.jsx("meshBasicMaterial",{color:"#cbd5e1",transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})]},`smoke-${m}`)),e.jsxs("mesh",{ref:n,rotation:[-Math.PI/2,0,0],position:[0,-.07,0],children:[e.jsx("ringGeometry",{args:[.4,1.3,32]}),e.jsx("meshBasicMaterial",{ref:p,color:"#fbbf24",transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1,side:U})]}),e.jsx("pointLight",{ref:c,position:[0,0,u-.2],color:"#f97316",distance:9,intensity:1.2})]})}function eo(){const t=i.useRef(null),o=i.useRef(null),s=i.useRef(null);return N(({clock:a})=>{const r=a.elapsedTime;if(t.current&&(t.current.rotation.z=r*.8),o.current&&(o.current.position.y=2.7+Math.sin(r*2)*.08,o.current.material.emissiveIntensity=1.8+Math.sin(r*3)*.6),s.current){const l=1+Math.sin(r*2)*.12;s.current.scale.set(l,l,l),s.current.material.opacity=.35+Math.sin(r*2)*.12}}),e.jsxs("group",{children:[e.jsxs("mesh",{ref:s,position:[0,2.7,0],children:[e.jsx("sphereGeometry",{args:[.3,16,16]}),e.jsx("meshBasicMaterial",{color:"#22c55e",transparent:!0,opacity:.35,depthWrite:!1})]}),e.jsxs("mesh",{ref:t,position:[0,2.7,0],rotation:[Math.PI/2,0,0],children:[e.jsx("torusGeometry",{args:[.22,.04,8,24]}),e.jsx("meshStandardMaterial",{color:"#fbbf24",emissive:"#fbbf24",emissiveIntensity:2,toneMapped:!1})]}),e.jsxs("mesh",{ref:o,position:[0,2.7,0],children:[e.jsx("sphereGeometry",{args:[.1,12,12]}),e.jsx("meshStandardMaterial",{color:"#86efac",emissive:"#22c55e",emissiveIntensity:2,toneMapped:!1})]})]})}function Te({count:t,startY:o,spacing:s,faceWidth:a,z:r,rotationY:l=0,color:c,windowsPerRow:n}){const f=a-1,x=n>1?f/(n-1):0,g=n===1?[0]:Array.from({length:n},(y,u)=>-f/2+u*x),E=i.useMemo(()=>Array.from({length:t},()=>Array.from({length:n},()=>Math.random()>.3)),[t,n]);return e.jsx("group",{rotation:[0,l,0],position:[0,0,0],children:Array.from({length:t}).map((y,u)=>g.map((b,C)=>{const h=o+u*s,d=E[u]?.[C]??!1;return e.jsxs("group",{position:[b,h,r],children:[e.jsxs("mesh",{children:[e.jsx("boxGeometry",{args:[.55,.4,.04]}),e.jsx("meshStandardMaterial",{color:d?"#ffeebb":"#1a2332",emissive:d?"#ffcc66":"#0a1525",emissiveIntensity:d?1.4:.1,toneMapped:!1})]}),e.jsxs("mesh",{position:[0,0,.04],children:[e.jsx("boxGeometry",{args:[.62,.47,.02]}),e.jsx("meshStandardMaterial",{color:"#0b1220",metalness:.6,roughness:.4})]}),e.jsxs("mesh",{position:[0,0,.06],children:[e.jsx("boxGeometry",{args:[.55,.03,.01]}),e.jsx("meshStandardMaterial",{color:"#0b1220"})]}),e.jsxs("mesh",{position:[0,0,.06],children:[e.jsx("boxGeometry",{args:[.03,.4,.01]}),e.jsx("meshStandardMaterial",{color:"#0b1220"})]}),d&&e.jsxs("mesh",{position:[0,-h-.5,.15],rotation:[-Math.PI/2,0,0],children:[e.jsx("planeGeometry",{args:[.5,.3]}),e.jsx("meshBasicMaterial",{color:"#ffcc66",transparent:!0,opacity:.08})]})]},`${u}-${C}`)}))})}function to({data:t,isNear:o}){const s=i.useRef(null),a=S(I=>I.editMode),r=S(I=>I.selectedBuildingId),l=S(I=>I.setSelectedBuildingId),c=S(I=>I.commitBuildingPos),n=r===t.id,p=I=>{if(a)if(I.stopPropagation(),n)c();else{if(r)return;l(t.id)}};N(({clock:I})=>{if(!o||!s.current)return;const j=I.elapsedTime;s.current.scale.setScalar(1+Math.sin(j*3)*.04)});const{label:f,position:x,color:g,roofColor:E,width:y,depth:u,height:b,emoji:C,visited:h}=t,d=Math.min(1.9,b*.42),m=Math.min(1.1,y*.22),A=Math.max(1,Math.floor((b-1.5)/1.8)),w=1.8,v=-b/2+1.6,L=y>=4?3:2,M=u>=4?2:1,R=o||h||a&&n,k=o||h||a;return e.jsxs("group",{position:x,onClick:p,onPointerOver:a?I=>{I.stopPropagation(),document.body.style.cursor=n?"grabbing":"grab"}:void 0,onPointerOut:a?()=>{document.body.style.cursor=""}:void 0,children:[a&&n&&e.jsxs("mesh",{position:[0,-b/2+.05,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[Math.max(y,u)*.7,Math.max(y,u)*.85,32]}),e.jsx("meshBasicMaterial",{color:"#22d3ee",transparent:!0,opacity:.85,toneMapped:!1,depthWrite:!1})]}),e.jsxs("mesh",{position:[0,-b/2+.13,u/2+.45],receiveShadow:!0,castShadow:!0,children:[e.jsx("boxGeometry",{args:[m+1.4,.2,.9]}),e.jsx("meshStandardMaterial",{color:"#0b1220",metalness:.5,roughness:.5})]}),e.jsxs("mesh",{position:[0,-b/2+.25,u/2+.45],children:[e.jsx("boxGeometry",{args:[m+1.5,.04,.95]}),e.jsx("meshStandardMaterial",{color:g,emissive:g,emissiveIntensity:.8})]}),e.jsxs("mesh",{castShadow:!0,receiveShadow:!0,ref:s,children:[e.jsx("boxGeometry",{args:[y,b,u]}),e.jsx("meshStandardMaterial",{color:"#0f172a",emissive:g,emissiveIntensity:o?.4:.15,metalness:.7,roughness:.25})]}),e.jsxs("mesh",{position:[0,0,u/2+.02],children:[e.jsx("planeGeometry",{args:[y-.3,b-.5]}),e.jsx("meshStandardMaterial",{color:g,emissive:g,emissiveIntensity:o?2.5:1.2,transparent:!0,opacity:.08,metalness:.95,roughness:.05,side:U})]}),[[y/2,u/2],[-y/2,u/2],[y/2,-u/2],[-y/2,-u/2]].map(([I,j],P)=>e.jsxs("mesh",{position:[I,0,j],children:[e.jsx("boxGeometry",{args:[.16,b,.16]}),e.jsx("meshStandardMaterial",{color:E,emissive:E,emissiveIntensity:.5,metalness:.8,roughness:.3})]},P)),e.jsxs("mesh",{position:[0,-b/2+.1,0],children:[e.jsx("boxGeometry",{args:[y+.18,.15,u+.18]}),e.jsx("meshStandardMaterial",{color:g,emissive:g,emissiveIntensity:1})]}),b>=5&&e.jsxs("mesh",{position:[0,-b/2+b*.55,0],children:[e.jsx("boxGeometry",{args:[y+.06,.05,u+.06]}),e.jsx("meshStandardMaterial",{color:E,emissive:E,emissiveIntensity:.6})]}),e.jsxs("mesh",{position:[0,b/2,0],children:[e.jsx("boxGeometry",{args:[y+.18,.1,u+.18]}),e.jsx("meshStandardMaterial",{color:E,emissive:E,emissiveIntensity:1.2})]}),e.jsxs("group",{position:[0,b/2+.18,0],children:[e.jsxs("mesh",{position:[0,0,u/2+.05],children:[e.jsx("boxGeometry",{args:[y+.3,.25,.08]}),e.jsx("meshStandardMaterial",{color:"#0f172a",metalness:.7})]}),e.jsxs("mesh",{position:[0,0,-u/2-.05],children:[e.jsx("boxGeometry",{args:[y+.3,.25,.08]}),e.jsx("meshStandardMaterial",{color:"#0f172a",metalness:.7})]}),e.jsxs("mesh",{position:[y/2+.05,0,0],children:[e.jsx("boxGeometry",{args:[.08,.25,u+.3]}),e.jsx("meshStandardMaterial",{color:"#0f172a",metalness:.7})]}),e.jsxs("mesh",{position:[-y/2-.05,0,0],children:[e.jsx("boxGeometry",{args:[.08,.25,u+.3]}),e.jsx("meshStandardMaterial",{color:"#0f172a",metalness:.7})]})]}),e.jsxs("group",{position:[0,b/2+.45,0],children:[e.jsxs("mesh",{position:[y*.2,.15,-u*.2],castShadow:!0,children:[e.jsx("boxGeometry",{args:[Math.min(y*.35,1.2),.3,Math.min(u*.25,.7)]}),e.jsx("meshStandardMaterial",{color:"#1f2937",metalness:.7,roughness:.5})]}),e.jsxs("mesh",{position:[-y*.25,.2,u*.15],children:[e.jsx("cylinderGeometry",{args:[.12,.16,.2,8]}),e.jsx("meshStandardMaterial",{color:"#0b1220",metalness:.8})]}),e.jsxs("mesh",{position:[-y*.25,.95,u*.15],children:[e.jsx("cylinderGeometry",{args:[.03,.03,1.4,6]}),e.jsx("meshStandardMaterial",{color:"#334155",metalness:.9})]}),e.jsxs("mesh",{position:[-y*.25,1.7,u*.15],children:[e.jsx("sphereGeometry",{args:[.08,8,8]}),e.jsx("meshStandardMaterial",{color:E,emissive:E,emissiveIntensity:1.6,toneMapped:!1})]})]}),R&&e.jsxs(e.Fragment,{children:[e.jsx(Te,{count:A,startY:v,spacing:w,faceWidth:y,z:u/2+.03,color:g,windowsPerRow:L}),e.jsx(Te,{count:A,startY:v,spacing:w,faceWidth:y,z:u/2+.03,rotationY:Math.PI,color:g,windowsPerRow:L}),e.jsx(Te,{count:A,startY:v,spacing:w,faceWidth:u,z:y/2+.03,rotationY:Math.PI/2,color:g,windowsPerRow:M}),e.jsx(Te,{count:A,startY:v,spacing:w,faceWidth:u,z:y/2+.03,rotationY:-Math.PI/2,color:g,windowsPerRow:M})]}),e.jsxs("mesh",{position:[0,-b/2+d/2,u/2+.005],children:[e.jsx("boxGeometry",{args:[m+.2,d+.18,.04]}),e.jsx("meshStandardMaterial",{color:E,emissive:E,emissiveIntensity:.7})]}),e.jsxs("mesh",{position:[0,-b/2+d/2,u/2+.025],castShadow:!0,children:[e.jsx("boxGeometry",{args:[m,d,.05]}),e.jsx("meshStandardMaterial",{color:"#0a0f1a",emissive:g,emissiveIntensity:.5,metalness:.6,roughness:.4})]}),e.jsxs("mesh",{position:[0,-b/2+d/2,u/2+.052],children:[e.jsx("boxGeometry",{args:[.02,d-.1,.01]}),e.jsx("meshStandardMaterial",{color:g,emissive:g,emissiveIntensity:1.2,toneMapped:!1})]}),e.jsxs("mesh",{position:[-.12,-b/2+d/2-.1,u/2+.06],children:[e.jsx("sphereGeometry",{args:[.05,8,8]}),e.jsx("meshStandardMaterial",{color:E,emissive:E,emissiveIntensity:.8,metalness:.9})]}),e.jsxs("mesh",{position:[.12,-b/2+d/2-.1,u/2+.06],children:[e.jsx("sphereGeometry",{args:[.05,8,8]}),e.jsx("meshStandardMaterial",{color:E,emissive:E,emissiveIntensity:.8,metalness:.9})]}),e.jsxs("mesh",{position:[0,-b/2+d+.25,u/2+.35],castShadow:!0,children:[e.jsx("boxGeometry",{args:[m+.7,.08,.55]}),e.jsx("meshStandardMaterial",{color:"#0b1220",metalness:.7,roughness:.3})]}),e.jsxs("mesh",{position:[0,-b/2+d+.21,u/2+.35],children:[e.jsx("boxGeometry",{args:[m+.55,.04,.4]}),e.jsx("meshStandardMaterial",{color:g,emissive:g,emissiveIntensity:1.6,toneMapped:!1})]}),h&&e.jsxs("group",{position:[0,b/2+1.4,0],children:[e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[.3,16,16]}),e.jsx("meshStandardMaterial",{color:"#15803d",emissive:"#22c55e",emissiveIntensity:1.2,metalness:.4,roughness:.3})]}),e.jsxs("mesh",{rotation:[Math.PI/2,0,0],children:[e.jsx("torusGeometry",{args:[.42,.025,8,24]}),e.jsx("meshStandardMaterial",{color:"#86efac",emissive:"#86efac",emissiveIntensity:2,toneMapped:!1})]}),e.jsx(Z,{position:[0,0,.32],fontSize:.32,color:"#ffffff",anchorX:"center",anchorY:"middle",children:"✓"})]}),o&&!a&&e.jsx(so,{y:b/2+2.2}),k&&e.jsx(e.Fragment,{children:e.jsxs(Z,{position:[0,b/2+.85,u/2+.3],fontSize:.45,color:"#ffffff",anchorX:"center",anchorY:"middle",outlineWidth:.06,outlineColor:g,children:[C," ",f]})})]})}const oo=i.memo(to);function so({y:t}){const o=i.useRef(null),s=i.useRef(null);return N(({clock:a})=>{const r=a.elapsedTime;o.current&&(o.current.position.y=t+Math.sin(r*3)*.06),s.current&&(s.current.material.opacity=.8+Math.sin(r*3)*.15)}),e.jsxs("group",{ref:o,position:[0,t,0],children:[e.jsxs("mesh",{position:[0,0,-.01],children:[e.jsx("planeGeometry",{args:[3,.85]}),e.jsx("meshBasicMaterial",{color:"#fbbf24",transparent:!0,opacity:.18,depthWrite:!1})]}),e.jsxs("mesh",{children:[e.jsx("planeGeometry",{args:[2.7,.65]}),e.jsx("meshBasicMaterial",{color:"#021410",transparent:!0,opacity:.9})]}),e.jsxs("mesh",{ref:s,position:[0,0,-.005],children:[e.jsx("planeGeometry",{args:[2.78,.73]}),e.jsx("meshBasicMaterial",{color:"#fbbf24",transparent:!0,opacity:.9})]}),e.jsxs("mesh",{position:[-1.3,0,.01],children:[e.jsx("planeGeometry",{args:[.08,.55]}),e.jsx("meshBasicMaterial",{color:"#22c55e",toneMapped:!1})]}),e.jsx(Z,{position:[-.6,0,.02],fontSize:.3,color:"#fbbf24",anchorX:"center",anchorY:"middle",children:"E"}),e.jsx(Z,{position:[.3,0,.02],fontSize:.24,color:"#ffffff",anchorX:"center",anchorY:"middle",children:"to enter"})]})}const V=200,tt=60,ao=60,ro=450,Ie=360,ot=1.15,io=70;function no(){const t=S(h=>h.editMode),o=S(h=>h.selectedBuildingId),s=S(h=>h.hoverPos),a=S(h=>h.setHoverPos),r=S(h=>h.commitBuildingPos),l=S(h=>h.cancelPickup),c=S(h=>h.setSelectedBuildingId),n=i.useRef(null),p=i.useRef(null),{gl:f}=Ne(),x=i.useRef([0,0]),g=i.useRef(Ie),E=i.useRef(new Set);if(i.useEffect(()=>{t&&(x.current=[0,0],g.current=Ie,E.current.clear())},[t]),i.useEffect(()=>{if(!t)return;const h=new Set(["w","a","s","d","W","A","S","D","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]),d=w=>{const v=w.target;v&&(v.tagName==="INPUT"||v.tagName==="TEXTAREA"||v.isContentEditable)||h.has(w.key)&&E.current.add(w.key.toLowerCase())},m=w=>{E.current.delete(w.key.toLowerCase())},A=()=>E.current.clear();return window.addEventListener("keydown",d),window.addEventListener("keyup",m),window.addEventListener("blur",A),()=>{window.removeEventListener("keydown",d),window.removeEventListener("keyup",m),window.removeEventListener("blur",A)}},[t]),i.useEffect(()=>{if(!t)return;const h=f.domElement,d=m=>{m.preventDefault();const A=m.deltaY>0?ot:1/ot;g.current=Math.min(ro,Math.max(ao,g.current*A))};return h.addEventListener("wheel",d,{passive:!1}),()=>h.removeEventListener("wheel",d)},[t,f]),i.useEffect(()=>{if(!t)return;const h=f.domElement;let d=!1,m=0,A=0;const w=R=>{R.button!==1&&R.button!==2||(d=!0,m=R.clientX,A=R.clientY,h.setPointerCapture?.(R.pointerId),h.style.cursor="grabbing")},v=R=>{if(!d)return;const k=R.clientX-m,I=R.clientY-A;m=R.clientX,A=R.clientY;const j=h.clientHeight||720,P=2*g.current*Math.tan(tt*Math.PI/360)/j,[B,G]=x.current,$=Math.max(-V,Math.min(V,B-k*P)),z=Math.max(-V,Math.min(V,G-I*P));x.current=[$,z]},L=R=>{d&&(d=!1,h.releasePointerCapture?.(R.pointerId),h.style.cursor="")},M=R=>R.preventDefault();return h.addEventListener("pointerdown",w),h.addEventListener("pointermove",v),h.addEventListener("pointerup",L),h.addEventListener("pointercancel",L),h.addEventListener("contextmenu",M),()=>{h.removeEventListener("pointerdown",w),h.removeEventListener("pointermove",v),h.removeEventListener("pointerup",L),h.removeEventListener("pointercancel",L),h.removeEventListener("contextmenu",M),h.style.cursor=""}},[t,f]),N(({clock:h},d)=>{if(t&&p.current){const m=E.current;let A=0,w=0;if((m.has("w")||m.has("arrowup"))&&(w-=1),(m.has("s")||m.has("arrowdown"))&&(w+=1),(m.has("a")||m.has("arrowleft"))&&(A-=1),(m.has("d")||m.has("arrowright"))&&(A+=1),A!==0||w!==0){const M=Math.hypot(A,w),R=io*d*g.current/Ie,[k,I]=x.current,j=Math.max(-V,Math.min(V,k+A/M*R)),P=Math.max(-V,Math.min(V,I+w/M*R));x.current=[j,P]}const[v,L]=x.current;p.current.position.set(v,g.current,L+1e-4),p.current.lookAt(v,0,L)}if(n.current&&o){const m=h.elapsedTime;n.current.scale.setScalar(1+Math.sin(m*4)*.08);const A=n.current.material;A.opacity=.55+Math.sin(m*4)*.2}}),!t)return null;const y=h=>{if(!o)return;const d=et(h.point.x),m=et(h.point.z);(!s||s[0]!==d||s[1]!==m)&&a([d,m])},u=h=>{h.stopPropagation(),o?r():c(null)},b=h=>{h.stopPropagation(),h.nativeEvent.preventDefault?.(),l()},C=s??[0,0];return e.jsxs("group",{children:[e.jsx(kt,{ref:p,makeDefault:!0,fov:tt,position:[0,Ie,1e-4],near:1,far:1e3}),e.jsx("gridHelper",{args:[V*2,V,"#22d3ee","#0e7490"],position:[0,.06,0]}),o&&e.jsxs("mesh",{ref:n,position:[C[0],.08,C[1]],rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[2.2,3,32]}),e.jsx("meshBasicMaterial",{color:"#22d3ee",transparent:!0,opacity:.7,toneMapped:!1,depthWrite:!1})]}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,.04,0],onPointerMove:y,onClick:u,onContextMenu:b,children:[e.jsx("planeGeometry",{args:[V*2,V*2]}),e.jsx("meshBasicMaterial",{visible:!1})]}),e.jsx(lo,{})]})}function lo(){const t=S(r=>r.cityLayout),o=S(r=>r.selectedBuildingId),s=S(r=>r.hoverPos),a=i.useMemo(()=>me.map(r=>{const[l,c]=pe(r.position,r.id,t,o,s),n=t[r.id]!==void 0;return{id:r.id,x:l,z:c,moved:n}}).filter(r=>r.moved&&r.id!==o),[t,o,s]);return e.jsx("group",{children:a.map(r=>e.jsxs("mesh",{position:[r.x,.07,r.z],rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[2.4,2.6,24]}),e.jsx("meshBasicMaterial",{color:"#a3e635",transparent:!0,opacity:.35,toneMapped:!1,depthWrite:!1})]},r.id))})}function co({pos:t,delay:o}){const s=i.useRef(null),a=i.useRef(null);return N(r=>{if(s.current){const l=r.clock.elapsedTime+o;s.current.position.y=t[1]+Math.sin(l*2)*.3,s.current.rotation.y=l*2}if(a.current){const l=r.clock.elapsedTime+o;a.current.scale.setScalar(1+Math.sin(l*3)*.2),a.current.material.opacity=.4+Math.sin(l*3)*.2}}),e.jsxs("group",{ref:s,position:t,children:[e.jsxs("mesh",{ref:a,children:[e.jsx("sphereGeometry",{args:[.7,16,16]}),e.jsx("meshBasicMaterial",{color:"#22c55e",transparent:!0,opacity:.4})]}),e.jsxs("mesh",{castShadow:!0,children:[e.jsx("cylinderGeometry",{args:[.35,.35,.08,16]}),e.jsx("meshStandardMaterial",{color:"#fbbf24",metalness:.95,roughness:.1,emissive:"#fbbf24",emissiveIntensity:.7})]}),e.jsx(Z,{position:[0,0,.05],fontSize:.4,color:"#15803d",anchorX:"center",anchorY:"middle",children:"$"})]})}function uo({pos:t,scale:o=1}){const s=i.useRef(null);return N(a=>{s.current&&(s.current.position.y=t[1]+Math.sin(a.clock.elapsedTime*.8+t[0])*.4,s.current.rotation.y=a.clock.elapsedTime*.5)}),e.jsx("group",{ref:s,position:t,scale:o,children:e.jsx(Z,{fontSize:1.5,color:"#4ade80",anchorX:"center",anchorY:"middle",outlineWidth:.06,outlineColor:"#fbbf24",children:"$"})})}function ho({pos:t,height:o}){const s=i.useRef(null),a=i.useRef(null);return N(r=>{if(s.current){const l=s.current.material;l.emissiveIntensity=.6+Math.sin(r.clock.elapsedTime*2+t[0])*.3}if(a.current){const l=r.clock.elapsedTime+t[0];a.current.scale.set(1+Math.sin(l*1.5)*.1,1,1+Math.sin(l*1.5)*.1),a.current.material.opacity=.15+Math.sin(l*1.5)*.08}}),e.jsxs("group",{position:t,children:[e.jsxs("mesh",{ref:a,position:[0,o/2,0],children:[e.jsx("cylinderGeometry",{args:[.9,1.2,o+.5,12]}),e.jsx("meshBasicMaterial",{color:"#22c55e",transparent:!0,opacity:.15,side:U})]}),e.jsxs("mesh",{ref:s,position:[0,o/2,0],castShadow:!0,children:[e.jsx("cylinderGeometry",{args:[.15,.4,o,6]}),e.jsx("meshStandardMaterial",{color:"#052e16",emissive:"#22c55e",emissiveIntensity:.7,metalness:.8,roughness:.2})]}),e.jsxs("mesh",{position:[0,o+.3,0],children:[e.jsx("octahedronGeometry",{args:[.3]}),e.jsx("meshStandardMaterial",{color:"#86efac",emissive:"#22c55e",emissiveIntensity:2,toneMapped:!1})]})]})}function mo({pos:t,height:o,color:s}){return e.jsxs("group",{position:t,children:[e.jsxs("mesh",{castShadow:!0,position:[0,o/2,0],children:[e.jsx("boxGeometry",{args:[2.5,o,2.5]}),e.jsx("meshStandardMaterial",{color:"#022c22",emissive:s,emissiveIntensity:.4,metalness:.7,roughness:.3})]}),Array.from({length:Math.floor(o/1.5)}).map((a,r)=>e.jsxs("mesh",{position:[0,1+r*1.5,1.27],children:[e.jsx("boxGeometry",{args:[1.8,.4,.05]}),e.jsx("meshStandardMaterial",{color:s,emissive:s,emissiveIntensity:1.2})]},r)),e.jsxs("mesh",{position:[0,o+.3,0],children:[e.jsx("sphereGeometry",{args:[.3,8,8]}),e.jsx("meshStandardMaterial",{color:"#4ade80",emissive:"#4ade80",emissiveIntensity:2.5,toneMapped:!1})]})]})}function po({anchors:t}){const o=i.useRef(null),s=i.useMemo(()=>new Float32Array(t.length*3),[t]);return N(a=>{const r=o.current;if(r){for(let l=0;l<t.length;l++){const c=a.clock.elapsedTime+l*.2,[n,p,f]=t[l];s[l*3]=n+Math.sin(c*.7)*.8,s[l*3+1]=p+Math.sin(c*1.2)*1.5,s[l*3+2]=f+Math.cos(c*.9)*.8}r.geometry.attributes.position.needsUpdate=!0}}),e.jsxs("points",{ref:o,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",args:[s,3]})}),e.jsx("pointsMaterial",{color:"#86efac",size:.35,sizeAttenuation:!0,toneMapped:!1,transparent:!0,opacity:.9,depthWrite:!1})]})}function fo(){const t=i.useRef(null);return N(o=>{if(t.current){const s=t.current.material;s.opacity!==void 0&&(s.opacity=.5+Math.sin(o.clock.elapsedTime)*.15)}}),e.jsx("gridHelper",{ref:t,args:[340,340,"#4ade80","#16a34a"],position:[0,.01,0]})}function yo(){const t=i.useRef(null),o=i.useRef(null),s=i.useRef(null);return N(a=>{const r=a.clock.elapsedTime;t.current&&(t.current.scale.setScalar(1+Math.sin(r*2)*.1),t.current.material.opacity=.6+Math.sin(r*2)*.2),o.current&&(o.current.scale.setScalar(1+Math.sin(r*1.5+.5)*.15),o.current.material.opacity=.3+Math.sin(r*1.5+.5)*.15),s.current&&(s.current.rotation.y=r*.3)}),e.jsxs("group",{children:[e.jsxs("mesh",{ref:t,position:[0,.04,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[3,4,64]}),e.jsx("meshBasicMaterial",{color:"#22c55e",transparent:!0,opacity:.6,side:U})]}),e.jsxs("mesh",{ref:o,position:[0,.03,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[4.5,6,64]}),e.jsx("meshBasicMaterial",{color:"#86efac",transparent:!0,opacity:.3,side:U})]}),e.jsxs("mesh",{ref:s,position:[0,.05,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[2,2.5,32]}),e.jsx("meshBasicMaterial",{color:"#fbbf24",transparent:!0,opacity:.5,side:U})]})]})}const go=[[4,1.2,-4],[-4,1.2,4],[5,1.2,5],[-5,1.2,-5],[12,1.2,12],[-12,1.2,-12],[12,1.2,-12],[-12,1.2,12],[22,1.5,-22],[-22,1.5,22],[22,1.5,22],[-22,1.5,-22]],bo=[{pos:[-14,0,-14],height:4},{pos:[-15,0,5],height:5},{pos:[14,0,-15],height:4.5},{pos:[15,0,12],height:5.5},{pos:[-15,0,-5],height:4},{pos:[12,0,15],height:4.5},{pos:[-12,0,15],height:5},{pos:[15,0,-10],height:4.5},{pos:[4,0,22],height:3.5},{pos:[-22,0,9],height:4},{pos:[-13,0,13],height:4},{pos:[13,0,4],height:4.5}],xo=[{pos:[-44,0,-32],height:14,color:"#22c55e"},{pos:[44,0,-32],height:17,color:"#4ade80"},{pos:[-44,0,32],height:15,color:"#86efac"},{pos:[44,0,32],height:13,color:"#22c55e"},{pos:[-44,0,-12],height:18,color:"#16a34a"},{pos:[44,0,12],height:16,color:"#4ade80"},{pos:[-32,0,-44],height:19,color:"#22c55e"},{pos:[32,0,44],height:17,color:"#86efac"}],Eo=[[-4,0,-4],[4,0,-4],[-4,0,4],[4,0,4],[-8,0,-8],[8,0,-8],[-8,0,8],[8,0,8],[-14,0,-4],[14,0,-4],[-14,0,4],[14,0,4]],So=[[-8,4,-8],[8,5,-8],[-8,4.5,8],[8,5,8],[-22,6,-22],[22,6,-22],[-22,6,22],[22,6,22]],vo=Array.from({length:30}).map((t,o)=>{const s=o/30*Math.PI*2+Math.PI/12,a=8+o%5*2;let r=Math.cos(s)*a,l=Math.sin(s)*a;return Math.abs(r)<2&&(r=(r>=0?1:-1)*2),Math.abs(l)<2&&(l=(l>=0?1:-1)*2),[r,2+o%4,l]});function K(t,o){const s=Math.sin(t*12.9898+o*78.233)*43758.5453;return s-Math.floor(s)}const st=["#1e3a2e","#22463a","#1a3326","#264a3b","#1f3d30"],at=["#a7c4b5","#c8d8cd","#9fb8aa","#b8cdc0"],rt=["#1f4332","#28543f","#1b3a2b","#2e6049","#224836"],To=Array.from({length:48}).map((t,o)=>{const s=o/48*Math.PI*2+K(o,5)*.13,a=6+K(o,8)*5,r=196+K(o,6)*15,l=4+K(o,7)*6;return{pos:[Math.cos(s)*r,0,Math.sin(s)*r],baseR:a,topR:a*.55,height:l,color:rt[o%rt.length]}}),Io=Array.from({length:36}).map((t,o)=>{const s=o/36*Math.PI*2+K(o,1)*.16,a=9+K(o,4)*6,r=214+K(o,2)*18,l=18+K(o,3)*18;return{pos:[Math.cos(s)*r,0,Math.sin(s)*r],baseR:a,topR:a*.12,height:l,color:st[o%st.length],peakColor:at[o%at.length]}}),Ao=Array.from({length:28}).map((t,o)=>{const s=o/28*Math.PI*2+K(o,9)*.22,a=10+K(o,12)*4,r=222+K(o,10)*10,l=22+K(o,11)*14;return{pos:[Math.cos(s)*r,0,Math.sin(s)*r],baseR:a,topR:a*.18,height:l,color:"#162a22",peakColor:"#7fa091"}});function it({feature:t,withPeak:o}){const{pos:s,baseR:a,topR:r,height:l,color:c,peakColor:n}=t,p=.2,f=l*.22;return e.jsxs("group",{position:s,children:[e.jsxs("mesh",{position:[0,(l-p)/2,0],castShadow:!0,receiveShadow:!0,children:[e.jsx("cylinderGeometry",{args:[r,a,l,7,1,!0]}),e.jsx("meshStandardMaterial",{color:c,roughness:.95,metalness:.05,flatShading:!0,side:U})]}),o&&n&&e.jsxs("mesh",{position:[0,l-p-f/2,0],children:[e.jsx("cylinderGeometry",{args:[r*.9,r+(a-r)*(f/l)*.9,f,7,1]}),e.jsx("meshStandardMaterial",{color:n,roughness:.7,flatShading:!0})]})]})}function wo({feature:t}){const{baseR:o,color:s}=t;return e.jsxs("mesh",{castShadow:!0,receiveShadow:!0,children:[e.jsx("sphereGeometry",{args:[o,10,6,0,Math.PI*2,0,Math.PI/2]}),e.jsx("meshStandardMaterial",{color:s,roughness:.9,metalness:.05,flatShading:!0})]})}function Ro(){const t=i.useRef(null),o=i.useRef([]);return N(s=>{const a=s.clock.elapsedTime;if(t.current){const r=t.current.material;r.emissiveIntensity=.3+Math.sin(a*2)*.1}o.current.forEach((r,l)=>{if(r){const c=1+Math.sin(a*3+l*1.5)*.15;r.scale.setScalar(c),r.material.opacity=.3-(c-1)*.5}})}),e.jsxs("group",{position:[0,.1,0],children:[e.jsxs("mesh",{ref:t,rotation:[-Math.PI/2,0,0],position:[0,.02,0],children:[e.jsx("circleGeometry",{args:[2.2,32]}),e.jsx("meshStandardMaterial",{color:"#064e3b",emissive:"#22c55e",emissiveIntensity:.3,metalness:.9,roughness:.1,transparent:!0,opacity:.85})]}),[0,1,2].map(s=>e.jsxs("mesh",{ref:a=>{a&&(o.current[s]=a)},rotation:[-Math.PI/2,0,0],position:[0,.03+s*.01,0],children:[e.jsx("ringGeometry",{args:[.5+s*.4,.7+s*.4,32]}),e.jsx("meshBasicMaterial",{color:"#4ade80",transparent:!0,opacity:.2,side:U})]},`ripple-${s}`)),e.jsxs("mesh",{position:[0,1.2,0],children:[e.jsx("cylinderGeometry",{args:[.08,.2,2.4,8]}),e.jsx("meshStandardMaterial",{color:"#22c55e",emissive:"#4ade80",emissiveIntensity:1.5,transparent:!0,opacity:.4})]})]})}const Ue=40;function Co(){const t=i.useRef(null),o=i.useMemo(()=>Array.from({length:Ue},()=>({x:(Math.random()-.5)*80,y:1+Math.random()*8,z:(Math.random()-.5)*80,speed:.3+Math.random()*.7,offset:Math.random()*Math.PI*2})),[]),s=i.useMemo(()=>new Float32Array(Ue*3),[]);return N(a=>{const r=t.current;if(!r)return;const l=a.clock.elapsedTime;for(let c=0;c<Ue;c++){const n=o[c];s[c*3]=n.x+Math.sin(l*n.speed+n.offset)*3,s[c*3+1]=n.y+Math.sin(l*n.speed*.7+n.offset)*1.5,s[c*3+2]=n.z+Math.cos(l*n.speed+n.offset)*3}r.geometry.attributes.position.needsUpdate=!0}),e.jsxs("points",{ref:t,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",args:[s,3]})}),e.jsx("pointsMaterial",{color:"#fbbf24",size:.25,sizeAttenuation:!0,toneMapped:!1,transparent:!0,opacity:.9,depthWrite:!1})]})}function Mo({pos:t}){const o=i.useRef(null),s=i.useRef(null);return N(a=>{const r=a.clock.elapsedTime;o.current&&(o.current.intensity=1.5+Math.sin(r*2+t[0])*.3),s.current&&(s.current.material.emissiveIntensity=2+Math.sin(r*2+t[0])*.5)}),e.jsxs("group",{position:t,children:[e.jsxs("mesh",{position:[0,1.75,0],castShadow:!0,children:[e.jsx("cylinderGeometry",{args:[.06,.06,3.5,6]}),e.jsx("meshStandardMaterial",{color:"#0f172a",metalness:.8})]}),e.jsxs("mesh",{ref:s,position:[0,3.6,0],children:[e.jsx("torusGeometry",{args:[.35,.06,8,24]}),e.jsx("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:2,toneMapped:!1})]})]})}function ko(){return e.jsxs("group",{children:[To.map((t,o)=>e.jsx("group",{position:t.pos,scale:[1,t.height/t.baseR,1],children:e.jsx(wo,{feature:t})},`hill-${o}`)),Io.map((t,o)=>e.jsx(it,{feature:t,withPeak:!0},`mtn-${o}`)),Ao.map((t,o)=>e.jsx(it,{feature:t,withPeak:!0},`far-${o}`))]})}function jo(){return e.jsxs("group",{children:[e.jsxs("mesh",{receiveShadow:!0,rotation:[-Math.PI/2,0,0],position:[0,0,0],children:[e.jsx("planeGeometry",{args:[500,500]}),e.jsx("meshStandardMaterial",{color:"#042f1f",roughness:.4,metalness:.5})]}),e.jsx(fo,{}),e.jsxs("mesh",{receiveShadow:!0,rotation:[-Math.PI/2,0,0],position:[0,.02,0],children:[e.jsx("ringGeometry",{args:[2.5,4,32]}),e.jsx("meshStandardMaterial",{color:"#052e16",emissive:"#fbbf24",emissiveIntensity:.7,metalness:.7,roughness:.2})]}),e.jsx(yo,{}),e.jsx(Z,{position:[0,4.5,0],fontSize:.7,color:"#4ade80",anchorX:"center",anchorY:"middle",outlineWidth:.04,outlineColor:"#fbbf24",children:"BOTCITY"}),e.jsx(Z,{position:[0,3.7,0],fontSize:.3,color:"#fbbf24",anchorX:"center",anchorY:"middle",outlineWidth:.02,outlineColor:"#15803d",children:"✦ MoneyVerse Hub ✦"}),bo.map((t,o)=>e.jsx(ho,{pos:t.pos,height:t.height},`spire-${o}`)),Eo.map((t,o)=>e.jsx(Mo,{pos:t},`lamp-${o}`)),e.jsx(Ro,{}),e.jsx(Co,{}),go.map((t,o)=>e.jsx(co,{pos:t,delay:o*.3},`coin-${o}`)),So.map((t,o)=>e.jsx(uo,{pos:t,scale:.8+o%3*.3},`holo-${o}`)),e.jsx(po,{anchors:vo}),xo.map((t,o)=>e.jsx(mo,{pos:t.pos,height:t.height,color:t.color},`tower-${o}`)),e.jsx(ko,{})]})}const Ae=[{offset:new _(0,10,14),lookAtY:1,fov:55},{offset:new _(0,18,24),lookAtY:1,fov:60},{offset:new _(0,22,9),lookAtY:1,fov:60},{offset:new _(16,12,16),lookAtY:1,fov:55},{offset:new _(0,6,14),lookAtY:1.2,fov:60}],se=4;function No({target:t}){const{camera:o,gl:s}=Ne(),a=S(h=>h.cameraMode),r=S(h=>h.cycleCamera),l=S(h=>h.setCameraMode),c=S(h=>h.dialogOpenTick),n=i.useRef(-1/0),p=i.useRef(new _),f=i.useRef(new _),x=i.useRef(Ae[0].offset.clone()),g=i.useRef(Ae[0].lookAtY),E=i.useRef(Ae[0].fov),y=i.useRef(new _),u=i.useRef(new _),b=i.useRef(new _);i.useEffect(()=>{c!==0&&(n.current=performance.now()/1e3)},[c]),i.useEffect(()=>{const h=d=>{if(d.ctrlKey||d.metaKey||d.altKey)return;const m=d.target;m&&(m.tagName==="INPUT"||m.tagName==="TEXTAREA"||m.isContentEditable)||(d.key==="c"||d.key==="C"?r():d.key>="1"&&d.key<="5"&&l(Number(d.key)-1))};return window.addEventListener("keydown",h),()=>window.removeEventListener("keydown",h)},[r,l]),i.useEffect(()=>{const h=s.domElement;let d=!1,m=0,A=0;const w=.0055,v=I=>{S.getState().cameraMode===se&&I.button===0&&(d=!0,m=I.clientX,A=I.clientY,h.setPointerCapture(I.pointerId),h.style.cursor="grabbing")},L=I=>{if(!d)return;const j=I.clientX-m,P=I.clientY-A;m=I.clientX,A=I.clientY,le.yaw-=j*w,le.pitch=he.clamp(le.pitch-P*w,Ee.pitchMin,Ee.pitchMax)},M=I=>{if(d){d=!1;try{h.releasePointerCapture(I.pointerId)}catch{}h.style.cursor=S.getState().cameraMode===se?"grab":""}},R=I=>{S.getState().cameraMode===se&&(I.preventDefault(),le.distance=he.clamp(le.distance+I.deltaY*.012,Ee.distMin,Ee.distMax))},k=()=>{d&&(d=!1,h.style.cursor=S.getState().cameraMode===se?"grab":"")};return h.addEventListener("pointerdown",v),h.addEventListener("pointermove",L),h.addEventListener("pointerup",M),h.addEventListener("pointercancel",M),h.addEventListener("lostpointercapture",k),h.addEventListener("wheel",R,{passive:!1}),()=>{h.removeEventListener("pointerdown",v),h.removeEventListener("pointermove",L),h.removeEventListener("pointerup",M),h.removeEventListener("pointercancel",M),h.removeEventListener("lostpointercapture",k),h.removeEventListener("wheel",R),h.style.cursor=""}},[s]),i.useEffect(()=>{s.domElement.style.cursor=a===se?"grab":""},[a,s]);const C=S(h=>h.editMode);return N(()=>{if(C)return;const h=Ae[a];let d;if(a===se){const{yaw:M,pitch:R,distance:k}=le,I=Math.cos(R);b.current.set(Math.sin(M)*k*I,Math.sin(R)*k,Math.cos(M)*k*I),d=b.current}else d=h.offset;const m=a===se?.5:.07;x.current.lerp(d,m),g.current+=(h.lookAtY-g.current)*.07;const w=performance.now()/1e3-n.current;if(w>=0&&w<.55){const M=w/.55,R=Math.sin(M*Math.PI),k=h.fov-R*8;E.current+=(k-E.current)*.25}else E.current+=(h.fov-E.current)*.07;y.current.copy(t.current).add(x.current);const v=a===se?.6:.1;p.current.lerp(y.current,v),o.position.copy(p.current),u.current.copy(t.current),u.current.y+=g.current,f.current.lerp(u.current,.15),o.lookAt(f.current);const L=o;Math.abs(L.fov-E.current)>.01&&(L.fov=E.current,L.updateProjectionMatrix())}),null}const we=56;function Lo(){return typeof window>"u"?!1:"ontouchstart"in window||typeof navigator<"u"&&navigator.maxTouchPoints>0}function Oo(){const[t,o]=i.useState(()=>{try{const a=localStorage.getItem("botcity:touchUi");if(a==="1")return!0;if(a==="0")return!1}catch{}return Lo()}),s=a=>{o(a);try{localStorage.setItem("botcity:touchUi",a?"1":"0")}catch{}};return e.jsxs(e.Fragment,{children:[t&&e.jsx(Po,{}),e.jsx("button",{type:"button",onClick:()=>s(!t),className:"fixed bottom-4 right-4 z-30 pointer-events-auto bg-slate-950/80 text-white text-[11px] rounded-full w-10 h-10 border border-emerald-500/20 backdrop-blur-md shadow-[0_0_20px_-8px_rgba(34,197,94,0.5)] hover:bg-slate-900/90 transition-colors flex items-center justify-center",title:t?"Hide touch controls":"Show touch controls",style:{right:t?"calc(1rem + 180px)":"1rem"},children:t?"⌨️":"👆"})]})}function Po(){return e.jsxs(e.Fragment,{children:[e.jsx(Bo,{}),e.jsx(Do,{})]})}function Bo(){const t=i.useRef(null),[o,s]=i.useState({x:0,y:0}),a=i.useRef(null),r=i.useRef({x:0,y:0});i.useEffect(()=>{const c=t.current;if(!c)return;const n=()=>{const y=c.getBoundingClientRect();r.current={x:y.left+y.width/2,y:y.top+y.height/2}},p=(y,u)=>{const b=y-r.current.x,C=u-r.current.y,h=Math.hypot(b,C),d=Math.min(h,we),m=Math.atan2(C,b),A=Math.cos(m)*d,w=Math.sin(m)*d;s({x:A,y:w}),F.moveX=A/we,F.moveZ=-w/we},f=()=>{a.current=null,s({x:0,y:0}),F.moveX=0,F.moveZ=0},x=y=>{a.current===null&&(a.current=y.pointerId,n(),c.setPointerCapture(y.pointerId),p(y.clientX,y.clientY),y.preventDefault())},g=y=>{a.current===y.pointerId&&(p(y.clientX,y.clientY),y.preventDefault())},E=y=>{if(a.current===y.pointerId){try{c.releasePointerCapture(y.pointerId)}catch{}f()}};return c.addEventListener("pointerdown",x),c.addEventListener("pointermove",g),c.addEventListener("pointerup",E),c.addEventListener("pointercancel",E),c.addEventListener("lostpointercapture",E),window.addEventListener("blur",f),()=>{c.removeEventListener("pointerdown",x),c.removeEventListener("pointermove",g),c.removeEventListener("pointerup",E),c.removeEventListener("pointercancel",E),c.removeEventListener("lostpointercapture",E),window.removeEventListener("blur",f),F.moveX=0,F.moveZ=0}},[]);const l=we*2;return e.jsxs("div",{ref:t,className:"fixed bottom-6 left-6 z-30 pointer-events-auto rounded-full border-2 border-emerald-400/40 bg-slate-950/60 backdrop-blur-md shadow-[0_0_30px_-8px_rgba(34,197,94,0.6)] touch-none select-none",style:{width:l,height:l,touchAction:"none"},children:[e.jsx("div",{className:"absolute inset-3 rounded-full border border-emerald-500/20"}),e.jsx("div",{className:"absolute top-1/2 left-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 border-2 border-emerald-200 shadow-[0_0_18px_-2px_rgba(34,197,94,0.9)] pointer-events-none",style:{transform:`translate(calc(-50% + ${o.x}px), calc(-50% + ${o.y}px))`}})]})}function Do(){const t=()=>{F.interactTick+=1},o=i.useRef(null),s=i.useRef(null);return i.useEffect(()=>{const a=(n,p)=>{if(!n)return()=>{};const f=g=>{p(!0),n.setPointerCapture(g.pointerId),g.preventDefault()},x=g=>{p(!1);try{n.releasePointerCapture(g.pointerId)}catch{}};return n.addEventListener("pointerdown",f),n.addEventListener("pointerup",x),n.addEventListener("pointercancel",x),n.addEventListener("lostpointercapture",x),()=>{n.removeEventListener("pointerdown",f),n.removeEventListener("pointerup",x),n.removeEventListener("pointercancel",x),n.removeEventListener("lostpointercapture",x),p(!1)}},r=a(o.current,n=>{F.rideHeld=n}),l=a(s.current,n=>{F.jetHeld=n}),c=()=>{F.rideHeld=!1,F.jetHeld=!1};return window.addEventListener("blur",c),document.addEventListener("visibilitychange",c),()=>{r(),l(),window.removeEventListener("blur",c),document.removeEventListener("visibilitychange",c)}},[]),e.jsxs("div",{className:"fixed bottom-6 right-6 z-30 pointer-events-auto flex flex-col gap-3 items-end",style:{touchAction:"none"},children:[e.jsx("button",{type:"button",onClick:t,className:"w-20 h-20 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 font-extrabold text-2xl shadow-[0_0_24px_-4px_rgba(251,191,36,0.8)] border-2 border-amber-200 active:scale-95 transition-transform select-none","aria-label":"Enter building",children:"E"}),e.jsx("button",{ref:s,type:"button",className:"w-16 h-16 rounded-full bg-gradient-to-b from-orange-300 to-orange-600 text-white text-2xl shadow-[0_0_22px_-4px_rgba(249,115,22,0.85)] border-2 border-orange-200 active:scale-95 transition-transform select-none","aria-label":"Jetpack (hold to fly)",title:"Jetpack — hold to fly",children:"🚀"}),e.jsx("button",{ref:o,type:"button",className:"w-16 h-16 rounded-full bg-gradient-to-b from-rose-400 to-rose-600 text-white text-2xl shadow-[0_0_20px_-4px_rgba(244,63,94,0.7)] border-2 border-rose-200 active:scale-95 transition-transform select-none","aria-label":"Ride BotMobile (hold)",children:"🚗"})]})}const Re=$t,D=168;function de(t,o){const s=(t+Re)/(Re*2)*D,a=(o+Re)/(Re*2)*D;return{px:s,py:a}}function Fo(){const t=S(u=>u.visitedBuildings),o=S(u=>u.cityLayout),s=S(u=>u.selectedBuildingId),a=S(u=>u.hoverPos),[r,l]=i.useState(()=>{try{return localStorage.getItem("botcity:miniMap")==="0"}catch{return!1}});i.useEffect(()=>{try{localStorage.setItem("botcity:miniMap",r?"0":"1")}catch{}},[r]);const[,c]=i.useState(0),n=i.useRef(null),p=i.useRef(0);i.useEffect(()=>{if(r)return;const u=b=>{b-p.current>=50&&(p.current=b,c(C=>(C+1)%1e3)),n.current=requestAnimationFrame(u)};return n.current=requestAnimationFrame(u),()=>{n.current!==null&&cancelAnimationFrame(n.current)}},[r]);const{px:f,py:x}=de(ce.x,ce.z),g=9,E=f+Math.sin(ce.yaw)*g,y=x+Math.cos(ce.yaw)*g;return e.jsx("div",{className:"fixed top-4 right-16 z-20 pointer-events-auto",style:{width:r?"auto":D+8},children:e.jsxs("div",{className:"bg-slate-950/85 rounded-2xl border border-emerald-500/20 backdrop-blur-md shadow-[0_0_30px_-10px_rgba(34,197,94,0.4)] overflow-hidden",children:[e.jsxs("button",{type:"button",onClick:()=>l(u=>!u),className:"w-full flex items-center justify-between px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] font-bold text-amber-300/90 hover:bg-slate-900/60 transition-colors",title:r?"Show radar":"Hide radar",children:[e.jsx("span",{children:"🗺️ Radar"}),e.jsx("span",{className:"text-emerald-300/80 font-mono normal-case tracking-normal",children:r?"▾":"▴"})]}),!r&&e.jsxs("div",{className:"px-1 pb-1",children:[e.jsxs("svg",{width:D,height:D,viewBox:`0 0 ${D} ${D}`,className:"block rounded-xl bg-emerald-950/40",children:[e.jsx("circle",{cx:D/2,cy:D/2,r:D/2-2,fill:"none",stroke:"rgba(34,197,94,0.18)"}),e.jsx("circle",{cx:D/2,cy:D/2,r:(D/2-2)*.66,fill:"none",stroke:"rgba(34,197,94,0.12)"}),e.jsx("circle",{cx:D/2,cy:D/2,r:(D/2-2)*.33,fill:"none",stroke:"rgba(34,197,94,0.08)"}),gt.map(u=>{const{px:b}=de(u,0),C=je[Math.abs(u)],h=u===0?.42:Math.abs(u)>=115?.3:.18;return e.jsx("line",{x1:b,y1:0,x2:b,y2:D,stroke:C.color,strokeOpacity:h,strokeWidth:u===0?1.4:.8},`vr-${u}`)}),bt.map(u=>{const{py:b}=de(0,u),C=je[Math.abs(u)],h=u===0?.42:Math.abs(u)>=115?.3:.18;return e.jsx("line",{x1:0,y1:b,x2:D,y2:b,stroke:C.color,strokeOpacity:h,strokeWidth:u===0?1.4:.8},`hr-${u}`)}),xt.map(u=>{const{px:b,py:C}=de(u.signpost[0],u.signpost[2]);return e.jsx("g",{style:{pointerEvents:"none"},children:e.jsx("text",{x:b,y:C,fontSize:8,textAnchor:"middle",fill:u.color,fillOpacity:.85,fontWeight:"bold",style:{letterSpacing:"0.02em"},children:u.emoji})},`q-${u.id}`)}),[{x:D/2,y:9,label:"N"},{x:D/2,y:D-5,label:"S"},{x:7,y:D/2+3,label:"W"},{x:D-7,y:D/2+3,label:"E"}].map(u=>e.jsx("text",{x:u.x,y:u.y,fontSize:9,fontWeight:"bold",textAnchor:"middle",fill:"rgba(134,239,172,0.7)",style:{pointerEvents:"none",letterSpacing:"0.05em"},children:u.label},u.label)),me.map(u=>{const b=t.includes(u.id),[C,h]=pe(u.position,u.id,o,s,a),{px:d,py:m}=de(C,h);return e.jsxs("g",{children:[e.jsx("circle",{cx:d,cy:m,r:b?4:5,fill:b?"rgba(34,197,94,0.55)":"rgba(251,191,36,0.95)",stroke:b?"rgba(34,197,94,0.9)":"rgba(254,243,199,1)",strokeWidth:b?.8:1.2,children:!b&&e.jsx("animate",{attributeName:"r",values:"5;7;5",dur:"1.8s",repeatCount:"indefinite"})}),!b&&e.jsxs("circle",{cx:d,cy:m,r:6,fill:"none",stroke:"rgba(251,191,36,0.55)",strokeWidth:1,children:[e.jsx("animate",{attributeName:"r",values:"6;13;6",dur:"1.8s",repeatCount:"indefinite"}),e.jsx("animate",{attributeName:"opacity",values:"0.7;0;0.7",dur:"1.8s",repeatCount:"indefinite"})]}),e.jsx("text",{x:d,y:m-8,fontSize:9,textAnchor:"middle",style:{pointerEvents:"none"},children:u.emoji})]},u.id)}),e.jsx("line",{x1:f,y1:x,x2:E,y2:y,stroke:"rgba(134,239,172,0.95)",strokeWidth:2,strokeLinecap:"round"}),e.jsx("circle",{cx:f,cy:x,r:4,fill:"#22c55e",stroke:"white",strokeWidth:1.5})]}),e.jsxs("div",{className:"mt-1 px-1.5 flex items-center justify-between text-[9.5px] text-emerald-200/70 uppercase tracking-wider",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"inline-block w-2 h-2 rounded-full bg-amber-400"}),"To visit"]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:"inline-block w-2 h-2 rounded-full bg-emerald-500"}),"You"]})]})]})]})})}function Uo(){const t=S(n=>n.editMode),o=S(n=>n.toggleEditMode),s=S(n=>n.resetCityLayout),a=S(n=>n.cityLayout),r=S(n=>n.selectedBuildingId),l=S(n=>n.cancelPickup),c=Object.keys(a).length;return e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",onClick:o,className:`pointer-events-auto text-xs rounded-xl px-3 py-2 border backdrop-blur-md transition-colors ${t?"bg-cyan-500/90 text-slate-950 border-cyan-200 shadow-[0_0_24px_-6px_rgba(34,211,238,0.9)] hover:bg-cyan-400":"bg-slate-950/80 text-white border-cyan-500/30 shadow-[0_0_24px_-12px_rgba(34,211,238,0.5)] hover:bg-slate-900/90"}`,title:"Toggle Build Mode (B). Click a building to pick it up, click again to drop.",children:t?"🏗️ Building… (B)":"🏗️ Build Mode (B)"}),t&&c>0&&e.jsxs("button",{type:"button",onClick:()=>{window.confirm("Reset the entire city layout to its original design?")&&s()},className:"pointer-events-auto bg-slate-950/80 text-rose-200 text-xs rounded-xl px-3 py-2 border border-rose-500/40 backdrop-blur-md hover:bg-rose-950/60 transition-colors",title:"Restore every building to its starting position",children:["♻️ Reset Layout (",c,")"]}),t&&r&&e.jsx("button",{type:"button",onClick:l,className:"pointer-events-auto bg-slate-950/80 text-amber-200 text-xs rounded-xl px-3 py-2 border border-amber-500/40 backdrop-blur-md hover:bg-amber-950/60 transition-colors",title:"Put the building back where it was (Esc)",children:"✖ Cancel pickup (Esc)"})]})}function Go(){const t=S(s=>s.editMode),o=S(s=>s.selectedBuildingId);return t?e.jsx("div",{className:"pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 z-20",children:e.jsx("div",{className:"bg-cyan-500/95 text-slate-950 rounded-full px-5 py-2 text-sm font-semibold border border-cyan-200 shadow-[0_0_30px_-6px_rgba(34,211,238,0.9)] backdrop-blur",children:o?`🏗️ Carrying ${o} — click to drop · WASD/drag pan · Scroll zoom · Esc cancel`:"🏗️ Build Mode — WASD or right-drag pan · Scroll zoom · Click a building to pick it up · B/Esc to exit"})}):null}const Et=[{title:"Civic & Justice",emoji:"🏛️",items:[{id:"botcityhall",emoji:"🏛️",label:"BotCityHall"},{id:"irs",emoji:"📋",label:"IRS Office"},{id:"botpolice",emoji:"🚓",label:"BotPolice Precinct"},{id:"botfire",emoji:"🚒",label:"BotFire Station"},{id:"botcourt",emoji:"⚖️",label:"BotCourt (Tax Court)"}]},{title:"Work & Business",emoji:"💼",items:[{id:"workcorp",emoji:"💼",label:"WorkCorp"},{id:"moneybottowers",emoji:"🏢",label:"MoneyBot Towers"},{id:"botgigs",emoji:"🛵",label:"BotGigs"},{id:"botfactory",emoji:"🏭",label:"BotFactory"}]},{title:"Finance",emoji:"💰",items:[{id:"firstbank",emoji:"🏦",label:"First Bank"},{id:"botbroker",emoji:"📈",label:"BotBroker"},{id:"botcrypto",emoji:"₿",label:"BotCrypto"},{id:"botstockex",emoji:"🐂",label:"BotStock Exchange"}]},{title:"Health & Insurance",emoji:"🏥",items:[{id:"bothospital",emoji:"🏥",label:"BotHospital"},{id:"botinsurance",emoji:"🛡️",label:"BotInsurance HQ"}]},{title:"Family & Home",emoji:"👨‍👩‍👧",items:[{id:"botkids",emoji:"🧒",label:"BotKids"},{id:"littlebots",emoji:"🧸",label:"LittleBots DayCare"},{id:"botcharity",emoji:"❤️",label:"BotCharity"},{id:"botretirement",emoji:"🏛️",label:"BotRetirement"},{id:"bothaus",emoji:"🏠",label:"BotHaus"}]},{title:"Retail & Services",emoji:"🛒",items:[{id:"taxmart",emoji:"🛒",label:"TaxMart"},{id:"botmarket",emoji:"🛍️",label:"BotMarket"},{id:"botshops",emoji:"🏪",label:"BotShops"},{id:"botdealer",emoji:"🚗",label:"BotDealer"}]},{title:"Schools & Universities",emoji:"🎓",items:[{id:"botelementary",emoji:"🏫",label:"BotElementary"},{id:"botmiddle",emoji:"🏫",label:"BotMiddle School"},{id:"bothigh",emoji:"🏫",label:"BotHigh School"},{id:"botunorth",emoji:"🎓",label:"BotU North Campus"},{id:"botusouth",emoji:"🎓",label:"BotU South Campus"}]},{title:"Museums & Galleries",emoji:"🖼️",items:[{id:"bothistory",emoji:"🤖",label:"Bot History Museum"},{id:"eduhistory",emoji:"📚",label:"Education History Museum"},{id:"finhistory",emoji:"💰",label:"Finance History Museum"},{id:"botgallery",emoji:"🎨",label:"BotGallery"}]},{title:"Entertainment",emoji:"🎭",items:[{id:"botfashion",emoji:"👗",label:"BotFashion District"},{id:"moneybotgaminghq",emoji:"🎮",label:"MoneyBot Gaming HQ"},{id:"botcasino",emoji:"🎰",label:"BotCasino"}]},{title:"Media",emoji:"📡",items:[{id:"moneybotnews",emoji:"📰",label:"MoneyBot News"},{id:"moneybotradio",emoji:"📻",label:"MoneyBot Radio"},{id:"moneybotcomic",emoji:"💥",label:"MoneyBot ComicShop"}]},{title:"Defense",emoji:"🪖",items:[{id:"militarybase",emoji:"🪖",label:"Anti-Broke Military Base"}]},{title:"Sports",emoji:"⚽",items:[{id:"botstadium",emoji:"🏟️",label:"BotStadium"},{id:"botsoccer",emoji:"⚽",label:"BotSoccer Stadium"},{id:"botbasketball",emoji:"🏀",label:"BotHoops Arena"},{id:"botgolf",emoji:"⛳",label:"BotGolf Course"}]},{title:"Transit",emoji:"🚆",items:[{id:"bottrain",emoji:"🚆",label:"BotTrain"},{id:"botplane",emoji:"✈️",label:"BotPlane International"},{id:"botrocket",emoji:"🚀",label:"BotRocket Station"}]},{title:"Nature & Leisure",emoji:"🌳",items:[{id:"botbeach",emoji:"🏖️",label:"BotBeach"},{id:"botfarm",emoji:"🚜",label:"BotFarm"},{id:"botzoo",emoji:"🦒",label:"BotZoo"},{id:"botpark",emoji:"🏔️",label:"BotNational Park"}]},{title:"Industry & Specialty",emoji:"⚓",items:[{id:"botport",emoji:"⚓",label:"BotPort Harbor"},{id:"botmine",emoji:"⛏️",label:"BotMine"},{id:"botenergy",emoji:"⚡",label:"BotEnergy"}]},{title:"Foundations",emoji:"🧠",items:[{id:"botmint",emoji:"💵",label:"BotMint"},{id:"botbudget",emoji:"📒",label:"BotBudget Cafe"},{id:"botsavings",emoji:"🐷",label:"BotSavings Plaza"},{id:"botcreditbureau",emoji:"📇",label:"BotCredit Bureau"},{id:"botbehavioral",emoji:"🧠",label:"BotBehavioral Lab"}]},{title:"Borrowing & Credit",emoji:"💳",items:[{id:"botmortgage",emoji:"🏘️",label:"BotMortgage Bank"},{id:"botstudentaid",emoji:"🎓",label:"BotStudentAid"},{id:"botautoloans",emoji:"🚙",label:"BotAuto Loans"},{id:"botpayday",emoji:"⏱️",label:"BotPayday & Pawn"},{id:"botbankruptcy",emoji:"⚖️",label:"BotBankruptcy Court"}]},{title:"Investing",emoji:"📈",items:[{id:"botindex",emoji:"📊",label:"BotIndex Funds"},{id:"botreit",emoji:"🏢",label:"BotREIT Tower"},{id:"botcommodities",emoji:"🌾",label:"BotCommodities Pit"},{id:"botventure",emoji:"🚀",label:"BotVenture Capital"},{id:"botbonds",emoji:"🧾",label:"BotBonds Desk"}]},{title:"Life Events",emoji:"💍",items:[{id:"botchapel",emoji:"💒",label:"BotChapel"},{id:"botmaternity",emoji:"👶",label:"BotMaternity Ward"},{id:"botestate",emoji:"⚰️",label:"BotEstate Office"},{id:"bothealthplan",emoji:"🩺",label:"BotHealthPlan Clinic"},{id:"botdivorce",emoji:"💔",label:"BotDivorce Mediation"}]},{title:"Consumer & Behavioral",emoji:"🛒",items:[{id:"botconsumer",emoji:"🛡️",label:"BotConsumer Protection"},{id:"botads",emoji:"📺",label:"BotAds & Marketing"},{id:"botthrift",emoji:"♻️",label:"BotThrift & Resale"},{id:"botgiving",emoji:"🎁",label:"BotGiving Foundation"},{id:"botfintech",emoji:"📱",label:"BotFinTech Hub"}]},{title:"Macro & Money",emoji:"🌐",items:[{id:"botecon",emoji:"🧪",label:"BotEcon Lab"},{id:"botforex",emoji:"💱",label:"BotForex Exchange"},{id:"bottrade",emoji:"🌐",label:"BotTrade Hall"},{id:"botinflation",emoji:"🎈",label:"BotInflation Park"},{id:"botpolicy",emoji:"🏛️",label:"BotPolicyHall"}]},{title:"AI & Bots",emoji:"🤖",items:[{id:"botaihq",emoji:"🧠",label:"BotAI Headquarters"},{id:"botmlab",emoji:"⚙️",label:"BotMachine Learning Lab"},{id:"botdatacenter",emoji:"🖥️",label:"BotData Center"},{id:"botrobotics",emoji:"🔧",label:"BotRobotics Factory"},{id:"botautomation",emoji:"🔄",label:"BotAutomation Hub"}]},{title:"BotLand Amusement Park",emoji:"🎢",items:[{id:"botlandgate",emoji:"🎢",label:"BotLand Main Gate"},{id:"botferris",emoji:"🎡",label:"BotLand Ferris Wheel"},{id:"botcoaster",emoji:"🎢",label:"BotLand Roller Coaster"},{id:"botcarousel",emoji:"🎠",label:"BotLand Carousel"},{id:"botwaterslide",emoji:"💦",label:"BotLand Water Slide"},{id:"botswing",emoji:"🪑",label:"BotLand Swing Ride"},{id:"botdrop",emoji:"🗼",label:"BotLand Drop Tower"},{id:"botbumper",emoji:"🚗",label:"BotLand Bumper Cars"},{id:"botarcade",emoji:"🕹️",label:"BotLand Arcade"},{id:"botconcessions",emoji:"🍿",label:"BotLand Concessions"}]}],Ce=Et.flatMap(t=>t.items);function ne({label:t,value:o,tone:s="neutral",bold:a=!1}){const r={neutral:"text-emerald-100",good:"text-emerald-400",warn:"text-amber-400",bad:"text-rose-400",muted:"text-emerald-200/60"}[s];return e.jsxs("div",{className:"flex justify-between gap-6",children:[e.jsx("span",{className:"text-emerald-200/60",children:t}),e.jsx("span",{className:`font-mono tabular-nums ${r} ${a?"font-bold":""}`,children:o})]})}function We({children:t}){return e.jsx("div",{className:"text-[11px] font-bold text-amber-300/90 uppercase tracking-[0.18em] mb-3",children:t})}function Ho(){const{income:t,deductions:o,withheld:s,visitedBuildings:a,score:r,documents:l}=S(),{tax:c}=Bt(t,o),n=Ce.filter(g=>a.includes(g.id)).length,p=n/Ce.length*100,[f,x]=i.useState(()=>{try{return localStorage.getItem("botcity:panelsHidden")==="1"}catch{return!1}});return i.useEffect(()=>{try{localStorage.setItem("botcity:panelsHidden",f?"1":"0")}catch{}},[f]),i.useEffect(()=>{const g=E=>{if(E.ctrlKey||E.metaKey||E.altKey)return;const y=E.target;if(!(y&&(y.tagName==="INPUT"||y.tagName==="TEXTAREA"||y.isContentEditable))&&((E.key==="h"||E.key==="H")&&x(u=>!u),(E.key==="b"||E.key==="B")&&S.getState().toggleEditMode(),E.key==="Escape")){const u=S.getState();u.editMode&&(u.selectedBuildingId?u.cancelPickup():u.setEditMode(!1))}};return window.addEventListener("keydown",g),()=>window.removeEventListener("keydown",g)},[]),e.jsxs("div",{className:"fixed top-0 left-0 right-0 pointer-events-none z-10 p-4",children:[e.jsx(Go,{}),e.jsxs("div",{className:"flex gap-2 mb-3 flex-wrap",children:[e.jsx("button",{type:"button",onClick:()=>x(g=>!g),className:"pointer-events-auto bg-slate-950/80 text-white text-xs rounded-xl px-3 py-2 border border-emerald-500/20 backdrop-blur-md shadow-[0_0_24px_-12px_rgba(34,197,94,0.5)] hover:bg-slate-900/90 transition-colors",title:f?"Show HUD panels (H)":"Hide HUD panels (H)",children:f?"👁️ Show HUD":"🙈 Hide HUD"}),e.jsx(Uo,{})]}),e.jsxs("div",{className:`flex gap-3 flex-wrap transition-opacity ${f?"hidden":""}`,children:[e.jsxs("div",{className:"bg-slate-950/85 text-white rounded-2xl p-4 min-w-[230px] border border-emerald-500/20 backdrop-blur-md shadow-[0_0_30px_-10px_rgba(34,197,94,0.4)]",children:[e.jsx(We,{children:"💰 Financial Overview"}),e.jsxs("div",{className:"space-y-1.5 text-sm",children:[e.jsx(ne,{label:"Total Income",value:`$${t.toLocaleString()}`,tone:"good"}),e.jsx(ne,{label:"Total Savings",value:`$${Math.max(0,t-o).toLocaleString()}`,tone:"good"}),e.jsx(ne,{label:"Investments",value:`$${o.toLocaleString()}`,tone:"warn"}),e.jsx("div",{className:"border-t border-emerald-500/10 pt-1.5",children:e.jsx(ne,{label:"Net Worth",value:`$${Math.max(0,t+o).toLocaleString()}`,tone:"good",bold:!0})}),e.jsx(ne,{label:"Financial IQ",value:`Level ${Math.floor(n/5)+1}`,tone:"warn"}),e.jsx(ne,{label:"Buildings Explored",value:`${n}/${Ce.length}`,tone:"muted"}),e.jsx("div",{className:"border-t border-emerald-500/10 pt-1.5",children:e.jsx(ne,{label:"XP Score",value:`${r.toLocaleString()}`,tone:"good",bold:!0})})]})]}),e.jsxs("div",{className:"bg-slate-950/85 text-white rounded-2xl p-4 min-w-[230px] border border-emerald-500/20 backdrop-blur-md shadow-[0_0_30px_-10px_rgba(34,197,94,0.4)]",children:[e.jsxs("div",{className:"flex items-baseline justify-between mb-3",children:[e.jsx(We,{children:"Objectives"}),e.jsxs("div",{className:"text-[11px] font-mono text-emerald-300/80",children:[n,"/",Ce.length]})]}),e.jsx("div",{className:"h-1.5 w-full rounded-full bg-emerald-900/40 overflow-hidden mb-3",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500 ease-out",style:{width:`${p}%`}})}),e.jsx("div",{className:"space-y-3 text-sm max-h-[55vh] overflow-y-auto pr-1",children:Et.map((g,E)=>{const y=g.items.filter(d=>a.includes(d.id)).length,u=g.items.length,b=u===0,C=!b&&y===u,h=E>0?"pt-2 border-t border-emerald-500/15":"";return e.jsxs("div",{className:`space-y-1.5 ${h}`,children:[e.jsxs("div",{className:"flex items-baseline justify-between gap-2",children:[e.jsxs("div",{className:`text-[10px] uppercase tracking-[0.16em] font-semibold ${b?"text-emerald-300/40":C?"text-amber-300/70":"text-emerald-300/70"}`,children:[e.jsx("span",{className:"mr-1",children:g.emoji}),g.title]}),e.jsx("div",{className:"text-[10px] font-mono text-emerald-300/50 tabular-nums",children:b?"soon":`${y}/${u}`})]}),b&&e.jsx("div",{className:"text-[10px] italic text-emerald-200/40 pl-1",children:"Kiosks coming soon…"}),e.jsx("div",{className:"space-y-1.5",children:g.items.map(({id:d,emoji:m,label:A})=>{const w=a.includes(d);return e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("span",{className:`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors flex-shrink-0 ${w?"bg-emerald-500 text-slate-950 shadow-[0_0_8px_rgba(34,197,94,0.6)]":"bg-emerald-950/60 border border-emerald-500/30 text-emerald-300/40"}`,children:w?"✓":"○"}),e.jsxs("span",{className:w?"line-through text-emerald-200/40":"text-emerald-100",children:[e.jsx("span",{className:"mr-1",children:m}),A]})]},d)})})]},g.title)})}),e.jsxs("div",{className:"mt-3 pt-2 border-t border-emerald-500/10 flex justify-between items-baseline",children:[e.jsx("span",{className:"text-[11px] text-emerald-200/60 uppercase tracking-wider",children:"Score"}),e.jsx("span",{className:"text-amber-300 font-bold font-mono tabular-nums",children:r})]})]}),e.jsx($o,{docs:l,income:t,deductions:o,withheld:s,tax:c})]}),e.jsx(Wo,{}),e.jsx(Yo,{}),e.jsx(Fo,{}),e.jsx(Oo,{}),e.jsxs("div",{className:"fixed bottom-4 left-4 bg-slate-950/80 text-white text-xs rounded-xl px-3.5 py-3 border border-emerald-500/20 backdrop-blur-md shadow-[0_0_24px_-12px_rgba(34,197,94,0.5)]",children:[e.jsx("div",{className:"font-bold text-amber-300/90 mb-1.5 uppercase tracking-[0.18em] text-[10px]",children:"Controls"}),e.jsxs("div",{className:"flex items-center gap-2 text-emerald-100",children:[e.jsx("kbd",{className:"px-1.5 py-0.5 rounded bg-emerald-900/50 border border-emerald-500/30 font-mono text-[10px]",children:"WASD"}),e.jsx("span",{className:"text-emerald-200/60",children:"Move"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-emerald-100 mt-1",children:[e.jsx("kbd",{className:"px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 font-mono text-[10px] text-amber-300",children:"E"}),e.jsx("span",{className:"text-emerald-200/60",children:"Enter building"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-emerald-100 mt-1",children:[e.jsx("kbd",{className:"px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 font-mono text-[10px] text-cyan-300",children:"C"}),e.jsx("span",{className:"text-emerald-200/60",children:"Camera view"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-emerald-100 mt-1",children:[e.jsx("kbd",{className:"px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-400/40 font-mono text-[10px] text-rose-300",children:"SPACE"}),e.jsx("span",{className:"text-emerald-200/60",children:"Ride BotMobile 🚗"})]}),e.jsx(zo,{})]}),e.jsx(Vo,{})]})}function $o({docs:t,income:o,deductions:s,withheld:a,tax:r}){const l=Math.max(0,o+s),c=o>0?Math.round((o-s)/o*100):0;return e.jsxs("div",{className:"bg-slate-950/85 text-white rounded-2xl p-4 min-w-[230px] max-w-[260px] border border-amber-500/20 backdrop-blur-md shadow-[0_0_30px_-10px_rgba(251,191,36,0.4)]",children:[e.jsx(We,{children:"🎓 Learning Progress"}),e.jsxs("div",{className:"space-y-1 text-[12px]",children:[e.jsx(ue,{line:"📊",label:"Financial Literacy",value:Math.min(100,t.length*5)}),e.jsx(ue,{line:"💰",label:"Net Worth",value:l}),e.jsx(ue,{line:"📈",label:"Savings Rate",value:c}),e.jsx("div",{className:"border-t border-amber-500/15 pt-1",children:e.jsx(ue,{line:"🎯",label:"Lessons Completed",value:t.length,bold:!0})}),e.jsx(ue,{line:"🏦",label:"Income Sources",value:Math.floor(o/1e4)+1}),e.jsxs("div",{className:"flex items-baseline justify-between gap-2",children:[e.jsx("span",{className:"text-emerald-200/45 font-mono text-[10px] w-7 shrink-0",children:"🛡️"}),e.jsx("span",{className:"text-emerald-200/70 flex-1 truncate",children:"Insurance Coverage"}),e.jsx("span",{className:"font-mono tabular-nums text-emerald-100",children:a>0?"Active":"None"})]})]}),e.jsxs("div",{className:"mt-3 pt-2 border-t border-amber-500/15",children:[e.jsxs("div",{className:"text-[10px] uppercase tracking-[0.18em] text-amber-300/80 font-bold mb-1.5",children:["🎒 Knowledge Backpack (",t.length,")"]}),t.length===0?e.jsx("div",{className:"text-[11px] text-emerald-200/40 italic",children:"Visit buildings to collect financial lessons…"}):e.jsx("div",{className:"flex flex-wrap gap-1.5",children:t.map(n=>e.jsxs("div",{title:`${n.code} — ${n.label}`,className:"px-2 py-1 rounded-md bg-amber-900/20 border border-amber-500/30 text-[10px] font-mono text-amber-200 flex items-center gap-1",children:[e.jsx("span",{children:n.icon}),e.jsx("span",{children:n.code})]},n.id))})]})]})}function ue({line:t,label:o,value:s,bold:a=!1,highlight:r}){const l=r==="good"?"text-emerald-400":r==="bad"?"text-rose-400":s<0?"text-emerald-200/60":"text-emerald-100",c=s<0?"-":"";return e.jsxs("div",{className:"flex items-baseline justify-between gap-2",children:[e.jsx("span",{className:"text-emerald-200/45 font-mono text-[10px] w-7 shrink-0",children:t}),e.jsx("span",{className:"text-emerald-200/70 flex-1 truncate",children:o}),e.jsxs("span",{className:`font-mono tabular-nums ${l} ${a?"font-bold":""}`,children:[c,"$",Math.abs(s).toLocaleString()]})]})}function Yo(){const t=S(r=>r.weather),o=S(r=>r.cycleWeather),s=t==="rain"?"🌧️":t==="snow"?"❄️":t==="fog"?"🌫️":"☀️",a=t==="rain"?"Rain":t==="snow"?"Snow":t==="fog"?"Fog":"Clear";return e.jsxs("button",{type:"button",onClick:o,className:"fixed top-16 right-4 z-20 pointer-events-auto bg-slate-950/80 text-white text-xs rounded-xl px-3 py-2 border border-emerald-500/20 backdrop-blur-md shadow-[0_0_24px_-12px_rgba(34,197,94,0.5)] hover:bg-slate-900/90 transition-colors flex items-center gap-1.5",title:`Weather: ${a} — click to cycle`,children:[e.jsx("span",{children:s}),e.jsx("span",{className:"text-emerald-200/70 hidden sm:inline",children:a})]})}function Wo(){const[t,o]=i.useState(()=>H.isMuted());return i.useEffect(()=>{H.setMuted(t),Dt.setMuted(t)},[t]),e.jsx("button",{type:"button",onClick:()=>o(s=>!s),className:"fixed top-4 right-4 z-20 pointer-events-auto bg-slate-950/80 text-white text-xs rounded-xl px-3 py-2 border border-emerald-500/20 backdrop-blur-md shadow-[0_0_24px_-12px_rgba(34,197,94,0.5)] hover:bg-slate-900/90 transition-colors",title:t?"Unmute sound & music":"Mute sound & music",children:t?"🔇":"🔊🎵"})}const _o=[{label:"Chase",icon:"🎯"},{label:"Cinematic",icon:"🎬"},{label:"Aerial",icon:"🛰️"},{label:"Side-Iso",icon:"📐"},{label:"Orbit",icon:"🔄"}];function zo(){return S(o=>o.cameraMode)!==4?null:e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex items-center gap-2 text-emerald-100 mt-1",children:[e.jsx("kbd",{className:"px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-400/40 font-mono text-[10px] text-purple-200",children:"DRAG"}),e.jsx("span",{className:"text-emerald-200/60",children:"Look around 360°"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-emerald-100 mt-1",children:[e.jsx("kbd",{className:"px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-400/40 font-mono text-[10px] text-purple-200",children:"SCROLL"}),e.jsx("span",{className:"text-emerald-200/60",children:"Zoom in / out"})]})]})}function Vo(){const t=S(s=>s.cameraMode),o=S(s=>s.setCameraMode);return e.jsxs("div",{className:"fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/80 text-white text-xs rounded-xl px-3 py-2 border border-cyan-500/25 backdrop-blur-md shadow-[0_0_24px_-12px_rgba(34,211,238,0.5)] flex items-center gap-2",children:[e.jsx("span",{className:"font-bold text-cyan-300/90 uppercase tracking-[0.18em] text-[10px] mr-1",children:"View"}),_o.map((s,a)=>{const r=t===a;return e.jsxs("button",{type:"button",onClick:()=>o(a),className:"px-2 py-1 rounded font-mono text-[10px] border transition-colors "+(r?"bg-cyan-500/30 border-cyan-400/60 text-cyan-100 shadow-[0_0_12px_-2px_rgba(34,211,238,0.7)]":"bg-slate-900/60 border-slate-700/60 text-emerald-200/70 hover:bg-slate-800/80 hover:text-cyan-200"),children:[e.jsx("span",{className:"mr-1",children:s.icon}),s.label,e.jsx("span",{className:"ml-1.5 opacity-60 "+(r?"text-cyan-200":""),children:a+1})]},s.label)})]})}const nt={workcorp:{id:"w2-workcorp",code:"W-2",label:"Wages from WorkCorp",icon:"💼",line:"1a"},taxmart:{id:"rcpt-taxmart",code:"Receipts",label:"Itemized deductions",icon:"🧾",line:"12"},firstbank:{id:"pub17",code:"Pub. 17",label:"How taxes work",icon:"📖",line:"—"},botunorth:{id:"1098e",code:"1098-E",label:"Student loan interest",icon:"🎓",line:"21"},botusouth:{id:"1098t",code:"1098-T",label:"Tuition statement",icon:"🎓",line:"Sch 3"},bottrain:{id:"commuter",code:"Commuter",label:"Transit benefit summary",icon:"🚆",line:"—"},botplane:{id:"trav-log",code:"Travel log",label:"Business trip ledger",icon:"✈️",line:"Sch C"},botstadium:{id:"w2g",code:"W-2G",label:"Gambling winnings",icon:"🎰",line:"8b"},botmarket:{id:"1099k",code:"1099-K",label:"Marketplace sales",icon:"🛍️",line:"Sch C"},botbeach:{id:"homeoffice",code:"8829",label:"Home office worksheet",icon:"🏖️",line:"Sch C"},botshops:{id:"schc",code:"Sch C",label:"Profit or loss from business",icon:"🏪",line:"3"},botfarm:{id:"schf",code:"Sch F",label:"Farm profit & loss",icon:"🚜",line:"6"},moneybottowers:{id:"k1",code:"K-1",label:"Pass-through income",icon:"🏢",line:"5"},botdealer:{id:"ev-cert",code:"8936",label:"Clean vehicle credit",icon:"🚗",line:"20"},bothospital:{id:"1099sa",code:"1099-SA",label:"HSA distributions",icon:"🏥",line:"Sch 1"},botretirement:{id:"5498",code:"5498",label:"IRA contributions",icon:"🏛️",line:"20"},botcrypto:{id:"1099b",code:"1099-B",label:"Crypto cap gains",icon:"₿",line:"Sch D"},botcharity:{id:"donation",code:"Donation",label:"Charity receipts",icon:"❤️",line:"11"},bothaus:{id:"1098",code:"1098",label:"Mortgage interest statement",icon:"🏠",line:"Sch A"},botbroker:{id:"1099div",code:"1099-DIV/B",label:"Dividends & cap gains",icon:"📈",line:"Sch D"},botkids:{id:"ctc",code:"CTC",label:"Child Tax Credit worksheet",icon:"🧒",line:"19"},botgigs:{id:"1099nec",code:"1099-NEC",label:"Self-employment income",icon:"🛵",line:"Sch C"},botcityhall:{id:"state-return",code:"State",label:"State & local return",icon:"🏛️",line:"Sch CR"},littlebots:{id:"2441",code:"2441",label:"Dependent care receipts",icon:"🧸",line:"Sch 3"},moneybotgaminghq:{id:"streamer-1099",code:"1099-MISC",label:"Streaming & creator income",icon:"🎮",line:"Sch C"},bothistory:{id:"tech-pass",code:"TECH",label:"Bot History Museum pass",icon:"🤖",line:"—"},eduhistory:{id:"edu-pass",code:"EDU",label:"Education History Museum pass",icon:"📚",line:"—"},finhistory:{id:"fin-pass",code:"FIN",label:"Finance History Museum pass",icon:"💰",line:"—"},botrocket:{id:"launch-pass",code:"🚀",label:"BotRocket launch ticket",icon:"🚀",line:"—"},botsoccer:{id:"jock-tax",code:"Jock Tax",label:"Multi-state athlete return",icon:"⚽",line:"Sch CR"},botbasketball:{id:"1099nil",code:"1099-NEC",label:"NIL endorsement income",icon:"🏀",line:"Sch C"},botgallery:{id:"art-8283",code:"8283",label:"Noncash charitable contributions",icon:"🎨",line:"11"},botfashion:{id:"cogs",code:"COGS",label:"Inventory & cost of goods sold",icon:"👗",line:"Sch C"},botpolice:{id:"salt-cap",code:"SALT",label:"State & local tax cap worksheet",icon:"🚓",line:"Sch A"},botfire:{id:"casualty",code:"4684",label:"Casualty & disaster loss",icon:"🚒",line:"Sch A"},irs:{id:"1040",code:"1040",label:"Filed federal return",icon:"📋",line:"—"}};function Ko(){const{dialog:t,closeDialog:o,earnIncome:s,makePurchase:a,visitBuilding:r,fileTaxes:l,collectDocument:c,purchases:n,income:p,teleport:f}=S(),x=i.useRef(null);if(i.useEffect(()=>{t&&t.buildingId!==x.current?(x.current=t.buildingId,H.open()):t||(x.current=null)},[t]),!t)return null;const g=d=>n.some(m=>m.id===d),E=d=>{r(d);const m=nt[d];m&&(c(m),H.doc())},y={bank:"firstbank",study:"botunorth",studysouth:"botusouth",train:"bottrain",plane:"botplane",stadium:"botstadium",market:"botmarket",beach:"botbeach",shops:"botshops",farm:"botfarm",tower:"moneybottowers",hospital:"bothospital",charity:"botcharity",crypto:"botcrypto",retirement:"botretirement",haus:"bothaus",broker:"botbroker",kids:"botkids",gigs:"botgigs",cityhall:"botcityhall",daycare:"littlebots",gaming:"moneybotgaminghq",techmuseum:"bothistory",edumuseum:"eduhistory",finmuseum:"finhistory",launch:"botrocket",port:"botport",casino:"botcasino",mine:"botmine",zoo:"botzoo",soccer:"botsoccer",basketball:"botbasketball",gallery:"botgallery",fashion:"botfashion",elementary:"botelementary",middle:"botmiddle",high:"bothigh",golf:"botgolf",park:"botpark",police:"botpolice",fire:"botfire"},u=()=>{if(!t.action){H.close(),o();return}if(t.action==="earn"){s(48e3,6200),E("workcorp"),H.coin(),o();return}if(t.action==="file"){const m=nt.irs;m&&c(m),H.fanfare(),l();return}const d=y[t.action];if(d){E(d),o();return}H.close(),o()},b=()=>{H.close(),o()},C=d=>{t.buildingId&&E(t.buildingId),f(d.pos),H.coin(),o()},h=d=>{if(g(d.id))return;a(d),d.deductible?H.coin():H.bad();const m=t.buildingId;m&&!S.getState().visitedBuildings.includes(m)&&E(m)};return e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-[fadeIn_0.15s_ease-out]",children:e.jsxs("div",{className:"bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl shadow-2xl shadow-emerald-900/40 max-w-2xl w-full max-h-[85vh] overflow-hidden border border-emerald-500/20 flex flex-col",children:[e.jsx("div",{className:"px-6 py-4 border-b border-emerald-500/15 bg-gradient-to-r from-emerald-900/30 via-slate-900 to-amber-900/20",children:e.jsx("h2",{className:"text-xl font-bold text-white tracking-tight",children:t.title})}),e.jsxs("div",{className:"p-6 overflow-y-auto",children:[e.jsx("p",{className:"text-emerald-100/80 text-sm whitespace-pre-line leading-relaxed mb-4",children:t.body}),t.travel&&t.travel.length>0&&e.jsxs("div",{className:"space-y-2 mb-4",children:[e.jsx("div",{className:"text-[11px] font-semibold text-sky-300/90 uppercase tracking-[0.18em]",children:"Fast Travel — Click to Depart"}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-2",children:t.travel.map(d=>{const m=d.id===t.buildingId;return e.jsxs("button",{onClick:()=>!m&&C(d),disabled:m,className:`text-left p-3 rounded-xl border transition-all ${m?"border-sky-500/20 bg-sky-900/10 opacity-50 cursor-not-allowed":"border-sky-500/30 bg-sky-900/15 hover:bg-sky-800/35 hover:border-sky-400/60 hover:shadow-[0_0_22px_-6px_rgba(56,189,248,0.7)] cursor-pointer"}`,children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-xl leading-none",children:d.emoji}),e.jsx("span",{className:"font-semibold text-sm text-white",children:d.label})]}),e.jsx("div",{className:"text-[11px] mt-1 text-sky-100/70 leading-snug",children:m?"You are here":d.blurb})]},d.id)})})]}),t.options&&e.jsxs("div",{className:"space-y-2.5 mb-4",children:[e.jsx("div",{className:"text-[11px] font-semibold text-amber-300/90 uppercase tracking-[0.18em]",children:"Available Items — Click to purchase & learn"}),t.options.map(d=>{const m=g(d.id);return e.jsxs("button",{onClick:()=>h(d),disabled:m,className:`w-full text-left p-3.5 rounded-xl border transition-all ${m?"border-emerald-500/30 bg-emerald-900/15 opacity-60 cursor-not-allowed":d.deductible?"border-emerald-500/30 bg-emerald-900/10 hover:bg-emerald-900/30 hover:border-emerald-400/50 hover:shadow-[0_0_20px_-8px_rgba(34,197,94,0.6)] cursor-pointer":"border-rose-500/30 bg-rose-900/10 hover:bg-rose-900/25 hover:border-rose-400/50 cursor-pointer"}`,children:[e.jsxs("div",{className:"flex justify-between items-start gap-3",children:[e.jsxs("div",{className:"min-w-0",children:[e.jsx("div",{className:"font-semibold text-sm text-white",children:d.name}),e.jsx("div",{className:"text-xs mt-0.5 text-emerald-100/60 leading-relaxed",children:d.reason})]}),e.jsxs("div",{className:"text-right shrink-0",children:[e.jsx("div",{className:`text-sm font-mono font-bold tabular-nums ${d.deductible?"text-emerald-400":"text-rose-400"}`,children:d.deductible?`Save ~$${Math.round(d.deductibleAmount*.12)}`:"No benefit"}),e.jsx("div",{className:"text-[11px] text-emerald-200/50 mt-0.5",children:d.deductible?`Deductible: $${d.deductibleAmount}`:"Not deductible"}),m&&e.jsx("div",{className:"text-[11px] text-emerald-400 font-bold mt-0.5",children:"✓ Purchased"})]})]}),e.jsx("div",{className:`mt-2 inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${d.deductible?"bg-emerald-500/15 text-emerald-300 border border-emerald-500/30":"bg-slate-700/60 text-emerald-200/70 border border-emerald-500/10"}`,children:d.category})]},d.id)})]})]}),e.jsxs("div",{className:"px-6 py-4 border-t border-emerald-500/15 bg-slate-950/60 flex gap-3 justify-end",children:[e.jsx("button",{onClick:b,className:"px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-emerald-500/10 text-sm font-semibold transition-colors",children:"Close"}),t.action&&e.jsx("button",{onClick:u,disabled:t.action==="earn"&&p>0,className:`px-5 py-2 rounded-lg text-sm font-bold transition-all ${t.action==="earn"&&p>0?"bg-slate-700 cursor-not-allowed opacity-60 text-emerald-200/60":t.action==="file"?"bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_20px_-4px_rgba(251,191,36,0.6)] hover:shadow-[0_0_28px_-4px_rgba(251,191,36,0.8)]":"bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_-4px_rgba(34,197,94,0.6)] hover:shadow-[0_0_28px_-4px_rgba(34,197,94,0.8)]"}`,children:qo(t.action,p)})]})]})})}const Xo={bank:"Got it 📖",study:"Lesson Complete 🎓",studysouth:"Credit Claimed 🎓",train:"All Aboard 🚆",plane:"Cleared for Takeoff ✈️",stadium:"Game Over 🏟️",market:"Cha-ching 🛍️",beach:"Back to Work 🏖️",shops:"Open for Business 🏪",farm:"Yeehaw 🚜",tower:"Back to HQ 🏢",hospital:"Feel Better 🏥",charity:"Thank You ❤️",crypto:"HODL ₿",retirement:"Save & Grow 🏛️",haus:"Home Sweet Home 🏠",broker:"Bull Run 📈",kids:"Claim the Credit 🧒",gigs:"Quarterly Payment 🛵",cityhall:"File State Return 🏛️",daycare:"Drop Off the Kids 🧸",gaming:"Cash Out Stream Earnings 🎮",techmuseum:"Tour Bot History 🤖",edumuseum:"Tour Education History 📚",finmuseum:"Tour Finance History 💰",launch:"Watch the Launch 🚀",port:"Clear Customs ⚓",casino:"Cash Out 🎰",mine:"Haul the Ore ⛏️",zoo:"Visit the Animals 🦒",soccer:"Kickoff! ⚽",basketball:"Tip-off! 🏀",gallery:"View the Exhibit 🎨",fashion:"Runway Walk 👗",police:"Case Closed 🚓",fire:"All Clear 🚒"};function qo(t,o){return t==="earn"?o>0?"Already Collected":"Collect $48,000 Paycheck":t==="file"?"File My Taxes!":Xo[t]??"Got it!"}function Jo(){const t=i.useRef(null);return N(o=>{if(t.current){const s=o.clock.elapsedTime;t.current.rotation.z=s*.02;const a=t.current.material;a.opacity=.25+Math.sin(s*.5)*.1}}),e.jsxs("mesh",{ref:t,position:[0,35,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[20,50,32]}),e.jsx("meshBasicMaterial",{color:"#22c55e",transparent:!0,opacity:.25,side:U,depthWrite:!1})]})}function Qo(){const t=i.useRef(null);return N(o=>{if(t.current){const s=o.clock.elapsedTime;t.current.rotation.z=-s*.015;const a=t.current.material;a.opacity=.15+Math.sin(s*.4+1)*.08}}),e.jsxs("mesh",{ref:t,position:[0,40,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[30,60,32]}),e.jsx("meshBasicMaterial",{color:"#fbbf24",transparent:!0,opacity:.15,side:U,depthWrite:!1})]})}function Zo(){return e.jsxs("group",{position:[-40,30,-50],children:[e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[3,16,12]}),e.jsx("meshBasicMaterial",{color:"#dcfce7"})]}),e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[4,16,12]}),e.jsx("meshBasicMaterial",{color:"#22c55e",transparent:!0,opacity:.25})]}),e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[5.5,16,12]}),e.jsx("meshBasicMaterial",{color:"#22c55e",transparent:!0,opacity:.1})]})]})}function es(){const t=i.useRef(null),o=i.useRef(null),s=i.useMemo(()=>({speed:15+Math.random()*20,angle:Math.random()*Math.PI*2,height:40+Math.random()*30,delay:Math.random()*10}),[]);return N(a=>{const r=(a.clock.elapsedTime+s.delay)%15;if(r>2){t.current&&(t.current.visible=!1),o.current&&(o.current.visible=!1);return}const l=r/2,c=Math.cos(s.angle)*(60-l*120),n=Math.sin(s.angle)*(60-l*120),p=s.height-l*10;t.current&&(t.current.visible=!0,t.current.position.set(c,p,n)),o.current&&(o.current.visible=!0,o.current.position.set(c+Math.cos(s.angle)*3,p,n+Math.sin(s.angle)*3),o.current.lookAt(c,p,n))}),e.jsxs("group",{children:[e.jsxs("mesh",{ref:t,visible:!1,children:[e.jsx("sphereGeometry",{args:[.15,8,8]}),e.jsx("meshBasicMaterial",{color:"#ffffff",toneMapped:!1})]}),e.jsxs("mesh",{ref:o,visible:!1,children:[e.jsx("cylinderGeometry",{args:[.02,.08,6,4]}),e.jsx("meshBasicMaterial",{color:"#86efac",transparent:!0,opacity:.6,toneMapped:!1})]})]})}function ts(){const t=i.useRef(null);return N(o=>{t.current&&(t.current.rotation.z=o.clock.elapsedTime*.005)}),e.jsxs("mesh",{ref:t,position:[0,60,0],rotation:[-Math.PI/2,0,0],children:[e.jsx("planeGeometry",{args:[200,200]}),e.jsx("meshBasicMaterial",{color:"#064e3b",transparent:!0,opacity:.08,side:U,depthWrite:!1})]})}function os(){return e.jsxs("group",{children:[e.jsx(jt,{radius:150,depth:80,count:1800,factor:4,fade:!0,speed:.15}),e.jsx(Zo,{}),e.jsx(Jo,{}),e.jsx(Qo,{}),e.jsx(ts,{}),Array.from({length:2}).map((t,o)=>e.jsx(es,{},`star-${o}`))]})}function X(t,o){return t+Math.random()*(o-t)}function St(t){return X(-t/2,t/2)}function ss(){return X(0,Math.PI*2)}function xa(t){return t[Math.floor(Math.random()*t.length)]}const as=40,ze=28,Ve=-2,lt=900,ct=700,Q=new Ot;function ie(){return St(as*2)}function vt(){return X(Ve,ze)}function rs(){const t=i.useRef(null),{camera:o}=Ne(),s=i.useMemo(()=>Array.from({length:lt},()=>({x:ie(),y:vt(),z:ie(),vy:-X(22,32)})),[]);return N((a,r)=>{if(!t.current)return;const l=o.position.x,c=o.position.z,n=Math.min(r,.05);for(let p=0;p<s.length;p++){const f=s[p];f.y+=f.vy*n,f.y<Ve&&(f.y=ze,f.x=ie(),f.z=ie()),Q.position.set(l+f.x,f.y,c+f.z),Q.scale.set(1,1,1),Q.rotation.set(0,0,0),Q.updateMatrix(),t.current.setMatrixAt(p,Q.matrix)}t.current.instanceMatrix.needsUpdate=!0}),e.jsxs("instancedMesh",{ref:t,args:[void 0,void 0,lt],frustumCulled:!1,children:[e.jsx("cylinderGeometry",{args:[.015,.015,.55,4]}),e.jsx("meshBasicMaterial",{color:"#bae6fd",transparent:!0,opacity:.55,depthWrite:!1})]})}function is(){const t=i.useRef(null),{camera:o}=Ne(),s=i.useMemo(()=>Array.from({length:ct},()=>({x:ie(),y:vt(),z:ie(),vy:-X(1.6,2.8),driftPhase:X(0,Math.PI*2),driftAmp:X(.4,1)})),[]);return N((a,r)=>{if(!t.current)return;const l=o.position.x,c=o.position.z,n=a.clock.elapsedTime,p=Math.min(r,.05);for(let f=0;f<s.length;f++){const x=s[f];x.y+=x.vy*p,x.y<Ve&&(x.y=ze,x.x=ie(),x.z=ie());const g=Math.sin(n*.8+x.driftPhase)*x.driftAmp;Q.position.set(l+x.x+g,x.y,c+x.z+g*.6),Q.scale.set(1,1,1),Q.rotation.set(0,0,0),Q.updateMatrix(),t.current.setMatrixAt(f,Q.matrix)}t.current.instanceMatrix.needsUpdate=!0}),e.jsxs("instancedMesh",{ref:t,args:[void 0,void 0,ct],frustumCulled:!1,children:[e.jsx("sphereGeometry",{args:[.08,6,6]}),e.jsx("meshBasicMaterial",{color:"#ffffff",transparent:!0,opacity:.9,depthWrite:!1})]})}function ns({mode:t}){return e.jsxs("group",{children:[t==="rain"&&e.jsx(rs,{}),t==="snow"&&e.jsx(is,{})]})}function ls(t){switch(t){case"rain":return{color:"#1e293b",near:25,far:110,background:"#020617"};case"snow":return{color:"#cbd5e1",near:20,far:95,background:"#1e293b"};case"fog":return{color:"#475569",near:8,far:55,background:"#334155"};default:return{color:"#052e16",near:55,far:160,background:"#021410"}}}const _e=-fe,cs=fe,Me=cs-_e,ds=[{axis:"x",lane:-.8,dir:1,speed:7,color:"#22d3ee",accent:"#67e8f9",phase:.05},{axis:"x",lane:-.8,dir:1,speed:6,color:"#a78bfa",accent:"#c4b5fd",phase:.55},{axis:"x",lane:.8,dir:-1,speed:7,color:"#fb923c",accent:"#fde68a",phase:.2},{axis:"x",lane:.8,dir:-1,speed:6.5,color:"#22c55e",accent:"#bbf7d0",phase:.75},{axis:"z",lane:-.8,dir:1,speed:6.5,color:"#dc2626",accent:"#fca5a5",phase:.15},{axis:"z",lane:-.8,dir:1,speed:7,color:"#f59e0b",accent:"#fde68a",phase:.65},{axis:"z",lane:.8,dir:-1,speed:6.5,color:"#0ea5e9",accent:"#7dd3fc",phase:.3},{axis:"z",lane:.8,dir:-1,speed:7,color:"#ec4899",accent:"#fbcfe8",phase:.85}];function us(t,o){return t==="x"?o>0?0:Math.PI:o>0?-Math.PI/2:Math.PI/2}function hs({path:t}){const o=i.useRef(null),s=us(t.axis,t.dir);return N(a=>{if(!o.current)return;const r=a.clock.elapsedTime,c=((t.phase*Me+r*t.speed*t.dir-_e)%Me+Me)%Me+_e;t.axis==="x"?o.current.position.set(c,0,t.lane):o.current.position.set(t.lane,0,c)}),e.jsx("group",{ref:o,rotation:[0,s,0],children:e.jsx(yt,{pos:[0,0,0],color:t.color,accent:t.accent})})}function ms(){return e.jsx("group",{children:ds.map((t,o)=>e.jsx(hs,{path:t},`car-${o}`))})}function Ge({position:t,length:o,width:s,axis:a,color:r="#0f1f15",emissive:l="#22c55e"}){const c=a==="z"?[s,o]:[o,s];return e.jsxs("group",{position:t,children:[e.jsxs("mesh",{receiveShadow:!0,rotation:[-Math.PI/2,0,0],children:[e.jsx("planeGeometry",{args:c}),e.jsx("meshStandardMaterial",{color:r,emissive:l,emissiveIntensity:.25,metalness:.4,roughness:.6})]}),a==="z"?e.jsxs(e.Fragment,{children:[e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[-s/2+.06,.003,0],children:[e.jsx("planeGeometry",{args:[.12,o*.98]}),e.jsx("meshStandardMaterial",{color:l,emissive:l,emissiveIntensity:1.2,toneMapped:!1})]}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[s/2-.06,.003,0],children:[e.jsx("planeGeometry",{args:[.12,o*.98]}),e.jsx("meshStandardMaterial",{color:l,emissive:l,emissiveIntensity:1.2,toneMapped:!1})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,.003,-s/2+.06],children:[e.jsx("planeGeometry",{args:[o*.98,.12]}),e.jsx("meshStandardMaterial",{color:l,emissive:l,emissiveIntensity:1.2,toneMapped:!1})]}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,.003,s/2-.06],children:[e.jsx("planeGeometry",{args:[o*.98,.12]}),e.jsx("meshStandardMaterial",{color:l,emissive:l,emissiveIntensity:1.2,toneMapped:!1})]})]}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,.004,0],children:[e.jsx("planeGeometry",{args:a==="z"?[.08,o*.92]:[o*.92,.08]}),e.jsx("meshStandardMaterial",{color:"#fef3c7",emissive:"#fef3c7",emissiveIntensity:.8,toneMapped:!1})]}),s>=2.4&&e.jsx(e.Fragment,{children:Array.from({length:Math.floor(o/6)}).map((n,p)=>{const f=-o/2+3+p*6;return e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:a==="z"?[0,.005,f]:[f,.005,0],children:[e.jsx("planeGeometry",{args:a==="z"?[.06,2]:[2,.06]}),e.jsx("meshStandardMaterial",{color:"#fef3c7",emissive:"#fef3c7",emissiveIntensity:.6,toneMapped:!1})]},`dash-${p}`)})})]})}function ae({position:t,length:o,width:s,axis:a}){const r=a==="z"?[s,o]:[o,s];return e.jsxs("mesh",{receiveShadow:!0,rotation:[-Math.PI/2,0,0],position:t,children:[e.jsx("planeGeometry",{args:r}),e.jsx("meshStandardMaterial",{color:"#0a1a12",emissive:"#22c55e",emissiveIntensity:.08,metalness:.3,roughness:.6})]})}function ps({position:t,axis:o="x"}){return e.jsx("group",{position:t,children:[-1.2,-.6,0,.6,1.2].map(s=>e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:o==="x"?[0,.006,s]:[s,.006,0],children:[e.jsx("planeGeometry",{args:o==="x"?[2.4,.25]:[.25,2.4]}),e.jsx("meshStandardMaterial",{color:"#86efac",emissive:"#86efac",emissiveIntensity:1.5,toneMapped:!1})]},s))})}function fs({position:t}){return e.jsxs("group",{position:t,children:[e.jsxs("mesh",{position:[0,1.5,0],castShadow:!0,children:[e.jsx("cylinderGeometry",{args:[.06,.08,3,6]}),e.jsx("meshStandardMaterial",{color:"#1a2f1f",metalness:.85,roughness:.3})]}),e.jsxs("mesh",{position:[0,3.05,0],children:[e.jsx("sphereGeometry",{args:[.18,12,12]}),e.jsx("meshStandardMaterial",{color:"#86efac",emissive:"#22c55e",emissiveIntensity:2.5,toneMapped:!1})]})]})}function ys({position:t,radius:o=6}){return e.jsxs("group",{position:t,children:[e.jsxs("mesh",{receiveShadow:!0,rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[o-1.2,o+1.2,32]}),e.jsx("meshStandardMaterial",{color:"#0f1f15",emissive:"#22c55e",emissiveIntensity:.25,metalness:.4,roughness:.6})]}),e.jsxs("mesh",{receiveShadow:!0,rotation:[-Math.PI/2,0,0],children:[e.jsx("circleGeometry",{args:[o-1.2,32]}),e.jsx("meshStandardMaterial",{color:"#0a2a15",emissive:"#22c55e",emissiveIntensity:.15})]}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[o-1.3,o-1.1,32]}),e.jsx("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:1.5,toneMapped:!1})]}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[o+1.1,o+1.3,32]}),e.jsx("meshStandardMaterial",{color:"#22c55e",emissive:"#22c55e",emissiveIntensity:1.5,toneMapped:!1})]})]})}const J=Ht,Tt=gt.map(t=>({x:t,...je[Math.abs(t)]})),It=bt.map(t=>({z:t,...je[Math.abs(t)]})),gs=[{position:[72,.015,-7],length:36,width:2.2,axis:"x",color:"#4ade80"},{position:[72,.015,-62],length:36,width:2.2,axis:"x",color:"#4ade80"},{position:[72,.015,-82],length:36,width:2.2,axis:"x",color:"#4ade80"},{position:[90,.015,-44.5],length:75,width:2.2,axis:"z",color:"#4ade80"},{position:[-79.5,.015,-31.5],length:51,width:2.2,axis:"x",color:"#4ade80"},{position:[-85,.015,80.5],length:53,width:2.2,axis:"z",color:"#4ade80"},{position:[66,.015,46],length:17,width:2,axis:"z",color:"#86efac"},{position:[60,.015,37.5],length:12,width:2,axis:"x",color:"#86efac"},{position:[55,.015,67],length:26,width:2.2,axis:"z",color:"#dc2626"},{position:[55,.015,54],length:20,width:2.2,axis:"x",color:"#dc2626"},{position:[134,.015,-104],length:52,width:2.2,axis:"z",color:"#06b6d4"},{position:[127,.015,-120],length:26,width:2.2,axis:"x",color:"#06b6d4"},{position:[75,.015,63],length:18,width:2,axis:"z",color:"#86efac"},{position:[64.5,.015,72],length:21,width:2,axis:"x",color:"#86efac"},{position:[-28,.015,74.5],length:41,width:2,axis:"z",color:"#86efac"},{position:[-41,.015,54],length:26,width:2,axis:"x",color:"#86efac"},{position:[75,.015,-64.5],length:21,width:2,axis:"z",color:"#86efac"},{position:[64.5,.015,-75],length:21,width:2,axis:"x",color:"#86efac"},{position:[52.5,.015,-57],length:6,width:2,axis:"z",color:"#86efac"},{position:[48,.015,-60],length:9,width:2,axis:"x",color:"#86efac"},{position:[-75,.015,-46],length:17,width:2,axis:"z",color:"#86efac"},{position:[-64.5,.015,-37.5],length:21,width:2,axis:"x",color:"#86efac"},{position:[-60,.015,-57.75],length:7.5,width:2,axis:"z",color:"#86efac"},{position:[-57,.015,-54],length:12,width:2,axis:"x",color:"#86efac"},{position:[9,.015,-68.25],length:28.5,width:2,axis:"z",color:"#86efac"},{position:[82.5,.015,-9],length:27,width:2,axis:"x",color:"#86efac"},{position:[-9,.015,68.25],length:28.5,width:2,axis:"z",color:"#86efac"},{position:[-82.5,.015,9],length:27,width:2,axis:"x",color:"#86efac"},{position:[18,.015,47.25],length:13.5,width:2,axis:"z",color:"#86efac"},{position:[13.5,.015,40.5],length:9,width:2,axis:"x",color:"#86efac"},{position:[19.5,.015,-39],length:12,width:2,axis:"z",color:"#86efac"},{position:[-40.5,.015,-65.25],length:21.5,width:2,axis:"z",color:"#86efac"},{position:[40.5,.015,20],length:28,width:2,axis:"z",color:"#86efac"},{position:[12,.015,-13.5],length:6,width:1.8,axis:"z",color:"#4ade80"},{position:[0,.015,-15],length:24,width:1.8,axis:"x",color:"#4ade80"},{position:[0,.015,13.5],length:27,width:1.8,axis:"x",color:"#4ade80"},{position:[-13.5,.015,0],length:27,width:1.8,axis:"z",color:"#4ade80"},{position:[13.5,.015,0],length:27,width:1.8,axis:"z",color:"#4ade80"}],Ke=[];for(const t of Tt)if(!(Math.abs(t.x)>54))for(const o of It){if(Math.abs(o.z)>54||t.x===0&&o.z===0)continue;const s=t.x===0?2.4:t.x>0?-1.8:1.8,a=o.z===0?2.4:o.z>0?-1.8:1.8;Ke.push([t.x+s,0,o.z+a])}const bs=[[72,0,-20],[72,0,-35],[72,0,-50],[80,0,-7],[85,0,-7],[80,0,-62],[85,0,-62],[80,0,-82],[85,0,-82],[-65,0,-31.5],[-80,0,-31.5],[-95,0,-31.5],[-85,0,65],[-85,0,80],[-85,0,95],[55,0,60],[55,0,75],[45,0,54],[65,0,54],[134,0,-110],[134,0,-125],[125,0,-120],[142,0,-120],[75,0,65],[75,0,78],[-28,0,65],[-28,0,80],[-28,0,90]];Ke.push(...bs);const xs=[...[-54,-27,27,54].flatMap(t=>[{pos:[t,0,0],axis:"z"},{pos:[0,0,t],axis:"x"}]),{pos:[90,0,-7],axis:"z"},{pos:[90,0,-62],axis:"z"},{pos:[90,0,-82],axis:"z"},{pos:[55,0,54],axis:"x"},{pos:[134,0,-120],axis:"x"}],Es=[{pos:[0,.01,0],radius:5},{pos:[54,.01,54],radius:4},{pos:[-54,.01,54],radius:4},{pos:[54,.01,-54],radius:4},{pos:[-54,.01,-54],radius:4}];function Ss(){return e.jsxs("group",{children:[Tt.map(t=>e.jsx(Ge,{position:[t.x,.015,0],length:J*2,width:t.width,axis:"z",emissive:t.color},`vr-${t.x}`)),It.map(t=>e.jsx(Ge,{position:[0,.015,t.z],length:J*2,width:t.width,axis:"x",emissive:t.color},`hr-${t.z}`)),gs.map((t,o)=>e.jsx(Ge,{position:t.position,length:t.length,width:t.width,axis:t.axis,emissive:t.color},`conn-${o}`)),e.jsx(ae,{position:[2.4,.02,0],length:J*2,width:1.2,axis:"z"}),e.jsx(ae,{position:[-2.4,.02,0],length:J*2,width:1.2,axis:"z"}),e.jsx(ae,{position:[0,.02,2.4],length:J*2,width:1.2,axis:"x"}),e.jsx(ae,{position:[0,.02,-2.4],length:J*2,width:1.2,axis:"x"}),[-18,18].map(t=>e.jsxs("group",{children:[e.jsx(ae,{position:[t+1.9,.02,0],length:J*2,width:.8,axis:"z"}),e.jsx(ae,{position:[t-1.9,.02,0],length:J*2,width:.8,axis:"z"})]},`vs-${t}`)),[-18,18].map(t=>e.jsxs("group",{children:[e.jsx(ae,{position:[0,.02,t+1.9],length:J*2,width:.8,axis:"x"}),e.jsx(ae,{position:[0,.02,t-1.9],length:J*2,width:.8,axis:"x"})]},`hs-${t}`)),Es.map((t,o)=>e.jsx(ys,{position:t.pos,radius:t.radius},`rb-${o}`)),xs.map((t,o)=>e.jsx(ps,{position:t.pos,axis:t.axis},`cw-${o}`)),Ke.map((t,o)=>e.jsx(fs,{position:t},`sl-${o}`))]})}function Xe(t=new Date){return(t.getHours()+t.getMinutes()/60+t.getSeconds()/3600-6)/24*Math.PI*2}function vs(t){return Math.max(0,Math.sin(Xe(t)))}function Ea(t){return Math.max(0,-Math.sin(Xe(t)))}const W=new q,Ts=new q("#86efac"),Is=new q("#3b82f6"),As=new q("#fef3c7"),ws=new q("#93c5fd"),Rs=new q("#4ade80"),Cs=new q("#334155"),Ms=new q("#16a34a"),ks=new q("#1e293b"),dt=new q("#fde047"),He=new q("#fb923c");function js(){const t=i.useRef(null),o=i.useRef(null),s=i.useRef(null),a=i.useRef(null),r=i.useRef(null);return N(()=>{const l=Xe(),c=Math.cos(l)*60,n=Math.sin(l)*60,p=Math.sin(l*.5)*20,f=Math.max(0,Math.sin(l)),x=1-Math.abs(Math.sin(l)),g=Math.max(0,Math.sin(l+.1)),E=x*g;if(o.current){const y=n<0;o.current.position.set(y?-c:c,Math.max(10,Math.abs(n)),y?-p:p),o.current.intensity=f*.85+.3,W.copy(ws).lerp(As,f),E>.1&&W.lerp(He,E*.5),o.current.color.copy(W)}if(t.current&&(t.current.intensity=.4+f*.4,W.copy(Is).lerp(Ts,f),t.current.color.copy(W)),s.current&&(s.current.intensity=.5+f*.5,W.copy(Cs).lerp(Rs,f),s.current.color.copy(W),W.copy(ks).lerp(Ms,f),s.current.groundColor.copy(W)),a.current&&(a.current.position.set(c,n,p),a.current.visible=n>-3,W.copy(dt).lerp(He,E*.8),a.current.material.color.copy(W)),r.current){r.current.position.set(c,n,p),r.current.visible=n>-3;const y=r.current.material;y.opacity=.25+f*.3,W.copy(dt).lerp(He,E*.8),y.color.copy(W)}}),e.jsxs(e.Fragment,{children:[e.jsx("ambientLight",{ref:t,intensity:.45,color:"#86efac"}),e.jsx("directionalLight",{ref:o,position:[15,30,10],intensity:.7,color:"#fef3c7"}),e.jsx("hemisphereLight",{ref:s,args:["#4ade80","#16a34a",.6]}),e.jsxs("mesh",{ref:a,position:[60,30,0],children:[e.jsx("sphereGeometry",{args:[2.6,16,12]}),e.jsx("meshBasicMaterial",{color:"#fde047",toneMapped:!1})]}),e.jsxs("mesh",{ref:r,position:[60,30,0],children:[e.jsx("sphereGeometry",{args:[4.8,16,12]}),e.jsx("meshBasicMaterial",{color:"#fde047",transparent:!0,opacity:.35,toneMapped:!1,depthWrite:!1})]})]})}function Ns({position:t,rotation:o=0}){return e.jsxs("group",{position:t,rotation:[0,o,0],children:[e.jsxs("mesh",{position:[0,.55,0],castShadow:!0,receiveShadow:!0,children:[e.jsx("boxGeometry",{args:[6,.3,2.2]}),e.jsx("meshStandardMaterial",{color:"#a8a29e",roughness:.9})]}),[-2.9,2.9].map(s=>e.jsxs("mesh",{position:[s,.4,0],castShadow:!0,children:[e.jsx("boxGeometry",{args:[.5,1,2.4]}),e.jsx("meshStandardMaterial",{color:"#78716c",roughness:.85})]},s)),[1,-1].map(s=>e.jsxs("mesh",{position:[0,.05,s*1.05],rotation:[Math.PI/2,0,0],children:[e.jsx("torusGeometry",{args:[1.1,.16,8,20,Math.PI]}),e.jsx("meshStandardMaterial",{color:"#78716c",roughness:.8})]},s)),[1,-1].map(s=>e.jsxs("group",{children:[e.jsxs("mesh",{position:[0,1.05,s*1],children:[e.jsx("boxGeometry",{args:[6,.08,.08]}),e.jsx("meshStandardMaterial",{color:"#7c2d12",roughness:.8})]}),[-2.6,-1.3,0,1.3,2.6].map(a=>e.jsxs("mesh",{position:[a,.85,s*1],children:[e.jsx("boxGeometry",{args:[.08,.5,.08]}),e.jsx("meshStandardMaterial",{color:"#7c2d12",roughness:.8})]},a))]},s)),[-2.5,0,2.5].map(s=>e.jsxs("group",{position:[s,1.15,0],children:[e.jsxs("mesh",{children:[e.jsx("cylinderGeometry",{args:[.04,.05,.3,6]}),e.jsx("meshStandardMaterial",{color:"#1f2937",metalness:.7})]}),e.jsxs("mesh",{position:[0,.18,0],children:[e.jsx("sphereGeometry",{args:[.1,8,8]}),e.jsx("meshStandardMaterial",{color:"#fef3c7",emissive:"#fbbf24",emissiveIntensity:2,toneMapped:!1})]})]},s))]})}function re({position:t,scale:o=1,color:s="#57534e"}){return e.jsxs("mesh",{position:t,scale:o,castShadow:!0,children:[e.jsx("dodecahedronGeometry",{args:[.4,1]}),e.jsx("meshStandardMaterial",{color:s,flatShading:!0,roughness:.9})]})}function Ls({width:t,length:o,position:s}){const a=i.useRef(null),r=i.useRef(null),l=i.useMemo(()=>new Pt(t,o,20,20),[t,o]);return N(c=>{const n=c.clock.elapsedTime;if(a.current){const p=a.current.geometry.attributes.position;for(let f=0;f<p.count;f++){const x=p.getX(f),g=p.getY(f),E=Math.sin(x*2+n*1.5)*.03,y=Math.sin(g*3+n*2)*.02,u=Math.sin((x+g)*1.5+n*1.2)*.015;p.setZ(f,E+y+u)}p.needsUpdate=!0,a.current.geometry.computeVertexNormals()}if(r.current){const p=vs();r.current.emissiveIntensity=.15+(1-p)*.15,r.current.roughness=.15+p*.15}}),e.jsx("mesh",{ref:a,position:s,rotation:[-Math.PI/2,0,0],geometry:l,children:e.jsx("meshStandardMaterial",{ref:r,color:"#0ea5e9",transparent:!0,opacity:.82,emissive:"#38bdf8",emissiveIntensity:.15,metalness:.85,roughness:.2,side:U})})}const Os=40,ut=["#16a34a","#22c55e","#15803d"],Ps=[[1.1,54],[4.9,57],[1.1,62],[4.9,65],[1.1,70],[4.9,72]],Bs=[0,.2,-.15,.1,-.05];function Ds(){return Ps.map(([t,o])=>({position:[t,0,o],stems:Bs.map((s,a)=>({dx:s,y:X(.4,.6),height:X(.7,1),color:a%2===0?"#65a30d":"#84cc16"}))}))}function ht({x:t,zStart:o,zEnd:s}){const a=i.useMemo(()=>Array.from({length:Os},(r,l)=>({x:t+St(.6),z:X(o,s),height:X(.15,.35),rotationY:X(0,Math.PI),color:ut[l%ut.length]})),[t,o,s]);return e.jsxs("group",{children:[e.jsxs("mesh",{position:[t,.03,(o+s)/2],rotation:[-Math.PI/2,0,0],receiveShadow:!0,children:[e.jsx("planeGeometry",{args:[1.2,s-o]}),e.jsx("meshStandardMaterial",{color:"#15803d",roughness:.95})]}),a.map((r,l)=>e.jsxs("mesh",{position:[r.x,r.height/2,r.z],rotation:[0,r.rotationY,.1],children:[e.jsx("boxGeometry",{args:[.03,r.height,.03]}),e.jsx("meshStandardMaterial",{color:r.color})]},l))]})}function $e({startPos:t}){const o=i.useRef(null),s=i.useMemo(()=>ss(),[]);return N(a=>{const r=a.clock.elapsedTime+s;o.current&&(o.current.position.x=t[0]+Math.sin(r*.5)*1.2,o.current.position.z=t[2]+Math.cos(r*.3)*2,o.current.position.y=t[1]+Math.sin(r*1.2)*.05,o.current.rotation.y=Math.atan2(Math.cos(r*.5)*1.2,-Math.sin(r*.3)*2))}),e.jsxs("group",{ref:o,position:t,children:[e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[.06,6,6]}),e.jsx("meshStandardMaterial",{color:"#fbbf24",emissive:"#f59e0b",emissiveIntensity:.5})]}),e.jsxs("mesh",{position:[-.08,0,0],children:[e.jsx("coneGeometry",{args:[.04,.08,4]}),e.jsx("meshStandardMaterial",{color:"#fbbf24"})]})]})}function Fs(){const t=i.useRef(null),o=i.useRef(null),s=i.useRef(null),a=i.useMemo(Ds,[]);return N(r=>{const l=r.clock.elapsedTime;t.current&&(t.current.position.x=2.6+Math.sin(l*.4)*.08,t.current.position.z=36+Math.sin(l*.3)*.06,t.current.rotation.z=Math.sin(l*.2)*.1),o.current&&(o.current.position.x=3.4+Math.cos(l*.35)*.08,o.current.position.z=48+Math.cos(l*.25)*.06,o.current.rotation.z=Math.cos(l*.25)*.1),s.current&&(s.current.position.x=5+Math.sin(l*.3)*.1,s.current.position.z=58+Math.sin(l*.4)*.08,s.current.rotation.z=Math.sin(l*.3)*.08)}),e.jsxs("group",{children:[e.jsxs("mesh",{position:[4.5,.01,63],rotation:[-Math.PI/2,0,0],receiveShadow:!0,children:[e.jsx("planeGeometry",{args:[4,22]}),e.jsx("meshStandardMaterial",{color:"#0f172a",roughness:1})]}),e.jsx(Ls,{width:3.5,length:21,position:[4.5,.08,63]}),e.jsxs("mesh",{position:[4.5,.04,63],rotation:[-Math.PI/2,0,0],children:[e.jsx("planeGeometry",{args:[3.2,20]}),e.jsx("meshStandardMaterial",{color:"#0369a1",transparent:!0,opacity:.5,roughness:.1,metalness:.9})]}),e.jsx(ht,{x:1.1,zStart:52,zEnd:74}),e.jsx(ht,{x:4.9,zStart:52,zEnd:74}),e.jsxs("mesh",{position:[1.1,.04,48],rotation:[-Math.PI/2,0,0],receiveShadow:!0,children:[e.jsx("planeGeometry",{args:[1,8]}),e.jsx("meshStandardMaterial",{color:"#166534",roughness:.95})]}),e.jsxs("mesh",{position:[4.9,.04,48],rotation:[-Math.PI/2,0,0],receiveShadow:!0,children:[e.jsx("planeGeometry",{args:[1,8]}),e.jsx("meshStandardMaterial",{color:"#166534",roughness:.95})]}),e.jsx(re,{position:[1.4,.22,53],scale:.9}),e.jsx(re,{position:[1.3,.18,56],scale:.6,color:"#44403c"}),e.jsx(re,{position:[4.8,.22,55],scale:1.1,color:"#44403c"}),e.jsx(re,{position:[1.5,.22,67],scale:.8}),e.jsx(re,{position:[4.7,.22,70],scale:1,color:"#57534e"}),e.jsx(re,{position:[4.6,.18,73],scale:.7,color:"#44403c"}),e.jsx(re,{position:[4.5,.12,76],scale:.6}),e.jsx(re,{position:[1.4,.15,60],scale:.5,color:"#78716c"}),e.jsxs("group",{ref:t,position:[3.9,.09,54],rotation:[-Math.PI/2,0,0],children:[e.jsxs("mesh",{children:[e.jsx("circleGeometry",{args:[.4,12]}),e.jsx("meshStandardMaterial",{color:"#22c55e",side:U})]}),e.jsxs("mesh",{position:[.1,.05,0],children:[e.jsx("sphereGeometry",{args:[.06,6,6]}),e.jsx("meshStandardMaterial",{color:"#f472b6",emissive:"#f472b6",emissiveIntensity:.3})]})]}),e.jsx("group",{ref:o,position:[5.1,.09,66],rotation:[-Math.PI/2,0,0],children:e.jsxs("mesh",{children:[e.jsx("circleGeometry",{args:[.35,10]}),e.jsx("meshStandardMaterial",{color:"#16a34a",side:U})]})}),e.jsxs("group",{ref:s,position:[4.2,.09,58],rotation:[-Math.PI/2,0,0],children:[e.jsxs("mesh",{children:[e.jsx("circleGeometry",{args:[.3,10]}),e.jsx("meshStandardMaterial",{color:"#4ade80",side:U})]}),e.jsxs("mesh",{position:[-.05,.04,0],children:[e.jsx("sphereGeometry",{args:[.05,6,6]}),e.jsx("meshStandardMaterial",{color:"#fbbf24",emissive:"#fbbf24",emissiveIntensity:.3})]})]}),e.jsx($e,{startPos:[4,.04,60]}),e.jsx($e,{startPos:[4.8,.04,56]}),e.jsx($e,{startPos:[3.5,.04,68]}),a.map((r,l)=>e.jsxs("group",{position:r.position,children:[r.stems.map((c,n)=>e.jsxs("mesh",{position:[c.dx,c.y,0],children:[e.jsx("cylinderGeometry",{args:[.02,.025,c.height,4]}),e.jsx("meshStandardMaterial",{color:c.color})]},n)),e.jsxs("mesh",{position:[.05,.85,0],children:[e.jsx("sphereGeometry",{args:[.04,6,6]}),e.jsx("meshStandardMaterial",{color:"#92400e"})]})]},l)),e.jsx(Ns,{position:[4.5,0,60]})]})}const Ye=[{id:"bottrain",label:"BotTrain Station",emoji:"🚆",pos:[21,0,24],blurb:"Downtown commuter rail (city center)."},{id:"botplane",label:"BotPlane International",emoji:"✈️",pos:[-85,0,101],blurb:"Southwest airport (long-haul terminal)."},{id:"botrocket",label:"BotRocket Spaceport",emoji:"🚀",pos:[75,0,-68],blurb:"Northeast launch pad (orbital service)."}],Us={workcorp:({visitedBuildings:t})=>({buildingId:"workcorp",title:"💼 WorkCorp — Payroll Department",body:t.includes("workcorp")?"You already received your paycheck this year! You earned $48,000 gross salary with $6,200 withheld for federal taxes.":`Welcome! Your annual salary is $48,000.

Your employer withholds $6,200 for federal income taxes throughout the year (this is called "withholding"). You'll get a W-2 form showing this.

Fact: Employers withhold taxes each paycheck so you don't owe a huge lump sum in April!`,action:t.includes("workcorp")?void 0:"earn",amount:48e3}),taxmart:()=>({buildingId:"taxmart",title:"🛒 TaxMart — Deduction Shopping",body:"Some purchases can be deducted from your taxable income! Choose wisely — only legitimate work-related or qualifying expenses reduce your taxes.",options:[{id:"laptop",name:"Laptop for Work",cost:1200,deductible:!0,deductibleAmount:1200,reason:"Work-related equipment is deductible as a business expense!",category:"Business"},{id:"charity",name:"Charitable Donation ($500)",cost:500,deductible:!0,deductibleAmount:500,reason:"Donations to qualified charities are tax-deductible!",category:"Charitable"},{id:"student_loan",name:"Student Loan Interest ($800)",cost:800,deductible:!0,deductibleAmount:800,reason:"You can deduct up to $2,500 of student loan interest!",category:"Education"},{id:"vacation",name:"Personal Vacation ($2,000)",cost:2e3,deductible:!1,deductibleAmount:0,reason:"Personal expenses like vacations are NOT deductible. Only business/qualifying expenses count!",category:"Personal"},{id:"groceries",name:"Groceries ($600)",cost:600,deductible:!1,deductibleAmount:0,reason:"Ordinary groceries are NOT deductible — they're a personal expense.",category:"Personal"}]}),firstbank:({income:t,deductions:o})=>({buildingId:"firstbank",title:"🏦 First Bank — Financial Education",body:`Learn about how taxes work!

📖 TAX BRACKETS (2024 Single Filer):
• 10% on income up to $11,600
• 12% on $11,600–$47,150
• 22% on $47,150–$100,525

📖 STANDARD DEDUCTION:
Every filer gets $14,600 deducted automatically. Your additional deductions reduce this further!

📖 EFFECTIVE VS MARGINAL RATE:
Your highest bracket is your "marginal rate" but you only pay that rate on income IN that bracket. Your average tax rate is called the "effective rate".

💡 At your income of $${t.toLocaleString()}, only the income above $11,600 is taxed at 12% — not your whole income!`,action:"bank"}),botusouth:()=>({buildingId:"botusouth",title:"🎓 BotU South Campus — Education Tax Credits & 529s",body:`Welcome to BotU South — the undergrad-and-grad campus where today's lecture is on the tax SIDE of paying for school.

📖 AMERICAN OPPORTUNITY CREDIT (AOTC):
Up to $2,500 PER STUDENT, PER YEAR for the first 4 years of college. 100% of the first $2,000 of qualified expenses + 25% of the next $2,000. Best part: 40% is REFUNDABLE — you get up to $1,000 back even with zero tax owed. Phases out at $80K–$90K single / $160K–$180K joint.

📖 LIFETIME LEARNING CREDIT (LLC):
Up to $2,000 per RETURN (not per student) for any post-secondary education — grad school, professional courses, single class to upskill. 20% of up to $10,000 in expenses. Nonrefundable. No 4-year limit. Phases out at $80K–$90K single / $160K–$180K joint. You can only claim AOTC OR LLC for a given student in a given year, not both.

📖 FORM 1098-T:
The school sends this. Box 1 = qualified tuition + required fees PAID. Box 5 = scholarships/grants RECEIVED. You compute your credit on Form 8863 from these numbers — be careful: scholarships used for tuition reduce the credit base, but scholarships used for room & board are taxable income to the student instead.

📖 529 PLANS:
State-sponsored education savings. Contributions aren't federal-deductible (many states give a deduction), but earnings grow tax-free and withdrawals are tax-free if used for QUALIFIED expenses: tuition, fees, books, required equipment, room & board (if enrolled half-time+), up to $10K/year of K-12 tuition, student loan repayment up to $10K LIFETIME per beneficiary, plus apprenticeships. SECURE 2.0 added a new option: roll unused 529 balances to a Roth IRA for the beneficiary (lifetime cap $35K, 15-year-old-account rule).

📖 SCHOLARSHIPS — TAXABLE OR NOT:
Scholarships used for tuition + required fees + required books = TAX-FREE.
Scholarships used for room, board, travel, optional equipment = TAXABLE as ordinary income on the student's return. Many students miss this and get a surprise notice.

📖 COORDINATION RULES:
You can't double-dip. The same dollar of tuition can't fund a tax-free 529 withdrawal AND an AOTC/LLC credit. Usually it pays to pay $4,000 of tuition out of pocket to max the AOTC, and use 529 funds for the rest.

💡 Lesson: AOTC for undergrads (refundable!), LLC for grad/lifelong learners, 529 for tax-free growth, and Form 1098-T is your starting point. Tuition you pay yourself unlocks credits — tuition a 529 pays does not.`,action:"studysouth"}),botunorth:()=>({buildingId:"botunorth",title:"🎓 BotU North Campus — Student Loans 101",body:`Welcome to MoneyBot U! Today's lecture: STUDENT LOANS — what every grad needs to know.

📖 FEDERAL vs PRIVATE:
Federal loans (Direct Subsidized/Unsubsidized, PLUS) come with fixed rates, flexible repayment plans, and forgiveness options. Private loans usually have variable rates, fewer protections, and no income-based repayment.

📖 SUBSIDIZED vs UNSUBSIDIZED:
On SUBSIDIZED loans, the government pays your interest while you're in school. On UNSUBSIDIZED loans, interest accrues from day one — it can capitalize (get added to principal) after the grace period, growing what you owe.

📖 REPAYMENT PLANS:
• Standard — 10 years, fixed payments
• Income-Driven (SAVE, IBR, PAYE) — caps payments at a % of discretionary income
• Public Service Loan Forgiveness (PSLF) — 120 qualifying payments while working for a qualifying employer wipes the rest

📖 THE TAX ANGLE:
You can deduct up to $2,500 of student loan interest each year — even if you take the standard deduction. That's an "above-the-line" deduction. Sound familiar? You saw it on the shelf at TaxMart! 🛒

💡 Lesson: Borrow federal first, only what you need, and never ignore the interest clock on unsubsidized loans.`,action:"study"}),bottrain:()=>({buildingId:"bottrain",title:"🚆 BotTrain Station — Commute vs Business Travel",body:`All aboard! Today's lesson: not all train rides are tax-equal.

📖 YOUR DAILY COMMUTE — NOT DEDUCTIBLE:
The ride between home and your regular workplace is "commuting" — even if it's expensive, even if it's far. The IRS considers it a personal expense.

📖 BUSINESS TRAVEL — DEDUCTIBLE:
Traveling to a client site, a conference, or a temporary work location (away from your tax home) IS deductible. Train tickets, taxis, mileage — keep the receipts.

📖 PRE-TAX COMMUTER BENEFITS:
Many employers offer a commuter benefits plan: you can use pre-tax dollars (up to $315/month in 2024) for transit passes and parking. It's not a deduction — it just lowers your taxable wages before they even hit your paycheck.

💡 Lesson: Keep a log of business trips. Save the receipts. Your daily commute doesn't count — but that conference trip definitely does.

🎫 Connecting service: pick a destination below to depart on the next train.`,action:"train",travel:Ye}),botstadium:()=>({buildingId:"botstadium",title:"🏟️ BotStadium — Entertainment & Gambling Taxes",body:`Welcome to BotStadium — home of the BotCity Robots! Today's lesson covers two stadium-flavored tax topics.

📖 ENTERTAINMENT EXPENSES (the big TCJA change):
Before 2018, businesses could deduct 50% of entertainment costs — concert tickets, sports box seats, golf outings with clients. The Tax Cuts and Jobs Act killed that. Today, client entertainment is generally NOT deductible at all. Meals are still 50% deductible if there's a clear business purpose.

📖 GAMBLING WINNINGS — TAXABLE INCOME:
That lucky parlay you hit? It's taxable. Casinos and sportsbooks issue Form W-2G when you win $600+ (and the threshold varies by game). You report ALL winnings, even small ones — not just the W-2G amount.

📖 GAMBLING LOSSES — LIMITED DEDUCTION:
You can deduct losses ONLY if you itemize, and only up to the amount of your winnings for the year. So if you won $1,000 and lost $1,500, you can only deduct $1,000. The other $500 is gone.

💡 Lesson: Sports tickets aren't deductible. Gambling winnings are taxable. Keep a log if you gamble seriously.`,action:"stadium"}),botport:()=>({buildingId:"botport",title:"⚓ BotPort Harbor — Tariffs & Customs Duties",body:`Welcome to BotPort! Cargo ships from BotIsland and BotMainland dock here every day, and every container is a tax lesson.

📖 WHAT IS A TARIFF?
A tariff is a tax on imported goods, collected by U.S. Customs (CBP) when the container clears the port. Unlike income tax, it's paid by the IMPORTER — not the foreign exporter — and it's almost always passed on to consumers as higher prices.

📖 HOW TARIFFS ARE CALCULATED:
Every item has a 10-digit HTS code (Harmonized Tariff Schedule) — code determines the duty rate. Rates can be:
• Ad valorem — a % of the declared value (e.g. 5% of $10,000 = $500)
• Specific — a fixed amount per unit (e.g. $0.20 per kilogram)
• Compound — both combined

📖 THE PAPERWORK:
Importers file Form 7501 (Entry Summary) declaring value, country of origin, and HTS classification. Misclassifying to dodge duty is fraud — penalties can be 4× the loss, plus seizure.

📖 OTHER FEES STACK ON TOP:
Merchandise Processing Fee (0.3464% of value, capped), Harbor Maintenance Fee (0.125%), and any antidumping or countervailing duty on goods sold below fair value or subsidized abroad.

📖 WHO ULTIMATELY PAYS?
Economists call this "tariff incidence". Studies of recent U.S. tariffs found ~100% of the cost was passed through to U.S. importers and consumers — not absorbed by foreign producers.

💡 Lesson: Tariffs are taxes on imports paid by the importer, classified by HTS code, and almost always show up in the price you pay at checkout.`,action:"port"}),botcasino:()=>({buildingId:"botcasino",title:"🎰 BotCasino — Gambling Winnings & Losses (W-2G)",body:`Welcome to BotCasino — neon, slot bells, free drinks, and a tax form waiting at the cage. Here's what you need to know before you cash out.

📖 ALL GAMBLING WINNINGS ARE TAXABLE:
Slots, table games, sports bets, lottery, raffles, fantasy leagues, online poker — every dollar of net winnings is ordinary income, reported on Schedule 1. There's no minimum that lets you skip it.

📖 FORM W-2G — WHEN THE CASINO REPORTS:
The casino issues a W-2G (and copies the IRS) when you cross specific thresholds:
• $1,200+ from bingo or slots
• $1,500+ from keno (net)
• $5,000+ from poker tournaments
• $600+ AND 300× the wager from other wagering (e.g. horse racing)
For large wins ($5,000+ in most games), 24% is withheld for federal taxes on the spot.

📖 LOSSES — LIMITED DEDUCTION:
You can deduct losses ONLY if you ITEMIZE on Schedule A, and ONLY up to your winnings for the year. Win $5,000, lose $8,000 → deduct $5,000, the other $3,000 is gone. You can't net them out and report zero — you report all $5,000 of winnings, then take the loss as an itemized deduction.

📖 PROFESSIONAL GAMBLERS:
If gambling is your trade or business (Commissioner v. Groetzinger), winnings still go on Schedule C and you can ALSO deduct ordinary business expenses (travel, subscriptions, data services) — not just losses. Wagering losses remain capped at winnings, so a pro can't generate a net business loss from gambling itself. Note: wagering income is generally NOT subject to self-employment tax, even for pros — a rare upside.

📖 RECORDS — THE IRS EXPECTS A LOG:
Keep a session-by-session diary: date, location, game, amounts won/lost, plus W-2Gs, wagering tickets, bank statements. Without it, deductions can be disallowed.

💡 Lesson: Every winning is taxable, the W-2G triggers automatic reporting + withholding, and losses are only useful if you itemize — and only up to what you won.`,action:"casino"}),botmine:()=>({buildingId:"botmine",title:"⛏️ Underground BotMine — Depletion & Royalties",body:`Welcome to BotMine — copper, lithium, and a stream of royalty checks heading to landowners across BotCity. Mining has its own corner of the tax code, and it's full of strange deductions.

📖 WHAT IS DEPLETION?
Mining (and oil, gas, timber) extracts a NON-RENEWABLE resource. As reserves shrink, the tax code lets you recover that lost value with a "depletion deduction" — similar in spirit to depreciation on equipment, but for the ore body itself.

📖 TWO METHODS — TAKE THE HIGHER ONE EACH YEAR:
• COST DEPLETION (IRC §612): cost basis ÷ estimated total recoverable units × units sold this year. Capped at your remaining basis.
• PERCENTAGE DEPLETION (IRC §613): a fixed % of gross income from the property (e.g. 22% for sulfur/uranium, 15% for gold/silver/copper, 10% for coal, 5% for sand/gravel). NOT capped at basis — you can keep deducting even after recovering your investment.
Most independent miners take whichever is larger each year.

📖 ROYALTIES — TAXABLE TO THE LANDOWNER:
If you own mineral rights and lease them to a miner, the royalty checks are ordinary income, reported on Schedule E. Good news: royalty recipients ALSO qualify for percentage depletion — typically 15% of gross royalties, deducted before tax.

📖 SEVERANCE TAX (STATE LEVEL):
Most mining states (Wyoming, West Virginia, Alaska, Texas) levy their own severance tax when minerals are extracted — usually a % of value at the wellhead/mine mouth. It's deductible on your federal return as a business expense.

📖 AMT TRAP:
Percentage depletion in excess of basis is an Alternative Minimum Tax preference item. Big depletion deductions can pull you into AMT — plan carefully.

💡 Lesson: Mining lets you deduct against the dwindling ore body itself (depletion), royalty owners get a 15% deduction off the top, and state severance taxes pile on at extraction — but are federally deductible.`,action:"mine"}),botzoo:()=>({buildingId:"botzoo",title:"🦒 BotZoo & Park — Charitable Trusts & Conservation Easements",body:`Welcome to BotZoo & Park — funded by a charitable remainder trust, sitting on land protected by a conservation easement. Two of the tax code's most powerful (and most scrutinized) giving tools.

📖 CHARITABLE REMAINDER TRUST (CRT):
You give appreciated assets (stock, land) to an irrevocable trust. The trust:
1. Sells the asset TAX-FREE (the trust is exempt).
2. Pays YOU (or a beneficiary) an annuity or % payout for life or up to 20 years.
3. Whatever's left at the end goes to a qualified charity — like BotZoo.

In return you get an upfront charitable deduction equal to the present value of the future gift to charity, computed using IRS §7520 rates.
Two flavors: CRAT (fixed dollar annuity) and CRUT (fixed % of asset value, recalculated yearly).

📖 CHARITABLE LEAD TRUST (CLT) — THE MIRROR:
Charity gets the income FIRST (for a term of years); your heirs get the remainder. Great for moving appreciation out of a taxable estate.

📖 CONSERVATION EASEMENT (IRC §170(h)):
You own land. You permanently restrict its development (no buildings, no subdivision) and donate that restriction to a qualified land trust. You keep the land — you just can't develop it.
The value of the GIVE-UP (highest-and-best-use value minus restricted value) is a charitable deduction, up to 50% of AGI (100% for qualifying ranchers/farmers), with a 15-year carryforward.

📖 SCRUTINY — THE IRS HATES INFLATED VALUATIONS:
"Syndicated" conservation easements — promoters selling shares of inflated land deductions — are a top IRS enforcement target. Listed transaction; 40% accuracy penalty risk. Use a qualified appraiser, document the conservation purpose, and file Form 8283.

📖 BARGAIN SALE — A HYBRID:
Sell appreciated property to a charity for LESS than fair value. Part sale, part gift. You report gain only on the sale portion; the gift portion is a charitable deduction.

💡 Lesson: CRTs convert appreciation into lifetime income + a charitable deduction; conservation easements monetize NOT developing your land — both are powerful, both are heavily audited, both need real appraisals and real charitable intent.`,action:"zoo"}),botmarket:()=>({buildingId:"botmarket",title:"🛍️ BotMarket — Self-Employment & Sales Tax",body:`Welcome to BotMarket! Selling stuff sounds simple — until tax season. Here's what every market vendor needs to know.

📖 SELF-EMPLOYMENT TAX:
If you sell goods or services for profit, you owe SELF-EMPLOYMENT tax — 15.3% on net earnings (12.4% Social Security + 2.9% Medicare). That's ON TOP of regular income tax. Why? Because there's no employer to split FICA with you; you cover both halves.

📖 SALES TAX vs INCOME TAX:
Sales tax is collected FROM your customers and remitted to your state — it's never your money. Income tax is on YOUR net profit (revenue minus expenses).

📖 1099-K REPORTING:
If you sell through a payment processor (Square, PayPal, Etsy, etc.), they'll issue a 1099-K when your sales cross the federal threshold. As of recent rules, that threshold has been dropping — assume you'll get one if you process more than a few thousand dollars.

📖 BUSINESS EXPENSES:
Inventory, booth fees, mileage to the market, packaging, supplies — all deductible on Schedule C, reducing your taxable profit.

💡 Lesson: Selling for profit means SE tax + income tax. Track expenses religiously — they shrink your tax bill.`,action:"market"}),botbeach:()=>({buildingId:"botbeach",title:"🏖️ BotBeach — Vacation vs Business Travel",body:`Welcome to BotBeach! Sand, sun, and... tax rules. Here's how the IRS treats your getaway.

📖 VACATIONS ARE NOT DEDUCTIBLE:
A pure pleasure trip — even if you brought your laptop and answered a few emails — is a PERSONAL expense. Flights, hotels, meals, all of it: not deductible.

📖 "WORKATION" / MIXED TRIPS:
Mixed business + leisure trips are deductible ONLY for the business portion. If you spent 4 days at a conference and 3 days lounging, you deduct flights only if business days >50%, and lodging/meals only for business days.

📖 REMOTE WORK FROM THE BEACH:
Working remotely from a vacation rental doesn't turn it into a business trip. Your "tax home" is where you regularly work. A change of scenery is personal preference, not a business need.

📖 HOME OFFICE RULES (the real deduction):
If you're self-employed and have a SPECIFIC space used REGULARLY and EXCLUSIVELY for business, you can deduct a portion of rent, utilities, and internet. The space at your beach Airbnb doesn't qualify.

💡 Lesson: Vacations are personal. Real business travel needs a real business purpose. Sand is wonderful, but it isn't a deduction.`,action:"beach"}),botshops:()=>({buildingId:"botshops",title:"🏪 BotShops Plaza — Hobby vs Business",body:`Welcome to BotShops Plaza! Whether you sell coffee, books, games, or pastries, the same question matters: hobby or business?

📖 THE HOBBY vs BUSINESS TEST:
The IRS looks at PROFIT MOTIVE. Rule of thumb: if you've earned a profit in 3 of the last 5 years, you're presumed to be a business. Other factors: do you keep books, market actively, have a separate bank account, and depend on the income?

📖 WHY IT MATTERS:
• BUSINESS: Report on Schedule C. Deduct all ordinary & necessary expenses. Losses can offset other income.
• HOBBY: Report income as "other income" (no Schedule C). After 2017, hobby expenses are NOT deductible at all.

That asymmetry is brutal: a hobby pays full tax on revenue but can't subtract costs.

📖 ORDINARY & NECESSARY EXPENSES:
For a business, you can deduct what's "ordinary" (common in your trade) and "necessary" (helpful for the business). Espresso beans for a coffee shop? Yes. A jet ski "for client meetings"? Probably not.

📖 QUARTERLY ESTIMATED TAXES:
If you expect to owe $1,000+ at year end (federal), you should pay quarterly estimates (April, June, Sept, Jan). Otherwise: underpayment penalties.

💡 Lesson: Treat your side gig like a business — books, separate account, profit motive — or accept the hobby tax hit.`,action:"shops"}),moneybottowers:()=>({buildingId:"moneybottowers",title:"🏢 MoneyBot Towers — Corporate Tax & Entity Choice",body:`Welcome to MoneyBot Towers — global HQ of MoneyBot Inc. The view is great, but the real story is what entity you pick when you start a business. Choose wrong and you'll pay tax twice on the same dollar.

📖 ENTITY CHOICES AT A GLANCE:
• SOLE PROP / SCHEDULE C — No legal separation. Profits hit your 1040. Simple, but unlimited personal liability.
• LLC — Legal liability shield. By default taxed like a sole prop (single member) or partnership (multi-member). Can elect S-Corp or C-Corp treatment.
• S-CORP — Pass-through taxation (no entity-level tax). Profits flow to owners' returns. Owner-employees must pay themselves "reasonable compensation" as W-2 wages.
• C-CORP — Separate taxpayer. Pays a flat 21% federal corporate tax. Then shareholders pay tax AGAIN on dividends.

📖 THE DOUBLE-TAXATION TRAP:
C-Corp earns $100 → pays $21 corporate tax → $79 left. Distributes as dividend → shareholder pays up to 20% qualified dividend tax → another ~$16. Final: ~$63 of the original $100. That's the C-Corp tax cost.

📖 WHY S-CORP IS POPULAR:
An S-Corp owner can split income into (a) reasonable W-2 wages (subject to payroll tax ~15.3%) and (b) distributions (NOT subject to payroll tax). The distribution slice avoids self-employment tax — a real savings vs Schedule C. But "reasonable compensation" is enforced; underpaying yourself invites an IRS reclassification.

📖 QBI DEDUCTION (§199A):
Pass-through owners (sole prop, partnership, S-Corp) can deduct up to 20% of qualified business income — a powerful break that effectively lowers your top rate. Phaseouts apply to "specified service trades" (law, health, consulting, finance) above income thresholds (~$232k single / ~$464k joint in 2024).

📖 STOCK OPTIONS (ISO vs NSO):
• ISO (Incentive Stock Option) — Employees only. No regular tax at exercise, but the spread is an AMT preference item. Long-term capital gain treatment if you hold 2 years from grant + 1 year from exercise.
• NSO (Non-qualified Stock Option) — Spread between strike and FMV at exercise is ORDINARY income (W-2 wages). Subsequent gain after exercise is capital gain.

📖 EXECUTIVE COMP & §83(b):
Get restricted stock instead of options? An §83(b) election lets you pay tax NOW on the (usually tiny) value at grant, instead of later when the stock has appreciated. Risky if the stock craters, but huge upside if it moons.

💡 Lesson: LLC for liability shield, S-Corp election to split wages+distributions, QBI deduction for pass-throughs, watch ISO/AMT, and remember §83(b) timing on restricted stock.`,action:"tower"}),botfarm:()=>({buildingId:"botfarm",title:"🚜 BotFarm — Farming & Schedule F",body:`Welcome to BotFarm! Farming has its own corner of the tax code. Here's what every grower needs to know.

📖 SCHEDULE F (NOT SCHEDULE C):
Farmers report profits and losses on Schedule F, not Schedule C. It covers crops, livestock, dairy, poultry — anything raised for sale. Hobby gardens don't qualify; you need a profit motive.

📖 CASH vs ACCRUAL ACCOUNTING:
Most farms use the cash method — income when you receive it, expenses when you pay. Accrual method matches income to the year it was earned. Cash is simpler and most family farms stick with it.

📖 SECTION 179 + BONUS DEPRECIATION:
New tractor? Combine? Grain bin? You can often deduct a huge chunk (or all) of the cost in year one via Section 179 or bonus depreciation, instead of spreading it over 5-7 years. Powerful, but the deduction can't exceed your farm income (the excess carries forward).

📖 INCOME AVERAGING (SCHEDULE J):
Farming income swings wildly with weather and prices. Schedule J lets a farmer "average" a great year's income over the prior 3 years' brackets — softening the bracket-jump hit when one harvest is huge.

📖 CROP INSURANCE & DISASTER PAYMENTS:
Crop insurance proceeds are TAXABLE income, but a farmer can often defer them one year if the crop would've sold next year. Disaster relief payments work similarly. Document everything.

📖 CONSERVATION RESERVE PROGRAM (CRP):
Payments for taking acreage out of production are taxable. They may or may not be subject to self-employment tax depending on whether you're materially involved.

📖 ESTATE PLANNING (THE FAMILY-FARM ANGLE):
When a farm passes to heirs, the assets get a "stepped-up basis" to fair market value at death — wiping out decades of unrealized gain. Special-use valuation (§2032A) can further reduce estate tax for working farms passed within the family.

💡 Lesson: Schedule F. Section 179 for equipment. Schedule J for swings. Crop insurance is taxable. Estate stepped-up basis is huge for family farms.`,action:"farm"}),botdealer:()=>({buildingId:"botdealer",title:"🚗 BotDealer — Buy a BotMobile",body:`Welcome to BotDealer! Buying a vehicle is a tax-loaded decision. Each BotMobile below carries different tax consequences. Read carefully before you pick one off the lot.

📖 PERSONAL USE:
A daily driver is a personal expense. You pay sales tax at purchase, but the car itself is NOT deductible. Commuting between home and your regular workplace is also NEVER deductible — no matter how fancy the car.

📖 BUSINESS USE:
If the vehicle is used for business (NOT commuting), you have two options:
• Standard mileage rate: 67¢/mile in 2024
• Actual expenses: gas, insurance, maintenance, depreciation, Section 179
Section 179 lets you deduct a large chunk of the cost in year one — for heavier vehicles (>6,000 lbs GVWR) the limit is more generous.

📖 EV TAX CREDIT (the big one):
Qualified new clean vehicles can earn a federal credit up to $7,500. Credits beat deductions: a $7,500 credit reduces your TAX by $7,500. A $7,500 deduction at the 12% bracket only saves you $900. Big difference. Income limits and battery sourcing rules apply.`,options:[{id:"botmobile_commuter",name:"BotMobile Commuter — Daily Driver ($25,000)",cost:25e3,deductible:!1,deductibleAmount:0,reason:"Personal vehicle for commuting. NOT deductible — commuting is always a personal expense. (You still pay sales tax.)",category:"Personal"},{id:"botmobile_pro",name:"BotMobile Pro — 100% Business Use ($35,000)",cost:35e3,deductible:!0,deductibleAmount:12e3,reason:"Used exclusively for business. Eligible for Section 179 — deducting ~$12,000 in year one (depreciation continues in later years).",category:"Business"},{id:"botmobile_ev",name:"BotMobile EV — Qualified Clean Vehicle ($40,000)",cost:4e4,deductible:!0,deductibleAmount:7500,reason:"Qualifies for the federal Clean Vehicle Credit up to $7,500. Note: a real CREDIT reduces tax dollar-for-dollar — way more powerful than the deduction this game models.",category:"EV Credit"}]}),botplane:()=>({buildingId:"botplane",title:"✈️ BotPlane Airport — Business Travel Deductions",body:`Welcome to BotPlane International! Time to learn what you can write off when you fly.

📖 DEDUCTIBLE BUSINESS TRAVEL:
Flights, hotels, baggage fees, rental cars, and ground transport for work trips are deductible (for self-employed and certain business travelers). The trip must have a clear business purpose and be "away from your tax home."

📖 MEALS — THE 50% RULE:
Meals while traveling for business are only 50% deductible. So a $40 dinner on a work trip → $20 write-off.

📖 PER DIEM:
Instead of tracking every receipt, the IRS publishes daily allowance rates by city. If your employer reimburses at or below per diem, the reimbursement is tax-free to you.

📖 MIXING BUSINESS + PLEASURE:
Tacked a vacation onto a work trip? Only the business portion is deductible. You can't write off the extra days you spent at the beach.

💡 Lesson: A business trip is a tax-deductible expense. A vacation is not. The IRS cares about the primary PURPOSE of the trip.

🛫 Now boarding: pick a destination below for an express flight.`,action:"plane",travel:Ye}),bothospital:()=>({buildingId:"bothospital",title:"🏥 BotHospital — HSAs, FSAs & Medical Deductions",body:`Welcome to BotHospital! Health care has its own tax playbook. Three big ideas:

📖 HSA (Health Savings Account) — the triple-tax-advantaged unicorn:
• Contributions: pre-tax (or above-the-line if you contribute yourself)
• Growth: tax-free
• Withdrawals: tax-free if used for qualified medical expenses
You must be enrolled in a High-Deductible Health Plan (HDHP) to contribute. 2024 limits: $4,150 self-only / $8,300 family. After age 65 you can use HSA funds for anything (just pay regular income tax, no penalty).

📖 FSA (Flexible Spending Account):
Also pre-tax dollars for medical (or dependent-care) expenses, but USE IT OR LOSE IT each year. Limited rollover (typically up to $640). Funded via payroll deduction; lowers your W-2 wages directly.

📖 MEDICAL EXPENSE DEDUCTION (Schedule A):
If you itemize, you can deduct unreimbursed medical expenses ABOVE 7.5% of AGI. So at $50k AGI, only costs above $3,750 count. High threshold — most filers can't use it.

💡 Lesson: Max your HSA if you have an HDHP — it's the most tax-efficient account in the code. FSAs are decent but volatile. The Schedule A medical deduction is real but rarely triggers.`,action:"hospital"}),botcharity:()=>({buildingId:"botcharity",title:"❤️ BotCharity Center — Giving & Tax Deductions",body:`Welcome to the BotCharity Center! Generosity has tax consequences — usually good ones.

📖 ONLY ITEMIZERS GET THE DEDUCTION:
Charitable contributions are an ITEMIZED deduction (Schedule A). If you take the standard deduction ($14,600 single), donations don't reduce your tax bill. The COVID-era $300 above-the-line allowance has expired.

📖 QUALIFIED ORGANIZATIONS ONLY:
501(c)(3) public charities count. GoFundMe campaigns for individuals do NOT. Political donations do NOT. Check the IRS Tax Exempt Organization Search.

📖 CASH vs PROPERTY:
• Cash: deduct up to 60% of AGI
• Long-term appreciated stock: deduct FAIR MARKET VALUE up to 30% of AGI — and skip capital gains entirely. This is a power move for high earners.
• Used goods: deduct fair market value, not original price. Need a receipt for anything $250+.

📖 BUNCHING + DAFs:
Since the standard deduction is high, many filers "bunch" 2-3 years of donations into one year to clear the standard-deduction hurdle. A Donor-Advised Fund (DAF) lets you take the deduction now and dole grants out over time.

📖 QCDs (QUALIFIED CHARITABLE DISTRIBUTIONS):
Age 70½+? Donate directly from your IRA (up to $105k/yr). It counts toward your RMD and is excluded from income — even if you don't itemize. Best deal in the tax code for retirees who give.

💡 Lesson: Bunch donations to clear the standard deduction. Give appreciated stock, not cash. Use a DAF or QCD if it fits.`,action:"charity"}),botelementary:()=>({buildingId:"botelementary",title:"✏️ Bot Elementary — Kid Tax Credits 101",body:`Welcome to Bot Elementary! Even tiny bots cost real money — and the tax code helps parents recoup some of it.

📖 CHILD TAX CREDIT (CTC):
Up to $2,000 per qualifying child under 17. A CREDIT (not a deduction) — it cuts your tax bill dollar-for-dollar. Up to $1,700 is refundable, meaning you can get it even if you owe zero tax.

📖 CHILD & DEPENDENT CARE CREDIT:
Paid for daycare or after-school care so you (and your spouse) could work? Claim 20-35% of up to $3,000 of expenses for one child, $6,000 for two+.

📖 529 PLANS — TAX-FREE COLLEGE SAVINGS:
Contributions grow tax-free; withdrawals are tax-free if used for qualified education (now including K-12 tuition up to $10k/yr, apprenticeships, and even student loan payoffs up to $10k lifetime).

💡 Lesson: Claim the CTC for every qualifying child. If you pay for childcare while you work, the Care Credit stacks on top. Start a 529 early — compounding does the heavy lifting.`,action:"elementary"}),botmiddle:()=>({buildingId:"botmiddle",title:"🏫 Bot Middle School — Earned Income & Allowances",body:`Welcome to Bot Middle School! Middle-school bots are old enough for first jobs — and that means first tax lessons.

📖 KIDDIE TAX:
A child's UNEARNED income (interest, dividends) above ~$2,600 is taxed at the PARENT'S rate, not the child's. Earned income (wages from a real job) is taxed at the child's own — usually 0% — rate.

📖 EARNED-INCOME ROTH IRA:
A kid with a real paycheck can fund a Roth IRA up to the lower of $7,000 or their earned income. Five-decade tax-free runway — the single best long-term tax move a parent can make for a child.

📖 STANDARD DEDUCTION FOR DEPENDENTS:
A dependent's standard deduction is the GREATER of $1,300 or earned income + $450, capped at the regular standard deduction. A kid earning $5,000 owes zero federal tax.

💡 Lesson: Pay kids for real work, put the earnings in a Roth IRA, watch the magic of 50+ years of tax-free compounding.`,action:"middle"}),bothigh:()=>({buildingId:"bothigh",title:"🎓 Bot High School — Education Credits & FAFSA",body:`Welcome to Bot High School! Almost college time — the IRS has two big education credits waiting.

📖 AMERICAN OPPORTUNITY CREDIT (AOTC):
Up to $2,500 per student per year for the first 4 years of college. 40% is REFUNDABLE — you can pocket up to $1,000 even with zero tax owed. Income limits: $80k single / $160k joint phase-out.

📖 LIFETIME LEARNING CREDIT (LLC):
Up to $2,000/yr for any post-secondary education (grad school, professional certs, one-off classes). No 4-year limit. Same income phase-out as AOTC. You can only claim ONE of AOTC or LLC per student per year.

📖 STUDENT LOAN INTEREST DEDUCTION:
Up to $2,500/yr of student loan interest is deductible ABOVE the line — you don't have to itemize. Phases out at $80k single / $165k joint.

📖 FAFSA & TAXES:
The Free Application for Federal Student Aid uses your tax return (specifically AGI) to determine aid. Lowering AGI via HSA/401(k) contributions can boost financial aid eligibility.

💡 Lesson: Claim the AOTC for the first 4 years — it's worth more and is partially refundable. Switch to the LLC for grad school or continuing ed.`,action:"high"}),botgolf:()=>({buildingId:"botgolf",title:"⛳ BotGolf Country Club — Business Meals & Entertainment",body:`Welcome to BotGolf! That round with a client — deductible or not? The rules changed in 2018, and most bots get this wrong.

📖 ENTERTAINMENT IS DEAD (for taxes):
The Tax Cuts and Jobs Act killed the 50% deduction for client entertainment. Greens fees, concert tickets, sporting events — ZERO deduction now, even with a clear business purpose. No exceptions.

📖 BUSINESS MEALS — STILL 50%:
Meals with a client, prospect, or employee where business is discussed are still 50% deductible. Keep the receipt, note who you ate with and what you discussed. The food at the 19th hole? 50% if it's a real business meeting.

📖 CLUB DUES — NOT DEDUCTIBLE:
Annual country-club, gym, or social-club dues are NEVER deductible, even if you only use the club for client meetings. Congress closed this loophole decades ago.

📖 ROUND OF GOLF FOR EMPLOYEES:
A company outing for ALL employees (not just executives) is still 100% deductible as a "de minimis fringe benefit" or team-building expense. Selective entertainment for top brass = no deduction.

💡 Lesson: Buy the client lunch (50%), don't buy them the round (0%). Annual dues never deduct. Whole-company outings still pencil out.`,action:"golf"}),botpolice:()=>({buildingId:"botpolice",title:"🚓 BotPolice Precinct — SALT Cap & State Tax",body:`Welcome to BotPolice! Every dollar of state & local tax you pay funds civic services like this precinct — and the federal code lets you (partly) deduct it.

📖 WHAT "SALT" MEANS:
SALT = State And Local Taxes. On Schedule A you can deduct EITHER state/local INCOME tax OR state/local SALES tax (your choice — pick whichever is larger), PLUS state/local PROPERTY tax. Combined.

📖 THE $10,000 CAP (TCJA 2017):
Total SALT deduction is capped at $10,000 per return ($5,000 if married filing separately). Pre-2018, SALT was uncapped — high earners in high-tax states (CA, NY, NJ, IL) lost the biggest deduction in the code. The cap is scheduled to SUNSET after 2025 unless Congress extends it.

📖 ONLY HELPS ITEMIZERS:
Like all Schedule A deductions, SALT only matters if your TOTAL itemized deductions beat the standard deduction ($14,600 single / $29,200 joint in 2024). Most filers don't itemize anymore — the standard deduction is too generous.

📖 PTET — THE STATE WORKAROUND:
Many states (NY, CA, NJ, and 35+ others) created Pass-Through Entity Tax elections so business owners can pay state tax at the ENTITY level, bypassing the personal $10k cap entirely. If you own an S-corp or partnership, ask your CPA about PTET — it's free money.

📖 WHAT COUNTS AS SALT:
• State income tax withholding (W-2 Box 17) ✓
• Estimated state tax payments ✓
• State sales tax (in lieu of income tax) ✓
• Real estate property tax ✓
• Personal property tax (some states' car registration) ✓
• Federal taxes ✗
• Foreign taxes ✗ (separate FTC instead)

💡 Lesson: SALT is capped at $10k. Itemize only if your total Schedule A beats the standard deduction. Business owners — consider PTET to escape the cap.`,action:"police"}),botfire:()=>({buildingId:"botfire",title:"🚒 BotFire Station — Casualty Losses & Disaster Relief",body:`Welcome to BotFire Station! When disaster strikes — fire, flood, hurricane, earthquake — the tax code has a (narrow) safety net.

📖 CASUALTY LOSS DEDUCTION (POST-TCJA):
Before 2018, you could deduct any sudden, unexpected loss (broken pipe, theft, accident). The Tax Cuts and Jobs Act limited this to FEDERALLY DECLARED DISASTERS ONLY through 2025. A house fire from a kitchen accident? Not deductible. A wildfire that hits a Presidentially-declared disaster area? Deductible.

📖 HOW TO CALCULATE THE LOSS:
For each item or property:
1. Take the LESSER of (a) decrease in fair market value, or (b) adjusted basis
2. Subtract any insurance reimbursement
3. Subtract $100 per casualty event
4. Subtract 10% of your AGI (combined floor for all losses that year)
What's left is your deduction on Schedule A (itemizers only).

📖 FILE FORM 4684:
Casualty losses go on Form 4684 → flow to Schedule A line 15. Keep photos, appraisals, repair receipts, and insurance claim documents. The IRS routinely audits big disaster losses.

📖 QUALIFIED DISASTER LOSS — RELAXED RULES:
For certain "qualified" disasters (Congress designates them retroactively — Hurricane Ida, California wildfires, etc.), the $100 floor becomes $500, the 10% AGI floor is WAIVED, and you can claim the loss even if you take the standard deduction.

📖 PRIOR-YEAR ELECTION:
In a federal disaster area, you can choose to claim the loss on the PRIOR year's return (file an amended 1040-X) to get a faster refund. Especially useful if the disaster hits in January — don't wait 16 months.

📖 INSURANCE REIMBURSEMENT — WATCH FOR GAINS:
If your insurance payout EXCEEDS your basis, that's a TAXABLE GAIN (involuntary conversion). You can defer it under §1033 by buying similar replacement property within 2 years (4 years for principal residences in declared disasters).

📖 BUSINESS PROPERTY:
Losses on business or income-producing property are NOT subject to the 10%-AGI floor or $100 deductible. Deductible on Schedule C / Form 4797 in the year of loss, fully.

💡 Lesson: Personal casualty losses only deduct in federally-declared disasters. Save Form 4684 documentation. Big insurance payouts can be deferred under §1033. Business losses follow easier rules.`,action:"fire"}),botpark:()=>({buildingId:"botpark",title:"🏔️ BotNational Park — Conservation Easements & Land Tax",body:`Welcome to BotNational Park! Land and nature get their own corner of the tax code — and a few of the biggest deductions in the book.

📖 CONSERVATION EASEMENTS:
Donate development rights on land to a qualified land trust and you can deduct the appraised value of those rights — often hundreds of thousands of dollars — as a charitable contribution. The IRS heavily scrutinizes "syndicated" easements (a current audit target), so legitimate easements only.

📖 PROPERTY TAX DEDUCTION:
State and local property taxes on land you own are itemizable on Schedule A — but capped by the $10,000 SALT limit (state + local + property taxes combined).

📖 TIMBER & FARMLAND:
Income from selling timber qualifies for long-term CAPITAL GAINS rates if held more than a year. Farmland enrolled in conservation programs may qualify for reduced assessments and special-use valuation at estate-tax time.

📖 NATIONAL PARK FEES:
Not deductible. Recreational visits are personal expenses — no matter how educational. (Sorry.)

💡 Lesson: Real estate has surprisingly generous tax breaks. Conservation easements can be enormous, but only if the easement is real and the appraisal defensible.`,action:"park"}),botcrypto:()=>({buildingId:"botcrypto",title:"₿ BotCrypto Exchange — Capital Gains & 1099-B",body:`Welcome to BotCrypto! Trading digital assets means you're a taxpayer with extra paperwork.

📖 EVERY SALE IS A TAXABLE EVENT:
Selling crypto, swapping one coin for another, spending crypto on goods — all trigger CAPITAL GAINS or LOSSES. The IRS treats crypto as PROPERTY, not currency.

📖 SHORT-TERM vs LONG-TERM:
• Held ≤ 1 year → taxed as ORDINARY INCOME (your regular bracket: 10-37%)
• Held > 1 year → LONG-TERM capital gains: 0%, 15%, or 20% (most filers: 15%)
Holding period matters enormously. A 1-day-shy-of-a-year sale can cost you double.

📖 COST BASIS — TRACK EVERY LOT:
Your gain = sale price − cost basis. If you bought 1 BTC at $30k and sold at $60k, that's a $30k gain. Exchanges issue Form 1099-B (or 1099-DA going forward) but historically the basis info has been spotty. Keep your own records.

📖 WASH SALE RULES (currently STOCKS only):
The 30-day wash sale rule applies to securities. Crypto is NOT a security, so as of now you CAN sell at a loss and immediately re-buy. (Congress has flirted with closing this loophole — watch this space.)

📖 TAX-LOSS HARVESTING:
Sell losers to offset winners. Up to $3,000 of net capital losses can offset ORDINARY income each year; the rest carries forward indefinitely.

📖 STAKING, MINING, AIRDROPS:
All treated as ORDINARY INCOME at fair market value when received. Then a separate capital gain/loss when you eventually sell.

💡 Lesson: Hold > 1 year for the cap-gains rate. Track basis obsessively. Harvest losses. Staking income is ordinary, not capital.`,action:"crypto"}),botretirement:()=>({buildingId:"botretirement",title:"🏛️ BotRetirement Plaza — 401(k), IRA & Roth",body:`Welcome to BotRetirement Plaza! Retirement accounts are the biggest tax break most people will ever use. Pick the wrong one and you leave thousands on the table.

📖 401(k) — EMPLOYER PLAN:
Contribute pre-tax dollars from your paycheck. 2024 limit: $23,000 (under 50) / $30,500 (50+). Lowers your CURRENT taxable income. Many employers match a percentage — that match is FREE MONEY, always grab at least the full match.

📖 TRADITIONAL IRA:
Contribute up to $7,000 ($8,000 if 50+) on your own. May be deductible (income-dependent if you also have a workplace plan). Same idea as 401(k): tax now, pay later.

📖 ROTH 401(k) / ROTH IRA — THE FLIP:
Contribute POST-tax dollars. Growth is tax-free. Qualified withdrawals are tax-free. Best for younger filers who expect higher tax rates in retirement. Roth IRA has income limits ($161k single / $240k joint, 2024) — but the BACKDOOR ROTH (contribute to Traditional, immediately convert) sidesteps the limit.

📖 RMDs (REQUIRED MINIMUM DISTRIBUTIONS):
Traditional accounts force you to withdraw starting at age 73 (rising to 75) — and pay tax on every dollar. Roth IRAs have NO RMD during the owner's life. Roth wins on flexibility.

📖 THE FRAMEWORK (in order):
1. 401(k) up to the employer match
2. Max HSA if you have one ($4,150 / $8,300)
3. Max Roth IRA ($7,000) if eligible
4. Back to 401(k) up to $23,000
5. After-tax 401(k) → mega-backdoor Roth (advanced)

📖 EARLY WITHDRAWAL PENALTY:
Pulling from a Traditional 401(k)/IRA before age 59½ usually costs you a 10% penalty + ordinary income tax. Roth contributions (not earnings) can come out anytime, tax- and penalty-free.

💡 Lesson: Grab the employer match first. Tax-now (Roth) vs tax-later (Traditional) depends on your future bracket — when in doubt, split. HSAs beat both for medical costs.`,action:"retirement"}),bothaus:()=>({buildingId:"bothaus",title:"🏠 BotHaus — Homeownership & Taxes",body:`Welcome to BotHaus! Owning a home is one of the biggest tax events most people ever experience. The code is full of breaks — and traps.

📖 MORTGAGE INTEREST DEDUCTION:
Deductible on Schedule A (itemizers only) for interest on up to $750k of home-acquisition debt (loans after Dec 2017). Older "grandfathered" loans get $1M. Refinances inherit the original cap. HELOCs are only deductible if used to "buy, build, or substantially improve" the home.

📖 PROPERTY TAXES + THE SALT CAP:
State & local taxes (property + state income OR state sales) are deductible — but TOTAL SALT is capped at $10,000 per return ($5k MFS). High-tax states feel this badly. The cap is scheduled to sunset after 2025 unless Congress extends it.

📖 POINTS:
Mortgage points paid at purchase are typically deductible in the year paid. Refi points must be amortized over the life of the loan.

📖 HOME SALE EXCLUSION (§121):
The crown jewel. Live in your primary residence 2 of the last 5 years → you can EXCLUDE up to $250k of capital gain (single) / $500k (married joint) when you sell. No 1099 needed below the threshold. This is one of the most valuable provisions in the code.

📖 FIRST-TIME HOMEBUYER & STATE CREDITS:
Many states offer credits for first-time buyers, mortgage credit certificates (MCCs), or property-tax freezes for seniors. Always check state-level perks; they're easy to miss.

📖 HOME OFFICE:
If you're SELF-EMPLOYED and use part of your home REGULARLY and EXCLUSIVELY for business, you can deduct a percentage (Form 8829). W-2 employees can NOT deduct a home office post-TCJA — even if their employer requires remote work.

📖 RENTAL CONVERSION TRAP:
Converting your home to a rental, then selling, partially disqualifies the §121 exclusion. Plan timing carefully if you ever move out.

💡 Lesson: Mortgage interest + property tax help only if you itemize. The §121 home sale exclusion is the real prize. Watch the SALT cap. Home office is self-employed only.`,action:"haus"}),botbroker:()=>({buildingId:"botbroker",title:"📈 BotBroker — Stocks, Dividends & RSUs",body:`Welcome to BotBroker! Traditional securities follow different rules than crypto. Here's the playbook for stocks, dividends, and equity comp.

📖 CAPITAL GAINS (FAMILIAR BUT DIFFERENT):
Same holding-period rules as crypto: short-term (≤1 year) = ordinary income; long-term (>1 year) = 0%/15%/20%. The key difference: stocks ARE securities, so the WASH SALE rule applies.

📖 WASH SALE RULE:
Sell a stock at a loss, then buy the same (or "substantially identical") stock within 30 days BEFORE or AFTER — the loss is DISALLOWED. The disallowed loss adds to your basis in the replacement shares. Common trap: harvesting losses in December and rebuying in January (still within the 60-day window).

📖 QUALIFIED vs ORDINARY DIVIDENDS:
• Qualified dividends (most US stocks held >60 days): taxed at LONG-TERM cap gains rates (0/15/20%)
• Ordinary dividends (REITs, MLPs, short holding): taxed at your regular bracket
The broker reports both on 1099-DIV. Big difference in tax bill — favor qualified payers in taxable accounts.

📖 RSUs (RESTRICTED STOCK UNITS):
Vest → counted as W-2 wages at the fair market value on vest date. Your employer typically sells some shares to cover withholding (often 22% — usually NOT enough for high earners). Holding the rest creates a NEW capital-gain clock from the vest date. Most RSU horror stories come from people thinking they were taxed only on sale.

📖 ISOs vs NSOs:
• NSOs (non-qualified options): ordinary income on the spread at exercise. Simple.
• ISOs (incentive stock options): no regular tax at exercise — BUT the spread is AMT preference income. Exercising big ISO grants can trigger massive AMT bills. Plan with a tax pro.

📖 ESPP (EMPLOYEE STOCK PURCHASE PLAN):
Usually 15% discount on company stock. Qualified ESPP: hold ≥2 years from grant + ≥1 year from purchase → most of the gain is long-term. Otherwise the discount is taxed as ordinary wages.

📖 NIIT (NET INVESTMENT INCOME TAX):
An extra 3.8% on investment income if your MAGI exceeds $200k single / $250k MFJ. Stealth tax most people don't realize they owe.

💡 Lesson: Hold > 1 year for the cap-gains rate. Watch wash sales. RSU vesting is W-2 income. Qualified dividends beat ordinary. Plan around AMT for ISOs.`,action:"broker"}),botkids:()=>({buildingId:"botkids",title:"🧒 BotKids — Dependents, CTC & 529s",body:`Welcome to BotKids! Children are expensive — but the tax code gives meaningful breaks if you know how to claim them.

📖 CHILD TAX CREDIT (CTC):
$2,000 per qualifying child under 17 (2024). Up to $1,700 is REFUNDABLE (you get it even if your tax is $0). Phases out above $200k single / $400k MFJ. Credits beat deductions — every $1 of CTC saves $1 of tax.

📖 CREDIT FOR OTHER DEPENDENTS:
$500 nonrefundable credit for dependents who don't qualify for CTC — older children, parents you support, etc.

📖 EARNED INCOME TAX CREDIT (EITC):
Up to ~$7,830 (2024, 3+ kids). Refundable. Aimed at low-to-moderate income working families. Hugely underclaimed — ~20% of eligible filers miss it. Phaseouts depend on filing status and # of kids.

📖 CHILD & DEPENDENT CARE CREDIT:
20-35% of qualifying daycare costs, up to $3,000 of expenses for 1 child or $6,000 for 2+. Both parents must have earned income. Nonrefundable.

📖 DEPENDENT CARE FSA:
Via your employer: up to $5,000/year of daycare costs PRE-TAX. Better than the credit for most middle-income families. Use-it-or-lose-it.

📖 529 PLANS (COLLEGE SAVINGS):
• Contributions: NOT federally deductible, but many states give state-tax breaks
• Growth: tax-FREE
• Withdrawals for qualified education expenses: tax-FREE
Non-qualified withdrawals: earnings taxed + 10% penalty. Also: up to $10k/year for K-12 tuition, up to $10k LIFETIME toward student loans.

📖 KIDDIE TAX:
A child's UNEARNED income (dividends, interest, capital gains) above ~$2,600 is taxed at the PARENTS' rate. Don't try to dump appreciated stock on your kid to avoid your bracket — the IRS caught that one decades ago.

📖 ADOPTION CREDIT:
Up to $16,810/child (2024) of qualifying expenses, nonrefundable. Phases out at high income.

💡 Lesson: Credits >> deductions. Claim CTC, use the dependent care FSA if you have one, contribute to a 529 for the tax-free growth. Watch the kiddie tax on UTMA accounts.`,action:"kids"}),botgigs:()=>({buildingId:"botgigs",title:"🛵 BotGigs — 1099 Work & Self-Employment Tax",body:`Welcome to BotGigs! Driving for an app, freelancing, consulting, selling crafts — anything where you're paid as a 1099 contractor instead of a W-2 employee has its own tax universe.

📖 SELF-EMPLOYMENT TAX (THE BIG ONE):
W-2 employees: their employer pays HALF of Social Security + Medicare (FICA, 7.65%). Self-employed people pay BOTH halves = 15.3% on net earnings, on TOP of regular income tax. This is what catches gig workers off guard.
Good news: you can deduct half of SE tax as an above-the-line adjustment.

📖 SCHEDULE C — PROFIT OR LOSS:
Report gross income, then deduct business expenses to get NET profit. SE tax + income tax both apply to net, not gross. Common deductions:
• Mileage (67¢/mile in 2024) — usually beats actual-cost method for app drivers
• Phone, home office (if applicable)
• Supplies, equipment, software
• Health insurance premiums (above-the-line if no other coverage)
• Half of SE tax

📖 QUARTERLY ESTIMATED TAXES:
No employer withholding = you must send the IRS estimated payments 4x/year (Apr 15, Jun 15, Sep 15, Jan 15). Miss them and you owe penalties + interest. Safe harbor: pay 100% of last year's tax (110% if AGI > $150k) and you're penalty-free.

📖 1099-K THRESHOLD CHAOS:
Platforms (Venmo, PayPal, Etsy, eBay) now issue 1099-K for business payments above the federal threshold ($5,000 in 2024, dropping to $600 over time). Personal payments to friends shouldn't trigger — but many platforms over-report. Save your records.

📖 QBI DEDUCTION (§199A):
Up to 20% of qualified business income is DEDUCTIBLE if you're under the income threshold (~$191k single / $383k MFJ in 2024). Above that, "specified service trades" (law, medicine, consulting) get phased out. One of the most valuable post-TCJA provisions.

📖 SOLO 401(k) / SEP-IRA:
Self-employed retirement accounts let you stash WAY more than a regular 401(k):
• Solo 401(k): up to $69k (2024) — employee + employer contributions
• SEP-IRA: 25% of net SE earnings, up to $69k
Massive tax shelter for high-earning freelancers.

📖 LLC vs S-CORP:
At some profit level (~$60-80k+), electing S-Corp status can save thousands in SE tax by splitting income between "reasonable salary" (FICA owed) and "distributions" (no SE tax). Adds complexity — payroll, separate return — so do the math before electing.

💡 Lesson: Set aside ~30% of every gig dollar for taxes. Track mileage and expenses obsessively. Pay quarterly. Open a Solo 401(k) or SEP-IRA. Consider S-Corp once profit is reliably $60k+.`,action:"gigs"}),littlebots:()=>({buildingId:"littlebots",title:"🧸 LittleBots DayCare — Form 2441 Deep Dive",body:`Welcome to LittleBots DayCare! BotKids covered the headline family credits — here we go deep on the ONE tax form daycare-paying parents must file: Form 2441, and the strategic choice between the Credit and the FSA.

📖 THE TWO PARALLEL BENEFITS:
• Child & Dependent Care CREDIT: 20-35% of qualifying expenses (rate slides with AGI). Cap: $3,000 of expenses for 1 child, $6,000 for 2+.
• Dependent Care FSA: up to $5,000/year of PRE-TAX dollars via your employer ($2,500 if married filing separately). Use it or lose it.
You can't double-dip on the same dollars — but you can stack them (FSA $5k + Credit on $1k extra for 2 kids).

📖 FSA vs CREDIT — WHICH WINS?
At most middle-income brackets, the FSA beats the Credit because the FSA dodges BOTH income tax AND the 7.65% FICA. The Credit only dodges income tax. Rough rule:
• AGI under ~$45k: Credit is competitive (35% rate)
• AGI $45k–$125k: FSA usually wins
• AGI > $125k: FSA almost always wins (Credit drops to 20%)
Run the numbers in October when open enrollment opens.

📖 QUALIFYING CHILDREN:
Under age 13 when care was provided. Disabled spouse or dependent of any age also qualifies. Care must enable you (and spouse if married) to WORK or LOOK FOR WORK — both adults must have earned income (or be a full-time student / disabled).

📖 QUALIFYING EXPENSES (✅) vs NOT (❌):
✅ Daycare center, in-home daycare, after-school care
✅ Preschool / nursery school (educational portion of pre-K)
✅ Summer DAY camp (sports camp, art camp, even bot-coding camp)
✅ Nanny / au pair wages (must withhold "nanny tax" if >$2,700/yr)
✅ Before-school care, sick-child backup care
❌ OVERNIGHT camp (this trips up parents every summer)
❌ Kindergarten or higher grades (it's "education", not care)
❌ Tutoring, music lessons (educational, not custodial)
❌ Care provided by your spouse, the child's parent, or YOUR child under 19

📖 THE EIN REQUIREMENT:
Form 2441 Part I requires the provider's NAME, ADDRESS, and EIN (or SSN for individuals). NO EIN = NO CREDIT. Always ask for a W-10 in January. If a provider refuses, you can still claim by showing "due diligence" but it triggers IRS scrutiny.

📖 NANNY TAX (SCHEDULE H):
If you paid a household employee $2,700+ in 2024, YOU are an employer:
• Withhold and pay 7.65% FICA (employer + employee shares)
• Pay FUTA (0.6% on first $7k)
• File Schedule H with your 1040
• Issue W-2 to the nanny by Jan 31
Most families use a payroll service ($50/mo) — penalties for skipping are brutal.

📖 EMPLOYER BACKUP CARE:
Many large employers offer subsidized backup/sick-child care (Bright Horizons, Care.com). The benefit is generally taxable unless run through the Dep Care FSA — check your W-2 box 10.

📖 STATE-LEVEL DEPENDENT CARE CREDITS:
Many states (NY, CA, MN, NE, OR, etc.) offer their own credit on TOP of federal. Some are refundable. Don't leave them on the table.

💡 Lesson: Take the FSA if you have it (especially over $45k AGI). Get the W-10 / EIN every January. Form 2441 — both parents' earned income, provider's tax ID, ages under 13. Day camp ✅, overnight camp ❌.`,action:"daycare"}),moneybotgaminghq:()=>({buildingId:"moneybotgaminghq",title:"🎮 MoneyBot Gaming HQ — The Creator Economy Tax",body:`Welcome to MoneyBot Gaming HQ! Streaming, esports, content creation, and selling in-game items have minted a whole new class of self-employed taxpayer the IRS only recently caught up with. Here's the playbook.

📖 STREAMING & CONTENT INCOME — ALL TAXABLE:
• Twitch / YouTube / Kick ad revenue → 1099-NEC (or 1099-MISC for YouTube royalties via AdSense)
• Subs, Bits, Super Chats, viewer donations → ALL Schedule C income, even "tips"
• Brand sponsorships, affiliate links, brand deals → 1099-NEC
• Patreon / Ko-fi / OnlyFans payouts → 1099-K or 1099-NEC (Schedule C)
If platforms don't issue a 1099, you STILL owe tax. The IRS doesn't care if you got a form.

📖 THE "FREE GEAR" TRAP:
When a sponsor sends you a $2,000 gaming PC or a $400 mechanical keyboard "for review," that's INCOME at fair market value. Report it on Schedule C. You can then DEDUCT it as a business expense — usually a wash, but you must report both sides. Ignoring it = unreported income.

📖 GAMING HARDWARE AS BUSINESS EXPENSE:
Your PC, console, capture card, mic, ring light, green screen, streaming software — deductible as ordinary & necessary business expenses IF used for content creation. Watch for:
• Section 179: expense up to $1.16M (2024) of equipment immediately instead of depreciating
• Listed property rule: if used <50% for business, you must depreciate, not 179
• Mixed use: you must allocate (60% business, 40% personal gaming) — keep a usage log

📖 HOME OFFICE FOR STREAMERS:
The streaming room/setup CAN qualify, but only if "exclusive and regular" use for business. A bedroom that's also where you sleep ❌. A dedicated streaming room ✅. Two methods:
• Simplified: $5/sqft up to 300 sqft = $1,500 max
• Actual: % of rent, utilities, internet — bigger but more paperwork

📖 ESPORTS PRIZE WINNINGS:
• US tournaments → W-2G if backup withholding triggers, else 1099-MISC
• Foreign tournaments → host country usually withholds (e.g. Korea ~22%); claim Foreign Tax Credit (Form 1116)
• Team salary share → 1099-NEC or W-2 depending on contract structure
• State tax: if you win $50k at a tournament in California while living in TX (no income tax), CA still wants its cut as nonresident income

📖 INTERNATIONAL VIEWER REVENUE:
If you stream to a global audience, YouTube/Twitch may collect withholding tax on foreign-sourced income (US tax treaty rates). Make sure your W-9/W-8BEN is current. Without it, default withholding can be 24%+.

📖 HOBBY vs BUSINESS — THE STREAMER TEST:
IRS uses a 9-factor test. Red flags for "hobby" classification:
• You stream 2 hrs/week and made $200 last year
• You never tried to monetize, just enjoy the chat
• No business records, no separate bank account
Hobby income is reported but expenses are NOT deductible (post-TCJA). Treat it like a business if you want write-offs: separate account, simple bookkeeping, clear profit motive.

📖 IN-GAME ITEM / NFT / CRYPTO REWARDS:
Selling CS:GO skins, Fortnite items, NFTs, or earning crypto from "play-to-earn" games → all taxable. Skin/NFT sales = capital gain (Schedule D) if held as investment, or ordinary income (Sch C) if you're a dealer. Play-to-earn crypto = ordinary income at FMV when received, then capital gain/loss when sold.

📖 QUARTERLY ESTIMATED TAXES (AGAIN!):
Creators get hit HARD their first profitable year because no withholding happens. Owe $5k+ at filing and you'll also owe an underpayment penalty. Same safe harbor rules as BotGigs: pay 100% of last year's tax (110% over $150k AGI) quarterly.

📖 SALES TAX ON MERCH:
If you sell merch through Streamlabs, Fourthwall, Spring, etc., they usually handle sales tax collection in nexus states. If you self-fulfill via Shopify, YOU may have economic nexus in any state where you cross thresholds ($100k or 200 txns). Register and remit.

💡 Lesson: Treat streaming as a real business from day one — separate bank account, log every payment, save every receipt. Track hardware business-use %. Pay quarterlies. Free gear = income at FMV. Don't ignore foreign withholding or state tax on prize money.`,action:"gaming"}),bothistory:()=>({buildingId:"bothistory",title:"🤖 Bot History Museum — A History of Technology",body:`Welcome to the Bot History Museum, where every gear that brought BotCity into being is on display. This is a tour through ~2,000 years of tools, machines, and ideas that compound.

📖 ANCIENT MACHINES (200 BCE – 1500 CE):
• The Antikythera Mechanism (~100 BCE) — a Greek bronze geared device that predicted eclipses and tracked the planets. The world's first analog computer, lost in a shipwreck for 2,000 years.
• The abacus (~2400 BCE Sumer → spread worldwide) — base-10 calculation on beads. Still in use today.
• Al-Jazari's water clocks and automata (1206) — programmable cam-driven robots in 13th-century Baghdad.

📖 MECHANICAL CALCULATION (1600s – 1800s):
• Pascaline (1642) — Blaise Pascal's adding machine for his tax-collector father.
• Jacquard Loom (1801) — punch cards weave patterns. The direct ancestor of programmable computing.
• Babbage's Difference Engine (1822) & Analytical Engine (1837) — never finished in his lifetime, but the blueprint for general-purpose computing.
• Ada Lovelace (1843) — wrote the first algorithm intended for a machine. The world's first programmer.

📖 ELECTRONIC ERA (1936 – 1970):
• Alan Turing's "On Computable Numbers" (1936) — defined what computation IS. Then he broke Enigma at Bletchley Park.
• ENIAC (1945) — 30 tons, 17,468 vacuum tubes, room-sized.
• Bell Labs transistor (1947) — Shockley, Bardeen, Brattain. Made everything that followed possible.
• Integrated circuit (1958) — Kilby (TI) & Noyce (Fairchild). Moore's Law arrives in 1965.
• Apollo Guidance Computer (1966) — 64KB of memory got humans to the moon.

📖 PERSONAL COMPUTING (1971 – 1995):
• Intel 4004 (1971) — the first commercial microprocessor.
• Altair 8800 (1975) — kit computer that inspired Gates & Allen to found Microsoft.
• Apple II (1977), IBM PC (1981), Macintosh (1984) — the home-computer revolution.
• ARPANET (1969) → TCP/IP (1983) → World Wide Web (Tim Berners-Lee, 1989, public 1991).
• Linux (1991), Windows 95 — software ate the world.

📖 MOBILE, CLOUD, AI (1995 – TODAY):
• Google (1998), Wi-Fi 802.11b (1999), USB drives, broadband.
• iPhone (2007) — pocket computers everywhere.
• AWS (2006) launches the cloud era. Software becomes a service.
• Deep learning revolution: AlexNet (2012), AlphaGo (2016), GPT-3 (2020), ChatGPT (2022).
• Robotics: Unimate (1961, first industrial robot), Roomba (2002), Boston Dynamics' Atlas (2013), autonomous vehicles, surgical robots.

💡 The arc: from beads → cogs → tubes → transistors → silicon → bits → models. Each generation made the next one cheaper, faster, and more accessible. BotCity is what happens when every bot has all of this in its pocket.`,action:"techmuseum"}),eduhistory:()=>({buildingId:"eduhistory",title:"📚 Education History Museum — A History of Learning",body:`Welcome to the Education History Museum! Every school, university, and learning tool you've ever used descends from a long chain of experiments in how knowledge gets passed down.

📖 ANCIENT LEARNING (3000 BCE – 500 CE):
• Mesopotamian "edubba" (~2500 BCE) — scribe schools that taught cuneiform. The first classrooms.
• Egyptian temple schools — math, astronomy, and writing for priests and scribes.
• Plato's Academy (387 BCE) and Aristotle's Lyceum (335 BCE) — Athens invents higher education.
• Confucian schools (China, 500 BCE+) — birthplace of the world's first standardized exams (later the imperial keju).
• Nalanda University (India, 5th century CE) — first residential university; 10,000+ students from across Asia.

📖 MEDIEVAL UNIVERSITIES (500 – 1500):
• Islamic madrasas — Al-Qarawiyyin (Morocco, 859 CE) is the oldest continuously-operating university.
• Bologna (1088), Oxford (1096), Paris (1150), Cambridge (1209) — the European university template.
• Scholasticism and the Quadrivium (arithmetic, geometry, music, astronomy) + Trivium (grammar, logic, rhetoric) — "the seven liberal arts."

📖 PRINTING & MASS LITERACY (1440 – 1800):
• Gutenberg's movable-type printing press (1440) — knowledge becomes copyable. Bibles, then textbooks, then everything.
• Protestant Reformation (1517) — Luther's translated Bible drives literacy across northern Europe.
• Comenius (1592–1670) — "Father of Modern Education" — argued for universal, free, compulsory schooling for ALL children, including girls.
• Prussian model (1763) — Friedrich the Great makes school compulsory. Becomes the template for state-run education worldwide.

📖 PUBLIC EDUCATION & ACCESS (1800 – 1950):
• Horace Mann (1830s–1850s) — pushes free public "common schools" across America.
• Morrill Land-Grant Acts (1862, 1890) — federal land grants create state universities (Penn State, MIT, Cornell, etc.).
• Compulsory schooling laws roll out state-by-state in the US (Massachusetts 1852, last state Mississippi 1918).
• GI Bill (1944) — pays for WWII veterans' college. 2.2 million go. Single biggest expansion of higher ed in US history.

📖 EQUITY & MODERN STRUGGLES (1950 – TODAY):
• Brown v. Board of Education (1954) — segregated schools ruled unconstitutional.
• ESEA & Title I (1965) — federal funding for low-income schools.
• Pell Grants (1972) — federal need-based aid for college.
• Title IX (1972) — bans sex discrimination in federally-funded schools.
• Americans with Disabilities Act (1990) + IDEA (1990) — special education becomes a federal right.
• Student loan crisis (2010s+) — outstanding US student debt passes $1.7 trillion in 2024.

📖 DIGITAL LEARNING (1990 – TODAY):
• Khan Academy (2008) — free, on-demand math instruction goes viral.
• MOOCs: Coursera & edX (2012) — Stanford/MIT/Harvard courses online for free.
• Duolingo (2011), Anki, Quizlet — spaced-repetition apps.
• ChatGPT (2022) — AI tutors arrive at scale. Every learner can have a personalized teacher.

💡 The pattern: each generation expanded WHO gets to learn (priests → nobles → boys → all children → all adults → everyone with internet) and WHAT they learn. Education compounds faster than any other investment a society can make.`,action:"edumuseum"}),finhistory:()=>({buildingId:"finhistory",title:"💰 Finance History Museum — A History of Money",body:`Welcome to the Finance History Museum! Money is an invented technology, like the wheel — and like the wheel, every version reshaped human civilization. Here's the chronological tour.

📖 PROTO-MONEY (10,000 BCE – 600 BCE):
• Barter & commodity money — grain, cattle, salt (the root word of "salary"), cowrie shells across Africa and Asia.
• Mesopotamian shekel (~3000 BCE) — a fixed weight of barley, then silver. The first standardized currency.
• Lydian electrum coins (~600 BCE, modern Turkey) — King Alyattes' kingdom mints the first true coins, stamped with images to guarantee weight.

📖 ANCIENT EMPIRES (600 BCE – 1300 CE):
• Greek drachma, Roman denarius & aureus — coinage funds armies, taxes, and the spread of empires.
• Chinese paper money (Tang & Song dynasties, ~700–1000 CE) — the world's first fiat currency. Marco Polo brought stories of it back to a disbelieving Europe.
• Knights Templar (1100s–1300s) — operated an international banking network. Deposit gold in London, withdraw in Jerusalem.

📖 BIRTH OF MODERN FINANCE (1300 – 1700):
• Medici Bank (1397, Florence) — invented double-entry bookkeeping at scale, lent to popes and monarchs.
• Dutch East India Company (VOC, 1602) — the world's first publicly traded company. The Amsterdam Stock Exchange opens the same year.
• Bank of Amsterdam (1609) — first modern central bank, providing standardized currency for trade.
• Tulip mania (1637) — the world's first documented speculative bubble. Single tulip bulbs traded for the price of a house.
• Bank of England (1694) — founded to fund war with France; pioneers government bonds and national debt.

📖 WALL STREET & THE GOLD STANDARD (1700 – 1929):
• Buttonwood Agreement (1792) — 24 stockbrokers meet under a tree on Wall Street. Becomes the NYSE.
• 1816 — UK formally adopts the gold standard. Most nations follow by late 1800s.
• Karl Marx publishes "Das Kapital" (1867); Adam Smith's "Wealth of Nations" had come a century earlier (1776).
• US Income Tax (1862, then permanently in 1913 with the 16th Amendment). Federal Reserve created (1913).
• 1929 Crash — Dow falls 89% over 3 years. Great Depression.

📖 NEW DEAL → BRETTON WOODS → FIAT (1933 – 1971):
• Glass-Steagall Act (1933) — separates investment and commercial banking. FDIC created to insure deposits.
• SEC founded (1934) — Joseph Kennedy first chair. Modern stock market regulation begins.
• Bretton Woods (1944) — US dollar pegged to gold, other currencies pegged to dollar. The IMF and World Bank are born.
• "Nixon Shock" (Aug 15, 1971) — Nixon ends dollar's convertibility to gold. All world currencies become pure fiat.

📖 CONSUMER CREDIT & DIGITAL FINANCE (1950 – 2008):
• Diners Club card (1950), BankAmericard/Visa (1958), Mastercard (1966) — consumer credit revolution.
• ATM (Barclays, London, 1967) — banking goes 24/7.
• Black-Scholes (1973) — modern options pricing. Derivatives explode.
• Index funds: Vanguard's 500 Index Fund (1976) — Jack Bogle launches passive investing.
• Internet brokerages: E*Trade (1991), Schwab online (1995) — retail investing democratizes.
• 401(k)s (created in 1978, popularized in the 80s) — shifts retirement from pensions to individuals.

📖 THE CRISIS & CRYPTO ERA (2008 – TODAY):
• 2008 Global Financial Crisis — Lehman Brothers collapses, AIG bailed out, Dodd-Frank (2010) overhauls regulation.
• Bitcoin whitepaper (Oct 31, 2008) — Satoshi Nakamoto. First block mined Jan 3, 2009.
• Ethereum (2015), DeFi summer (2020), NFT boom (2021), crypto winter (2022–2023).
• Mobile-first banking: Venmo (2009), Cash App, Robinhood (2013), Revolut, Wise. Zero-commission trading becomes the norm in 2019.
• CBDCs in development worldwide (China's e-CNY pilot live since 2020).

💡 The arc: from shells → coins → ledgers → paper → plastic → bits → tokens. Each shift made transactions faster, cheaper, and more global — and every shift created winners, losers, and bubbles. Money is just a story that enough people believe.`,action:"finmuseum"}),botrocket:()=>({buildingId:"botrocket",title:"🚀 BotRocket Station — Watch a Launch",body:`Welcome to BotRocket Station, BotCity's commercial spaceport on the far NE edge of the map. A rocket lifts off from the pad every 28 seconds — and yes, even rocketry has tax consequences. Here's the rundown while you wait for the countdown.

📖 A BRIEF HISTORY OF ROCKETRY:
• Chinese fire arrows (~1232 CE) — first recorded military rockets, packed with gunpowder.
• Konstantin Tsiolkovsky (1903) — derived the rocket equation; envisioned multi-stage rockets and space elevators.
• Robert Goddard (1926) — launches the first liquid-fueled rocket from a Massachusetts field.
• Wernher von Braun & the V-2 (1944) — first object to cross the Kármán line (100 km).
• Sputnik (Oct 4, 1957) — Soviets put the first artificial satellite in orbit. Space Race begins.
• Yuri Gagarin (Apr 12, 1961) — first human in space.
• Apollo 11 (Jul 20, 1969) — Armstrong & Aldrin on the Moon. Apollo Guidance Computer: 64KB.
• Space Shuttle program (1981–2011) — first reusable orbital spacecraft.
• ISS (1998) — continuously crewed since 2000.
• SpaceX Falcon 9 (2010) → first orbital booster landing (2015) → Starship (2023+). Reusability slashes cost-to-orbit by 10–100x.
• Modern commercial era: Rocket Lab, Blue Origin, Relativity, ULA, Indian ISRO Chandrayaan-3 lunar south-pole landing (2023), JAXA, China's Tiangong station.

📖 THE ROCKET EQUATION:
Δv = Isp · g₀ · ln(m_initial / m_final). Translation: to gain velocity, you must throw mass out the back, fast. Most of a rocket on the pad (95%+) is propellant. This is why orbital flight stays expensive even with reusability.

📖 SPACE TAX & FINANCE (yes, really):
• Outer Space Treaty (1967) — no nation can claim sovereignty over celestial bodies. Tax jurisdiction in space is still a frontier topic.
• US Commercial Space Launch Competitiveness Act (2015) — gives US citizens property rights to resources extracted from asteroids.
• Rocket companies use R&D Tax Credits (IRC §41) heavily. SpaceX, Blue Origin, Relativity all claim them.
• Section 174 (post-TCJA 2022) — R&D must now be amortized over 5 years (15 for foreign), not expensed immediately. Huge cash-flow hit for capital-intensive aerospace startups.
• Bonus depreciation on launch infrastructure under Section 168 (winds down 2023+).
• Spaceport bonds — Florida's Space Coast and Texas's Boca Chica both used municipal infrastructure bonds to fund pad construction.

📖 INVESTING IN THE SPACE ECONOMY:
• Pure-play public companies are rare: Rocket Lab (RKLB), Intuitive Machines (LUNR), Planet Labs (PL), AST SpaceMobile (ASTS), Iridium (IRDM).
• SpaceX, Blue Origin, Relativity, Stoke — private. Exposure via secondary markets or VC funds.
• ETFs: ARKX, UFO — broad space/satellite/aerospace exposure.
• Defense primes (LMT, NOC, BA) capture most government space spending.

💡 The pattern: each generation has dropped the cost-per-kg-to-orbit by an order of magnitude. Saturn V (1969): ~$5,400/kg in today's dollars. Falcon Heavy: ~$1,500/kg. Starship target: $100/kg. When launch is that cheap, every industry becomes a "space industry."

Now look up — the next launch starts within 28 seconds. 🚀`,action:"launch",travel:Ye}),botcityhall:()=>({buildingId:"botcityhall",title:"🏛️ BotCityHall — State & Local Tax Maze",body:`Welcome to BotCityHall! The federal tax code is only half the story. Every state, county, and city writes its own rules — and they vary WILDLY. Where you live can change your tax bill by tens of thousands of dollars a year.

📖 STATE INCOME TAX — A WILD WEST:
• 9 states have NO income tax: Alaska, Florida, Nevada, New Hampshire (interest/dividends only — phasing out), South Dakota, Tennessee, Texas, Washington, Wyoming
• 9 states have a FLAT rate (everyone pays the same %): AZ, CO, ID, IL, IN, KY, MI, NC, PA, UT
• The rest are progressive, like the federal system. California tops out at 13.3% — the highest in the nation.

📖 RECIPROCITY (CROSS-BORDER WORKERS):
Live in NJ, work in NY? Live in IL, work in WI? Many neighboring states have reciprocity agreements — you pay tax only to your HOME state, not where you work. File the right form (e.g., NJ-165, IL W-5-NR) with your employer or you'll over-withhold all year.

📖 THE CONVENIENCE-OF-EMPLOYER RULE (REMOTE WORK TRAP):
NY, CT, PA, NE, DE, and AR say: if your job is BASED in our state and you work remote from elsewhere, you still owe US tax. Caught millions of pandemic-era remote workers off guard.

📖 LOCAL INCOME TAX:
Most states don't have it. The big exceptions:
• Philadelphia: 3.75% wage tax for residents, 3.44% for non-residents
• NYC: up to 3.876% on top of NY state
• Detroit, Cleveland, Pittsburgh, Kansas City, and 17 OH cities
• Ohio is the worst — most cities tax non-resident workers (RITA / CCA collectors)

📖 STATE SALES TAX:
• 5 states with NO sales tax: Alaska, Delaware, Montana, New Hampshire, Oregon
• Highest combined: Tennessee (9.55%), Louisiana (9.55%), Arkansas (9.44%)
• Most states exempt groceries; some don't (Hawaii, Idaho, Kansas, Mississippi, SD)

📖 OCCUPATIONAL / PRIVILEGE TAXES:
• Denver "Occupational Privilege Tax": $5.75/month if you earn $500+
• PA Local Services Tax: $52/year in many municipalities
• Newark Payroll Tax, San Francisco Gross Receipts Tax, etc.

📖 STATE-LEVEL CREDITS YOU MIGHT MISS:
• Renter's credits (CA, MD, NJ, NY, etc.) — even if you don't own
• State EITC (~30 states piggyback on federal EITC)
• State 529 deductions (NY: up to $10k MFJ; PA: $17k single)
• Senior property-tax freeze programs
• Solar/EV state credits stacked on top of federal

📖 MOVING STATES MID-YEAR (PART-YEAR RESIDENT):
You file two state returns and allocate income by domicile period. Tricky for capital gains, RSU vests, and bonuses paid after the move.

📖 ESTABLISHING DOMICILE:
Moving to a no-tax state isn't about a mailing address. States like NY and CA aggressively audit "snowbird" moves: they look at days present (the 183-day rule), where your driver's license / voter registration / doctors are, where your "near and dear" possessions live, and where your business interests sit.

💡 Lesson: Where you live is a tax decision. Check reciprocity if you cross state lines. Local wage taxes ambush new residents of Philly / NYC / Ohio. Hunt your state's credits — most go unclaimed.`,action:"cityhall"}),botsoccer:()=>({buildingId:"botsoccer",title:"⚽ BotSoccer Stadium — Player Salaries & Endorsements",body:`Welcome to BotSoccer Stadium — home of the BotCity United! Pro athletes face some of the most complicated tax situations on the planet. Here's why.

📖 W-2 SALARY:
A player's contracted salary is W-2 wages, just like any other employee. Withholding, FICA, payroll tax — all standard. The wrinkle: salaries are massive, so they hit the top federal bracket (37%) plus state income tax.

📖 THE "JOCK TAX":
Most states tax non-resident athletes on the income they earn WHILE PLAYING IN THAT STATE. A player on a 162-game baseball schedule (or 17-game NFL schedule) might file in 15+ state returns a year. Cities like Pittsburgh, Cleveland, and Philadelphia pile on local taxes too.

📖 ENDORSEMENT INCOME — SCHEDULE C:
Endorsement deals (cleats, jerseys, energy drinks) are NOT W-2 income — they're self-employment income on Schedule C. The player owes both halves of FICA (15.3%) on top of regular income tax, but can also deduct agent fees, training costs, and travel related to endorsements.

📖 SIGNING BONUSES:
Bonuses paid upfront are taxed in the year received. Smart contracts spread bonuses across multiple years (or use deferred comp) to smooth out the tax hit.

📖 STATE SHOPPING (where you live matters):
A player who lives in FL, TX, TN, NV, or WA pays NO state income tax on their home games and off-season earnings. A CA-based player loses 13.3% off the top. Over a 10-year career, that's tens of millions of dollars.

💡 Lesson: W-2 + Schedule C + jock tax + state shopping. Pro athletes need accountants more than agents.`,action:"soccer"}),botbasketball:()=>({buildingId:"botbasketball",title:"🏀 BotHoops Arena — Sponsorship & NIL Deals",body:`Welcome to BotHoops Arena! Basketball has been the testing ground for one of the biggest tax stories of the last decade: NIL (Name, Image, Likeness).

📖 NIL — COLLEGE ATHLETES NOW HAVE INCOME:
Since July 2021, NCAA athletes can earn money from their name, image, and likeness — endorsements, autographs, social media, camps. That income is FULLY TAXABLE. Most NIL deals are 1099 self-employment income reported on Schedule C — the athlete owes income tax AND 15.3% self-employment tax.

📖 SCHOLARSHIPS — STILL TAX-FREE (mostly):
A scholarship covering tuition, required fees, and books is excluded from income. Room & board portions, and stipends not tied to required expenses, ARE taxable. NIL money doesn't change that — but pushes many student-athletes into the income-tax world for the first time.

📖 PRO BASKETBALL — SAME JOCK-TAX TRAP AS SOCCER:
NBA players file in every state they play a game. A 41-game road schedule means filing in 20+ states. Some teams have CPAs on staff just to manage player returns.

📖 LIKENESS LICENSING (VIDEO GAMES, MERCH):
Licensing your name and likeness to a video game or apparel company is royalty income, typically reported on Schedule E. Royalties bypass self-employment tax — a tax advantage over straight endorsement deals.

📖 LOCAL TAX CREDITS FOR ARENAS:
Many arenas are partly funded by municipal bonds. Bond interest is FEDERALLY TAX-EXEMPT — and often state-tax-exempt for in-state residents. That's how cities float billion-dollar arenas without hitting taxpayers as hard as a normal loan would.

💡 Lesson: NIL turned every college star into a 1099 contractor. Royalties (Schedule E) beat endorsements (Schedule C) for tax. Arena bonds are tax-exempt.`,action:"basketball"}),botgallery:()=>({buildingId:"botgallery",title:"🎨 BotGallery — Art, Collectibles & Capital Gains",body:`Welcome to BotGallery — the centerpiece of the BotCity Art District. Art is a financial asset, and the tax code treats it very differently from stocks.

📖 COLLECTIBLES — THE 28% RATE:
Long-term capital gains on stocks max out at 20% (or 23.8% with the net investment income tax). But ART, antiques, gems, stamps, coins, and other "collectibles" get a SPECIAL HIGHER RATE: 28% maximum long-term capital gains. Holding period: still 1 year for long-term treatment.

📖 SALES TAX ON ART:
Most states charge sales tax on art purchases — typically 4-9%. New York's "use tax" famously catches collectors who buy art abroad and ship it home; auction houses now collect it at the hammer. Some states (Oregon, Montana, New Hampshire) have NO sales tax — which is why high-end art often gets delivered there first.

📖 DONATING APPRECIATED ART:
This is the sweet spot. If you donate art held >1 year to a public charity (or a museum) for its EXEMPT PURPOSE (display/research), you deduct the FULL FAIR MARKET VALUE — and never pay capital gains on the appreciation. Painting bought for $10k now worth $500k → $500k charitable deduction.

BUT — if the charity sells it within 3 years, your deduction drops to cost basis (with a "true gift" exception). The "related-use" rule is the key.

📖 QUALIFIED APPRAISAL — REQUIRED:
Donations of art over $5,000 require a qualified appraisal attached to Form 8283. Over $50,000 to a single charity gets reviewed by the IRS Art Appraisal Services panel. Inflated valuations are a top audit target.

📖 1031 LIKE-KIND EXCHANGES — GONE FOR ART:
Before TCJA (2018), collectors could swap one painting for another and defer the gain. The Tax Cuts and Jobs Act killed §1031 for everything EXCEPT real estate. Art swaps are now fully taxable sales.

💡 Lesson: Collectibles cap at 28% LTCG (not 20%). Donate appreciated art to a using museum for the biggest break. Qualified appraisal over $5k. No more 1031 swaps.`,action:"gallery"}),botfashion:()=>({buildingId:"botfashion",title:"👗 BotFashion District — Inventory, COGS & Sales Tax",body:`Welcome to BotFashion District! Whether you run a boutique, design clothes, or sell vintage, fashion businesses live and die by INVENTORY accounting.

📖 INVENTORY IS NOT AN EXPENSE — YET:
This trips up every new retailer. The $50,000 of clothing you bought to fill the racks is NOT a tax deduction in the year you bought it. It becomes a deduction only when it SELLS, as "Cost of Goods Sold" (COGS). Until then, it sits on your balance sheet as an asset.

This is why a boutique can have huge cash outflows and still owe taxes — your bank account is empty but your "inventory asset" is high, so taxable profit looks rosy.

📖 COGS FORMULA:
Beginning Inventory + Purchases - Ending Inventory = COGS
You physically count what's left on the racks at year end. That ending number reduces your deduction this year (and becomes next year's beginning balance).

📖 LIFO vs FIFO vs SPECIFIC ID:
• FIFO (First-In-First-Out): oldest items sold first. Tends to OVERSTATE profit when prices rise.
• LIFO (Last-In-First-Out): newest items sold first. Tends to UNDERSTATE profit when prices rise → lower taxes. But the IRS requires you to use LIFO on your books too if you use it on taxes (the "LIFO conformity rule").
• SPECIFIC ID: track each unique piece. Common for boutique/luxury fashion where SKUs are one-of-a-kind.

📖 §263A — UNICAP:
Bigger retailers (>$29M avg gross receipts) must capitalize INDIRECT costs into inventory too: warehousing, buying staff, freight-in. Small retailers can skip this with the small-business exception — major simplification.

📖 SALES TAX BY STATE:
Clothing tax rules are a patchwork. NJ, PA, MN exempt MOST clothing. NY exempts items under $110. MA exempts under $175. CA, TX, FL tax all clothing at the regular rate. Online sellers must collect based on the buyer's state (post-Wayfair, 2018).

📖 SAMPLES, RETURNS & DAMAGED GOODS:
Giveaway samples → marketing expense (deductible). Returns reduce gross sales. Damaged/obsolete inventory written down at year end becomes an immediate deduction — keep documentation of the write-down (photos, disposal records).

💡 Lesson: Inventory is an asset until it sells. COGS = Begin + Purchases - End. Pick FIFO/LIFO carefully. Clothing sales tax is wildly state-specific.`,action:"fashion"}),botcourt:()=>({buildingId:"botcourt",title:"⚖️ BotCourt — Tax Court, Audits & Appeals",body:`Welcome to BotCourt, BotCity's tax court. When you and the IRS disagree, this is where it gets settled. Most disputes never reach a courtroom — but knowing the path matters.

📖 THE AUDIT FUNNEL:
Only about 0.4% of individual returns get audited each year. The audit risk rises sharply with income (>$1M ≈ 2.6%), self-employment (Schedule C cash businesses), large charitable deductions vs. income, and the Earned Income Tax Credit (high error rate → more checks). Most "audits" are mail audits (CP2000 notices) that just ask for documents.

📖 IF YOU DISAGREE — THE APPEALS LADDER:
1. Examiner's report → request a meeting with the auditor's manager.
2. IRS Office of Appeals — INDEPENDENT of the audit team. Goal: settle without court. Most cases end here.
3. U.S. Tax Court — file a petition within 90 days of the "statutory notice of deficiency" (the 90-day letter). You DON'T have to pay first.
4. District Court / Court of Federal Claims — you must PAY the disputed tax first, then sue for refund. Higher cost, but jury trials are possible in District Court.

📖 STATUTE OF LIMITATIONS:
• Normal audit window: 3 years from the filing date.
• 25% income omission: 6 years.
• Fraud or unfiled return: NO LIMIT — the IRS can come for you forever.
• Refund claims: 3 years from the return, or 2 years from payment, whichever is later.

📖 TAX COURT — SMALL CASES (S CASES):
If the disputed amount is ≤ $50,000 per year, you can elect the simplified "S case" procedure. Less formal, faster, lower filing fee — but the decision can't be appealed. Good for individuals without lawyers.

📖 PENALTIES STACK FAST:
• Failure to file: 5% per month, max 25% of unpaid tax.
• Failure to pay: 0.5% per month.
• Accuracy-related (negligence/substantial understatement): 20%.
• Civil fraud: 75%.
• Criminal tax evasion: fines + up to 5 years in prison.

📖 FIRST-TIME PENALTY ABATEMENT:
If you have a clean 3-year compliance history, you can ask the IRS to waive late-filing/late-payment penalties ONCE. Just call and ask. It's not advertised but it's automatic if you qualify.

💡 Lesson: 3-year audit window, Appeals before Tax Court, Tax Court means no upfront payment, fraud has no SOL, ask for first-time abatement.`}),botinsurance:()=>({buildingId:"botinsurance",title:"🛡️ BotInsurance HQ — Premiums, HSAs & Payouts",body:`Welcome to BotInsurance HQ! Insurance touches nearly every line of your tax return. The rules differ wildly by what's insured and how you pay.

📖 EMPLOYER HEALTH INSURANCE — PRE-TAX:
Your share of premiums paid through payroll comes out PRE-TAX (Section 125 "cafeteria plan"). That means it dodges federal income tax, FICA (7.65%), and most state tax. A $300/month premium effectively costs ~$210 — that's a huge benefit hidden in plain sight on your W-2.

📖 SELF-EMPLOYED HEALTH INSURANCE DEDUCTION:
If you're self-employed (Schedule C, partner, or >2% S-corp shareholder) and not eligible for a spouse's plan, you can deduct 100% of health, dental, and qualifying long-term-care premiums ABOVE THE LINE on Schedule 1. No itemizing required. Limited to net SE income.

📖 HSA — THE TRIPLE TAX ADVANTAGE:
If you're on a High-Deductible Health Plan (HDHP), you can fund a Health Savings Account: 2024 limits $4,150 self / $8,300 family + $1,000 catch-up at 55+.
• Contributions: deductible (or pre-tax via payroll).
• Growth: tax-free.
• Withdrawals for qualified medical: tax-free.
No other account beats this. After 65 you can withdraw for ANY reason (just owe income tax — like a traditional IRA). It's stealth retirement savings.

📖 MEDICAL EXPENSE ITEMIZED DEDUCTION:
Out-of-pocket medical above 7.5% of AGI is deductible on Schedule A. Most people never clear the floor.

📖 LIFE INSURANCE — DEATH BENEFITS ARE TAX-FREE:
Proceeds paid to a beneficiary on death are NOT subject to income tax. BUT they're in the deceased's ESTATE for federal estate tax (unless the policy is in an irrevocable life insurance trust — ILIT). Cash value gains inside a permanent policy grow tax-deferred; loans against the policy are generally tax-free until surrender.

📖 DISABILITY & LONG-TERM CARE:
• Disability premiums paid by your employer with pre-tax dollars → benefits are TAXABLE.
• Disability premiums you pay personally with after-tax dollars → benefits are TAX-FREE.
The choice of who pays the premium flips the tax treatment of the entire payout.

📖 AUTO/HOMEOWNERS — NOT DEDUCTIBLE PERSONALLY:
Personal auto and homeowners premiums get no deduction. But business-use portions on Schedule C, or rental property insurance on Schedule E, ARE deductible.

💡 Lesson: pre-tax health premiums beat after-tax. HSA = triple tax-free. Life proceeds tax-free but estate-included. Disability tax flips based on who paid the premium.`}),botenergy:()=>({buildingId:"botenergy",title:"⚡ BotEnergy — Solar, EV & Residential Energy Credits",body:`Welcome to BotEnergy! The federal government uses the tax code to push the transition to clean energy. These are some of the most generous credits in the entire code — but the rules change often, so verify the current year.

📖 §30D — CLEAN VEHICLE CREDIT (NEW EVs):
Up to $7,500 for qualifying new EVs and plug-in hybrids. Split into TWO $3,750 halves:
• Critical-minerals requirement (sourcing of battery materials).
• Battery-components requirement (where the cells are made).
Income cap: $300k joint / $150k single. Vehicle price cap: $80k SUV/truck / $55k car. You can now TRANSFER the credit to the dealer at point of sale — instant discount instead of waiting for tax season.

📖 §25E — USED CLEAN VEHICLE CREDIT:
Up to $4,000 (or 30% of price) on used EVs ≥2 years old, sold by a dealer, price ≤ $25,000. Income cap: $150k joint / $75k single. Available once per buyer.

📖 §25D — RESIDENTIAL CLEAN ENERGY CREDIT (solar, batteries, geothermal, wind):
30% of installed cost for residential solar panels, battery storage (3 kWh+), geothermal heat pumps, small wind, fuel cells. No income limit. No dollar cap. Credit is NONREFUNDABLE but unused amount carries forward to future years.

Example: $25,000 solar installation → $7,500 credit applied against your federal tax bill. If you only owe $4,000 this year, you take $4,000 now and carry forward $3,500.

📖 §25C — ENERGY EFFICIENT HOME IMPROVEMENT CREDIT:
30% of cost, ANNUAL caps:
• $1,200/year total for insulation, windows ($600), doors ($250 each / $500 total), and energy audits ($150).
• $2,000/year for heat pumps, heat-pump water heaters, biomass stoves.
Resets every year — multi-year upgrade plans maximize the benefit.

📖 EV CHARGING — §30C ALTERNATIVE FUEL VEHICLE REFUELING PROPERTY:
30% of cost of a home or business EV charger, up to $1,000 personal / $100,000 business. Limited to chargers in eligible census tracts (low-income or non-urban).

📖 §48 INVESTMENT TAX CREDIT (commercial):
Businesses installing solar, wind, fuel cells, or storage get a 30% ITC, with bonus 10% adders for domestic content or energy-community siting. Often combined with accelerated depreciation (5-year MACRS) for a near-immediate payback.

📖 STATE & UTILITY STACKING:
Federal credits stack with state credits, utility rebates, and net-metering. Some states (CA, NY, MA) routinely push the effective discount to 50-60% of system cost. Always check DSIRE (database of state incentives) before designing the project.

💡 Lesson: EV credit splits in half (minerals + components), can be transferred at the dealer. §25D solar = 30%, no cap, carry-forward. §25C resets every year. Commercial §48 + MACRS = fast payback.`}),botstockex:()=>({buildingId:"botstockex",title:"🐂 BotStock Exchange — How Markets Actually Work",body:`Welcome to the BotStock Exchange — BotCity's NYSE-style trading floor. The opening bell rings here every weekday at 9:30 AM ET, kicking off ~6.5 hours of price discovery for thousands of companies. Here's how it really works under the hood.

📖 WHAT A STOCK IS:
A share of stock is FRACTIONAL OWNERSHIP of a company. Own 1 share of Apple out of ~15 billion outstanding? You own 1/15,000,000,000 of Apple — including its cash, factories, brand, and a tiny claim on future profits. Voting rights, too (usually).

📖 PRIMARY vs. SECONDARY MARKETS:
• PRIMARY: company sells NEW shares (IPO, secondary offering). Money goes to the company.
• SECONDARY: investors trade EXISTING shares with each other (everything you do on a brokerage app). Money goes between investors; the company gets nothing.
99.99% of daily volume is secondary. The exchange's job is matching buyers and sellers — fast, fair, transparent.

📖 THE ORDER BOOK:
Every stock has a LIMIT ORDER BOOK with bids (buyers) and asks (sellers) stacked by price. The BID is the highest price a buyer will pay; the ASK is the lowest a seller will take. The gap = the SPREAD (market makers' cut). Liquid stocks like SPY: spread of $0.01. Thinly traded stocks: spreads of $0.50+.

📖 ORDER TYPES YOU'LL ACTUALLY USE:
• MARKET ORDER: "Fill me now at whatever price." Fast, but you eat the spread + slippage on big orders.
• LIMIT ORDER: "Only fill me at $X or better." Patient — may never fill.
• STOP-LOSS: triggers a market order once price drops to X. Used to cap losses.
• STOP-LIMIT: same trigger, but becomes a LIMIT order — won't fill in a crash.
Rule of thumb: LIMIT orders for entries, STOP-LOSS for exits.

📖 SETTLEMENT — T+1:
As of May 2024 the US moved from T+2 to T+1 settlement. Trade Monday → cash & shares actually change hands Tuesday. Matters for: dividend record dates, wash sales, margin call timing, and avoiding "good faith violations" in cash accounts.

📖 EXCHANGES vs. DARK POOLS:
NYSE and Nasdaq are LIT exchanges — quotes are public. But ~40% of US volume happens off-exchange in DARK POOLS (Citadel, Virtu, etc.) and via payment-for-order-flow. Your Robinhood market order rarely touches NYSE directly — it's sold to a wholesaler who fills you at (or just inside) the public spread.

📖 MARKET CAP TIERS:
• Mega-cap: >$200B (Apple, Microsoft).
• Large-cap: $10B–$200B (S&P 500 territory).
• Mid-cap: $2B–$10B.
• Small-cap: $300M–$2B.
• Micro/nano-cap: <$300M — illiquid, manipulation-prone.

📖 INDEX FUNDS — WHY THEY WIN:
The S&P 500 is just the 500 largest US companies, weighted by market cap. An S&P 500 INDEX FUND (VOO, IVV, SPY) buys all 500 in proportion, charges ~0.03% per year, and beats ~85% of actively managed funds over 10-year periods (SPIVA scorecard, every year, consistently). Costs and taxes are why — not stock-picking skill.

📖 TAX TREATMENT — THE PART THAT FUNDS YOU:
• Held >1 year → LONG-TERM CAPITAL GAINS: 0% / 15% / 20% depending on income.
• Held ≤1 year → SHORT-TERM: taxed as ORDINARY INCOME (up to 37%).
• Dividends — "QUALIFIED" (most US stocks, held 60+ days): same favorable rates as LTCG. "Ordinary" (REITs, MLPs, short holds): ordinary rates.
• WASH-SALE RULE: sell at a loss, rebuy "substantially identical" within 30 days → loss DISALLOWED, basis adjusted into the new lot. Brokers report it on your 1099-B for the same account, but NOT across accounts (your IRA can blow up a taxable loss).
• §1091 + IRS Pub 550 — read once, save thousands.

📖 BROKERAGE ACCOUNT TYPES:
• TAXABLE BROKERAGE: most flexible, you owe tax on dividends and realized gains every year.
• TRADITIONAL IRA / 401(k): tax-deferred, ordinary income on withdrawal.
• ROTH IRA / 401(k): after-tax in, tax-free growth, tax-free qualified withdrawals.
• HSA: triple-tax-advantaged if you're on an HDHP (see BotInsurance).
General order for most people: 401(k) up to employer match → HSA → Roth IRA → max 401(k) → taxable.

📖 SHORT SELLING & MARGIN:
• MARGIN: borrowing from your broker to buy more shares. Reg T: up to 50% initial margin (you put up half). Margin CALLS happen when equity falls below 25% maintenance.
• SHORT SELLING: borrow shares, sell them, hope to buy back lower. Theoretically unlimited loss — the stock can go to infinity, you can't.
• Both are pro-grade tools. Most retail investors lose money using them.

📖 CIRCUIT BREAKERS:
After the 1987 crash, the SEC installed market-wide breakers tied to S&P 500 drops:
• Level 1: −7% → 15-minute halt.
• Level 2: −13% → another 15-minute halt.
• Level 3: −20% → market closes for the day.
Individual stocks have LULD (Limit Up / Limit Down) bands triggering 5-minute halts.

💡 The market is a voting machine in the short run and a weighing machine in the long run (Ben Graham). Day-trading is mostly random noise; the historical equity risk premium (~5% above bonds, before tax) accrues to those who SIT STILL for decades.

Now take a selfie with the bull and go fund your IRA. 🐂📈`}),botfactory:()=>({buildingId:"botfactory",title:"🏭 BotFactory — Manufacturing, §179 & Depreciation",body:`Welcome to BotFactory! Manufacturing businesses live in a different corner of the tax code than service businesses — depreciation, cost of goods, and capital investment rules dominate.

📖 DEPRECIATION — WHY YOU CAN'T DEDUCT THE MACHINE TODAY:
When a factory buys a $500,000 CNC press expected to last 7 years, it can't deduct the full cost this year. Capital assets are CAPITALIZED and deducted over their useful life via DEPRECIATION. The IRS publishes "class lives" for everything (Publication 946).

📖 MACRS — THE DEFAULT SYSTEM:
The Modified Accelerated Cost Recovery System assigns each asset a class:
• 5-year: cars, computers, R&D equipment.
• 7-year: most factory machinery, office furniture.
• 15-year: land improvements (fencing, paving).
• 27.5-year: residential rental real estate.
• 39-year: commercial real estate.
MACRS front-loads the deduction (double-declining balance switching to straight-line), so most of the deduction lands in early years.

📖 §179 EXPENSING — DEDUCT IT ALL NOW:
Small and mid-size businesses can ELECT to immediately expense up to $1,160,000 (2023; indexed annually) of qualifying property in the year placed in service. Phase-out begins when total purchases exceed $2,890,000 — limit drops dollar-for-dollar above the threshold. Limited to taxable income from the business (no §179 loss).

📖 BONUS DEPRECIATION — FIRST-YEAR DEDUCTION:
A second turbo-charger: bonus depreciation lets you deduct a percentage of the cost in year 1 EVEN ABOVE the §179 limit, with no income or phase-out cap. Schedule:
• 2022: 100%
• 2023: 80%
• 2024: 60%
• 2025: 40%
• 2026: 20%
• 2027+: 0% (absent new legislation).
Bonus and §179 can be combined; usually take §179 first, then bonus on the rest.

📖 §263A UNICAP — MANUFACTURERS MUST CAPITALIZE MORE:
Manufacturers must capitalize INDIRECT costs (factory rent, utilities, supervisor wages) into inventory under §263A, not deduct them currently. Small businesses (average gross receipts ≤ $29M, 2023) are EXEMPT from UNICAP — a major simplification.

📖 COST OF GOODS SOLD (COGS):
Manufacturers compute COGS as: Beginning Inventory + Direct Materials + Direct Labor + Factory Overhead + Purchases − Ending Inventory. COGS reduces gross revenue to gross profit. Inventory accounting (FIFO, LIFO, weighted-average) directly drives taxable income.

📖 §199A — QBI DEDUCTION:
Pass-through manufacturers (sole prop, partnership, S-corp) get up to a 20% deduction on Qualified Business Income, subject to wage and asset-basis limits. Manufacturing is NOT a "specified service trade or business," so it doesn't get phased out at higher incomes — a big advantage over lawyers, accountants, consultants.

📖 R&D CREDIT (§41) & §174:
Development of new products or processes can earn the federal R&D credit (≈ 20% of qualified expenses, simpler 14% alternative simplified method). Since 2022, §174 requires CAPITALIZING and amortizing R&D over 5 years (15 years if foreign) — a major cash-flow hit that Congress keeps debating.

💡 Lesson: capitalize → depreciate via MACRS, OR elect §179 (up to $1.16M) + bonus depreciation. UNICAP for big manufacturers. COGS-driven taxable income. QBI 20% for pass-throughs. R&D credit + new §174 capitalization rule.`}),botmint:()=>({buildingId:"botmint",title:"💵 BotMint — What Money Actually Is",body:`Welcome to BotMint, where coins get stamped and economists argue.

📖 MONEY DOES THREE JOBS:
1. Medium of exchange — you don't barter chickens for haircuts.
2. Store of value — $100 today should still buy something next year.
3. Unit of account — prices in one currency let you compare apples to phones.

📖 FIAT vs COMMODITY:
Fiat money (USD, EUR) is backed by trust in the issuing government, not gold. Commodity money (historical: gold, silver) had intrinsic worth. Cryptocurrencies sit in a third bucket — scarcity by code, no issuer.

📖 M0 → M2:
Central banks track money supply in tiers. M0 = physical cash + bank reserves. M1 = M0 + checking deposits. M2 = M1 + savings deposits + retail money-market funds. When you hear "money supply grew 8%", that's usually M2.

💡 Takeaway: every dollar in your wallet works because a few hundred million people agree it does.`}),botbudget:()=>({buildingId:"botbudget",title:"📒 BotBudget Cafe — The 50/30/20 Rule",body:`Pull up a stool. A budget is just a plan for the money before it disappears.

📖 50/30/20 (Senator Warren's framework):
• 50% NEEDS — rent, groceries, utilities, minimum debt payments, basic insurance.
• 30% WANTS — dining out, streaming, hobbies, upgrades.
• 20% SAVINGS & DEBT PAYDOWN — emergency fund, retirement, extra principal.
All percentages are of TAKE-HOME pay (after tax), not gross.

📖 ZERO-BASED BUDGET:
Every dollar gets a job before the month starts. Income − every category = $0. Forces intent. Tools: YNAB, EveryDollar, a notebook.

📖 PAY YOURSELF FIRST:
Automate savings the day your paycheck lands. You can't spend what isn't in checking. Even $25/week becomes ~$1,300/year, ~$18,000 in a decade with 5% growth.

📖 LIFESTYLE CREEP:
When income rises, spending tends to rise to match. The fix: bank half of every raise before you adjust your lifestyle.

💡 The best budget is the one you'll actually keep — not the strictest one.`}),botsavings:()=>({buildingId:"botsavings",title:"🐷 BotSavings Plaza — Emergency Funds & High-Yield Accounts",body:`Welcome to the piggy-bank plaza. Saving isn't sexy — it's the foundation under everything else.

📖 EMERGENCY FUND:
Cash you can grab fast when a job, a car, or a furnace gives up. Rule of thumb: 3 months of essential expenses for dual-income, 6 months for single-income, 9–12 months for variable-income (1099, commission).

📖 WHERE TO PARK IT:
• High-yield savings account (HYSA): ~4–5% APY, FDIC-insured to $250K. Liquid in 1–2 days.
• Money-market account: similar yield, sometimes checks.
• Treasury bills (4-, 8-, 13-, 26-week): state-tax-free, backed by the US.
AVOID locking the emergency fund in CDs with early-withdrawal penalties or in stocks.

📖 APY vs APR:
APY (yield) includes compounding. APR (rate) is the simple annualized rate. For savings, APY is the real number. For loans, APR is what you owe.

📖 RULE OF 72:
Doubling time ≈ 72 / rate. $10K at 5% doubles in ~14.4 years. At 8%, ~9 years.

💡 First $1,000 → starter buffer. Then attack high-interest debt. Then refill to full 3–6 months.`}),botcreditbureau:()=>({buildingId:"botcreditbureau",title:"📇 BotCredit Bureau — FICO, Reports & Disputes",body:`Three bureaus — Experian, Equifax, TransUnion — keep a running file on every adult borrower. Lenders, landlords, even some employers pull it.

📖 FICO SCORE (300–850) — THE 5 INPUTS:
• 35% Payment history — on-time vs late/charged-off.
• 30% Amounts owed — especially CREDIT UTILIZATION (balance ÷ limit). Keep < 30%, ideally < 10%.
• 15% Length of credit history — don't close the oldest card without thought.
• 10% New credit — hard inquiries hurt for ~12 months.
• 10% Credit mix — revolving + installment.
VantageScore uses similar inputs with slightly different weights.

📖 SCORE TIERS:
800+ exceptional · 740–799 very good · 670–739 good · 580–669 fair · <580 poor.

📖 FREE REPORTS:
AnnualCreditReport.com — federally mandated, one from each bureau per week (post-COVID rule). Free score: most credit-card apps and Credit Karma (VantageScore).

📖 DISPUTES:
Wrong balance, account that isn't yours, lingering paid collection? File a dispute online. Bureau has 30 days to investigate. Keep records.

💡 The cheapest way to "improve credit fast": pay down a card BEFORE the statement closes, so a low balance reports.`}),botbehavioral:()=>({buildingId:"botbehavioral",title:"🧠 BotBehavioral Lab — Why Your Brain Sabotages Your Wallet",body:`Behavioral economics, in 8 minutes, with examples from your actual life.

📖 LOSS AVERSION (Kahneman & Tversky):
Losing $100 hurts about twice as much as gaining $100 feels good. That's why you hold a losing stock "until it gets back to even" — a tax-inefficient move that ignores opportunity cost.

📖 ANCHORING:
First number you hear steers the rest. A $1,200 jacket marked down to $400 feels cheap; the same $400 jacket at full price feels expensive. Same jacket.

📖 PRESENT BIAS / HYPERBOLIC DISCOUNTING:
You'll choose $100 now over $110 next week — but $100 in 52 weeks vs $110 in 53 weeks, you'll happily wait. The "now" gets a huge unfair weight. Fix: automate retirement contributions before your brain sees the cash.

📖 SUNK-COST FALLACY:
"I already paid for the gym/class/subscription, so I should keep going." The money is gone either way. Decide on FUTURE value only.

📖 MENTAL ACCOUNTING:
Treating a tax refund as "free money" while keeping a strict grocery budget. Money is fungible — a $3K refund is just 3K dollars that were over-withheld from your own paychecks.

💡 You don't have to defeat these biases — just notice them in the moment.`}),botmortgage:()=>({buildingId:"botmortgage",title:"🏘️ BotMortgage Bank — Buying a House With Borrowed Money",body:`Most people borrow more for a house than for everything else combined. Get the basics right.

📖 THE BIG NUMBERS:
• Down payment: conventional 5–20%, FHA 3.5%, VA 0%, USDA 0%. Below 20% conventional → PMI (private mortgage insurance) until you hit 20% equity.
• Term: 30-year (lower payment, more interest), 15-year (higher payment, ~⅓ the interest).
• Rate type: FIXED (locks for the term) vs ARM (adjusts after intro period — 5/1, 7/1).

📖 PITI:
Monthly payment = Principal + Interest + Taxes + Insurance. Sometimes + HOA. Lenders cap PITI around 28% of gross income, total debt around 36–43%.

📖 POINTS:
1 discount point = 1% of loan, typically buys ~0.25% off your rate. Worth it if you'll stay long enough to recoup (break-even = cost ÷ monthly savings).

📖 AMORTIZATION:
Early payments are mostly interest, late payments mostly principal. On a 30-yr at 7%, the FIRST month of a $300K loan is ~$1,750 interest and only ~$250 principal.

📖 ESCROW:
Lender collects 1/12 of yearly tax + insurance with each payment, then pays the bills for you. If taxes jump, your monthly payment jumps next year.

💡 Refinance math: new rate must beat old rate by enough to cover closing costs (~2–3% of loan) within your remaining stay.`}),botstudentaid:()=>({buildingId:"botstudentaid",title:"🎓 BotStudentAid — FAFSA, Federal vs Private Loans, IDR",body:`Paying for school with borrowed money — get the order right and you'll save tens of thousands.

📖 FAFSA FIRST, ALWAYS:
The Free Application for Federal Student Aid opens Oct 1 (for most years). Submit even if you think you won't qualify — many schools require it for institutional aid too.

📖 STACK ORDER (cheapest first):
1. Scholarships & grants (free).
2. Work-study.
3. Subsidized federal loans — government pays interest while in school.
4. Unsubsidized federal loans — interest accrues from day 1, but fixed rate, flexible repayment.
5. Parent PLUS / Grad PLUS — federal, higher rate.
6. Private loans — last resort; usually need a cosigner, fewer protections.

📖 FEDERAL > PRIVATE (USUALLY):
Federal loans get income-driven repayment (SAVE/PAYE/IBR), forbearance, deferment, PSLF (Public Service Loan Forgiveness — 120 qualifying payments while working full-time for government/501c3 = balance forgiven), and discharge in death/disability. Private loans get none of that.

📖 IDR PLANS:
Payments capped at a % of discretionary income (typically 5–10%), remaining balance forgiven after 20–25 years (taxable as income unless rules change). Best for high debt + modest salary (teachers, social work, public health).

📖 INTEREST CAPITALIZATION:
When unpaid interest gets added to your principal balance, you start paying interest on that interest. Avoid by paying at least the interest during deferment if possible.

💡 If your dream career has loan forgiveness on the table (PSLF, NHSC, teacher forgiveness), borrow federal and certify employment YEARLY.`}),botautoloans:()=>({buildingId:"botautoloans",title:"🚙 BotAuto Loans — Car Financing Without Getting Wrecked",body:`A car is a depreciating asset. Borrowing for one isn't evil — overpaying for the borrow is.

📖 LOAN TERMS:
3-yr (36mo): higher payment, lowest interest, you stay above water.
6-yr/7-yr (72/84mo): low payment, but you're underwater (owe more than the car's worth) for years and pay ~2× the interest.
Industry pushed long terms because they let dealers quote a smaller monthly number. Don't bite.

📖 APR vs MONTHLY PAYMENT:
Dealers love asking "what payment can you afford?" That hides the rate, term, and total cost. Negotiate the PURCHASE PRICE first, then financing, then trade-in. Three separate conversations.

📖 PREAPPROVAL:
Get a rate from a credit union or bank BEFORE you walk into the dealer. The dealer can then try to beat it. Without a preapproval, you're at their mercy.

📖 GAP INSURANCE:
If you owe $30K but the totaled car is only worth $24K, gap insurance covers the $6K shortfall. Worth considering if your down payment is small or term is long.

📖 LEASE vs BUY:
Lease = renting depreciation. Good if you'll trade in every 3 years, drive < 12K miles/year, want a warranty-covered car. Bad if you want equity, drive lots, or keep cars 10+ years.

📖 THE 20/4/10 RULE:
20% down · 4-year max term · total transport costs ≤ 10% of gross income. Conservative, but keeps you out of trouble.`}),botpayday:()=>({buildingId:"botpayday",title:"⏱️ BotPayday & Pawn — The Math of Predatory Lending",body:`Welcome to the place that exists because emergencies and bad options collide. Walk in informed.

📖 PAYDAY LOAN MATH:
"$15 fee per $100 borrowed for 2 weeks" sounds reasonable. APR: $15/$100 × (365/14) = 391%. Compared to a credit card's 25%, that's catastrophic.

📖 THE ROLLOVER TRAP:
Most borrowers can't repay the full balance in 14 days, so they roll the loan — paying another fee. Average borrower: 8 rollovers, pays $500+ in fees on a $300 original loan. CFPB calls this the "cycle of debt."

📖 PAWN LOANS:
Collateralized loan against an item. Don't pay → you lose the item. APRs run 60–250%. Better than payday IF you genuinely don't need the item back, but you're typically getting 25–60% of resale value upfront.

📖 TITLE LOANS:
Borrow against your car title. Miss a payment, the lender repossesses. Highest-stakes version of payday lending — losing the car often means losing the job.

📖 BETTER ALTERNATIVES:
• PAL (Payday Alternative Loan) from a federal credit union: capped at 28% APR.
• Employer paycheck advance (EarnIn, DailyPay) — often interest-free.
• Negotiate the underlying bill — utility companies, hospitals, landlords almost always have hardship programs.
• Local nonprofit emergency funds (United Way 211 hotline).

💡 The cheapest emergency loan is the one you never need — which is why even a small emergency fund is so powerful (see BotSavings Plaza).`}),botbankruptcy:()=>({buildingId:"botbankruptcy",title:"⚖️ BotBankruptcy Court — When the Math Stops Working",body:`Bankruptcy is a legal reset, not a moral failing. It's a tool — know how it works before you ever need it.

📖 CHAPTER 7 — LIQUIDATION:
Court wipes most unsecured debt (credit cards, medical, personal loans). In exchange, a trustee can sell non-exempt assets. Most filers are "no-asset" cases — exemptions cover everything they own. Filing typically takes 3–6 months. Stays on credit report 10 years.

📖 CHAPTER 13 — REORGANIZATION:
You keep your assets but follow a 3–5 year repayment plan. Used by people with steady income who want to save a house from foreclosure or catch up on a car loan. Stays on credit 7 years from filing.

📖 CHAPTER 11 — BUSINESSES:
Reorganization for companies (and rich individuals with too much debt for Ch.13). Different process.

📖 WHAT BANKRUPTCY CAN'T TOUCH:
• Most student loans (very hard to discharge — requires "undue hardship" finding).
• Recent income taxes (older taxes sometimes dischargeable).
• Child support / alimony.
• Debts from fraud or willful injury.
• Court fines / criminal restitution.

📖 MEANS TEST:
Income above your state's median? You get pushed from Ch.7 toward Ch.13. Designed to stop high earners from wiping debt while keeping luxury assets.

📖 LIFE AFTER:
Credit scores often start rebuilding within a year (debt-free balance sheet helps). Secured cards, auto loans, and even mortgages become available — at higher rates — within 2–4 years.

💡 Talk to a bankruptcy attorney before drawing down your 401(k) to pay credit-card debt. Retirement accounts are usually fully protected; the cash you withdraw is not.`}),botindex:()=>({buildingId:"botindex",title:"📊 BotIndex Funds — Why Boring Wins",body:`Welcome to the boring-genius corner of investing. The biggest finding in 50 years of finance research: most stock-pickers underperform a simple index over time.

📖 WHAT AN INDEX FUND IS:
A fund that holds every stock in a published index — S&P 500 (largest 500 US firms), Total US Stock Market (~3,500 firms), Total International (developed + emerging), Total US Bond Market. Weight is usually by market cap.

📖 EXPENSE RATIO:
Annual cost as % of assets. Index funds run 0.02–0.20%. Actively-managed mutual funds average ~0.8%. Over 30 years on $100K growing 7%, a 0.7% drag costs ~$150K in lost compounding. The fee is the fund's headwind that never lets up.

📖 ETF vs MUTUAL FUND:
ETFs trade like stocks (intraday price, lower min, tax-efficient), mutual funds price once daily. Most major index funds exist in both wrappers. For taxable accounts, ETFs usually win on capital-gains efficiency.

📖 THE 3-FUND PORTFOLIO (Bogleheads):
• US Total Stock
• International Total Stock
• US Total Bond
Pick percentages by risk tolerance (e.g. 60/20/20) and rebalance once a year. That's it. Beats most professionals over 20-year periods.

📖 SPIVA SCORECARD:
S&P publishes this twice a year. Latest: ~85–90% of large-cap active funds underperform their benchmark over 15 years. Survivorship adjustment makes it worse — the losers get quietly closed.

💡 Time IN the market beats timing the market. The S&P 500's 10 best days each decade account for most of the total return — miss them and you halve your gains.`}),botreit:()=>({buildingId:"botreit",title:"🏢 BotREIT Tower — Real Estate Without Landlording",body:`A Real Estate Investment Trust (REIT) is a company that owns or finances income-producing real estate. By law, it pays out ≥90% of taxable income as dividends — so REITs throw off serious yield.

📖 REIT TYPES:
• Equity REITs — own physical properties (apartments, malls, warehouses, data centers, cell towers).
• Mortgage REITs (mREITs) — own mortgages and mortgage-backed securities; higher yield, much higher rate-risk.
• Hybrid — both.
• Public-traded vs Private vs Non-traded — non-traded REITs have fat fees and limited liquidity; usually skip.

📖 TAX QUIRKS:
Most REIT dividends are taxed as ORDINARY INCOME, not the preferential 15/20% qualified-dividend rate. That makes REITs natural fits for IRA/401(k) shells where the tax drag disappears. Section 199A pass-through deduction gives a 20% break on REIT dividends through 2025.

📖 KEY METRICS:
• FFO (Funds From Operations) — REIT version of earnings; adds depreciation back because real estate doesn't actually depreciate to zero.
• AFFO — FFO minus recurring capex; closer to "real" cash.
• Cap rate — net operating income ÷ property value.

📖 DIVERSIFICATION:
A broad-market REIT ETF (VNQ, SCHH, IYR) gives you 100+ REITs across sectors for ~0.07% fee. Allocations of 5–10% of a stock portfolio are common.

💡 REITs are NOT bonds — they're correlated with stocks during crashes. Don't park your emergency fund here.`}),botcommodities:()=>({buildingId:"botcommodities",title:"🌾 BotCommodities Pit — Gold, Oil, Wheat & Friends",body:`Commodities are raw materials — energy (oil, gas), metals (gold, silver, copper), agriculture (wheat, corn, soy, coffee), livestock. They behave very differently from stocks and bonds.

📖 WHY HOLD ANY?
• Inflation hedge — commodity prices feed INTO inflation; rising commodities = rising CPI.
• Diversifier — low correlation with equities in normal regimes.
• Stress hedge — gold tends to hold up during geopolitical shocks and currency stress.

📖 HOW TO BUY:
• Physical (gold/silver) — coins, bars, allocated storage. Spreads + storage + insurance cost.
• Futures contracts — leveraged, expire, requires a brokerage account approved for futures. Most retail investors should NOT.
• Commodity ETFs — track futures (USO for oil, DBC broad basket). Watch for "contango drag" — rolling expiring contracts at higher prices erodes returns.
• Producer stocks — buying ExxonMobil or Newmont Mining isn't the same as buying the commodity, but it's a cheaper proxy.

📖 GOLD vs EVERYTHING ELSE:
Gold pays no dividend, generates no cash flow. Long-run real return ~ 0–1%. Its value is the value other people will give it. Useful in small allocation (~5%) as crisis insurance, not as wealth-builder.

📖 TAX:
Gains on collectibles (including physical metals and some metal-ETFs structured as grantor trusts like GLD) are taxed at up to 28%, not the usual 15/20% long-term cap-gains rate.

💡 Pure-play commodity exposure is for diversification, not the engine of your portfolio.`}),botventure:()=>({buildingId:"botventure",title:"🚀 BotVenture Capital — Angel Investing & Startups",body:`Venture capital is what funds the moonshots — small chance of huge return, large chance of total loss. Different game than public stocks.

📖 THE POWER LAW:
In a venture portfolio of 10 startups: 5–7 fail, 1–2 return capital, 1 returns 10×+ — and that one pays for everything. Diversification across at least 20–30 deals is normal at the institutional level. Two-deal portfolios usually lose money.

📖 ACCREDITED INVESTOR:
SEC rule. To invest in most private rounds you need either $1M net worth (excluding primary residence) OR $200K income ($300K joint) for the last 2 years. Reg CF crowdfunding (Republic, StartEngine) opens small checks to everyone, capped per year by income.

📖 SAFE vs PRICED ROUND:
• SAFE (Simple Agreement for Future Equity) — pay now, get shares later at a discount when the next priced round happens. YC standard.
• Priced round — you buy shares at an agreed valuation today.
Watch the VALUATION CAP and DISCOUNT terms on SAFEs.

📖 ILLIQUIDITY:
You can't sell private shares on demand. Exits come from IPO or acquisition, typically 7–10 years out. Money you might need in 5 years should not be here.

📖 §1202 QSBS:
US Qualified Small Business Stock — held >5 years, gain up to $10M (or 10× basis) can be FEDERAL TAX-FREE. Huge incentive baked into the tax code for early-stage US equity.

💡 Treat venture as 0–5% of net worth, money you've already mentally written off, and you'll either be pleasantly surprised or unhurt.`}),botbonds:()=>({buildingId:"botbonds",title:"🧾 BotBonds Desk — Lending Money on Purpose",body:`A bond is an IOU. You lend $1,000 to a government or company; they pay you interest (the "coupon") on a schedule and return your $1,000 at maturity.

📖 THE BIG CATEGORIES:
• US Treasuries — backed by the US government. T-bills (≤1yr), T-notes (2–10yr), T-bonds (20–30yr). Interest is exempt from state/local tax.
• TIPS — Treasury Inflation-Protected Securities; principal adjusts with CPI.
• I Bonds — savings bonds with inflation-linked coupon, $10K/year limit per person via TreasuryDirect.
• Municipal bonds — issued by states/cities. Interest usually federal-tax-free; in-state munis also state-tax-free.
• Corporate bonds — issued by companies. Higher yield, default risk.
• High-yield ("junk") bonds — BB or lower; equity-like volatility.

📖 PRICE / YIELD INVERSE:
When interest rates RISE, existing bond prices FALL (the old, lower coupon is worth less). When rates fall, bond prices rise. This is why a 2022 60/40 portfolio got crushed — both stocks AND bonds fell as rates rocketed up.

📖 DURATION:
Measures rate sensitivity. Duration 7 means a 1% rate hike → ~7% price drop. Short-duration funds (BSV, VGSH) are cash-like; long-duration (TLT, VGLT) swing hard.

📖 LADDERING:
Buy bonds maturing in 1, 2, 3, 4, 5 years. As each matures, reinvest at the long end. Smooths out rate risk without timing markets.

📖 ROLE IN A PORTFOLIO:
Not to make you rich — to PRESERVE capital and provide ballast when stocks dive. Classic 60/40 puts 40% in bonds for exactly this reason.

💡 In a taxable account, compare a muni's TAX-EQUIVALENT YIELD: muni yield ÷ (1 − your marginal rate). At 32% bracket, a 3.5% muni = 5.15% taxable equivalent.`}),botchapel:()=>({buildingId:"botchapel",title:"💒 BotChapel — Money Talks Before 'I Do'",body:`Marriage is, in part, a legal merger of two balance sheets. Knowing how it works prevents a lot of fights.

📖 FILING STATUS:
Married Filing Jointly (MFJ) usually beats Married Filing Separately (MFS) — wider brackets, full access to credits (EITC, education, IRA deductions). MFS makes sense for unusual cases: huge medical bills on one spouse, income-driven student loan repayment optimization, or shielding from a spouse's tax issues.

📖 MARRIAGE PENALTY vs BONUS:
• BONUS: two spouses with very different incomes — the higher earner gets to use the lower earner's wider lower brackets. Combined tax can drop.
• PENALTY: two high earners — at the top brackets, combined income hits 24%/32%/35% sooner than two singles would. Phase-outs for SALT, Roth IRA, etc. also bite earlier.

📖 PRENUPS:
Not just for the rich. A prenup defines what stays separate property (premarital assets, inheritances, a business one spouse built), how appreciation is treated, and spousal support if divorce happens. Especially important in COMMUNITY PROPERTY states (CA, TX, AZ, ID, LA, NM, NV, WA, WI) where income earned during marriage is 50/50 by default.

📖 BENEFICIARY UPDATES:
Marriage doesn't automatically change beneficiaries on retirement accounts and life insurance. Update them or your ex-fiancée from 8 years ago still inherits.

📖 JOINT vs SEPARATE FINANCES:
No right answer. Common hybrid: joint household account funded proportionally by income, individual "yours/mine" accounts for personal spending.

💡 The conversation BEFORE the wedding (debt, savings, credit scores, money habits) prevents most money fights AFTER.`}),botmaternity:()=>({buildingId:"botmaternity",title:"👶 BotMaternity Ward — The Money Side of a New Kid",body:`Congratulations / brace yourself. A new dependent reshapes your taxes, insurance, and savings priorities.

📖 CHILD TAX CREDIT (CTC):
2024: $2,000 per qualifying child under 17. Up to $1,700 refundable (Additional CTC). Phases out above $200K single / $400K joint. SSN required for the child by return due date.

📖 DEPENDENT CARE BENEFITS:
• Dependent Care FSA — set aside up to $5,000 PRE-TAX (per household) for daycare, after-school, summer-day-camp for kids under 13.
• Child & Dependent Care Credit — 20–35% of up to $3,000 ($6,000 for 2+ kids). You can use BOTH but not on the same dollars.

📖 INSURANCE:
Add baby to your health plan within 30 days of birth (or 60 in some plans) — it's a "qualifying life event." Compare which spouse's plan is cheaper for family coverage.

📖 LIFE INSURANCE:
The new minimum: enough term life on each earning parent to replace 10–15 years of income. TERM, not whole life — cheaper, simpler.

📖 SAVINGS PRIORITY ORDER:
1. Emergency fund up to 6 months.
2. Both parents' retirement (you can't borrow for retirement; kids can borrow for college).
3. 529 for the kid — state tax deduction in most states, tax-free growth, broad qualified-expense definition.

📖 ESTATE BASICS (see BotEstate):
New baby → get a will, name a GUARDIAN, set up beneficiaries on retirement accounts.

💡 The biggest "first-year-of-baby" surprises: lost income from leave, daycare ($1,000–$2,500/month in many cities), and health-plan deductibles. Plan in advance.`}),botestate:()=>({buildingId:"botestate",title:"⚰️ BotEstate Office — Wills, Trusts & What Happens After",body:`Estate planning isn't just for the wealthy. If you have a kid, a house, a retirement account, or strong opinions about your stuff — you need a plan.

📖 THE FOUR ESSENTIAL DOCUMENTS:
1. WILL — names a guardian for minor kids, directs distribution of probate assets, names an executor.
2. DURABLE POWER OF ATTORNEY (financial) — someone can act on money matters if you're incapacitated.
3. HEALTHCARE POWER OF ATTORNEY + LIVING WILL — medical decisions if you can't make them.
4. BENEFICIARY DESIGNATIONS — on every retirement account, life insurance policy, and TOD/POD bank account. These OVERRIDE your will.

📖 PROBATE vs NON-PROBATE:
Probate is the court process to transfer titled assets you owned alone at death. Slow (6–18 months), public, and costs 3–7% in many states. Avoid via:
• Beneficiary designations.
• Joint ownership with right of survivorship.
• Transfer-on-Death deeds (in states that allow them).
• Revocable Living Trust.

📖 REVOCABLE LIVING TRUST:
You retitle assets into the trust while alive. You control it. At death, your successor trustee distributes per the trust — NO probate. Costs a few thousand to set up, often worth it for homeowners.

📖 ESTATE TAX:
Federal exemption ~$13.6M per person (2024), portable between spouses (effective ~$27M per couple). Most people will never owe federal estate tax — but watch your STATE: MA, OR, RI, WA, others tax estates starting at $1–4M.

📖 STEP-UP IN BASIS:
Assets inherited get their cost basis "stepped up" to date-of-death value. A house Grandma bought for $30K worth $700K at death → heirs' basis is $700K. Sell next year for $710K, only $10K of gain. Huge benefit; consider holding rather than gifting appreciated property.

💡 Update beneficiaries after every major life event — marriage, divorce, birth, death.`}),bothealthplan:()=>({buildingId:"bothealthplan",title:"🩺 BotHealthPlan — Picking Coverage Without Getting Crushed",body:`Healthcare costs are the #1 driver of US bankruptcies. Picking the right plan matters.

📖 PLAN TYPES:
• HMO — must stay in network, need referrals. Cheapest.
• PPO — in/out of network, no referrals. More flexible, more expensive.
• EPO — like HMO but no referrals.
• HDHP — High-Deductible Health Plan. Higher deductible, lower premium, paired with an HSA.

📖 THE FIVE NUMBERS THAT MATTER:
• Premium — what you pay monthly to have the plan.
• Deductible — what you pay before insurance kicks in.
• Copay — flat fee per visit/Rx.
• Coinsurance — your % share after deductible (often 20%).
• Out-of-pocket MAX — annual cap on what you can pay; everything above is 100% covered.
Do the math: premiums × 12 + likely out-of-pocket cost = your real annual price.

📖 HSA (HSA-eligible HDHP only):
The most tax-advantaged account in the code. Triple tax-free: deductible going in, grows tax-free, tax-free out for qualified medical. 2024 contribution limits: $4,150 self / $8,300 family / +$1,000 catch-up at 55. Unused balance rolls forever. After 65, can be used like a traditional IRA (taxable but no penalty) for non-medical.

📖 FSA vs HSA:
FSA = Flexible Spending Account. Use-it-or-lose-it (~$3,200 cap 2024). Not portable when you change jobs. Useful if you have predictable medical/dental/vision spending.

📖 ACA MARKETPLACE:
If no employer plan, healthcare.gov. Premium tax credits available based on income — even mid-income families often qualify post-2021 rule changes. Open enrollment runs Nov 1 – Jan 15 in most states.

📖 BALANCE BILLING / NO SURPRISES ACT (2022):
You can't be balance-billed for out-of-network ER care or for out-of-network providers at in-network facilities (anesthesia, radiology). If you get a surprise bill, file a complaint.

💡 Run the math on HDHP + HSA each year — if you're healthy, the tax-advantaged savings often beat the lower-deductible plan by thousands.`}),botdivorce:()=>({buildingId:"botdivorce",title:"💔 BotDivorce Mediation — Untangling Two Balance Sheets",body:`Divorce is hard. Divorce mistakes echo for decades. Here's the financial map.

📖 PROPERTY DIVISION:
• Community property states (CA, TX, AZ, ID, LA, NM, NV, WA, WI): marital assets/debts split 50/50.
• Equitable distribution states (most others): "fair" not always "equal." Judge weighs length of marriage, contributions, earning capacity, custody.
GENERAL RULE: pre-marital and inherited property stays separate IF it wasn't commingled.

📖 RETIREMENT ACCOUNTS — QDRO:
A Qualified Domestic Relations Order is the special court order required to split a 401(k) / pension / 403(b) without triggering early-withdrawal penalties or taxes. Without a proper QDRO, the spouse receiving the funds can owe ordinary tax + 10% penalty. IRAs split via a different process (transfer incident to divorce).

📖 ALIMONY / SPOUSAL SUPPORT:
Post-2018 (TCJA): for divorces FINALIZED 2019+, alimony is NOT deductible to the payer and NOT taxable to the recipient. Reverse of the old rule. Older agreements grandfathered unless modified to opt in.

📖 CHILD SUPPORT:
Never taxable to receiver, never deductible to payer. Always set by state formula based on incomes + custody time.

📖 THE HOUSE:
Three options: sell + split, one keeps + buys out, co-own temporarily. If one keeps it — REFINANCE to remove the other's name (otherwise their credit is still on the hook). Watch for capital gains: $250K single exemption vs $500K married, and you only get the higher one if you SELL while still married.

📖 BENEFICIARY & DOC UPDATES (DAY OF):
• Beneficiaries on retirement, life insurance, bank accounts.
• New will, new powers of attorney, healthcare directive.
• Joint credit cards — separate or close.
• Auto/home insurance policies.

📖 SOCIAL SECURITY:
Married 10+ years before divorce? You may claim on the ex-spouse's record (up to 50% of their benefit) without affecting their benefit, IF you're unmarried at claim time.

💡 Mediation/collaborative divorce typically costs $5–15K total. Litigated divorce often runs $30–100K+ EACH. Every dollar fought over is a dollar gone from the pie.`}),botconsumer:()=>({buildingId:"botconsumer",title:"🛡️ BotConsumer Protection — Your Rights as a Buyer",body:`When something goes wrong with a product, service, or financial company, the law has more on your side than most people realize.

📖 KEY FEDERAL AGENCIES:
• CFPB (Consumer Financial Protection Bureau) — banks, credit cards, debt collectors, mortgages, student loans. Complaints get formal responses within 60 days. Free, fast, effective.
• FTC (Federal Trade Commission) — scams, false ads, ID theft (IdentityTheft.gov), do-not-call list.
• FDA, USDA, CPSC — product safety.
• State Attorney General — your state's consumer-protection office.

📖 CREDIT CARD CHARGEBACKS (Fair Credit Billing Act):
Dispute unauthorized charges, undelivered goods, or "not as described" within 60 days of the statement. The card network handles it; merchant must prove the charge. Credit cards give MUCH stronger protection than debit cards here.

📖 DEBT COLLECTION (Fair Debt Collection Practices Act):
Collectors cannot:
• Call before 8am or after 9pm.
• Threaten arrest or wage garnishment they can't actually do.
• Contact you at work after you tell them to stop.
• Talk to third parties about your debt (except your attorney).
Demand a "validation letter" within 30 days — they must prove the debt is yours and accurate.

📖 STATUTE OF LIMITATIONS:
Debt becomes "time-barred" after 3–10 years (state-specific). Collectors can still ask, but can't successfully sue. CRITICAL: making even a partial payment or "acknowledging" the debt can RESET the clock.

📖 IDENTITY THEFT:
Freeze your credit at all 3 bureaus — free, takes 5 minutes each, unfreezing for a real application takes minutes. Single biggest preventive step.

📖 LEMON LAWS:
State-by-state, but most cover new (sometimes used) vehicles with persistent unfixable defects. Document every repair attempt.

💡 The complaint that gets a result is usually written, time-stamped, sent to the regulator AND the company at the same time, and asks for a specific remedy.`}),botads:()=>({buildingId:"botads",title:"📺 BotAds & Marketing — Spotting Persuasion Tricks",body:`The average American sees 4,000–10,000 ads per day. Knowing how they work makes you a better shopper.

📖 SCARCITY & URGENCY:
"Only 3 left at this price!" "Deal ends at midnight!" Even when the timer is fake (most are), the brain treats scarcity as a signal of value. Fix: any deal worth taking is worth waiting 24 hours on.

📖 SOCIAL PROOF:
"5-star rating from 12,000 reviewers." Fake-review networks are a billion-dollar industry. Use Fakespot/ReviewMeta, check the proportion of 5-star reviews dated in the same week, and read the 3-star reviews — they're usually honest.

📖 PRICE ANCHORING:
"$199 — was $499!" The $499 may have only existed for 1 day in the past 6 months to legitimize the "sale." CamelCamelCamel and Honey track real price history on Amazon.

📖 DECOY PRICING:
Small popcorn $4, large $8 — you'd pick small. Add a "medium $7.50" and suddenly large feels like a steal. The decoy isn't meant to sell — it's meant to make a target option look attractive.

📖 FREE TRIALS & DARK PATTERNS:
Easy to start, hard to cancel. Federal "Click-to-Cancel" rule (FTC, 2024) requires cancellation to be as easy as signup, BUT it's still being litigated. Check your statement monthly; subscription audits routinely save households $500–2,000/year.

📖 INFLUENCER DISCLOSURE (FTC):
Paid endorsements must be clearly labeled #ad or "Paid partnership." Buried hashtags don't count. Most violations aren't enforced — assume any positive influencer mention is paid.

📖 LOSS LEADERS:
Grocery stores sell milk/eggs at cost or loss to get you in the door, knowing you'll buy 15 other items. Aware shoppers buy ONLY the loss leader and walk out.

💡 The single best ad defense: wait 48 hours before any non-essential purchase over $50. Most "deals" lose their grip on you within a day.`}),botthrift:()=>({buildingId:"botthrift",title:"♻️ BotThrift & Resale — The Secondary Economy",body:`Buying used is the most underrated personal-finance hack — and selling used clears junk while funding wants.

📖 DEPRECIATION CURVES — WHERE TO BUY USED:
• Cars — lose 20% in year 1, ~60% by year 5. 2-4 year-old certified-preowned hits the sweet spot.
• Electronics — 30-50% off MSRP at refurb (Apple Refurbished, Back Market). Same warranty.
• Furniture — 50-80% off retail at estate sales, FB Marketplace, consignment.
• Books — used college texts can be 90% off, ABEbooks/ThriftBooks.
• Clothes — fast fashion already depreciated to zero; thrift + ThredUp/Poshmark for brands.

📖 WHERE NOT TO BUY USED:
• Mattresses, car seats, helmets, bike helmets (safety + sanitation).
• Tires (rubber ages even unused).
• Anything where verification is impossible and stakes are high.

📖 RESELLING — TAX RULES:
• Garage-sale rule: occasional sale of personal items at a LOSS isn't taxable (and the loss isn't deductible).
• Selling at a GAIN (collectibles, vintage that appreciated) — taxable.
• 2024 1099-K threshold: $20,000 AND 200 transactions for personal-payment apps; was scheduled to drop to $5,000 then $600 — moving target. Track basis on anything that might trigger.

📖 FLIPPING AS A SIDE HUSTLE:
Regular reselling → Schedule C self-employment income, subject to self-employment tax. Deduct inventory cost, mileage, shipping, platform fees. Use a separate bank account.

📖 ENVIRONMENTAL ANGLE:
Textile industry: ~10% of global carbon emissions, ~20% of wastewater. A used jacket has zero new-production footprint. The frugal choice and the green choice are usually the same.

💡 The 30-day used rule: if you can find it secondhand in 30 days, buy used; if not, then buy new.`}),botgiving:()=>({buildingId:"botgiving",title:"🎁 BotGiving Foundation — Charitable Giving That Actually Helps",body:`Giving well is harder than giving big. Here's the framework and the tax mechanics.

📖 EVALUATING CHARITIES:
• Form 990 — every US 501(c)(3) files this; public on ProPublica Nonprofit Explorer and Candid.
• Charity Navigator, GiveWell, ImpactMatters — independent ratings. GiveWell focuses on cost-per-life-saved math.
• Watch program ratio (% of expenses on programs vs admin/fundraising). 75%+ is healthy.

📖 TAX MECHANICS:
Charitable deductions only matter if you ITEMIZE (Schedule A). After TCJA bumped the standard deduction to $14,600 (2024 single) / $29,200 (joint), most households take the standard. To benefit:
• BUNCH 2-3 years of giving into one year to clear the standard deduction in that year.
• Use a DONOR-ADVISED FUND (Fidelity Charitable, Schwab Charitable, Vanguard Charitable) — deduct in the bunching year, grant out over multiple years.

📖 APPRECIATED STOCK > CASH:
Donating appreciated long-term stock = deduction at full FAIR MARKET VALUE + you skip the capital-gains tax you'd owe on selling. $10K of stock with $4K basis to charity → ~$10K deduction AND $6K of avoided gain. Cash giving forfeits this advantage.

📖 QUALIFIED CHARITABLE DISTRIBUTION (QCD):
70½+? Give directly from your IRA, up to $105K (2024). Counts toward Required Minimum Distribution, NOT taxable income. Best move available for retirees who give meaningfully.

📖 LIMITS:
Cash: 60% of AGI per year. Long-term appreciated stock: 30% of AGI. Excess carries forward 5 years.

📖 NOT DEDUCTIBLE:
• GoFundMe contributions to individuals (gift, not charity).
• Political contributions (federal or state).
• Value of volunteered time (mileage and out-of-pocket yes; hours no).

💡 The most efficient giving strategy for middle-income households: donate appreciated stock through a DAF every 2-3 years, bunching itemizable deductions, then sleep well.`}),botfintech:()=>({buildingId:"botfintech",title:"📱 BotFinTech Hub — Apps, Robos & BNPL",body:`Financial technology has put a private banker, broker, and accountant in everyone's pocket — for better and worse.

📖 ROBO-ADVISORS:
Betterment, Wealthfront, Schwab Intelligent Portfolios. Algorithm picks ETF allocation based on your risk profile, auto-rebalances, often tax-loss harvests. Fees ~0.25%/year — higher than DIY (0.05%) but cheaper than human advisors (1%). Worth it if you'd otherwise not invest at all or make emotional trades.

📖 NEOBANKS:
Chime, SoFi, Ally, Marcus. No branches → lower overhead → higher savings rates (often 4-5% vs 0.01% at megabanks). Confirm FDIC insurance (most pass through to partner banks; verify the partner).

📖 BUY NOW, PAY LATER (BNPL):
Afterpay, Klarna, Affirm. "4 payments, no interest." Real costs:
• You spend ~20-30% MORE on average when BNPL is offered (studies show).
• Missed payment → late fees, possible credit reporting.
• Returns/disputes are messy when split across providers.
• Soft credit pull at signup, but increasingly reporting to bureaus on missed payments.
Use only for things you'd buy in cash today AND can pay off as scheduled.

📖 PEER-TO-PEER PAYMENTS:
Venmo, Cash App, Zelle. Treat like cash — there's no chargeback if you send to the wrong person or get scammed. Zelle in particular has no fraud protection; reverse only by the recipient's choice.

📖 CRYPTO APPS:
Fractional buying lowers the floor but doesn't reduce volatility. Spreads on small-app crypto purchases are often 1-3% (vs 0.1% on a real exchange). Custody: not your keys, not your coins.

📖 SUBSCRIPTION CREEP:
Mint's old data: average US household carries $200-300/month in active subscriptions. Apps like Rocket Money, Trim, Truebill audit and cancel for a fee. Or just download your last 3 months of statements and scan.

💡 Best fintech rule of thumb: anything that makes spending FRICTIONLESS makes saving HARDER. Pick apps that match your actual goal.`}),botecon:()=>({buildingId:"botecon",title:"🧪 BotEcon Lab — GDP, Recessions & Business Cycles",body:`The economy looks chaotic up close. Step back and a few patterns repeat.

📖 GDP — GROSS DOMESTIC PRODUCT:
The dollar value of all final goods and services produced in a country in a year. C + I + G + (X − M):
• C — Consumption (household spending, ~68% of US GDP).
• I — Investment (business capex, housing, inventories).
• G — Government spending.
• (X − M) — Exports minus imports (net exports).
Reported QUARTERLY by the BEA, "real" GDP strips out inflation.

📖 BUSINESS CYCLE (NBER's 4 stages):
1. Expansion — output, jobs, profits rising.
2. Peak — economy at full capacity, often overheating.
3. Contraction / Recession — output and jobs falling.
4. Trough — bottom, before recovery.
US expansions have averaged ~5 years since WWII; recessions ~10 months.

📖 OFFICIAL RECESSION:
The NBER (a private nonprofit, but the official referee) calls recessions based on depth, diffusion, and duration of declines in payrolls, real income, industrial production, sales. The popular "two consecutive quarters of negative GDP" rule is convenient but not the official definition.

📖 LEADING / COINCIDENT / LAGGING:
• Leading — yield curve, stock market, building permits, manufacturers' new orders. Move BEFORE the economy.
• Coincident — payrolls, industrial production. Move WITH it.
• Lagging — unemployment rate, CPI. Confirm AFTER.

📖 UNEMPLOYMENT:
U-3 (the headline) excludes discouraged workers; U-6 includes them and underemployed. Both worth watching. Frictional (between jobs), structural (skills mismatch), cyclical (demand collapse) — only cyclical responds to stimulus.

📖 PHILLIPS CURVE:
Classic inverse relationship between unemployment and inflation. Broke down badly in the 1970s (stagflation) and again post-COVID. Useful concept, not law.

💡 You can't time the macro cycle, but you can be prepared: emergency fund, diversified portfolio, low fixed costs.`}),botforex:()=>({buildingId:"botforex",title:"💱 BotForex Exchange — Currencies & Global Money",body:`Foreign exchange is the largest market on earth: ~$7.5 trillion changes hands daily. Most of it isn't speculation — it's trade, hedging, and reserves.

📖 EXCHANGE RATES — TWO TYPES:
• Floating — set by supply and demand. USD, EUR, JPY, GBP, CAD, AUD.
• Pegged or managed — central bank holds the rate against another currency or basket. Hong Kong dollar pegged to USD; Chinese yuan managed.

📖 WHAT MOVES A FLOATING RATE:
• Interest-rate differentials — money flows toward higher real yields.
• Trade balances — exporters earn foreign currency, must convert.
• Inflation differentials — higher inflation erodes purchasing power → currency weakens.
• Risk-on / risk-off — USD, JPY, CHF are classic safe havens during stress.

📖 PURCHASING POWER PARITY (PPP):
Long-run idea: identical goods should cost similar amounts in any country once converted. The Economist's Big Mac Index is the famous illustration. Real exchange rates deviate from PPP for years but tend to revert over decades.

📖 USD AS RESERVE CURRENCY:
~58% of global central-bank reserves are USD. Most commodities priced in USD. ~85% of forex trades involve USD on one side. This gives the US an "exorbitant privilege" — cheaper borrowing — and is a recurring topic of debate.

📖 FOR REGULAR PEOPLE:
• Traveling? Foreign-transaction fees on most US cards are 1-3%; many travel cards waive them. ATM withdrawals abroad usually beat airport currency kiosks.
• Sending money? Wise, Remitly, OFX typically beat banks by 2-5% on midmarket rate.
• Investing? Unhedged international funds carry currency risk on top of stock risk. VXUS includes that. Hedged versions (e.g., HEFA) strip it out.

📖 RETAIL FOREX TRADING:
Leveraged forex (50:1, 100:1) is regulated in the US for a reason — most retail traders lose money. Treat it like a casino, not investing.

💡 The cheapest "forex trade" most people will ever do is using a no-foreign-transaction-fee card on their next trip.`}),bottrade:()=>({buildingId:"bottrade",title:"🌐 BotTrade Hall — Tariffs, Imports & Global Supply Chains",body:`Almost everything you own touched 3-5 countries before reaching you. Trade policy decides how expensive that is.

📖 TARIFFS:
A tax on imported goods, paid by the importer (who passes it through to the consumer). Often expressed as % of declared customs value. Used to:
• Raise revenue (less common today; pre-income-tax, tariffs were the federal government's main funding).
• Protect domestic industry (steel, semiconductors, EVs).
• Retaliate / negotiate (US-China tariff cycles).
Result: prices rise for consumers, some domestic jobs preserved, some trading partners retaliate.

📖 COMPARATIVE ADVANTAGE (Ricardo, 1817):
Even if Country A is better at producing EVERYTHING than Country B, both gain by specializing and trading. The classic econ argument FOR open trade. Critics note it ignores labor-market adjustment costs and strategic industries.

📖 TRADE BALANCE:
Exports − Imports. US has run a persistent goods-trade deficit since the 1970s, offset partly by services surplus and capital inflows. Deficit ≠ bad on its own — it reflects US households consuming more than producing AND foreigners eager to hold USD assets.

📖 HARMONIZED TARIFF SCHEDULE (HTS):
Every import is classified by a 10-digit code with a specific duty rate. Mis-classification is a common compliance issue for small importers. Section 301 (China), 232 (national security: steel, aluminum), 201 (safeguards: solar, washers) layer on top.

📖 SUPPLY CHAINS:
Post-COVID and US-China tensions accelerated:
• RESHORING — bringing production back to the US.
• NEARSHORING — moving to Mexico, Vietnam.
• FRIEND-SHORING — to allies (CHIPS Act, IRA incentives).
Shorter supply chains = higher cost, lower stockout risk.

📖 FREE TRADE AGREEMENTS:
USMCA (formerly NAFTA — US/Mexico/Canada), CPTPP (US dropped out), various bilaterals (Korea, Australia, Israel). FTAs reduce tariffs and harmonize rules among signatories.

💡 The next time a major tariff hits the news, watch the price of the affected category in your shopping cart within 6-12 months — that's where it lands.`}),botinflation:()=>({buildingId:"botinflation",title:"🎈 BotInflation Park — CPI, Wage Lag & Real Returns",body:`Inflation is the silent tax on every dollar that sits still. Understanding it changes how you invest, borrow, and save.

📖 CPI — CONSUMER PRICE INDEX:
The BLS surveys ~80,000 prices monthly across a basket of goods/services for urban consumers (CPI-U). Headline CPI vs CORE CPI (excludes food & energy because they're volatile). Year-over-year CPI is "the inflation rate" reported in headlines.

📖 BASKET ISSUES:
YOUR personal inflation differs from CPI. Healthcare-heavy households experience higher inflation; tech-heavy households experience lower (electronics deflate). PCE (Personal Consumption Expenditures) is the Fed's preferred gauge; it weights categories differently and updates faster.

📖 CAUSES (the textbook list):
• Demand-pull — too much money chasing too few goods.
• Cost-push — input costs (oil, wages, supply shocks) rise.
• Wage-price spirals — wages rise → costs rise → prices rise → wage demands rise.
• Monetary — sustained money-supply expansion outpacing real output (Friedman's view).
Most real-world episodes are a mix.

📖 NOMINAL vs REAL:
Real return ≈ nominal return − inflation. A 5% bond in a 3% inflation world earns ~2% real. The "money illusion" is treating a 6% raise during 8% inflation as a raise — it's a 2% pay CUT in real terms.

📖 WHO WINS / LOSES IN HIGH INFLATION:
LOSERS — cash holders, fixed-income retirees with non-inflation-adjusted pensions, lenders on fixed-rate loans.
WINNERS — borrowers paying back fixed loans with cheaper dollars (homeowners with 30-yr fixed mortgages locked at low rates), holders of TIPS / I-Bonds / commodities / equities (long-run), governments deflating their own debt.

📖 INFLATION-PROTECTED ASSETS:
• TIPS — principal indexed to CPI.
• I-Bonds — 6-month rate resets with CPI; $10K/year/person limit.
• Real estate (rents reset).
• Equities — long-run inflation hedge, but lag in early stages.

💡 Inflation isn't the same as cost-of-living. Your rent rising 8% when CPI is 3% is your reality, not "the data being wrong."`}),botpolicy:()=>({buildingId:"botpolicy",title:"🏛️ BotPolicyHall — How the Fed and Congress Move Money",body:`Two levers run most of the macro economy: monetary policy (Fed) and fiscal policy (Congress + Treasury). Knowing the difference helps you read every economic headline.

📖 MONETARY POLICY — THE FEDERAL RESERVE:
12 regional banks + Board of Governors + FOMC (Federal Open Market Committee). Three main tools:
• POLICY RATE (Fed Funds target) — the rate banks charge each other overnight. Raising it cascades into mortgage, credit-card, business-loan rates.
• OPEN-MARKET OPERATIONS — buying/selling Treasuries to add/drain reserves. QE (Quantitative Easing) = buy assets to push rates down. QT (Quantitative Tightening) = let assets roll off.
• RESERVE/IOR — interest on reserve balances; sets a floor on overnight rates.
DUAL MANDATE: maximum employment AND stable prices (~2% PCE inflation target).

📖 FISCAL POLICY — CONGRESS + TREASURY:
Taxes and spending. Affects demand directly. Examples:
• Stimulus checks (CARES Act, ARP) — direct cash injection.
• Tax cuts (TCJA 2017) — durable demand boost.
• Infrastructure spending (IIJA, IRA) — long-tail demand.
Fiscal policy is SLOW (Congress votes) and POLITICAL. Monetary is fast and technocratic.

📖 FEDERAL DEBT vs DEFICIT:
Deficit = annual shortfall (spending > revenue). Debt = cumulative deficits. US 2024 debt-to-GDP ~120%, similar to post-WWII peak. Debt isn't a household credit card — government rolls it forever — but interest payments now exceed defense spending.

📖 INTEREST-RATE EFFECTS:
• Higher rates → mortgages, autos, business borrowing more expensive → demand cools → inflation eases. Also: stocks under pressure (future earnings discounted harder), bonds repriced lower, USD usually strengthens.
• Lower rates → opposite.
This is why "Fed pivot" headlines move every asset class.

📖 INDEPENDENCE:
Fed chair appointed by President, confirmed by Senate, 4-year term. Designed to be insulated from short-term politics so it can raise rates when politicians wouldn't. Functions because Congress chooses not to override; in theory, it could.

📖 INTERNATIONAL ANALOGUES:
ECB (eurozone), BoE (UK), BoJ (Japan), PBoC (China). Different mandates — ECB is inflation-only; BoJ chases inflation up. Coordinated policy is rare; FX moves often reflect mismatched rate paths.

💡 When the Fed talks, every asset listens. When Congress talks, only directly affected industries usually do. That's why monetary policy gets more market attention than fiscal — but fiscal often matters more for the long-run economy.`}),moneybotnews:()=>({buildingId:"moneybotnews",title:"📰 MoneyBot News — Reading the Financial Headlines",body:`Welcome to MoneyBot News, where every ticker tells a story. Today's lesson: how to read financial news without panicking.

📖 SIGNAL vs NOISE:
Daily market moves are mostly noise. A single CPI print, a Fed Chair eyebrow, a viral tweet — these move prices hour-to-hour but rarely change the long-run picture. Investors who trade every headline usually underperform investors who don't.

📖 HEADLINE LITERACY:
• "Stocks plunge" usually means -1% to -2% (real plunges are -5%+).
• "Inflation cools" means the RATE of price increases slowed — prices are still going up.
• "Recession fears" sells clicks; actual recessions are declared months after they start by the NBER.
• "Record high" is normal — markets are supposed to make new highs over time.

📖 PRIMARY SOURCES BEAT PUNDITS:
FOMC statements, BLS releases, 10-Ks, earnings transcripts — all free, all faster than the cable rewrite. Bookmark them.

📖 CONFLICTS OF INTEREST:
Pundits often own what they pitch. Always check disclosures. "Buy this stock" from someone short the stock = different story than "buy this stock" from a long-term holder.

💡 Read the news to understand the world, not to time the market.`}),moneybotradio:()=>({buildingId:"moneybotradio",title:"📻 MoneyBot Radio 99.7 FM — Personal Finance, On Air",body:`You're tuned to MoneyBot Radio — all money, all day. Today's call-in topic: the personal-finance fundamentals that don't change no matter who's hosting.

📖 THE BORING TRUTH:
• Spend less than you earn.
• Build a 3–6 month emergency fund in a high-yield savings account.
• Pay off high-interest debt (credit cards, payday loans) before investing for growth.
• Max the employer 401(k) match — it's a 100% instant return.
• Use tax-advantaged accounts (Roth IRA, 401(k), HSA) before taxable brokerage.
• Invest in low-cost diversified index funds and don't touch them.

📖 ORDER OF OPERATIONS (most experts agree):
1. Tiny starter emergency fund ($1K).
2. 401(k) up to employer match.
3. Pay off high-interest debt.
4. Full emergency fund.
5. Max Roth IRA / HSA.
6. Max 401(k).
7. Taxable brokerage / extra mortgage / 529.

📖 RADIO HOST RED FLAGS:
• "This one weird trick" — there are no tricks.
• "Guaranteed returns above 6%" — that's the rough long-run real return of stocks, not a guarantee.
• "Buy gold/crypto/this private fund now" — anyone selling urgency is selling YOU.

📖 COMPOUNDING IS THE PLOT:
$500/mo invested at 7% real return for 40 years ≈ $1.2M. The first 10 years feel pointless. The last 10 years are 70% of the gain. Start NOW; the calendar does the heavy lifting.

💡 Boring wins. If your financial plan sounds exciting, it's probably wrong.`}),moneybotcomic:()=>({buildingId:"moneybotcomic",title:"💥 MoneyBot ComicShop — POW! BAM! Money Myths Busted",body:`Welcome to MoneyBot ComicShop! Step inside — today's issue: classic money myths get the superhero takedown.

💥 MYTH: "I'll start saving when I make more money."
💢 REALITY: Lifestyle inflation almost always absorbs raises. The habit matters more than the amount. $50/mo at 22 beats $500/mo at 42.

💥 MYTH: "Renting is throwing money away."
💢 REALITY: Owning has its own costs — property tax, insurance, maintenance (~1% of home value/year), repairs, closing costs (~6% to sell). Renting buys flexibility. Both can be the right answer.

💥 MYTH: "I have plenty of time — I'll invest later."
💢 REALITY: A 25-year-old investing $200/mo until 65 beats a 35-year-old investing $400/mo until 65. Time is the most expensive ingredient.

💥 MYTH: "Credit cards are bad."
💢 REALITY: Credit card DEBT is bad. Credit card USE — paid in full monthly — builds credit, earns rewards, and gives fraud protection. The card isn't the villain; the balance is.

💥 MYTH: "A house is the best investment."
💢 REALITY: Long-run home appreciation ~1% above inflation. S&P 500 ~7% above inflation. Houses are a place to live with leverage attached, not a portfolio.

💥 MYTH: "I need to beat the market."
💢 REALITY: 90%+ of active fund managers fail to beat their index over 15 years (SPIVA). Match the market with index funds and keep your time for life.

💥 MYTH: "Crypto/AI/this hot thing will make me rich."
💢 REALITY: Concentrated bets sometimes pay off and usually wipe out. Speculate with no more than you can lose. Build wealth with the boring stuff.

💡 The real superpower is patience. KAPOW!`}),militarybase:()=>({buildingId:"militarybase",title:"🪖 Anti-Broke Military Base — Defending Against BrokeBots",body:`Halt, citizen! Welcome to the Anti-Broke Military Base — BotCity's last line of defense against the scourge of BROKENESS and the dreaded BROKEBOTS.

📖 KNOW YOUR ENEMY — THE BROKEBOTS:
• LATTÉ-BOT: drains $7/day, $2,555/year, $25K/decade.
• SUBSCRIPTO: charges your card monthly for streaming services you forgot you had.
• MINIMUM-PAYMENT MENACE: turns a $3K credit-card balance into $7K over 10 years at 24% APR.
• BNPL-BOT: "4 easy payments" hides a debt habit. Multiple BNPLs = surprise insolvency.
• PAYDAY VAMPIRE: 400%+ APR on short-term loans. Re-borrow rate ~80%.
• LIFESTYLE INFLATOR: eats every raise before you notice.

📖 YOUR DEFENSE LOADOUT:
• EMERGENCY FUND (3–6 months of expenses) — your shield wall.
• AUTOMATED SAVINGS — pay yourself first, before BrokeBots get a look.
• HIGH-YIELD SAVINGS — your fund earns ~4–5% APY in 2024–25, not 0.01%.
• BUDGET — the radar; you can't defend what you can't see.
• INSURANCE (health/auto/renters/disability) — armor against one-shot KO events.
• DIVERSIFIED INVESTMENTS — siege engines that fight inflation over decades.

📖 RULES OF ENGAGEMENT:
• Never carry a credit-card balance month to month.
• Negotiate every recurring bill once a year.
• Audit subscriptions quarterly — kill the zombies.
• Sleep on any purchase >$100. Walk away from any purchase >$1,000 for 72 hours.
• Match every "want" expense with an equal transfer to savings — doubles the cost mentally, halves the impulse.

📖 BATTLE DRILL — IF YOU GET HIT:
Lost income? Pause investing (not retirement match if affordable), cut variable spend, draw from emergency fund, call lenders BEFORE you miss a payment — most will offer hardship plans.

💡 Brokeness isn't a personality trait — it's a BrokeBot infestation. Defend the perimeter. The Anti-Broke Brigade stands with you.`}),irs:({income:t,withheld:o,visitedBuildings:s})=>({buildingId:"irs",title:"📋 IRS Tax Office — File Your Return",body:s.includes("workcorp")?`You're ready to file your Form 1040!

You earned $${t.toLocaleString()} this year. You've identified your deductions and your employer withheld $${o.toLocaleString()} in taxes.

The IRS will calculate how much you actually owe based on your taxable income (after deductions) and compare it to what was withheld. If you overpaid — you get a REFUND! If you underpaid — you OWE the difference.

Ready to file your taxes and see your result?`:"You need to visit WorkCorp to earn income before you can file taxes!",action:s.includes("workcorp")?"file":void 0})},Gs=i.lazy(()=>O(()=>import("./NPCBots-BRV-2Wnf.js"),__vite__mapDeps([0,1,2]))),Hs=i.lazy(()=>O(()=>import("./CitizenBots-COx_pWMD.js"),__vite__mapDeps([3,1,2,4,5]))),$s=i.lazy(()=>O(()=>import("./Billboards-Drgv8npP.js"),__vite__mapDeps([6,1,2,4,5]))),Ys=i.lazy(()=>O(()=>import("./CityDetails-BfVu2koj.js"),__vite__mapDeps([7,1,2]))),Ws=i.lazy(()=>O(()=>import("./Statues-8QUN-aAE.js"),__vite__mapDeps([8,1,2,4,5]))),_s=i.lazy(()=>O(()=>import("./CityBuildings-DAfQazaO.js"),__vite__mapDeps([9,1,2]))),zs=i.lazy(()=>O(()=>import("./CityExpansion-BEax6koH.js"),__vite__mapDeps([10,1,2,4,5]))),Vs=i.lazy(()=>O(()=>import("./Landmarks-DVd8P27N.js"),__vite__mapDeps([11,1,2]))),Ks=i.lazy(()=>O(()=>import("./CityDistricts-CzayGaNg.js"),__vite__mapDeps([12,1,2,4,5]))),Xs=i.lazy(()=>O(()=>import("./CityDistrictsExtra-CakW4tTN.js"),__vite__mapDeps([13,1,2,4,5]))),qs=i.lazy(()=>O(()=>import("./NewDistricts-BO-2pwJC.js"),__vite__mapDeps([14,1,2,4,5]))),Js=i.lazy(()=>O(()=>import("./ExpansionQuarters-MttXgcRa.js"),__vite__mapDeps([15,1,2,4,5]))),Qs=i.lazy(()=>O(()=>import("./KioskDecor-cbVrbIuj.js"),__vite__mapDeps([16,1,2,4,5]))),Zs=i.lazy(()=>O(()=>import("./CityHallPlaza-D7XhLePa.js"),__vite__mapDeps([17,1,2]))),ea=i.lazy(()=>O(()=>import("./CityMedia-BVkcgtOI.js"),__vite__mapDeps([18,1,2,4,5]))),ta=i.lazy(()=>O(()=>import("./DistrictGateways-8gBSIjT6.js"),__vite__mapDeps([19,1,2]))),oa=i.lazy(()=>O(()=>import("./Particles-Ce7ihhU9.js"),__vite__mapDeps([20,1,2,4,5]))),sa=i.lazy(()=>O(()=>import("./Blimp-D2Im_Grq.js"),__vite__mapDeps([21,1,2]))),aa=i.lazy(()=>O(()=>import("./Streetscape-Slg0tGpM.js"),__vite__mapDeps([22,1,2]))),ra=i.lazy(()=>O(()=>import("./BuildingAccents-Al9GiRLm.js"),__vite__mapDeps([23,1,2]))),ia=i.lazy(()=>O(()=>import("./ObservationTower-J_GV8OxA.js"),__vite__mapDeps([24,1,2]))),na=i.lazy(()=>O(()=>import("./AmbientLife-BVNAMQBO.js"),__vite__mapDeps([25,1,2]))),la=i.lazy(()=>O(()=>import("./BotLand-gHY7vHXl.js"),__vite__mapDeps([26,1,2]))),ca=i.lazy(()=>O(()=>import("./GroundDetails-CcXtAQnI.js"),__vite__mapDeps([27,1,2,4,5]))),da=i.lazy(()=>O(()=>import("./StreetFurniture-DRrPGaD9.js"),__vite__mapDeps([28,1,2]))),ke=4.5;function ua({position:t,label:o,color:s}){const a=i.useRef(null),r=i.useRef(null);N(g=>{const E=g.clock.elapsedTime;if(a.current){const y=a.current.material;y.opacity=.35+Math.sin(E*2)*.15}if(r.current){r.current.scale.setScalar(1+Math.sin(E*3)*.18);const y=r.current.material;y.emissiveIntensity=2.2+Math.sin(E*3)*.8}});const[l,c,n]=t,p=22,f=c+p/2,x=c+p+.4;return e.jsxs("group",{children:[e.jsxs("mesh",{ref:a,position:[l,f,n],children:[e.jsx("cylinderGeometry",{args:[.18,.45,p,10,1,!0]}),e.jsx("meshBasicMaterial",{color:s,transparent:!0,opacity:.4,side:U,depthWrite:!1})]}),e.jsxs("mesh",{ref:r,position:[l,x,n],children:[e.jsx("sphereGeometry",{args:[.55,16,16]}),e.jsx("meshStandardMaterial",{color:s,emissive:s,emissiveIntensity:2.4,toneMapped:!1})]}),e.jsxs(Z,{position:[l,x+1.2,n],fontSize:.9,color:"#ffffff",anchorX:"center",anchorY:"middle",outlineWidth:.08,outlineColor:s,children:["🎓 ",o]})]})}function ha(){const[t,o]=i.useState(0);return i.useEffect(()=>{const s=[window.setTimeout(()=>o(1),150),window.setTimeout(()=>o(2),700),window.setTimeout(()=>o(3),1400),window.setTimeout(()=>o(4),2300),window.setTimeout(()=>o(5),3400)];return()=>s.forEach(a=>window.clearTimeout(a))},[]),t}function ma({stage:t}){return e.jsxs(i.Suspense,{fallback:null,children:[t>=1&&e.jsxs(e.Fragment,{children:[e.jsx(ca,{}),e.jsx(da,{}),e.jsx(Ys,{}),e.jsx(_s,{}),e.jsx(aa,{}),e.jsx($s,{})]}),t>=2&&e.jsxs(e.Fragment,{children:[e.jsx(zs,{}),e.jsx(qs,{}),e.jsx(Js,{}),e.jsx(ta,{}),e.jsx(Qs,{})]}),t>=3&&e.jsx(Ks,{}),t>=4&&e.jsxs(e.Fragment,{children:[e.jsx(Xs,{}),e.jsx(ra,{}),e.jsx(Zs,{}),e.jsx(ea,{}),e.jsx(la,{})]}),t>=5&&e.jsxs(e.Fragment,{children:[e.jsx(oa,{}),e.jsx(ia,{}),e.jsx(na,{}),e.jsx(sa,{}),e.jsx(Ws,{}),e.jsx(Vs,{}),e.jsx(Gs,{}),e.jsx(Hs,{})]})]})}function pa(){const t=i.useRef(new _(0,0,0)),o=i.useRef(!1),[s,a]=i.useState(null),r=i.useRef(null),{visitedBuildings:l,openDialog:c,income:n,deductions:p,withheld:f,dialog:x,weather:g}=S(),E=S(v=>v.editMode),y=ha(),u=ls(g),b=E?{color:"#0b1220",near:200,far:900,background:"#0b1220"}:u,C=S(v=>v.cityLayout),h=S(v=>v.selectedBuildingId),d=S(v=>v.hoverPos),m=i.useCallback(v=>{t.current.copy(v);const{cityLayout:L,selectedBuildingId:M,hoverPos:R}=S.getState();let k=null,I=1/0;for(const j of me){const[P,B]=pe(j.position,j.id,L,M,R),G=v.x-P,$=v.z-B,z=G*G+$*$;z<ke*ke&&z<I&&(k=j.id,I=z)}r.current!==k&&(r.current=k,a(k))},[]),A=i.useCallback(v=>{if(x)return;const{cityLayout:L,selectedBuildingId:M,hoverPos:R}=S.getState();for(const k of me){const[I,j]=pe(k.position,k.id,L,M,R),P=v.x-I,B=v.z-j;if(P*P+B*B<ke*ke){const G=Us[k.id];G&&c(G({income:n,deductions:p,withheld:f,visitedBuildings:l}));break}}},[x,c,n,p,f,l]),w=i.useMemo(()=>me.map(v=>{const[L,M]=pe(v.position,v.id,C,h,d);return{...v,position:[L,v.position[1],M],visited:l.includes(v.id),available:!0}}),[C,d,h,l]);return e.jsxs(e.Fragment,{children:[e.jsx(Ho,{}),e.jsx(Ko,{}),e.jsx("div",{className:"w-full h-screen",children:e.jsxs(Nt,{shadows:!1,camera:{position:[0,10,14],fov:55,near:.5,far:175},gl:{antialias:!1,powerPreference:"high-performance"},dpr:[.75,1],performance:{min:.35},onCreated:({gl:v})=>{v.setPixelRatio(Math.min(window.devicePixelRatio,1))},children:[e.jsx("color",{attach:"background",args:[b.background]}),e.jsx("fog",{attach:"fog",args:[b.color,b.near,b.far]}),e.jsx(js,{}),e.jsx("pointLight",{position:[0,8,0],intensity:2,color:"#fbbf24",distance:20}),e.jsx(No,{target:t}),e.jsx(os,{}),e.jsx(jo,{}),e.jsx(Ss,{}),e.jsx(Fs,{}),e.jsx(ns,{mode:g}),e.jsx(ms,{}),e.jsx(ma,{stage:y}),w.map(v=>e.jsx(oo,{data:v,playerPos:t.current,isNear:s===v.id},v.id)),e.jsx(ua,{position:[-47.25,8,-47.25],label:"MoneyBot U",color:"#fbbf24"}),e.jsx(no,{}),e.jsx(Qt,{onPositionChange:m,onInteract:A,isMoving:o})]})})]})}const Sa=Object.freeze(Object.defineProperty({__proto__:null,default:pa},Symbol.toStringTag,{value:"Module"}));export{yt as B,Sa as G,ba as L,Ut as M,xt as Q,ss as a,St as b,Ea as g,xa as p,X as r};
