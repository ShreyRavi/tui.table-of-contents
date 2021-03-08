import { ToastMark } from '@toast-ui/toastmark';

function getChildNodes(parent) {
  const nodes = [];
  let curr = parent.firstChild;
  while (curr) {
    nodes.push(curr);
    curr = curr.next;
  }
  return nodes;
}

/**
 * @param md a markdown string
 * @return an array of objects with attributes `name`, `level` corresponding to document headings.
 * provided in order of occurrence in the document
 */
export function searchHeadings(md) {
  const ast = new ToastMark(md);
  const headings = []; // this is mutated
  bfsHeaderAccumulate(ast.getRootNode(), headings);
  return headings;
}

/**
 * accumulate headings within an AST into an array. if `node` is a heading itself, with children, those children are accumulated to a
 * single string. the input `headings` array is mutated
 */
function bfsHeaderAccumulate(node, headings) {
  if (node.type === 'heading') {
    const level = node.level;
    const strHeader = stringContentAccumulate(node);
    headings.push({ name: strHeader, level });
  } else {
    getChildNodes(node).forEach((c) => bfsHeaderAccumulate(c, headings));
  }
}

/**
 * recurse an AST subtree for terminal nodes of text type and combine their `literal`s to a single piece of text
 * if subtree is devoid of text, returns an empty string.
 * @param node the root of the subtree to be searched (inclusive)
 * @return string of combined text
 */
function stringContentAccumulate(node) {
  const children = getChildNodes(node);
  if (!children.length) {
    // i'm not totally confident about how the AST is constructed.
    // it may not always be the case that terminal nodes are text type, so we play it defensively.
    return node.type === 'text' ? node.literal : '';
  } else {
    // i am making the assumption that non-terminal nodes will never have content to display in the heading
    const substrings = children.map((c) => stringContentAccumulate(c));
    return substrings.join('');
  }
}