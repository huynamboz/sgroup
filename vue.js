class Dependency {
  constructor(value) {
    this.subscribers = new Set();
  }

  set value(val) {
    this.notify();
  }
  get value() {
    this.subscribe();
  }

  subscribe() {
    if (currentEffect) this.subscribers.add(currentEffect)
  }

  notify() {
    this.subscribers.forEach(callback => callback())
  }

}
let dependencyMap = new WeakMap()
function getDependency(target, key) {
  let dependenciesForTarget = dependencyMap.get(target)
  if (!dependenciesForTarget) {
    dependencyMap.set(target, (dependenciesForTarget = new Map()))
  }
  let dependency = dependenciesForTarget.get(key)
  if (!dependency) {
    dependency = new Dependency()
    dependenciesForTarget.set(key, dependency)
  }
  return dependency
}

function watchEffect(callback) {
  currentEffect = callback
  callback()
  currentEffect = null
}
function reactive (raw) {
  return new Proxy(raw, {
    get( target, key, receiver) {
      const dependency = getDependency(target, key)
      dependency.subscribe()
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const dependency = getDependency(target, key)
      const result = Reflect.set(target, key, value, receiver)
      dependency.notify()
      return result
    }
  })
}

function ref(raw) {
  return reactive({value: raw})
}

class ComputedRef {
  constructor(fn) {
    this._value = new Dependency()
    this._fn = fn
    watchEffect(() => {
      this._value.notify()
    })
  }
  get value() {
    this._value.subscribe()
    return this._fn()
  }
}