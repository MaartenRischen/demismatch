import Link from "next/link";
import { Suspense } from "react";

// Fetch markdown from Supabase
async function getFrameworkContent() {
  const res = await fetch(
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/framework/mothership-full.md",
    { next: { revalidate: 3600 } } // Cache for 1 hour
  );
  if (!res.ok) {
    throw new Error("Failed to fetch framework content");
  }
  return res.text();
}

// Simple markdown to HTML converter for basic formatting
function parseMarkdown(markdown: string) {
  // Split into lines for processing
  const lines = markdown.split('\n');
  const elements: React.ReactElement[] = [];
  let currentIndex = 0;
  let inCodeBlock = false;
  let codeContent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={currentIndex++} className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm">
            <code>{codeContent}</code>
          </pre>
        );
        codeContent = '';
      }
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + '\n';
      continue;
    }

    // Skip empty lines
    if (line.trim() === '') {
      continue;
    }

    // Horizontal rule
    if (line.trim() === '---') {
      elements.push(<hr key={currentIndex++} className="my-12 border-gray-200" />);
      continue;
    }

    // H1
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={currentIndex++} className="text-4xl font-bold text-gray-900 mt-16 mb-6">
          {line.slice(2)}
        </h1>
      );
      continue;
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={currentIndex++} className="text-3xl font-bold text-gray-900 mt-12 mb-4">
          {line.slice(3)}
        </h2>
      );
      continue;
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={currentIndex++} className="text-2xl font-semibold text-gray-900 mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
      continue;
    }

    // H4
    if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={currentIndex++} className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          {line.slice(5)}
        </h4>
      );
      continue;
    }

    // Bullet points
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={currentIndex++} className="text-lg text-gray-700 ml-6 mb-2">
          {formatInlineText(line.slice(2))}
        </li>
      );
      continue;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(line)) {
      const content = line.replace(/^\d+\.\s/, '');
      elements.push(
        <li key={currentIndex++} className="text-lg text-gray-700 ml-6 mb-2 list-decimal">
          {formatInlineText(content)}
        </li>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={currentIndex++} className="text-lg text-gray-700 mb-4 leading-relaxed">
        {formatInlineText(line)}
      </p>
    );
  }

  return elements;
}

// Handle inline formatting (bold, italic, links)
function formatInlineText(text: string): React.ReactNode {
  // First handle links [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(formatBoldItalic(text.slice(lastIndex, match.index), lastIndex));
    }
    // Add the link
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-900 underline hover:no-underline"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(formatBoldItalic(text.slice(lastIndex), lastIndex));
  }

  return parts.length > 0 ? parts : formatBoldItalic(text, 0);
}

function formatBoldItalic(text: string, keyOffset: number): React.ReactNode {
  // Handle bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={keyOffset + index} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Handle italic *text*
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return <em key={keyOffset + index}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

async function FrameworkContent() {
  const content = await getFrameworkContent();
  const parsedContent = parseMarkdown(content);

  return <div className="prose-custom">{parsedContent}</div>;
}

function LoadingState() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}

export default function FrameworkPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          DEMISMATCH
        </Link>
        <div className="flex gap-8 text-sm text-gray-600">
          <Link href="/framework" className="text-gray-900 font-medium">Framework</Link>
          <Link href="/builders" className="hover:text-gray-900">For Builders</Link>
          <Link href="/foryou" className="hover:text-gray-900">For You</Link>
          <Link href="/projects" className="hover:text-gray-900">Projects</Link>
          <Link href="/sources" className="hover:text-gray-900">Sources</Link>
        </div>
      </nav>

      {/* Header */}
      <header className="px-8 py-12 max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">The Framework</h1>
        <p className="text-xl text-gray-700 mb-8">
          From Mismatch to Baseline — the complete framework for understanding human suffering and what to do about it.
        </p>

        {/* Download Button */}
        <div className="flex gap-4 mb-12">
          <a
            href="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/framework/mothership-full.md"
            download="demismatch-framework.md"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Markdown
          </a>
        </div>

        {/* Framework Map Image */}
        <div className="mb-12">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/10_Framework_Map__10_Parts_.png"
            alt="Framework Map - 10 Parts"
            className="rounded-lg w-full"
          />
        </div>
      </header>

      {/* Framework Content */}
      <article className="px-8 pb-20 max-w-4xl mx-auto">
        <Suspense fallback={<LoadingState />}>
          <FrameworkContent />
        </Suspense>
      </article>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-gray-200 max-w-4xl mx-auto">
        <div className="flex gap-8 text-sm text-gray-600 mb-6">
          <Link href="/framework" className="hover:text-gray-900">Framework</Link>
          <Link href="/builders" className="hover:text-gray-900">For Builders</Link>
          <Link href="/foryou" className="hover:text-gray-900">For You</Link>
          <Link href="/projects" className="hover:text-gray-900">Projects</Link>
          <Link href="/sources" className="hover:text-gray-900">Sources</Link>
        </div>
        <p className="text-sm text-gray-500">
          This framework is open. Fork it, improve it, implement it.
        </p>
      </footer>
    </main>
  );
}
