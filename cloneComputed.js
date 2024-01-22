// clone computed of vue
function makeObjComputed(data, computed) {
    let reactiveData = {};

    let reactProxy = new Proxy(reactiveData, {
      set: function(target, key, value) {
        const oldValue = target[key];
        target[key] = value;
        if (oldValue !== value) {
          console.log("Computed see change", key, value);
        }
        return true;
      },
    });
    Object.keys(computed).forEach((key) => {
      Object.defineProperty(reactProxy, key, {
        get: function() {
          return computed[key].call(reactProxy);
        },
        set: function() {
          console.log("Cannot set value for computed property");
        },
      });
    });
    Object.keys(data).forEach((key) => {
      reactProxy[key] = data[key];
    });
    return reactProxy;
}
let data = {
  name: "Khoa",
  age: 20,
};
let computed = {
  isAdult: function() {
    return this.age > 18;
  },
};
let reactiveData = makeObjComputed(data, computed);
console.log(reactiveData);
console.log(reactiveData.isAdult);
reactiveData.age = 13;
console.log(reactiveData.isAdult);
// reactiveData.isAdult = 20;
// console.log(reactiveData.isAdult);