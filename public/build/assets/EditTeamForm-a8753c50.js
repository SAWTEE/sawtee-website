import{W as f,R as v,j as e}from"./app-b86f65ba.js";import{P as F}from"./PrimaryButton-5fa5504e.js";import{P as I,F as C}from"./FileUpload-c7623ec4.js";import{u as S}from"./chunk-5LTIYV3A-c0d0565c.js";import{V as R}from"./chunk-NTCQBYKE-9550ce1a.js";import{H as c}from"./chunk-3ASUQ6PA-69bb8c21.js";import{F as o,I as l}from"./chunk-6CVSDS6C-435f6bfb.js";import{F as m}from"./chunk-GCOAS5YC-ffd1c6d3.js";import{F as n}from"./chunk-5ZQ6B3SW-32c7ef0f.js";import{N as w,a as y,b as N,c as B,d as q}from"./chunk-2JJX6TVY-7265296a.js";import{T as D}from"./chunk-4IH3O7BJ-eeb8f560.js";import{B as E}from"./chunk-PULVB27S-40ef37d8.js";import{B as L}from"./chunk-UVUR7MCU-0c7d985a.js";import"./chunk-KRPLQIP4-df7f6101.js";import"./chunk-ZHMYA64R-3bf5ed2b.js";import"./chunk-G72KV6MB-ad524ee2.js";import"./chunk-7OLJDQMT-7196af02.js";import"./chunk-2OOHT3W5-264de18c.js";import"./chunk-R3DH46PF-f0689d26.js";import"./chunk-QINAG4RG-a0760f00.js";import"./chunk-SPIKMR6I-87968274.js";import"./index-129ac873.js";function ie({team:i}){const{data:a,setData:t,post:g,processing:u,errors:s,reset:h}=f({name:i.name,email:i.email,designation:i.designation,bio:i.bio,order:i.order?i.order:0,image:""});console.log(i);const j=S(),[d,p]=v.useState(i.media[0]?i.media[0].original_url:null),x=r=>{r.preventDefault(),console.log(a),g(route("admin.teams.update",{_method:"patch",team:i.id}),{preserveScroll:!0,onSuccess:()=>j({position:"top-right",title:"Member edited.",description:"Member edited Successfully",status:"success",duration:6e3,isClosable:!0}),onError:b=>{b.name&&h("name")}})};return e.jsxs(R,{as:"form",onSubmit:x,gap:"10",alignItems:"start",children:[e.jsxs(c,{w:"full",gap:8,justifyContent:"space-evenly",alignItems:"center",children:[e.jsxs(o,{isRequired:!0,isInvalid:s.name,children:[e.jsx(m,{htmlFor:"name",children:"Name"}),e.jsx(l,{id:"name",name:"name",placeholder:"enter member name",value:a.name,onChange:r=>t("name",r.target.value),required:!0}),e.jsx(n,{message:s.name,className:"mt-2"})]}),e.jsxs(o,{isInvalid:s.email,children:[e.jsx(m,{htmlFor:"email",children:"email"}),e.jsx(l,{type:"email",id:"email",name:"email",value:a.email,placeholder:"enter member email",onChange:r=>t("email",r.target.value)}),e.jsx(n,{message:s.email,mt:2})]}),e.jsxs(o,{isRequired:!0,as:"fieldset",children:[e.jsx(m,{htmlFor:"designation",children:"Designation"}),e.jsx(l,{id:"designation",name:"designation",value:a.designation,placeholder:"enter member designation",onChange:r=>t("designation",r.target.value)}),e.jsx(n,{mt:2,message:s.designation})]}),e.jsxs(o,{isRequired:!0,children:[e.jsx(m,{htmlFor:"order",children:"Order"}),e.jsxs(w,{id:"order",name:"order",value:a.order,onChange:r=>t("order",Number(r)),children:[e.jsx(y,{}),e.jsxs(N,{children:[e.jsx(B,{}),e.jsx(q,{})]})]}),e.jsx(n,{message:s.order})]})]}),e.jsxs(c,{w:"full",gap:8,justifyContent:"space-between",alignItems:"center",children:[e.jsxs(o,{children:[e.jsx(m,{htmlFor:"bio",children:"Bio"}),e.jsx(D,{id:"bio",name:"bio",placeholder:"enter member bio",value:a.bio,rows:10,resize:"vertical",onChange:r=>t("bio",r.target.value)}),e.jsx(n,{message:s.bio,mt:2})]}),e.jsxs(o,{children:[e.jsx(m,{htmlFor:"image",children:"Image"}),d&&e.jsxs(e.Fragment,{children:[e.jsx(E,{w:"48",children:e.jsx(I,{src:d,aspectRatio:3/4})}),e.jsx(L,{mt:4,size:"sm",colorScheme:"red",onClick:()=>{p(null)},children:"Remove/Change Image"})]}),!d&&e.jsx(C,{accept:"image/.png,.jpg,.jpeg,.webp",children:e.jsx(l,{type:"file",height:"100%",width:"100%",position:"absolute",top:"0",left:"0",opacity:"0","aria-hidden":"true",accept:"image/.png,.jpg,.jpeg,.webp",id:"image",name:"image",size:"md",onChange:r=>{t("image",r.target.files[0]),p(URL.createObjectURL(r.target.files[0]))}})}),s.image&&e.jsx(n,{mt:2,children:s.image})]})]}),e.jsx(F,{type:"submit",isLoading:u,minW:"64",children:"Save"})]})}export{ie as default};
