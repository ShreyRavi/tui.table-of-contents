import { searchHeadings } from '../search';

describe('header search', () => {
  it('on empty string', () => {
    expect(searchHeadings('')).toStrictEqual([]);
  });

  it('simple text', () => {
    expect(searchHeadings('just a sentence.')).toStrictEqual([]);
  });

  it('text with inlined elements', () => {
    expect(searchHeadings('just an *important sentence*.')).toStrictEqual([]);
  });

  it('a single plain text header', () => {
    expect(searchHeadings('# hell world')).toStrictEqual([ { name: 'hell world', level: 1 } ]);
  });

  it('a single header with inline modifiers', () => {
    expect(searchHeadings('# hell world *of fire*')).toStrictEqual([ { name: 'hell world of fire', level: 1 } ]);
  });

  it('a single level 2 header', () => {
    expect(searchHeadings('## hello world')).toStrictEqual([ { name: 'hello world', level: 2 } ]);
  });

  it('multiple headers', () => {
    expect(searchHeadings('# hello\n # world')).toStrictEqual([
      { name: 'hello', level: 1 },
      { name: 'world', level: 1 },
    ]);
  });

  it('multiple nested headers', () => {
    expect(searchHeadings('# hello \n ## world \n ### of\n ## fire ')).toStrictEqual([
      { name: 'hello', level: 1 },
      { name: 'world', level: 2 },
      { name: 'of', level: 3 },
      { name: 'fire', level: 2 },
    ]);
  });

  it('multiple nested headers with filler', () => {
    expect(searchHeadings('# hello \n from your friend karl,\n ## world \n wide web.\n ### of\n course [this](https://github.com/holub008/tui.tableofcontents) code is on\n ## *fire*, this\n - code\n - is\n - on\n - fire')).toStrictEqual([
      { name: 'hello', level: 1 },
      { name: 'world', level: 2 },
      { name: 'of', level: 3 },
      { name: 'fire, this', level: 2 },
    ]);
  });
})