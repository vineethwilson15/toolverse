'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['meta-tag-generator'] = function (inputs) {
  var title = inputs.title || '';
  var description = inputs.description || '';
  var keywords = inputs.keywords || '';
  var author = inputs.author || '';
  var viewport = inputs.viewport || 'width=device-width, initial-scale=1.0';

  var tags = [];
  tags.push('<meta charset="UTF-8">');
  if (viewport) tags.push('<meta name="viewport" content="' + escHtml(viewport) + '">');
  if (title) tags.push('<title>' + escHtml(title) + '</title>');
  if (description) tags.push('<meta name="description" content="' + escHtml(description) + '">');
  if (keywords) tags.push('<meta name="keywords" content="' + escHtml(keywords) + '">');
  if (author) tags.push('<meta name="author" content="' + escHtml(author) + '">');

  if (title) tags.push('<meta property="og:title" content="' + escHtml(title) + '">');
  if (description) tags.push('<meta property="og:description" content="' + escHtml(description) + '">');
  tags.push('<meta property="og:type" content="website">');

  if (title) tags.push('<meta name="twitter:title" content="' + escHtml(title) + '">');
  if (description) tags.push('<meta name="twitter:description" content="' + escHtml(description) + '">');
  tags.push('<meta name="twitter:card" content="summary">');

  return { result: tags.join('\n') };

  function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
};
