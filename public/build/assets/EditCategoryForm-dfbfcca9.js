import{W as v,R as F,j as e}from"./app-efa55958.js";import{P as C}from"./PrimaryButton-63ebb02b.js";import{P as S,F as y}from"./FileUpload-8df4bbf1.js";import{u as b}from"./chunk-5LTIYV3A-a216305e.js";import{V as I}from"./chunk-NTCQBYKE-db626ce2.js";import{F as m,I as p}from"./chunk-6CVSDS6C-e8322ee8.js";import{F as o}from"./chunk-GCOAS5YC-b63ccf93.js";import{F as n}from"./chunk-5ZQ6B3SW-100d0584.js";import{S as w}from"./chunk-NEK3OOAM-a48a721b.js";import{S as h}from"./chunk-3RSXBRAN-bbea2ba3.js";import{B as R}from"./chunk-PULVB27S-076b392b.js";import{B as P}from"./chunk-UVUR7MCU-f950a53f.js";import{T as B}from"./chunk-4IH3O7BJ-322ca07b.js";import"./chunk-KRPLQIP4-2070ff1c.js";import"./chunk-ZHMYA64R-2b67766a.js";import"./chunk-G72KV6MB-dbbc8cf4.js";import"./chunk-7OLJDQMT-7f99fc6b.js";import"./chunk-2OOHT3W5-8a8b58d4.js";import"./chunk-R3DH46PF-f0689d26.js";import"./chunk-QINAG4RG-420d55bb.js";import"./chunk-SPIKMR6I-154a1106.js";import"./chunk-JARCRF6W-6766cdec.js";function $({category:a,categories:d}){const{data:r,setData:s,post:u,processing:g,errors:i,reset:j}=v({name:a.name,type:a.type,slug:"",parent_id:a.parent_id,image:null,meta_title:a.meta_title,meta_description:a.meta_description});console.log(a.meta_title);const x=b(),[l,c]=F.useState(a.media[0]?a.media[0].preview_url:null),_=t=>{t.preventDefault(),console.log(r),u(route("admin.categories.update",{_method:"patch",category:a.id}),{preserveScroll:!0,onSuccess:()=>x({position:"top-right",title:"Category edited.",description:"Category edited Successfully",status:"success",duration:6e3,isClosable:!0}),onError:f=>{f.name&&j("name")}})};return e.jsxs(I,{as:"form",onSubmit:_,gap:"6",alignItems:"start",children:[e.jsxs(m,{isInvalid:i.name,children:[e.jsx(o,{htmlFor:"name",children:"Name"}),e.jsx(p,{id:"name",name:"name",value:r.name,placeholder:"enter category name",onChange:t=>s("name",t.target.value),required:!0}),e.jsx(n,{message:i.name,className:"mt-2"})]}),e.jsxs(w,{columns:2,spacing:10,w:"full",children:[e.jsxs(m,{children:[e.jsx(o,{htmlFor:"type",children:"Category Type"}),e.jsx(h,{name:"type",id:"type",placeholder:"Select Type",value:r.type,onChange:t=>s("type",t.target.value),children:["post","publication","research","team"].map(t=>e.jsx("option",{value:t,children:t},t))})]}),e.jsxs(m,{children:[e.jsx(o,{htmlFor:"parent_id",children:"Parent"}),e.jsx(h,{name:"parent_id",id:"parent_id",placeholder:"Select Parent",value:r.parent_id,onChange:t=>{s("parent_id",t.target.value)},children:d&&d.map(t=>e.jsx("option",{value:t.id,children:t.name},t.id))})]})]}),e.jsxs(m,{children:[e.jsx(o,{htmlFor:"image",children:"Featured Image"}),l&&e.jsxs(e.Fragment,{children:[e.jsx(R,{w:"sm",children:e.jsx(S,{src:l,aspectRatio:16/9})}),e.jsx(P,{mt:4,size:"sm",colorScheme:"red",onClick:()=>{c(null)},children:"Remove/Change Image"})]}),!l&&e.jsx(y,{accept:"image/.png,.jpg,.jpeg,.webp",children:e.jsx(p,{type:"file",height:"100%",width:"100%",position:"absolute",top:"0",left:"0",opacity:"0","aria-hidden":"true",accept:"image/.png,.jpg,.jpeg,.webp",id:"image",name:"image",size:"md",onChange:t=>{s("image",t.target.files[0]),c(URL.createObjectURL(t.target.files[0]))}})}),i.image&&e.jsx(n,{mt:2,children:i.image})]}),e.jsxs(m,{isInvalid:i.meta_title,children:[e.jsx(o,{htmlFor:"meta_title",children:"meta title"}),e.jsx(p,{id:"meta_title",name:"meta_title",value:r.meta_title,onChange:t=>s("meta_title",t.target.value)}),e.jsx(n,{message:i.meta_title,className:"mt-2"})]}),e.jsxs(m,{isInvalid:i.meta_description,children:[e.jsx(o,{htmlFor:"meta_description",children:"meta_description"}),e.jsx(B,{id:"meta_description",name:"meta_description",value:r.meta_description,rows:3,resize:"vertical",onChange:t=>s("meta_description",t.target.value)}),e.jsx(n,{message:i.meta_description,className:"mt-2"})]}),e.jsx(C,{type:"submit",isLoading:g,minW:"64",children:"Save"})]})}export{$ as default};
