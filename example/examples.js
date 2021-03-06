module.exports = {
  example1: (PDFDocument, stream, content) => {
    const doc = new PDFDocument({
      margins: { top: 12, left: 12, bottom: 24, right: 24 },
      size: 'A4',
      layout: 'portrait'
    });

    doc.pipe(stream);

    doc
      .registerFont('Bold', 'Helvetica-Bold')
      .registerFont('Normal', 'Helvetica');

    doc.text('Hello, ', { continued: true }).boldText('world!', null, null, { fontSize: 12 });

    doc.end();
  },

  content: {
    'example1': { }
  }
};