let currentEffect = null
class Ref {
  constructor(value) {
    this.subscribers = new Set();
    this._value = value
  }

  set value(val) {
    this._value = val
    this.notify();
  }
  get value() {
    this.subscribe();
    return this._value
  }

  subscribe() {
    if (currentEffect) this.subscribers.add(currentEffect)
  }

  notify() {
    this.subscribers.forEach(callback => callback())
  }

}

function watchEffect(callback) {
  currentEffect = callback
  callback()
  currentEffect = null
}
function ref(value) {
  return new Ref(value)
}

function computed(callback) {
  return new ComputedRef(callback)
}
class ComputedRef {
  constructor (callback) {
    this._callback = ref()
    watchEffect(() => {
      this._callback.value = callback()
    })
  }
  get value() {
    return this._callback.value
  }
}

let a1 = ref("a")

let a = computed(() => {
  console.log("hi", a1.value)
})
a1.value = "b"