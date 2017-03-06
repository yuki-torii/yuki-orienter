/**
 * Orienter
 */
class Orienter {
  /**
   * constructor
   * @param {*} options
   */
  constructor (options = {}) {
    const self = this

    self.initDefaultOptions()
    self.bindEvent()

    Object.assign(this, options)
  }

  /**
   * init default options
   */
  initDefaultOptions () {
    const self = this

    self.lon = 0
    self.lat = 0
    self.direction = window.orientation || 0
    self.fix = 0
    self.os = ''
    self.onOrient = () => { }
    self.onChange = () => { }

    switch (self.direction) {
      case 0:
        self.fix = 0
        break
      case 90:
        self.fix = -270
        break
      case -90:
        self.fix = -90
        break
    }

    if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      self.os = 'ios'
    } else {
      self.os = (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux')) ? 'android' : ''
    }
  }

  /**
   * bind deviceorientation and orientationchange
   */
  bindEvent () {
    const self = this
    window.addEventListener('deviceorientation', self.orientHandle.bind(self), false)
    window.addEventListener('orientationchange', self.changeHandle.bind(self), false)
  }

  /**
   * handle orientationchange event
   */
  changeHandle () {
    const self = this
    self.direction = window.orientation
    self.onChange(self.direction)
  }

  /**
   * handle deviceorientation event
   * @param {*} event
   */
  orientHandle (event) {
    const self = this
    switch (self.os) {
      case 'ios':
        switch (self.direction) {
          case 0:
            self.lon = event.alpha + event.gamma
            if (event.beta > 0) self.lat = event.beta - 90
            break
          case 90:
            if (event.gamma < 0) {
              self.lon = event.alpha - 90
            } else {
              self.lon = event.alpha - 270
            }
            if (event.gamma > 0) {
              self.lat = 90 - event.gamma
            } else {
              self.lat = -90 - event.gamma
            }
            break
          case -90:
            if (event.gamma < 0) {
              self.lon = event.alpha - 90
            } else {
              self.lon = event.alpha - 270
            }
            if (event.gamma < 0) {
              self.lat = 90 + event.gamma
            } else {
              self.lat = -90 + event.gamma
            }
            break
        }
        break
      case 'android':
        switch (self.direction) {
          case 0:
            self.lon = event.alpha + event.gamma + 30
            if (event.gamma > 90) {
              self.lat = 90 - event.beta
            } else {
              self.lat = event.beta - 90
            }
            break
          case 90:
            self.lon = event.alpha - 230
            if (event.gamma > 0) {
              self.lat = 270 - event.gamma
            } else {
              self.lat = -90 - event.gamma
            }
            break
          case -90:
            self.lon = event.alpha - 180
            self.lat = -90 + event.gamma
            break
        }
        break
    }

    self.lon += self.fix
    self.lon %= 360
    if (self.lon < 0) self.lon += 360

    self.lon = Math.round(self.lon)
    self.lat = Math.round(self.lat)

    self.onOrient({
      a: Math.round(event.alpha),
      b: Math.round(event.beta),
      g: Math.round(event.gamma),
      lon: self.lon,
      lat: self.lat,
      dir: self.direction
    })
  }
}

export default Orienter
