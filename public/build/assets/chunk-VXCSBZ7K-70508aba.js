import{u as a}from"./chunk-57I6FYPZ-cada06a1.js";import{s as c,j as b}from"./app-b86f65ba.js";function d(e){const{breakpoint:n,hide:i,children:s,ssr:r}=e,[o]=a(n,{ssr:r});return(i?!o:o)?s:null}var l=(e,n)=>{var i,s;return(s=(i=e==null?void 0:e.breakpoints)==null?void 0:i[n])!=null?s:n};function p(e){const{breakpoint:n="",below:i,above:s}=e,r=c(),o=l(r,i),u=l(r,s);let t=n;return o?t=`(max-width: ${o})`:u&&(t=`(min-width: ${u})`),t}function h(e){const{children:n,ssr:i}=e,s=p(e);return b.jsx(d,{breakpoint:s,ssr:i,children:n})}h.displayName="Show";export{h as S};
