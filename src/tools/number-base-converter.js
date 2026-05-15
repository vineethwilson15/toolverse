'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['number-base-converter'] = function (inputs) {
  var value = inputs.value || '';
  var fromBase = parseInt(inputs.fromBase) || 10;

  if (!value.trim()) return { binary: '', octal: '', decimal: '', hex: '' };

  try {
    var decimal = parseInt(value, fromBase);
    if (isNaN(decimal)) return { binary: 'Invalid input', octal: '', decimal: '', hex: '' };

    return {
      binary: decimal.toString(2),
      octal: decimal.toString(8),
      decimal: decimal.toString(10),
      hex: decimal.toString(16).toUpperCase()
    };
  } catch (e) {
    return { binary: 'Error: ' + e.message, octal: '', decimal: '', hex: '' };
  }
};
