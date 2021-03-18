import { searchHeadings } from '../search';
import assert from 'assert';

describe('header search', () => {
  it('on empty string', () => {
    assert.deepStrictEqual(searchHeadings(''), []);
  });

  it('simple text', () => {
    assert.deepStrictEqual(searchHeadings('just a sentence.'), []);
  });

  it('text with inlined elements', () => {
    assert.deepStrictEqual(searchHeadings('just an *important sentence*.'), []);
  });

  it('a single plain text header', () => {
    assert.deepStrictEqual(searchHeadings('# hell world'), [ { name: 'hell world', level: 1 } ]);
  });

  it('a single header with inline modifiers', () => {
    assert.deepStrictEqual(searchHeadings('# hell world *of fire*'), [ { name: 'hell world of fire', level: 1 } ]);
  });

  it('a single level 2 header', () => {
    assert.deepStrictEqual(searchHeadings('## hello world'), [ { name: 'hello world', level: 2 } ]);
  });

  it('multiple headers', () => {
    assert.deepStrictEqual(searchHeadings('# hello\n # world'), [
      { name: 'hello', level: 1 },
      { name: 'world', level: 1 },
    ]);
  });

  it('multiple nested headers', () => {
    assert.deepStrictEqual(searchHeadings('# hello \n ## world \n ### of\n ## fire '), [
      { name: 'hello', level: 1 },
      { name: 'world', level: 2 },
      { name: 'of', level: 3 },
      { name: 'fire', level: 2 },
    ]);
  });

  it('multiple nested headers with filler', () => {
    assert.deepStrictEqual(searchHeadings('# hello \n from your friend karl,\n ## world \n wide web.\n ### of\n course [this](https://github.com/holub008/tui.tableofcontents) code is on\n ## *fire*, this\n - code\n - is\n - on\n - fire'),
      [
        { name: 'hello', level: 1 },
        { name: 'world', level: 2 },
        { name: 'of', level: 3 },
        { name: 'fire, this', level: 2 },
      ]);
  });
})