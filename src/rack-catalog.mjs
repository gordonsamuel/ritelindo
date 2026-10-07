// Public specifications read from Storack product pages, 7 October 2026.
const source = slug => `https://www.storack.id/produk/${slug}`;
export const RACK_CATALOG = [
  { id: 'single-30', name: 'Rak Single 30–25', kind: 'single', width: 90, depth: 35, heights: [120,150,180,200], baseShelf: 30, upperShelf: 25, source: source('rak-single-30-25') },
  { id: 'single-35', name: 'Rak Single 35–30', kind: 'single', width: 90, depth: 35, heights: [120,150,180,200], baseShelf: 35, upperShelf: 30, source: source('rak-single-35-30') },
  { id: 'double-30', name: 'Rak Double 30–25', kind: 'double', width: 90, depth: 65, heights: [120,150,180], baseShelf: 30, upperShelf: 25, source: source('rak-double-30-25') },
  { id: 'double-35', name: 'Rak Double 35–30', kind: 'double', width: 90, depth: 65, heights: [120,150,180], baseShelf: 35, upperShelf: 30, note: 'Sumber mencantumkan total 65 cm, tetapi shelving dasar 35 cm per sisi. Kedalaman total perlu dikonfirmasi; model dipaskan ke tapak yang dipilih.', source: source('rak-gudang-35-30') },
  { id: 'wall-2', name: 'Rak Dinding 2 Susun', kind: 'wall', width: null, depth: 25, depths: [25,30], heights: [60,80], levels: 2, note: 'Panjang modul belum tercantum. Panjang awal 90 cm adalah perkiraan untuk simulasi; masukkan ukuran yang dikonfirmasi. Ketinggian pemasangan juga diatur sendiri.', source: source('rak-dinding-2-susun') },
  { id: 'wall-3', name: 'Rak Dinding 3 Susun', kind: 'wall', width: null, depth: 25, depths: [25,30], heights: [60,80], levels: 3, note: 'Panjang modul belum tercantum. Panjang awal 90 cm adalah perkiraan untuk simulasi; masukkan ukuran yang dikonfirmasi. Ketinggian pemasangan juga diatur sendiri.', source: source('rak-dinding-3-susun') },
  { id: 'chiki-medium', name: 'Keranjang Chiki · Sedang', kind: 'basket', width: 50, depth: 30, heights: [120], note: 'Halaman menulis 50 × 30 × 120 tanpa satuan. Simulator mengasumsikan cm; konfirmasikan satuannya. Jumlah keranjang pada model bersifat ilustratif.', source: source('rak-keranjang-chiki') },
  { id: 'chiki-large', name: 'Keranjang Chiki · Besar', kind: 'basket', width: 90, depth: 30, heights: [120], note: 'Halaman menulis 90 × 30 × 120 tanpa satuan. Simulator mengasumsikan cm; konfirmasikan satuannya. Jumlah keranjang pada model bersifat ilustratif.', source: source('rak-keranjang-chiki') },
  { id: 'mundo-feet', name: 'Mundo Backmesh Kaki', kind: 'mesh', width: 90, depth: null, heights: [120,150,180,200], color: '#edf3f6', note: 'Kedalaman tidak tercantum. Tapak awal 40 cm adalah perkiraan; sesuaikan dengan ukuran kaki yang dikonfirmasi.', source: source('rak-mundo-rak-backmesh-kaki') },
  { id: 'mundo-post', name: 'Mundo Backmesh Tiang', kind: 'mesh', width: 90, depth: null, heights: [120,150,180,200], color: '#b73832', note: 'Kedalaman tidak tercantum. Tapak awal 40 cm adalah perkiraan; sesuaikan dengan ukuran tiang yang dikonfirmasi.', source: source('rak-mundo-rak-backmesh-tiang') }
];
export const ATTACHMENT_KINDS = ['pricetag','stopper','hook','double-hook'];
RACK_CATALOG.push(
  {id:'cashier-standard',name:'Meja Kasir Standard',kind:'checkout',width:150,widths:[100,125,150,180],depth:null,defaultDepth:60,heights:[90],heightUnconfirmed:true,note:'Sumber hanya mencantumkan panjang meja 100/125/150/180 cm. Kedalaman 60 cm dan tinggi 90 cm adalah perkiraan. Set termasuk meja kecil/konsul; ukuran konsul belum tercantum dan tidak dimodelkan.',source:source('meja-kasir-standard')},
  {id:'cashier-alfa',name:'Meja Kasir Alfa + Shelving Depan',kind:'checkout-display',width:150,widths:[100,125,150,180],depth:null,defaultDepth:60,heights:[90],heightUnconfirmed:true,note:'Sumber hanya mencantumkan panjang meja 100/125/150/180 cm. Kedalaman 60 cm dan tinggi 90 cm adalah perkiraan. Shelving depan merupakan ilustrasi; konsul terpisah belum dimodelkan karena ukuran tidak tersedia.',source:source('meja-kasir-alfa-shelving-depan')},
  {id:'shopping-hand',name:'Keranjang Jinjing',kind:'shopping-basket',width:46.3,depth:34,heights:[22.5],source:source('keranjang-jinjing')},
  {id:'shopping-wheel',name:'Keranjang Tarik Roda',kind:'rolling-basket',width:45.5,depth:36,heights:[40],source:source('keranjang-tarik-roda')},
  {id:'trolley-60',name:'Trolley Besi · 60 L',kind:'trolley',width:null,defaultWidth:75,depth:null,defaultDepth:50,heights:[90],heightUnconfirmed:true,capacity:60,note:'Kapasitas 60 L tercantum, dimensi luar tidak. Tapak 75 × 50 cm dan tinggi 90 cm adalah perkiraan, bukan konversi kapasitas. Ganti setelah ukuran aktual dikonfirmasi.',source:source('trolley-besi-beroda')},
  {id:'trolley-100',name:'Trolley Besi · 100 L',kind:'trolley',width:null,defaultWidth:90,depth:null,defaultDepth:55,heights:[100],heightUnconfirmed:true,capacity:100,note:'Kapasitas 100 L tercantum, dimensi luar tidak. Tapak 90 × 55 cm dan tinggi 100 cm adalah perkiraan, bukan konversi kapasitas. Ganti setelah ukuran aktual dikonfirmasi.',source:source('trolley-besi-beroda')},
  {id:'pricetag',name:'Pricetag Label Harga Mika',kind:'pricetag',width:86.3,depth:null,defaultDepth:1,heights:[4],heightUnconfirmed:true,colors:['Merah','Oranye','Biru','Hijau','Kuning','Hitam','Putih'],note:'Panjang 86,3 cm dari sumber. Ketebalan 1 cm dan tinggi 4 cm hanya ukuran visual perkiraan. Dipasang pada bagian depan rak yang dipilih.',source:source('pricetag-label-harga-mika')},
  {id:'stopper-90',name:'Stopper · tipe 90',kind:'stopper',width:87,depth:null,defaultDepth:1,heights:[10],heightUnconfirmed:true,note:'Tipe 90 memiliki panjang riil 87 cm; besi 4 mm. Tinggi 10 cm dan kedalaman visual 1 cm adalah perkiraan. Halaman menyebut tiga ukuran tetapi hanya mencantumkan tipe 90 dan 70.',source:source('stopper-pagar-pembatas-rak')},
  {id:'stopper-70',name:'Stopper · tipe 70',kind:'stopper',width:67,depth:null,defaultDepth:1,heights:[10],heightUnconfirmed:true,note:'Tipe 70 memiliki panjang riil 67 cm; besi 4 mm. Tinggi 10 cm dan kedalaman visual 1 cm adalah perkiraan.',source:source('stopper-pagar-pembatas-rak')},
  {id:'single-hook',name:'Single Hook Gantungan Ram',kind:'hook',width:null,defaultWidth:5,depth:25,depths:[15,20,25,30],heights:[8],heightUnconfirmed:true,note:'Panjang hook 15/20/25/30 cm (isian Dalam); besi 5 mm. Lebar dudukan 5 cm dan tinggi visual 8 cm adalah perkiraan. Dipasang pada backmesh.',source:source('single-hook-gantungan-ram')},
  {id:'double-hook',name:'Double Hook Gantungan Ram',kind:'double-hook',width:null,defaultWidth:5,depth:25,depths:[25,30],heights:[8],heightUnconfirmed:true,note:'Panjang hook 25/30 cm (isian Dalam); besi 6 mm. Lebar dudukan 5 cm dan tinggi visual 8 cm adalah perkiraan. Dipasang pada backmesh, dengan label harga ilustratif.',source:source('double-hook-gantungan-ram')}
);
export function productDefaults(product) {
  return {width:product.width??product.defaultWidth??90,depth:product.depth??product.defaultDepth??40,height:product.heights.includes(180)?180:product.heights.at(-1)};
}
export function catalogSpec(id, width, depth, height, mountHeight = 0) {
  const product = RACK_CATALOG.find(p => p.id === id);
  const result = { width: width / 100, depth: depth / 100, height: height / 100, mountHeight: product?.kind === 'wall' ? mountHeight / 100 : 0, kind: product?.kind || 'custom' };
  if (!product) return result;
  const defaults=productDefaults(product);
  const adjusted = !(product.widths || [defaults.width]).includes(width) || !(product.depths || [defaults.depth]).includes(depth) || !product.heights.includes(height);
  return { ...result, productId: id, productName: product.name, source: product.source, sourceNote: product.note || '', adjusted, levels: product.levels, shelfRatio: product.upperShelf ? product.upperShelf / product.baseShelf : 1, color: product.color };
}
