'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['sort-lines'] = function (inputs) {
  var text = inputs.text || '';
  var mode = inputs.mode || 'az';

  if (!text.trim()) return { result: '' };

  var lines = text.split('\n');

  switch (mode) {
    case 'az':
      lines.sort(function (a, b) { return a.localeCompare(b); });
      break;
    case 'za':
      lines.sort(function (a, b) { return b.localeCompare(a); });
      break;
    case 'length-asc':
      lines.sort(function (a, b) { return a.length - b.length; });
      break;
    case 'length-desc':
      lines.sort(function (a, b) { return b.length - a.length; });
      break;
    case 'reverse':
      lines.reverse();
      break;
    case 'random':
      for (var i = lines.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = lines[i]; lines[i] = lines[j]; lines[j] = tmp;
      }
      break;
  }

  return { result: lines.join('\n') };
};
