'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['word-counter'] = function (inputs) {
  var text = inputs.text || '';
  var trimmed = text.trim();

  if (!trimmed) {
    return { words: 0, characters: 0, charactersNoSpaces: 0, sentences: 0, paragraphs: 0, readingTime: '0 min read' };
  }

  var words = trimmed.split(/\s+/).length;
  var characters = text.length;
  var charactersNoSpaces = text.replace(/\s/g, '').length;
  var sentences = trimmed.split(/[.!?]+/).filter(function (s) { return s.trim().length > 0; }).length;
  var paragraphs = trimmed.split(/\n\s*\n/).filter(function (s) { return s.trim().length > 0; }).length || 1;
  var minutes = Math.max(1, Math.ceil(words / 200));
  var readingTime = minutes + ' min read';

  return { words: words, characters: characters, charactersNoSpaces: charactersNoSpaces, sentences: sentences, paragraphs: paragraphs, readingTime: readingTime };
};
