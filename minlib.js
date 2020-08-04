Function.prototype.bind = Function.prototype.bind || function() {
  var f = this, a = [];
  for( var i = 0; i < arguments.length; i++ ) a.push( arguments[i] );
  var ob = a.shift();
  return function() {
    var a2 = [];
    for( var i = 0; i < arguments.length; i++ ) a2.push( arguments[i] );
    return f.apply( ob, a.concat( a2 ) );
  }
}
var Class = {
  create: function() {
    return function() {
      this.init.apply(this, arguments);
    }
  }
};
var MinLib = Class.create();
MinLib.prototype = {
  init: function() {
  },
  nclass: function() {
    return Class.create();
  },
  nel: function(t) {
    return document.createElement(t);
  },
  ndiv: function(c) {
    var d = this.nel('div');
    d.className = c;
    return d;
  },
  ntext: function(t) {
    return document.createTextNode(t);
  },
  gel: function(i) {
    return document.getElementById(i);
  },
  app: function(a,b) {
    if( Array.isArray(b) ) {
      for( var i=0;i<b.length;i++ ) a.appendChild( b[i] );
      return;
    }
    a.appendChild(b);
  },
  nbr: function(c) {
    var b = document.createElement('br');
    if(c) b.clear = c;
    return b;
  },
  clear: function(e) {
    if(!e) return;
    while(e.firstChild) e.removeChild(e.firstChild);
  },
  gbyclass: function(c, root) {
    root = root || document.body;
    //if(root.getElementsByClassName) return root.getElementsByClassName(c);
    c = ' ' + c + ' ';
    var a = root.getElementsByTagName('*'),res = [];
    for( var i = 0; i < a.length; i++ )
      if( (' ' + a[i].className + ' ').indexOf(c) != -1 ) res.push( a[i] );
    return res;
  },
  delallclass: function(c) {
    var a = this.gbyclass(c);
    for( var i=0;i<a.length;i++ ) a[i].parentNode.removeChild(a[i]);
  },
  posof: function(e) {
    var r = e.getBoundingClientRect();
    return [ r.left, r.top + window.scrollY ];
  },
  JSF: function(seed) {
    function jsf() {
      var e = s[0] - ( s[1]<<27 | s[1]>>>5 );
      s[0] = s[1] ^ ( s[2]<<17 | s[2]>>>15 ),
      s[1] = s[2] + s[3],
      s[2] = s[3] + e, s[3] = s[0] + e;
      return ( s[3] >>> 0 ) / 4294967296; // 2^32
    }
    seed >>>= 0;
    var s = [0xf1ea5eed, seed, seed, seed];
    for( var i = 0; i < 20; i++ ) jsf();
    return jsf;
  }
};

export default MinLib;