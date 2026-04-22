import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('tasks pages keep compact table styling and theme-safe form wrappers', () => {
    const indexSource = readFileSync(new URL('../src/bulma/pages/tasks/Index.vue', import.meta.url), 'utf8');
    const formSource = readFileSync(new URL('../src/bulma/pages/tasks/BaseForm.vue', import.meta.url), 'utf8');

    assert.match(indexSource, /<enso-table class="box p-0"/);
    assert.match(indexSource, /<avatar class="is-24x24 is-clickable"[\s\S]*tooltip/);
    assert.match(indexSource, /<avatar class="is-24x24"[\s\S]*tooltip/);
    assert.doesNotMatch(formSource, /has-background-light raises-on-hover/);
    assert.match(formSource, /background-color: var\(--bulma-scheme-main\);/);
});
