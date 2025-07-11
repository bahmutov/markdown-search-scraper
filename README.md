# markdown-search-scraper [![ci](https://github.com/bahmutov/markdown-search-scraper/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/bahmutov/markdown-search-scraper/actions/workflows/ci.yml)

> Converts Markdown text to Algolia records

- removes Markdown markup from URLs
- removes single quotes around text
- removes `**` around text
- add a common URL to each record

## Install

```
# install using npm
$ npm i -D markdown-search-scraper
# install using yarn
$ yarn add -D markdown-search-scraper
```

## Bin

You can parse a given Markdown file and print its Algolia search record as JSON

```
$ npx markdown-scrape <markdown filename>
```

You can also scrape a given Markdown file for AI purposes

```
$ npx markdown-scrape-for-ai <markdown filename>
```

## Api

```js
const { parse } = require('markdown-search-scraper')
const json = parse(markdownText)
```

For example, if the markdown is

```md
# urls

take a look at this [brown fox](at some url) that has [red fur](another url)
```

Output is something like this:

```json
[
  {
    "type": "lvl0",
    "content": "urls",
    "hierarchy": {
      "lvl0": "urls",
      "lvl1": null,
      "lvl2": null
    }
  },
  {
    "type": "content",
    "content": "take a look at this brown fox that has red fur",
    "hierarchy": {
      "lvl0": "urls",
      "lvl1": null,
      "lvl2": null
    }
  }
]
```

### Optional level 0 title

You can pass an external top-level title

```js
const json = parse(markdownText, 'A Custom Recipe')
/*
  {
    "type": "lvl0",
    "content": "A Custom Recipe",
    "hierarchy": {
      "lvl0": "A Custom Recipe",
      "lvl1": null,
      "lvl2": null
    }
  }
*/
```

If you pass level 0 title, you can also pass a level 1 title to add as a record.

```js
const json = parse(markdownText, 'A Custom Recipe', 'Subtitle')
/*
  {
    "type": "lvl0",
    "content": "A Custom Recipe",
    "hierarchy": {
      "lvl0": "A Custom Recipe",
      "lvl1": null,
      "lvl2": null
    }
  },
  {
    content: 'Subtitle',
    hierarchy: {
      lvl0: 'A Custom Recipe',
      lvl1: 'Subtitle',
      lvl2: null,
    },
    type: 'lvl1',
  },
*/
```

### URL

You should pass an URL so that a record leads to the scraped resource

```js
const json = parse(markdownText, null, null, 'https://acme.com/doc/info')
```

## Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2022

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)
- [videos](https://www.youtube.com/glebbahmutov)
- [presentations](https://slides.com/bahmutov)
- [cypress.tips](https://cypress.tips)
- [Cypress Tips & Tricks Newsletter](https://cypresstips.substack.com/)
- [my Cypress courses](https://cypress.tips/courses)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/markdown-search-scraper/issues) on Github

## MIT License

Copyright (c) 2022 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
