'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['yaml-to-json'] = function (inputs) {
  var yaml = inputs.yaml || '';

  if (!yaml.trim()) return { result: '' };

  try {
    var result = parseYaml(yaml);
    return { result: JSON.stringify(result, null, 2) };
  } catch (e) {
    return { result: 'Error: ' + e.message };
  }

  function parseYaml(text) {
    var lines = text.split('\n');
    var root = {};
    var stack = [{ obj: root, indent: -1 }];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (!line.trim() || line.trim().charAt(0) === '#') continue;

      var indent = line.length - line.replace(/^ */, '').length;
      var trimmed = line.trim();

      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      var parent = stack[stack.length - 1].obj;

      if (trimmed.charAt(0) === '-') {
        var arrVal = trimmed.substring(1).trim();
        if (Array.isArray(parent)) {
          parent.push(parseValue(arrVal));
        } else {
          var lastKey = Object.keys(parent).pop();
          if (lastKey && !Array.isArray(parent[lastKey])) {
            parent[lastKey] = [];
          }
          if (lastKey) parent[lastKey].push(parseValue(arrVal));
        }
      } else {
        var colonIdx = trimmed.indexOf(':');
        if (colonIdx === -1) continue;

        var key = trimmed.substring(0, colonIdx).trim();
        var val = trimmed.substring(colonIdx + 1).trim();

        if (val === '' || val === '|' || val === '>') {
          if (i + 1 < lines.length) {
            var nextLine = lines[i + 1];
            var nextIndent = nextLine.length - nextLine.replace(/^ */, '').length;
            var nextTrimmed = nextLine.trim();
            if (nextTrimmed.charAt(0) === '-') {
              parent[key] = [];
              stack.push({ obj: parent[key], indent: indent });
            } else if (nextIndent > indent) {
              parent[key] = {};
              stack.push({ obj: parent[key], indent: indent });
            } else {
              parent[key] = null;
            }
          } else {
            parent[key] = null;
          }
        } else {
          parent[key] = parseValue(val);
        }
      }
    }

    return root;
  }

  function parseValue(val) {
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (val === 'null' || val === '~') return null;
    if (/^-?\d+$/.test(val)) return parseInt(val, 10);
    if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
    if ((val.charAt(0) === '"' && val.charAt(val.length - 1) === '"') ||
        (val.charAt(0) === "'" && val.charAt(val.length - 1) === "'")) {
      return val.substring(1, val.length - 1);
    }
    return val;
  }
};
