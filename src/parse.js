// scrape records examples
// https://github.com/bahmutov/scrape-youtube-videos/blob/main/upload-to-algolia.js
//
function isHeader1(line) {
  return line.match(/^#\s/)
}

function isHeader2(line) {
  return line.match(/^##\s/)
}

function isHeader3(line) {
  return line.match(/^###\s/)
}

function getHeader(line) {
  return line.replace(/^#+\s/, '').trim()
}

function makeHierarchy(lvl0 = null, lvl1 = null, lvl2 = null) {
  return {
    lvl0,
    lvl1,
    lvl2,
  }
}

function clone(x) {
  return JSON.parse(JSON.stringify(x))
}

function parse(markdown) {
  let hierarchy = makeHierarchy()

  const records = []
  let currentText = ''

  function saveCurrentText() {
    if (currentText) {
      // do not add whitespace records
      const trimmed = currentText.trim()
      if (trimmed) {
        records.push({
          type: 'content',
          content: trimmed,
          hierarchy: clone(hierarchy),
        })
      }
      currentText = ''
    }
  }

  const lines = markdown.split('\n')
  lines.forEach((line) => {
    if (isHeader1(line)) {
      saveCurrentText()

      const h1 = getHeader(line)
      hierarchy = makeHierarchy(h1)
      records.push({
        type: 'lvl0',
        content: h1,
        hierarchy: clone(hierarchy),
      })
      return
    }

    if (isHeader2(line)) {
      saveCurrentText()
      const h2 = getHeader(line)
      hierarchy.lvl1 = h2
      records.push({
        type: 'lvl1',
        content: h2,
        hierarchy: clone(hierarchy),
      })
      return
    }

    if (isHeader3(line)) {
      saveCurrentText()
      const h3 = getHeader(line)
      hierarchy.lvl1 = h3
      records.push({
        type: 'lvl2',
        content: h3,
        hierarchy: clone(hierarchy),
      })
      return
    }

    currentText += line + '\n'
  })

  saveCurrentText()

  return records
}

module.exports = { parse }
