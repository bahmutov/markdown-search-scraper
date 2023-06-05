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

function removeSingleTicks(md) {
  const r = /`[^`]+`/g
  const replaced = md.replace(r, (match, x) => {
    return match.slice(1, match.length - 1)
  })
  return replaced
}

function removeBold(md) {
  const r = /\*\*[^*]+\*\*/g
  const replaced = md.replace(r, (match, x) => {
    return match.slice(2, match.length - 2)
  })
  return replaced
}

module.exports = {
  replaceMarkdownUrls,
  removeCodeBlocks,
  removeSingleTicks,
  removeBold,
}
