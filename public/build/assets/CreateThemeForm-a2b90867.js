import{W as h,j as e}from"./app-efa55958.js";import{P as x}from"./PrimaryButton-63ebb02b.js";import{u as f}from"./chunk-5LTIYV3A-a216305e.js";import{F as o,I as j}from"./chunk-6CVSDS6C-e8322ee8.js";import{F as i}from"./chunk-GCOAS5YC-b63ccf93.js";import{F as a}from"./chunk-5ZQ6B3SW-100d0584.js";import{T as g}from"./chunk-4IH3O7BJ-322ca07b.js";import{B as F}from"./chunk-PULVB27S-076b392b.js";import"./chunk-UVUR7MCU-f950a53f.js";function E(){const{data:m,setData:s,post:n,processing:l,errors:r,reset:c}=h({title:"",description:""}),p=f(),d=t=>{t.preventDefault(),console.log(m),n(route("admin.themes.store"),{preserveScroll:!0,onSuccess:()=>p({position:"top-right",title:"Theme Created.",description:"Theme Created Successfully",status:"success",duration:6e3,isClosable:!0}),onError:u=>{u.name&&c("name")}})};return e.jsxs("form",{onSubmit:d,children:[e.jsxs(o,{mt:"4",isInvalid:r.title,children:[e.jsx(i,{htmlFor:"title",children:"Title"}),e.jsx(j,{id:"title",name:"title",placeholder:"enter theme name",onChange:t=>s("title",t.target.value),required:!0}),e.jsx(a,{message:r.title,className:"mt-2"})]}),e.jsxs(o,{mt:"4",isInvalid:r.description,children:[e.jsx(i,{htmlFor:"title",children:"Description"}),e.jsx(g,{id:"description",name:"description",rows:10,placeholder:"enter theme description",onChange:t=>s("description",t.target.value)}),e.jsx(a,{message:r.description,className:"mt-2"})]}),e.jsx(F,{display:"flex",gap:"4",mt:"4",children:e.jsx(x,{type:"submit",disabled:l,children:"Save"})})]})}export{E as default};
