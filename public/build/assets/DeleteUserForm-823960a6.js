import{j as e,W as x,u as r}from"./app-efa55958.js";import{D as i}from"./DangerButton-a322e9d3.js";import{B as j}from"./chunk-UVUR7MCU-f950a53f.js";import{u as g}from"./chunk-7JBTTEVG-dc1f3de8.js";import{B as w}from"./chunk-PULVB27S-076b392b.js";import{H as d}from"./chunk-7OLJDQMT-7f99fc6b.js";import{T as c}from"./chunk-2OOHT3W5-8a8b58d4.js";import{M as F}from"./chunk-NABYTFTG-9c5cf35d.js";import{M,a as C,b as D,c as S,d as B}from"./chunk-4FCEGNGT-53b0de1a.js";import{V as b}from"./chunk-NTCQBYKE-db626ce2.js";import{F as k,I as v}from"./chunk-6CVSDS6C-e8322ee8.js";import{F as O}from"./chunk-GCOAS5YC-b63ccf93.js";import{F as z}from"./chunk-5ZQ6B3SW-100d0584.js";import{F as A}from"./chunk-KRPLQIP4-2070ff1c.js";import"./chunk-R3DH46PF-f0689d26.js";import"./objectWithoutPropertiesLoose-4f48578a.js";import"./defineProperty-0e4f3c13.js";import"./chunk-ROURZMX4-1c85f1b1.js";import"./chunk-3XANSPY5-cf37bc50.js";import"./chunk-6NHXDBFO-987cde81.js";import"./chunk-ZHMYA64R-2b67766a.js";import"./chunk-G72KV6MB-dbbc8cf4.js";function E({type:l="button",className:s="",disabled:t,children:o,...a}){return e.jsx(j,{className:s,colorScheme:"gray",disabled:t,...a,children:o})}function re({className:l=""}){const{isOpen:s,onOpen:t,onClose:o}=g(),{data:a,setData:m,delete:p,processing:u,reset:f,errors:y}=x({password:""}),h=n=>{n.preventDefault(),p(route("admin.profile.destroy"),{preserveScroll:!0,onSuccess:()=>closeModal(),onError:()=>passwordInput.current.focus(),onFinish:()=>f()})};return e.jsxs(w,{as:"section",py:6,className:l,children:[e.jsxs("header",{children:[e.jsx(d,{as:"h2",fontSize:"lg",fontWeight:"medium",color:r("gray.900","gray.100"),children:"Delete Account"}),e.jsx(c,{mt:1,fontSize:"sm",color:r("gray.600","gray.400"),children:"Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain."})]}),e.jsx(i,{mt:3,onClick:t,children:"Delete Account"}),e.jsxs(F,{isOpen:s,onClose:o,children:[e.jsx(M,{}),e.jsxs(C,{children:[e.jsx(D,{children:"Delete User"}),e.jsx(S,{}),e.jsx(B,{children:e.jsxs(b,{as:"form",p:6,gap:4,onSubmit:h,children:[e.jsx(d,{as:"h2",fontSize:"lg",fontWeight:"medium",color:r("gray.900","gray.100"),children:"Are you sure you want to delete your account?"}),e.jsx(c,{mt:1,fontSize:"sm",color:r("gray.600","gray.400"),children:"Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account."}),e.jsxs(k,{mt:6,children:[e.jsx(O,{htmlFor:"password",className:"sr-only",children:"Password"}),e.jsx(v,{id:"password",type:"password",name:"password",value:a.password,onChange:n=>m("password",n.target.value),mt:1,display:"block",w:"3/4",placeholder:"Password"}),e.jsx(z,{className:"mt-2",children:y.password})]}),e.jsxs(A,{justiftContents:"flex-end",mt:6,children:[e.jsx(E,{mr:3,onClick:o,children:"Cancel"}),e.jsx(i,{ml:3,disabled:u,children:"Delete Account"})]})]})})]})]})]})}export{re as default};
