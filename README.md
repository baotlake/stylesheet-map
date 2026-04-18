# StyleSheetMap

A Map-like wrapper around `CSSStyleSheet` for managing CSS rules by key. Add, update, and delete rules with key-value semantics — works with constructable stylesheets and `adoptedStyleSheets`.

## Installation

```shell
# npm
npm i stylesheet-map

# yarn
yarn add stylesheet-map

# pnpm
pnpm add stylesheet-map
```

## Usage

```javascript
import StyleSheetMap from "stylesheet-map";

// Create a new StyleSheetMap instance
const styleMap = new StyleSheetMap({
  rules: [
    ["header", "header { color: blue; }"],
    ["paragraph", "p { font-size: 16px; }"],
  ],
  onCreated: (sheet) => {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  },
});

// Dynamically adding new CSS rules
styleMap.set("button", "button { background-color: green; }");

// Update existing CSS rules
styleMap.set("header", "header { color: red; }");

// Deleting a CSS rule
styleMap.delete("paragraph");

// Disable the entire stylesheet
styleMap.disable = true;
```

## Project Origin

The concept and code for StyleSheetMap were initially developed as part of the [Anything Copilot project](https://github.com/baotlake/anything-copilot). This project extracts and refines that functionality into a standalone, general-purpose module.

Discover more about its origins: [Anything Copilot](https://ziziyi.com/anything-copilot)

## License

This project is licensed under the MIT License.
