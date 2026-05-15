'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['uuid-generator'] = function (inputs) {
  var count = Math.min(Math.max(parseInt(inputs.count, 10) || 1, 1), 100);
  var uppercase = inputs.uppercase === true || inputs.uppercase === 'true';
  var hyphens = inputs.hyphens !== false && inputs.hyphens !== 'false';

  function generateUUID() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && performance.now) {
      d += performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  var uuids = [];
  for (var i = 0; i < count; i++) {
    var uuid = generateUUID();
    if (!hyphens) {
      uuid = uuid.replace(/-/g, '');
    }
    if (uppercase) {
      uuid = uuid.toUpperCase();
    }
    uuids.push(uuid);
  }

  return { uuids: uuids.join('\n') };
};
