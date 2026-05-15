'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['unix-timestamp-converter'] = function (inputs) {
  var value = inputs.value || '';
  var mode = inputs.mode || 'toDate';

  if (!value.trim()) return { result: '', utc: '', local: '', timestamp: '' };

  try {
    if (mode === 'toDate') {
      var ts = parseInt(value);
      if (isNaN(ts)) return { result: 'Invalid timestamp', utc: '', local: '', timestamp: '' };
      if (ts < 1e12) ts = ts * 1000;
      var date = new Date(ts);
      return {
        result: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleString(),
        timestamp: Math.floor(ts / 1000).toString()
      };
    } else {
      var d = new Date(value);
      if (isNaN(d.getTime())) return { result: 'Invalid date', utc: '', local: '', timestamp: '' };
      var unix = Math.floor(d.getTime() / 1000);
      return {
        result: unix.toString(),
        utc: d.toUTCString(),
        local: d.toLocaleString(),
        timestamp: unix.toString()
      };
    }
  } catch (e) {
    return { result: 'Error: ' + e.message, utc: '', local: '', timestamp: '' };
  }
};
