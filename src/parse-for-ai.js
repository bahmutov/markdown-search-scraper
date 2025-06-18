// @ts-check

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
 * Looks at the markdown text with code blocks
 * and extracts the text content, removing code blocks,
 * but keeping the JavaScript comments without the // prefix.
 * @param {string} markdown Text to parse
 * @returns {string} Text content without code blocks but with comments
 */
function extractText(markdown) {
  return (
    markdown
      .replace(/```[\s\S]*?```/g, function (match) {
        // Extract comments from the code block and remove the // prefix
        const commentLines = match
          .split('\n')
          .filter((line) => line.trim().startsWith('//'))
          .map((line) => line.trim().substring(2).trim())
          .join('\n')
        return commentLines ? commentLines + '\n' : ''
      })
      // remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/`([^`]+)`/g, '$1') // remove inline code
      .replace(/\n\s*\n/g, '\n') // remove empty lines
      .trim()
  )
}

function cleanupForAI(record) {
  return {
    ...record,
    text: extractText(record.content),
  }
}

function mergeLevels(record) {
  const { lvl0, lvl1, lvl2 } = record.hierarchy

  let textStart = ''
  if (lvl0) {
    textStart += `${lvl0}\n`
  }
  if (lvl1) {
    textStart += `${lvl1}\n`
  }
  if (lvl2) {
    textStart += `${lvl2}\n`
  }

  if (textStart) {
    record.text = textStart + record.text
  }
  return record
}

/**
 * Converts Markdown text into a list of records suitable
 * for ingesting into AI prompts. Geared towards Markdown plus code examples.
 *
 * Out puts objects with cleaned up text content useful for RAG, plus
 * the original markdown content, and an optional URL.
 * @param {string} markdown Text to parse
 * @param {string|undefined} level0 Optional level 0 title to set for all records
 * @param {string|undefined} level1 Optional level 1 title to set for all records
 * @param {string|undefined} url URL of the scraped resource
 */
function parseForAi(markdown, level0, level1, url) {
  // handle potentially nested links
  markdown = replaceMarkdownUrls(replaceMarkdownUrls(markdown))
  // markdown = removeCodeBlocks(markdown)
  // markdown = removeSingleTicks(markdown)
  markdown = removeBold(markdown)

  // console.log(markdown)

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

  const records = []
  let currentText = ''
  let hierarchy

  if (level0) {
    level0 = removeBold(removeSingleTicks(level0))
    hierarchy = makeHierarchy(level0)
    records.push({
      type: 'lvl0',
      content: null,
      hierarchy: clone(hierarchy),
      url,
    })
  }
  if (level1) {
    level1 = removeBold(removeSingleTicks(level1))
    hierarchy = makeHierarchy(level0, level1)
    records.push({
      type: 'lvl1',
      content: null,
      hierarchy: clone(hierarchy),
      url,
    })
  }

  hierarchy = makeHierarchy(level0, level1)

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
        type: 'lvl0',
        content: null,
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
        type: 'lvl1',
        content: null,
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
        type: 'lvl2',
        content: null,
        hierarchy: clone(hierarchy),
        url,
      })
      return
    }

    currentText += line + '\n'
  })

  saveCurrentText()

  return records
    .filter((record) => record.type === 'content')
    .map(cleanupForAI)
    .map(mergeLevels)
    .map((record) => {
      // remove unused properties
      return {
        text: record.text,
        content: record.content,
        url: record.url || null,
      }
    })
}

module.exports = { parseForAi, cleanupForAI, extractText }
