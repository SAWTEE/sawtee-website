import{W as h,R as s,j as e,a as g,d as j}from"./app-b86f65ba.js";import{P as D}from"./PrimaryButton-5fa5504e.js";import{D as C,c as P}from"./DataTable-7a00a4d8.js";import T from"./AuthenticatedLayout-3aa304af.js";import{T as V,a as A}from"./TableActions-10bf9119.js";import y from"./DeletePublicationModal-2ce5c64f.js";import{u as H}from"./chunk-5LTIYV3A-c0d0565c.js";import{u as k}from"./chunk-7JBTTEVG-9365ebe1.js";import{H as B}from"./chunk-3ASUQ6PA-69bb8c21.js";import{B as E}from"./chunk-PULVB27S-40ef37d8.js";import"./chunk-UVUR7MCU-0c7d985a.js";import"./chunk-DEQZ7DVA-fac225a3.js";import"./index-e094949b.js";import"./iconBase-c9b4a822.js";import"./chunk-W7WUSNWJ-3fd59087.js";import"./chunk-2OOHT3W5-264de18c.js";import"./chunk-R3DH46PF-f0689d26.js";import"./chunk-7OLJDQMT-7196af02.js";import"./chunk-NABYTFTG-cb5b4537.js";import"./objectWithoutPropertiesLoose-4f48578a.js";import"./defineProperty-0e4f3c13.js";import"./chunk-ROURZMX4-1c85f1b1.js";import"./chunk-3XANSPY5-cf37bc50.js";import"./chunk-RAWN7VJ3-3fa0066e.js";import"./chunk-4FCEGNGT-9c7451d9.js";import"./chunk-6NHXDBFO-987cde81.js";import"./chunk-6CVSDS6C-435f6bfb.js";import"./chunk-QINAG4RG-a0760f00.js";import"./chunk-SPIKMR6I-87968274.js";import"./chunk-ZHMYA64R-3bf5ed2b.js";import"./chunk-G72KV6MB-ad524ee2.js";import"./chunk-CWVAJCXJ-a54a50bc.js";import"./index-979d1106.js";import"./chunk-6QYXN73V-7615980f.js";import"./chunk-3RSXBRAN-3976b745.js";import"./index.esm-0ae8b27f.js";import"./Header-4aa93a33.js";import"./chunk-GB67EJMB-24180019.js";import"./chunk-KRPLQIP4-df7f6101.js";import"./chunk-VXCSBZ7K-70508aba.js";import"./chunk-57I6FYPZ-cada06a1.js";import"./chunk-2ZHRCML3-51ee4a1b.js";import"./chunk-FKYN3ZGE-13afe5b8.js";import"./chunk-UZJ3TPNQ-07f25586.js";import"./chunk-OCNORRQU-c1384ea3.js";import"./index-895fc961.js";import"./index-129ac873.js";import"./index-4647d92d.js";import"./Sidebar-f54d9c6a.js";import"./DrawerMenu-c8394575.js";import"./chunk-65IR7CTH-f417bf63.js";import"./DangerButton-1b392152.js";function Et({auth:m,publications:r}){H();const i=P(),{processing:a,delete:I,get:p}=h(),[l,c]=s.useState(),{isOpen:n,onOpen:u,onClose:d}=k(),b=(t,o)=>{t.preventDefault(),p(route("admin.publications.edit",o))},f=(t,o)=>{t.preventDefault(),c(o),u()},x=s.useMemo(()=>[i.accessor("title",{cell:t=>t.getValue(),header:"Title"}),i.accessor("subtitle",{cell:t=>t.getValue(),header:"Subtitle"}),i.accessor("description",{cell:t=>t.getValue(),header:"Description"}),i.accessor("category.name",{cell:t=>t.getValue(),header:"Category"}),i.accessor("id",{cell:t=>e.jsxs(B,{spacing:4,children:[e.jsx(V,{onClick:o=>b(o,t.getValue()),isDisabled:a}),e.jsx(A,{onClick:o=>f(o,t.getValue()),isDisabled:a})]}),header:"Actions"})],[]);return e.jsxs(T,{user:m.user,children:[e.jsx(g,{title:"Manage Publications"}),e.jsx(y,{isOpen:n,onClose:d,id:l}),e.jsx(E,{mb:4,children:e.jsx(j,{href:route("admin.publications.create"),children:e.jsx(D,{children:"Add New Publication"})})}),r.data&&e.jsx(C,{defaultColumns:x,data:r.data})]})}export{Et as default};
