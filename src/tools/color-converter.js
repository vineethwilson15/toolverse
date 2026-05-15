'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['color-converter'] = function (inputs) {
  var color = inputs.color || '';
  var inputFormat = inputs.inputFormat || 'hex';

  if (!color.trim()) return { hex: '', rgb: '', hsl: '' };

  var r, g, b;

  try {
    if (inputFormat === 'hex') {
      var hex = color.replace('#', '');
      if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else if (inputFormat === 'rgb') {
      var match = color.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
      if (!match) return { hex: 'Invalid RGB', rgb: '', hsl: '' };
      r = parseInt(match[1]); g = parseInt(match[2]); b = parseInt(match[3]);
    } else if (inputFormat === 'hsl') {
      var hslMatch = color.match(/(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/);
      if (!hslMatch) return { hex: 'Invalid HSL', rgb: '', hsl: '' };
      var h = parseInt(hslMatch[1]) / 360;
      var s = parseInt(hslMatch[2]) / 100;
      var l = parseInt(hslMatch[3]) / 100;
      if (s === 0) { r = g = b = Math.round(l * 255); }
      else {
        var hue2rgb = function (p, q, t) {
          if (t < 0) t += 1; if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
        g = Math.round(hue2rgb(p, q, h) * 255);
        b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
      }
    }

    if (isNaN(r) || isNaN(g) || isNaN(b)) return { hex: 'Invalid color', rgb: '', hsl: '' };

    var hexOut = '#' + [r, g, b].map(function (x) { return x.toString(16).padStart(2, '0'); }).join('');
    var rgbOut = 'rgb(' + r + ', ' + g + ', ' + b + ')';

    var rn = r / 255, gn = g / 255, bn = b / 255;
    var max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    var hOut, sOut, lOut = (max + min) / 2;
    if (max === min) { hOut = sOut = 0; }
    else {
      var d = max - min;
      sOut = lOut > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rn) hOut = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      else if (max === gn) hOut = ((bn - rn) / d + 2) / 6;
      else hOut = ((rn - gn) / d + 4) / 6;
    }
    var hslOut = 'hsl(' + Math.round(hOut * 360) + ', ' + Math.round(sOut * 100) + '%, ' + Math.round(lOut * 100) + '%)';

    return { hex: hexOut, rgb: rgbOut, hsl: hslOut };
  } catch (e) {
    return { hex: 'Error: ' + e.message, rgb: '', hsl: '' };
  }
};
