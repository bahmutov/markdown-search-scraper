// scrape records examples
// https://github.com/bahmutov/scrape-youtube-videos/blob/main/upload-to-algolia.js
//

const {
  replaceMarkdownUrls,
  removeCodeBlocks,
  removeSingleTicks,
  removeBold,
} = require('./md-utils')

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

/**
 * Converts Markdown text into a single Algolia record.
 * For example, the header 1 will be the level 0 title.
 * @param {string} markdown Text to parse
 * @param {string|undefined} level0 Optional level 0 title to set for all records
 * @param {string|undefined} level1 Optional level 1 title to set for all records
 * @param {string|undefined} url URL of the scraped resource
 */
function parse(markdown, level0, level1, url) {
  // handle potentially nested links
  markdown = replaceMarkdownUrls(replaceMarkdownUrls(markdown))
  markdown = removeCodeBlocks(markdown)
  markdown = removeSingleTicks(markdown)
  markdown = removeBold(markdown)

  if (url) {
    if (typeof url !== 'string') {
      throw new Error('URL should be a string')
    }
    if (!url.startsWith('http')) {
      throw new Error(`URL "${url}" does not start with http`)
    }
  }

  if (level1 && !level0) {
    throw new Error('Cannot provide level1 without level0')
  }

  if (level0) {
    level0 = removeBold(removeSingleTicks(level0))
  }
  if (level1) {
    level1 = removeBold(removeSingleTicks(level1))
  }

  let hierarchy = makeHierarchy(level0, level1)

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
          url,
        })
      }
      currentText = ''
    }
  }

  const lines = markdown.split('\n')
  lines.forEach((line) => {
    if (line.startsWith('> ')) {
      line = line.slice(2)
    }

    if (isHeader1(line)) {
      saveCurrentText()

      const h1 = getHeader(line)
      hierarchy = makeHierarchy(h1)
      records.push({
        type: 'content',
        content: h1,
        hierarchy: clone(hierarchy),
        url,
      })
      return
    }

    if (isHeader2(line)) {
      saveCurrentText()
      const h2 = getHeader(line)
      hierarchy.lvl1 = h2
      records.push({
        type: 'content',
        content: h2,
        hierarchy: clone(hierarchy),
        url,
      })
      return
    }

    if (isHeader3(line)) {
      saveCurrentText()
      const h3 = getHeader(line)
      hierarchy.lvl1 = h3
      records.push({
        type: 'content',
        content: h3,
        hierarchy: clone(hierarchy),
        url,
      })
      return
    }

    currentText += line + '\n'
  })

  saveCurrentText()

  return records
}

module.exports = { parse }
