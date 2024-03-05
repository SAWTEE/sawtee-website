import{r as f,W as D,j as e,a as P,A as q,b as H,e as N,g as V}from"./app-efa55958.js";import W from"./AuthenticatedLayout-f593e457.js";import{G as O}from"./index-8eb40aa2.js";import{P as U}from"./PrimaryButton-63ebb02b.js";import{C as J}from"./MultiSelect-4c8dfdbf.js";import K from"./CreateMenuForm-19e00fa3.js";import Q from"./DeleteMenuForm-5a2ea48a.js";import{T as F,a as T}from"./TableActions-765c1289.js";import X from"./EditMenuItem-d7a1a57f.js";import{G as Y}from"./chunk-JARCRF6W-6766cdec.js";import{L as w,a as L}from"./chunk-46CXQZ4E-4977f9fb.js";import{T as B}from"./chunk-2OOHT3W5-8a8b58d4.js";import{V as Z}from"./chunk-NTCQBYKE-db626ce2.js";import{H as S}from"./chunk-3ASUQ6PA-f62de13d.js";import{G as _}from"./chunk-ZPFGWTBB-5ba3fc59.js";import{B as I}from"./chunk-PULVB27S-076b392b.js";import{A as $,a as ee,b as te,c as re,d as se}from"./chunk-CRBMUVJA-dd564ac7.js";import{u as E}from"./chunk-7JBTTEVG-dc1f3de8.js";import{u as y}from"./chunk-5LTIYV3A-a216305e.js";import{B as M}from"./chunk-UVUR7MCU-f950a53f.js";import{S as R}from"./chunk-3RSXBRAN-bbea2ba3.js";import{F as C,I as k}from"./chunk-6CVSDS6C-e8322ee8.js";import{F as v}from"./chunk-GCOAS5YC-b63ccf93.js";import"./index.esm-e20009f6.js";import"./iconBase-93c9f5ca.js";import"./Header-b82d824c.js";import"./chunk-GB67EJMB-31fceaa8.js";import"./chunk-SPIKMR6I-154a1106.js";import"./chunk-DEQZ7DVA-e22fe2bd.js";import"./chunk-KRPLQIP4-2070ff1c.js";import"./chunk-VXCSBZ7K-e8c56e53.js";import"./chunk-57I6FYPZ-4990f36c.js";import"./chunk-2ZHRCML3-86ac23ee.js";import"./chunk-FKYN3ZGE-f31ed73d.js";import"./chunk-ZHMYA64R-2b67766a.js";import"./chunk-G72KV6MB-dbbc8cf4.js";import"./chunk-R3DH46PF-f0689d26.js";import"./chunk-UZJ3TPNQ-b2d78fd3.js";import"./chunk-OCNORRQU-3e952216.js";import"./chunk-ROURZMX4-1c85f1b1.js";import"./chunk-3XANSPY5-cf37bc50.js";import"./index-ba18a0bd.js";import"./index-01a9cce7.js";import"./index-4647d92d.js";import"./chunk-6QYXN73V-98651dd0.js";import"./Sidebar-7bd11e29.js";import"./chunk-QINAG4RG-420d55bb.js";import"./DrawerMenu-6b99c556.js";import"./chunk-65IR7CTH-afe037a9.js";import"./chunk-NABYTFTG-9c5cf35d.js";import"./objectWithoutPropertiesLoose-4f48578a.js";import"./defineProperty-0e4f3c13.js";import"./chunk-6NHXDBFO-987cde81.js";import"./chunk-W7WUSNWJ-1d37fd26.js";import"./chunk-7OLJDQMT-7f99fc6b.js";import"./chunk-RAWN7VJ3-58bfc8aa.js";import"./chunk-4FCEGNGT-53b0de1a.js";import"./createSuper-0a89e92d.js";import"./chunk-KC77MHL3-45b95fd3.js";import"./chunk-5ZQ6B3SW-100d0584.js";import"./chunk-RKXMPHPI-3dbbc512.js";function jt({auth:h,categories:l,menus:o,pages:a,desiredMenu:d,menuItems:x}){const{isOpen:c,onOpen:j,onClose:p}=E(),u=E(),[t,m]=f.useState([]),[r,n]=f.useState([]),[s,g]=f.useState(null);y();const{get:b,delete:ie,processing:le,errors:ae}=D();console.log(d),f.useEffect(()=>{l.map(i=>{m(A=>[...A,{value:i.id,label:i.name}])})},[]),f.useEffect(()=>{a.map(i=>{n(A=>[...A,{value:i.id,label:i.name}])})},[]);const z=(i,A)=>{i.preventDefault(),b(route("admin.manage.menus",A))};return e.jsxs(W,{user:h.user,children:[e.jsx(P,{title:"Manage Menus"}),e.jsx(K,{onOpen:j,isOpen:c,onClose:p}),e.jsx(Q,{onOpen:u.onOpen,isOpen:u.isOpen,onClose:u.onClose,menu:d}),e.jsxs(O,{mb:6,p:6,children:[o.length<=0&&e.jsxs(S,{spacing:4,variant:"left-accent",children:[e.jsxs(q,{status:"warning",children:[e.jsx(H,{}),e.jsx(N,{children:"No menu!"}),e.jsx(V,{children:"Create a menu to add menu items."})]}),e.jsx(M,{onClick:j,children:"Create new menu"})]}),o.length>0&&e.jsxs(S,{spacing:6,children:[e.jsx(I,{w:"full",maxW:"xl",children:e.jsx(R,{placeholder:"Select menu to edit",value:d.id,onChange:i=>z(i,i.target.value),children:o.map(i=>e.jsx("option",{value:i.id,children:i.title},i.id))})}),e.jsx(U,{variant:"outline",onClick:j,children:"Add new menu"}),e.jsx(M,{variant:"outline",colorScheme:"red",onClick:u.onOpen,children:"Delete selected menu"})]})]}),e.jsxs(Y,{gridTemplateColumns:{base:"1fr",md:"1fr auto",xl:"400px auto"},gridTemplateRows:"auto",gridGap:10,children:[e.jsxs(_,{colSpan:1,children:[e.jsx(I,{borderBottom:"5px solid var(--chakra-colors-primary-500)",children:e.jsx(M,{as:"h4",p:3,colorScheme:"primary",size:"lg",rounded:"none",children:"Add Menu Items"})}),d&&e.jsxs(I,{children:[e.jsx(G,{options:t,name:"categories",menu:d}),e.jsx(G,{options:r,name:"pages",menu:d}),e.jsx(oe,{menu:d,menuItems:x})]})]}),e.jsxs(_,{colSpan:1,children:[e.jsx(I,{borderBottom:"5px solid var(--chakra-colors-primary-500)",children:e.jsx(M,{as:"h4",p:3,colorScheme:"primary",size:"lg",rounded:"none",children:"Menu Structure"})}),e.jsx(ne,{menuItems:x,menuItem:s,setMenuItem:g})]})]})]})}const G=({options:h,name:l,menu:o})=>{const{data:a,setData:d,post:x,processing:c,errors:j,reset:p}=D({menu_id:o.id,ids:[],type:l}),u=y(),t=m=>{m.preventDefault(),x(route("admin.addMenuItems.menu"),{preserveScroll:!0,onSuccess:()=>{u({position:"top-right",title:"Menu Created.",description:"Menu Created Successfully",status:"success",duration:6e3,isClosable:!0}),p()},onError:r=>{console.log(r)}})};return e.jsxs(O,{mt:6,p:6,children:[e.jsxs(C,{textAlign:"left",children:[e.jsxs(v,{htmlFor:l,children:["Select ",l]}),e.jsx(J,{name:l,id:l,placeholder:"Select "+l,options:h,onChange:m=>{let r=[];m.forEach(n=>r.push(n.value)),d("ids",r)}})]}),e.jsx(M,{mt:4,size:"sm",isLoading:c,onClick:m=>t(m),children:"Add to Menu"})]})},oe=({menu:h,menuItems:l})=>{const{data:o,setData:a,post:d,processing:x,errors:c,reset:j}=D({menu_id:h.id,title:"",name:"",url:"",order:"",parent_id:null}),p=y(),u=t=>{t.preventDefault(),console.log(o),d(route("admin.addCustomLink.menu"),{preserveScroll:!0,onSuccess:()=>{p({position:"top-right",title:"Menu Created.",description:"Menu Created Successfully",status:"success",duration:6e3,isClosable:!0}),j()},onError:m=>{console.log(m)}})};return e.jsxs(O,{mt:6,p:6,children:[e.jsx($,{children:e.jsxs(ee,{children:[e.jsxs(te,{children:[e.jsx(I,{as:"span",flex:"1",textAlign:"left",children:"Add Custom Link"}),e.jsx(re,{})]}),e.jsx(se,{pb:4,children:e.jsxs(Z,{children:[e.jsxs(C,{isRequired:!0,isInvalid:!!c.title,children:[e.jsx(v,{htmlFor:"title",children:"Title"}),e.jsx(k,{name:"title",id:"title",value:o.title,onChange:t=>a("title",t.target.value)})]}),e.jsxs(C,{isRequired:!0,isInvalid:!!c.name,children:[e.jsx(v,{htmlFor:"name",children:"Name"}),e.jsx(k,{name:"name",id:"name",value:o.name,onChange:t=>a("name",t.target.value)})]}),e.jsxs(C,{isRequired:!0,isInvalid:!!c.name,children:[e.jsx(v,{htmlFor:"url",children:"URL"}),e.jsx(k,{name:"url",id:"url",value:o.url,onChange:t=>a("url",t.target.value)})]}),e.jsxs(C,{children:[e.jsx(v,{htmlFor:"order",children:"Order"}),e.jsx(k,{type:"number",name:"order",id:"order",value:o.order,onChange:t=>a("order",t.target.value)})]}),e.jsxs(C,{children:[e.jsx(v,{htmlFor:"parent_id",children:"Select parent menu item"}),e.jsx(R,{name:"parent_id",id:"parent_id",placeholder:"Select parent",onChange:t=>a("parent_id",t.target.value),children:l.map(t=>e.jsx("option",{value:t.id,children:t.title},t.id))})]})]})})]})}),e.jsx(M,{mt:4,size:"sm",onClick:t=>u(t,t.target.value),children:"Add to Menu"})]})},ne=({menuItems:h,menuItem:l,setMenuItem:o})=>{const a=E(),d=y(),{delete:x,processing:c,errors:j}=D(),[p,u]=f.useState([]);f.useEffect(()=>{const r=[];h.toSorted((n,s)=>n.order-s.order).map(n=>{n.parent_id||r.push(n)}),u(r)},[h]);const t=(r,n)=>{r.preventDefault();const s=h.filter(g=>g.id==n)[0];o(s),a.onOpen()},m=(r,n)=>{r.preventDefault(),x(route("admin.deleteMenuItem.menu",n),{preserveScroll:!0,onSuccess:()=>d({position:"top-right",title:"Menu Item deleted.",description:"Menu Item deleted Successfully",status:"error",duration:6e3,isClosable:!0}),onError:()=>console.log("Error while deleting")})};return e.jsxs(e.Fragment,{children:[l&&e.jsx(X,{onOpen:a.onOpen,isOpen:a.isOpen,onClose:a.onClose,item:l,setMenuItem:o,menuItems:p}),e.jsx(O,{mt:6,p:6,children:p&&p.length>0&&e.jsx(w,{children:p.map((r,n)=>e.jsxs(L,{mb:4,children:[e.jsxs(S,{justify:"space-between",children:[e.jsxs(B,{children:[n+1,". ",r.title]}),e.jsxs(S,{spacing:4,children:[e.jsx(F,{onClick:s=>{t(s,r.id)},isDisabled:c}),e.jsx(T,{onClick:s=>{m(s,r.id)},isDisabled:c})]})]}),r.children&&r.children.length>0&&e.jsx(w,{ml:6,mt:4,children:r.children.sort((s,g)=>s.order-g.order).map((s,g)=>e.jsx(L,{mb:4,children:e.jsxs(S,{justify:"space-between",children:[e.jsxs(B,{children:[g+1,"."," ",s.title]}),e.jsxs(S,{spacing:4,children:[e.jsx(F,{onClick:b=>{t(b,s.id)},isDisabled:c}),e.jsx(T,{onClick:b=>{m(b,s.id)},isDisabled:c})]})]})},s.id))})]},r.id))})})]})};export{jt as default};
