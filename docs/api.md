<a id="module_pdfkitgrid"></a>

## pdfkitgrid

* [pdfkitgrid](#module_pdfkitgrid)
    * [.boldText(text, x, y, options)](#module_pdfkitgrid.boldText)
    * [.move(x, y)](#module_pdfkitgrid.move) ⇒
    * [.border(startX, startY, width, height, options)](#module_pdfkitgrid.border) ⇒
    * [.checkbox(text, options)](#module_pdfkitgrid.checkbox)
    * [.row(cells)](#module_pdfkitgrid.row)
    * [.grid(cells, globalOptions)](#module_pdfkitgrid.grid)

<a id="module_pdfkitgrid.boldText"></a>

### pdfkitgrid.boldText(text, x, y, options)
Sets font to "Bold" (has to be 'pre-registered')

Options:

- fontSize {integer} Font size to use
- ... other `text()` options

**Kind**: static method of [<code>pdfkitgrid</code>](#module_pdfkitgrid)  

| Param | Type | Default |
| --- | --- | --- |
| text | <code>string</code> |  | 
| x | <code>int</code> |  | 
| y | <code>int</code> |  | 
| options | <code>object</code> | <code>{}</code> | 

<a id="module_pdfkitgrid.move"></a>

### pdfkitgrid.move(x, y) ⇒
Moves internal cursor to (X;Y) position in the page

**Kind**: static method of [<code>pdfkitgrid</code>](#module_pdfkitgrid)  
**Returns**: PDFDocument  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 

<a id="module_pdfkitgrid.border"></a>

### pdfkitgrid.border(startX, startY, width, height, options) ⇒
Creates border around specified area

You can specify which borders should be drawn, using `options.border` property.
`border` can be either `boolean`, or a string indicating "directions" to draw:

N - north or top
S - south or bottom
E - east or right
W - west or left

`border` of `"NSEW"` is identical to `true` - all borders will be drawn

**Kind**: static method of [<code>pdfkitgrid</code>](#module_pdfkitgrid)  
**Returns**: PDFDocument  

| Param | Type | Default |
| --- | --- | --- |
| startX | <code>number</code> |  | 
| startY | <code>number</code> |  | 
| width | <code>number</code> |  | 
| height | <code>number</code> |  | 
| options | <code>Object</code> | <code>{}</code> | 

<a id="module_pdfkitgrid.checkbox"></a>

### pdfkitgrid.checkbox(text, options)
Draws a checkbox with optional label

**Kind**: static method of [<code>pdfkitgrid</code>](#module_pdfkitgrid)  

| Param | Type | Default |
| --- | --- | --- |
| text | <code>string</code> | <code>null</code> | 
| options | <code>Object</code> | <code>{}</code> | 

<a id="module_pdfkitgrid.row"></a>

### pdfkitgrid.row(cells)
Draws a row of passed in cells

**Kind**: static method of [<code>pdfkitgrid</code>](#module_pdfkitgrid)  

| Param | Type |
| --- | --- |
| cells | <code>Array.&lt;Object&gt;</code> | 

<a id="module_pdfkitgrid.grid"></a>

### pdfkitgrid.grid(cells, globalOptions)
Draws a list of cells in a grid

**Kind**: static method of [<code>pdfkitgrid</code>](#module_pdfkitgrid)  

| Param | Type | Default |
| --- | --- | --- |
| cells | <code>Array.&lt;Object&gt;</code> |  | 
| globalOptions | <code>Object</code> | <code>{}</code> | 

