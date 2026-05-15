'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['html-entity-encode-decode'] = function (inputs) {
  var text = inputs.text || '';
  var mode = inputs.mode || 'encode';

  if (!text) return { result: '' };

  if (mode === 'encode') {
    var result = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    return { result: result };
  } else {
    var el = document.createElement('textarea');
    el.innerHTML = text;
    return { result: el.value };
  }
};
