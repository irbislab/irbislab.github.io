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
