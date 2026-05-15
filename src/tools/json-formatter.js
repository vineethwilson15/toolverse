'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['json-formatter'] = function (inputs) {
  var json = inputs.json || '';
  var indent = inputs.indent || '2';

  if (!json.trim()) {
    return { formatted: '', valid: '', stats: '' };
  }

  try {
    var parsed = JSON.parse(json);
    var indentValue = indent === 'tab' ? '\t' : parseInt(indent, 10);
    var formatted = JSON.stringify(parsed, null, indentValue);

    var keys = 0;
    var arrays = 0;
    var objects = 0;
    (function count(obj) {
      if (Array.isArray(obj)) {
        arrays++;
        obj.forEach(count);
      } else if (obj && typeof obj === 'object') {
        objects++;
        var k = Object.keys(obj);
        keys += k.length;
        k.forEach(function (key) { count(obj[key]); });
      }
    })(parsed);

    return {
      formatted: formatted,
      valid: 'Valid JSON',
      stats: keys + ' keys, ' + objects + ' objects, ' + arrays + ' arrays'
    };
  } catch (e) {
    return {
      formatted: '',
      valid: 'Invalid JSON: ' + e.message,
      stats: ''
    };
  }
};
