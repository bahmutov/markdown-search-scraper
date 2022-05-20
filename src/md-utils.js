function replaceMarkdownUrls(md) {
  const r = /!?\[(?<title>[^\]]+)\]\([^\)]+\)/g
  const replaced = md.replace(r, (match, x) => {
    return x
  })
  return replaced
}

module.exports = { replaceMarkdownUrls }
