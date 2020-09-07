
console.log('hi from js');
function requireAll(r) {
    r.keys().forEach(r);
  }

  requireAll(require.context('../svg-sprite/', true, /\.svg$/));

