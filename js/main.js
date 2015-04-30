(function () {

  'use strict';

  $(document).ready(init);

  var gallery;

  function init() {
    FastClick.attach(document.body);

    $('.model-icon').click(showModelContent);
    $('#main-menu').one('click', '.model-icon', initMain);
    $('#main-menu').one('click', initViewPtSize);
    $('#main-menu').one('click', initSwitchSize);

    $('#misc-btn').click(switchLayer);
    $('#misc-btn').one('click', cleanLayers);
  }

  function initMain() {
    $('#model-switch').on('switchChange.bootstrapSwitch', switchContent);
    $('.render-btn').click(changeRenderMode);
    $('.interp-btn').click(changeInterpMode);
    $('.lights-btn').click(changeLightsMode);
    $('.viewpt-btn').click(changeViewPtMode);
    $('.camera-btn').click(changeCameraMode);

    $('#screenshot-btn').click(takeScreenshot);
    $('#main-menu').addClass('after-choice');
    $('#choose-msg').hide();
    $('#main-title').hide();
    $('#candle-gallery').carousel('pause');
    $('main > *:not(#model-2d-content)').show();
  }

  function initSwitchSize() {
    $('#model-switch').bootstrapSwitch();

    enquire.register('(max-width: 800px)', {
      match: function () {
        $('#model-switch').bootstrapSwitch('size', 'small');
      },
      unmatch: function () {
        $('#model-switch').bootstrapSwitch('size', 'normal');
      }
    });
  }

  function initViewPtSize() {

    enquire.register('(max-width: 800px)', {
      match: function () {
        console.log('Does this work!');
        $('#x3dom-viewport-canvas').css('width', '500px');
        $('#x3dom-viewport-canvas').css('height', '300px');
      },
      unmatch: function () {
        $('#x3dom-viewport-canvas').css('width', '400px');
        $('#x3dom-viewport-canvas').css('height', '450px');
      }
    });
  }

  function switchContent(event, isChecked) {
    $('#model-3d-content').toggle();
    $('#model-2d-content').toggle();
  }

  function cleanLayers() {
    $('#main-title').removeClass('fade-in one');
    $('#choose-msg').removeClass('fade-in two');
    $('#main-menu').removeClass('fade-in two');
  }

  function switchLayer() {
    if (! $('body > footer').is(':visible')) {
      $('body > header, main').hide();
      $('body > footer').show();
    }
    else {
      $('body > header, main').show();
      $('body > footer').hide();
    }

    $('#misc-btn > span').toggleClass('glyphicon-menu-hamburger');
    $('#misc-btn > span').toggleClass('glyphicon-remove');
  }

  function showModelContent() {
    var base = 'data/models/';
    var element = $('#model-inline-data');
    var current = element.attr('url');
    var modelid = this.dataset.modelName;
    var clicked = base + modelid + '.x3d';
    var details = $('#' + modelid + '-description');

    if (current !== clicked) {
      element.attr('url', clicked);
    }

    details.siblings('div').hide();
    details.show();

    var gallery = $('#' + modelid + '-gallery');
    gallery.siblings().hide();
    gallery.show();
  }

  function setPrimaryButton() {
    var node = $(this);
    var sibs = node.siblings('.btn');
    sibs.removeClass('btn-primary');
    sibs.addClass('btn-default');
    node.removeClass('btn-default');
    node.addClass('btn-primary');
  }

  function changeRenderMode() {
    var run = document.getElementById('viewport').runtime;
    var doc = run.canvas.doc;

    doc._viewarea._points = this.dataset.renderId;
    doc.needRender = true;
  }

  function changeInterpMode() {
    var name = this.dataset.interpName;
    var full = 'museum__' + name + '-TIMER';
    var elem = document.getElementById(full);
    var sibs = document.getElementsByTagName('TimeSensor');
    var runt = document.getElementById('viewport').runtime;

    for (var i = sibs.length - 1; i >= 0; i--) {
      sibs[i].setAttribute('enabled', 'false');
    }

    if (elem) {
      runt.resetView();
      elem.setAttribute('stopTime', '0');
      elem.setAttribute('startTime', '1');
      elem.setAttribute('enabled', 'true');
    }
  }

  function changeLightsMode() {
    hideLights();

    var lights = $(this).data('lights');

    for (var i = lights.length - 1; i >= 0; i--) {
      if (lights[i] === 0) setTypeLight('DirectionalLight', 'true');
      if (lights[i] === 1) setTypeLight('PointLight', 'true');
      if (lights[i] === 2) setTypeLight('SpotLight', 'true');
      if (lights[i] === 3) setHeadLight('true');
    }
  }

  function changeViewPtMode() {
    document.getElementById('model-nav-info').setAttribute('type', this.dataset.navName);
  }

  function changeCameraMode() {
    var viewpoints = document.getElementsByTagName('Viewpoint');

    for(var i = 0; i < viewpoints.length; i++) {
      viewpoints[i].setAttribute('bind', 'false');
    }

    document.getElementById('museum__' + this.dataset.camName + 'Camera').setAttribute('bind', 'true');
    document.getElementById('viewport').runtime.resetView();
  }

  function takeScreenshot() {
    var imgurl = document.getElementById("viewport").runtime.getScreenshot();
    var output = $("#screenshot-out > a");
    var d = new Date();
    var n = "screenshot-" + d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds() + ".png";
    output.attr("href", imgurl);
    output.attr("download", n);
    output.html(n);
    $("#screenshot-out").show();
  }

  function hideLights() {
    setHeadLight('false');
    setTypeLight('DirectionalLight', 'false');
    setTypeLight('PointLight', 'false');
    setTypeLight('SpotLight', 'false');
  }

  function setHeadLight(state) {
    var light = document.getElementById('model-nav-info');
    light.setAttribute('headlight', state);
  }

  function setTypeLight(type, state) {
    var light = document.getElementsByTagName(type);
    for(var i = 0; i < light.length; i++) {
      light[i].setAttribute('on', state);
    }
  }

})();
