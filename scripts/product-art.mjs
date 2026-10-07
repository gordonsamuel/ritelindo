export function illustration(product){
  const kind=product.kind;let shapes='';
  const p=(x,y,z)=>[260+(x-y)*100,355+(x+y)*38-z*125];
  const poly=(points,fill)=>`<polygon points="${points.map(v=>p(...v).join(',')).join(' ')}" fill="${fill}" stroke="#8297a6" stroke-width="1.2" stroke-linejoin="round"/>`;
  const line=(a,b,color='#8297a6',width=2)=>{const aa=p(...a),bb=p(...b);return `<path d="M${aa} L${bb}" fill="none" stroke="${color}" stroke-width="${width}"/>`;};
  const box=(x,y,z,w,d,h)=>{shapes+=poly([[x,y,z],[x+w,y,z],[x+w,y,z+h],[x,y,z+h]],'#e5ebef');shapes+=poly([[x,y,z],[x,y+d,z],[x,y+d,z+h],[x,y,z+h]],'#cbd8e0');shapes+=poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],'#fafcfd');};
  const posts=()=>{for(const x of [-.8,.8])box(x,-.32,0,.045,.64,1.8);};
  if(['single','double','wall','basket'].includes(kind)){
    const count=kind==='wall'?(product.variants[0].levels||3):5;posts();
    if(kind==='single')box(-.8,-.3,.1,1.6,.025,1.65);
    for(let i=0;i<count;i++){const z=.1+i*1.55/(count-1);box(-.8,-.3,z,1.6,kind==='single'?.55:.85,.035);if(kind==='basket')for(const x of [-.8,.8])box(x,-.3,z,.025,.85,.15);}
    if(kind==='double')for(let i=0;i<5;i++)box(-.8,-.85,.1+i*.39,1.6,.55,.035);
  }else if(kind==='mesh'){
    const color=product.slug.includes('tiang')?'#b73832':'#8197a6';
    for(let x=-.8;x<=.8;x+=.12)shapes+=line([x,0,.1],[x,0,1.9],color);
    for(let z=.1;z<=1.9;z+=.14)shapes+=line([-.8,0,z],[.8,0,z],color);
    for(const x of [-.8,.8]){shapes+=line([x,0,0],[x,0,1.9],color,5);shapes+=line([x,-.4,0],[x,.4,0],color,5);}
  }else if(kind.startsWith('checkout')){box(-1,-.45,0,2,.9,.95);box(-1.05,-.5,.95,2.1,1,.07);if(kind==='checkout-display')for(let i=0;i<3;i++)box(-.9,-.65,.15+i*.25,1.8,.2,.025);}
  else if(['shopping-basket','rolling-basket','trolley'].includes(kind)){
    const bottom=kind==='trolley'?.5:0, height=kind==='trolley'?1.3:.85;
    box(-.7,-.4,bottom,1.4,.8,.035);
    for(let x=-.7;x<=.7;x+=.12)for(const y of [-.4,.4])shapes+=line([x,y,bottom],[x,y,height]);
    for(let z=bottom;z<=height;z+=.15)shapes+=line([-.7,-.4,z],[.7,-.4,z]);
    for(const y of [-.4,.4])shapes+=line([-.7,y,height],[.7,y,height],'#274b65',4);
    for(const x of [-.7,.7])shapes+=line([x,-.4,height],[x,.4,height],'#274b65',4);
    if(kind!=='shopping-basket')for(const x of [-.55,.55])for(const y of [-.3,.3]){const c=p(x,y,.05);shapes+=`<circle cx="${c[0]}" cy="${c[1]}" r="9" fill="#29495f"/>`;shapes+=line([x,y,.1],[x,y,bottom]);}
  }else if(kind==='pricetag'){box(-1.2,0,.8,2.4,.08,.17);shapes+=poly([[-1.15,0,.83],[1.15,0,.83],[1.15,0,.94],[-1.15,0,.94]],'#f3aa65');}
  else if(kind==='stopper'){for(let x=-1.2;x<=1.2;x+=.15)shapes+=line([x,0,.5],[x,0,.95]);shapes+=line([-1.2,0,.95],[1.2,0,.95],'#668091',4);}
  else{for(const x of kind==='double-hook'?[-.12,.12]:[0]){shapes+=line([x,0,.8],[x,-1.6,.8],'#627f93',5);shapes+=line([x,-1.6,.8],[x,-1.6,.95],'#627f93',5);}if(kind==='double-hook')box(-.25,-1.65,.9,.5,.025,.18);}
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 450"><rect width="560" height="450" fill="#f1f5f7"/><ellipse cx="280" cy="394" rx="155" ry="20" fill="#dce6ec"/>${shapes}</svg>`;
}
