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

### boldText\(\)

Prints text in "Bold" font at `x` and `y` position on the page. `options` array is passed to   
`pdfkit`'s `text()` method. Additionally `fontSize` parameter is available to set size of "bold"  
text.

You need to register "Bold" and "Normal" font beforehand:

```js
const doc = new PDFDocument({/* ... */});
doc.registerFont('Bold', 'Helvetica-Bold').registerFont('Normal', 'Helvetica');

doc.text('Hello, ', { continued: true }).boldText('world', null, null, { fontSize: 12 });
```

## Layout methods

### grid\(\)

Draws a list of passed in cells in a grid. See [API description](/api.md#module_pdfkitgrid.grid)

You can find more detailed description of methods and their arguments in the [API section](/api.md)
of documentation.

