'use strict';

(function () {
  var form = document.getElementById('tool-form');
  if (!form) return;

  var toolId = form.getAttribute('data-tool');
  var isRealtime = form.getAttribute('data-realtime') === 'true';
  var outputsConfig = JSON.parse(form.getAttribute('data-outputs'));

  function collectInputs() {
    var inputs = {};
    var elements = form.elements;
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (!el.name) continue;
      if (el.type === 'checkbox') {
        inputs[el.name] = el.checked;
      } else {
        inputs[el.name] = el.value;
      }
    }
    return inputs;
  }

  function displayResults(results) {
    for (var i = 0; i < outputsConfig.length; i++) {
      var config = outputsConfig[i];
      var el = document.getElementById('output-' + config.id);
      if (!el) continue;

      var value = results[config.id];
      if (value === undefined || value === null) value = '';

      if (config.format === 'number') {
        el.textContent = typeof value === 'number' ? value.toLocaleString() : value;
      } else if (config.format === 'code' || config.format === 'json') {
        el.textContent = value;
      } else if (config.format === 'text') {
        el.textContent = value;
        el.classList.remove('success', 'error');
        if (value.toLowerCase().indexOf('invalid') !== -1 || value.toLowerCase().indexOf('error') !== -1) {
          el.classList.add('error');
        } else if (value) {
          el.classList.add('success');
        }
      }
    }
  }

  function runTool() {
    var fn = window.ToolVerse && window.ToolVerse.tools && window.ToolVerse.tools[toolId];
    if (!fn) return;

    var inputs = collectInputs();
    try {
      var results = fn(inputs);
      displayResults(results);
    } catch (e) {
      console.error('Tool error:', e);
    }
  }

  if (isRealtime) {
    form.addEventListener('input', runTool);
    runTool();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    runTool();
  });

  // Copy to clipboard
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;

    var outputId = btn.getAttribute('data-copy');
    var pre = document.getElementById('output-' + outputId);
    if (!pre) return;

    var text = pre.textContent;
    if (!text) return;

    navigator.clipboard.writeText(text).then(function () {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
})();
