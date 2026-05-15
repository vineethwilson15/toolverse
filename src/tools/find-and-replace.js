'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['find-and-replace'] = function (inputs) {
  var text = inputs.text || '';
  var find = inputs.find || '';
  var replace = inputs.replace || '';
  var useRegex = inputs.useRegex === true || inputs.useRegex === 'true';
  var caseSensitive = inputs.caseSensitive === true || inputs.caseSensitive === 'true';

  if (!text || !find) return { result: text, count: '0 replacements' };

  var count = 0;
  var result;

  try {
    if (useRegex) {
      var flags = 'g' + (caseSensitive ? '' : 'i');
      var regex = new RegExp(find, flags);
      result = text.replace(regex, function () { count++; return replace; });
    } else {
      var searchStr = caseSensitive ? find : find.toLowerCase();
      var parts = [];
      var remaining = text;
      var idx;

      while (true) {
        var haystack = caseSensitive ? remaining : remaining.toLowerCase();
        idx = haystack.indexOf(searchStr);
        if (idx === -1) break;
        parts.push(remaining.slice(0, idx) + replace);
        remaining = remaining.slice(idx + find.length);
        count++;
      }
      parts.push(remaining);
      result = parts.join('');
    }
  } catch (e) {
    return { result: 'Error: ' + e.message, count: 'Invalid regex' };
  }

  return { result: result, count: count + ' replacement' + (count !== 1 ? 's' : '') + ' made' };
};
