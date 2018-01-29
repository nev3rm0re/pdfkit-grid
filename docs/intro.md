# Introduction

This project is an attempt to make it easier to layout elements in   
PDFKit. I am mostly used to Bootstrap CSS and similar grid system, so I  
developed my own helper functions to use similar concepts while creating PDFs.

Thinking I might reuse same functions next time I will have to work with   
PDFKit.js, I decided to make it into a module - a "mixin" for `pdfkit`'s   
`PDFDocument`. It works by extending `PDFDocument`, augmenting it with   
additional methods, in the same way `PDFDocument`'s own `text`, `color` and  
other mixins do.

# Usage

```javascript
const PDFDocument = require('PDFDocument');
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

## Styling methods

### boldText()

## Layout methods

### grid()

You can find more detailed description of methods in the [API section](/api.md) of documentation.

