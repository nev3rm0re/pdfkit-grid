# Introduction

This project is an attempt to make it easier to layout elements in 
PDFKit. I am mostly used to Bootstrap CSS and similar grid system, so I
developed my own helper functions to use similar concepts while creating PDFs.

Thinking I might reuse same functions next time I will have to work with 
PDFKit.js, I decided to make it into a module - a "mixin" for `pdfkit`'s 
`PDFDocument`. It works by extending `PDFDocument`, augmenting it with 
additional methods, in the same way `PDFDocument`'s own `text`, `color` and
other mixins do.

# Installation

> At the moment pdfkit-grid is available from GitHub only.

Use `yarn add` to install package

```
$ yarn add https://github.com/nev3rm0re/pdfkit-grid.git
```

or add an entry to your `package.json`:

```
"dependencies": {
  "pdfkit": "^0.8.3", // you will need PDFKit
  "pdfkit-grid": "https://github.com/nev3rm0re/pdfkit-grid.git"
}
```

# Usage

```javascript
const PDFDocument = require('pdfkit');
require('pdfkit-grid')(PDFDocument); // attach methods to PDFDocument

// use PDFDocument as usual
const doc = new PDFDocument({
  margins: {
    top: 12,
    left: 12, bottom: 24, right: 24
  },
  size: "A4",
  layout: "portrait"
});

doc.text('Hello world!');
```

# Available methods

List of available methods you can find in the [API section](https://nev3rm0re.github.io/pdfkit-grid/api.html) of documentation.