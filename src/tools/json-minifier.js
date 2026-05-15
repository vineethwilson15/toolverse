'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['json-minifier'] = function (inputs) {
  var json = inputs.json || '';

  if (!json.trim()) return { result: '', savings: '' };

  try {
    var parsed = JSON.parse(json);
    var minified = JSON.stringify(parsed);
    var saved = json.length - minified.length;
    var percent = json.length > 0 ? Math.round((saved / json.length) * 100) : 0;
    return { result: minified, savings: 'Saved ' + saved + ' characters (' + percent + '% smaller)' };
  } catch (e) {
    return { result: 'Error: ' + e.message, savings: 'Invalid JSON' };
  }
};
