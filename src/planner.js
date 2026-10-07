import {autoLayout,catalogLayout} from './auto-layout.mjs';
import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import { assess, footprint, entrance, suggest, layoutMessage } from './planner-math.mjs';
import { RACK_CATALOG, catalogSpec, productDefaults, ATTACHMENT_KINDS } from './rack-catalog.mjs';

const $ = id => document.getElementById(id);
const view = $('planner-view');
const state = { room: { width: 6, depth: 8, height: 2.8 }, aisle: 1.2, racks: [], selected: null, nextId: 1, yaw: -.55, top: false, mode: 'camera', panel: 'room' };
let renderer, scene, camera, controls, directional, rackGroup, roomGroup, selectionBox, dragging = null, dragOffset, pointerStart, frame;
const ray = new THREE.Raycaster(), pointer = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
let resizeObserver;
let automaticRoute=false;

function dimensions() { return catalogSpec($('rack-product').value, +$('rack-width').value, +$('rack-depth').value, +$('rack-height').value, +$('rack-mount').value); }
function catalogDisplay() {
  const product = RACK_CATALOG.find(p => p.id === $('rack-product').value);
  $('catalog-variants').hidden = !product;

  $('mount-field').hidden = product?.kind !== 'wall';
  $('attachment-field').hidden = !ATTACHMENT_KINDS.includes(product?.kind);
  $('catalog-width-field').hidden = !product?.widths;
  $('catalog-depth-field').hidden = !product?.depths;
  if (!product) { $('catalog-note').textContent = 'Ukuran dan bentuk contoh dapat disesuaikan sendiri.'; $('catalog-note').classList.remove('catalog-unconfirmed'); return; }
  const variant = $('catalog-height'); variant.replaceChildren();
  product.heights.forEach(height => { const option = document.createElement('option'); option.value = height; option.textContent = `${height} cm`; variant.append(option); });
  if (!product.heights.includes(+$('rack-height').value)) { const option = document.createElement('option'); option.value = $('rack-height').value; option.textContent = `${$('rack-height').value} cm · disesuaikan`; variant.append(option); }
  variant.value = $('rack-height').value;
  $('catalog-height-label').textContent = product.heightUnconfirmed ? 'Tinggi awal · perkiraan' : 'Pilihan tinggi katalog';
  for (const [field,values,current] of [['catalog-width',product.widths,$('rack-width').value],['catalog-depth',product.depths,$('rack-depth').value]]) {
    $(field).replaceChildren(); (values||[]).forEach(value=>{const option=document.createElement('option');option.value=value;option.textContent=`${value} cm`;$(field).append(option);}); $(field).value=current;
  }

  $('catalog-note').textContent = product.note || 'Dimensi mengacu pada katalog. Bentuk 3D disederhanakan; jumlah susun gondola/keranjang bersifat ilustratif.';
  $('catalog-note').classList.toggle('catalog-unconfirmed', Boolean(product.note));
}
function chooseProduct() {
  const product = RACK_CATALOG.find(p => p.id === $('rack-product').value);
  if (product) {
    const defaults=productDefaults(product); $('rack-width').value = defaults.width; $('rack-depth').value = defaults.depth; $('rack-height').value = defaults.height;
    $('rack-mount').value = product.kind === 'wall' ? 100 : 0;
  }
  catalogDisplay();
  $('catalog-feedback').textContent = 'Pilihan siap. Tambahkan rak baru, atau terapkan pada rak terpilih.';
}
function validDimensions() { if (!$('rack-dimensions').checkValidity()) inspector('racks'); return $('rack-dimensions').reportValidity(); }
function selected() { return state.racks.find(r => r.id === state.selected); }
function disposeGroup(group) {
  if (!group) return;
  group.traverse(o => { o.geometry?.dispose(); if (Array.isArray(o.material)) o.material.forEach(m => { m.map?.dispose(); m.dispose(); }); else { o.material?.map?.dispose(); o.material?.dispose(); } });
  scene.remove(group);
}
function box(group, size, position, color, opacity = 1) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), new THREE.MeshStandardMaterial({ color, transparent: opacity < 1, opacity, roughness: .7 }));
  mesh.castShadow = opacity === 1; mesh.receiveShadow = opacity === 1;
  mesh.position.set(...position); group.add(mesh); return mesh;
}
function render() { if (renderer) renderer.render(scene, camera); }
function requestRender() { if (!frame) frame = requestAnimationFrame(() => { frame = null; render(); }); }
function inspector(panel) {
  state.panel = panel;
  document.querySelectorAll('[data-panel]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.panel === panel)));
  document.querySelectorAll('[data-inspector]').forEach(el => el.hidden = el.dataset.inspector !== panel);
}
function cameraCaption() {
  if (!controls || state.mode !== 'camera') return;
  const angle = Math.round((controls.getAzimuthalAngle() * 180 / Math.PI + 360) % 360);
  $('view-caption').textContent = state.top ? 'Denah · tampak atas' : `Kamera 360° · sudut ${angle}°`;
}
function interaction(mode) {
  state.mode = mode; view.dataset.mode = mode;
  $('mode-camera').setAttribute('aria-pressed', String(mode === 'camera'));
  $('mode-edit').setAttribute('aria-pressed', String(mode === 'edit'));
  $('gesture-hint').textContent = mode === 'camera' ? 'Drag untuk putar · scroll / cubit untuk zoom · dua jari untuk geser' : 'Pilih lalu geser rak · tombol panah menggeser rak 10 cm';
  $('view-caption').textContent = mode === 'camera' ? 'Kamera 360° · drag untuk menjelajah' : 'Atur penempatan · snap 10 cm';
  controls.enableRotate = mode === 'camera'; controls.enablePan = mode === 'camera';
  if (mode === 'edit') inspector('racks');
  cameraCaption();
}
function label(group, text, position, scale = 1) {
  const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 80;
  const ctx = canvas.getContext('2d'); ctx.fillStyle = '#102d45'; ctx.fillRect(0, 0, 256, 80); ctx.fillStyle = '#fff'; ctx.font = 'bold 32px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 128, 40);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false })); sprite.position.set(...position); sprite.scale.set(scale, scale / 3.2, 1); group.add(sprite);
}
function cameraPosition() {
  const { width: w, depth: d } = state.room, size = Math.max(w, d);
  const target = new THREE.Vector3(w / 2, 0, d / 2);
  const fit = Math.max(1, 1.25 / camera.aspect);
  if (state.top) camera.position.set(w / 2, size * 1.55 * fit, d / 2 + .001);
  else camera.position.set(w / 2 + Math.sin(state.yaw) * size * 1.05 * fit, size * .95 * fit, d / 2 - Math.cos(state.yaw) * size * 1.05 * fit);
  camera.lookAt(target); camera.near = .1; camera.far = size * 10; camera.updateProjectionMatrix(); render();
  if (controls) { controls.target.copy(target); controls.minDistance = 2; controls.maxDistance = size * 5; controls.update(); controls.saveState(); }
}
function drawRoom() {
  disposeGroup(roomGroup); roomGroup = new THREE.Group(); scene.add(roomGroup);
  const { width: w, depth: d, height: h } = state.room;
  box(roomGroup, [w, .06, d], [w / 2, -.05, d / 2], '#e8edf0');
  // Transparent walls are orientation guides and do not cast shadows.
  box(roomGroup, [w, h, .07], [w / 2, h / 2, d], '#b8c8d3', .12);
  box(roomGroup, [.07, h, d], [0, h / 2, d / 2], '#b8c8d3', .10);
  directional.position.set(w / 2 - 4, 12, d / 2 - 4); directional.target.position.set(w / 2, 0, d / 2); directional.target.updateMatrixWorld();
  directional.shadow.camera.left = -Math.max(w, d); directional.shadow.camera.right = Math.max(w, d); directional.shadow.camera.top = Math.max(w, d); directional.shadow.camera.bottom = -Math.max(w, d); directional.shadow.camera.updateProjectionMatrix();
  const points = [];
  for (let x = 0; x <= w; x += .5) points.push(x, .001, 0, x, .001, d);
  for (let z = 0; z <= d; z += .5) points.push(0, .001, z, w, .001, z);
  const gridGeometry = new THREE.BufferGeometry(); gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  roomGroup.add(new THREE.LineSegments(gridGeometry, new THREE.LineBasicMaterial({ color: '#c6d3dc', transparent: true, opacity: .6 })));
  const door = entrance(state.room);
  if(automaticRoute)box(roomGroup,[Math.max(1.2,state.aisle),.012,d],[w/2,.008,d/2],'#bfdfd4');
  box(roomGroup, [door.right - door.left, .015, door.back], [w / 2, .015, door.back / 2], '#f4bd83');
  const outline = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, .02, d)), new THREE.LineBasicMaterial({ color: '#536f85' }));
  outline.position.set(w / 2, .005, d / 2); roomGroup.add(outline);
  label(roomGroup, `Lebar ${w} m`, [w / 2, .15, -.6], 1.6);
  label(roomGroup, `${d} m`, [w + .4, .15, d / 2], 1);
  label(roomGroup, 'PINTU', [w / 2, .2, .6], .9);
  cameraPosition();
}
function drawRackBody(group, r, upright, shelf) {
  if (r.kind === 'checkout' || r.kind === 'checkout-display') {
    box(group,[r.width-.08,r.height-.08,r.depth-.05],[0,(r.height-.08)/2,0],upright);
    box(group,[r.width,.05,r.depth],[0,r.height-.025,0],shelf);
    if(r.kind==='checkout-display') for(let i=0;i<3;i++) box(group,[r.width-.12,.025,r.depth*.22],[0,.15+i*r.height*.25,-r.depth*.4],shelf);
    return;
  }
  if (['shopping-basket','rolling-basket','trolley'].includes(r.kind)) {
    const bottom=r.kind==='trolley'?r.height*.3:.04, basketHeight=r.height-bottom;
    box(group,[r.width,.025,r.depth],[0,bottom,0],shelf);
    for(const z of [-r.depth/2,r.depth/2]) {
      box(group,[r.width,.02,.02],[0,r.height,z],upright);
      for(let x=-r.width/2;x<=r.width/2;x+=.07) box(group,[.012,basketHeight,.012],[x,bottom+basketHeight/2,z],upright);
    }
    for(const x of [-r.width/2,r.width/2]) box(group,[.02,.02,r.depth],[x,r.height,0],upright);
    if(r.kind!=='shopping-basket') for(const x of [-r.width*.35,r.width*.35]) for(const z of [-r.depth*.35,r.depth*.35]) {
      box(group,[.025,bottom,.025],[x,bottom/2,z],upright);
      const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,.025,12),new THREE.MeshStandardMaterial({color:'#364957'}));wheel.rotation.z=Math.PI/2;wheel.position.set(x,.04,z);group.add(wheel);
    }
    return;
  }
  if(ATTACHMENT_KINDS.includes(r.kind)) {
    if(r.kind==='pricetag') box(group,[r.width,r.height,r.depth],[0,r.height/2,0],'#ed974b');
    else if(r.kind==='stopper') {
      box(group,[r.width,.004,.004],[0,r.height,0],upright);
      for(let x=-r.width/2;x<=r.width/2;x+=.1) box(group,[.004,r.height,.004],[x,r.height/2,0],upright);
    } else {
      for(const x of r.kind==='double-hook'?[-.012,.012]:[0]) { box(group,[.006,.006,r.depth],[x,.02,-r.depth/2],upright);box(group,[.006,.035,.006],[x,.035,-r.depth],upright); }
      if(r.kind==='double-hook') box(group,[.05,.03,.008],[0,.04,-r.depth],'#ecf0f2');
    }
    return;
  }
  const half = r.width / 2 - .025;
  if (r.kind === 'mesh') {
    for (const x of [-half, half]) {
      box(group, [.045, r.height, .045], [x, r.height / 2, 0], upright);
      box(group, [.06, .06, r.depth], [x, .04, 0], upright);
    }
    const vertices = [];
    for (let x = -half; x <= half; x += .1) vertices.push(x, .12, 0, x, r.height - .08, 0);
    for (let y = .12; y < r.height; y += .12) vertices.push(-half, y, 0, half, y, 0);
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    group.add(new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: upright })));
    return;
  }
  if (r.kind === 'basket') {
    for (const x of [-half, half]) for (const z of [-r.depth / 2 + .025, r.depth / 2 - .025]) box(group, [.03,r.height,.03], [x,r.height / 2,z], upright);
    for (let i = 0; i < 4; i++) {
      const y = .12 + i * (r.height - .3) / 3;
      box(group, [r.width,.025,r.depth], [0,y,0], shelf);
      for (const z of [-r.depth / 2, r.depth / 2]) {
        box(group, [r.width,.025,.025], [0,y+.14,z], upright);
        for (let x = -half; x <= half; x += .1) box(group,[.012,.14,.012],[x,y+.07,z],upright);
      }
      for (const x of [-half,half]) box(group,[.025,.025,r.depth],[x,y+.14,0],upright);
    }
    return;
  }
  const single = r.kind === 'single' || r.kind === 'wall', double = r.kind === 'double';
  const back = single ? r.depth / 2 - .025 : 0;
  for (const x of [-half,half]) {
    if (single || double) {
      box(group, [.045,r.height,.045], [x,r.height/2,back],upright);
      if (r.kind !== 'wall') box(group,[.055,.06,r.depth],[x,.045,0],upright);
    } else for (const z of [-r.depth/2+.035,r.depth/2-.035]) box(group,[.055,r.height,.055],[x,r.height/2,z],upright);
  }
  const levels = r.levels || 5;
  for (let level = 0; level < levels; level++) {
    const y = .1 + level * (r.height - .22) / (levels - 1);
    const ratio = level ? (r.shelfRatio || 1) : 1;
    const depth = (double ? (r.depth - .04)/2 : r.depth-.035) * ratio;
    for (const side of double ? [-1,1] : [-1]) {
      const z = single ? back - depth/2 : double ? side*(depth/2+.015) : 0;
      box(group,[r.width,.03,depth],[0,y,z],shelf);
      box(group,[r.width,.045,.025],[0,y+.02,z+(single ? -1 : side)*depth/2],r.productId ? upright : '#ee954a');
    }
  }
  if (r.kind !== 'wall') box(group,[r.width-.06,r.height-.15,.02],[0,r.height/2,back],shelf);
}
function drawRacks(assessment) {
  disposeGroup(rackGroup); rackGroup = new THREE.Group(); scene.add(rackGroup);
  if (selectionBox) { selectionBox.geometry.dispose(); selectionBox.material.dispose(); scene.remove(selectionBox); selectionBox = null; }
  state.racks.forEach(r => {
    const host=r.attachTo?state.racks.find(item=>item.id===r.attachTo):null;
    const group = new THREE.Group(); group.position.set(r.x, r.mountHeight || 0, r.z); group.rotation.y = r.rotated ? Math.PI / 2 : 0; group.userData.rackId = r.id;
    if(r.stackTo){const host=state.racks.find(item=>item.id===r.stackTo);if(host)group.position.set(host.x,r.stackLevel*.08,host.z);}
    if(host){const offset=new THREE.Vector3(0,(host.mountHeight||0)+host.height*.6,-host.depth/2-.02); if(['hook','double-hook'].includes(r.kind)) {const siblings=state.racks.filter(item=>item.attachTo===host.id&&['hook','double-hook'].includes(item.kind));offset.x=(siblings.indexOf(r)-(siblings.length-1)/2)*.12;offset.z=0;} offset.applyAxisAngle(new THREE.Vector3(0,1,0),host.rotated?Math.PI/2:0);group.position.set(host.x+offset.x,offset.y,host.z+offset.z);group.rotation.y=host.rotated?Math.PI/2:0;}
    const invalid = assessment.invalid.has(r.id), upright = invalid ? '#cf423c' : (r.color || (r.productId ? '#cbd6df' : '#173f5d'));
    const shelf = invalid ? '#efb5b0' : '#edf3f6';
    drawRackBody(group, r, upright, shelf);
    const hit = box(group, [r.width, r.height, r.depth], [0, r.height / 2, 0], '#fff', 0);
    hit.material.depthWrite = false; hit.userData.rackId = r.id;
    const kind = { single: 'Single', double: 'Double', wall: 'Dinding', basket: 'Chiki', mesh: 'Mundo',checkout:'Kasir','checkout-display':'Kasir',trolley:'Troli','shopping-basket':'Keranjang','rolling-basket':'Keranjang' }[r.kind];
    if(!r.attachTo&&!r.stackTo) label(group, kind ? `${r.id} · ${kind}` : `Rak ${r.id}`, [0, r.height + .2, 0], .8);
    rackGroup.add(group);
    if (r.id === state.selected) {
      const f = footprint(r), helper = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(f.right - f.left + .08, r.height + .06, f.back - f.front + .08)), new THREE.LineBasicMaterial({ color: '#067b67' }));
      helper.position.copy(group.position).add(new THREE.Vector3(0,r.height/2,0)); scene.add(helper); selectionBox = helper;
    }
  });
}
function update() {
  for(const child of state.racks.filter(r=>r.attachTo||r.stackTo)){const host=state.racks.find(r=>r.id===(child.attachTo||child.stackTo));if(host){child.x=host.x;child.z=host.z;child.rotated=host.rotated;}}
  const result = assess(state.room, state.racks, state.aisle);
  if(automaticRoute){const half=Math.max(1.2,state.aisle)/2;for(const r of state.racks.filter(r=>!r.attachTo&&!r.stackTo)){const f=footprint(r);if(f.left<state.room.width/2+half-.001&&f.right>state.room.width/2-half+.001){result.issues.push(`Modul ${r.id} menghalangi jalur utama pelanggan.`);result.invalid.add(r.id);}}}
  drawRacks(result);
  $('planner-count').textContent = `${state.racks.length}`;
  $('planner-area').textContent = `${result.occupancy.toFixed(0)}%`;
  $('planner-gap').textContent = result.minGap === null ? '—' : `${result.minGap.toFixed(2)} m`;
  $('room-caption').textContent = `Toko Anda · ${state.room.width} × ${state.room.depth} m`;
  $('issue-count').textContent = result.issues.length;
  $('issue-count').classList.toggle('has-issue', result.issues.length > 0);
  $('layout-health').textContent = result.issues.length ? `${result.issues.length} catatan penempatan` : state.racks.length ? 'Penempatan tanpa konflik' : 'Belum ada rak';
  $('layout-health').classList.toggle('has-issue', result.issues.length > 0);
  $('planner-status').textContent = result.issues.length ? `${result.issues.length} hal perlu disesuaikan` : state.racks.length ? 'Tidak ada konflik geometri terdeteksi' : 'Tambahkan rak untuk mulai mengatur';
  $('planner-status').classList.toggle('has-issue', result.issues.length > 0);
  const issues = $('planner-issues'); issues.replaceChildren();
  for (const issue of result.issues.slice(0, 6)) { const li = document.createElement('li'); li.textContent = issue; issues.append(li); }
  if (result.issues.length > 6) { const li = document.createElement('li'); li.textContent = `Dan ${result.issues.length - 6} catatan lainnya. Ubah posisi rak yang berwarna merah.`; issues.append(li); }
  const list = $('rack-list'); list.replaceChildren();
  const oldHost=$('attachment-host').value; $('attachment-host').replaceChildren();
  state.racks.filter(r=>!r.attachTo&&['single','double','mesh','custom'].includes(r.kind)).forEach(r=>{const option=document.createElement('option');option.value=r.id;option.textContent=`Modul ${r.id} · ${r.productName||'Custom'}`;$('attachment-host').append(option);});
  if([...$('attachment-host').options].some(option=>option.value===oldHost)) $('attachment-host').value=oldHost;
  else if(selected()&&!selected().attachTo) $('attachment-host').value=state.selected;
  state.racks.forEach(r => { const button = document.createElement('button'); button.type = 'button'; button.textContent = `Rak ${r.id}`; button.title = r.productName || 'Rak custom'; button.className = r.id === state.selected ? 'rack-chip selected' : 'rack-chip'; button.setAttribute('aria-pressed', String(r.id === state.selected)); button.addEventListener('click', () => select(r.id)); list.append(button); });
  const r = selected();
  $('rack-selected').textContent = r ? `Rak ${r.id} · ${r.productName || 'Custom'}${r.adjusted ? ' · disesuaikan' : ''}` : 'Pilih rak untuk mengubahnya';
  for (const id of ['rack-x', 'rack-z', 'rotate-rack', 'remove-rack', 'duplicate-rack', 'apply-rack-size']) $(id).disabled = !r;
  for(const id of ['rack-x','rack-z','rotate-rack']) if(r?.attachTo||r?.stackTo) $(id).disabled=true;
  if (r) { if (document.activeElement !== $('rack-x')) $('rack-x').value = r.x.toFixed(2); if (document.activeElement !== $('rack-z')) $('rack-z').value = r.z.toFixed(2); }
  $('planner-consult').disabled = !state.racks.length;
  $('add-rack').disabled = state.racks.length >= 24;
  $('duplicate-rack').disabled = !r || state.racks.length >= 24;
  renderer.shadowMap.needsUpdate = true;
  render();
}
function select(id) {
  state.selected = id; const r = selected();
  if (r) { $('rack-width').value = Math.round(r.width * 100); $('rack-depth').value = Math.round(r.depth * 100); $('rack-height').value = Math.round(r.height * 100); $('rack-product').value = r.productId || 'custom'; $('rack-mount').value = Math.round((r.mountHeight || 0) * 100); catalogDisplay(); $('catalog-feedback').textContent = ''; }
  update();
}
function resetLayout() {
  if(ATTACHMENT_KINDS.includes(dimensions().kind)) { $('catalog-feedback').textContent='Aksesoris dipasang pada rak penopang melalui Tambah rak, bukan Susun otomatis.';return; }
  state.racks = suggest(state.room, dimensions(), state.aisle); state.nextId = state.racks.length + 1; state.selected = state.racks[0]?.id || null;
  drawRoom(); update();
}
function floorPoint(event) {
  const rect = renderer.domElement.getBoundingClientRect(); pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
  ray.setFromCamera(pointer, camera); const point = new THREE.Vector3(); return ray.ray.intersectPlane(plane, point) ? point : null;
}
export function initPlanner() {
  if (renderer) return;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); }
  catch { $('planner-load-status').textContent = 'Tampilan 3D memerlukan WebGL. Coba browser terbaru dengan akselerasi grafis aktif.'; $('start-planner').disabled = false; return; }
  scene = new THREE.Scene(); scene.background = new THREE.Color('#eaf0f4');
  camera = new THREE.PerspectiveCamera(42, 1, .1, 300);
  scene.add(new THREE.HemisphereLight('#ffffff', '#7c96ad', 2.0));
  directional = new THREE.DirectionalLight('#ffffff', 2.5); directional.castShadow = true; directional.shadow.mapSize.set(1024, 1024); directional.shadow.bias = -.0004; directional.shadow.normalBias = .025; scene.add(directional, directional.target);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.setAttribute('aria-label', 'Model 3D ruangan dan rak. Gunakan daftar rak dan isian posisi untuk kontrol keyboard.');
  renderer.domElement.tabIndex = 0;
  renderer.domElement.style.touchAction = 'none'; view.append(renderer.domElement);
  $('planner-placeholder').hidden = true; $('planner-intro').hidden = true; $('planner-controls').hidden = false; $('planner-toolbar').hidden = false;
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false; controls.minPolarAngle = .01; controls.maxPolarAngle = Math.PI / 2 - .05; controls.rotateSpeed = .75; controls.zoomSpeed = .8; controls.screenSpacePanning = true;
  controls.addEventListener('change', () => {
    if (state.top && controls.getPolarAngle() > .05) { state.top = false; $('view-top').setAttribute('aria-pressed', 'false'); }
    cameraCaption();
    requestRender();
  });
  let firstResize = true, lastAspect = 1;
  resizeObserver = new ResizeObserver(() => {
    const rect = view.getBoundingClientRect(); renderer.setSize(rect.width, rect.height, false); camera.aspect = rect.width / rect.height; camera.updateProjectionMatrix();
    if (firstResize) { firstResize = false; cameraPosition(); }
    else { const fitRatio = Math.max(1, 1.25 / camera.aspect) / Math.max(1, 1.25 / lastAspect); const offset = camera.position.clone().sub(controls.target).multiplyScalar(fitRatio); camera.position.copy(controls.target).add(offset); controls.update(); requestRender(); }
    lastAspect = camera.aspect;
  }); resizeObserver.observe(view);
  document.querySelectorAll('[data-panel]').forEach(b => b.addEventListener('click', () => inspector(b.dataset.panel)));
  RACK_CATALOG.forEach(product => { const option = document.createElement('option'); option.value = product.id; option.textContent = product.name; $('rack-product').append(option); });
  const incoming=new URLSearchParams(location.search), incomingProduct=RACK_CATALOG.find(p=>p.id===incoming.get('product'));
  $('rack-product').value = incomingProduct?.id || 'double-30'; chooseProduct();
  if(incomingProduct){for(const [key,field,values] of [['height','rack-height',incomingProduct.heights],['width','rack-width',incomingProduct.widths],['depth','rack-depth',incomingProduct.depths]]) if(values?.includes(+incoming.get(key))) $(field).value=incoming.get(key); catalogDisplay();}
  $('rack-product').addEventListener('change', chooseProduct);
  $('catalog-height').addEventListener('change', () => { $('rack-height').value = $('catalog-height').value; });
  $('catalog-width').addEventListener('change',()=>{$('rack-width').value=$('catalog-width').value;});
  $('catalog-depth').addEventListener('change',()=>{$('rack-depth').value=$('catalog-depth').value;});
  $('show-checks').addEventListener('click', () => inspector('checks'));
  $('mode-camera').addEventListener('click', () => interaction('camera'));
  $('mode-edit').addEventListener('click', () => interaction('edit'));
  $('view-reset').addEventListener('click', () => { state.yaw = -.55; state.top = false; $('view-top').setAttribute('aria-pressed', 'false'); cameraPosition(); });
  for (const [id, factor] of [['zoom-in', .8], ['zoom-out', 1.25]]) $(id).addEventListener('click', () => { const offset = camera.position.clone().sub(controls.target); const length = THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance); camera.position.copy(controls.target).add(offset.setLength(length)); controls.update(); requestRender(); });
  $('room-form').addEventListener('submit', e => {
    e.preventDefault(); if (!$('room-form').reportValidity()) return;
    state.room = { width: +$('room-width').value, depth: +$('room-depth').value, height: +$('room-height').value }; state.aisle = +$('aisle-width').value;
    drawRoom(); update();
    $('room-feedback').textContent = `Ruang ${state.room.width} × ${state.room.depth} m diterapkan.`;
  });
  $('rack-dimensions').addEventListener('submit', e => e.preventDefault());
  $('add-rack').addEventListener('click', () => {
    if (!validDimensions()) return;
    if (state.racks.length >= 24) { $('planner-status').textContent = 'Batas simulasi: 24 rak. Hapus satu rak untuk menambah.'; return; }
    const r = { ...dimensions(), id: state.nextId++, x: state.room.width / 2, z: state.room.depth / 2, rotated: false };
    if(ATTACHMENT_KINDS.includes(r.kind)) {
      const host=state.racks.find(item=>item.id===+$('attachment-host').value);
      if(!host){$('catalog-feedback').textContent='Tambahkan dan pilih rak penopang dahulu.';return;}
      if(['hook','double-hook'].includes(r.kind)&&host.kind!=='mesh'&&host.kind!=='custom'){$('catalog-feedback').textContent='Hook membutuhkan rak backmesh Mundo atau modul custom.';return;}
      r.attachTo=host.id;r.x=host.x;r.z=host.z;state.racks.push(r);select(r.id);return;
    }
    const candidates = suggest(state.room, dimensions(), state.aisle);
    const free = candidates.find(c => assess(state.room, [...state.racks, { ...c, id: r.id }], state.aisle).issues.length === 0);
    if (free) { r.x = free.x; r.z = free.z; }
    state.racks.push(r); select(r.id);
  });
  $('apply-rack-size').addEventListener('click', () => { if (!validDimensions()) return; const r = selected(); if (r) { const spec=dimensions();if(ATTACHMENT_KINDS.includes(spec.kind)&&!r.attachTo){$('catalog-feedback').textContent='Gunakan Tambah rak untuk memasang aksesoris; modul penopang tidak diganti.';return;} if(!ATTACHMENT_KINDS.includes(spec.kind)) delete r.attachTo; for (const key of ['productId','productName','source','sourceNote','adjusted','levels','shelfRatio','color']) delete r[key]; Object.assign(r, spec); update(); catalogDisplay(); $('catalog-feedback').textContent = 'Pilihan dan ukuran diterapkan pada rak terpilih.'; } });
  $('rotate-rack').addEventListener('click', () => { const r = selected(); if (r) { r.rotated = !r.rotated; update(); } });
  $('remove-rack').addEventListener('click', () => { state.racks = state.racks.filter(r => r.id !== state.selected && r.attachTo !== state.selected && r.stackTo !== state.selected); select(state.racks[0]?.id || null); });
  $('duplicate-rack').addEventListener('click', () => { const r = selected(); if (r && state.racks.length < 24) { const copy = { ...r, id: state.nextId++, x: Math.round((r.x + r.width + state.aisle) * 10) / 10 }; state.racks.push(copy); select(copy.id); } });
  for (const [id, field] of [['rack-x', 'x'], ['rack-z', 'z']]) {
    const changePosition = () => { const r = selected(); if (r && $(id).validity.valid && $(id).value !== '') { r[field] = +$(id).value; update(); } };
    $(id).addEventListener('input', changePosition); $(id).addEventListener('change', changePosition);
  }
  function displayAllProducts(){
    const result=catalogLayout(state.room,state.aisle);
    if(result.failed.length){$('room-feedback').textContent='Seluruh katalog belum muat dengan lorong yang dipilih. Kurangi target lorong atau gunakan ruangan lebih besar.';return;}
    state.room=result.room;state.racks=result.racks;state.nextId=25;state.selected=state.racks[0]?.id;state.aisle=result.aisle;automaticRoute=true;
    for(const key of ['width','depth','height'])$('room-'+key).value=state.room[key];$('aisle-width').value=state.aisle;
    drawRoom();cameraPosition();update();
    $('room-feedback').textContent=`Seluruh 18 jenis produk (21 varian) ditampilkan, dengan 4 keranjang jinjing di satu tumpukan. Jalur hijau dan jarak antar-modul minimal ${state.aisle.toFixed(1)} m. ${result.expanded?'Ruang contoh diperbesar menjadi '+state.room.width+' × '+state.room.depth+' m agar semua muat; ini bukan ukuran toko Anda.':'Ruang saat ini cukup untuk display seluruh katalog.'}`;
  }
  $('suggest-layout').addEventListener('click', displayAllProducts);
  $('stack-baskets').addEventListener('click',()=>{
    const baskets=state.racks.filter(r=>r.kind==='shopping-basket');if(baskets.length<2){$('catalog-feedback').textContent='Tambahkan atau duplikat minimal dua keranjang jinjing sejenis dahulu.';return;}
    const result=autoLayout(state.room,state.racks,state.aisle);if(result.failed.length){$('catalog-feedback').textContent='Ruang atau tinggi tumpukan belum cukup. Kurangi keranjang atau perbesar ruang.';return;}state.racks=result.racks;state.aisle=result.aisle;$('aisle-width').value=result.aisle;update();$('catalog-feedback').textContent='Keranjang jinjing sejenis disatukan di titik pengambilan. Keranjang beroda dan troli ditempatkan terpisah.';
  });
  $('clear-layout').addEventListener('click', () => { state.racks = []; state.selected = null; update(); });
  $('view-top').addEventListener('click', () => { state.top = !state.top; $('view-top').setAttribute('aria-pressed', String(state.top)); cameraPosition(); });
  $('planner-consult').addEventListener('click', () => {
    const message = (window.RITELINDO_CONFIG?.defaultMessage || 'Halo Ritelindo, saya ingin konsultasi layout toko.') + '\n\n' + layoutMessage(state.room, state.racks, state.aisle, assess(state.room, state.racks, state.aisle));
    document.dispatchEvent(new CustomEvent('ritelindo:consult', { detail: { message, trigger: $('planner-consult'), placement: 'planner-3d' } }));
  });
  renderer.domElement.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    pointerStart = { x: event.clientX, y: event.clientY };
    if (state.mode !== 'edit') return;
    const point = floorPoint(event); if (!point) return;
    const hits = ray.intersectObjects(rackGroup.children, true);
    const hit = hits.find(h => h.object.userData.rackId);
    if (!hit) return;
    select(hit.object.userData.rackId); inspector('racks'); if(selected()?.attachTo||selected()?.stackTo)return; controls.enabled = false; dragging = selected(); dragOffset = { x: dragging.x - point.x, z: dragging.z - point.z }; renderer.domElement.setPointerCapture(event.pointerId);
  }, true);
  renderer.domElement.addEventListener('pointermove', event => {
    if (!dragging) return; const point = floorPoint(event); if (!point) return;
    dragging.x = Math.max(-3, Math.min(30, Math.round((point.x + dragOffset.x) * 10) / 10));
    dragging.z = Math.max(-3, Math.min(30, Math.round((point.z + dragOffset.z) * 10) / 10)); update();
  });
  const stopDrag = event => {
    const wasDragging = Boolean(dragging); dragging = null; controls.enabled = true;
    if (event?.type === 'pointerup' && !wasDragging && pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) < 6) {
      floorPoint(event); const hit = ray.intersectObjects(rackGroup.children, true).find(h => h.object.userData.rackId);
      if (hit) { select(hit.object.userData.rackId); inspector('racks'); }
    }
    pointerStart = null;
  };
  renderer.domElement.addEventListener('pointerup', stopDrag); renderer.domElement.addEventListener('pointercancel', stopDrag); renderer.domElement.addEventListener('lostpointercapture', stopDrag);
  renderer.domElement.addEventListener('keydown', event => {
    if (state.mode === 'edit' && selected() && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault(); const r = selected();
      if (event.key === 'ArrowLeft') r.x -= .1; if (event.key === 'ArrowRight') r.x += .1; if (event.key === 'ArrowUp') r.z += .1; if (event.key === 'ArrowDown') r.z -= .1;
      r.x = Math.round(r.x * 10) / 10; r.z = Math.round(r.z * 10) / 10; update();
    } else if (state.mode === 'camera' && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault(); const offset = camera.position.clone().sub(controls.target); const spherical = new THREE.Spherical().setFromVector3(offset);
      if (event.key === 'ArrowLeft') spherical.theta -= Math.PI / 12; if (event.key === 'ArrowRight') spherical.theta += Math.PI / 12; if (event.key === 'ArrowUp') spherical.phi -= .1; if (event.key === 'ArrowDown') spherical.phi += .1;
      spherical.phi = THREE.MathUtils.clamp(spherical.phi, controls.minPolarAngle, controls.maxPolarAngle); camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical)); controls.update(); requestRender();
    }
  });
  renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); $('planner-status').textContent = 'Tampilan 3D terhenti. Muat ulang halaman untuk memulihkan.'; });
  if(incomingProduct){
    const spec=dimensions();
    if(ATTACHMENT_KINDS.includes(spec.kind)){
      const hostProduct=RACK_CATALOG.find(p=>p.id===(['hook','double-hook'].includes(spec.kind)?'mundo-feet':'single-30')), defaults=productDefaults(hostProduct);
      const hostSpec=catalogSpec(hostProduct.id,defaults.width,defaults.depth,defaults.height),host=suggest(state.room,hostSpec,state.aisle)[0];
      state.racks=[host,{...spec,id:2,attachTo:host.id,x:host.x,z:host.z,rotated:false}];state.selected=2;state.nextId=3;
    }else{state.racks=suggest(state.room,spec,state.aisle).slice(0,1);state.selected=state.racks[0]?.id;state.nextId=2;}
    drawRoom();update();
  }else displayAllProducts();
  interaction('camera'); inspector(incomingProduct?'racks':'room');
  const visibilityObserver = new IntersectionObserver(entries => document.body.classList.toggle('studio-visible', entries[0].isIntersecting), { threshold: .15 }); visibilityObserver.observe($('simulator'));
}
