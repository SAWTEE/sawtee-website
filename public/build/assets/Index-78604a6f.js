import{R as a,j as t,a as l}from"./app-efa55958.js";import{D as s,c}from"./DataTable-ddb92c83.js";import d from"./AuthenticatedLayout-f593e457.js";import{T as m}from"./chunk-RPO2WXNL-40bd1539.js";import"./chunk-DEQZ7DVA-e22fe2bd.js";import"./index-8eb40aa2.js";import"./iconBase-93c9f5ca.js";import"./chunk-W7WUSNWJ-1d37fd26.js";import"./chunk-2OOHT3W5-8a8b58d4.js";import"./chunk-R3DH46PF-f0689d26.js";import"./chunk-3ASUQ6PA-f62de13d.js";import"./chunk-ZHMYA64R-2b67766a.js";import"./chunk-G72KV6MB-dbbc8cf4.js";import"./chunk-7OLJDQMT-7f99fc6b.js";import"./chunk-PULVB27S-076b392b.js";import"./chunk-NABYTFTG-9c5cf35d.js";import"./chunk-UVUR7MCU-f950a53f.js";import"./objectWithoutPropertiesLoose-4f48578a.js";import"./defineProperty-0e4f3c13.js";import"./chunk-ROURZMX4-1c85f1b1.js";import"./chunk-3XANSPY5-cf37bc50.js";import"./chunk-RAWN7VJ3-58bfc8aa.js";import"./chunk-4FCEGNGT-53b0de1a.js";import"./chunk-6NHXDBFO-987cde81.js";import"./chunk-6CVSDS6C-e8322ee8.js";import"./chunk-QINAG4RG-420d55bb.js";import"./chunk-SPIKMR6I-154a1106.js";import"./chunk-CWVAJCXJ-a17c2167.js";import"./index-979d1106.js";import"./chunk-6QYXN73V-98651dd0.js";import"./chunk-3RSXBRAN-bbea2ba3.js";import"./index.esm-e20009f6.js";import"./Header-b82d824c.js";import"./chunk-GB67EJMB-31fceaa8.js";import"./chunk-KRPLQIP4-2070ff1c.js";import"./chunk-VXCSBZ7K-e8c56e53.js";import"./chunk-57I6FYPZ-4990f36c.js";import"./chunk-2ZHRCML3-86ac23ee.js";import"./chunk-FKYN3ZGE-f31ed73d.js";import"./chunk-UZJ3TPNQ-b2d78fd3.js";import"./chunk-OCNORRQU-3e952216.js";import"./index-ba18a0bd.js";import"./index-01a9cce7.js";import"./index-4647d92d.js";import"./Sidebar-7bd11e29.js";import"./DrawerMenu-6b99c556.js";import"./chunk-7JBTTEVG-dc1f3de8.js";import"./chunk-65IR7CTH-afe037a9.js";function pr({auth:e,subscribers:i}){const o=c(),p=a.useMemo(()=>[o.accessor("id",{cell:r=>r.getValue(),header:"ID"}),o.accessor("email",{cell:r=>r.getValue(),header:"Email"}),o.accessor("verified_at",{cell:r=>r.getValue()!==null?t.jsx(m,{colorScheme:"green",children:"Verified"}):t.jsx(m,{colorScheme:"red",children:"Not Verified"}),header:"Verified"})],[]);return t.jsxs(d,{user:e.user,children:[t.jsx(l,{title:"Subscribers"}),i&&t.jsx(s,{defaultColumns:p,data:i.data})]})}export{pr as default};
