import path from 'path'

export async function ls (location = '') {
  const cwd = env.term.getCWD()
  location = location.toString()
  if (!location.startsWith('/')) {
    location = path.join(cwd.pathname, location)
  }

  // read
  var listing = await cwd.archive.readdir(location, {stat: true})

  // render
  listing.toHTML = () => listing
    .filter(entry => {
      if (opts.all || opts.a) return true
      return entry.name.startsWith('.') === false
    })
    .sort((a, b) => {
      // dirs on top
      if (a.stat.isDirectory() && !b.stat.isDirectory()) return -1
      if (!a.stat.isDirectory() && b.stat.isDirectory()) return 1
      return a.name.localeCompare(b.name)
    })
    .map(entry => {
      // coloring
      var color = 'default'
      if (entry.name.startsWith('.')) {
        color = 'muted'
      }

      // render
      if (entry.stat.isDirectory()) {
        return env.html`<div class="text-${color}"><strong>${entry.name}</strong></div>`
      }
      return env.html`<div class="text-${color}">${entry.name}</div>`
    })

  return listing
}

export function cd (location) {
  env.term.setCWD(location || '')
}

export function pwd () {
  return env.term.getCWD().url
}

export function echo (...args) {
  return args.join(' ')
}