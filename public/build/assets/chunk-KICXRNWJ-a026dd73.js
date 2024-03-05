import{i as ae}from"./chunk-3XANSPY5-cf37bc50.js";import{u as le,a as ce,c as L}from"./index-ba18a0bd.js";import{u as J}from"./index-01a9cce7.js";import{m as ue}from"./chunk-UVUR7MCU-f950a53f.js";import{r,J as E,c as y,B as de,f as pe,h as fe,o as me,s as ge,P as we,j as a,z as ve,Q as Pe}from"./app-efa55958.js";function he(e){const t=e.ownerDocument.defaultView||window,{overflow:o,overflowX:i,overflowY:c}=t.getComputedStyle(e);return/auto|scroll|overlay|hidden/.test(o+c+i)}function be(e){return e.localName==="html"?e:e.assignedSlot||e.parentElement||e.ownerDocument.documentElement}function U(e){return["html","body","#document"].includes(e.localName)?e.ownerDocument.body:ae(e)&&he(e)?e:U(be(e))}var ye={exit:{scale:.85,opacity:0,transition:{opacity:{duration:.15,easings:"easeInOut"},scale:{duration:.2,easings:"easeInOut"}}},enter:{scale:1,opacity:1,transition:{opacity:{easings:"easeOut",duration:.2},scale:{duration:.2,ease:[.175,.885,.4,1.1]}}}},Q=e=>{var t;return((t=e.current)==null?void 0:t.ownerDocument)||document},z=e=>{var t,o;return((o=(t=e.current)==null?void 0:t.ownerDocument)==null?void 0:o.defaultView)||window};function Ce(e={}){const{openDelay:t=0,closeDelay:o=0,closeOnClick:i=!0,closeOnMouseDown:c,closeOnScroll:B,closeOnPointerDown:C=c,closeOnEsc:m=!0,onOpen:T,onClose:V,placement:O,id:D,isOpen:W,defaultIsOpen:F,arrowSize:g=10,arrowShadowColor:_,arrowPadding:M,modifiers:H,isDisabled:w,gutter:k,offset:f,direction:$,...v}=e,{isOpen:s,onOpen:P,onClose:h}=le({isOpen:W,defaultIsOpen:F,onOpen:T,onClose:V}),{referenceRef:j,getPopperProps:u,getArrowInnerProps:Z,getArrowProps:ee}=ce({enabled:s,placement:O,arrowPadding:M,modifiers:H,gutter:k,offset:f,direction:$}),oe=r.useId(),S=`tooltip-${D??oe}`,d=r.useRef(null),x=r.useRef(),b=r.useCallback(()=>{x.current&&(clearTimeout(x.current),x.current=void 0)},[]),I=r.useRef(),N=r.useCallback(()=>{I.current&&(clearTimeout(I.current),I.current=void 0)},[]),R=r.useCallback(()=>{N(),h()},[h,N]),X=ke(d,R),A=r.useCallback(()=>{if(!w&&!x.current){s&&X();const n=z(d);x.current=n.setTimeout(P,t)}},[X,w,s,P,t]),l=r.useCallback(()=>{b();const n=z(d);I.current=n.setTimeout(R,o)},[o,R,b]),Y=r.useCallback(()=>{s&&i&&l()},[i,l,s]),q=r.useCallback(()=>{s&&C&&l()},[C,l,s]),ne=r.useCallback(n=>{s&&n.key==="Escape"&&l()},[s,l]);J(()=>Q(d),"keydown",m?ne:void 0),J(()=>{const n=d.current;if(!n)return null;const p=U(n);return p.localName==="body"?z(d):p},"scroll",()=>{s&&B&&R()},{passive:!0,capture:!0}),r.useEffect(()=>{w&&(b(),s&&h())},[w,s,h,b]),r.useEffect(()=>()=>{b(),N()},[b,N]),J(()=>d.current,"pointerleave",l);const te=r.useCallback((n={},p=null)=>({...n,ref:ue(d,p,j),onPointerEnter:E(n.onPointerEnter,ie=>{ie.pointerType!=="touch"&&A()}),onClick:E(n.onClick,Y),onPointerDown:E(n.onPointerDown,q),onFocus:E(n.onFocus,A),onBlur:E(n.onBlur,l),"aria-describedby":s?S:void 0}),[A,l,q,s,S,Y,j]),re=r.useCallback((n={},p=null)=>u({...n,style:{...n.style,[L.arrowSize.var]:g?`${g}px`:void 0,[L.arrowShadowColor.var]:_}},p),[u,g,_]),se=r.useCallback((n={},p=null)=>{const G={...n.style,position:"relative",transformOrigin:L.transformOrigin.varRef};return{ref:p,...v,...n,id:S,role:"tooltip",style:G}},[v,S]);return{isOpen:s,show:A,hide:l,getTriggerProps:te,getTooltipProps:se,getTooltipPositionerProps:re,getArrowProps:ee,getArrowInnerProps:Z}}var K="chakra-ui:close-tooltip";function ke(e,t){return r.useEffect(()=>{const o=Q(e);return o.addEventListener(K,t),()=>o.removeEventListener(K,t)},[t,e]),()=>{const o=Q(e),i=z(e);o.dispatchEvent(new i.CustomEvent(K))}}function xe(e,t=[]){const o=Object.assign({},e);for(const i of t)i in o&&delete o[i];return o}function Ee(e,t){const o={};for(const i of t)i in e&&(o[i]=e[i]);return o}var Te=y(de.div),Oe=pe((e,t)=>{var o,i;const c=fe("Tooltip",e),B=me(e),C=ge(),{children:m,label:T,shouldWrapChildren:V,"aria-label":O,hasArrow:D,bg:W,portalProps:F,background:g,backgroundColor:_,bgColor:M,motionProps:H,...w}=B,k=(i=(o=g??_)!=null?o:W)!=null?i:M;if(k){c.bg=k;const u=we(C,"colors",k);c[L.arrowBg.var]=u}const f=Ce({...w,direction:C.direction}),$=typeof m=="string"||V;let v;if($)v=a.jsx(y.span,{display:"inline-block",tabIndex:0,...f.getTriggerProps(),children:m});else{const u=r.Children.only(m);v=r.cloneElement(u,f.getTriggerProps(u.props,u.ref))}const s=!!O,P=f.getTooltipProps({},t),h=s?xe(P,["role","id"]):P,j=Ee(P,["role","id"]);return T?a.jsxs(a.Fragment,{children:[v,a.jsx(ve,{children:f.isOpen&&a.jsx(Pe,{...F,children:a.jsx(y.div,{...f.getTooltipPositionerProps(),__css:{zIndex:c.zIndex,pointerEvents:"none"},children:a.jsxs(Te,{variants:ye,initial:"exit",animate:"enter",exit:"exit",...H,...h,__css:c,children:[T,s&&a.jsx(y.span,{srOnly:!0,...j,children:O}),D&&a.jsx(y.div,{"data-popper-arrow":!0,className:"chakra-tooltip__arrow-wrapper",children:a.jsx(y.div,{"data-popper-arrow-inner":!0,className:"chakra-tooltip__arrow",__css:{bg:c.bg}})})]})})})})]}):a.jsx(a.Fragment,{children:m})});Oe.displayName="Tooltip";export{Oe as T};
