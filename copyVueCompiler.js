function h(tag, props, child) {
  return {
    tag,
    props,
    child
  }
}

function mount(vnode) {
  const el = document.createElement(vnode.tag)
  if (vnode.props) {
    Object.keys(vnode.props).forEach(key => {
      const value = vnode.props[key]

      if (typeof value === 'string') {
        el.setAttribute(key, value)
      }
      if (key === 'style') {
       if (typeof value === 'object' && value) {
        // check if prop is a style css
          Object.keys(value).forEach(key =>{
            const val = value[key]
            el.style[key] = val
          })
        }
      }

      if (key === 'class') {
        if (typeof value === 'string') {
          el.setAttribute(key, value)
        }
        else if (Array.isArray(value)) {
          value.forEach(item => {
            if (typeof item === 'string') {
              el.classList.add(item)
            } else if (typeof item === 'object' && item) {
              Object.keys(item).forEach(k => {
                if (item[k]) {
                  el.classList.add(k)
                }
              })
            }
          })
        }
        else if (typeof value === 'object' && value) {
         Object.keys(value).forEach(k => {
            if (value[k]) {
              el.classList.add(k)
            }
          })
        }
      }
    })
  }
  if (vnode.child && vnode.child.length > 0) {
      console.log(vnode.child)
      if (Array.isArray(vnode.child))
      {
        vnode.child.forEach(c => {
          el.appendChild(mount(c))
        })
      } else el.innerHTML = vnode.child
  } 
  return el
}

const VNode = h('div', null, [
  h('p', {
    style: {
      color: "red",
      fontSize: '20px'
    },
    class: ['h1', 'h2', {'active': 1 > 2}]
  }
  , 'helloworld')
])
function createApp(option) {
    const el = mount(option.component)
    console.log(el)
    const main = document.querySelector(option.id)
    console.log(main, option.id)
  main.appendChild(el)
}
createApp({
  id: "#app",
  component: VNode
})
