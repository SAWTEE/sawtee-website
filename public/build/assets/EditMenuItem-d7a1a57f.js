import{W as v,j as e}from"./app-efa55958.js";import{P as f}from"./PrimaryButton-63ebb02b.js";import{u as g}from"./chunk-5LTIYV3A-a216305e.js";import{M}from"./chunk-NABYTFTG-9c5cf35d.js";import{M as C,a as S,b as F,c as _,d as b}from"./chunk-4FCEGNGT-53b0de1a.js";import{V as y}from"./chunk-NTCQBYKE-db626ce2.js";import{F as i,I as n}from"./chunk-6CVSDS6C-e8322ee8.js";import{F as l}from"./chunk-GCOAS5YC-b63ccf93.js";import{S as B}from"./chunk-3RSXBRAN-bbea2ba3.js";import{M as I}from"./chunk-RAWN7VJ3-58bfc8aa.js";import{B as R}from"./chunk-UVUR7MCU-f950a53f.js";import"./objectWithoutPropertiesLoose-4f48578a.js";import"./defineProperty-0e4f3c13.js";import"./chunk-ROURZMX4-1c85f1b1.js";import"./chunk-3XANSPY5-cf37bc50.js";import"./chunk-6NHXDBFO-987cde81.js";import"./chunk-ZHMYA64R-2b67766a.js";import"./chunk-G72KV6MB-dbbc8cf4.js";function Q({isOpen:u,onClose:m,item:t,setMenuItem:s,menuItems:c}){const{data:a,setData:o,patch:p,processing:h,errors:d,reset:k}=v({title:t.title,name:t.name,menu_id:t.menu_id,url:t.url,order:t.order,parent_id:t.parent_id||""}),x=g();console.log(t);const j=r=>{r.preventDefault(),console.log(a),p(route("admin.editMenuItem.menu",t.id),{preserveScroll:!0,onSuccess:()=>{x({position:"top-right",title:"Menu Item Updated.",description:"Menu Item Updated Successfully",status:"success",duration:6e3,isClosable:!0}),s(null),m()}})};return e.jsxs(M,{isOpen:u,onClose:m,closeOnOverlayClick:!1,children:[e.jsx(C,{}),e.jsxs(S,{as:"form",onSubmit:j,children:[e.jsx(F,{children:"Edit Menu Item"}),e.jsx(_,{onClick:()=>{s(null)}}),e.jsx(b,{children:e.jsxs(y,{children:[e.jsxs(i,{isRequired:!0,isInvalid:!!d.title,children:[e.jsx(l,{htmlFor:"title",children:"Title"}),e.jsx(n,{name:"title",id:"title",value:a.title,onChange:r=>o("title",r.target.value)})]}),e.jsxs(i,{isRequired:!0,isInvalid:!!d.name,children:[e.jsx(l,{htmlFor:"name",children:"Name"}),e.jsx(n,{name:"name",id:"name",value:a.name,onChange:r=>o("name",r.target.value)})]}),e.jsxs(i,{isRequired:!0,isInvalid:!!d.name,children:[e.jsx(l,{htmlFor:"url",children:"URL"}),e.jsx(n,{name:"url",id:"url",value:a.url,onChange:r=>o("url",r.target.value)})]}),e.jsxs(i,{children:[e.jsx(l,{htmlFor:"order",children:"Order"}),e.jsx(n,{type:"number",name:"order",id:"order",value:a.order,onChange:r=>o("order",r.target.value)})]}),e.jsxs(i,{children:[e.jsx(l,{htmlFor:"parent_id",children:"Select parent menu item"}),e.jsx(B,{name:"parent_id",id:"parent_id",placeholder:"Select parent menu item",value:a.parent_id,onChange:r=>o("parent_id",r.target.value),children:c.map(r=>r.id!=t.id&&e.jsx("option",{value:r.id,children:r.title},r.id))})]})]})}),e.jsxs(I,{children:[e.jsx(f,{colorScheme:"blue",type:"submit",isLoading:h,mr:3,children:"Save"}),e.jsx(R,{variant:"ghost",onClick:()=>{s(null)},children:"Cancel"})]})]})]})}export{Q as default};
