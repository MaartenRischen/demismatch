import Link from "next/link";
import { Suspense } from "react";

async function getFrameworkContent() {
  const res = await fetch(
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/framework/mothership-full.md",
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
    if (line.startsWith('#### ')) {
      elements.push(<h4 key={key++} className="text-xl text-gray-900 mt-6 mb-2 font-semibold">{line.slice(5)}</h4>);
      continue;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(<li key={key++} className="text-lg text-gray-700 ml-6 mb-2">{line.slice(2)}</li>);
      continue;
    }
    elements.push(<p key={key++} className="text-lg text-gray-700 mb-4 leading-relaxed">{line}</p>);
  }
  return elements;
}

async function FrameworkContent() {
  const content = await getFrameworkContent();
  return <div>{parseMarkdown(content)}</div>;
}

export default function FrameworkPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto border-b border-gray-200">
        <Link href="/" className="text-xl tracking-widest text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
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

      <header className="px-8 py-16 max-w-4xl mx-auto">
        <h1 className="text-5xl text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>The Framework</h1>
        <p className="text-xl text-gray-700 mb-8">
          From Mismatch to Baseline — the complete framework for understanding human suffering and what to do about it.
        </p>
        
        <div className="flex gap-4 mb-12">
          <a
            href="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/framework/mothership-full.md"
            download="demismatch-framework.md"
            className="bg-[#c75b3a] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition inline-flex items-center gap-2"
          >
            Download Framework
          </a>
        </div>

        <img
          src="https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/demismatch-graphics/10_Framework_Map__10_Parts_.png"
          alt="Framework Map - 10 Parts"
          className="rounded-lg w-full"
        />
      </header>

      <article className="px-8 pb-20 max-w-4xl mx-auto">
        <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg" />}>
          <FrameworkContent />
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
