'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['case-converter'] = function (inputs) {
  var text = inputs.text || '';
  var targetCase = inputs.targetCase || 'upper';

  if (!text) {
    return { result: '' };
  }

  function toWords(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .replace(/[-_]+/g, ' ')
      .trim()
      .split(/\s+/);
  }

  var result;
  switch (targetCase) {
    case 'upper':
      result = text.toUpperCase();
      break;
    case 'lower':
      result = text.toLowerCase();
      break;
    case 'title':
      result = text.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      break;
    case 'sentence':
      result = text.toLowerCase().replace(/(^\s*|[.!?]\s+)(\w)/g, function (match, sep, char) {
        return sep + char.toUpperCase();
      });
      break;
    case 'camel':
      var words = toWords(text);
      result = words.map(function (w, i) {
        var lower = w.toLowerCase();
        return i === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
      }).join('');
      break;
    case 'pascal':
      result = toWords(text).map(function (w) {
        var lower = w.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }).join('');
      break;
    case 'snake':
      result = toWords(text).map(function (w) { return w.toLowerCase(); }).join('_');
      break;
    case 'kebab':
      result = toWords(text).map(function (w) { return w.toLowerCase(); }).join('-');
      break;
    case 'constant':
      result = toWords(text).map(function (w) { return w.toUpperCase(); }).join('_');
      break;
    default:
      result = text;
  }

  return { result: result };
};
