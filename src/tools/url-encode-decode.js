'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['url-encode-decode'] = function (inputs) {
  var text = inputs.text || '';
  var mode = inputs.mode || 'encode';

  if (!text) return { result: '' };

  try {
    if (mode === 'encode') {
      return { result: encodeURIComponent(text) };
    } else {
      return { result: decodeURIComponent(text) };
    }
  } catch (e) {
    return { result: 'Error: ' + e.message };
  }
};
