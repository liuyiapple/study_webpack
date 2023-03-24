// import 'core-js'
import 'core-js/es/promise'
import sum from './js/sum'
// import count from './js/count'
import './css/index.css'
import './less/index.less'
import './sass/index.scss'
import './css/iconfont.css'
import { add } from './js/math'
let a = 1
console.log(sum([1, 2, 3, 5, 8]))
console.log(a)
add(1, 2)
//  判断当前文件是否接收热更新
if (module.hot) {
  // 接收当前热更新文件
  module.hot.accept('./js/sum')
}
document.getElementById('btn').onclick = function () {
  import(/* webpackChunkName */ './js/count').then(({ count }) => {
    console.log(count(1, 3))
  })
}

new Promise((resolve) => {
  setTimeout(() => {
    console.log(1)
  }, 0)
})

const arr = [222, 2]
arr ?? 1

// PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .then((registration) => {
        console.log('SW registration', registration)
      })
      .catch((registrationError) => {
        console.log('SW registrationError', registrationError)
      })
  })
}
