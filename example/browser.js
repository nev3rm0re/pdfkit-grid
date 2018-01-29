var PDFDocument = require('pdfkit');
require('../')(PDFDocument);

var blobStream = require('blob-stream');
var ace = require('brace');

require('brace/mode/javascript');
require('brace/theme/monokai');

const examples = require('./examples.js');

const currentExample = 'example1';
const makePDF = examples[currentExample];
const content = examples.content[currentExample];

const editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.getSession().setMode('ace/mode/javascript');
editor.setValue(
  makePDF.toString().split('\n').slice(1, -1).join('\n')
);
editor.getSession().getSelection().clearSelection();

const generatePDF = (fn, iframe) => {
  var stream = new blobStream();
  stream.on('finish', function () {
    iframe.src = stream.toBlobURL('application/pdf');
  });
  
  fn(PDFDocument, stream, content, iframe);
};

const iframe = document.querySelector('iframe');
generatePDF(makePDF, iframe);

editor.getSession().on('change', function () {
  try {
    const fn = new Function(
      'PDFDocument', 'stream', 'content', 
      editor.getValue());
    generatePDF(fn, iframe);
  } catch (e) {
    console.log(e);
  }
});
