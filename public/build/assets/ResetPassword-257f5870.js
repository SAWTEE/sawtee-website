import{W as p,r as c,j as s,a as w}from"./app-efa55958.js";import x from"./GuestLayout-f4077a90.js";import{P as u}from"./PrimaryButton-63ebb02b.js";import"./chunk-PULVB27S-076b392b.js";import"./chunk-UVUR7MCU-f950a53f.js";function F({token:t,email:n}){const{data:a,setData:e,post:i,processing:m,errors:o,reset:l}=p({token:t,email:n,password:"",password_confirmation:""});c.useEffect(()=>()=>{l("password","password_confirmation")},[]);const d=r=>{r.preventDefault(),i(route("password.store"))};return s.jsxs(x,{children:[s.jsx(w,{title:"Reset Password"}),s.jsx(Container,{maxW:"7xl",p:{base:5,md:10},children:s.jsx(Center,{children:s.jsx(Stack,{spacing:4,boxSize:{base:"sm",sm:"md",md:"lg"},children:s.jsx(VStack,{boxSize:{base:"sm",sm:"md",md:"lg"},h:"max-content !important",bg:useColorModeValue("white","gray.700"),rounded:"lg",boxShadow:"lg",p:{base:5,sm:10},spacing:8,as:"form",onSubmit:d,children:s.jsxs(VStack,{spacing:4,w:"100%",children:[s.jsxs(FormControl,{children:[s.jsx(FormLabel,{htmlFor:"email",children:"Email"}),s.jsx(Input,{id:"email",type:"email",name:"email",value:a.email,placeholder:"Email",mt:1,w:"full",onChange:r=>e("email",r.target.value)}),o.email&&s.jsx(FormErrorMessage,{children:o.email})]}),s.jsxs(FormControl,{children:[s.jsx(FormLabel,{htmlFor:"password",children:"Password"}),s.jsx(Input,{id:"password",type:"password",name:"password",value:a.password,mt:1,w:"full",onChange:r=>e("password",r.target.value)}),o.password&&s.jsx(FormErrorMessage,{children:o.password})]}),s.jsxs(FormControl,{children:[s.jsx(FormLabel,{htmlFor:"password_confirmation",children:"Confirm Password"}),s.jsx(Input,{id:"password_confirmation",type:"password_confirmation",name:"password_confirmation",value:a.password_confirmation,mt:1,w:"full",onChange:r=>e("password_confirmation",r.target.value)}),o.password_confirmation&&s.jsx(FormErrorMessage,{children:o.password_confirmation})]}),s.jsx(u,{ml:4,disabled:m,children:"Reset Password"})]})})})})})]})}export{F as default};