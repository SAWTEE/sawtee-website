import{k as f,f as n,l as x,o as S,j as i,c,I as g}from"./app-efa55958.js";import{g as v}from"./chunk-ZHMYA64R-2b67766a.js";var[h,d]=f({name:"ListStylesContext",errorMessage:`useListStyles returned is 'undefined'. Seems you forgot to wrap the components in "<List />" `}),a=n(function(s,e){const t=x("List",s),{children:o,styleType:y="none",stylePosition:m,spacing:l,...L}=S(s),u=v(o),p=l?{["& > *:not(style) ~ *:not(style)"]:{mt:l}}:{};return i.jsx(h,{value:t,children:i.jsx(c.ul,{ref:e,listStyleType:y,listStylePosition:m,role:"list",__css:{...t.container,...p},...L,children:u})})});a.displayName="List";var j=n((r,s)=>{const{as:e,...t}=r;return i.jsx(a,{ref:s,as:"ol",styleType:"decimal",marginStart:"1em",...t})});j.displayName="OrderedList";var I=n(function(s,e){const{as:t,...o}=s;return i.jsx(a,{ref:e,as:"ul",styleType:"initial",marginStart:"1em",...o})});I.displayName="UnorderedList";var _=n(function(s,e){const t=d();return i.jsx(c.li,{ref:e,...s,__css:t.item})});_.displayName="ListItem";var C=n(function(s,e){const t=d();return i.jsx(g,{ref:e,role:"presentation",...s,__css:t.icon})});C.displayName="ListIcon";export{a as L,_ as a};
