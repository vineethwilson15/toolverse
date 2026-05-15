'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['base64-encode-decode'] = function (inputs) {
  var text = inputs.text || '';
  var mode = inputs.mode || 'encode';

  if (!text) {
    return { result: '' };
  }

  try {
    if (mode === 'encode') {
      var encoded = btoa(unescape(encodeURIComponent(text)));
      return { result: encoded };
    } else {
      var decoded = decodeURIComponent(escape(atob(text)));
      return { result: decoded };
    }
  } catch (e) {
    return { result: 'Error: ' + e.message };
  }
};
