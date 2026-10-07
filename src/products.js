import {RACK_CATALOG,productDefaults} from './rack-catalog.mjs';
const $=id=>document.getElementById(id);
const base=new URL('./',document.baseURI);
const search=$('product-search');
if(search){
  const params=new URLSearchParams(location.search);let category=params.get('category')||'';search.value=params.get('q')||'';
  function filter(){
    const query=search.value.trim().toLocaleLowerCase('id');let count=0;
    document.querySelectorAll('.product-card').forEach(card=>{card.hidden=!!((category&&card.dataset.category!==category)||!card.dataset.search.includes(query));if(!card.hidden)count++;});
    $('product-count').textContent=`${count} produk`;$('product-empty').hidden=!!count;
    $('product-category').value=category;
    document.querySelectorAll('[data-category-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.categoryFilter===category)));
    $('clear-filters').hidden=!category&&!query;
    const url=new URL(location.href);url.search='';if(category)url.searchParams.set('category',category);if(query)url.searchParams.set('q',search.value.trim());history.replaceState({},'',url);
  }
  document.querySelectorAll('[data-category-filter]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.categoryFilter;filter();}));
  $('product-category').addEventListener('change',event=>{category=event.target.value;filter();});search.addEventListener('input',filter);
  $('clear-filters').addEventListener('click',()=>{category='';search.value='';filter();search.focus();});filter();
}
if($('detail-variant')){
  const options=(id,values,chosen)=>{$(id).replaceChildren(...values.map(value=>{const option=document.createElement('option');option.value=value;option.textContent=`${value} cm`;option.selected=value===chosen;return option;}));};
  function syncLink(){const url=new URL('simulasi-3d/',base);url.searchParams.set('product',$('detail-variant').value);for(const key of ['height','width','depth'])if($('detail-'+key).value)url.searchParams.set(key,$('detail-'+key).value);$('try-product').href=url;const rows=document.querySelectorAll('.product-specification dl dd');if(rows.length)rows[rows.length-1].textContent=`${$('detail-width').value} × ${$('detail-depth').value} × ${$('detail-height').value} cm`;}
  function variant(){const product=RACK_CATALOG.find(p=>p.id===$('detail-variant').value),defaults=productDefaults(product);
    options('detail-height',product.heights,defaults.height);options('detail-width',product.widths||[defaults.width],defaults.width);options('detail-depth',product.depths||[defaults.depth],defaults.depth);
    $('detail-width-wrap').hidden=!product.widths;$('detail-depth-wrap').hidden=!product.depths;
    document.querySelector('[for="detail-height"]').textContent=product.heightUnconfirmed?'Tinggi perkiraan':'Tinggi';
    $('detail-note').textContent=product.note||'Ukuran mengacu pada katalog. Bentuk dan jumlah susun pada ilustrasi dapat berbeda dari produk final.';
    const rows=document.querySelectorAll('.product-specification dl dd');rows[0].textContent=product.width===null?'Belum tercantum':(product.widths||[product.width]).join(' / ')+' cm';rows[1].textContent=product.depth===null?'Belum tercantum':(product.depths||[product.depth]).join(' / ')+' cm';rows[2].textContent=product.heightUnconfirmed?'Belum tercantum':product.heights.join(' / ')+' cm';syncLink();
  }
  $('detail-variant').addEventListener('change',variant);for(const key of ['height','width','depth'])$('detail-'+key).addEventListener('change',syncLink);variant();
}
const header=document.querySelector('.header'),menu=document.querySelector('.menu-button'),nav=$('mobile-nav'),backdrop=document.querySelector('.menu-backdrop');
const background=document.querySelectorAll('main,.footer,.mobile-sticky,.wa-launcher');
function closeMenu(focus=false){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Buka menu navigasi');menu.querySelector('.menu-label').textContent='Menu';nav.hidden=backdrop.hidden=true;document.body.classList.remove('menu-open');background.forEach(el=>el.inert=false);if(focus)menu.focus();}
menu.addEventListener('click',()=>{if(!nav.hidden){closeMenu();return;}menu.setAttribute('aria-expanded','true');menu.setAttribute('aria-label','Tutup menu navigasi');menu.querySelector('.menu-label').textContent='Tutup';nav.hidden=backdrop.hidden=false;document.body.classList.add('menu-open');background.forEach(el=>el.inert=true);});
backdrop.addEventListener('click',()=>closeMenu(true));nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!nav.hidden)closeMenu(true);});matchMedia('(min-width:768px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
const syncHeader=()=>header.classList.toggle('header-scrolled',scrollY>24);addEventListener('scroll',syncHeader,{passive:true});syncHeader();$('year').textContent=new Date().getFullYear();
const config=window.RITELINDO_CONFIG||{},dialog=$('contact-dialog'),preview=$('message-preview'),continueLink=$('continue-wa');let trigger;
function syncContact(){const valid=/^\d{8,15}$/.test(config.whatsappNumber||'');const enabled=valid&&!!preview.value.trim();continueLink.setAttribute('aria-disabled',String(!enabled));if(enabled){continueLink.href=`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(preview.value.trim())}`;continueLink.target='_blank';continueLink.rel='noopener noreferrer';}else continueLink.removeAttribute('href');$('wa-contact-notice').textContent=!valid?'Nomor WhatsApp resmi belum diisi pada demo ini. Pesan bisa disalin sementara.':!enabled?'Tulis pesan sebelum melanjutkan.':'';}
function openContact(event){event.preventDefault();trigger=event.currentTarget;closeMenu();preview.value=trigger.dataset.message||config.defaultMessage||'Halo Ritelindo, saya ingin konsultasi rak dan layout toko.';$('copy-status').textContent='';syncContact();dialog.showModal();}
document.querySelectorAll('[data-wa],.wa-launcher').forEach(link=>link.addEventListener('click',openContact));preview.addEventListener('input',syncContact);
continueLink.addEventListener('click',event=>{if(continueLink.getAttribute('aria-disabled')==='true')event.preventDefault();});document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{(trigger?.getClientRects().length?trigger:menu)?.focus();});dialog.addEventListener('click',event=>{const rect=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))dialog.close();});
$('copy-message').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(preview.value);$('copy-status').textContent='Pesan berhasil disalin.';}catch{preview.focus();preview.select();$('copy-status').textContent='Pilih teks pesan, lalu salin secara manual.';}});
