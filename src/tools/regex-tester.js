'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['regex-tester'] = function (inputs) {
  var pattern = inputs.pattern || '';
  var flags = inputs.flags || 'g';
  var testString = inputs.testString || '';

  if (!pattern || !testString) return { matches: '', count: '0 matches' };

  try {
    var regex = new RegExp(pattern, flags);
    var matches = [];
    var match;

    if (flags.indexOf('g') !== -1) {
      while ((match = regex.exec(testString)) !== null) {
        matches.push('Match ' + matches.length + ': "' + match[0] + '" at index ' + match.index);
        if (match.index === regex.lastIndex) regex.lastIndex++;
      }
    } else {
      match = regex.exec(testString);
      if (match) {
        matches.push('Match: "' + match[0] + '" at index ' + match.index);
        if (match.length > 1) {
          for (var i = 1; i < match.length; i++) {
            matches.push('  Group ' + i + ': "' + (match[i] || '') + '"');
          }
        }
      }
    }

    var count = matches.length > 0 ? matches.filter(function (m) { return m.startsWith('Match'); }).length + ' match(es)' : '0 matches';
    return { matches: matches.join('\n') || 'No matches found', count: count };
  } catch (e) {
    return { matches: 'Error: ' + e.message, count: 'Invalid regex' };
  }
};
