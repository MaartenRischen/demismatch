import Link from "next/link";
import { Suspense } from "react";

async function getSourcesContent() {
  const res = await fetch(
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/framework/sources.md",
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.text();
}

function parseMarkdown(markdown: string) {
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.trim() === '') continue;
    if (line.trim() === '---') {
      elements.push(<hr key={key++} className="my-12 border-gray-200" />);
      continue;
    }
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} className="text-4xl text-gray-900 mt-16 mb-6" style={{ fontFamily: 'Georgia, serif' }}>{line.slice(2)}</h1>);
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-3xl text-gray-900 mt-12 mb-4" style={{ fontFamily: 'Georgia, serif' }}>{line.slice(3)}</h2>);
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-2xl text-gray-900 mt-8 mb-3" style={{ fontFamily: 'Georgia, serif' }}>{line.slice(4)}</h3>);
      continue;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const content = line.slice(2);
      const linkMatch = content.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const beforeLink = content.slice(0, linkMatch.index);
        const afterLink = content.slice((linkMatch.index || 0) + linkMatch[0].length);
        elements.push(
          <li key={key++} className="text-lg text-gray-700 ml-6 mb-2">
            {beforeLink}
            <a href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-[#c75b3a] hover:underline">
              {linkMatch[1]}
            </a>
            {afterLink}
          </li>
        );
      } else {
        elements.push(<li key={key++} className="text-lg text-gray-700 ml-6 mb-2">{content}</li>);
      }
      continue;
    }
    const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      elements.push(
        <p key={key++} className="text-lg text-gray-700 mb-4 leading-relaxed">
          {line.slice(0, linkMatch.index)}
          <a href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-[#c75b3a] hover:underline">
            {linkMatch[1]}
          </a>
          {line.slice((linkMatch.index || 0) + linkMatch[0].length)}
        </p>
      );
    } else {
      elements.push(<p key={key++} className="text-lg text-gray-700 mb-4 leading-relaxed">{line}</p>);
    }
  }
  return elements;
}

async function SourcesContent() {
  const content = await getSourcesContent();
  return <div>{parseMarkdown(content)}</div>;
}

export default function SourcesPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto border-b border-gray-200">
        <Link href="/" className="text-xl tracking-widest text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
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

      <header className="px-8 py-16 max-w-4xl mx-auto">
        <h1 className="text-5xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Sources</h1>
        <p className="text-xl text-gray-700 mb-8">
          The evidence behind the framework. Every claim is grounded in research from evolutionary psychology, anthropology, neuroscience, and related fields.
        </p>

        <img
          src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/12_Evidence_Categories_Diagram.png"
          alt="Evidence categories"
          className="rounded-lg w-full mb-8"
        />

        <a
          href="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/framework/sources.md"
          download="demismatch-sources.md"
          className="bg-[#c75b3a] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition inline-flex items-center gap-2"
        >
          Download Sources
        </a>
      </header>

      <article className="px-8 pb-20 max-w-4xl mx-auto">
        <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg" />}>
          <SourcesContent />
        </Suspense>
      </article>

      <footer className="px-8 py-12 border-t border-gray-200 max-w-6xl mx-auto">
        <div className="flex gap-8 text-sm text-gray-600 mb-6">
          <Link href="/framework" className="hover:text-gray-900">Framework</Link>
          <Link href="/builders" className="hover:text-gray-900">For Builders</Link>
          <Link href="/foryou" className="hover:text-gray-900">For You</Link>
          <Link href="/projects" className="hover:text-gray-900">Projects</Link>
          <Link href="/sources" className="hover:text-gray-900">Sources</Link>
        </div>
        <p className="text-sm text-gray-500">This framework is open. Fork it, improve it, implement it.</p>
      </footer>
    </main>
  );
}
