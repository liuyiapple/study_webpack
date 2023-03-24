import add from './add'
console.log(add(1, 2))
document.querySelector('#btn').onclick = function () {
  import('./add')
    .then((res) => {
      console.log(res.default(9, 8))
    })
    .catch((err) => {
      console.log(err)
    })
}
