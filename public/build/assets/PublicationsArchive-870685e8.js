import{j as r,c as x,u as c,d as h}from"./app-b86f65ba.js";import u from"./CategoryLayout-9f0a5891.js";import{S as f}from"./section-015a4036.js";import{S as a}from"./sidebarWidget-42c67029.js";import{M as g,S as j}from"./MainLayout-8b879509.js";import{M as b}from"./MultiItemCarousel-ceafbbc2.js";import{G as S}from"./index-e094949b.js";import{W as k}from"./Head-5716655f.js";import{T as w}from"./chunk-2OOHT3W5-264de18c.js";import{V as _}from"./chunk-NTCQBYKE-9550ce1a.js";import{S as s}from"./chunk-ZHMYA64R-3bf5ed2b.js";import{G as m}from"./chunk-ZPFGWTBB-77e3f6df.js";import{G as C}from"./chunk-JARCRF6W-d15390c1.js";import{B as W}from"./chunk-PULVB27S-40ef37d8.js";import{u as v}from"./chunk-KC77MHL3-371d887a.js";import"./pattern-box-2a8b460c.js";import"./chunk-QINAG4RG-a0760f00.js";import"./chunk-SPIKMR6I-87968274.js";import"./chunk-7OLJDQMT-7196af02.js";import"./helpers-01ad21a6.js";import"./chunk-GOJLRND4-2cc4de57.js";import"./chunk-W7WUSNWJ-3fd59087.js";import"./chunk-KRPLQIP4-df7f6101.js";import"./chunk-7JBTTEVG-9365ebe1.js";import"./chunk-UVUR7MCU-0c7d985a.js";import"./chunk-6QYXN73V-7615980f.js";import"./chunk-NEK3OOAM-d200d7df.js";import"./chunk-G72KV6MB-ad524ee2.js";import"./chunk-GB67EJMB-24180019.js";import"./chunk-DEQZ7DVA-fac225a3.js";import"./index.esm-0ae8b27f.js";import"./iconBase-c9b4a822.js";import"./chunk-CWVAJCXJ-a54a50bc.js";import"./chunk-6CVSDS6C-435f6bfb.js";import"./index-979d1106.js";import"./chunk-5LTIYV3A-c0d0565c.js";import"./chunk-3ASUQ6PA-69bb8c21.js";import"./chunk-5ZQ6B3SW-32c7ef0f.js";import"./chunk-46CXQZ4E-db7bdb29.js";import"./chunk-KICXRNWJ-cce62d2f.js";import"./chunk-3XANSPY5-cf37bc50.js";import"./index-895fc961.js";import"./index-129ac873.js";import"./chunk-4FCEGNGT-9c7451d9.js";import"./chunk-6NHXDBFO-987cde81.js";import"./chunk-NABYTFTG-cb5b4537.js";import"./objectWithoutPropertiesLoose-4f48578a.js";import"./defineProperty-0e4f3c13.js";import"./chunk-ROURZMX4-1c85f1b1.js";import"./chunk-65IR7CTH-f417bf63.js";import"./chunk-VXCSBZ7K-70508aba.js";import"./chunk-57I6FYPZ-cada06a1.js";import"./inertia-chakra-link-overlay-fa65dfaf.js";import"./chunk-RAWN7VJ3-3fa0066e.js";import"./chunk-R3DH46PF-f0689d26.js";var p=i=>r.jsx(x.div,{className:"chakra-stack__divider",...i,__css:{...i.__css,borderWidth:0,alignSelf:"stretch",borderColor:"inherit",width:"auto",height:"auto"}});p.displayName="StackDivider";function Ar({category:i,infocus:t,sawteeInMedia:e,publications:o,showSubscriptionBox:l=!0}){const n=c("rgba(12, 17, 43, 0.8)","whiteAlpha.800"),d=v([1,2,3]);return r.jsxs(g,{children:[r.jsx(k,{title:"SAWTEE | "+i.meta_title,description:i.meta_description,image:i.featured_image?i.featured_image.original_url:"/assets/logo-sawtee.webp"}),r.jsx(u,{showBackgroundPattern:!1,image:"/assets/publications-1-resized.jpg",category:i,headingColor:"white",children:r.jsx(f,{pb:"80px",py:{base:"24px",lg:"80px"},px:{base:"16px",lg:"40px"},size:"full",mx:"auto",pt:"50px",fontSize:["md","lg","xl","huge"],color:n,children:r.jsxs(C,{templateColumns:{base:"1fr",xl:"repeat(5, 1fr)"},gap:20,pos:"relative",placeContent:"center",children:[r.jsx(m,{colSpan:{base:1,xl:3},px:4,children:i.children&&r.jsx(y,{category:i,publications:o,show:d||3})}),r.jsxs(m,{colSpan:{base:1,xl:2},as:_,spacing:12,className:"sidebar",children:[e&&r.jsx(a,{array:e,title:"SAWTEE in Media",link:"/category/sawtee-in-media",maxW:"xl"}),t&&r.jsx(a,{array:t,title:"Infocus",link:"/category/infocus",maxW:"xl"}),l&&r.jsx(S,{py:"4",px:"8",rounded:"xl",maxW:"xl",height:"max-content",children:r.jsx(j,{})})]})]})})})]})}const y=({category:i,publications:t,show:e})=>r.jsx(s,{divider:r.jsx(p,{borderColor:"gray.200"}),spacing:"60px",children:i.children.map(o=>r.jsxs(s,{spacing:"4",children:[r.jsx(w,{as:"h3",id:`#${o.name}`,m:"0 0 2rem 0",fontSize:{base:"xl",lg:"2xl"},fontFamily:"heading",fontWeight:"bold",color:"var(--color-text)",children:r.jsx(h,{title:`View All ${o.name}`,href:`/category/publications/${o.slug}`,children:o.name})}),r.jsx(W,{w:"full",children:r.jsx(b,{slides:t[o.slug],itemsToShow:e})})]},o.name))});export{Ar as default};
