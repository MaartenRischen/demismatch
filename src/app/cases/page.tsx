"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";

// Mismatch categories aligned with the DEMISMATCH Framework
// Based on the 5 Core Human Needs from the EEA (Environment of Evolutionary Adaptedness)
const CATEGORIES = [
  { id: "all", name: "All Cases", color: "#1a1a1a" },
  { id: "social-structure", name: "Social Structure", color: "#dc2626", description: "Tribe of ~150 known people → Strangers everywhere" },
  { id: "visible-purpose", name: "Visible Purpose", color: "#7c3aed", description: "Tangible work benefiting known people → Abstract labor for invisible shareholders" },
  { id: "closed-loops", name: "Closed Loops", color: "#ea580c", description: "Problems resolvable through action → Endless anxiety with no resolution" },
  { id: "real-feedback", name: "Real Feedback", color: "#0891b2", description: "Stable reputation among ~150 → Judgment by millions of strangers" },
  { id: "distributed-care", name: "Distributed Care", color: "#be185d", description: "20+ caregivers per child → 1-2 exhausted parents in isolation" },
];

interface Source {
  name: string;
  url: string;
}

interface Case {
  id: string;
  name: string;
  year: string;
  location: string;
  category: string;
  headline: string;
  summary: string;
  sources: Source[];
  // Framework analysis
  eeaBaseline: string; // What humans evolved for
  modernViolation: string; // How the environment violated this need
  systemicCause: string; // The structural/systemic cause
}

// Diverse cases illustrating environmental mismatch across all categories
const CASES: Case[] = [
  // =====================
  // SOCIAL STRUCTURE CASES
  // =====================
  {
    id: "hikikomori-japan",
    name: "Japan's Hikikomori Crisis",
    year: "2019",
    location: "Japan",
    category: "social-structure",
    headline: "1.5 million Japanese adults have withdrawn from society entirely, some for decades",
    summary: "Hikikomori are individuals who have withdrawn from all social contact for 6+ months, often living in a single room for years or decades. The Japanese government estimates 1.5 million cases, with some as old as 60 having isolated since their 20s. This isn't laziness or mental illness—it's a rational response to a society where social demands are impossible to meet and failure is permanently shameful.",
    sources: [
      { name: "BBC - Japan's Hikikomori", url: "https://www.bbc.com/news/world-asia-48035651" },
      { name: "The Guardian - Hidden Millions", url: "https://www.theguardian.com/world/2019/mar/29/hikikomori-japan-recluses-aged-over-40-outnumber-younger-ones" }
    ],
    eeaBaseline: "Humans evolved in stable tribes of ~150 where everyone knew their role and belonged automatically by birth. Failure in one domain didn't mean total exclusion.",
    modernViolation: "Japanese society demands constant performance across school, work, and social domains. One failure (failing an exam, losing a job) can feel like permanent exclusion from society.",
    systemicCause: "Rigid social hierarchies, brutal work culture, and shame-based conformity create impossible standards. The rational response for many is complete withdrawal."
  },
  {
    id: "loneliness-epidemic-uk",
    name: "UK Loneliness Epidemic",
    year: "2018",
    location: "United Kingdom",
    category: "social-structure",
    headline: "9 million Britons report chronic loneliness; UK appoints world's first Minister for Loneliness",
    summary: "The UK became the first country to appoint a Minister for Loneliness after research showed 9 million people—14% of the population—often or always feel lonely. Over 200,000 elderly people hadn't had a conversation with a friend or relative in over a month. Loneliness increases mortality risk by 26%—equivalent to smoking 15 cigarettes daily.",
    sources: [
      { name: "UK Government Announcement", url: "https://www.gov.uk/government/news/pm-launches-governments-first-loneliness-strategy" },
      { name: "Campaign to End Loneliness", url: "https://www.campaigntoendloneliness.org/the-facts-on-loneliness/" }
    ],
    eeaBaseline: "Humans evolved with constant social contact—living, working, eating, and sleeping in groups. Solitude was rare and usually brief.",
    modernViolation: "Modern housing isolates people in separate units. Working from home, car commutes, and screen-mediated interaction mean many go days without meaningful human contact.",
    systemicCause: "Urban planning prioritizes cars over community. Economic pressure scatters families. Digital technology provides the illusion of connection while delivering isolation."
  },
  {
    id: "elderly-kodokushi",
    name: "Kodokushi: Dying Alone",
    year: "2020",
    location: "Japan",
    category: "social-structure",
    headline: "30,000 elderly Japanese die alone annually; some bodies undiscovered for years",
    summary: "Kodokushi (lonely death) describes elderly people dying alone and remaining undiscovered for extended periods. Specialized cleaning companies now exist to handle decomposed remains. In one case, a man's skeleton was found 3 years after death, rent paid automatically. This is the logical endpoint of a society where elderly people have no one checking on them.",
    sources: [
      { name: "The Atlantic - Dying Alone", url: "https://www.theatlantic.com/international/archive/2017/11/japan-lonely-deaths/545318/" },
      { name: "NHK Documentary", url: "https://www3.nhk.or.jp/nhkworld/en/ondemand/video/3016087/" }
    ],
    eeaBaseline: "Elderly people were embedded in multigenerational households. They were cared for by extended family and contributed wisdom and childcare until death.",
    modernViolation: "Nuclear families scattered by economic pressure. Children move for work. Elderly people left in apartments with no one to notice if they stop appearing.",
    systemicCause: "Economic systems that require mobility break family bonds. Housing designed for isolation. No community structures to catch those who fall through cracks."
  },

  // =====================
  // VISIBLE PURPOSE CASES
  // =====================
  {
    id: "karoshi-dentsu",
    name: "Matsuri Takahashi",
    year: "2015",
    location: "Tokyo, Japan",
    category: "visible-purpose",
    headline: "24-year-old ad agency employee works 130 hours overtime in one month, dies by suicide on Christmas Day",
    summary: "Matsuri Takahashi was a new graduate at Dentsu, Japan's largest advertising agency. Despite policies capping overtime at 70 hours, electronic records showed she worked 130 hours of overtime in her final month. She tweeted 'I want to die' and jumped from her company dormitory on Christmas Day. Her mother's activism led to reforms in Japanese labor law.",
    sources: [
      { name: "Japan Times - Dentsu Case", url: "https://www.japantimes.co.jp/news/2017/10/06/national/crime-legal/dentsu-fined-500000-overwork-case-involving-suicide-employee/" },
      { name: "BBC - Japan Overwork Deaths", url: "https://www.bbc.com/news/business-39981997" }
    ],
    eeaBaseline: "Hunter-gatherers worked 3-5 hours daily on direct survival tasks. Work had visible, immediate benefit to self and tribe. Rest was abundant.",
    modernViolation: "100+ hour work weeks producing advertisements—work with no tangible benefit to anyone she knew. No end point. No visible result. Endless abstract labor.",
    systemicCause: "Corporate culture rewards presence over productivity. Capitalism extracts maximum labor regardless of human cost. 'Karoshi' (death by overwork) is so common Japan has a word for it."
  },
  {
    id: "foxconn-nets",
    name: "Foxconn Suicide Cluster",
    year: "2010",
    location: "Shenzhen, China",
    category: "visible-purpose",
    headline: "18 Foxconn workers attempt suicide in one year; company installs nets on buildings rather than change conditions",
    summary: "In 2010, 18 workers at Foxconn's iPhone manufacturing plant attempted suicide—14 died. Workers performed the same repetitive task for 12+ hours daily, lived in company dormitories with strangers, and were forbidden from talking during shifts. Foxconn's response: installing nets on buildings to catch jumpers, and making workers sign 'no suicide' pledges.",
    sources: [
      { name: "The Guardian - Foxconn Suicides", url: "https://www.theguardian.com/technology/2017/jun/18/foxconn-life-death-forbidden-city-longhua-suicide-apple-iphone-brian-merchant-one-device-extract" },
      { name: "Wired - Inside Foxconn", url: "https://www.wired.com/2011/02/ff-joelinchina/" }
    ],
    eeaBaseline: "Work meant hunting, gathering, crafting—varied tasks producing visible results for known people. Workers controlled their pace and took breaks naturally.",
    modernViolation: "Performing one micro-task repeatedly for 12 hours, producing parts for strangers on another continent. Forbidden from speaking. Living with strangers. No purpose visible.",
    systemicCause: "Global supply chains hide human cost from consumers. 'Efficiency' means treating humans as machines. Profit incentives override human needs entirely."
  },
  {
    id: "amazon-warehouse",
    name: "Amazon Warehouse Workers",
    year: "2021",
    location: "United States",
    category: "visible-purpose",
    headline: "Amazon workers urinate in bottles to meet quotas; injury rates 80% higher than industry average",
    summary: "Investigations revealed Amazon warehouse workers urinating in bottles because bathroom breaks would cause them to miss quotas. Workers are tracked second-by-second by algorithms. Injury rates are nearly double the industry average. Turnover is 150% annually—Amazon burns through workers so fast it's estimated they could exhaust the entire US workforce by 2024.",
    sources: [
      { name: "The Verge - Amazon Worker Injuries", url: "https://www.theverge.com/2021/6/1/22463073/amazon-warehouse-workers-injuries-report" },
      { name: "NYT - Amazon Turnover", url: "https://www.nytimes.com/interactive/2021/06/15/us/amazon-workers.html" }
    ],
    eeaBaseline: "Humans worked in self-directed teams, taking breaks when needed, seeing the direct result of their labor benefiting their community.",
    modernViolation: "Algorithm-managed work with no human discretion. Bodies pushed past sustainable limits. Work that serves invisible shareholders while destroying the worker.",
    systemicCause: "Algorithmic management treats humans as replaceable inputs. Quarterly profit demands override worker wellbeing. No feedback loop from worker suffering to executive decisions."
  },

  // =====================
  // CLOSED LOOPS CASES
  // =====================
  {
    id: "climate-anxiety-youth",
    name: "Youth Climate Anxiety",
    year: "2021",
    location: "Global",
    category: "closed-loops",
    headline: "75% of young people say 'the future is frightening'; 56% believe 'humanity is doomed'",
    summary: "A global survey of 10,000 young people found 75% believe the future is frightening, 56% think humanity is doomed, and 39% are hesitant to have children. This isn't irrational—they're accurately perceiving that the problem is too large for individual action, governments are failing, and they inherit consequences of decisions made before they were born.",
    sources: [
      { name: "The Lancet - Youth Climate Anxiety Study", url: "https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(21)00278-3/fulltext" },
      { name: "BBC - Climate Anxiety", url: "https://www.bbc.com/news/world-58549373" }
    ],
    eeaBaseline: "Problems were local and actionable. If predators threatened the camp, the tribe could move. If food was scarce, they could migrate. Individual action resolved individual problems.",
    modernViolation: "Global problems (climate, nuclear weapons, AI) are too large for individual action. Young people experience constant threat with zero agency to resolve it.",
    systemicCause: "Economic systems that externalize costs create unresolvable problems. Democratic failures mean voting doesn't produce change. Media amplifies awareness of problems without solutions."
  },
  {
    id: "news-anxiety-cycle",
    name: "24/7 News Cycle Anxiety",
    year: "2020",
    location: "Global",
    category: "closed-loops",
    headline: "Americans who follow news 'very closely' show 40% higher anxiety levels than those who don't",
    summary: "Research shows heavy news consumption correlates with significantly higher anxiety and depression. But this isn't about avoiding reality—it's about the structure of modern news: constant threats (war, crime, disease) presented with no resolution and no action you can take. The brain evolved to respond to threats with action. Modern news delivers threats with no possible action.",
    sources: [
      { name: "APA - News Stress Study", url: "https://www.apa.org/news/press/releases/stress/2020/report-october" },
      { name: "Texas Tech - News Anxiety Research", url: "https://today.ttu.edu/posts/2022/02/Stories/problematic-news-consumption" }
    ],
    eeaBaseline: "Threat → Action → Resolution. See a predator, run or fight, survive or die. The stress response completes and the body returns to baseline.",
    modernViolation: "Constant threat awareness with no possible action. Wars you can't stop, diseases you can't cure, crimes you can't prevent. Stress response activated but never completed.",
    systemicCause: "News media profits from attention, not resolution. 'If it bleeds it leads' ensures maximum anxiety. No business model for 'here's something you can actually do.'"
  },
  {
    id: "infinite-scroll-addiction",
    name: "Infinite Scroll Design",
    year: "2006-present",
    location: "Global",
    category: "closed-loops",
    headline: "Infinite scroll inventor Aza Raskin says his creation wastes 200,000 human lifetimes annually",
    summary: "Aza Raskin invented infinite scroll and later expressed regret, calculating it wastes 200,000+ human lifetimes per year. The design deliberately removes stopping cues that would let users feel 'done.' His father Jeff Raskin worked on the original Macintosh; Aza now works on AI safety, saying he didn't anticipate how his invention would be weaponized against human attention.",
    sources: [
      { name: "BBC - Infinite Scroll Inventor's Regret", url: "https://www.bbc.com/news/technology-44640959" },
      { name: "Center for Humane Technology", url: "https://www.humanetech.com/who-we-are" }
    ],
    eeaBaseline: "Activities had natural endpoints. Finished eating when full. Finished walking when arrived. The body's satisfaction signals marked completion.",
    modernViolation: "Deliberately designed to have no endpoint. Satisfaction is impossible. The brain keeps seeking completion that never comes. Dopamine loops without resolution.",
    systemicCause: "Attention economy profits from maximizing engagement, not satisfaction. 'Time well spent' is opposite of business model. Deliberately addictive design is competitive advantage."
  },

  // =====================
  // REAL FEEDBACK CASES
  // =====================
  {
    id: "instagram-teen-depression",
    name: "Instagram's Internal Research",
    year: "2021",
    location: "Global",
    category: "real-feedback",
    headline: "Facebook's internal research: 'We make body image issues worse for 1 in 3 teen girls'",
    summary: "Leaked internal documents showed Facebook knew Instagram was harmful to teenage girls' mental health. Their own research found '32% of teen girls said that when they felt bad about their bodies, Instagram made them feel worse' and 'Teens blame Instagram for increases in anxiety and depression.' Facebook suppressed this research and publicly claimed Instagram was beneficial.",
    sources: [
      { name: "Wall Street Journal - Facebook Files", url: "https://www.wsj.com/articles/facebook-knows-instagram-is-toxic-for-teen-girls-company-documents-show-11631620739" },
      { name: "The Guardian - Instagram and Teen Mental Health", url: "https://www.theguardian.com/technology/2021/sep/14/facebook-instagram-teens-mental-health" }
    ],
    eeaBaseline: "Status was among ~150 known people. You could realistically be 'best at' something in your tribe. Comparison was limited to people you actually knew.",
    modernViolation: "Comparison against millions of filtered, edited images. Algorithms promote 'aspirational' content that makes viewers feel inadequate. Impossible beauty standards presented as normal.",
    systemicCause: "Engagement-based algorithms promote envy and inadequacy because negative emotions drive more engagement. Platform profits from user insecurity."
  },
  {
    id: "online-shaming",
    name: "Justine Sacco Shaming",
    year: "2013",
    location: "New York → South Africa",
    category: "real-feedback",
    headline: "PR executive tweets bad joke before flight, lands to discover she's the #1 trending topic worldwide and fired",
    summary: "Justine Sacco tweeted a poorly-worded joke about AIDS before boarding a flight to South Africa. During her 11-hour flight, the tweet went viral. By landing, she was the top trending topic worldwide, had received thousands of death threats, and was fired. Her life was destroyed by a global mob over a single ill-considered sentence—something that would have been a minor faux pas in a village.",
    sources: [
      { name: "NYT - How One Tweet Ruined Her Life", url: "https://www.nytimes.com/2015/02/15/magazine/how-one-stupid-tweet-ruined-justine-saccos-life.html" },
      { name: "So You've Been Publicly Shamed (book)", url: "https://www.goodreads.com/book/show/22571552-so-you-ve-been-publicly-shamed" }
    ],
    eeaBaseline: "Reputation was among people who knew your full context. A mistake could be explained, apologized for, and forgiven. Judgment came from people who knew you.",
    modernViolation: "A single sentence, stripped of context, judged by millions of strangers. No opportunity to explain. Permanent, searchable record. Global mob with zero accountability.",
    systemicCause: "Social media creates outrage as entertainment. Platforms amplify controversy. No mechanism for proportional response. Mob dynamics with no brake."
  },
  {
    id: "imposter-syndrome-epidemic",
    name: "Imposter Syndrome Epidemic",
    year: "2020",
    location: "Global",
    category: "real-feedback",
    headline: "70% of people experience imposter syndrome; rates highest among high achievers",
    summary: "Studies show 70% of people experience imposter syndrome—the persistent feeling of being a fraud despite evidence of competence. Rates are highest among high achievers, minorities in majority spaces, and first-generation professionals. This isn't a personal failing—it's the rational response to operating without the stable feedback that would confirm competence.",
    sources: [
      { name: "International Journal of Behavioral Science", url: "https://www.tci-thaijo.org/index.php/IJBS/article/view/521" },
      { name: "Harvard Business Review - Imposter Syndrome", url: "https://hbr.org/2008/05/overcoming-imposter-syndrome" }
    ],
    eeaBaseline: "Skills were validated constantly by known people who watched you develop. The tribe saw you learn to hunt, craft, or heal. Your competence was visible and confirmed by people who knew you.",
    modernViolation: "Skills validated by strangers in brief interactions. Credentials from institutions, not communities. No continuous feedback from people who know your full journey.",
    systemicCause: "Atomized workplaces. Remote work. High turnover. Credentials over relationships. No stable community to mirror back competence."
  },

  // =====================
  // DISTRIBUTED CARE CASES
  // =====================
  {
    id: "maternal-burnout",
    name: "Modern Motherhood Burnout",
    year: "2022",
    location: "United States",
    category: "distributed-care",
    headline: "Mothers spend 2x more time with children than in 1965, yet report more stress and guilt than ever",
    summary: "Despite spending double the time with children compared to 1965, modern mothers report higher stress, more guilt, and greater burnout. The 'intensive parenting' expectation—that mothers should be constantly present, engaged, and enriching—combines with isolation, no support, and often full-time work. One person is expected to do what villages once did.",
    sources: [
      { name: "Pew Research - Parenting Time", url: "https://www.pewresearch.org/short-reads/2019/06/12/fathers-day-facts/" },
      { name: "The Atlantic - Parental Burnout", url: "https://www.theatlantic.com/family/archive/2022/05/parent-burnout-emotional-exhaustion/629770/" }
    ],
    eeaBaseline: "Child-rearing was distributed among 20+ adults. Children had multiple attachment figures. No single person bore full responsibility. Mothers worked but children were always supervised by someone.",
    modernViolation: "1-2 parents expected to provide all care, education, enrichment, supervision, and emotional support. Often while both work full-time. No village. No backup.",
    systemicCause: "Nuclear family model. Geographic mobility scattering extended family. Childcare costs exceeding housing. Workplace hostility to parenting needs."
  },
  {
    id: "romanian-orphans",
    name: "Romanian Orphanage Study",
    year: "1990s",
    location: "Romania",
    category: "distributed-care",
    headline: "Children raised in institutions show permanent brain changes from lack of attachment; some never recover",
    summary: "After Ceaușescu's fall, researchers studied children raised in Romanian orphanages with minimal human contact. Brain scans showed physical differences: smaller brains, less gray matter, damaged white matter. Many children never developed normal attachment or emotional regulation, even after adoption into loving families. Early attachment isn't optional—it's required for normal brain development.",
    sources: [
      { name: "Nature - Romanian Orphan Study", url: "https://www.nature.com/articles/s41467-017-01838-9" },
      { name: "Bucharest Early Intervention Project", url: "http://www.bucharestearlyinterventionproject.org/results.html" }
    ],
    eeaBaseline: "Infants had constant physical contact with multiple caregivers. They were held, carried, slept next to adults. Attachment figures were abundant and consistent.",
    modernViolation: "Orphanages provided minimal touch—one caregiver for 15+ infants. Children lay in cribs unstimulated. The fundamental human need for attachment was unmet during critical development windows.",
    systemicCause: "Policies banning contraception created unwanted children. Poverty meant families couldn't care for them. Institutions 'warehoused' children at minimum cost."
  },
  {
    id: "daycare-desert",
    name: "US Childcare Crisis",
    year: "2023",
    location: "United States",
    category: "distributed-care",
    headline: "Half of Americans live in 'childcare deserts'; average cost exceeds public university tuition",
    summary: "Over half of Americans live in areas with insufficient licensed childcare. Where available, costs average $10,000-$15,000 annually—more than public university tuition in many states. Childcare workers earn poverty wages ($13/hour median), creating high turnover and inconsistent care. Parents forced to choose between career, poverty, or patchwork arrangements that harm children.",
    sources: [
      { name: "Center for American Progress", url: "https://www.americanprogress.org/article/americas-child-care-deserts-2018/" },
      { name: "Economic Policy Institute", url: "https://www.epi.org/child-care-costs-in-the-united-states/" }
    ],
    eeaBaseline: "Childcare was free, abundant, and provided by invested community members. Older children helped with younger ones. Elderly contributed. Everyone benefited from children's wellbeing.",
    modernViolation: "Childcare commodified and unaffordable. Parents isolated from extended family. Economic systems require both parents working. No societal investment in next generation.",
    systemicCause: "Market-based childcare fails because children can't pay. No political will for public investment. Capitalism treats child-rearing as 'women's work' outside the economy."
  },

  // =====================
  // ADDITIONAL CASES (various categories)
  // =====================
  {
    id: "teen-sleep-deprivation",
    name: "Teen Sleep Deprivation",
    year: "2020",
    location: "United States",
    category: "closed-loops",
    headline: "73% of high schoolers get less than 8 hours of sleep; school start times ignore adolescent biology",
    summary: "Adolescent circadian rhythms shift 2+ hours later during puberty—teenagers genuinely cannot fall asleep before 11pm. Yet most US high schools start before 8am, forcing teens to wake during their biological night. The American Academy of Pediatrics calls early start times a public health crisis, linking them to depression, car crashes, and obesity.",
    sources: [
      { name: "American Academy of Pediatrics", url: "https://publications.aap.org/pediatrics/article/134/3/642/74175/School-Start-Times-for-Adolescents" },
      { name: "CDC - Teen Sleep Data", url: "https://www.cdc.gov/healthyyouth/sleep/index.htm" }
    ],
    eeaBaseline: "Sleep followed natural circadian rhythms. Adolescents slept later and woke later. Artificial schedules didn't override biology.",
    modernViolation: "School schedules set for adult convenience (bus routes, sports, work schedules) ignore adolescent biology. Teens forced into permanent jet-lag.",
    systemicCause: "Systems designed for institutional efficiency, not human biology. No political pressure from teens. Adult convenience prioritized over child development."
  },
  {
    id: "social-media-comparison",
    name: "Molly Russell",
    year: "2017",
    location: "UK",
    category: "real-feedback",
    headline: "14-year-old views 2,100 self-harm posts on Instagram in 6 months; coroner rules platform 'contributed to death'",
    summary: "Molly Russell died by suicide after Instagram's algorithm served her over 2,100 posts about depression, self-harm, and suicide in her final six months. Pinterest emailed her '10 depression pins you might like.' A UK coroner made legal history by ruling that the platforms 'contributed to her death in a more than minimal way.' The algorithms optimized for engagement, and suffering engaged her.",
    sources: [
      { name: "BBC - Molly Russell Inquest", url: "https://www.bbc.com/news/uk-england-london-63073489" },
      { name: "The Guardian - Coroner's Ruling", url: "https://www.theguardian.com/technology/2022/sep/30/molly-russell-died-while-suffering-negative-effects-of-online-content-rules-coroner" }
    ],
    eeaBaseline: "Information diet curated by trusted community members. No algorithm optimizing for maximum emotional engagement. Dark content naturally limited.",
    modernViolation: "Algorithms learned her vulnerability and exploited it. More suffering = more engagement = more ads served. No human oversight. Automated content descent.",
    systemicCause: "Engagement-based business models. Section 230 immunity. No platform liability for algorithmic amplification of harm."
  },
  {
    id: "bullshit-jobs",
    name: "Bullshit Jobs Phenomenon",
    year: "2018",
    location: "Global",
    category: "visible-purpose",
    headline: "40% of workers believe their job makes no meaningful contribution to the world",
    summary: "Anthropologist David Graeber's research found 40% of workers believe their jobs are pointless. These 'bullshit jobs'—corporate lawyers, PR consultants, middle managers—often pay well but leave workers feeling empty and depressed. Meanwhile, essential workers (nurses, teachers, garbage collectors) are underpaid and undervalued. The inversion of meaning and compensation causes profound suffering.",
    sources: [
      { name: "Bullshit Jobs (book)", url: "https://www.simonandschuster.com/books/Bullshit-Jobs/David-Graeber/9781501143335" },
      { name: "YouGov Survey", url: "https://yougov.co.uk/topics/society/articles-reports/2015/08/12/british-jobs-meaningless" }
    ],
    eeaBaseline: "All work contributed visibly to tribal survival. Hunter's kill fed the group. Gatherer's plants provided nutrition. Purpose was obvious and immediate.",
    modernViolation: "Work disconnected from visible benefit. Meetings about meetings. Reports no one reads. 'Synergy' and 'strategy' replacing tangible output.",
    systemicCause: "Corporate bureaucracy grows to employ people whose real work has been automated. Economic systems require 'jobs' even without meaningful work."
  },
  {
    id: "gig-economy-precarity",
    name: "Gig Economy Precarity",
    year: "2023",
    location: "Global",
    category: "visible-purpose",
    headline: "Uber drivers earn less than minimum wage after expenses; 1/3 of workers now in precarious gig work",
    summary: "Studies show Uber and Lyft drivers typically earn $9-10/hour after expenses—below minimum wage. Yet the 'gig economy' now employs over 1/3 of workers. No benefits, no job security, no predictable income, algorithmic management, and rating systems that create constant anxiety. Workers bear all risk while platforms extract value.",
    sources: [
      { name: "MIT Study - Rideshare Driver Earnings", url: "https://orfe.princeton.edu/~alaink/SmssJrPpr_GnsUbr_Feb2018.pdf" },
      { name: "Economic Policy Institute", url: "https://www.epi.org/publication/uber-and-the-labor-market-uber-drivers-compensation-wages-and-the-scale-of-uber-and-the-gig-economy/" }
    ],
    eeaBaseline: "Work was embedded in stable community relationships. You knew your role and could rely on reciprocity. Security came from belonging.",
    modernViolation: "No employment relationship. Algorithmic control without negotiation. Racing to the bottom on price. Each worker isolated and competing against all others.",
    systemicCause: "Platform capitalism extracts value while externalizing all risk to workers. Labor law loopholes classify workers as 'independent contractors.'"
  },
  {
    id: "school-shooter-profile",
    name: "School Shooter Pattern",
    year: "2019",
    location: "United States",
    category: "social-structure",
    headline: "Secret Service study: 100% of school shooters experienced social rejection; most had no close friends",
    summary: "A US Secret Service study of school shooters found that every single one had experienced social rejection, bullying, or ostracism. Most had no close friends. Many had reported the bullying to adults who failed to intervene. This isn't a gun problem alone—it's what happens when social animals are completely excluded from the tribe with no path back.",
    sources: [
      { name: "US Secret Service - Targeted School Violence Report", url: "https://www.secretservice.gov/sites/default/files/reports/2020-03/USSS_NTAC_Protecting_Americas_Schools.pdf" },
      { name: "Scientific American - School Shooter Analysis", url: "https://www.scientificamerican.com/article/what-explains-u-s-mass-shootings-international-comparisons-suggest-an-answer/" }
    ],
    eeaBaseline: "Social exclusion from the tribe meant death. The drive to belong is fundamental. Complete rejection with no path back triggers extreme responses.",
    modernViolation: "Schools concentrate thousands of strangers with rigid social hierarchies. Rejected students have no alternative community. No elders intervening. No path to belonging.",
    systemicCause: "Large schools with anonymous social dynamics. Failure to address bullying. Easy gun access. No community structures to catch isolated youth."
  },
  {
    id: "surgeon-burnout",
    name: "Healthcare Worker Burnout",
    year: "2021",
    location: "United States",
    category: "visible-purpose",
    headline: "63% of physicians report burnout; 400 doctors die by suicide annually in the US",
    summary: "Despite doing meaningful work, physicians experience epidemic burnout. 63% report symptoms. 400 die by suicide annually—the highest rate of any profession. The cause isn't the work itself but the conditions: 2 hours of paperwork for every 1 hour with patients, insurance pre-authorizations, electronic health records designed for billing not care. The purpose is there but buried under bureaucracy.",
    sources: [
      { name: "Medscape Physician Burnout Report", url: "https://www.medscape.com/slideshow/2022-lifestyle-burnout-6014664" },
      { name: "AFSP - Physician Suicide", url: "https://afsp.org/story/new-research-documents-physician-suicide-rate" }
    ],
    eeaBaseline: "Healers spent all their time healing. Their purpose was visible and immediate. The community's health reflected their work directly.",
    modernViolation: "Physicians spend 2 hours on documentation for each hour of patient care. Visible healing work buried under bureaucratic requirements. Purpose obscured by paperwork.",
    systemicCause: "Insurance-based healthcare creates documentation burden. Electronic records designed for billing. Administrators proliferate while bedside care suffers."
  }
];

// Case card component
function CaseCard({
  caseData,
  onClick
}: {
  caseData: Case;
  onClick: () => void;
}) {
  const category = CATEGORIES.find(c => c.id === caseData.category);

  return (
    <article
      onClick={onClick}
      className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
    >
      {/* Category badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-white uppercase tracking-wider"
          style={{ backgroundColor: category?.color || '#666' }}
        >
          {category?.name}
        </span>
        <span className="text-gray-400 text-xs">{caseData.year}</span>
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#c75b3a] transition-colors">
        {caseData.name}
      </h3>
      <p className="text-gray-500 text-xs mb-3">{caseData.location}</p>

      {/* Headline */}
      <p className="text-gray-800 text-sm font-medium leading-snug">
        {caseData.headline}
      </p>
    </article>
  );
}

// Case detail modal with framework analysis
function CaseModal({
  caseData,
  onClose
}: {
  caseData: Case;
  onClose: () => void;
}) {
  const category = CATEGORIES.find(c => c.id === caseData.category);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold text-white uppercase tracking-wider"
              style={{ backgroundColor: category?.color }}
            >
              {category?.name}
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{caseData.name}</h1>
          <p className="text-gray-500">{caseData.year} • {caseData.location}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Headline */}
          <div className="mb-6 p-5 bg-gray-900 text-white rounded-xl">
            <p className="text-xl font-semibold leading-snug">{caseData.headline}</p>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">What Happened</h2>
            <p className="text-gray-700 leading-relaxed">{caseData.summary}</p>
          </div>

          {/* Framework Analysis */}
          <div className="bg-[#FAF9F6] border border-[#c75b3a]/20 rounded-xl p-6 mb-6">
            <h2 className="text-[#c75b3a] font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Mismatch Analysis
            </h2>

            <div className="space-y-5">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 font-medium">What We Evolved For (EEA Baseline)</p>
                <p className="text-gray-700 text-sm leading-relaxed">{caseData.eeaBaseline}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 font-medium">How Modern Environments Violate This</p>
                <p className="text-gray-700 text-sm leading-relaxed">{caseData.modernViolation}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 font-medium">Systemic Cause</p>
                <p className="text-gray-700 text-sm leading-relaxed">{caseData.systemicCause}</p>
              </div>
            </div>
          </div>

          {/* Category explanation */}
          {category && category.id !== 'all' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">{category.name}:</strong> {category.description}
              </p>
            </div>
          )}

          {/* Sources */}
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sources</h2>
            <ul className="space-y-2">
              {caseData.sources.map((source, idx) => (
                <li key={idx}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#c75b3a] hover:underline flex items-center gap-1"
                  >
                    {source.name}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component
export default function CasesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showIntro, setShowIntro] = useState(true); // Now a collapsible banner, not blocking
  const [showAll, setShowAll] = useState(false); // For pagination
  const INITIAL_SHOW_COUNT = 9; // Show 9 cards initially

  const filteredCases = useMemo(() => {
    if (selectedCategory === "all") return CASES;
    return CASES.filter(c => c.category === selectedCategory);
  }, [selectedCategory]);

  // Paginated display
  const displayedCases = useMemo(() => {
    if (showAll || filteredCases.length <= INITIAL_SHOW_COUNT) return filteredCases;
    return filteredCases.slice(0, INITIAL_SHOW_COUNT);
  }, [filteredCases, showAll]);

  const remainingCount = filteredCases.length - INITIAL_SHOW_COUNT;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: CASES.length };
    CASES.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF9F6] pt-20">
      <Navigation />

      {/* Hero */}
      <header className="py-12 px-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c75b3a] font-medium mb-4 tracking-wide uppercase text-sm">Case Studies</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            The Mismatch in Action
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
            Real examples of what happens when modern environments violate fundamental human needs.
            These aren't broken individuals—they're predictable outcomes of broken systems.
          </p>
        </div>
      </header>

      {/* Introduction Banner (collapsible, not blocking) */}
      {showIntro && (
        <div className="bg-[#FAF9F6] border-b border-[#E5E0D8]">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="bg-white rounded-xl border border-[#E5E0D8] p-6 relative">
              <button
                onClick={() => setShowIntro(false)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition"
                aria-label="Dismiss introduction"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Understanding These Cases
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                These cases illustrate <strong>environmental mismatch</strong>—the gap between what humans evolved for and the conditions we actually live in. Each case is categorized by the core need being violated:
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-[#dc2626]/10 text-[#dc2626]">Social Structure</span>
                <span className="px-2 py-1 rounded-full bg-[#7c3aed]/10 text-[#7c3aed]">Visible Purpose</span>
                <span className="px-2 py-1 rounded-full bg-[#ea580c]/10 text-[#ea580c]">Closed Loops</span>
                <span className="px-2 py-1 rounded-full bg-[#0891b2]/10 text-[#0891b2]">Real Feedback</span>
                <span className="px-2 py-1 rounded-full bg-[#be185d]/10 text-[#be185d]">Distributed Care</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="sticky top-20 z-40 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide justify-center flex-wrap">
            {CATEGORIES.map(category => {
              const count = categoryCounts[category.id] || 0;
              if (category.id !== "all" && count === 0) return null;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                  }`}
                  style={selectedCategory === category.id ? { backgroundColor: category.color } : {}}
                >
                  {category.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedCases.map(c => (
              <CaseCard
                key={c.id}
                caseData={c}
                onClick={() => setSelectedCase(c)}
              />
            ))}
          </div>

          {/* Show More Button */}
          {!showAll && remainingCount > 0 && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAll(true)}
                className="px-8 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:border-[#c75b3a] hover:text-[#c75b3a] transition-all"
              >
                Show {remainingCount} More Cases
              </button>
            </div>
          )}
        </div>
      </section>

      {/* The Framework Connection */}
      <section className="px-6 py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Georgia, serif' }}>
            The Pattern Across All Cases
          </h2>
          <p className="text-center text-gray-400 mb-10">
            Every case follows the same structure:
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-gray-800 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-[#c75b3a] text-white flex items-center justify-center font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Human Need Exists</h3>
              <p className="text-sm text-gray-400">Evolved over millions of years, encoded in biology</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-[#c75b3a] text-white flex items-center justify-center font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Environment Violates It</h3>
              <p className="text-sm text-gray-400">Modern systems ignore or actively exploit the need</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-[#c75b3a] text-white flex items-center justify-center font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Predictable Suffering</h3>
              <p className="text-sm text-gray-400">The individual is blamed for a systemic failure</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-[#c75b3a]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Understand the Framework
          </h2>
          <p className="text-xl text-white/90 mb-8">
            These cases make more sense when you understand the full framework behind them.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/framework"
              className="bg-white text-[#c75b3a] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Read the Framework
            </Link>
            <Link
              href="/stats"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              See the Statistics
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-gray-400">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-6 text-sm mb-6">
            <Link href="/framework" className="hover:text-white transition">Framework</Link>
            <Link href="/stats" className="hover:text-white transition">Statistics</Link>
            <Link href="/library" className="hover:text-white transition">Library</Link>
            <Link href="/sources" className="hover:text-white transition">Sources</Link>
          </div>
          <p className="text-sm">
            {CASES.length} documented cases across {CATEGORIES.length - 1} mismatch categories
          </p>
        </div>
      </footer>

      {/* Case Modal */}
      {selectedCase && (
        <CaseModal caseData={selectedCase} onClose={() => setSelectedCase(null)} />
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
