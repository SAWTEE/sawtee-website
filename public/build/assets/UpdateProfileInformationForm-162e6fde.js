import{C as v,W as S,j as e,u as t,d as C}from"./app-efa55958.js";import{P as F}from"./PrimaryButton-63ebb02b.js";import{u as b}from"./chunk-5LTIYV3A-a216305e.js";import{B as i}from"./chunk-PULVB27S-076b392b.js";import{H as k}from"./chunk-7OLJDQMT-7f99fc6b.js";import{T as m}from"./chunk-2OOHT3W5-8a8b58d4.js";import{V as I}from"./chunk-NTCQBYKE-db626ce2.js";import{F as l,I as u}from"./chunk-6CVSDS6C-e8322ee8.js";import{F as d}from"./chunk-GCOAS5YC-b63ccf93.js";import{F as c}from"./chunk-5ZQ6B3SW-100d0584.js";import{F as P}from"./chunk-KRPLQIP4-2070ff1c.js";import"./chunk-UVUR7MCU-f950a53f.js";import"./chunk-R3DH46PF-f0689d26.js";import"./chunk-ZHMYA64R-2b67766a.js";import"./chunk-G72KV6MB-dbbc8cf4.js";function A({mustVerifyEmail:f,status:p,className:h=""}){const o=v().props.auth.user,g=b(),{data:s,setData:a,patch:x,errors:n,processing:j,recentlySuccessful:z}=S({name:o.name,email:o.email}),y=r=>{r.preventDefault(),x(route("admin.profile.update"),{preserveScroll:!0,onSuccess:()=>{g({title:"Success",description:"Profile information updated.",status:"success",duration:9e3,isClosable:!0})}})};return e.jsxs(i,{as:"section",className:h,children:[e.jsxs("header",{children:[e.jsx(k,{as:"h2",fontSize:"lg",fontWeight:"medium",color:t("gray.900","gray.100"),children:"Profile Information"}),e.jsx(m,{mt:1,fontSize:"sm",color:t("gray.600","gray.400"),children:"Update your account's profile information and email address."})]}),e.jsxs(I,{as:"form",onSubmit:y,mt:6,py:6,gap:4,alignItems:"flex-start",children:[e.jsxs(l,{isRequired:!0,children:[e.jsx(d,{htmlFor:"name",children:"Name"}),e.jsx(u,{id:"name",value:s.name,onChange:r=>a("name",r.target.value),autoComplete:"name"}),e.jsx(c,{mt:2,children:n.name})]}),e.jsxs(l,{isRequired:!0,children:[e.jsx(d,{htmlFor:"email",children:"Email"}),e.jsx(u,{id:"email",type:"email",value:s.email,onChange:r=>a("email",r.target.value),autoComplete:"username"}),e.jsx(c,{mt:2,children:n.email})]}),f&&o.email_verified_at===null&&e.jsxs(i,{children:[e.jsxs(m,{as:"p",mt:2,fontSize:"sm",color:t("gray.800","gray.200"),children:["Your email address is unverified.",e.jsx(C,{href:route("verification.send"),method:"post",as:"button",className:"underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800",children:"Click here to re-send the verification email."})]}),p==="verification-link-sent"&&e.jsx(i,{mt:2,fontSize:"sm",fontWeight:"md",color:t("green.600","green.400"),children:"A new verification link has been sent to your email address."})]}),e.jsx(P,{justifyCenter:!0,gap:4,children:e.jsx(F,{minW:64,type:"submit",isLoading:j,children:"Save"})})]})]})}export{A as default};