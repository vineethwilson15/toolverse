'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['json-to-csv'] = function (inputs) {
  var json = inputs.json || '';
  var delimiter = inputs.delimiter || ',';

  if (!json.trim()) return { result: '' };

  try {
    var data = JSON.parse(json);
    if (!Array.isArray(data) || data.length === 0) {
      return { result: 'Error: Input must be a non-empty JSON array of objects' };
    }

    var headers = [];
    data.forEach(function (obj) {
      Object.keys(obj).forEach(function (key) {
        if (headers.indexOf(key) === -1) headers.push(key);
      });
    });

    var csvRows = [headers.join(delimiter)];

    data.forEach(function (obj) {
      var row = headers.map(function (h) {
        var val = obj[h] !== undefined ? String(obj[h]) : '';
        if (val.indexOf(delimiter) !== -1 || val.indexOf('"') !== -1 || val.indexOf('\n') !== -1) {
          val = '"' + val.replace(/"/g, '""') + '"';
        }
        return val;
      });
      csvRows.push(row.join(delimiter));
    });

    return { result: csvRows.join('\n') };
  } catch (e) {
    return { result: 'Error: ' + e.message };
  }
};
