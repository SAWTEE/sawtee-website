import{W as h,j as s,u as c}from"./app-efa55958.js";import{P as g}from"./PrimaryButton-63ebb02b.js";import{u as j}from"./chunk-5LTIYV3A-a216305e.js";import{B as y}from"./chunk-PULVB27S-076b392b.js";import{H as _}from"./chunk-7OLJDQMT-7f99fc6b.js";import{T as C}from"./chunk-2OOHT3W5-8a8b58d4.js";import{V as F}from"./chunk-NTCQBYKE-db626ce2.js";import{F as n,I as i}from"./chunk-6CVSDS6C-e8322ee8.js";import{F as d}from"./chunk-GCOAS5YC-b63ccf93.js";import{F as p}from"./chunk-5ZQ6B3SW-100d0584.js";import{F as P}from"./chunk-KRPLQIP4-2070ff1c.js";import"./chunk-UVUR7MCU-f950a53f.js";import"./chunk-R3DH46PF-f0689d26.js";import"./chunk-ZHMYA64R-2b67766a.js";import"./chunk-G72KV6MB-dbbc8cf4.js";function L({className:m=""}){const{data:o,setData:a,errors:e,put:l,reset:t,processing:w,recentlySuccessful:v}=h({current_password:"",password:"",password_confirmation:""}),f=j(),x=r=>{r.preventDefault(),l(route("password.update"),{preserveScroll:!0,onSuccess:()=>{f({title:"Success",description:"Paswword information updated.",status:"success",duration:9e3,isClosable:!0}),t()},onError:u=>{u.password&&(t("password","password_confirmation"),passwordInput.current.focus()),u.current_password&&(t("current_password"),currentPasswordInput.current.focus())}})};return s.jsxs(y,{as:"section",className:m,children:[s.jsxs("header",{children:[s.jsx(_,{as:"h2",fontSize:"lg",fontWeight:"medium",color:c("gray.900","gray.100"),children:"Update Password"}),s.jsx(C,{mt:1,fontSize:"sm",color:c("gray.600","gray.400"),children:"Ensure your account is using a long, random password to stay secure."})]}),s.jsxs(F,{as:"form",gap:4,onSubmit:x,mt:6,py:6,alignItems:"start",children:[s.jsxs(n,{isRequired:!0,children:[s.jsx(d,{htmlFor:"current_password",children:"Current Password"}),s.jsx(i,{id:"current_password",value:o.current_password,onChange:r=>a("current_password",r.target.value),type:"password",mt:1,display:"block",w:"full",autoComplete:"current-password"}),s.jsx(p,{className:"mt-2",children:e.current_password})]}),s.jsxs(n,{isRequired:!0,children:[s.jsx(d,{htmlFor:"password",children:"Current Password"}),s.jsx(i,{id:"password",value:o.password,onChange:r=>a("password",r.target.value),type:"password",mt:1,display:"block",w:"full",autoComplete:"new-password"}),s.jsx(p,{className:"mt-2",children:e.password})]}),s.jsxs(n,{isRequired:!0,children:[s.jsx(d,{htmlFor:"password_confirmation",children:"Confirm Password"}),s.jsx(i,{id:"password_confirmation",value:o.password_confirmation,onChange:r=>a("password_confirmation",r.target.value),type:"password",mt:1,display:"block",w:"full",autoComplete:"new-password"}),s.jsx(p,{className:"mt-2",children:e.password_confirmation})]}),s.jsx(P,{justifyCenter:!0,gap:4,className:"flex items-center gap-4",children:s.jsx(g,{minW:64,isLoading:w,children:"Save"})})]})]})}export{L as default};
