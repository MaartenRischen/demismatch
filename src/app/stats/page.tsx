"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";

// Chart data from JSON - with clickable source URLs and context
const CHART_DATA = {
  heroStats: [
    {
      id: "hero-obesity",
      displayValue: "1B+",
      label: "People with Obesity",
      source: "WHO/NCD-RisC 2024",
      sourceUrl: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight",
      context: "Up from 105M in 1975—a 10x increase in one generation"
    },
    {
      id: "hero-lonely",
      displayValue: "52M",
      label: "Lonely Americans Daily",
      source: "Gallup 2024",
      sourceUrl: "https://news.gallup.com/poll/505745/loneliness-rates-highest-among-young-adults.aspx",
      context: "That's 1 in 5 adults experiencing loneliness every single day"
    },
    {
      id: "hero-screentime",
      displayValue: "7hrs",
      label: "Avg Daily Screen Time",
      source: "DataReportal 2024",
      sourceUrl: "https://datareportal.com/reports/digital-2024-global-overview-report",
      context: "More time than we spend sleeping, eating, or with family combined"
    },
  ],
  loneliness: {
    byAge: [
      { label: "18-34", value: 30, highlight: true },
      { label: "30-44", value: 29 },
      { label: "45-64", value: 21 },
      { label: "65+", value: 17 },
    ],
    causes: [
      { label: "Technology", value: 73 },
      { label: "Families not together", value: 66 },
      { label: "Overworked/exhausted", value: 62 },
      { label: "Mental health issues", value: 60 },
      { label: "Too individualistic", value: 58 },
    ],
    prevalence: [
      { label: "Daily Loneliness (US)", value: "52M", subtext: "~20% of adults" },
      { label: "Weekly Loneliness", value: "30%", subtext: "At least once per week" },
      { label: "Global Impact", value: "1 in 6", subtext: "People worldwide affected" },
      { label: "Annual Deaths Linked", value: "871K", subtext: "~100 deaths per hour" },
    ],
  },
  friendship: {
    collapse: [
      { metric: "No close friends", year1990: 3, year2024: 17, change: "+467%" },
      { metric: "10+ close friends", year1990: 33, year2024: 13, change: "-61%" },
      { metric: "Has a best friend", year1990: 75, year2024: 59, change: "-21%" },
    ],
  },
  mentalHealth: {
    anxietyDepression: [
      { condition: "Anxiety", year2019: 15.6, year2022: 18.2, change: "+17%" },
      { condition: "Depression", year2019: 18.5, year2022: 21.4, change: "+16%" },
    ],
    anxietyByAge: [
      { label: "18-29", value: 26.6, highlight: true },
      { label: "30-44", value: 21.0 },
      { label: "45-64", value: 15.9 },
      { label: "65+", value: 11.2 },
    ],
    risingAnxiety: [
      { year: "2022", value: 32 },
      { year: "2023", value: 37 },
      { year: "2024", value: 43 },
    ],
    youthCrisis: [
      { label: "Teens with anxiety disorders", value: "31.9%" },
      { label: "Depression diagnosis increase (5-22)", value: "+60%", subtext: "2017-2021" },
      { label: "Global youth anxiety increase (10-24)", value: "+52%", subtext: "1990-2021" },
      { label: "High schoolers considering suicide", value: "1 in 5", subtext: "20% in 2023" },
    ],
  },
  obesity: {
    trend: [
      { year: "1975", value: 105, label: "~105M" },
      { year: "1990", value: 200, label: "~200M" },
      { year: "2000", value: 300, label: "~300M" },
      { year: "2010", value: 500, label: "~500M" },
      { year: "2020", value: 810, label: "810M" },
      { year: "2022", value: 890, label: "890M" },
      { year: "2035", value: 1530, label: "1.53B", projected: true },
    ],
    usRate: [
      { period: "1999-2000", value: 30.5 },
      { period: "2017-2018", value: 42.4 },
    ],
  },
  screenTime: {
    byGeneration: [
      { label: "Gen Z", value: 9.0, highlight: true },
      { label: "Millennials", value: 7.0 },
      { label: "Gen X", value: 6.0 },
      { label: "Boomers", value: 5.0 },
    ],
    teenStats: [
      { label: "Teens (13-18) daily", value: "8h 39m" },
      { label: "Teens with 8+ hours daily", value: "41%" },
      { label: "Tweens (8-12) daily", value: "5h 33m" },
    ],
  },
  nature: {
    timeOutdoors: [
      { label: "≤5 hours/week", value: 60, color: "crisis" },
      { label: "5-10 hours/week", value: 20, color: "warning" },
      { label: "10+ hours/week", value: 20, color: "good" },
    ],
  },
  sleep: {
    decline: { before: 7.9, after: 6.8, lostTime: "1+ hour per night" },
    currentStats: [
      { label: "Adults not getting 7+ hours", value: "1 in 3", subtext: "36.1%" },
      { label: "Young adults (18-29) getting ≤6 hrs", value: "46%" },
      { label: "High schoolers sleep deprived", value: "77%", subtext: "Not getting 8+ hours" },
      { label: "Americans with sleep disorders", value: "50-70M" },
    ],
  },
  ancestralVsModern: [
    { category: "Light", ancestral: "Natural daylight cycles", modern: "Artificial light + blue light until midnight" },
    { category: "Movement", ancestral: "Constant physical activity", modern: "Sedentary desk work" },
    { category: "Sleep", ancestral: "Aligned with sunset/sunrise", modern: "Irregular, blue-light disrupted" },
    { category: "Social", ancestral: "Tight tribe of 50-150 people", modern: "Isolated in anonymous cities" },
    { category: "Connection", ancestral: "Face-to-face interaction", modern: "Digital/asynchronous" },
    { category: "Food", ancestral: "Whole, seasonal foods", modern: "Ultra-processed products" },
    { category: "Purpose", ancestral: "Tied to survival & tribe", modern: "Abstract/detached" },
    { category: "Feedback", ancestral: "Immediate, tangible", modern: "Infinite scroll, no completion" },
  ],
};

// Framework analysis for each stat section
const FRAMEWORK_ANALYSIS = {
  loneliness: {
    whatIsHappening: "52 million Americans experience loneliness daily. The rate is highest among young adults (18-34) at 30%, despite having the most digital 'connections' in history.",
    whatIsMissing: "Face-to-face interaction with a stable tribe. Humans evolved in groups of 50-150 people who saw each other daily. Modern life replaces this with anonymous cities, remote work, and digital substitutes.",
    howToSolve: "Rebuild physical community structures. Cohousing, third places, walkable neighborhoods. Replace screen time with in-person rituals. Normalize regular gatherings as essential infrastructure, not optional social events.",
    keyMismatch: "Social Disconnection",
  },
  friendship: {
    whatIsHappening: "The number of Americans with no close friends increased 467% since 1990. Those with 10+ close friends dropped 61%. Youth social interaction has declined 70% over 20 years.",
    whatIsMissing: "Regular, unstructured time with consistent people. Friendship requires repeated, unplanned interaction—exactly what modern life optimizes away through scheduling, commuting, and screen-based entertainment.",
    howToSolve: "Design environments that force repeated exposure: neighborhood amenities, shared workspaces, regular community meals. Make friendship formation automatic rather than requiring active scheduling.",
    keyMismatch: "Community Collapse",
  },
  mentalHealth: {
    whatIsHappening: "Anxiety increased 17% and depression 16% from 2019-2022. 43% of adults feel more anxious than last year. 1 in 5 high schoolers have considered suicide.",
    whatIsMissing: "Purpose, autonomy, and environmental stability. The brain requires predictable challenges with clear outcomes. Modern life offers infinite uncertainty, abstract work, and comparison to curated online personas.",
    howToSolve: "Restore tangible work with visible outcomes. Limit exposure to algorithmic feeds. Rebuild stable social environments. Address root environmental causes rather than medicating symptoms.",
    keyMismatch: "Purpose Deprivation + Attention Hijacking",
  },
  obesity: {
    whatIsHappening: "Global obesity rose from 105M (1975) to 890M (2022), heading toward 1.53B by 2035. US adult obesity went from 30.5% to 42.4%. Childhood obesity increased 10x.",
    whatIsMissing: "Movement as transportation and work. Whole foods requiring preparation. Natural hunger/satiety signals uncorrupted by engineered hyperpalatability.",
    howToSolve: "Redesign cities for walking. Remove ultra-processed foods from default availability. Make movement unavoidable through environmental design rather than requiring willpower.",
    keyMismatch: "Movement Deprivation + Nutritional Mismatch",
  },
  screenTime: {
    whatIsHappening: "Gen Z averages 9 hours of screen time daily. Teens spend 8+ hours on screens, 41% exceed this. 49% of people feel addicted to their phones.",
    whatIsMissing: "Attention sovereignty. The brain evolved for finite information environments with natural completion points. Infinite scroll exploits dopamine systems designed for scarcity.",
    howToSolve: "Treat attention as the scarce resource it is. Design technology with natural stopping points. Replace algorithmic feeds with curated, finite content. Restore boredom as creative space.",
    keyMismatch: "Attention Hijacking",
  },
  nature: {
    whatIsHappening: "60% of adults spend ≤5 hours per week in nature. Children spend 3x more time on screens than playing outside. 99.9% of human evolution occurred in natural environments.",
    whatIsMissing: "Daily exposure to natural light, green spaces, natural sounds, and variable temperatures. The nervous system requires natural input for proper regulation.",
    howToSolve: "Biophilic design in homes and offices. Daily outdoor requirements. Forest schools. Urban greening. Make nature contact automatic through environmental design.",
    keyMismatch: "Nature Severance",
  },
  sleep: {
    whatIsHappening: "Average sleep dropped from 7.9 hours (1942) to 6.8 hours (2013). 77% of high schoolers are sleep deprived. 50-70 million Americans have sleep disorders.",
    whatIsMissing: "Natural light/dark cycles. The circadian system requires bright light in morning and darkness at night. Artificial light, especially blue light from screens, suppresses melatonin.",
    howToSolve: "Morning sunlight exposure. Screen curfews. Dim, warm lighting after sunset. Temperature variation. Consistent sleep schedules aligned with natural rhythms.",
    keyMismatch: "Circadian Disruption",
  },
};

// Horizontal bar chart component
function HorizontalBarChart({
  data,
  title,
  subtitle,
  source,
  sourceUrl,
  unit = "%",
  maxValue
}: {
  data: { label: string; value: number; highlight?: boolean }[];
  title: string;
  subtitle?: string;
  source: string;
  sourceUrl?: string;
  unit?: string;
  maxValue?: number;
}) {
  const max = maxValue || Math.max(...data.map(d => d.value)) * 1.1;

  return (
    <div className="bg-[#111] rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      {subtitle && <p className="text-gray-400 text-sm mb-4">{subtitle}</p>}
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-1">
              <span className={item.highlight ? "text-[#ff6b35] font-medium" : "text-gray-300"}>{item.label}</span>
              <span className={item.highlight ? "text-[#ff6b35] font-bold" : "text-white font-medium"}>{item.value}{unit}</span>
            </div>
            <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${item.highlight ? 'bg-gradient-to-r from-[#ff3333] to-[#ff6b35]' : 'bg-gradient-to-r from-gray-600 to-gray-500'}`}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {sourceUrl ? (
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 text-xs mt-4 block hover:text-[#ff6b35] transition-colors">
          Source: {source} →
        </a>
      ) : (
        <p className="text-gray-500 text-xs mt-4">Source: {source}</p>
      )}
    </div>
  );
}

// Stat cards component
function StatCards({
  data,
  title
}: {
  data: { label: string; value: string; subtext?: string }[];
  title: string;
}) {
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {data.map((item, idx) => (
          <div key={idx} className="bg-[#111] rounded-xl p-4 border border-gray-800">
            <p className="text-3xl font-bold text-[#ff6b35]">{item.value}</p>
            <p className="text-gray-300 text-sm mt-1">{item.label}</p>
            {item.subtext && <p className="text-gray-500 text-xs mt-1">{item.subtext}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Comparison chart (1990 vs 2024 style)
function ComparisonChart({
  data,
  title,
  source,
  sourceUrl
}: {
  data: { metric: string; year1990: number; year2024: number; change: string }[];
  title: string;
  source: string;
  sourceUrl?: string;
}) {
  return (
    <div className="bg-[#111] rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="space-y-6">
        {data.map((item, idx) => (
          <div key={idx}>
            <p className="text-gray-300 text-sm mb-2">{item.metric}</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">1990</span>
                  <span className="text-gray-400">{item.year1990}%</span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-600 rounded-full" style={{ width: `${item.year1990}%` }} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">2024</span>
                  <span className="text-[#ff6b35]">{item.year2024}%</span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#ff3333] to-[#ff6b35] rounded-full" style={{ width: `${item.year2024}%` }} />
                </div>
              </div>
              <span className={`text-sm font-bold ${item.change.startsWith('+') ? 'text-red-500' : 'text-green-500'}`}>
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
      {sourceUrl ? (
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 text-xs mt-4 block hover:text-[#ff6b35] transition-colors">
          Source: {source} →
        </a>
      ) : (
        <p className="text-gray-500 text-xs mt-4">Source: {source}</p>
      )}
    </div>
  );
}

// Framework analysis card
function FrameworkAnalysis({
  analysis
}: {
  analysis: { whatIsHappening: string; whatIsMissing: string; howToSolve: string; keyMismatch: string };
}) {
  return (
    <div className="bg-[#0a0a0a] border border-[#ff6b35]/30 rounded-xl p-6 mt-6">
      <h4 className="text-[#ff6b35] font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Framework Analysis
      </h4>

      <div className="space-y-4">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">What is actually happening?</p>
          <p className="text-gray-300 text-sm">{analysis.whatIsHappening}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">What is missing?</p>
          <p className="text-gray-300 text-sm">{analysis.whatIsMissing}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">How could this be solved?</p>
          <p className="text-gray-300 text-sm">{analysis.howToSolve}</p>
        </div>
        <div className="pt-2 border-t border-gray-800">
          <span className="text-xs text-gray-500">Key Mismatch: </span>
          <span className="text-[#ff6b35] text-sm font-medium">{analysis.keyMismatch}</span>
        </div>
      </div>
    </div>
  );
}

// Big number stat
function BigNumber({ value, label, source, sourceUrl }: { value: string; label: string; source?: string; sourceUrl?: string }) {
  return (
    <div className="bg-[#111] rounded-xl p-6 text-center">
      <p className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#ff3333] via-[#ff6b35] to-[#ffc107] bg-clip-text text-transparent">
        {value}
      </p>
      <p className="text-gray-300 mt-2">{label}</p>
      {source && (sourceUrl ? (
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 text-xs mt-2 inline-block hover:text-[#ff6b35] transition-colors">
          Source: {source} →
        </a>
      ) : (
        <p className="text-gray-500 text-xs mt-2">Source: {source}</p>
      ))}
    </div>
  );
}

// Ancestral vs Modern table
function AncestralModernTable({ data }: { data: { category: string; ancestral: string; modern: string }[] }) {
  return (
    <div className="bg-[#111] rounded-xl overflow-hidden">
      <div className="grid grid-cols-3 bg-[#1a1a1a] text-sm font-medium">
        <div className="p-4 text-gray-400">Domain</div>
        <div className="p-4 text-green-500">Ancestral</div>
        <div className="p-4 text-red-500">Modern</div>
      </div>
      {data.map((row, idx) => (
        <div key={idx} className="grid grid-cols-3 text-sm border-t border-gray-800">
          <div className="p-4 text-gray-300 font-medium">{row.category}</div>
          <div className="p-4 text-gray-400">{row.ancestral}</div>
          <div className="p-4 text-gray-400">{row.modern}</div>
        </div>
      ))}
    </div>
  );
}

export default function StatsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      <Navigation />

      {/* Hero */}
      <header className="pt-12 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#ff6b35] font-medium mb-4 tracking-wide uppercase text-sm">The Evidence</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            THE WHY
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Stone Age Brains in Space Age Environments
          </p>

          {/* Hero Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            {CHART_DATA.heroStats.map(stat => (
              <div key={stat.id} className="bg-[#111] rounded-xl p-6 border border-gray-800">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#ff3333] to-[#ff6b35] bg-clip-text text-transparent">
                  {stat.displayValue}
                </p>
                <p className="text-gray-300 mt-2">{stat.label}</p>
                <p className="text-gray-400 text-sm mt-2 italic">{stat.context}</p>
                <a
                  href={stat.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 text-xs mt-2 inline-block hover:text-[#ff6b35] transition-colors"
                >
                  Source: {stat.source} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Section 1: Loneliness */}
      <section className="px-6 py-16 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">The Loneliness Epidemic</h2>
          <p className="text-gray-400 mb-8">Despite being more "connected" than ever</p>

          <div className="grid md:grid-cols-2 gap-6">
            <HorizontalBarChart
              data={CHART_DATA.loneliness.byAge}
              title="Loneliness by Age Group"
              subtitle="% reporting frequent loneliness"
              source="APA/Harvard MCC 2024"
              sourceUrl="https://www.apa.org/news/podcasts/speaking-of-psychology/loneliness-epidemic"
            />
            <HorizontalBarChart
              data={CHART_DATA.loneliness.causes}
              title="What Americans Blame"
              subtitle="% selecting each factor"
              source="Harvard MCC 2024"
              sourceUrl="https://mcc.gse.harvard.edu/reports/loneliness-in-america"
            />
          </div>

          <div className="mt-6">
            <StatCards data={CHART_DATA.loneliness.prevalence} title="The Scale of the Crisis" />
          </div>

          {/* Cigarette comparison */}
          <div className="mt-6 bg-[#111] rounded-xl p-6 flex items-center gap-6">
            <div className="text-5xl">🚬</div>
            <div>
              <p className="text-xl font-bold text-[#ff6b35]">Health Impact of Chronic Loneliness</p>
              <p className="text-gray-300">Equivalent to smoking 15 cigarettes per day</p>
              <a
                href="https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1000316"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 text-xs mt-1 inline-block hover:text-[#ff6b35] transition-colors"
              >
                Source: Holt-Lunstad et al. 2010, PLOS Medicine →
              </a>
            </div>
          </div>

          <FrameworkAnalysis analysis={FRAMEWORK_ANALYSIS.loneliness} />
        </div>
      </section>

      {/* Section 2: Friendship Recession */}
      <section className="px-6 py-16 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">The Friendship Collapse</h2>
          <p className="text-gray-400 mb-8">The infrastructure of human connection is crumbling</p>

          <ComparisonChart
            data={CHART_DATA.friendship.collapse}
            title="1990 vs 2024"
            source="American Perspectives Survey / AEI"
            sourceUrl="https://www.americansurveycenter.org/research/the-state-of-american-friendship-change-challenges-and-loss/"
          />

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <BigNumber
              value="70%"
              label="Reduction in youth social interaction over 20 years"
              source="U.S. Surgeon General"
              sourceUrl="https://www.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf"
            />
            <BigNumber
              value="28%"
              label="of men under 30 have NO close social connections"
              source="Survey Center on American Life 2022"
              sourceUrl="https://www.americansurveycenter.org/research/the-state-of-american-friendship-change-challenges-and-loss/"
            />
          </div>

          <FrameworkAnalysis analysis={FRAMEWORK_ANALYSIS.friendship} />
        </div>
      </section>

      {/* Section 3: Mental Health */}
      <section className="px-6 py-16 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Mental Health Crisis</h2>
          <p className="text-gray-400 mb-8">The symptoms of environmental mismatch</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#111] rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Anxiety & Depression Rising</h3>
              {CHART_DATA.mentalHealth.anxietyDepression.map((item, idx) => (
                <div key={idx} className="mb-4">
                  <p className="text-gray-300 text-sm mb-2">{item.condition}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">2019</span>
                        <span className="text-gray-400">{item.year2019}%</span>
                      </div>
                      <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-600 rounded-full" style={{ width: `${item.year2019 * 2}%` }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">2022</span>
                        <span className="text-[#ff6b35]">{item.year2022}%</span>
                      </div>
                      <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#ff3333] to-[#ff6b35] rounded-full" style={{ width: `${item.year2022 * 2}%` }} />
                      </div>
                    </div>
                    <span className="text-red-500 text-sm font-bold">{item.change}</span>
                  </div>
                </div>
              ))}
              <a
                href="https://www.cdc.gov/nchs/data/nhis/earlyrelease/earlyrelease202408.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 text-xs mt-4 inline-block hover:text-[#ff6b35] transition-colors"
              >
                Source: CDC/NCHS 2024 →
              </a>
            </div>

            <HorizontalBarChart
              data={CHART_DATA.mentalHealth.anxietyByAge}
              title="Anxiety by Age Group"
              subtitle="% with symptoms in past 2 weeks"
              source="CDC/NCHS 2022"
              sourceUrl="https://www.cdc.gov/nchs/data/nhis/earlyrelease/earlyrelease202408.pdf"
              maxValue={30}
            />
          </div>

          <div className="mt-6 bg-[#111] rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">&quot;More Anxious Than Last Year&quot;</h3>
            <div className="flex items-end gap-4 h-48">
              {CHART_DATA.mentalHealth.risingAnxiety.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-[#ff3333] to-[#ff6b35] rounded-t-lg transition-all"
                    style={{ height: `${item.value * 3}px` }}
                  />
                  <p className="text-2xl font-bold text-[#ff6b35] mt-2">{item.value}%</p>
                  <p className="text-gray-500 text-sm">{item.year}</p>
                </div>
              ))}
            </div>
            <a
              href="https://www.apa.org/news/press/releases/stress"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 text-xs mt-4 inline-block hover:text-[#ff6b35] transition-colors"
            >
              Source: APA Stress in America →
            </a>
          </div>

          <div className="mt-6">
            <StatCards data={CHART_DATA.mentalHealth.youthCrisis} title="Youth Mental Health Crisis" />
          </div>

          <FrameworkAnalysis analysis={FRAMEWORK_ANALYSIS.mentalHealth} />
        </div>
      </section>

      {/* Section 4: Obesity */}
      <section className="px-6 py-16 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Physical Health Collapse</h2>
          <p className="text-gray-400 mb-8">Bodies designed for movement, trapped in stillness</p>

          <div className="bg-[#111] rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Global Obesity Epidemic</h3>
            <div className="flex items-end gap-2 h-64 overflow-x-auto pb-4">
              {CHART_DATA.obesity.trend.map((item, idx) => {
                const maxVal = 1530;
                const height = (item.value / maxVal) * 200;
                return (
                  <div key={idx} className="flex flex-col items-center min-w-[60px]">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <div
                      className={`w-12 rounded-t-lg transition-all ${item.projected ? 'bg-gradient-to-t from-[#ffc107] to-[#ff6b35] opacity-60' : 'bg-gradient-to-t from-[#ff3333] to-[#ff6b35]'}`}
                      style={{ height: `${height}px` }}
                    />
                    <p className="text-gray-500 text-xs mt-2">{item.year}</p>
                  </div>
                );
              })}
            </div>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 text-xs mt-4 inline-block hover:text-[#ff6b35] transition-colors"
            >
              Source: WHO / NCD-RisC / World Obesity Federation →
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <BigNumber
              value="10x"
              label="Increase in child/adolescent obesity (1975-2022)"
              source="WHO"
              sourceUrl="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
            />
            <BigNumber
              value="$4T+"
              label="Projected global cost of obesity by 2035"
              source="World Obesity Federation"
              sourceUrl="https://www.worldobesity.org/resources/resource-library/world-obesity-atlas-2023"
            />
          </div>

          <FrameworkAnalysis analysis={FRAMEWORK_ANALYSIS.obesity} />
        </div>
      </section>

      {/* Section 5: Screen Time */}
      <section className="px-6 py-16 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Screen Time & Attention</h2>
          <p className="text-gray-400 mb-8">Hijacked by algorithms designed to never let go</p>

          <div className="grid md:grid-cols-2 gap-6">
            <HorizontalBarChart
              data={CHART_DATA.screenTime.byGeneration}
              title="Daily Screen Time by Generation"
              source="DemandSage / Various 2024-2025"
              sourceUrl="https://www.demandsage.com/screen-time-statistics/"
              unit=" hrs"
              maxValue={10}
            />
            <div>
              <StatCards data={CHART_DATA.screenTime.teenStats} title="Teen Screen Saturation" />
              <div className="mt-4 bg-[#111] rounded-xl p-4 border border-[#ff6b35]/30">
                <p className="text-4xl font-bold text-[#ff6b35]">49%</p>
                <p className="text-gray-300 text-sm">of people feel addicted to their phones</p>
                <a
                  href="https://www.harmonyhit.com/smartphone-addiction-statistics/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 text-xs mt-1 inline-block hover:text-[#ff6b35] transition-colors"
                >
                  Source: Harmony Healthcare IT 2025 →
                </a>
              </div>
            </div>
          </div>

          <FrameworkAnalysis analysis={FRAMEWORK_ANALYSIS.screenTime} />
        </div>
      </section>

      {/* Section 6: Nature Deficit */}
      <section className="px-6 py-16 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Nature Severance</h2>
          <p className="text-gray-400 mb-8">Evolved in forests, confined to boxes</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#111] rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Weekly Time in Nature (Adults)</h3>
              <div className="space-y-3">
                {CHART_DATA.nature.timeOutdoors.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{item.label}</span>
                      <span className={item.color === 'crisis' ? 'text-red-500 font-bold' : item.color === 'warning' ? 'text-yellow-500' : 'text-green-500'}>{item.value}%</span>
                    </div>
                    <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color === 'crisis' ? 'bg-red-500' : item.color === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="https://natureofamericans.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 text-xs mt-4 inline-block hover:text-[#ff6b35] transition-colors"
              >
                Source: Nature of Americans Report →
              </a>
            </div>

            <div className="bg-[#111] rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Evolutionary Context</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-5xl font-bold text-green-500">99.9%</p>
                  <p className="text-gray-300">of our 200,000 year history spent in nature</p>
                </div>
                <div className="border-t border-gray-800 pt-6">
                  <p className="text-5xl font-bold text-red-500">&lt;7%</p>
                  <p className="text-gray-300">of modern waking hours spent outside</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-[#111] rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">Children: Screens vs Outdoors</h3>
            <p className="text-gray-400 text-sm mb-4">Ages 8-12</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-16 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-red-500">3x</span>
              </div>
              <span className="text-gray-500">more time on screens than playing outside</span>
            </div>
          </div>

          <FrameworkAnalysis analysis={FRAMEWORK_ANALYSIS.nature} />
        </div>
      </section>

      {/* Section 7: Sleep */}
      <section className="px-6 py-16 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Sleep Deprivation</h2>
          <p className="text-gray-400 mb-8">Circadian rhythms under siege</p>

          <div className="bg-[#111] rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Sleep Decline Over 70 Years</h3>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <p className="text-gray-500 text-sm">1942</p>
                <p className="text-5xl font-bold text-green-500">{CHART_DATA.sleep.decline.before}</p>
                <p className="text-gray-400">hrs/night</p>
              </div>
              <div className="text-4xl text-gray-600">→</div>
              <div className="text-center">
                <p className="text-gray-500 text-sm">2013</p>
                <p className="text-5xl font-bold text-red-500">{CHART_DATA.sleep.decline.after}</p>
                <p className="text-gray-400">hrs/night</p>
              </div>
              <div className="text-center border-l border-gray-800 pl-8">
                <p className="text-3xl font-bold text-[#ff6b35]">-14%</p>
                <p className="text-gray-400">{CHART_DATA.sleep.decline.lostTime}</p>
              </div>
            </div>
          </div>

          <StatCards data={CHART_DATA.sleep.currentStats} title="Current Sleep Crisis" />

          <FrameworkAnalysis analysis={FRAMEWORK_ANALYSIS.sleep} />
        </div>
      </section>

      {/* Section 8: Ancestral vs Modern */}
      <section className="px-6 py-16 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Ancestral vs Modern</h2>
          <p className="text-gray-400 mb-8">The environmental shift our biology never adapted to</p>

          <AncestralModernTable data={CHART_DATA.ancestralVsModern} />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">The Data Is Undeniable</h2>
          <p className="text-xl text-gray-400 mb-8">
            The path is clear. Demismatch first. Then augment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/framework"
              className="bg-[#ff6b35] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#ff5522] transition"
            >
              Read the Framework
            </Link>
            <Link
              href="/cases"
              className="border-2 border-gray-700 text-white px-8 py-3 rounded-xl font-semibold hover:border-gray-500 transition"
            >
              See Individual Cases
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-800">
        <div className="max-w-5xl mx-auto text-center text-gray-500 text-sm">
          <p>Data sources: WHO, CDC, Gallup, APA, Harvard Making Caring Common, and peer-reviewed research</p>
          <p className="mt-2">Last updated: December 2024</p>
        </div>
      </footer>
    </main>
  );
}
