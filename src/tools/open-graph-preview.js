'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['open-graph-preview'] = function (inputs) {
  var title = inputs.ogTitle || '';
  var description = inputs.ogDescription || '';
  var image = inputs.ogImage || '';
  var url = inputs.ogUrl || '';
  var siteName = inputs.ogSiteName || '';

  var tags = [];
  if (title) tags.push('<meta property="og:title" content="' + escHtml(title) + '">');
  if (description) tags.push('<meta property="og:description" content="' + escHtml(description) + '">');
  if (image) tags.push('<meta property="og:image" content="' + escHtml(image) + '">');
  if (url) tags.push('<meta property="og:url" content="' + escHtml(url) + '">');
  if (siteName) tags.push('<meta property="og:site_name" content="' + escHtml(siteName) + '">');
  tags.push('<meta property="og:type" content="website">');

  var preview = '┌─────────────────────────────────────┐\n';
  if (image) preview += '│  [Image: ' + image.substring(0, 25) + (image.length > 25 ? '...' : '') + ']  │\n';
  preview += '│                                     │\n';
  preview += '│  ' + (title || 'No title').substring(0, 35).padEnd(35) + '  │\n';
  preview += '│  ' + (description || 'No description').substring(0, 35).padEnd(35) + '  │\n';
  preview += '│  ' + (url || siteName || 'example.com').substring(0, 35).padEnd(35) + '  │\n';
  preview += '└─────────────────────────────────────┘';

  return { tags: tags.join('\n'), preview: preview };

  function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
};
