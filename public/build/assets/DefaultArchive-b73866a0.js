import{j as r,d as a}from"./app-efa55958.js";import{G as d,E as x}from"./index-8eb40aa2.js";import{f as h}from"./helpers-01ad21a6.js";import{P as p}from"./components-6fa057e8.js";import{L as f,I as m}from"./inertia-chakra-link-overlay-fb1942d4.js";import{B as t}from"./chunk-PULVB27S-076b392b.js";import{H as u}from"./chunk-7OLJDQMT-7f99fc6b.js";import{T as n}from"./chunk-2OOHT3W5-8a8b58d4.js";import{S as g}from"./chunk-ZHMYA64R-2b67766a.js";import"./iconBase-93c9f5ca.js";import"./chunk-W7WUSNWJ-1d37fd26.js";import"./chunk-3ASUQ6PA-f62de13d.js";import"./chunk-NABYTFTG-9c5cf35d.js";import"./chunk-UVUR7MCU-f950a53f.js";import"./objectWithoutPropertiesLoose-4f48578a.js";import"./defineProperty-0e4f3c13.js";import"./chunk-ROURZMX4-1c85f1b1.js";import"./chunk-3XANSPY5-cf37bc50.js";import"./chunk-RAWN7VJ3-58bfc8aa.js";import"./chunk-4FCEGNGT-53b0de1a.js";import"./chunk-6NHXDBFO-987cde81.js";import"./chunk-6CVSDS6C-e8322ee8.js";import"./chunk-QINAG4RG-420d55bb.js";import"./chunk-SPIKMR6I-154a1106.js";import"./chunk-R3DH46PF-f0689d26.js";import"./chunk-G72KV6MB-dbbc8cf4.js";const j=({posts:e,headingColor:o,textColor:s})=>!e||e.length<=0?"No posts found":e.map(i=>{const l=i.media.filter(c=>c.collection_name==="post-featured-image")[0];return r.jsx(y,{post:i,featured_image:l,headingColor:o,textColor:s})}),J=j,y=({post:e,featured_image:o,headingColor:s,textColor:i})=>r.jsx(d,{as:"article",spacing:4,role:"group",shadow:"xl",maxW:"2xl",children:r.jsxs(f,{children:[r.jsx(t,{children:r.jsx(m,{as:a,href:`/category/${e.category.slug}/${e.slug}`,children:o&&r.jsx(p,{height:"200px",borderRadius:"0.75rem 0.75rem 0 0",overflow:"hidden",_groupHover:{transition:"transform 0.4s ease-in-out",borderRadius:"0.75rem 0.75rem 0 0",cusrsor:"pointer"},src:o&&o.original_url})})}),r.jsxs(t,{p:[4,8],children:[r.jsxs(t,{children:[r.jsx(u,{as:"h3",color:s,fontSize:"md",fontWeight:"semibold",mb:4,children:r.jsx(m,{as:a,href:`/category/${e.category.slug}/${e.slug}`,className:"primary-link",children:e.title})}),r.jsx(n,{fontSize:"sm",color:i,noOfLines:3,children:e.excerpt})]}),r.jsx(t,{mt:"4",children:r.jsxs(g,{justify:"space-between",direction:{base:"column",sm:"row"},alignItems:"center",children:[r.jsx(n,{as:"time",fontSize:"xs",color:i,dangerouslySetInnerHTML:{__html:h(e.published_at)}}),r.jsx(a,{href:`/category/${e.category.slug}/${e.slug}`,children:r.jsx(x,{size:"xs",text:"Read more","aria-label":"Read More",colorScheme:"gray",w:"full"})})]})})]})]})},e.id);export{J as default};