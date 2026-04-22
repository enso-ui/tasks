import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('tasks flags clear action does not force black text', () => {
    const source = readFileSync(new URL('../src/bulma/pages/tasks/components/Flags.vue', import.meta.url), 'utf8');

    assert.doesNotMatch(source, /has-text-black/);
    assert.match(source, /<span class="icon">/);
});
