const test = require('node:test');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const path = require('node:path');
const decode = require('decode-uri-component');
const qs = require('query-string');

test('decodes normal URLs', () => {
  assert.equal(decode('Hello%20World'), 'Hello World');
});

test('preserves query-string compatibility', () => {
  assert.equal(qs.parse('name=Brian+May').name, 'Brian May');
  assert.equal(qs.parse('symbol=%E2%9C%93').symbol, '\u2713');
  assert.equal(qs.parse('bad=%C2%zz+value').bad, '\uFFFD%zz value');
});

test('decodes Unicode and handles malformed UTF-8 edge cases', () => {
  assert.equal(decode('%F0%9F%8C%8D'), '\u{1F30D}');
  assert.equal(decode('%E2%28%A1'), '%E2(%A1');
  assert.equal(decode('%ED%A0%80'), '%ED%A0%80');
  assert.equal(decode('%F0%9F'), '%F0%9F');
  assert.equal(decode('%FE%FF'), '\uFFFD\uFFFD');
  assert.equal(decode('%'), '%');
  assert.equal(decode('+'), '+');
});

test('handles malformed encoding', () => {
  assert.equal(decode('%C2%zz'), '\uFFFD%zz');
});

test('processes long malformed input', () => {
  const samples = [
    '%C2'.repeat(1000) + '%zz',
    '%FF'.repeat(1000),
    '%E0%A0'.repeat(1000) + '%GG'
  ];

  for (const sample of samples) {
    assert.equal(typeof decode(sample), 'string');
  }
});

test('handles many distinct malformed percent runs without quadratic slowdown', () => {
  const script = `
    const decode = require('decode-uri-component');
    let payload = '';
    for (let i = 0; i < 32000; i++) {
      const high = Math.floor(i / 256).toString(16).padStart(2, '0');
      const low = (i % 256).toString(16).padStart(2, '0');
      payload += '%' + high + '%' + low + 'x';
    }
    payload += '%zz';
    console.log(decode(payload).length);
  `;
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf8',
    timeout: 5000
  });

  assert.equal(result.error, undefined, result.error ? result.error.message : result.stderr);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^\d+\s*$/);
  assert.ok(Number(result.stdout) > 0);
});
