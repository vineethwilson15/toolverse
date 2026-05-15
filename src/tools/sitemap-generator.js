'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['sitemap-generator'] = function (inputs) {
  var urls = inputs.urls || '';
  var changefreq = inputs.changefreq || 'weekly';
  var priority = inputs.priority || '0.8';

  if (!urls.trim()) return { result: '' };

  var urlList = urls.split('\n').filter(function (u) { return u.trim(); });

  var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urlList.forEach(function (url) {
    xml += '  <url>\n';
    xml += '    <loc>' + escXml(url.trim()) + '</loc>\n';
    xml += '    <changefreq>' + changefreq + '</changefreq>\n';
    xml += '    <priority>' + priority + '</priority>\n';
    xml += '    <lastmod>' + new Date().toISOString().split('T')[0] + '</lastmod>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  return { result: xml };

  function escXml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
};
