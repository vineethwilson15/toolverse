'use strict';

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://toolverse-app.vercel.app';
const DIST = path.join(__dirname, 'dist');
const SRC = path.join(__dirname, 'src');
const DATA = path.join(__dirname, 'data');

const CATEGORIES = {
  text: { label: 'Text Tools', description: 'Powerful text manipulation and analysis tools. Count words, convert cases, format text and more.' },
  developer: { label: 'Developer Tools', description: 'Essential utilities for developers. Format JSON, encode/decode data, generate UUIDs and more.' },
  converter: { label: 'Data Converters', description: 'Convert data between formats. JSON to CSV, Markdown to HTML, unit conversions and more.' },
  seo: { label: 'SEO & Web Tools', description: 'Tools for webmasters and SEO professionals. Generate meta tags, sitemaps, robots.txt and more.' }
};

// --- Utility functions ---

function render(template, tokens) {
  let result = template;
  for (const [key, value] of Object.entries(tokens)) {
    result = result.split('{{' + key + '}}').join(value || '');
  }
  return result;
}

function readPartials(dir) {
  const partials = {};
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (!file.endsWith('.html')) continue;
    const name = file.replace('.html', '').toUpperCase().replace(/-/g, '_');
    partials[name] = fs.readFileSync(path.join(dir, file), 'utf8');
  }
  return partials;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanDist() {
  if (fs.existsSync(DIST)) {
    try {
      fs.rmSync(DIST, { recursive: true, force: true });
    } catch (e) {
      const entries = fs.readdirSync(DIST, { withFileTypes: true });
      for (const entry of entries) {
        const p = path.join(DIST, entry.name);
        try {
          fs.rmSync(p, { recursive: true, force: true });
        } catch (_) {}
      }
    }
  }
  ensureDir(DIST);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- HTML builders ---

function buildInputHTML(inputs) {
  let html = '';
  for (const input of inputs) {
    html += '<div class="form-group">';
    if (input.type === 'textarea' || input.type === 'code') {
      html += `<label for="input-${input.id}">${escapeHtml(input.label)}</label>`;
      html += `<textarea id="input-${input.id}" name="${input.id}" rows="${input.rows || 6}" placeholder="${escapeHtml(input.placeholder || '')}"></textarea>`;
    } else if (input.type === 'select') {
      html += `<label for="input-${input.id}">${escapeHtml(input.label)}</label>`;
      html += `<select id="input-${input.id}" name="${input.id}">`;
      for (const opt of input.options) {
        const selected = opt.value === input.default ? ' selected' : '';
        html += `<option value="${escapeHtml(opt.value)}"${selected}>${escapeHtml(opt.label)}</option>`;
      }
      html += '</select>';
    } else if (input.type === 'number') {
      html += `<label for="input-${input.id}">${escapeHtml(input.label)}</label>`;
      html += `<input type="number" id="input-${input.id}" name="${input.id}" value="${input.default || ''}" min="${input.min || ''}" max="${input.max || ''}">`;
    } else if (input.type === 'checkbox') {
      html += '<div class="checkbox-group">';
      html += `<input type="checkbox" id="input-${input.id}" name="${input.id}"${input.default ? ' checked' : ''}>`;
      html += `<label for="input-${input.id}">${escapeHtml(input.label)}</label>`;
      html += '</div>';
    } else {
      html += `<label for="input-${input.id}">${escapeHtml(input.label)}</label>`;
      html += `<input type="text" id="input-${input.id}" name="${input.id}" placeholder="${escapeHtml(input.placeholder || '')}" value="${input.default || ''}">`;
    }
    html += '</div>';
  }
  return html;
}

function buildOutputHTML(outputs) {
  const hasNumberOutputs = outputs.some(o => o.format === 'number');
  const codeOutputs = outputs.filter(o => o.format === 'code' || o.format === 'json');
  const textOutputs = outputs.filter(o => o.format === 'text');
  const numberOutputs = outputs.filter(o => o.format === 'number');

  let html = '';

  if (numberOutputs.length > 0) {
    html += '<div class="output-grid">';
    for (const out of numberOutputs) {
      html += `<div class="output-card" data-output="${out.id}">`;
      html += `<div class="output-value" id="output-${out.id}">-</div>`;
      html += `<div class="output-label">${escapeHtml(out.label)}</div>`;
      html += '</div>';
    }
    html += '</div>';
  }

  for (const out of textOutputs) {
    html += `<div class="output-status" data-output="${out.id}" id="output-${out.id}"></div>`;
  }

  for (const out of codeOutputs) {
    html += `<div class="output-code" data-output="${out.id}">`;
    html += `<span class="output-label">${escapeHtml(out.label)}</span>`;
    html += `<button class="copy-btn" data-copy="${out.id}" title="Copy to clipboard">Copy</button>`;
    html += `<pre id="output-${out.id}"></pre>`;
    html += '</div>';
  }

  return html;
}

function buildFAQHTML(faq) {
  if (!faq || faq.length === 0) return '';
  let html = '<section class="faq-section"><h2>Frequently Asked Questions</h2>';
  for (const item of faq) {
    html += '<div class="faq-item">';
    html += `<button class="faq-question">${escapeHtml(item.question)}</button>`;
    html += `<div class="faq-answer"><p>${escapeHtml(item.answer)}</p></div>`;
    html += '</div>';
  }
  html += '</section>';
  return html;
}

function buildRelatedTools(relatedIds, allTools) {
  if (!relatedIds || relatedIds.length === 0) return '';
  const tools = relatedIds.map(id => allTools.find(t => t.id === id)).filter(Boolean);
  if (tools.length === 0) return '';

  let html = '<section class="related-tools"><h2>Related Tools</h2><div class="related-grid">';
  for (const tool of tools) {
    html += `<a href="/tool/${tool.id}/" class="related-card">`;
    html += `<h3>${escapeHtml(tool.title)}</h3>`;
    html += `<p>${escapeHtml(tool.description)}</p>`;
    html += '</a>';
  }
  html += '</div></section>';
  return html;
}

function buildBreadcrumb(segments) {
  let html = '<a href="/">Home</a>';
  for (const seg of segments) {
    html += ` <span>&rsaquo;</span> `;
    if (seg.url) {
      html += `<a href="${seg.url}">${escapeHtml(seg.label)}</a>`;
    } else {
      html += `<span>${escapeHtml(seg.label)}</span>`;
    }
  }
  return html;
}

function buildStructuredData(tool) {
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    description: tool.description,
    url: `${SITE_URL}/tool/${tool.id}/`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };

  let scripts = `<script type="application/ld+json">${JSON.stringify(webApp)}</script>`;

  if (tool.faq && tool.faq.length > 0) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faq.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer }
      }))
    };
    scripts += `\n<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
  }

  return scripts;
}

// --- Page generators ---

function buildToolPages(tools, partials, template) {
  for (const tool of tools) {
    const category = CATEGORIES[tool.category] || { label: tool.category };
    const tokens = {
      ...partials,
      PAGE_TITLE: tool.seo.title,
      PAGE_DESCRIPTION: tool.seo.description,
      PAGE_KEYWORDS: (tool.seo.keywords || []).join(', '),
      CANONICAL_URL: `${SITE_URL}/tool/${tool.id}/`,
      OG_TITLE: tool.seo.title,
      OG_DESCRIPTION: tool.seo.description,
      YEAR: new Date().getFullYear().toString(),
      BREADCRUMB: buildBreadcrumb([
        { label: category.label, url: `/category/${tool.category}/` },
        { label: tool.title }
      ]),
      TOOL_ID: tool.id,
      TOOL_TITLE: tool.title,
      TOOL_DESCRIPTION: tool.description,
      REALTIME: tool.realtime ? 'true' : 'false',
      OUTPUTS_JSON: escapeHtml(JSON.stringify(tool.outputs)),
      TOOL_INPUTS: buildInputHTML(tool.inputs),
      TOOL_OUTPUTS: buildOutputHTML(tool.outputs),
      HOW_TO_USE: tool.howToUse || '',
      FAQ_SECTION: buildFAQHTML(tool.faq),
      RELATED_TOOLS: buildRelatedTools(tool.relatedTools, tools),
      STRUCTURED_DATA: buildStructuredData(tool),
      AD_SLOT_HEADER: partials.AD_SLOT || '',
      AD_SLOT_MIDDLE: partials.AD_SLOT || ''
    };

    const html = render(template, tokens);
    const dir = path.join(DIST, 'tool', tool.id);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
}

function buildCategoryPages(tools, partials, template) {
  for (const [slug, cat] of Object.entries(CATEGORIES)) {
    const catTools = tools.filter(t => t.category === slug);

    let toolsHtml = '';
    if (catTools.length === 0) {
      toolsHtml = '<p class="empty-state">More tools coming soon. Check back later!</p>';
    } else {
      for (const tool of catTools) {
        toolsHtml += `<a href="/tool/${tool.id}/" class="tool-card" data-title="${escapeHtml(tool.title.toLowerCase())}">`;
        toolsHtml += `<div class="tool-card-icon">${tool.icon || ''}</div>`;
        toolsHtml += `<h3>${escapeHtml(tool.title)}</h3>`;
        toolsHtml += `<p>${escapeHtml(tool.description)}</p>`;
        toolsHtml += '</a>';
      }
    }

    const tokens = {
      ...partials,
      PAGE_TITLE: `${cat.label} - Free Online Tools | ToolVerse`,
      PAGE_DESCRIPTION: cat.description,
      PAGE_KEYWORDS: '',
      CANONICAL_URL: `${SITE_URL}/category/${slug}/`,
      OG_TITLE: `${cat.label} | ToolVerse`,
      OG_DESCRIPTION: cat.description,
      YEAR: new Date().getFullYear().toString(),
      BREADCRUMB: buildBreadcrumb([{ label: cat.label }]),
      CATEGORY_TITLE: cat.label,
      CATEGORY_DESCRIPTION: cat.description,
      CATEGORY_TOOLS: toolsHtml
    };

    const html = render(template, tokens);
    const dir = path.join(DIST, 'category', slug);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
}

function buildHomePage(tools, partials, template) {
  let gridHtml = '';

  for (const [slug, cat] of Object.entries(CATEGORIES)) {
    const catTools = tools.filter(t => t.category === slug);
    if (catTools.length === 0) continue;

    gridHtml += `<section class="category-section">`;
    gridHtml += `<h2>${escapeHtml(cat.label)}</h2>`;
    gridHtml += '<div class="tools-grid">';
    for (const tool of catTools) {
      gridHtml += `<a href="/tool/${tool.id}/" class="tool-card" data-title="${escapeHtml(tool.title.toLowerCase())}">`;
      gridHtml += `<div class="tool-card-icon">${tool.icon || ''}</div>`;
      gridHtml += `<h3>${escapeHtml(tool.title)}</h3>`;
      gridHtml += `<p>${escapeHtml(tool.description)}</p>`;
      gridHtml += '</a>';
    }
    gridHtml += '</div></section>';
  }

  const tokens = {
    ...partials,
    PAGE_TITLE: 'ToolVerse - Free Online Developer & Text Tools',
    PAGE_DESCRIPTION: 'Collection of free online tools for developers and everyone. Text manipulation, JSON formatting, encoding/decoding, UUID generation and more. All tools run in your browser.',
    PAGE_KEYWORDS: 'online tools, developer tools, text tools, free tools, json formatter, base64 encoder',
    CANONICAL_URL: SITE_URL + '/',
    OG_TITLE: 'ToolVerse - Free Online Developer & Text Tools',
    OG_DESCRIPTION: 'Collection of free online tools for developers. JSON formatter, Base64 encoder, UUID generator, word counter and more.',
    YEAR: new Date().getFullYear().toString(),
    TOOL_GRID: gridHtml
  };

  const html = render(template, tokens);
  fs.writeFileSync(path.join(DIST, 'index.html'), html);
}

function buildStaticPages(partials, template) {
  const pages = [
    {
      slug: 'about',
      title: 'About ToolVerse',
      heading: 'About ToolVerse',
      description: 'Learn about ToolVerse - a collection of free online developer and text tools.',
      content: `
        <p>ToolVerse is a collection of free online tools designed for developers, writers, and anyone who works with text and data.</p>
        <h2>Our Mission</h2>
        <p>We believe useful tools should be free, fast, and private. Every tool on ToolVerse runs entirely in your browser — no data is ever sent to a server. Your input stays on your device.</p>
        <h2>What We Offer</h2>
        <ul>
          <li><strong>Text Tools</strong> — Word counting, case conversion, text formatting and more</li>
          <li><strong>Developer Tools</strong> — JSON formatting, Base64 encoding, UUID generation, regex testing</li>
          <li><strong>Data Converters</strong> — Convert between JSON, CSV, YAML, Markdown and other formats</li>
          <li><strong>SEO Tools</strong> — Meta tag generators, sitemap builders, and more</li>
        </ul>
        <h2>Privacy First</h2>
        <p>All processing happens client-side in your browser. We never collect, store, or transmit the data you enter into our tools. Your privacy is guaranteed by design.</p>
        <h2>Contact</h2>
        <p>Have feedback or suggestions? Found a bug? Reach out to us at <strong>hello@toolverse.net</strong>.</p>
      `
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      heading: 'Privacy Policy',
      description: 'ToolVerse privacy policy - how we handle your data.',
      content: `
        <p><em>Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>
        <h2>Overview</h2>
        <p>ToolVerse ("we", "our", "us") is committed to protecting your privacy. This policy explains how we handle information when you use our website.</p>
        <h2>Data Processing</h2>
        <p>All tools on ToolVerse process data entirely within your browser. No input data is transmitted to our servers or any third party. Your data remains on your device at all times.</p>
        <h2>Cookies</h2>
        <p>We use minimal cookies for:</p>
        <ul>
          <li><strong>Theme preference</strong> — Remembering your dark/light mode choice</li>
          <li><strong>Analytics</strong> — We may use Google Analytics to understand how our site is used. This data is anonymized and aggregated.</li>
          <li><strong>Advertising</strong> — We display ads through Google AdSense, which may use cookies to serve relevant ads.</li>
        </ul>
        <h2>Third-Party Services</h2>
        <p>We may use the following third-party services:</p>
        <ul>
          <li><strong>Google Analytics</strong> — For anonymous usage statistics</li>
          <li><strong>Google AdSense</strong> — For displaying advertisements</li>
        </ul>
        <p>These services may collect information as described in their respective privacy policies.</p>
        <h2>Your Rights</h2>
        <p>You can:</p>
        <ul>
          <li>Disable cookies in your browser settings</li>
          <li>Use an ad blocker if you prefer not to see ads</li>
          <li>Browse with privacy/incognito mode</li>
        </ul>
        <h2>Changes to This Policy</h2>
        <p>We may update this privacy policy from time to time. Changes will be posted on this page with an updated date.</p>
        <h2>Contact</h2>
        <p>If you have questions about this privacy policy, contact us at <strong>hello@toolverse.net</strong>.</p>
      `
    }
  ];

  for (const page of pages) {
    const tokens = {
      ...partials,
      PAGE_TITLE: `${page.title} | ToolVerse`,
      PAGE_DESCRIPTION: page.description,
      PAGE_KEYWORDS: '',
      CANONICAL_URL: `${SITE_URL}/${page.slug}/`,
      OG_TITLE: `${page.title} | ToolVerse`,
      OG_DESCRIPTION: page.description,
      YEAR: new Date().getFullYear().toString(),
      PAGE_HEADING: page.heading,
      PAGE_CONTENT: page.content
    };

    const html = render(template, tokens);
    const dir = path.join(DIST, page.slug);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
}

function buildSitemap(tools) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  xml += `  <url><loc>${SITE_URL}/</loc><priority>1.0</priority><changefreq>weekly</changefreq></url>\n`;

  for (const tool of tools) {
    xml += `  <url><loc>${SITE_URL}/tool/${tool.id}/</loc><priority>${tool.priority || 0.7}</priority><changefreq>monthly</changefreq></url>\n`;
  }

  for (const slug of Object.keys(CATEGORIES)) {
    const hasTool = tools.some(t => t.category === slug);
    if (hasTool) {
      xml += `  <url><loc>${SITE_URL}/category/${slug}/</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>\n`;
    }
  }

  xml += `  <url><loc>${SITE_URL}/about/</loc><priority>0.5</priority><changefreq>monthly</changefreq></url>\n`;
  xml += `  <url><loc>${SITE_URL}/privacy-policy/</loc><priority>0.3</priority><changefreq>monthly</changefreq></url>\n`;

  xml += '</urlset>';
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml);
}

function buildRobotsTxt() {
  const content = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST, 'robots.txt'), content);
}

function buildHeaders() {
  const content = `/css/*\n  Cache-Control: public, max-age=31536000, immutable\n/js/*\n  Cache-Control: public, max-age=31536000, immutable\n/tools/*\n  Cache-Control: public, max-age=31536000, immutable\n/*.html\n  Cache-Control: public, max-age=3600\n`;
  fs.writeFileSync(path.join(DIST, '_headers'), content);
}

function buildFavicon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="16" fill="#6366F1"/><text x="50" y="68" font-family="monospace" font-size="48" font-weight="bold" fill="white" text-anchor="middle">TV</text></svg>`;
  fs.writeFileSync(path.join(DIST, 'favicon.svg'), svg);
}

function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyStaticAssets() {
  copyDir(path.join(SRC, 'css'), path.join(DIST, 'css'));
  copyDir(path.join(SRC, 'js'), path.join(DIST, 'js'));
  copyDir(path.join(SRC, 'tools'), path.join(DIST, 'tools'));
}

// --- Main build ---

function main() {
  console.log('Building ToolVerse...');
  const start = Date.now();

  cleanDist();

  const partials = readPartials(path.join(SRC, 'templates', 'partials'));
  const tools = JSON.parse(fs.readFileSync(path.join(DATA, 'tools.json'), 'utf8'));

  const toolTemplate = fs.readFileSync(path.join(SRC, 'templates', 'tool-page.html'), 'utf8');
  const homeTemplate = fs.readFileSync(path.join(SRC, 'templates', 'home.html'), 'utf8');
  const categoryTemplate = fs.readFileSync(path.join(SRC, 'templates', 'category-page.html'), 'utf8');
  const staticTemplate = fs.readFileSync(path.join(SRC, 'templates', 'static-page.html'), 'utf8');

  buildToolPages(tools, partials, toolTemplate);
  console.log(`  Built ${tools.length} tool pages`);

  buildCategoryPages(tools, partials, categoryTemplate);
  console.log('  Built category pages');

  buildHomePage(tools, partials, homeTemplate);
  console.log('  Built homepage');

  buildStaticPages(partials, staticTemplate);
  console.log('  Built static pages');

  buildSitemap(tools);
  buildRobotsTxt();
  buildHeaders();
  buildFavicon();
  console.log('  Built sitemap, robots.txt, favicon');

  copyStaticAssets();
  console.log('  Copied static assets');

  const elapsed = Date.now() - start;
  console.log(`Done in ${elapsed}ms`);
}

main();
