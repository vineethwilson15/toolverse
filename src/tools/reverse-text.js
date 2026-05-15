'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['reverse-text'] = function (inputs) {
  var text = inputs.text || '';
  var mode = inputs.mode || 'characters';

  if (!text) return { result: '' };

  var result;
  switch (mode) {
    case 'characters':
      result = text.split('').reverse().join('');
      break;
    case 'words':
      result = text.split(/(\s+)/).reverse().join('');
      break;
    case 'lines':
      result = text.split('\n').reverse().join('\n');
      break;
    default:
      result = text.split('').reverse().join('');
  }

  return { result: result };
};
