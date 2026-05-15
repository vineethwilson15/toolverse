'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['robots-txt-generator'] = function (inputs) {
  var userAgent = inputs.userAgent || '*';
  var allowPaths = inputs.allowPaths || '/';
  var disallowPaths = inputs.disallowPaths || '';
  var sitemapUrl = inputs.sitemapUrl || '';
  var crawlDelay = inputs.crawlDelay || '';

  var lines = [];
  lines.push('User-agent: ' + userAgent);

  if (disallowPaths.trim()) {
    disallowPaths.split('\n').forEach(function (path) {
      if (path.trim()) lines.push('Disallow: ' + path.trim());
    });
  }

  if (allowPaths.trim()) {
    allowPaths.split('\n').forEach(function (path) {
      if (path.trim()) lines.push('Allow: ' + path.trim());
    });
  }

  if (crawlDelay) lines.push('Crawl-delay: ' + crawlDelay);
  if (sitemapUrl.trim()) {
    lines.push('');
    lines.push('Sitemap: ' + sitemapUrl.trim());
  }

  return { result: lines.join('\n') };
};
