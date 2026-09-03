

const CONTAINER_TAGS = ['root','div','section','navbar','header','sidebar','footer','accordion'];
const isContainer = (tag) => CONTAINER_TAGS.includes(tag);

const CONTAINER_HTML_TAG = { root:'div', div:'div', section:'section', navbar:'nav', header:'header', sidebar:'aside', footer:'footer' };

const TAG_LABELS = {
  root:'Seiten-Container', div:'Box', section:'Section', navbar:'Navbar', header:'Header',
  sidebar:'Seitenleiste', footer:'Footer', accordion:'Accordion', h1:'Überschrift H1', h2:'Überschrift H2',
  p:'Absatz', a:'Link', button:'Button', input:'Eingabefeld', hr:'Trennlinie', span:'Inline-Text'
};

const FONT_OPTIONS = [
  ["'Segoe UI', sans-serif","Segoe UI"],
  ["Arial, sans-serif","Arial"],
  ["Verdana, sans-serif","Verdana"],
  ["Georgia, serif","Georgia"],
  ["'Courier New', monospace","Courier New"]
];

let uid = 1;
const nextId = () => uid++;

function leafStyle(overrides){
  return Object.assign({
    fontFamily:"'Segoe UI', sans-serif", fontSize:16, fontWeight:'400', color:'#0f172a',
    bg:'transparent', padding:0, margin:0, radius:0,
    borderW:0, borderS:'solid', borderC:'#cbd5e1', width:null, textAlign:'left'
  }, overrides || {});
}
function baseContainerStyle(overrides){
  return Object.assign({
    display:'flex', direction:'column', justify:'flex-start', alignItems:'stretch', gap:12,
    bg:'transparent', color:'#0f172a', padding:16, margin:0, radius:8,
    borderW:0, borderS:'solid', borderC:'#cbd5e1', width:100,
    fontFamily:"'Segoe UI', sans-serif", fontSize:16, fontWeight:'400', textAlign:'left'
  }, overrides || {});
}

function createElement(tag){
  const id = nextId();
  switch(tag){
    case 'h1': return {id,tag,text:'Neue Überschrift', style:leafStyle({fontSize:34,fontWeight:'700'})};
    case 'h2': return {id,tag,text:'Neue Unterüberschrift', style:leafStyle({fontSize:22,fontWeight:'600'})};
    case 'p': return {id,tag,text:'Neuer Textabsatz. Klicke, um ihn zu bearbeiten.', style:leafStyle()};
    case 'span': return {id,tag,text:'Inline-Text', style:leafStyle()};
    case 'a': return {id,tag,text:'Link-Text', href:'#', style:leafStyle({color:'#2563eb'})};
    case 'button': return {id,tag,text:'Button', style:leafStyle({bg:'#2563eb',color:'#ffffff',padding:10,radius:6})};
    case 'input': return {id,tag,text:'', placeholder:'Eingabefeld...', style:leafStyle({bg:'#ffffff',borderW:1,padding:8,radius:4})};
    case 'hr': return {id,tag,style:{thickness:1,borderS:'solid',color:'#cbd5e1',marginY:20,width:100}};

    case 'div': return {id,tag,children:[], style:baseContainerStyle({padding:16,borderW:1,borderS:'dashed',borderC:'#cbd5e1'})};
    case 'section': return {id,tag,children:[], style:baseContainerStyle({padding:40,bg:'#ffffff',width:100})};

    case 'navbar': {
      const logo = {id:nextId(),tag:'span',text:'Logo',style:leafStyle({fontWeight:'700',fontSize:18,color:'#f8fafc'})};
      const l1 = {id:nextId(),tag:'a',text:'Home',href:'#',style:leafStyle({color:'#38bdf8'})};
      const l2 = {id:nextId(),tag:'a',text:'Über uns',href:'#',style:leafStyle({color:'#f8fafc'})};
      return {id,tag,children:[logo,l1,l2], style:baseContainerStyle({direction:'row',justify:'space-between',alignItems:'center',bg:'#1e293b',color:'#f8fafc',padding:14,radius:8,width:100,gap:16})};
    }
    case 'header': {
      const t = {id:nextId(),tag:'h2',text:'Header Bereich',style:leafStyle({fontSize:26,fontWeight:'700'})};
      const s = {id:nextId(),tag:'p',text:'Untertitel oder Hero-Text',style:leafStyle()};
      return {id,tag,children:[t,s], style:baseContainerStyle({direction:'column',alignItems:'center',textAlign:'center',bg:'#e2e8f0',padding:36,radius:8,width:100,gap:8})};
    }
    case 'sidebar': {
      const t = {id:nextId(),tag:'h2',text:'Seitenleiste',style:leafStyle({fontSize:18,fontWeight:'700'})};
      const l1 = {id:nextId(),tag:'a',text:'Link 1',href:'#',style:leafStyle({color:'#2563eb'})};
      const l2 = {id:nextId(),tag:'a',text:'Link 2',href:'#',style:leafStyle({color:'#2563eb'})};
      return {id,tag,children:[t,l1,l2], style:baseContainerStyle({direction:'column',alignItems:'flex-start',bg:'#f1f5f9',padding:18,radius:8,width:40,gap:8,borderW:1,borderC:'#cbd5e1'})};
    }
    case 'footer': {
      const p = {id:nextId(),tag:'p',text:'© 2026 Meine Webseite',style:leafStyle({color:'#f8fafc'})};
      return {id,tag,children:[p], style:baseContainerStyle({direction:'column',alignItems:'center',textAlign:'center',bg:'#0f172a',color:'#f8fafc',padding:16,radius:8,width:100})};
    }
    case 'accordion': {
      const body = {id:nextId(),tag:'p',text:'Accordion-Inhalt. Füge hier weitere Elemente hinzu.',style:leafStyle()};
      return {id,tag,text:'Accordion-Titel',children:[body], style:{
        headerBg:'#f1f5f9',headerColor:'#0f172a',headerPadding:14,headerFontSize:16,
        bodyBg:'#ffffff',bodyPadding:16,radius:8,borderW:1,borderS:'solid',borderC:'#cbd5e1',width:100,openByDefault:false
      }};
    }
    default: return {id,tag,text:'', style:leafStyle()};
  }
}

function createInitialRoot(){
  uid = 1;
  const h1 = createElement('h1'); h1.text = 'Willkommen auf der Website';
  const p = createElement('p'); p.text = 'Dies ist ein voll anpassbarer Baukasten – füge links Elemente hinzu und verschachtele sie ineinander.';
  return {
    id:0, tag:'root', children:[h1,p],
    style: baseContainerStyle({direction:'column',justify:'flex-start',alignItems:'stretch',bg:'#ffffff',padding:24,radius:8,borderW:1,borderS:'dashed',borderC:'#cbd5e1',width:100,gap:16})
  };
}

let root = createInitialRoot();
let selectedId = 1;
let dragSourceId = null;
const accordionOpenState = {}; // Live-Vorschau-Zustand, unabhängig vom exportierten Anfangszustand

/* =========================================================================
   BAUM-HILFSFUNKTIONEN
   ========================================================================= */

function findNode(node, id){
  if(node.id === id) return node;
  if(!node.children) return null;
  for(const c of node.children){ const r = findNode(c, id); if(r) return r; }
  return null;
}
function findParentAndIndex(node, id){
  if(!node.children) return null;
  for(let i=0;i<node.children.length;i++){
    if(node.children[i].id === id) return {parent:node, index:i};
    const res = findParentAndIndex(node.children[i], id);
    if(res) return res;
  }
  return null;
}
function isDescendant(ancestorId, id){
  const anc = findNode(root, ancestorId);
  if(!anc || !anc.children) return false;
  for(const c of anc.children){ if(c.id === id || isDescendant(c.id, id)) return true; }
  return false;
}
function spliceOut(id){
  const info = findParentAndIndex(root, id);
  if(!info) return null;
  return info.parent.children.splice(info.index, 1)[0];
}
function deepCloneWithNewIds(node){
  const clone = JSON.parse(JSON.stringify(node));
  (function reassign(n){ n.id = nextId(); if(n.children) n.children.forEach(reassign); })(clone);
  return clone;
}
function getPath(obj, path){ return path.split('.').reduce((o,k)=> (o==null? o : o[k]), obj); }
function setPath(obj, path, value){
  const keys = path.split('.'); let o = obj;
  for(let i=0;i<keys.length-1;i++) o = o[keys[i]];
  o[keys[keys.length-1]] = value;
}

/* =========================================================================
   ELEMENT HINZUFÜGEN / VERSCHIEBEN / DUPLIZIEREN / LÖSCHEN
   ========================================================================= */

function addBuilderElement(tag){
  const node = createElement(tag);
  const sel = findNode(root, selectedId) || root;
  if(isContainer(sel.tag)){
    sel.children.push(node);
  } else {
    const info = findParentAndIndex(root, sel.id);
    const p = info ? info.parent : root;
    const idx = info ? info.index : p.children.length - 1;
    p.children.splice(idx + 1, 0, node);
  }
  selectedId = node.id;
  updatePreview();
  renderPropertiesPanel();
}

function moveElement(id, dir){
  if(id === 0) return;
  const info = findParentAndIndex(root, id);
  if(!info) return;
  const newIndex = info.index + dir;
  if(newIndex < 0 || newIndex >= info.parent.children.length) return;
  const [node] = info.parent.children.splice(info.index, 1);
  info.parent.children.splice(newIndex, 0, node);
  updatePreview();
}

function indentElement(id){
  if(id === 0) return;
  const info = findParentAndIndex(root, id);
  if(!info || info.index === 0) return;
  const prevSibling = info.parent.children[info.index - 1];
  if(!isContainer(prevSibling.tag)) return;
  const [node] = info.parent.children.splice(info.index, 1);
  prevSibling.children.push(node);
  selectedId = node.id;
  updatePreview(); renderPropertiesPanel();
}

function outdentElement(id){
  if(id === 0) return;
  const info = findParentAndIndex(root, id);
  if(!info || info.parent.id === 0) return;
  const ginfo = findParentAndIndex(root, info.parent.id);
  if(!ginfo) return;
  const [node] = info.parent.children.splice(info.index, 1);
  ginfo.parent.children.splice(ginfo.index + 1, 0, node);
  selectedId = node.id;
  updatePreview(); renderPropertiesPanel();
}

function duplicateElement(id, event){
  if(event) event.stopPropagation();
  if(id === 0) return;
  const info = findParentAndIndex(root, id);
  if(!info) return;
  const clone = deepCloneWithNewIds(info.parent.children[info.index]);
  info.parent.children.splice(info.index + 1, 0, clone);
  selectedId = clone.id;
  updatePreview(); renderPropertiesPanel();
}

function deleteElementById(id, event){
  if(event) event.stopPropagation();
  if(id === 0) return;
  const info = findParentAndIndex(root, id);
  if(!info) return;
  info.parent.children.splice(info.index, 1);
  if(selectedId === id) selectedId = info.parent.id;
  updatePreview(); renderPropertiesPanel();
}

function resetBuilder(){
  root = createInitialRoot();
  selectedId = 0;
  for(const k in accordionOpenState) delete accordionOpenState[k];
  updatePreview(); renderPropertiesPanel();
}

function selectElement(id, event){
  if(event) event.stopPropagation();
  selectedId = id;
  updatePreview();
  renderPropertiesPanel();
}

function updateElementText(id, newText){
  const el = findNode(root, id);
  if(el){ el.text = newText; updateCodeOutput(); }
}

function toggleAccordion(id, event){
  if(event) event.stopPropagation();
  const el = findNode(root, id);
  if(!el) return;
  const current = (id in accordionOpenState) ? accordionOpenState[id] : el.style.openByDefault;
  accordionOpenState[id] = !current;
  selectedId = id;
  updatePreview(); renderPropertiesPanel();
}

/* =========================================================================
   DRAG & DROP – Elemente ineinander/umeinander anordnen
   ========================================================================= */

function onDragStart(e, id){
  dragSourceId = id;
  e.stopPropagation();
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', String(id));
}
function onDragOver(e, id){
  e.preventDefault(); e.stopPropagation();
  e.dataTransfer.dropEffect = 'move';
  const wrapper = document.querySelector('.builder-item-wrapper[data-id="' + id + '"]');
  if(wrapper) wrapper.classList.add('drag-over');
}
function onDragLeave(e){
  e.stopPropagation();
  const wrapper = e.target.closest && e.target.closest('.builder-item-wrapper');
  if(wrapper) wrapper.classList.remove('drag-over');
}
function onDrop(e, targetId){
  e.preventDefault(); e.stopPropagation();
  document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
  const sourceId = dragSourceId;
  dragSourceId = null;
  if(sourceId == null || sourceId === targetId || sourceId === 0) return;
  if(isDescendant(sourceId, targetId)) return; // Container nicht in eigenes Kind verschieben

  const targetNode = findNode(root, targetId);
  if(!targetNode) return;
  const node = spliceOut(sourceId);
  if(!node) return;

  if(isContainer(targetNode.tag)){
    targetNode.children.push(node);
  } else {
    const info = findParentAndIndex(root, targetId);
    const p = info ? info.parent : root;
    const idx = info ? info.index : p.children.length - 1;
    p.children.splice(idx + 1, 0, node);
  }
  selectedId = node.id;
  updatePreview(); renderPropertiesPanel();
}

/* =========================================================================
   STYLE-DEKLARATIONEN (gemeinsam für Vorschau & Export)
   ========================================================================= */

function styleDeclarations(el){
  if(el.tag === 'hr'){
    const s = el.style;
    return [
      'border: none',
      'border-top: ' + s.thickness + 'px ' + s.borderS + ' ' + s.color,
      'margin: ' + s.marginY + 'px auto',
      'width: ' + s.width + '%'
    ];
  }
  const s = el.style;
  const decl = [];
  if(s.bg && s.bg !== 'transparent') decl.push('background-color: ' + s.bg);
  if(s.color) decl.push('color: ' + s.color);
  if(s.fontFamily) decl.push('font-family: ' + s.fontFamily);
  if(s.fontSize) decl.push('font-size: ' + s.fontSize + 'px');
  if(s.fontWeight) decl.push('font-weight: ' + s.fontWeight);
  if(s.textAlign) decl.push('text-align: ' + s.textAlign);
  if(s.padding != null) decl.push('padding: ' + s.padding + 'px');
  if(s.margin) decl.push('margin: ' + s.margin + 'px');
  if(s.radius != null) decl.push('border-radius: ' + s.radius + 'px');

  if(el.tag === 'button' || el.tag === 'input'){
    decl.push(s.borderW > 0 ? ('border: ' + s.borderW + 'px ' + s.borderS + ' ' + s.borderC) : 'border: none');
  } else if(s.borderW){
    decl.push('border: ' + s.borderW + 'px ' + s.borderS + ' ' + s.borderC);
  }
  if(el.tag === 'button') decl.push('cursor: pointer');
  if(s.width) decl.push('width: ' + s.width + '%');

  if(isContainer(el.tag)){
    decl.push('display: ' + (s.display || 'flex'));
    if((s.display || 'flex') === 'flex'){
      decl.push('flex-direction: ' + s.direction);
      decl.push('justify-content: ' + s.justify);
      decl.push('align-items: ' + s.alignItems);
      decl.push('gap: ' + s.gap + 'px');
    }
  }
  decl.push('box-sizing: border-box');
  return decl;
}

function accordionOuterDecl(el){
  const s = el.style;
  const d = ['width: ' + s.width + '%', 'box-sizing: border-box', 'overflow: hidden', 'border-radius: ' + s.radius + 'px'];
  if(s.borderW > 0) d.push('border: ' + s.borderW + 'px ' + s.borderS + ' ' + s.borderC);
  return d;
}
function accordionHeaderDecl(el){
  const s = el.style;
  return [
    'background-color: ' + s.headerBg, 'color: ' + s.headerColor, 'padding: ' + s.headerPadding + 'px',
    'font-size: ' + s.headerFontSize + 'px', 'font-weight: 600', 'display: flex',
    'justify-content: space-between', 'align-items: center', 'cursor: pointer',
    'border: none', 'width: 100%', 'text-align: left', 'box-sizing: border-box'
  ];
}
function accordionBodyDecl(el){
  const s = el.style;
  return ['background-color: ' + s.bodyBg, 'padding: ' + s.bodyPadding + 'px', 'box-sizing: border-box'];
}

/* =========================================================================
   VORSCHAU RENDERN
   ========================================================================= */

function escapeHtml(str){ return String(str == null ? '' : str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escapeAttr(str){ return String(str == null ? '' : str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function emptyHint(){ return '<p class="empty-hint">Leer – füge links Elemente hinzu oder ziehe sie hierher.</p>'; }

function itemToolbar(id){
  return '<div class="item-toolbar">' +
    '<button class="mini-btn" onclick="moveElement(' + id + ',-1)" title="Nach oben">↑</button>' +
    '<button class="mini-btn" onclick="moveElement(' + id + ',1)" title="Nach unten">↓</button>' +
    '<button class="mini-btn" onclick="duplicateElement(' + id + ', event)" title="Duplizieren">⧉</button>' +
    '<button class="mini-btn del" onclick="deleteElementById(' + id + ', event)" title="Löschen">✕</button>' +
  '</div>';
}

function wrapperOpenTag(el){
  const activeCls = el.id === selectedId ? ' active-element' : '';
  const containerCls = isContainer(el.tag) ? ' is-container' : '';
  return '<div class="builder-item-wrapper' + activeCls + containerCls + '" data-id="' + el.id + '" ' +
    'onclick="selectElement(' + el.id + ', event)" ' +
    'ondragover="onDragOver(event, ' + el.id + ')" ondrop="onDrop(event, ' + el.id + ')" ondragleave="onDragLeave(event)">' +
    '<span class="drag-handle" draggable="true" ondragstart="onDragStart(event, ' + el.id + ')" title="Verschieben">⠿</span>';
}

function renderPreview(el){
  if(el.tag === 'hr'){
    return wrapperOpenTag(el) + '<hr style="' + styleDeclarations(el).join('; ') + '; flex:1;">' + itemToolbar(el.id) + '</div>';
  }

  if(el.tag === 'accordion'){
    const isOpen = (el.id in accordionOpenState) ? accordionOpenState[el.id] : el.style.openByDefault;
    const inner =
      '<div style="' + accordionOuterDecl(el).join('; ') + '; flex:1;">' +
        '<div class="accordion-header" style="' + accordionHeaderDecl(el).join('; ') + '" onclick="toggleAccordion(' + el.id + ', event)">' +
          '<span class="editable-content" contenteditable="true" onblur="updateElementText(' + el.id + ', this.innerText)">' + escapeHtml(el.text) + '</span>' +
          '<span class="accordion-caret' + (isOpen ? ' open' : '') + '">▾</span>' +
        '</div>' +
        '<div class="container-inner" style="' + accordionBodyDecl(el).join('; ') + '; display:' + (isOpen ? 'block' : 'none') + ';">' +
          (el.children.length ? el.children.map(renderPreview).join('') : emptyHint()) +
        '</div>' +
      '</div>';
    return wrapperOpenTag(el) + inner + itemToolbar(el.id) + '</div>';
  }

  if(isContainer(el.tag)){
    const tagName = CONTAINER_HTML_TAG[el.tag];
    const inner = '<' + tagName + ' class="container-inner" style="' + styleDeclarations(el).join('; ') + '">' +
      (el.children.length ? el.children.map(renderPreview).join('') : emptyHint()) +
      '</' + tagName + '>';
    return wrapperOpenTag(el) + inner + itemToolbar(el.id) + '</div>';
  }

  let inner;
  const style = styleDeclarations(el).join('; ');
  if(el.tag === 'input'){
    inner = '<input type="text" placeholder="' + escapeAttr(el.placeholder) + '" style="' + style + '" readonly>';
  } else if(el.tag === 'a'){
    inner = '<a href="#" class="editable-content" style="' + style + '" contenteditable="true" onclick="event.preventDefault()" onblur="updateElementText(' + el.id + ', this.innerText)">' + escapeHtml(el.text) + '</a>';
  } else {
    inner = '<' + el.tag + ' class="editable-content" style="' + style + '" contenteditable="true" onblur="updateElementText(' + el.id + ', this.innerText)">' + escapeHtml(el.text) + '</' + el.tag + '>';
  }
  return wrapperOpenTag(el) + '<div style="flex:1;display:flex;align-items:center;">' + inner + '</div>' + itemToolbar(el.id) + '</div>';
}

function updatePreview(){
  const rootStyle = styleDeclarations(root).join('; ');
  const activeCls = selectedId === 0 ? ' active-element' : '';
  const html =
    '<div class="site-container' + activeCls + '" style="' + rootStyle + '" ' +
    'onclick="selectElement(0)" ondragover="onDragOver(event, 0)" ondrop="onDrop(event, 0)">' +
    (root.children.length ? root.children.map(renderPreview).join('') : emptyHint()) +
    '</div>';
  const container = document.getElementById('preview-container');
  if(container) container.innerHTML = html;
  updateCodeOutput();
}

/* =========================================================================
   CODE-EXPORT (sauber aus dem Baum generiert – keine Regex-Bereinigung mehr)
   ========================================================================= */

function elClass(el){ return el.id === 0 ? 'site-container' : ('el-' + el.id); }

function exportElement(el, mode, cssMap){
  if(el.tag === 'hr'){
    if(mode === 'separated'){
      cssMap.set('.' + elClass(el), styleDeclarations(el));
      return '<hr class="' + elClass(el) + '">';
    }
    return '<hr style="' + styleDeclarations(el).join('; ') + '">';
  }

  if(el.tag === 'accordion'){
    const cls = elClass(el);
    const childrenHtml = el.children.map(c => exportElement(c, mode, cssMap)).join('\n');
    if(mode === 'separated'){
      cssMap.set('.' + cls, accordionOuterDecl(el));
      cssMap.set('.' + cls + '-header', accordionHeaderDecl(el));
      cssMap.set('.' + cls + '-body', accordionBodyDecl(el).concat(['display: none']));
      cssMap.set('.' + cls + '-body.open', ['display: block']);
      return '<div class="' + cls + '">\n' +
        '  <button type="button" class="' + cls + '-header" onclick="this.nextElementSibling.classList.toggle(\'open\')">' + escapeHtml(el.text) + ' <span aria-hidden="true">&#9662;</span></button>\n' +
        '  <div class="' + cls + '-body' + (el.style.openByDefault ? ' open' : '') + '">\n' + childrenHtml + '\n  </div>\n</div>';
    }
    const outerStyle = accordionOuterDecl(el).join('; ');
    const headerStyle = accordionHeaderDecl(el).join('; ');
    const bodyStyle = accordionBodyDecl(el).join('; ') + '; display:' + (el.style.openByDefault ? 'block' : 'none') + ';';
    return '<div style="' + outerStyle + '">\n' +
      '  <button type="button" style="' + headerStyle + '" onclick="var b=this.nextElementSibling; b.style.display = b.style.display===\'none\' ? \'block\' : \'none\';">' + escapeHtml(el.text) + ' <span aria-hidden="true">&#9662;</span></button>\n' +
      '  <div style="' + bodyStyle + '">\n' + childrenHtml + '\n  </div>\n</div>';
  }

  if(isContainer(el.tag)){
    const tagName = CONTAINER_HTML_TAG[el.tag];
    const childrenHtml = el.children.map(c => exportElement(c, mode, cssMap)).join('\n');
    if(mode === 'separated'){
      cssMap.set('.' + elClass(el), styleDeclarations(el));
      return '<' + tagName + ' class="' + elClass(el) + '">\n' + childrenHtml + '\n</' + tagName + '>';
    }
    return '<' + tagName + ' style="' + styleDeclarations(el).join('; ') + '">\n' + childrenHtml + '\n</' + tagName + '>';
  }

  if(el.tag === 'input'){
    if(mode === 'separated'){ cssMap.set('.' + elClass(el), styleDeclarations(el)); return '<input type="text" placeholder="' + escapeAttr(el.placeholder) + '" class="' + elClass(el) + '">'; }
    return '<input type="text" placeholder="' + escapeAttr(el.placeholder) + '" style="' + styleDeclarations(el).join('; ') + '">';
  }
  if(el.tag === 'a'){
    if(mode === 'separated'){ cssMap.set('.' + elClass(el), styleDeclarations(el)); return '<a href="' + escapeAttr(el.href || '#') + '" class="' + elClass(el) + '">' + escapeHtml(el.text) + '</a>'; }
    return '<a href="' + escapeAttr(el.href || '#') + '" style="' + styleDeclarations(el).join('; ') + '">' + escapeHtml(el.text) + '</a>';
  }
  if(mode === 'separated'){ cssMap.set('.' + elClass(el), styleDeclarations(el)); return '<' + el.tag + ' class="' + elClass(el) + '">' + escapeHtml(el.text) + '</' + el.tag + '>'; }
  return '<' + el.tag + ' style="' + styleDeclarations(el).join('; ') + '">' + escapeHtml(el.text) + '</' + el.tag + '>';
}

function updateCodeOutput(){
  const cssMap = new Map();
  const bodyHtml = exportElement(root, 'separated', cssMap);
  const fullHtml = '<!DOCTYPE html>\n<html lang="de">\n<head>\n<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Meine Website</title>\n' +
    '<link rel="stylesheet" href="style.css">\n</head>\n<body>\n\n' + bodyHtml + '\n\n</body>\n</html>';

  let cssStr = '';
  cssMap.forEach((decls, cls) => { cssStr += cls + ' {\n  ' + decls.join(';\n  ') + ';\n}\n\n'; });

  const htmlEl = document.getElementById('code-html');
  const cssEl = document.getElementById('code-css');
  const inlineEl = document.getElementById('code-inline');
  if(htmlEl) htmlEl.value = fullHtml;
  if(cssEl) cssEl.value = cssStr.trim();
  if(inlineEl) inlineEl.value = exportElement(root, 'inline', new Map());
}

/* =========================================================================
   PROPERTIES-PANEL
   ========================================================================= */

function composeFieldsForTag(tag){
  if(tag === 'hr'){
    return [
      {label:'Dicke (px)', type:'number', path:'style.thickness', min:1, max:20},
      {label:'Linienstil', type:'select', path:'style.borderS', options:[['solid','Solide'],['dashed','Gestrichelt'],['dotted','Gepunktet']]},
      {label:'Farbe', type:'color', path:'style.color'},
      {label:'Abstand oben/unten (px)', type:'number', path:'style.marginY', min:0, max:150},
      {label:'Breite (%)', type:'number', path:'style.width', min:1, max:100}
    ];
  }
  if(tag === 'accordion'){
    return [
      {label:'Kopf-Hintergrund', type:'color', path:'style.headerBg'},
      {label:'Kopf-Textfarbe', type:'color', path:'style.headerColor'},
      {label:'Kopf-Padding (px)', type:'number', path:'style.headerPadding', min:0, max:60},
      {label:'Kopf-Schriftgröße (px)', type:'number', path:'style.headerFontSize', min:10, max:36},
      {label:'Inhalt-Hintergrund', type:'color', path:'style.bodyBg'},
      {label:'Inhalt-Padding (px)', type:'number', path:'style.bodyPadding', min:0, max:80},
      {label:'Ecken-Radius (px)', type:'number', path:'style.radius', min:0, max:60},
      {label:'Rahmenbreite (px)', type:'number', path:'style.borderW', min:0, max:10},
      {label:'Rahmenfarbe', type:'color', path:'style.borderC'},
      {label:'Breite (%)', type:'number', path:'style.width', min:10, max:100},
      {label:'Standardmäßig geöffnet', type:'checkbox', path:'style.openByDefault'}
    ];
  }
  const fields = [
    {label:'Hintergrundfarbe', type:'color', path:'style.bg'},
    {label:'Textfarbe', type:'color', path:'style.color'},
    {label:'Schriftart', type:'select', path:'style.fontFamily', options:FONT_OPTIONS},
    {label:'Schriftgröße (px)', type:'number', path:'style.fontSize', min:8, max:96},
    {label:'Schriftstärke', type:'select', path:'style.fontWeight', options:[['400','Normal'],['600','Halbfett'],['700','Fett']]},
    {label:'Textausrichtung', type:'select', path:'style.textAlign', options:[['left','Links'],['center','Zentriert'],['right','Rechts']]},
    {label:'Padding (px)', type:'number', path:'style.padding', min:0, max:150},
    {label:'Außenabstand (px)', type:'number', path:'style.margin', min:0, max:150},
    {label:'Ecken-Radius (px)', type:'number', path:'style.radius', min:0, max:100},
    {label:'Rahmenbreite (px)', type:'number', path:'style.borderW', min:0, max:20},
    {label:'Rahmenstil', type:'select', path:'style.borderS', options:[['solid','Solid'],['dashed','Dashed'],['dotted','Dotted']]},
    {label:'Rahmenfarbe', type:'color', path:'style.borderC'},
    {label:'Breite (%, 0 = auto)', type:'number', path:'style.width', min:0, max:100}
  ];
  if(isContainer(tag)){
    fields.push(
      {label:'Flex-Richtung', type:'select', path:'style.direction', options:[['row','Reihe'],['column','Spalte']]},
      {label:'Justify-Content', type:'select', path:'style.justify', options:[['flex-start','Start'],['center','Zentriert'],['flex-end','Ende'],['space-between','Space-between'],['space-around','Space-around']]},
      {label:'Align-Items', type:'select', path:'style.alignItems', options:[['stretch','Stretch'],['center','Zentriert'],['flex-start','Start'],['flex-end','Ende']]},
      {label:'Abstand (Gap, px)', type:'number', path:'style.gap', min:0, max:100}
    );
  }
  if(tag === 'a') fields.push({label:'Link-Ziel (href)', type:'text', path:'href'});
  if(tag === 'input') fields.push({label:'Platzhaltertext', type:'text', path:'placeholder'});
  return fields;
}

function fieldWrapper(label, inputHtml){ return '<div class="control-group"><label>' + label + '</label>' + inputHtml + '</div>'; }

function renderPropertiesPanel(){
  const el = findNode(root, selectedId) || root;
  document.getElementById('prop-target-label').textContent = TAG_LABELS[el.tag] || el.tag;

  const fields = composeFieldsForTag(el.tag);
  document.getElementById('prop-fields').innerHTML = fields.map(f => {
    const val = getPath(el, f.path);
    if(f.type === 'color'){
      return fieldWrapper(f.label, '<input type="color" value="' + (val || '#ffffff') + '" oninput="setFieldValue(\'' + f.path + '\', this.value)">');
    }
    if(f.type === 'number'){
      return fieldWrapper(f.label, '<input type="number" value="' + (val == null ? '' : val) + '" min="' + (f.min ?? 0) + '" max="' + (f.max ?? 999) + '" oninput="setFieldValue(\'' + f.path + '\', Number(this.value))">');
    }
    if(f.type === 'select'){
      return fieldWrapper(f.label, '<select onchange="setFieldValue(\'' + f.path + '\', this.value)">' +
        f.options.map(([v,l]) => '<option value="' + v + '" ' + (v === val ? 'selected' : '') + '>' + l + '</option>').join('') + '</select>');
    }
    if(f.type === 'checkbox'){
      return fieldWrapper(f.label, '<input type="checkbox" ' + (val ? 'checked' : '') + ' onchange="setFieldValue(\'' + f.path + '\', this.checked)">');
    }
    if(f.type === 'text'){
      return fieldWrapper(f.label, '<input type="text" value="' + escapeAttr(val || '') + '" oninput="setFieldValue(\'' + f.path + '\', this.value)">');
    }
    return '';
  }).join('');

  const isRoot = el.id === 0;
  document.getElementById('element-actions').innerHTML = isRoot
    ? '<p class="hint-text">Seiten-Container – das Basis-Layout der ganzen Seite.</p>'
    : '<button class="mini-action" onclick="moveElement(' + el.id + ',-1)" title="Nach oben">↑ Hoch</button>' +
      '<button class="mini-action" onclick="moveElement(' + el.id + ',1)" title="Nach unten">↓ Runter</button>' +
      '<button class="mini-action" onclick="outdentElement(' + el.id + ')" title="Eine Ebene raus">⇤ Raus</button>' +
      '<button class="mini-action" onclick="indentElement(' + el.id + ')" title="In voriges Element rein">⇥ Rein</button>' +
      '<button class="mini-action" onclick="duplicateElement(' + el.id + ')" title="Duplizieren">⧉ Duplizieren</button>' +
      '<button class="mini-action danger" onclick="deleteElementById(' + el.id + ')" title="Löschen">🗑 Löschen</button>';
}

function setFieldValue(path, value){
  const el = findNode(root, selectedId) || root;
  setPath(el, path, value);
  updatePreview();
}

/* =========================================================================
   CODE-EXPORT UI
   ========================================================================= */

function toggleCodeFormat(){
  const format = document.querySelector('input[name="codeFormat"]:checked').value;
  document.getElementById('separated-code-container').style.display = format === 'separated' ? 'flex' : 'none';
  document.getElementById('inline-code-container').style.display = format === 'separated' ? 'none' : 'flex';
}

function copyIndividual(elementId, btnElement){
  const copyText = document.getElementById(elementId);
  copyText.select();
  navigator.clipboard.writeText(copyText.value);
  const originalText = btnElement.innerText;
  btnElement.innerText = '✓ Kopiert!';
  btnElement.classList.add('copied');
  setTimeout(() => { btnElement.innerText = originalText; btnElement.classList.remove('copied'); }, 2000);
}

document.addEventListener('DOMContentLoaded', () => { updatePreview(); renderPropertiesPanel(); });
