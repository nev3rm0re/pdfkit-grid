var PDFDocument = require("pdfkit");
require("../")(PDFDocument);

var blobStream = require("blob-stream");
var ace = require("brace");

require("brace/mode/javascript");
require("brace/theme/monokai");

const makePDF = require("./pdf.js");

const { default: content } = require("./data.js");

const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.setValue(
  makePDF.toString().split("\n").slice(1, -1).join("\n")
);
editor.getSession().getSelection().clearSelection();

const iframe = document.querySelector("iframe");

function generatePDF(fn) {
  var stream = new blobStream();
  stream.on("finish", function () {
    iframe.src = stream.toBlobURL("application/pdf");
  });

  fn(PDFDocument, stream, content, iframe);
}
generatePDF(makePDF);

editor.getSession().on("change", function () {
  try {
    const fn = new Function(
      "PDFDocument", "stream", "content", "iframe",
      editor.getValue());
    generatePDF(fn);
  } catch (e) {
    console.log(e);
  }
});
