function replaceMarkdownUrls(md) {
  const r = /!?\[(?<title>[^\]]+)\]\([^\)]+\)/g
  const replaced = md.replace(r, (match, x) => {
    return x
  })
  return replaced
}

function removeCodeBlocks(md) {
  const r = /```[^`]+```/g
  const replaced = md.replace(r, (match, x) => {
    return ''
  })
  return replaced
}

module.exports = { replaceMarkdownUrls, removeCodeBlocks }
