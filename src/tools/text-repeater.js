'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['text-repeater'] = function (inputs) {
  var text = inputs.text || '';
  var count = Math.min(Math.max(parseInt(inputs.count, 10) || 1, 1), 1000);
  var separator = inputs.separator || '';

  separator = separator.replace(/\\n/g, '\n').replace(/\\t/g, '\t');

  var parts = [];
  for (var i = 0; i < count; i++) parts.push(text);
  var result = parts.join(separator);

  return { result: result };
};
