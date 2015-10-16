
'use strict';

// rAF.js
// https://gist.github.com/paulirish/1579671
(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];

  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
      || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element){
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function(){
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id){
      clearTimeout(id);
    };
  }
}());

window.sr = new scrollReveal();

(function(){
  var prev = 0;
  var num = 1;
  var phrases = [
    'outsource their development',
    'add extra value to their business',
    'enhance their existing products',
    'reach a wider audience',
    'test market penetration',
  ];

  $(document).ready(function() {
    changeNavbar();

    setInterval(function(){
      $('.animated-header').html(phraseHtml(phrases[num]));
      num = num < phrases.length - 1 ? num + 1 : 0;
    }, 3000);

    $(document).on('click', '.header-nav-trigger', function(e){
      e.preventDefault();
      $('.main-navigation').addClass('shown');
      $('body').addClass('no-scroll');
      $(this).addClass('close');
    });

    $(document).on('click', '.header-nav-trigger.close', function(e){
      e.preventDefault();
      $('body').removeClass('no-scroll');
      $('.main-navigation').removeClass('shown');
      $(this).removeClass('close');
    });

    $(document).on('click', '.to-scroll', function(e) {
      e.preventDefault();
      $('html, body')
        .stop()
        .animate({
          scrollTop: $($(this).attr('href')).offset().top - 50
        }, '500', 'swing');
    });
  });

  $(window).scroll(function(){
    changeNavbar();
  });

  function phraseHtml(text) {
    var html = '<strong class="animated flipInX">';
    html += text + '</strong>';
    return html;
  }

  function changeNavbar() {
    var scroll = $(window).scrollTop();
    if (scroll >= 100) {
      prev = scroll;
      $('header').addClass('animated');
    } else {
      $('header').removeClass('animated');
    }
  }
})();

// contact form
(function(){
  function MailForm() {
    this.$form = $('[name=emailform]');
    this.$firstName = $('[name=firstname]');
    this.$lastName = $('[name=lastname]');
    this.$email = $('[name=email]');
    this.$phone = $('[name=phone]');
    this.$message = $('[name=message]');
  }

  MailForm.prototype.init = function(){
    var self = this;

    this.$form.on('submit', function(e){
      e.preventDefault();
    });

    this.$form.on('click', 'button[type="submit"]', function(e){
      if (!self.isValid()) {
        return;
      }

      $.ajax({
        url: '/mail.php',
        dataType: 'json',
        data: {
          firstName: self.$firstName.val(),
          lastName: self.$lastName.val(),
          email: self.$email.val(),
          phone: self.$phone.val(),
          message: self.$message.val(),
        },
        method: 'post',
        success: function(){
          console.log('sended');
        },
      });
    });
  };

  MailForm.prototype._validEmail = function(email){
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  };

  MailForm.prototype.isValid = function(){
    var valid = true;
    this.$form.find('input, textarea').removeClass('has-error');

    if ('' === this.$firstName.val()) {
      valid = false;
      this.$firstName.addClass('has-error');
    }

    if ('' === this.$lastName.val()) {
      valid = false;
      this.$lastName.addClass('has-error');
    }

    if ('' === this.$email.val() || !this._validEmail(this.$email.val())) {
      valid = false;
      this.$email.addClass('has-error');
    }

    if ('' === this.$message.val()) {
      valid = false;
      this.$message.addClass('has-error');
    }

    return valid;
  };

  var mailform = new MailForm();
  mailform.init();
})();

// circles
(function(){
  function Circle(width, height) {
    this.reset(width, height);
    this.init();
  }

  Circle.prototype.reset = function(width, height){
    this.width = width;
    this.height = height;
  };

  Circle.prototype.init = function(){
    this.pos = {x: this.width * Math.random(), y: this.height + Math.random() * 80};
    this.alpha = 0.1 + Math.random() * 0.3;
    this.scale = 0.1 + Math.random() * 0.3;
    this.velocity = Math.random();
  };

  Circle.prototype.draw = function(){
    if (this.alpha <= 0) {
      this.init();
    }

    this.pos.y -= this.velocity;
    this.alpha -= 0.0004;

    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.scale * 20, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'rgba(100, 100, 100, ' + this.alpha + ')';
    ctx.fill();
  };

  var $header = $('.header');
  var canvas = $('canvas').get(0);

  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var shouldAnimate = true;
  var circles = [];
  var width;
  var height;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    $header.height(height);

    canvas.width = width;
    canvas.height = height;
  }

  function animate() {
    if (shouldAnimate) {
      ctx.clearRect(0, 0, width, height);
      circles.forEach(function(circle){
        circle.draw();
      });
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('scroll', function(){
    shouldAnimate = document.body.scrollTop <= height;
  });

  window.addEventListener('resize', function(){
    resize();

    circles.forEach(function(circle){
      circle.reset(width, height);
    });
  });

  resize();

  for (var x = 0; x < width * 0.2; x++) {
    circles.push(new Circle(width, height));
  }

  animate();
})();

// map
(function(){
  function initMap() {

    var mapEl = $('.map').get(0);
    if (!mapEl) return;

    // Specify features and elements to define styles.
    var styleArray = [
      {
        featureType: "all",
        stylers: [
         { saturation: -80 }
        ]
      },{
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
          { hue: "#00ffee" },
          { saturation: 50 }
        ]
      },{
        featureType: "poi.business",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }
    ];

    var irbisLatLng = {lat: -38.0083271, lng: -57.5517072};

    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(mapEl, {
      center: irbisLatLng,
      scrollwheel: false,
      mapTypeControl: false,
      // Apply the map style array to the map.
      styles: styleArray,
      zoom: 14,
    });

    var image = {
      url: '/media/images/marker@2x.png',
      size: new google.maps.Size(50, 81),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 81),
    };

    // Create a marker and set its position.
    var marker = new google.maps.Marker({
      map: map,
      position: irbisLatLng,
      title: 'Irbislab',
      icon: image,
    });
  }

  window.initMap = initMap;
})();
