var n={ease:[.25,.1,.25,1],easeIn:[.4,0,1,1],easeOut:[0,0,.2,1],easeInOut:[.4,0,.2,1]},i={scale:{enter:{scale:1},exit:{scale:.95}},fade:{enter:{opacity:1},exit:{opacity:0}},pushLeft:{enter:{x:"100%"},exit:{x:"-30%"}},pushRight:{enter:{x:"-100%"},exit:{x:"30%"}},pushUp:{enter:{y:"100%"},exit:{y:"-30%"}},pushDown:{enter:{y:"-100%"},exit:{y:"30%"}},slideLeft:{position:{left:0,top:0,bottom:0,width:"100%"},enter:{x:0,y:0},exit:{x:"-100%",y:0}},slideRight:{position:{right:0,top:0,bottom:0,width:"100%"},enter:{x:0,y:0},exit:{x:"100%",y:0}},slideUp:{position:{top:0,left:0,right:0,maxWidth:"100vw"},enter:{x:0,y:0},exit:{x:0,y:"-100%"}},slideDown:{position:{bottom:0,left:0,right:0,maxWidth:"100vw"},enter:{x:0,y:0},exit:{x:0,y:"100%"}}};function s(t){var e;switch((e=t==null?void 0:t.direction)!=null?e:"right"){case"right":return i.slideRight;case"left":return i.slideLeft;case"bottom":return i.slideDown;case"top":return i.slideUp;default:return i.slideRight}}var o={enter:{duration:.2,ease:n.easeOut},exit:{duration:.1,ease:n.easeIn}},a={enter:(t,e)=>({...t,delay:typeof e=="number"?e:e==null?void 0:e.enter}),exit:(t,e)=>({...t,delay:typeof e=="number"?e:e==null?void 0:e.exit})};export{n as T,o as a,s as g,a as w};
