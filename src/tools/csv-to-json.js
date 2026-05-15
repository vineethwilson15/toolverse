'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['csv-to-json'] = function (inputs) {
  var csv = inputs.csv || '';
  var delimiter = inputs.delimiter || ',';

  if (!csv.trim()) return { result: '' };

  try {
    var lines = csv.trim().split('\n');
    if (lines.length < 2) return { result: 'Error: CSV must have at least a header row and one data row' };

    var headers = parseCsvLine(lines[0], delimiter);
    var result = [];

    for (var i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      var values = parseCsvLine(lines[i], delimiter);
      var obj = {};
      headers.forEach(function (h, idx) {
        var val = values[idx] || '';
        if (!isNaN(val) && val !== '') val = Number(val);
        obj[h.trim()] = val;
      });
      result.push(obj);
    }

    return { result: JSON.stringify(result, null, 2) };
  } catch (e) {
    return { result: 'Error: ' + e.message };
  }

  function parseCsvLine(line, delim) {
    var fields = [];
    var current = '';
    var inQuotes = false;

    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === delim) {
          fields.push(current);
          current = '';
        } else {
          current += ch;
        }
      }
    }
    fields.push(current);
    return fields;
  }
};
