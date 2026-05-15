'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['remove-duplicate-lines'] = function (inputs) {
  var text = inputs.text || '';
  var caseSensitive = inputs.caseSensitive !== false && inputs.caseSensitive !== 'false';

  if (!text.trim()) return { result: '', removed: '0 duplicates removed' };

  var lines = text.split('\n');
  var seen = {};
  var unique = [];
  var dupeCount = 0;

  for (var i = 0; i < lines.length; i++) {
    var key = caseSensitive ? lines[i] : lines[i].toLowerCase();
    if (!seen[key]) {
      seen[key] = true;
      unique.push(lines[i]);
    } else {
      dupeCount++;
    }
  }

  return { result: unique.join('\n'), removed: dupeCount + ' duplicate' + (dupeCount !== 1 ? 's' : '') + ' removed' };
};
