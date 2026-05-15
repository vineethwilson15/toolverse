'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['hash-generator'] = function (inputs) {
  var text = inputs.text || '';
  var algorithm = inputs.algorithm || 'SHA-256';

  if (!text) return Promise.resolve({ result: '' });

  var encoder = new TextEncoder();
  var data = encoder.encode(text);

  return crypto.subtle.digest(algorithm, data).then(function (buffer) {
    var hashArray = Array.from(new Uint8Array(buffer));
    var hex = hashArray.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    return { result: hex };
  });
};
