'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['text-diff'] = function (inputs) {
  var text1 = inputs.text1 || '';
  var text2 = inputs.text2 || '';

  if (!text1 && !text2) return { result: '' };

  var lines1 = text1.split('\n');
  var lines2 = text2.split('\n');
  var maxLen = Math.max(lines1.length, lines2.length);
  var output = [];
  var additions = 0;
  var removals = 0;

  for (var i = 0; i < maxLen; i++) {
    var l1 = i < lines1.length ? lines1[i] : undefined;
    var l2 = i < lines2.length ? lines2[i] : undefined;

    if (l1 === l2) {
      output.push('  ' + l1);
    } else {
      if (l1 !== undefined) { output.push('- ' + l1); removals++; }
      if (l2 !== undefined) { output.push('+ ' + l2); additions++; }
    }
  }

  var stats = additions + ' addition' + (additions !== 1 ? 's' : '') + ', ' + removals + ' removal' + (removals !== 1 ? 's' : '');
  return { result: output.join('\n'), stats: stats };
};
