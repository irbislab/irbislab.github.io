(function(w){
  'use strict';

  w.log = function(){
    if (window.console && console.log) {
      var a = ['[irbis]'].concat([].slice.call(arguments));
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
    var w = window
      , d = document
      , e = d.documentElement
      , g = d.getElementsByTagName('body')[0]
      , width = w.innerWidth || e.clientWidth || g.clientWidth
      , height = w.innerHeight || e.clientHeight || g.clientHeight;

    return { height: height, width: width };
  };

  w.getHeight = function(el){
    var borderT = parseFloat(el.style.borderTopWidth) || 0
      , borderB = parseFloat(el.style.borderBottomWidth) || 0
      , paddingT = parseFloat(el.style.paddingTop) || 0
      , paddingB = parseFloat(el.style.paddingBottom) || 0;

    return el.offsetHeight - borderT - borderB - paddingT - paddingB;
  };

  w.getScrollY = function() {
    return (window.pageYOffset !== undefined) ? window.pageYOffset :
      (document.documentElement || document.body.parentNode || document.body).scrollTop
  }

  w.validateInput = function(i){
    var error = 0;
    if (i.classList.contains('required')) {
      if (i.value.length === 0
          || (i.type.indexOf('select') === 0
              && i.options[i.selectedIndex].value === '')) {
        i.classList.add('error');
        error = 1;
      } else {
        i.classList.remove('error');
      }
    }
    return error;
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
    var toggleLabel = qs('label[for=nav-toggle]')
      , toggleInput = qid('nav-toggle')
      , tapToggle = new Tap(toggleLabel);

    bean.on(toggleLabel, 'click', function(e){
      e.preventDefault();
    });
    bean.on(toggleLabel, 'tap', function(e){
      toggleInput.checked = !toggleInput.checked;
    });
  }

  if (getScrollY() < 160 && getWindowSize().width < 680) {
    qs('.logo > img').src = 'images/iso.png';
  }

  bean.on(window, 'resize', function(){
    var header = qtag('header')[0]
      , hs = qid('hs')
      , winWidth = getWindowSize().width;

    if (winWidth <= 680) {
      qs('.logo > img').src = 'images/iso.png';
    }

    if (winWidth < 768) {
      header.style.position = 'static';
      hs.style.paddingTop = '6.2em';
    } else {
      qs('.logo > img').src = 'images/iso-blast.png';
    }
  });

  bean.on(window, 'scroll', function(){
    var header = qtag('header')[0]
      , hs = qid('hs')
      , logo = qs('.logo > img')
      , winHeight = getWindowSize().height
      , winWidth = getWindowSize().width
      , winScrollY = getScrollY();

    if (winWidth > 768) {
      header.style.position = 'fixed';

      if (document.body.id === 'section') {
        hs.style.paddingTop = '7.6em';
      } else {
        hs.style.paddingTop = '11.6em';
      }

      if (winScrollY > 160) {
        header.classList.add('fixed');
        logo.src = 'images/iso.png';
      } else if (winScrollY <= 0) {
        header.style.position = 'static';

        if (document.body.id === 'section') {
          hs.style.paddingTop = '2.2em';
        } else {
          hs.style.paddingTop = '6.2em';
        }

        logo.src = 'images/iso-blast.png';
        header.classList.remove('fixed');
      } else {
        header.classList.remove('fixed');
        logo.src = 'images/iso-blast.png';
      }
    } else {
      header.style.position = 'static';
    }
  });

  var cf = qs('form[method="post"]');
  if (cf) {
    bean.on(cf, 'submit', function(e){
      var f = e.target
        , error = 0;
      q('input, textarea', f).forEach(function(x){
        if (validateInput(x)) error = 1;
      });
      if (error) e.preventDefault();
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
});
