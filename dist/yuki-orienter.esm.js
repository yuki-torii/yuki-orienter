/**
 * yuki-orienter v0.1.0
 * (c) 2017 Limichange
 * @license MIT
 */
/**
 * Orienter
 */
var Orienter = function Orienter (options) {
  if ( options === void 0 ) options = {};

  var self = this;

  self.initDefaultOptions();
  self.bindEvent();

  Object.assign(this, options);
};

/**
 * init default options
 */
Orienter.prototype.initDefaultOptions = function initDefaultOptions () {
  var self = this;

  self.lon = 0;
  self.lat = 0;
  self.direction = window.orientation || 0;
  self.fix = 0;
  self.os = '';
  self.onOrient = function () { };
  self.onChange = function () { };

  switch (self.direction) {
    case 0:
      self.fix = 0;
      break
    case 90:
      self.fix = -270;
      break
    case -90:
      self.fix = -90;
      break
  }

  if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    self.os = 'ios';
  } else {
    self.os = (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux')) ? 'android' : '';
  }
};

/**
 * bind deviceorientation and orientationchange
 */
Orienter.prototype.bindEvent = function bindEvent () {
  var self = this;
  window.addEventListener('deviceorientation', self.orientHandle.bind(self), false);
  window.addEventListener('orientationchange', self.changeHandle.bind(self), false);
};

/**
 * handle orientationchange event
 */
Orienter.prototype.changeHandle = function changeHandle () {
  var self = this;
  self.direction = window.orientation;
  self.onChange(self.direction);
};

/**
 * handle deviceorientation event
 * @param {*} event
 */
Orienter.prototype.orientHandle = function orientHandle (event) {
  var self = this;
  switch (self.os) {
    case 'ios':
      switch (self.direction) {
        case 0:
          self.lon = event.alpha + event.gamma;
          if (event.beta > 0) { self.lat = event.beta - 90; }
          break
        case 90:
          if (event.gamma < 0) {
            self.lon = event.alpha - 90;
          } else {
            self.lon = event.alpha - 270;
          }
          if (event.gamma > 0) {
            self.lat = 90 - event.gamma;
          } else {
            self.lat = -90 - event.gamma;
          }
          break
        case -90:
          if (event.gamma < 0) {
            self.lon = event.alpha - 90;
          } else {
            self.lon = event.alpha - 270;
          }
          if (event.gamma < 0) {
            self.lat = 90 + event.gamma;
          } else {
            self.lat = -90 + event.gamma;
          }
          break
      }
      break
    case 'android':
      switch (self.direction) {
        case 0:
          self.lon = event.alpha + event.gamma + 30;
          if (event.gamma > 90) {
            self.lat = 90 - event.beta;
          } else {
            self.lat = event.beta - 90;
          }
          break
        case 90:
          self.lon = event.alpha - 230;
          if (event.gamma > 0) {
            self.lat = 270 - event.gamma;
          } else {
            self.lat = -90 - event.gamma;
          }
          break
        case -90:
          self.lon = event.alpha - 180;
          self.lat = -90 + event.gamma;
          break
      }
      break
  }

  self.lon += self.fix;
  self.lon %= 360;
  if (self.lon < 0) { self.lon += 360; }

  self.lon = Math.round(self.lon);
  self.lat = Math.round(self.lat);

  self.onOrient({
    a: Math.round(event.alpha),
    b: Math.round(event.beta),
    g: Math.round(event.gamma),
    lon: self.lon,
    lat: self.lat,
    dir: self.direction
  });
};

export default Orienter;
