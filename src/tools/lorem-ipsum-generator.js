'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['lorem-ipsum-generator'] = function (inputs) {
  var count = Math.min(Math.max(parseInt(inputs.count, 10) || 3, 1), 50);
  var unit = inputs.unit || 'paragraphs';

  var words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'vitae', 'elementum', 'curabitur', 'semper', 'auctor', 'neque', 'viverra', 'justo', 'laoreet', 'mattis', 'ultrices', 'posuere', 'cubilia', 'curae'];

  function randomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  function generateSentence() {
    var len = 8 + Math.floor(Math.random() * 12);
    var s = [];
    for (var i = 0; i < len; i++) s.push(randomWord());
    s[0] = s[0].charAt(0).toUpperCase() + s[0].slice(1);
    return s.join(' ') + '.';
  }

  function generateParagraph() {
    var sentences = 3 + Math.floor(Math.random() * 5);
    var p = [];
    for (var i = 0; i < sentences; i++) p.push(generateSentence());
    return p.join(' ');
  }

  var result = '';
  if (unit === 'words') {
    var w = [];
    for (var i = 0; i < count; i++) w.push(randomWord());
    w[0] = w[0].charAt(0).toUpperCase() + w[0].slice(1);
    result = w.join(' ') + '.';
  } else if (unit === 'sentences') {
    var s = [];
    for (var i = 0; i < count; i++) s.push(generateSentence());
    result = s.join(' ');
  } else {
    var p = [];
    for (var i = 0; i < count; i++) p.push(generateParagraph());
    result = p.join('\n\n');
  }

  return { result: result };
};
