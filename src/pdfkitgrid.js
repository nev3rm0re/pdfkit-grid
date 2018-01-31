/*@flow*/
/** @module pdfkitgrid */
module.exports = {
  /**
   * Sets font to "Bold" (has to be 'pre-registered')
   * 
   * Options:
   * 
   * - fontSize {integer} Font size to use
   * - ... other `text()` options
   * 
   * @param  {string} text
   * @param  {int} x
   * @param  {int} y
   * @param  {object} options={}
   */
  boldText: function(
    text /*: string */, 
    x /*: ?number */, 
    y /*: ?number */, 
    options /*: Object */ = {}
  ) {
    if (x !== null && typeof x == 'object') {
      options = x;
      x = this.x;
      y = this.y;
    } else if (y !== null && typeof y == 'object') {
      options = y;
      y = null;
    }
    options = options || {};

    const fontSize = options.fontSize || 11;
    return this.font('Bold', fontSize)
      .text(text, x, y, options)
      .font('Normal', 9);
  },

  /**
   * Moves internal cursor to (X;Y) position in the page
   * @param {number} x
   * @param {number} y
   * 
   * @return PDFDocument
   */
  move: function(x /*: number */, y /*: number */) {
    this.x = x;
    this.y = y;
    return this;
  },

  /**
   * Creates border around specified area
   * 
   * You can specify which borders should be drawn, using `options.border` property.
   * `border` can be either `boolean`, or a string indicating "directions" to draw:
   * 
   * N - north or top,
   * S - south or bottom,
   * E - east or right,
   * W - west or left
   * 
   * `border` of `"NSEW"` is identical to `true` - all borders will be drawn
   * 
   *
   * @param  {number} startX
   * @param  {number} startY
   * @param  {number} width
   * @param  {number} height
   * @param  {Object} options={}
   * 
   * @return PDFDocument
   */
  border: function(
    startX /*: number */,
    startY /*: number */, 
    width /*: number */, 
    height /*: number */, 
    options /*: Object */ = {}) {
    const doc = this;
    let border;

    if (options.border === true) {
      border = 'WNES';
    } else {
      border = options.border || '';
    }

    if (border.indexOf('W') >= 0) {
      doc.moveTo(startX, startY);
      doc.lineTo(startX, startY + height);
    }

    if (border.indexOf('N') >= 0) {
      doc.moveTo(startX, startY);
      doc.lineTo(startX + width, startY);
    }

    if (border.indexOf('E') >= 0) {
      doc.moveTo(startX + width, startY);
      doc.lineTo(startX + width, startY + height);
    }

    if (border.indexOf('S') >= 0) {
      doc.moveTo(startX, startY + height);
      doc.lineTo(startX + width, startY + height);
    }
    doc.stroke();

    return this;
  },

  /**
   * Draws a checkbox with optional label
   * 
   * @param  {string} text=null
   * @param  {Object} options={}
   */
  checkbox: function(text /*: ?string */ = null, options /*: Object */ = {}) {
    const doc = this;

    var lineHeight = this.currentLineHeight(false);
    const startY = doc.y;
    this.lineGap(1);
    this.rect(doc.x + 1, doc.y - 1, lineHeight + 2, lineHeight + 2).stroke();

    if (text) {
      var textX = doc.x + 1.5 * lineHeight + 2;
      // doc.x = textX;
      options.width = this.widthOfString(text) + lineHeight;

      this.text(text, textX, startY);
      doc.x += options.width;

      if (options.continued) {
        // doc.y -= doc.currentLineHeight(true) + this._lineGap;
      }
    } else {
      doc.x += lineHeight * 1.5;
    }

    if (options.continued) {
      doc.y = startY;
    }
    return doc;
  },

  /**
   * Draws a row of passed in cells
   * 
   * @param  {Object[]} cells
   */
  row: function(cells /*: Object[] */) {
    const doc = this;
    const tableStart = doc.y;

    const columns = cells.length;
    const defaultWidth = doc.WIDTH / columns;
    const padding = doc.currentLineHeight(true) / 4;

    var data = cells.reduce(
      function(carry, item) {
        var cellWidth = (item.width || defaultWidth) + padding * 2;
        doc.y = tableStart + padding;
        carry.x = doc.x + cellWidth;
        var options = {
          width: cellWidth,
          align: 'center'
        };
        doc.text(item.text, options);
        doc.x = carry.x;
        carry.maxY = Math.max(carry.maxY, doc.y);
        return carry;
      },
      { x: doc.x, maxY: 0 }
    );

    // doc.moveTo(doc.LEFT, data.maxY).lineTo(doc.LEFT + doc.WIDTH, data.maxY).stroke();
    data.x = doc.LEFT;
    cells.reduce(function(carry, item) {
      const start = carry.x;
      const width = (item.width || defaultWidth) + padding * 2;
      doc.border(start, tableStart, width, carry.maxY - tableStart, {
        border: 'WE'
      });
      carry.x += width;
      return carry;
    }, data);

    doc.y = data.maxY;

    return this;
  },

  /**
   * Draws a list of cells in a grid
   * 
   * @param  {Object[]} cells
   * @param  {Object} globalOptions={}
   */
  grid: function(cells /*: Array<Object> */, globalOptions /*: Object */ = {}) /*: PDFDocument */ {
    const doc = this;

    const startY = doc.y;

    const padding = globalOptions.padding || doc.currentLineHeight(true) / 2;
    const LEFT = globalOptions.startX || doc.LEFT;
    const WIDTH = globalOptions.width || doc.WIDTH;

    /*
     * This goes through all of the passed-in cells attempting to calculate
     * each cell's width.
     */
    cells = cells.reduce(function(carry, item) {
      var previousItem;
      if (carry.length) {
        previousItem = carry[carry.length - 1];
      }

      if (!item.left) {
        item.left = previousItem
          ? previousItem.left + previousItem.width
          : LEFT; // first item starts at leftmost position
      }

      if (!item.width) {
        var calculatedWidth;
        if (globalOptions.grid) {
          var span = item.span || 1;
          calculatedWidth = WIDTH / globalOptions.grid * span;
        } else {
          calculatedWidth = LEFT + WIDTH - item.left; // take all remaining width
        }
        item.width = calculatedWidth;
      }

      if (carry.length) {
        const previousItem = carry[carry.length - 1];

        if (globalOptions.grid) {
          var span = previousItem.span || 1;
          // var previousItemWidth = (WIDTH / globalOptions.grid * span);
          item.left = previousItem.left + previousItem.width;
        } else {
          // item.left = previousItem.left + previousItem.width;
          previousItem.width = item.left - previousItem.left;
        }
      }

      carry.push(item);
      return carry;
    }, []);

    var maxY = cells.reduce(function(carry, cell) {
      const cellPadding = cell.padding || padding;

      const callback = cell.callback || globalOptions.callback || null;

      if (callback) {
        const top = doc.y;
        doc.y += padding;
        const calculatedCell = Object.assign(cell, {
          padding: cellPadding,
          top: top,
          border: cell.border || globalOptions.cellBorder || false
        });

        callback(doc, cell.left + cellPadding, calculatedCell);
      }

      maxY = Math.max(maxY, doc.y);
      doc.y = startY;

      carry = Math.max(carry, maxY);
      return carry;
    }, 0);

    cells.forEach(function(cell) {
      if (cell.border) {
        doc.border(cell.left, cell.top, cell.width, maxY - cell.top, {
          border: cell.border
        });
      }
    });

    if (globalOptions.border) {
      doc.border(LEFT, startY, WIDTH, maxY - startY, {
        border: globalOptions.border
      });
    }

    doc.move(doc.LEFT, maxY);
  }
};
