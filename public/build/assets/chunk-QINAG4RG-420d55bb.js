import{f as u,j as c,c as h}from"./app-efa55958.js";import{u as x,s as y}from"./chunk-SPIKMR6I-154a1106.js";var l=u(function(r,a){const{htmlWidth:e,htmlHeight:o,alt:s,...i}=r;return c.jsx("img",{width:e,height:o,ref:a,alt:s,...i})});l.displayName="NativeImage";function w(t,r=[]){const a=Object.assign({},t);for(const e of r)e in a&&delete a[e];return a}var S=u(function(r,a){const{fallbackSrc:e,fallback:o,src:s,srcSet:i,align:b,fit:k,loading:n,ignoreFallback:I,crossOrigin:m,fallbackStrategy:j="beforeLoadOrError",referrerPolicy:v,...g}=r,F=e!==void 0||o!==void 0,f=n!=null||I||!F,N=x({...r,crossOrigin:m,ignoreFallback:f}),p=y(N,j),d={ref:a,objectFit:k,objectPosition:b,...f?g:w(g,["onError","onLoad"])};return p?o||c.jsx(h.img,{as:l,className:"chakra-image__placeholder",src:e,...d}):c.jsx(h.img,{as:l,src:s,srcSet:i,crossOrigin:m,loading:n,referrerPolicy:v,className:"chakra-image",...d})});S.displayName="Image";export{S as I};
