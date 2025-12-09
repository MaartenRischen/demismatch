import Link from "next/link";
import { Suspense } from "react";

// Fetch sources markdown from Supabase
async function getSourcesContent() {
  const res = await fetch(
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/framework/sources.md",
    { next: { revalidate: 3600 } } // Cache for 1 hour
  );
  if (!res.ok) {
    throw new Error("Failed to fetch sources content");
  }
  return res.text();
}

// Simple markdown to HTML converter for sources
function parseMarkdown(markdown: string) {
  const lines = markdown.split('\n');
  const elements: React.ReactElement[] = [];
  let currentIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

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
    // Add the link - CLICKABLE
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800 hover:no-underline"
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

async function SourcesContent() {
  const content = await getSourcesContent();
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

export default function SourcesPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          DEMISMATCH
        </Link>
        <div className="flex gap-8 text-sm text-gray-600">
          <Link href="/framework" className="hover:text-gray-900">Framework</Link>
          <Link href="/builders" className="hover:text-gray-900">For Builders</Link>
          <Link href="/foryou" className="hover:text-gray-900">For You</Link>
          <Link href="/projects" className="hover:text-gray-900">Projects</Link>
          <Link href="/sources" className="text-gray-900 font-medium">Sources</Link>
        </div>
      </nav>

      {/* Header */}
      <header className="px-8 py-12 max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Sources</h1>
        <p className="text-xl text-gray-700 mb-4">
          This framework stands on the shoulders of researchers, clinicians, and thinkers who&apos;ve been mapping the mismatch for decades.
        </p>
        <p className="text-lg text-gray-600">
          Below are the key sources, organized by topic. These aren&apos;t cherry-picked outliers - they represent mainstream findings from evolutionary psychology, anthropology, and neuroscience.
        </p>
      </header>

      {/* Evidence Categories Image */}
      <section className="px-8 py-8 max-w-4xl mx-auto">
        <div className="my-8">
          <img
            src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/12_Evidence_Categories_Diagram.png"
            alt="Evidence Categories"
            className="rounded-lg w-full"
          />
        </div>
      </section>

      {/* Sources Content */}
      <article className="px-8 pb-20 max-w-4xl mx-auto">
        <Suspense fallback={<LoadingState />}>
          <SourcesContent />
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
