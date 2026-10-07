// All lengths are metres. Rack x/z coordinates are footprint centres.
export function footprint(rack) {
  const w = rack.rotated ? rack.depth : rack.width;
  const d = rack.rotated ? rack.width : rack.depth;
  return { left: rack.x - w / 2, right: rack.x + w / 2, front: rack.z - d / 2, back: rack.z + d / 2 };
}
export function overlaps(a, b) {
  const epsilon = 0.001;
  return a.left < b.right - epsilon && a.right > b.left + epsilon && a.front < b.back - epsilon && a.back > b.front + epsilon;
}
export function distance(a, b) {
  const dx = Math.max(a.left - b.right, b.left - a.right, 0);
  const dz = Math.max(a.front - b.back, b.front - a.back, 0);
  return Math.hypot(dx, dz);
}
export function entrance(room) {
  return { left: room.width / 2 - 0.6, right: room.width / 2 + 0.6, front: 0, back: 1.2 };
}
export function assess(room, racks, aisle) {
  const issues = [], invalid = new Set();
  let minGap = Infinity;
  const physical = racks.filter(r => !r.attachTo && !r.stackTo);
  const area = physical.reduce((total, rack) => total + rack.width * rack.depth, 0);
  for(const basket of racks.filter(r=>r.stackTo)){
    const host=physical.find(r=>r.id===basket.stackTo);
    if(!host||host.kind!=='shopping-basket'||basket.kind!=='shopping-basket'||host.productId!==basket.productId){issues.push(`Keranjang ${basket.id} tidak memiliki penopang tumpukan yang sesuai.`);invalid.add(basket.id);}
    else if(host.height+basket.stackLevel*.08>Math.min(1.2,room.height)){issues.push(`Tumpukan keranjang ${basket.id} lebih tinggi dari batas 1,2 m.`);invalid.add(basket.id);}
  }
  for (const accessory of racks.filter(r => r.attachTo)) {
    const host=physical.find(r => r.id===accessory.attachTo);
    if (!host) { issues.push(`Aksesoris ${accessory.id} kehilangan rak penopang.`); invalid.add(accessory.id); }
    else if (accessory.width > host.width) { issues.push(`Aksesoris ${accessory.id} lebih panjang dari rak penopang.`); invalid.add(accessory.id); }
  }
  racks = physical;
  for (let i = 0; i < racks.length; i++) {
    const rack = racks[i], box = footprint(rack);
    if (box.left < -0.001 || box.right > room.width + 0.001 || box.front < -0.001 || box.back > room.depth + 0.001) {
      issues.push(`Rak ${rack.id} melewati batas ruangan.`); invalid.add(rack.id);
    }
    if (rack.height + (rack.mountHeight || 0) > room.height) { issues.push(`Rak ${rack.id} lebih tinggi dari ruangan setelah memperhitungkan pemasangan.`); invalid.add(rack.id); }
    if (rack.kind === 'wall') {
      const wallGap = rack.rotated ? Math.abs(room.width - box.right) : Math.abs(room.depth - box.back);
      if (wallGap > .12) { issues.push(`Rak dinding ${rack.id} belum dekat dinding penopang (belakang, atau kanan setelah diputar).`); invalid.add(rack.id); }
    }
    if (overlaps(box, entrance(room))) { issues.push(`Rak ${rack.id} menghalangi area pintu depan.`); invalid.add(rack.id); }
    for (let j = i + 1; j < racks.length; j++) {
      const other = racks[j], otherBox = footprint(other);
      if (overlaps(box, otherBox)) {
        issues.push(`Rak ${rack.id} bertabrakan dengan rak ${other.id}.`); invalid.add(rack.id); invalid.add(other.id);
      } else {
        const gap = distance(box, otherBox);
        minGap = Math.min(minGap, gap);
        if (gap + 0.001 < aisle) {
          issues.push(`Jarak rak ${rack.id}–${other.id} ${gap.toFixed(2)} m, di bawah target ${aisle.toFixed(2)} m.`);
          invalid.add(rack.id); invalid.add(other.id);
        }
      }
    }
  }
  return { issues, invalid, minGap: Number.isFinite(minGap) ? minGap : null, area, occupancy: area / (room.width * room.depth) * 100 };
}
export function suggest(room, dimensions, aisle) {
  const racks = [];
  let id = 1;
  // Separate modules rather than pretending to solve retail circulation automatically.
  const startZ = dimensions.kind === 'wall' ? room.depth - dimensions.depth / 2 - .04 : 1.2 + dimensions.depth / 2;
  const endZ = dimensions.kind === 'wall' ? room.depth : room.depth - .3;
  // Leave one centimetre for coordinate rounding, including half-centimetre footprints.
  for (let z = startZ; z + dimensions.depth / 2 <= endZ; z += dimensions.depth + aisle + .01) {
    for (let x = 0.3 + dimensions.width / 2; x + dimensions.width / 2 <= room.width - 0.3; x += dimensions.width + aisle + .01) {
      const rack = { ...dimensions, id, x: Math.round(x * 100) / 100, z: Math.round(z * 100) / 100, rotated: false };
      if (dimensions.height + (dimensions.mountHeight || 0) <= room.height && !overlaps(footprint(rack), entrance(room))) { racks.push(rack); id++; }
      if (racks.length >= 24) return racks;
    }
  }
  return racks;
}
export function layoutMessage(room, racks, aisle, assessment) {
  return [
    'Rencana layout dari simulator (referensi katalog dan ukuran custom; perlu verifikasi tim):',
    `Ruangan: ${room.width} × ${room.depth} m; tinggi ${room.height} m.`,
    `Jumlah rak: ${racks.length}; target jarak antar-rak: ${aisle} m.`,
    ...racks.filter(r=>r.stackTo).map(r=>`Keranjang ${r.id} ditumpuk pada keranjang ${r.stackTo}, urutan ${r.stackLevel}; jarak susun ilustratif 8 cm, perlu konfirmasi produk.`),
    ...racks.filter(r=>r.attachTo).map(r=>`Aksesoris ${r.id} dipasang pada modul ${r.attachTo}; posisi mengikuti modul penopang.`),
    ...racks.map(r => `Rak ${r.id}${r.productName ? ` · ${r.productName}${r.adjusted ? ' (ukuran disesuaikan)' : ''}` : ' · Custom'}: ${r.width} × ${r.depth} × ${r.height} m; pusat posisi X ${r.x.toFixed(2)} m, Y ${r.z.toFixed(2)} m; putaran ${r.rotated ? 90 : 0}°.${r.kind === 'wall' ? ` Tinggi pemasangan ${r.mountHeight} m.` : ''}`),
    ...[...new Map(racks.filter(r => r.source).map(r => [r.productId, r])).values()].map(r => `Referensi ${r.productName}: ${r.source}${r.sourceNote ? ` Catatan: ${r.sourceNote}` : ''}`),
    `Status: ${assessment.issues.length ? assessment.issues.join(' ') : 'Tidak ada konflik pada pemeriksaan sederhana.'}`,
    'Mohon bantu cek spesifikasi produk, sirkulasi, dan layout final.'
  ].join('\n');
}
