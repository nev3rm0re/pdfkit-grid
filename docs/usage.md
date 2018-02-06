# Usage

## Style methods

PDFKit Grid uses a concept of "style" - collection of different "formatting" properties.

You can apply style by calling `.style()` method
```
doc.style({ fontSize: 12 });
```

You can create "named" styles using `.addStyle`

```js
doc.addStyle('title', { fontSize: 13, fontFamily: 'Helvetica-Bold'});
// ...
doc.style('title'); // apply "title" style
```

Both "anonymous" and "named" styles can be used in `.text()` method by passing style's name or definition in `style` property

```js
doc.text('This text well be printed using "title" style', { style: 'title' });

doc.text('This text will be printed using "inline" style', { style: {'color': '#cc3333'} })
```