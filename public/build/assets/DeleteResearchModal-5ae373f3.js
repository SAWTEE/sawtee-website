import{W as d,j as e,A as c,b as m,e as u,g as p}from"./app-efa55958.js";import{D as h}from"./DangerButton-a322e9d3.js";import{u as x}from"./chunk-5LTIYV3A-a216305e.js";import{M as j}from"./chunk-NABYTFTG-9c5cf35d.js";import{M as f,a as g,b as M,c as y,d as b}from"./chunk-4FCEGNGT-53b0de1a.js";import{B}from"./chunk-PULVB27S-076b392b.js";import{M as D}from"./chunk-RAWN7VJ3-58bfc8aa.js";import{B as A}from"./chunk-UVUR7MCU-f950a53f.js";import"./objectWithoutPropertiesLoose-4f48578a.js";import"./defineProperty-0e4f3c13.js";import"./chunk-ROURZMX4-1c85f1b1.js";import"./chunk-3XANSPY5-cf37bc50.js";import"./chunk-6NHXDBFO-987cde81.js";function O({isOpen:t,onClose:r,id:s}){const{delete:o,processing:i}=d(),a=x(),l=n=>{n.preventDefault(),o(route("admin.research.destroy",s),{preserveScroll:!0,onSuccess:()=>{a({position:"top-right",title:"Research deleted.",description:"Research deleted Successfully",status:"warning",duration:6e3,isClosable:!0}),r()},onError:()=>console.log("Error while deleting")})};return e.jsxs(j,{isOpen:t,onClose:r,size:"lg",isCentered:!0,children:[e.jsx(f,{}),e.jsxs(g,{as:"form",onSubmit:l,children:[e.jsxs(M,{children:["Delete Research : ",s]}),e.jsx(y,{}),e.jsx(b,{children:e.jsxs(c,{status:"warning",children:[e.jsx(m,{}),e.jsxs(B,{children:[e.jsx(u,{children:"This action is irreversible."}),e.jsx(p,{children:"Are you sure you want to delete this Research?"})]})]})}),e.jsxs(D,{children:[e.jsx(h,{type:"submit",isLoading:i,mr:3,children:"Delete"}),e.jsx(A,{variant:"ghost",onClick:r,children:"Cancel"})]})]})]})}export{O as default};