import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

async function getFrameworkContent(): Promise<string> {
  const res = await fetch(
    "https://ivlbjochxaupsblqdwyq.supabase.co/storage/v1/object/public/framework/mothership-full.md",
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error("Failed to fetch framework");
  return res.text();
}

function markdownToHTML(markdown: string): string {
  const lines = markdown.split('\n');
  let html = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      // Don't add extra spacing for empty lines
      continue;
    }

    // H1 - Main parts
    if (trimmed.startsWith('# ')) {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      const title = trimmed.slice(2);
      html += `<h1 class="part-title">${escapeHtml(title)}</h1>\n`;
      continue;
    }

    // H2
    if (trimmed.startsWith('## ')) {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      const title = trimmed.slice(3);
      html += `<h2 class="section-title">${escapeHtml(title)}</h2>\n`;
      continue;
    }

    // H3
    if (trimmed.startsWith('### ')) {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      const title = trimmed.slice(4);
      html += `<h3 class="subsection-title">${escapeHtml(title)}</h3>\n`;
      continue;
    }

    // H4
    if (trimmed.startsWith('#### ')) {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      const title = trimmed.slice(5);
      html += `<h4 class="subsubsection-title">${escapeHtml(title)}</h4>\n`;
      continue;
    }

    // Lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) {
        html += '<ul class="list">\n';
        inList = true;
      }
      const content = trimmed.slice(2);
      html += `<li>${escapeHtml(content)}</li>\n`;
      continue;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) {
        html += '<ol class="list">\n';
        inList = true;
      }
      const content = trimmed.replace(/^\d+\.\s/, '');
      html += `<li>${escapeHtml(content)}</li>\n`;
      continue;
    }

    // Horizontal rule
    if (trimmed === '---') {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      html += '<hr class="divider" />\n';
      continue;
    }

    // Regular paragraph
    if (inList) {
      html += '</ul>\n';
      inList = false;
    }
    html += `<p class="paragraph">${escapeHtml(trimmed)}</p>\n`;
  }

  if (inList) {
    html += '</ul>\n';
  }

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generatePDFFromMarkdown(markdown: string, title: string = "DEMISMATCH") {
  const htmlContent = markdownToHTML(markdown);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      margin: 2.5cm;
      size: A4;
    }
    
    body {
      font-family: system-ui, -apple-system, sans-serif;
      color: #1a1a1a;
      line-height: 1.6;
      font-size: 11pt;
      padding: 0;
      margin: 0;
    }
    
    .part-title {
      font-size: 20pt;
      font-weight: bold;
      margin: 1.5em 0 1em 0;
      page-break-before: always;
    }
    
    .part-title:first-of-type {
      page-break-before: auto;
    }
    
    .section-title {
      font-size: 16pt;
      font-weight: bold;
      margin: 1.2em 0 0.8em 0;
    }
    
    .subsection-title {
      font-size: 13pt;
      font-weight: bold;
      margin: 1em 0 0.6em 0;
    }
    
    .subsubsection-title {
      font-size: 11.5pt;
      font-weight: bold;
      margin: 0.8em 0 0.5em 0;
    }
    
    .paragraph {
      margin: 0.5em 0;
      line-height: 1.6;
    }
    
    .list {
      margin: 0.8em 0;
      padding-left: 1.5em;
    }
    
    .list li {
      margin: 0.4em 0;
      line-height: 1.5;
    }
    
    .divider {
      border: none;
      border-top: 1px solid #ccc;
      margin: 1.5em 0;
    }
    
    a {
      color: #0066cc;
      text-decoration: underline;
    }
    
    strong {
      font-weight: 600;
    }
    
    em {
      font-style: italic;
    }
  </style>
</head>
<body>
  <h1 style="font-size: 24pt; font-weight: bold; margin-bottom: 0.5em;">${escapeHtml(title)}</h1>
  <p style="font-size: 12pt; color: #666; margin-bottom: 2em;">The Framework</p>
  
  ${htmlContent}
</body>
</html>
  `;
}

export async function GET(request: NextRequest) {
  try {
    const frameworkContent = await getFrameworkContent();
    const html = generatePDFFromMarkdown(frameworkContent);


    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      },
      printBackground: true,
      preferCSSPageSize: true
    });

    await browser.close();

    // Convert Buffer to ArrayBuffer for NextResponse
    const pdfArrayBuffer = new Uint8Array(pdfBuffer).buffer;

    // Return PDF
    return new NextResponse(pdfArrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="demismatch-framework.pdf"',
      },
    });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { markdown, title, filename } = await request.json();

    if (!markdown || typeof markdown !== 'string') {
      return NextResponse.json(
        { error: 'Markdown content is required' },
        { status: 400 }
      );
    }

    const html = generatePDFFromMarkdown(markdown, title || "DEMISMATCH");

    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      },
      printBackground: true,
      preferCSSPageSize: true
    });

    await browser.close();

    // Convert Buffer to ArrayBuffer for NextResponse
    const pdfArrayBuffer = new Uint8Array(pdfBuffer).buffer;

    // Return PDF
    return new NextResponse(pdfArrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename || 'demismatch-framework.pdf'}"`,
      },
    });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

