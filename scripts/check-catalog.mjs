import assert from 'node:assert/strict';
import { RACK_CATALOG, catalogSpec,productDefaults,ATTACHMENT_KINDS } from '../src/rack-catalog.mjs';
import {PRODUCTS} from '../src/products-data.mjs';
import { suggest, assess, layoutMessage } from '../src/planner-math.mjs';
const room = { width: 6, depth: 8, height: 2.8 };
assert.equal(RACK_CATALOG.length, 21);
assert.equal(PRODUCTS.length,18);
assert.equal(new Set(RACK_CATALOG.map(p => p.id)).size, 21);
const single = catalogSpec('single-30',90,35,200);
assert.equal(single.width,.9); assert.equal(single.depth,.35); assert.equal(single.height,2);
assert.equal(single.adjusted,false);
assert.equal(catalogSpec('single-30',120,35,180).adjusted,true);
assert.equal(catalogSpec('wall-3',100,25,60,100).adjusted,true);
assert.equal(catalogSpec('double-30',90,65,200).adjusted,true);
assert.equal(catalogSpec('custom',90,35,180).productId,undefined);
assert.match(catalogSpec('double-35',90,65,180).sourceNote,/konfirmasi/);
assert.match(catalogSpec('mundo-post',90,40,180).sourceNote,/perkiraan/);
for (const product of RACK_CATALOG) {
  const defaults=productDefaults(product);
  const spec=catalogSpec(product.id,defaults.width,defaults.depth,defaults.height,product.kind==='wall'?100:0);
  if(ATTACHMENT_KINDS.includes(product.kind)){
    const host={...catalogSpec('mundo-feet',90,40,180),id:1,x:1,z:2,rotated:false};
    const accessory={...spec,id:2,x:1,z:2,attachTo:1,rotated:false};
    assert.equal(assess(room,[host,accessory],1.2).issues.length,0,product.id);
    assert.ok(assess(room,[accessory],1.2).issues.length>0);
    continue;
  }
  const racks=suggest(room,spec,1.2);
  assert.ok(racks.length>0,product.id);
  assert.equal(assess(room,racks,1.2).issues.length,0,product.id);
  assert.match(layoutMessage(room,racks,1.2,assess(room,racks,1.2)),/storack.id/);
}
const wall={...catalogSpec('wall-2',90,25,80,100),id:1,x:1,z:7.835,rotated:false};
assert.equal(assess(room,[wall],1.2).issues.length,0);
assert.match(assess(room,[{...wall,z:4}],1.2).issues.join(' '),/dinding penopang/);
assert.match(assess(room,[{...wall,mountHeight:2.2}],1.2).issues.join(' '),/lebih tinggi/);
const rotated={...wall,rotated:true,x:5.835,z:4};
assert.equal(assess(room,[rotated],1.2).issues.length,0);
console.log('PASS: 21 presets, 18 product families, attachment hosts, source-aware dimensions and suggested layouts');
