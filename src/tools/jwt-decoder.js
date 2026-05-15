'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['jwt-decoder'] = function (inputs) {
  var token = inputs.token || '';

  if (!token.trim()) return { header: '', payload: '', status: '' };

  var parts = token.trim().split('.');
  if (parts.length !== 3) {
    return { header: '', payload: '', status: 'Invalid JWT: expected 3 parts, got ' + parts.length };
  }

  function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return decodeURIComponent(escape(atob(str)));
  }

  try {
    var header = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2);
    var payload = JSON.stringify(JSON.parse(base64UrlDecode(parts[1])), null, 2);
    return { header: header, payload: payload, status: 'Valid JWT structure' };
  } catch (e) {
    return { header: '', payload: '', status: 'Error decoding: ' + e.message };
  }
};
