'use strict';
window.ToolVerse = window.ToolVerse || {};
window.ToolVerse.tools = window.ToolVerse.tools || {};

window.ToolVerse.tools['http-status-codes'] = function (inputs) {
  var search = (inputs.search || '').toLowerCase();

  var codes = [
    { code: 100, text: 'Continue', desc: 'Server received request headers, client should proceed' },
    { code: 101, text: 'Switching Protocols', desc: 'Server switching to protocol requested by client' },
    { code: 200, text: 'OK', desc: 'Request succeeded' },
    { code: 201, text: 'Created', desc: 'Request fulfilled, new resource created' },
    { code: 202, text: 'Accepted', desc: 'Request accepted but not yet processed' },
    { code: 204, text: 'No Content', desc: 'Request succeeded, no content to return' },
    { code: 206, text: 'Partial Content', desc: 'Server delivering part of the resource' },
    { code: 301, text: 'Moved Permanently', desc: 'Resource permanently moved to new URL' },
    { code: 302, text: 'Found', desc: 'Resource temporarily at different URL' },
    { code: 303, text: 'See Other', desc: 'Response can be found at another URL using GET' },
    { code: 304, text: 'Not Modified', desc: 'Resource not modified since last request' },
    { code: 307, text: 'Temporary Redirect', desc: 'Temporary redirect preserving HTTP method' },
    { code: 308, text: 'Permanent Redirect', desc: 'Permanent redirect preserving HTTP method' },
    { code: 400, text: 'Bad Request', desc: 'Server cannot process due to client error' },
    { code: 401, text: 'Unauthorized', desc: 'Authentication required' },
    { code: 403, text: 'Forbidden', desc: 'Server refuses to authorize the request' },
    { code: 404, text: 'Not Found', desc: 'Requested resource could not be found' },
    { code: 405, text: 'Method Not Allowed', desc: 'HTTP method not supported for this resource' },
    { code: 408, text: 'Request Timeout', desc: 'Server timed out waiting for the request' },
    { code: 409, text: 'Conflict', desc: 'Request conflicts with current state of the resource' },
    { code: 410, text: 'Gone', desc: 'Resource permanently removed' },
    { code: 413, text: 'Payload Too Large', desc: 'Request entity larger than server will process' },
    { code: 414, text: 'URI Too Long', desc: 'Request URI longer than server will interpret' },
    { code: 415, text: 'Unsupported Media Type', desc: 'Media type not supported' },
    { code: 422, text: 'Unprocessable Entity', desc: 'Request well-formed but semantically incorrect' },
    { code: 429, text: 'Too Many Requests', desc: 'Rate limit exceeded' },
    { code: 500, text: 'Internal Server Error', desc: 'Server encountered an unexpected condition' },
    { code: 501, text: 'Not Implemented', desc: 'Server does not support the request method' },
    { code: 502, text: 'Bad Gateway', desc: 'Invalid response from upstream server' },
    { code: 503, text: 'Service Unavailable', desc: 'Server temporarily unable to handle request' },
    { code: 504, text: 'Gateway Timeout', desc: 'Upstream server did not respond in time' }
  ];

  var filtered = codes;
  if (search) {
    filtered = codes.filter(function (c) {
      return String(c.code).indexOf(search) !== -1 ||
        c.text.toLowerCase().indexOf(search) !== -1 ||
        c.desc.toLowerCase().indexOf(search) !== -1;
    });
  }

  var result = filtered.map(function (c) {
    return c.code + ' ' + c.text + ' — ' + c.desc;
  }).join('\n');

  return { result: result || 'No matching status codes found', count: filtered.length + ' codes found' };
};
