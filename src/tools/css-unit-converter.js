'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['css-unit-converter'] = function (inputs) {
  var value = parseFloat(inputs.value) || 0;
  var fromUnit = inputs.fromUnit || 'px';
  var baseSize = parseFloat(inputs.baseSize) || 16;

  var px;
  switch (fromUnit) {
    case 'px': px = value; break;
    case 'rem': px = value * baseSize; break;
    case 'em': px = value * baseSize; break;
    case 'pt': px = value * (96 / 72); break;
    default: px = value;
  }

  return {
    px: Math.round(px * 1000) / 1000 + 'px',
    rem: Math.round((px / baseSize) * 1000) / 1000 + 'rem',
    em: Math.round((px / baseSize) * 1000) / 1000 + 'em',
    pt: Math.round((px * 72 / 96) * 1000) / 1000 + 'pt'
  };
};
