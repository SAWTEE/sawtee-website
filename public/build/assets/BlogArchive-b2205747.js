import{j as e,u as b}from"./app-efa55958.js";import{a as y}from"./helpers-01ad21a6.js";import{P as v}from"./PostPreviewCard-80c7b5d9.js";import{a as C,b as x,c,d as p,e as h,S}from"./components-6fa057e8.js";import{P as g}from"./post-categories-e66c2bf4.js";import{F as m}from"./chunk-KRPLQIP4-2070ff1c.js";import{B as a}from"./chunk-PULVB27S-076b392b.js";import{L as u,a as f}from"./inertia-chakra-link-overlay-fb1942d4.js";import{H as A}from"./chunk-7OLJDQMT-7f99fc6b.js";import{S as B}from"./chunk-NEK3OOAM-a48a721b.js";import"./index-8eb40aa2.js";import"./iconBase-93c9f5ca.js";import"./chunk-W7WUSNWJ-1d37fd26.js";import"./chunk-2OOHT3W5-8a8b58d4.js";import"./chunk-R3DH46PF-f0689d26.js";import"./chunk-3ASUQ6PA-f62de13d.js";import"./chunk-ZHMYA64R-2b67766a.js";import"./chunk-G72KV6MB-dbbc8cf4.js";import"./chunk-NABYTFTG-9c5cf35d.js";import"./chunk-UVUR7MCU-f950a53f.js";import"./objectWithoutPropertiesLoose-4f48578a.js";import"./defineProperty-0e4f3c13.js";import"./chunk-ROURZMX4-1c85f1b1.js";import"./chunk-3XANSPY5-cf37bc50.js";import"./chunk-RAWN7VJ3-58bfc8aa.js";import"./chunk-4FCEGNGT-53b0de1a.js";import"./chunk-6NHXDBFO-987cde81.js";import"./chunk-6CVSDS6C-e8322ee8.js";import"./chunk-QINAG4RG-420d55bb.js";import"./chunk-SPIKMR6I-154a1106.js";import"./chunk-JARCRF6W-6766cdec.js";function j(){let t=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e"];function o(l){for(let d=0;d<6;d++){let P=Math.round(Math.random()*14),w=t[P];l+=w}return l}let s=o("#"),r=o("#");return"linear-gradient("+Math.round(Math.random()*240)+"deg, "+s+", "+r+")"}const G=({data:t,...o})=>{const{title:s,category:r,featured_media:i,link:n}=t;return e.jsx(u,{...o,children:e.jsxs(C,{bgImage:j(),role:"group",children:[e.jsx(x,{}),e.jsx(c,{...i}),e.jsxs(p,{children:[e.jsx(f,{href:n,children:e.jsx(h,{children:s})}),r.length>0&&e.jsx(g,{category:r,justifyContent:"center",w:"full"})]})]})})},I=({data:t,...o})=>{const{title:s,category:r,link:i,featured_media:n}=t;return e.jsx(u,{flex:"1",rounded:o.rounded?o.rounded:"none",overflow:"hidden",...o,children:e.jsxs(S,{bgImage:j(),role:"group",alignItems:"center",children:[e.jsx(x,{}),e.jsx(c,{...n}),e.jsxs(p,{padding:"40px",textAlign:"left",mt:"0",children:[r.length>0&&e.jsx(g,{zIndex:50,justifyContent:"flex-start",category:r}),e.jsx(f,{href:i,children:e.jsx(h,{as:"h2",mt:"auto",fontSize:"1.65rem",children:s})})]})]})})},k=({data:t,...o})=>t.length>2&&e.jsxs(m,{as:"section",direction:{base:"column",lg:"row"},gap:"2",rowGap:8,bg:"transparent",...o,children:[e.jsx(a,{width:{base:"100%",lg:"65%"},flexGrow:"1",children:e.jsx(G,{data:t[0],rounded:"xl",overflow:"hidden"})}),e.jsx(m,{direction:{base:"column",md:"row",lg:"column"},width:{base:"100%",lg:"35%"},flexGrow:"1",gap:"2",rowGap:8,children:t.map((s,r)=>{if(r>0&&r<t.length)return e.jsx(I,{data:s,rounded:"xl",overflow:"hidden"},s.id)})})]}),M=({posts:t})=>{const[o,s]=y(t);return e.jsxs(a,{as:"section",children:[e.jsx(k,{data:o}),e.jsxs(a,{py:{base:"64px",md:"80px"},px:{base:"24px",md:"40px"},width:{base:"auto",lg:"80%"},maxWidth:"1200px",mx:"auto",children:[e.jsx(A,{as:"h3",textTransform:"uppercase",textAlign:"center",fontSize:{base:"4xl",md:"6xl"},color:b("accent.400","accent.50"),children:"Latest Blog Posts"}),e.jsx(B,{mt:{base:"64px",md:"80px"},columns:{base:1,md:2},spacing:"40px",children:s.map((r,i)=>e.jsx(v,{showImage:!1,data:r,color:"gray.700",_dark:{color:"whiteAlpha.700"},rounded:"xl"},r.id))})]})]})},de=M;export{de as default};
