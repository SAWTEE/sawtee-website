import{W as l,r as m,j as s,a as c}from"./app-b86f65ba.js";import p from"./GuestLayout-e6231e00.js";import{P as x}from"./PrimaryButton-5fa5504e.js";import"./chunk-PULVB27S-40ef37d8.js";import"./chunk-UVUR7MCU-0c7d985a.js";function j(){const{data:o,setData:a,post:t,processing:n,errors:e,reset:i}=l({password:""});m.useEffect(()=>()=>{i("password")},[]);const d=r=>{r.preventDefault(),t(route("password.confirm"))};return s.jsxs(p,{children:[s.jsx(c,{title:"Confirm Password"}),s.jsx(Container,{maxW:"7xl",p:{base:5,md:10},children:s.jsx(Center,{children:s.jsxs(Stack,{spacing:4,boxSize:{base:"sm",sm:"md",md:"lg"},children:[s.jsx(Stack,{align:"center",children:s.jsx(Text,{fontSize:"2xl",textAlign:"center",md:4,color:useColorModeValue("gray.600","gray.400"),children:"This is a secure area of the application. Please confirm your password before continuing."})}),s.jsx(VStack,{boxSize:{base:"sm",sm:"md",md:"lg"},h:"max-content !important",bg:useColorModeValue("white","gray.700"),rounded:"lg",boxShadow:"lg",p:{base:5,sm:10},spacing:8,as:"form",onSubmit:d,children:s.jsxs(VStack,{spacing:4,w:"100%",children:[s.jsxs(FormControl,{children:[s.jsx(FormLabel,{htmlFor:"password",children:"Password"}),s.jsx(Input,{id:"password",type:"password",name:"password",value:o.password,mt:1,w:"full",onChange:r=>a("password",r.target.value)}),e.password&&s.jsx(FormErrorMessage,{children:e.password})]}),s.jsx(x,{ml:4,disabled:n,children:"Confirm"})]})})]})})})]})}export{j as default};
