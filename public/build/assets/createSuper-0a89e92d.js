import{_ as c,a as l,b as y}from"./defineProperty-0e4f3c13.js";function i(e,t){(t==null||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function h(e,t){if(e){if(typeof e=="string")return i(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return i(e,t)}}function O(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,c(n.key),n)}}function v(e,t,r){return t&&u(e.prototype,t),r&&u(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}function g(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&l(e,t)}function o(e){return o=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(r){return r.__proto__||Object.getPrototypeOf(r)},o(e)}function p(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function s(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function b(e,t){if(t&&(y(t)==="object"||typeof t=="function"))return t;if(t!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return s(e)}function w(e){var t=p();return function(){var n=o(e),f;if(t){var a=o(this).constructor;f=Reflect.construct(n,arguments,a)}else f=n.apply(this,arguments);return b(this,f)}}export{h as _,i as a,g as b,w as c,O as d,v as e,s as f};