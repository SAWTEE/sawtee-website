import{W as f,R as _,j as e}from"./app-efa55958.js";import{P as v}from"./PrimaryButton-63ebb02b.js";import{P as y,F as C}from"./FileUpload-8df4bbf1.js";import{u as F}from"./chunk-5LTIYV3A-a216305e.js";import{S}from"./chunk-NEK3OOAM-a48a721b.js";import{V as b}from"./chunk-NTCQBYKE-db626ce2.js";import{B as I}from"./chunk-PULVB27S-076b392b.js";import{S as c}from"./chunk-3RSXBRAN-bbea2ba3.js";import{T as w}from"./chunk-4IH3O7BJ-322ca07b.js";import{F as i,I as n}from"./chunk-6CVSDS6C-e8322ee8.js";import{F as s}from"./chunk-GCOAS5YC-b63ccf93.js";import{F as o}from"./chunk-5ZQ6B3SW-100d0584.js";import{B as R}from"./chunk-UVUR7MCU-f950a53f.js";import"./chunk-KRPLQIP4-2070ff1c.js";import"./chunk-ZHMYA64R-2b67766a.js";import"./chunk-G72KV6MB-dbbc8cf4.js";import"./chunk-7OLJDQMT-7f99fc6b.js";import"./chunk-2OOHT3W5-8a8b58d4.js";import"./chunk-R3DH46PF-f0689d26.js";import"./chunk-QINAG4RG-420d55bb.js";import"./chunk-SPIKMR6I-154a1106.js";import"./chunk-JARCRF6W-6766cdec.js";function Z({categories:l}){const{data:P,setData:r,post:d,processing:g,errors:a,reset:h}=f({name:"",slug:"",type:"posts",parent_id:null,image:"",meta_title:"",meta_description:""}),u=F(),[m,p]=_.useState(null),j=t=>{t.preventDefault(),d(route("admin.categories.store"),{preserveScroll:!0,onSuccess:()=>u({position:"top-right",title:"Category Created.",description:"Category Created Successfully",status:"success",duration:6e3,isClosable:!0}),onError:x=>{x.name&&h("name")}})};return e.jsxs(b,{as:"form",onSubmit:j,gap:"6",alignItems:"start",children:[e.jsxs(i,{mt:"4",isInvalid:a.name,children:[e.jsx(s,{htmlFor:"name",children:"Name"}),e.jsx(n,{id:"name",name:"name",placeholder:"enter category name",onChange:t=>r("name",t.target.value),required:!0}),e.jsx(o,{message:a.name,className:"mt-2"})]}),e.jsxs(S,{columns:2,gap:10,w:"full",children:[e.jsxs(i,{children:[e.jsx(s,{htmlFor:"type",children:"Select Category Type"}),e.jsx(c,{name:"type",id:"type",placeholder:"Select Type",onChange:t=>r("type",t.target.value),children:["post","publication","research","team"].map(t=>e.jsx("option",{value:t,children:t},t))})]}),e.jsxs(i,{children:[e.jsx(s,{htmlFor:"parent_id",children:"Select Parent"}),e.jsx(c,{name:"parent_id",id:"parent_id",placeholder:"Select Parent",onChange:t=>{console.log(t.target.value),r("parent_id",t.target.value)},children:l&&l.map(t=>e.jsx("option",{value:t.id,children:t.name},t.id))})]})]}),e.jsxs(i,{children:[e.jsx(s,{htmlFor:"image",children:"Featured Image"}),m&&e.jsxs(e.Fragment,{children:[e.jsx(I,{w:"sm",children:e.jsx(y,{src:m,aspectRatio:16/9})}),e.jsx(R,{mt:4,size:"sm",colorScheme:"red",onClick:()=>{p(null)},children:"Remove/Change Image"})]}),!m&&e.jsx(C,{accept:"image/.png,.jpg,.jpeg,.webp",children:e.jsx(n,{type:"file",height:"100%",width:"100%",position:"absolute",top:"0",left:"0",opacity:"0","aria-hidden":"true",accept:"image/.png,.jpg,.jpeg,.webp",id:"image",name:"image",size:"md",onChange:t=>{r("image",t.target.files[0]),p(URL.createObjectURL(t.target.files[0]))}})}),a.image&&e.jsx(o,{mt:2,children:a.image})]}),e.jsxs(i,{isInvalid:a.meta_title,children:[e.jsx(s,{htmlFor:"meta_title",children:"Meta Title"}),e.jsx(n,{id:"meta_title",name:"meta_title",placeholder:"enter meta title",onChange:t=>r("meta_title",t.target.value)}),e.jsx(o,{message:a.meta_title,className:"mt-2"})]}),e.jsxs(i,{isInvalid:a.meta_description,children:[e.jsx(s,{htmlFor:"meta_description",children:"Meta Description"}),e.jsx(w,{id:"meta_description",name:"meta_description",placeholder:"enter meta_description",rows:3,resize:"vertical",onChange:t=>r("meta_description",t.target.value)}),e.jsx(o,{message:a.meta_description,className:"mt-2"})]}),e.jsx(v,{type:"submit",isLoading:g,minW:"64",children:"Save"})]})}export{Z as default};
