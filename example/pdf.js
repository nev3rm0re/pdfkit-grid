function makePDF(PDFDocument, stream, content, iframe) {
  var doc = new PDFDocument({
    margins: {
      top: 12,
      left: 12, bottom: 24, right: 24
    },
    size: 'A4',
    layout: 'portrait'
  });

  var fancyCell = function(doc, left, cell) {
    const labelOptions = {}, valueOptions = {};

    if (cell.width) {
      labelOptions.width = cell.width;
      labelOptions.lineGap = cell.labelLineGap || 2;
    }

    const labelAlign = cell.labelAlign || 'left';
    labelOptions.align = labelAlign;

    doc.text(cell.text, cell.left + cell.padding, 
      cell.top + cell.padding / 2, labelOptions);

    const labelY = doc.y;

    if (cell.align) {
      valueOptions.align = cell.align;
    }
    if (cell.width) {
      valueOptions.width = cell.width - cell.padding * 2;
    }
        
    doc.boldText(cell.value || ' ', cell.left + cell.padding, doc.y, valueOptions);
    doc.y -= 2;

    if (cell.border) {
      doc.border(cell.left, cell.top, cell.width, labelY - cell.top, {
        border: 'W'
      }); // cell.border);
      cell.border = false;
    }

    return cell;
  };

  doc.fontSize(9).fillColor('#666666').strokeColor('#999999');

  const CENTER = 290;

  const LEFT = doc.LEFT = doc.x;
  const WIDTH = doc.WIDTH = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  doc.registerFont('Bold', 'Helvetica-Bold');
  doc.registerFont('Normal', 'Helvetica');
  doc.registerFont('Italic', 'Helvetica-BoldOblique');

  doc.pipe(stream);

  var headerStart = doc.y;

  doc.boldText('Delivery Bill'.toUpperCase(), CENTER, null, { fontSize: 12 });
  doc.boldText('Surface mails', { fontSize: 12 });

  doc.y = headerStart;
  doc.x = 390;

  doc.boldText('CN 37 ', 490, doc.y, { fontSize: 14, continued: true });
  doc.font('Italic', 14).text('Bis', 490, doc.y);

  doc.y = headerStart;
    
  doc.font('Normal', 9);
  doc.grid([
    {
      text: 'Postal designated operator of origin',
      value: content.origin.operator,
      left: doc.LEFT
    },
  ],
  {callback: fancyCell});

  const COL_7 = 450; // RIGHT_COLUMN + (RIGHT_COLUMN - CENTER);

  doc.x = doc.LEFT;

  const RIGHT_COLUMN = 370;
  const COL_6 = RIGHT_COLUMN;

  doc.grid([
    { text: 'Office of origin of the bill', 
      value: content.origin.office
    },
    { text: 'Date', value: content.dateOfDeparture, left: CENTER },
    { text: 'Consignment ID', value: content.consignmentID, left: COL_6}
  ],
  {
    callback: fancyCell
  });

  doc.grid([
    { 
      left: doc.LEFT,
      text: 'Office of destination of the bill', 
      value: content.destination.office
    },
    {
      left: COL_6,
      callback: function(doc, left) {
        doc.x = left;
        doc.checkbox('By train');
        doc.x = left;
        doc.checkbox('By ship');
        doc.x = left;
        doc.checkbox('Truck');
      }
    }
  ],
  {callback: fancyCell});

  doc.grid([
    {
      callback: function(doc, left) {
        doc.x = left;
        doc.checkbox('Priority', {continued: true});
        doc.x = left + 110;
        doc.checkbox('Non-priority', {continued: true});
      }
    },
    { text: 'Date of departure', value: content.dateOfDeparture, left: CENTER,
      align: 'center', border: true },
    { text: 'Time', value: content.timeOfDeparture, left: COL_7, align: 'center', border: true }
  ], { border: 'WNE' , callback: fancyCell });

  doc.grid([
    { text: 'Train No', value: 'MEETS.WBG', border: true},
    { text: 'Route', left: CENTER, border: false }
  ], { border: 'WSE' , callback: fancyCell });


  doc.grid([
    { text: 'Name of ship', border: true},
    { text: 'Port of disembarkation', left: CENTER, border: true},
    { text: 'Company', left: COL_7, border: true}
  ], { border: 'SWE' , callback: fancyCell});

  doc.grid([
    { text: 'If a container is used', border: true},
    { text: 'No of container', left: CENTER, border: true},
    { text: 'Seal No', left: COL_7, border: true}
  ], { border: 'SEW' , callback: fancyCell});

  doc.moveDown();

  doc.boldText('Entry', { continued: true });
  doc.boldText('Page 1 / 2', { align: 'right' });

  const tableStart = doc.y;

  var w = function(doc, text, font = null) {
    if (font) {
      doc.font(font);
    }
    const width = doc.widthOfString(text);

    if (font) {
      doc.font('Normal');
    }

    return width;
  };

  const widthNumberOf = 160;

  const ws = {
    origin: 39,
    destination: 38,
    mail: 22,
    year: 16,
    serialnumber: 21,
    totalindesp: 17,
    recpserialnumber: 19,
    numberOf: 105,
    weight: 115
  };

  const cells = [
    { text: 'Office of origin', width: ws.origin}, 
    { text: 'Office of dest', width: ws.destination},
    { text: 'Mail cat/Sub-class', width: ws.mail },
    { text: 'Year', width: ws.year},
    { text: 'Desp serial No', width: ws.serialnumber},
    { text: 'Tot in disp', width: ws.totalindesp },
    { text: 'Recp serial No', width: ws.recpserialnumber },
    { 
      text: 'Number of', 
      width: ws.numberOf,
      callback: function(doc, left, cell) {
        doc.text(cell.text, cell.left, cell.top + cell.padding, { width: cell.width, align: 'center' });
        doc.moveDown(2);
        doc.strokeColor('#cc6600').grid([
          {
            text: 'letter-post bags', span: 1,
          },
          {
            text: 'CP bags and loose parcels', span: 1,
          },
          {
            text: 'sacks of empty bags', span: 1
          }
        ], {grid: 3, startX: cell.left, cellBorder: 'WE', width: cell.width , callback: tableCell});
      }
    },
    { text: 'Gross weight of bags, etc', width: ws.weight },
    { text: 'Observations' }
  ];

  const cells_copy = cells.slice();
  const filled_cells = cells_copy.reduce(function(carry, item) {
    const newItem = extend({}, item);
    var prevItem;
    if (carry.length) {
      prevItem = carry[carry.length - 1];
    }

    const padding = item.padding || doc.currentLineHeight(true) / 2;

    newItem.left = prevItem ? prevItem.left + prevItem.width + padding : doc.LEFT;
    // newItem.width += padding; 
    newItem.align = 'center';
    newItem.padding = 0;
    carry.push(newItem);
    return carry;
  }, []);
    // .map(function(item) {
    //     const padding = doc.currentLineHeight(true) / 2;
    //     doc.text(item.text, item.left + padding, rowY + padding / 2, {
    //         width: item.width
    //     });
    //     doc.border(item.left, rowY, item.width + padding, doc.y - rowY, {border: true})
    // });

  var tableCell = function(doc, left, cell) {
    const labelOptions = {};
    if (cell.width) {
      labelOptions.width = cell.width;
      labelOptions.lineGap = cell.labelLineGap || 2;
    }

    labelOptions.align = 'center';

    doc.text(cell.text, cell.left, doc.y, labelOptions);
  };

  doc.grid(filled_cells, {
    padding: 5,
    border: true,
    cellBorder: 'WE',
    labelLineGap: 0,
    callback: tableCell
  });

  doc.x = doc.LEFT;

  /*
        ([A-Z]{6}) # origin
        ([A-Z]{6}) # destination
        ([A-Z]) # mailcategory 
        ([A-Z0-9]{2}) # mailsubclass
        ([0-9]) # despatchyear
        ([0-9]{4}) # despatchnumber
        ([0-9]{3}) # serialnumber 
        ([0-9]) # ishighest
        ([0-9]) # isregistered
        ([0-9]{4}) # weight
    */

  const ips = {
    'origin': 'DEHHNY',
    'destination': 'DWEBGA',
    'mailcategory': 'C',
    'mailsubclass': 'UR',
    'despatchyear': '7',
    'despatchnumber': '433 ',
    'serialnumber': '999',
    'ishighest': '1',
    'isregistered': '0',
    'weight': '4221'
  };

  const contents = [
    { text: ips.origin, width: ws.origin },
    { text: ips.destination, width : ws.destination},
    { text: ips.mailcategory + ips.mailsubclass, width: ws.mail},
    { text: ips.despatchyear, width: ws.year},
    { text: ips.despatchnumber, width: ws.serialnumber },
    { text: ips.serialnumber, width: ws.totalindesp },
    { text: ips.ishighest, width: ws.recpserialnumber},
    { text: ips.isregistered, width: ws.numberOf },
    { text: ips.weight, width: ws.weight },
    { text: ''} // where should this come from?
  ];

  doc.font('Bold').grid(contents.reduce(function(carry, item) {
    const newItem = extend({}, item);
    var prevItem;
    if (carry.length) {
      prevItem = carry[carry.length - 1];
    }

    const padding = item.padding || doc.currentLineHeight(true) / 2;

    newItem.left = prevItem ? prevItem.left + prevItem.width + padding : doc.LEFT;
    // newItem.width += padding; 
    newItem.align = 'center';
    newItem.padding = 0;
    carry.push(newItem);
    return carry;
  }, []), {padding: 5, border: true, cellBorder: 'WE', callback: tableCell });

  doc.end();
}

module.exports = makePDF;