import assert from 'node:assert/strict';
import { footprint, assess, suggest, layoutMessage } from '../src/planner-math.mjs';
const room = { width: 6, depth: 8, height: 2.8 };
const rack = { id: 1, x: 1, z: 3, width: 1.2, depth: .8, height: 1.8, rotated: false };
assert.ok(Math.abs(footprint({ ...rack, rotated: true }).right - footprint({ ...rack, rotated: true }).left - .8) < 1e-9);
assert.equal(assess(room, [rack], 1.2).issues.length, 0);
assert.match(assess(room, [rack, { ...rack, id: 2 }], 1.2).issues.join(' '), /bertabrakan/);
assert.match(assess(room, [{ ...rack, x: 0 }], 1.2).issues.join(' '), /batas ruangan/);
assert.match(assess(room, [{ ...rack, x: 3, z: .8 }], 1.2).issues.join(' '), /pintu/);
assert.match(assess(room, [{ ...rack, height: 3 }], 1.2).issues.join(' '), /lebih tinggi/);
assert.match(assess(room, [rack, { ...rack, id: 2, x: 2.3 }], 1.2).issues.join(' '), /di bawah target/);
for (const r of [{ width: 3, depth: 3, height: 2 }, room, { width: 20, depth: 25, height: 5 }]) {
  const result = suggest(r, rack, 1.2);
  assert.ok(result.length <= 24);
  assert.equal(assess(r, result, 1.2).issues.length, 0);
}
assert.equal(suggest(room, { ...rack, height: 3 }, 1.2).length, 0);
assert.match(layoutMessage(room, [rack], 1.2, assess(room, [rack], 1.2)), /Rak 1.*pusat posisi X/);
console.log('PASS: rotation, overlap, boundaries, entrance, height, spacing, suggested layouts, message summary');
