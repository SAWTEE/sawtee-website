import{r as t,V as E}from"./app-efa55958.js";function b(e){return e!=null&&typeof e=="object"&&"nodeType"in e&&e.nodeType===Node.ELEMENT_NODE}function I(e){var n;return b(e)&&(n=e.ownerDocument)!=null?n:document}function k(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}var w=k(),P=w?t.useLayoutEffect:t.useEffect;function m(e,n=[]){const o=t.useRef(e);return P(()=>{o.current=e}),t.useCallback((...c)=>{var a;return(a=o.current)==null?void 0:a.call(o,...c)},n)}function y(e,n){const o=t.useId();return t.useMemo(()=>e||[n,o].filter(Boolean).join("-"),[e,n,o])}function g(e,n){const o=e!==void 0;return[o,o&&typeof e<"u"?e:n]}function R(e={}){const{onClose:n,onOpen:o,isOpen:c,id:a}=e,r=m(o),i=m(n),[v,p]=t.useState(e.defaultIsOpen||!1),[s,u]=g(c,v),C=y(a,"disclosure"),d=t.useCallback(()=>{s||p(!1),i==null||i()},[s,i]),f=t.useCallback(()=>{s||p(!0),r==null||r()},[s,r]),O=t.useCallback(()=>{(u?d:f)()},[u,f,d]);return{isOpen:!!u,onOpen:f,onClose:d,onToggle:O,isControlled:s,getButtonProps:(l={})=>({...l,"aria-expanded":u,"aria-controls":C,onClick:E(l.onClick,O)}),getDisclosureProps:(l={})=>({...l,hidden:!u,id:C})}}export{m as a,I as g,R as u};
