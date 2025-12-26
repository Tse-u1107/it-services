import parse, { type DOMNode, Element as DomElement } from 'html-react-parser';

export interface HeadingNode {
  level: number;
  text: string;
  id?: string;
  children: HeadingNode[];
}

/**
 * Extracts text content from a DOM node recursively
 */
function extractTextContent(node: DOMNode): string {
  if ('data' in node && typeof node.data === 'string') {
    return node.data;
  }
  
  if (node instanceof DomElement && node.children) {
    return node.children.map(extractTextContent).join('');
  }
  
  return '';
}

/**
 * Extracts headings from HTML and builds a nested hierarchy
 * @param html - The HTML string to parse
 * @returns Array of top-level heading nodes (h1s) with nested children
 */
export function extractHeadingHierarchy(html: string): HeadingNode[] {
  const headings: Array<{ level: number; text: string; id?: string }> = [];
  
  // Parse HTML and extract all heading elements
  parse(html, {
    replace: (node) => {
      if (node instanceof DomElement) {
        const match = node.name.match(/^h([1-6])$/);
        if (match) {
          const level = parseInt(match[1], 10);
          const text = extractTextContent(node).trim();
          const id = node.attribs?.id;
          
          // Only add non-empty headings
          if (text) {
            headings.push({ level, text, id });
          }
        }
      }
      return undefined;
    },
  });

  // Build the nested structure
  const root: HeadingNode[] = [];
  const stack: HeadingNode[] = [];

  for (const heading of headings) {
    const node: HeadingNode = {
      level: heading.level,
      text: heading.text,
      id: heading.id,
      children: [],
    };

    // Find the correct parent for this heading
    // Pop from stack until we find a heading with a lower level (higher in hierarchy)
    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }

    // If stack is empty, this is a top-level heading (h1)
    if (stack.length === 0) {
      root.push(node);
    } else {
      // Add as child of the last item in stack
      stack[stack.length - 1].children.push(node);
    }

    // Push current node to stack
    stack.push(node);
  }

  return root;
}

/**
 * Prints the heading hierarchy in a readable format
 */
export function printHeadingHierarchy(nodes: HeadingNode[], indent = ''): string {
  let output = '';
  
  for (const node of nodes) {
    output += `${indent}h${node.level}: ${node.text}\n`;
    if (node.children.length > 0) {
      output += printHeadingHierarchy(node.children, indent + '  ');
    }
  }
  
  return output;
}

/**
 * Converts the heading hierarchy to a table of contents structure
 * suitable for rendering in the UI
 */
export function headingsToTableOfContents(nodes: HeadingNode[]): React.ReactNode {
  if (nodes.length === 0) return null;
  
  return (
    <ul className="space-y-1">
      {nodes.map((node, index) => (
        <li key={index}>
          <a
            href={node.id ? `#${node.id}` : undefined}
            className="text-sm hover:text-nyu-700 transition-colors block"
            style={{ paddingLeft: `${(node.level - 1) * 12}px` }}
          >
            {node.text}
          </a>
          {node.children.length > 0 && headingsToTableOfContents(node.children)}
        </li>
      ))}
    </ul>
  );
}

// Example usage:
// const hierarchy = extractHeadingHierarchy(contentData);
// console.log(printHeadingHierarchy(hierarchy));
// Or render as table of contents:
// const tocComponent = headingsToTableOfContents(hierarchy);