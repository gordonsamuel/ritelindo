import {footprint,overlaps,distance,entrance} from './planner-math.mjs';
import {RACK_CATALOG,catalogSpec,productDefaults,ATTACHMENT_KINDS} from './rack-catalog.mjs';
export function catalogInventory(){
 const items=RACK_CATALOG.map((product,i)=>{const size=productDefaults(product);return {...catalogSpec(product.id,size.width,size.depth,size.height,product.kind==='wall'?100:0),id:i+1,x:0,z:0,rotated:false};});
 const shelf=items.find(r=>r.productId==='single-30'),mesh=items.find(r=>r.productId==='mundo-feet');
 for(const item of items.filter(r=>ATTACHMENT_KINDS.includes(r.kind)))item.attachTo=['hook','double-hook'].includes(item.kind)?mesh.id:shelf.id;
 const basket=items.find(r=>r.productId==='shopping-hand');
 for(let i=0;i<3;i++)items.push({...basket,id:items.length+1});
 return items;
}
export function catalogLayout(room,target){
 const inventory=catalogInventory();
 for(let grow=0;grow<=20;grow++){
  const proposed={...room,width:Math.min(20,room.width+grow),depth:Math.min(25,room.depth+grow),height:Math.max(2.8,room.height)};
  const result=autoLayout(proposed,inventory,target);
  if(!result.failed.length)return {...result,room:proposed,expanded:proposed.width!==room.width||proposed.depth!==room.depth||proposed.height!==room.height};
 }
 return {...autoLayout(room,inventory,target),room,expanded:false};
}
export function autoLayout(room,inventory,target){
 const aisle=Math.max(1.2,target),placed=[],pending=[],children=[],stacks=new Map();
 const corridor={left:room.width/2-aisle/2,right:room.width/2+aisle/2,front:0,back:room.depth};
 const stock=inventory.map(r=>{const copy={...r};delete copy.stackTo;delete copy.stackLevel;return copy;});
 for(const r of stock){if(r.attachTo){children.push(r);continue;}if(r.kind==='shopping-basket'){const host=stacks.get(r.productId||r.kind);if(host){r.stackTo=host.id;r.stackLevel=children.filter(c=>c.stackTo===host.id).length+1;children.push(r);continue;}stacks.set(r.productId||r.kind,r);}pending.push(r);}
 const priority=r=>['checkout','checkout-display'].includes(r.kind)?0:['shopping-basket','rolling-basket','trolley'].includes(r.kind)?1:r.kind==='wall'?2:r.kind==='single'?3:4;
 pending.sort((a,b)=>priority(a)-priority(b)||b.width*b.depth-a.width*a.depth);
 const failed=[];
 for(const r of pending){
  const candidates=[];const front=priority(r)<=1;
  for(const rotated of (r.kind==='wall'?[false,true]:r.kind==='single'?[true,false]:[false,true])){
   const w=rotated?r.depth:r.width,d=rotated?r.width:r.depth;
   for(let z=d/2+.04;z<=room.depth-d/2-.03;z+=.15)for(let x=w/2+.04;x<=room.width-w/2-.03;x+=.15){
    if(r.kind==='wall'){if(rotated?Math.abs(x+w/2-room.width)>.12:Math.abs(z+d/2-room.depth)>.12)continue;}
    const candidate={...r,x,z,rotated};const box=footprint(candidate);
    if(overlaps(box,corridor)||overlaps(box,entrance(room))||r.height+(r.mountHeight||0)>room.height)continue;
    if(placed.some(other=>overlaps(box,footprint(other))||distance(box,footprint(other))+.001<aisle))continue;
    const edge=Math.min(box.left,room.width-box.right,room.depth-box.back);
    candidates.push({candidate,score:front?z*10+(r.kind==='checkout'?x:-x):r.kind==='single'?edge*20-z:r.kind==='wall'?-z:Math.abs(z-room.depth*.55)+edge*.1});
   }
  }
  candidates.sort((a,b)=>a.score-b.score);
  if(candidates.length)placed.push(candidates[0].candidate);else failed.push(r.id);
 }
 for(const child of children){const host=placed.find(r=>r.id===(child.attachTo||child.stackTo));if(!host||child.width>host.width+.001||(child.stackTo&&host.height+child.stackLevel*.08>Math.min(1.2,room.height))){failed.push(child.id);continue;}placed.push({...child,x:host.x,z:host.z,rotated:host.rotated});}
 return {racks:placed,failed,aisle,corridor};
}
