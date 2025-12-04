import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Could not fetch URL (${response.status}). The site may be blocking automated requests.` },
        { status: 400 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script and style elements
    $('script, style, nav, header, footer, aside, .ads, .advertisement').remove();

    // Extract text content
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const ogDescription = $('meta[property="og:description"]').attr('content') || '';
    
    // Get main content - try article first, then main, then body
    let mainContent = '';
    const articleContent = $('article').text();
    const mainElement = $('main').text();
    
    if (articleContent.length > 100) {
      mainContent = articleContent;
    } else if (mainElement.length > 100) {
      mainContent = mainElement;
    } else {
      // Get paragraphs from body
      mainContent = $('p').map((_, el) => $(el).text().trim()).get().join(' ');
    }

    // Clean up whitespace
    mainContent = mainContent.replace(/\s+/g, ' ').trim();

    // Combine all text
    const extractedText = [
      title,
      metaDescription || ogDescription,
      mainContent.slice(0, 5000) // Limit content length
    ].filter(Boolean).join('\n\n');

    return NextResponse.json({ 
      text: extractedText,
      title 
    });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape URL' },
      { status: 500 }
    );
  }
}

