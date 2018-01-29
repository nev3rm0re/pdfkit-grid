/*eslint indent: ['error', 2] */
const pdfkitgrid = require("./src/pdfkitgrid");

module.exports = function(PDFDocument) {
  Object.assign(PDFDocument.prototype, pdfkitgrid);
  return PDFDocument;
};
