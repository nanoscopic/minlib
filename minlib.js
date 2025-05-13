const Class = () => function (...a) { this.init(...a); };
var MinLib = Class();
const frompx = v => parseFloat(v) || 0;
MinLib.prototype = {
  init: function() {
  },
  nclass: Class,
  nel: document.createElement.bind(document),
  ndiv: function(c) {
    const d = this.nel('div');
    d.className = c;
    return d;
  },
  ntext: document.createTextNode.bind(document),
  ntextplus: function(str) {
      const d = this.mk('div', { innerHTML: str } );
      return this.ntext( d.textContent );
  },
  gel: i => document.getElementById(i),
  app: function(a,b) {
    Array.isArray(b) ? b.forEach(el => a.appendChild(el)) : a.appendChild(b);
  },
  nbr: function(c) {
    const b = this.nel('br');
    if(c) b.clear = c;
    return b;
  },
  clear: e => {
    if(e) while(e.firstChild) e.firstChild.remove();
  },
  gbyclass: function(c, root = document.body) {
    return [...root.getElementsByClassName(c)];
  },
  delallclass: function(c) {
    for( let el of this.gbyclass(c) ) el.remove();
  },
  posof: e => {
    const { left, top, width, height } = e.getBoundingClientRect();
    return [ left + scrollX, top + scrollY, width, height ];
  },
  posofInner: el => {
    const { left, top, width, height } = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    const l = frompx(s.borderLeftWidth  ) + frompx(s.paddingLeft  ),
          r = frompx(s.borderRightWidth ) + frompx(s.paddingRight ),
          t = frompx(s.borderTopWidth   ) + frompx(s.paddingTop   ),
          b = frompx(s.borderBottomWidth) + frompx(s.paddingBottom);
    return [left + l + scrollX, top  + t + scrollY, width - l - r, height - t  - b];
  },
  frag: () => document.createDocumentFragment(),
  on: (el,ev,fn) => el.addEventListener(ev,fn),
  mk: (tag, props = {}) => {
    const el = this.nel(tag);
    ml.forOwn(props, (k, v) => {
      if      (k === 'style') ml.forOwn( v, (s, sv) => { el.style[s] = sv;       });
      else if (k === 'attr' ) ml.forOwn( v, (a, av) => { el.setAttribute(a, av); });
      else el[k] = v;
    });
    return el;
  },
  forOwn: (o, fn) => {
    for(const k in o) if( o.hasOwnProperty(k) ) fn(k, o[k]);
  },
  setAttrs: (el, obj) => {
    ml.forOwn( obj, (k, v) => { el.setAttribute(k, v); } );
  },
  setStyles: (el, obj) => {
    ml.forOwn( obj, (k, v) => { el.style[k] = v; } );
  },
  JSF: seed => {
    function jsf() {
      const e = s[0] - ( s[1]<<27 | s[1]>>>5 );
      s[0] = s[1] ^ ( s[2]<<17 | s[2]>>>15 ),
      s[1] = s[2] + s[3],
      s[2] = s[3] + e, s[3] = s[0] + e;
      return ( s[3] >>> 0 ) / 4294967296; // 2^32
    }
    seed >>>= 0;
    const s = [0xf1ea5eed, seed, seed, seed];
    for( let i = 0; i < 20; i++ ) jsf();
    return jsf;
  },
  xhr: function(url, data, callback, ctx) {//callback
    const req = new XMLHttpRequest();
    req.open('POST', url);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function() {
      if( req.readyState === XMLHttpRequest.DONE ) {
        const text = req.responseText;
        const cb = ctx ? callback.bind(ctx) : callback;
        
        if( req.status !== 200 ) { cb(text, new Error('HTTP ' + req.status + ': ' + req.statusText)); return; }
        if( text[0] !== '{'    ) { cb(text, new Error('Invalid JSON: does not start with {')); return; }
        
        try       { cb( JSON.parse(text), null ); }
        catch (e) { cb( text, e ); }
      }
    };
    req.send(JSON.stringify(data));
  }
};
export default MinLib;