(function(w){
  'use strict';

  w.log = function(){
    if (window.console && console.log) {
      var a = ['[IL]'].concat([].slice.call(arguments));
      console.log.apply(console, a);
    }
  };

  w.q = qwery;

  w.qs = function(){
    return qwery.apply(this, arguments)[0];
  };

  w.qid = function(){
    return document.getElementById(arguments[0]);
  };

  w.qtag = function(){
    return document.getElementsByTagName(arguments[0]);
  };

  w.getWindowSize = function(){
    var w = window;
    var d = document;
    var e = d.documentElement;
    var g = d.getElementsByTagName('body')[0];
    var width = w.innerWidth || e.clientWidth || g.clientWidth;
    var height = w.innerHeight || e.clientHeight || g.clientHeight;
    return { height: height, width: width };
  };

  w.getHeight = function(el){
    var borderT = parseFloat(el.style.borderTopWidth) || 0;
    var borderB = parseFloat(el.style.borderBottomWidth) || 0;
    var paddingT = parseFloat(el.style.paddingTop) || 0;
    var paddingB = parseFloat(el.style.paddingBottom) || 0;
    return el.offsetHeight - borderT - borderB - paddingT - paddingB;
  };

  w.getScrollY = function(){
    return (window.pageYOffset !== undefined) ? window.pageYOffset :
      (document.documentElement || document.body.parentNode || document.body)
      .scrollTop;
  }
})(window);

(function(bean) {
  'use strict';
  bean.setSelectorEngine(qwery);
  bean.replace = function(b, a, c){
    bean.add(b, a, function(d){
      try {
        c.apply(this, arguments);
      } finally {
        d.preventDefault();
      }
    });
  };
})(bean);

domready(function(){
  if (document.documentElement.classList.contains('touch')) {
    var toggleLabel = qs('label[for=nav-toggle]');
    var toggleInput = qid('nav-toggle');
    var tapToggle = new Tap(toggleLabel);

    bean.on(toggleLabel, 'click', function(e){
      e.preventDefault();
    });
    bean.on(toggleLabel, 'tap', function(e){
      toggleInput.checked = !toggleInput.checked;
    });
  }

  if (qid('irbers')) {
    bean.on(qid('irbers'), 'mouseenter mouseleave', 'a', function(e){
      q('a', e.target.parentNode).forEach(function(x){
        if (x !== e.target) {
          if (e.type === 'mouseover') x.classList.add('inactive');
          else if (e.type === 'mouseout') x.classList.remove('inactive');
        }
      });
    });
  }

  $('a[href^="#"]').on('click', function(e){
    e.preventDefault();
    $('html, body').animate({ scrollTop: $(this.hash).offset().top - 58 }, 300);
  });
});
