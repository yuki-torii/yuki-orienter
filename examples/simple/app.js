import Orienter from 'yuki-orienter'

const appEl = document.getElementById('app')

const orienter = new Orienter({
  onOrient (e) {
    appEl.innerHTML = `
      <ul>
        <li> a : ${e.a} </li>
        <li> b : ${e.b} </li>
        <li> g : ${e.g} </li>
        <li> lon : ${e.lon} (0 - 360)</li>
        <li> lat : ${e.lat} (-270 - 90) </li>
        <li> dir : ${e.dir} </li>
      </ul>
    `
  }
})
