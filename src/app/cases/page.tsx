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
    summary: "Hikikomori are individuals who have withdrawn from all social contact for 6+ months, often living in a single room for years or decades. The Japanese government estimates 1.5 million cases, with some as old as 60 having isolated since their 20s. This isn't laziness or mental illness-it's a rational response to a society where social demands are impossible to meet and failure is permanently shameful.",
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
    summary: "The UK became the first country to appoint a Minister for Loneliness after research showed 9 million people-14% of the population-often or always feel lonely. Over 200,000 elderly people hadn't had a conversation with a friend or relative in over a month. Loneliness increases mortality risk by 26%-equivalent to smoking 15 cigarettes daily.",
    sources: [
      { name: "UK Government Announcement", url: "https://www.gov.uk/government/news/pm-launches-governments-first-loneliness-strategy" },
      { name: "Campaign to End Loneliness", url: "https://www.campaigntoendloneliness.org/the-facts-on-loneliness/" }
    ],
    eeaBaseline: "Humans evolved with constant social contact-living, working, eating, and sleeping in groups. Solitude was rare and usually brief.",
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
    modernViolation: "100+ hour work weeks producing advertisements-work with no tangible benefit to anyone she knew. No end point. No visible result. Endless abstract labor.",
    systemicCause: "Corporate culture rewards presence over productivity. Capitalism extracts maximum labor regardless of human cost. 'Karoshi' (death by overwork) is so common Japan has a word for it."
  },
  {
    id: "foxconn-nets",
    name: "Foxconn Suicide Cluster",
    year: "2010",
    location: "Shenzhen, China",
    category: "visible-purpose",
    headline: "18 Foxconn workers attempt suicide in one year; company installs nets on buildings rather than change conditions",
    summary: "In 2010, 18 workers at Foxconn's iPhone manufacturing plant attempted suicide-14 died. Workers performed the same repetitive task for 12+ hours daily, lived in company dormitories with strangers, and were forbidden from talking during shifts. Foxconn's response: installing nets on buildings to catch jumpers, and making workers sign 'no suicide' pledges.",
    sources: [
      { name: "The Guardian - Foxconn Suicides", url: "https://www.theguardian.com/technology/2017/jun/18/foxconn-life-death-forbidden-city-longhua-suicide-apple-iphone-brian-merchant-one-device-extract" },
      { name: "Wired - Inside Foxconn", url: "https://www.wired.com/2011/02/ff-joelinchina/" }
    ],
    eeaBaseline: "Work meant hunting, gathering, crafting-varied tasks producing visible results for known people. Workers controlled their pace and took breaks naturally.",
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
    summary: "Investigations revealed Amazon warehouse workers urinating in bottles because bathroom breaks would cause them to miss quotas. Workers are tracked second-by-second by algorithms. Injury rates are nearly double the industry average. Turnover is 150% annually-Amazon burns through workers so fast it's estimated they could exhaust the entire US workforce by 2024.",
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
    summary: "A global survey of 10,000 young people found 75% believe the future is frightening, 56% think humanity is doomed, and 39% are hesitant to have children. This isn't irrational-they're accurately perceiving that the problem is too large for individual action, governments are failing, and they inherit consequences of decisions made before they were born.",
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
    summary: "Research shows heavy news consumption correlates with significantly higher anxiety and depression. But this isn't about avoiding reality-it's about the structure of modern news: constant threats (war, crime, disease) presented with no resolution and no action you can take. The brain evolved to respond to threats with action. Modern news delivers threats with no possible action.",
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
    summary: "Justine Sacco tweeted a poorly-worded joke about AIDS before boarding a flight to South Africa. During her 11-hour flight, the tweet went viral. By landing, she was the top trending topic worldwide, had received thousands of death threats, and was fired. Her life was destroyed by a global mob over a single ill-considered sentence-something that would have been a minor faux pas in a village.",
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
    summary: "Studies show 70% of people experience imposter syndrome-the persistent feeling of being a fraud despite evidence of competence. Rates are highest among high achievers, minorities in majority spaces, and first-generation professionals. This isn't a personal failing-it's the rational response to operating without the stable feedback that would confirm competence.",
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
    summary: "Despite spending double the time with children compared to 1965, modern mothers report higher stress, more guilt, and greater burnout. The 'intensive parenting' expectation-that mothers should be constantly present, engaged, and enriching-combines with isolation, no support, and often full-time work. One person is expected to do what villages once did.",
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
    summary: "After Ceaușescu's fall, researchers studied children raised in Romanian orphanages with minimal human contact. Brain scans showed physical differences: smaller brains, less gray matter, damaged white matter. Many children never developed normal attachment or emotional regulation, even after adoption into loving families. Early attachment isn't optional-it's required for normal brain development.",
    sources: [
      { name: "Nature - Romanian Orphan Study", url: "https://www.nature.com/articles/s41467-017-01838-9" },
      { name: "Bucharest Early Intervention Project", url: "http://www.bucharestearlyinterventionproject.org/results.html" }
    ],
    eeaBaseline: "Infants had constant physical contact with multiple caregivers. They were held, carried, slept next to adults. Attachment figures were abundant and consistent.",
    modernViolation: "Orphanages provided minimal touch-one caregiver for 15+ infants. Children lay in cribs unstimulated. The fundamental human need for attachment was unmet during critical development windows.",
    systemicCause: "Policies banning contraception created unwanted children. Poverty meant families couldn't care for them. Institutions 'warehoused' children at minimum cost."
  },
  {
    id: "daycare-desert",
    name: "US Childcare Crisis",
    year: "2023",
    location: "United States",
    category: "distributed-care",
    headline: "Half of Americans live in 'childcare deserts'; average cost exceeds public university tuition",
    summary: "Over half of Americans live in areas with insufficient licensed childcare. Where available, costs average $10,000-$15,000 annually-more than public university tuition in many states. Childcare workers earn poverty wages ($13/hour median), creating high turnover and inconsistent care. Parents forced to choose between career, poverty, or patchwork arrangements that harm children.",
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
    summary: "Adolescent circadian rhythms shift 2+ hours later during puberty-teenagers genuinely cannot fall asleep before 11pm. Yet most US high schools start before 8am, forcing teens to wake during their biological night. The American Academy of Pediatrics calls early start times a public health crisis, linking them to depression, car crashes, and obesity.",
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
    summary: "Anthropologist David Graeber's research found 40% of workers believe their jobs are pointless. These 'bullshit jobs'-corporate lawyers, PR consultants, middle managers-often pay well but leave workers feeling empty and depressed. Meanwhile, essential workers (nurses, teachers, garbage collectors) are underpaid and undervalued. The inversion of meaning and compensation causes profound suffering.",
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
    summary: "Studies show Uber and Lyft drivers typically earn $9-10/hour after expenses-below minimum wage. Yet the 'gig economy' now employs over 1/3 of workers. No benefits, no job security, no predictable income, algorithmic management, and rating systems that create constant anxiety. Workers bear all risk while platforms extract value.",
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
    summary: "A US Secret Service study of school shooters found that every single one had experienced social rejection, bullying, or ostracism. Most had no close friends. Many had reported the bullying to adults who failed to intervene. This isn't a gun problem alone-it's what happens when social animals are completely excluded from the tribe with no path back.",
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
    summary: "Despite doing meaningful work, physicians experience epidemic burnout. 63% report symptoms. 400 die by suicide annually-the highest rate of any profession. The cause isn't the work itself but the conditions: 2 hours of paperwork for every 1 hour with patients, insurance pre-authorizations, electronic health records designed for billing not care. The purpose is there but buried under bureaucracy.",
    sources: [
      { name: "Medscape Physician Burnout Report", url: "https://www.medscape.com/slideshow/2022-lifestyle-burnout-6014664" },
      { name: "AFSP - Physician Suicide", url: "https://afsp.org/story/new-research-documents-physician-suicide-rate" }
    ],
    eeaBaseline: "Healers spent all their time healing. Their purpose was visible and immediate. The community's health reflected their work directly.",
    modernViolation: "Physicians spend 2 hours on documentation for each hour of patient care. Visible healing work buried under bureaucratic requirements. Purpose obscured by paperwork.",
    systemicCause: "Insurance-based healthcare creates documentation burden. Electronic records designed for billing. Administrators proliferate while bedside care suffers."
  },

  // =====================
  // NEW CASES FROM RESEARCH
  // =====================

  // PSYCHIATRIC SYSTEM CASES
  {
    id: "zoraya-ter-beek",
    name: "Zoraya ter Beek",
    year: "2024",
    location: "Netherlands",
    category: "visible-purpose",
    headline: "29-year-old Dutch woman euthanized after years of psychiatric treatment-no one ever tried environmental interventions",
    summary: "Zoraya ter Beek, 29, was euthanized under Dutch law after being told 'there's nothing more we can do' for her depression and autism. She spent years in the psychiatric system receiving medications and therapy, but no one addressed her isolated living situation, lack of community, or absence of meaningful purpose. The system declared her unfixable rather than questioning whether her environment was the problem.",
    sources: [
      { name: "NY Post - Dutch Euthanasia Case", url: "https://nypost.com/2024/04/03/world-news/woman-29-to-be-euthanized-due-to-depression-autism/" },
      { name: "The Guardian - Netherlands Euthanasia", url: "https://www.theguardian.com/world/2024/apr/04/dutch-woman-depression-autism-euthanasia" }
    ],
    eeaBaseline: "Humans experiencing distress were supported by their tribe, given roles that fit their capabilities, and embedded in caring community regardless of 'productivity.'",
    modernViolation: "Isolated in an apartment, labeled with disorders, medicated, and told she was unfixable. No tribe. No role. No one thought to build what she actually needed.",
    systemicCause: "Psychiatric system focused on individual pathology, not environmental causes. Death becomes 'treatment' because building actual community is considered outside medical scope."
  },
  {
    id: "rebecca-riley",
    name: "Rebecca Riley",
    year: "2006",
    location: "Massachusetts, USA",
    category: "distributed-care",
    headline: "4-year-old diagnosed with bipolar disorder at age 2, dies from psychiatric medication overdose",
    summary: "Rebecca Riley was diagnosed with bipolar disorder at 28 months old and prescribed a cocktail of psychiatric drugs including clonidine, Depakote, and Seroquel. She died at age 4 from an overdose of her prescribed medications. Her psychiatrist diagnosed her after a 20-minute evaluation. A toddler was given adult psychiatric labels and medications because no one questioned whether her environment-chaotic home, overwhelmed parents-was the actual problem.",
    sources: [
      { name: "CBS News - Rebecca Riley Case", url: "https://www.cbsnews.com/news/what-killed-rebecca-riley/" },
      { name: "NYT - Bipolar Children", url: "https://www.nytimes.com/2007/02/15/us/15girl.html" }
    ],
    eeaBaseline: "Children developed within a supportive tribe of multiple caregivers. Behavioral variation was normal and managed through community, not medication.",
    modernViolation: "A 2-year-old's difficult behavior was pathologized as 'bipolar disorder' and treated with powerful psychiatric drugs rather than addressing family chaos and isolation.",
    systemicCause: "Pharma-influenced psychiatry that pathologizes childhood behavior. Insurance that pays for pills but not family support. Parents left alone to cope with difficult children."
  },
  {
    id: "li-ao-bootcamp",
    name: "Li Ao",
    year: "2017",
    location: "China",
    category: "closed-loops",
    headline: "18-year-old sent to Chinese internet addiction boot camp, beaten to death within 48 hours",
    summary: "Li Ao, 18, was sent to a 'treatment center' for internet addiction in Anhui province. Within 48 hours of arrival, he was dead from injuries sustained during 'training.' These camps, which operate across China with government sanction, use physical punishment, electric shocks, and military-style discipline to 'cure' internet addiction. His parents paid to have him tortured to death for a 'problem' that was actually an escape from a purposeless environment.",
    sources: [
      { name: "BBC - China Boot Camp Death", url: "https://www.bbc.com/news/world-asia-china-40857523" },
      { name: "The Guardian - Internet Addiction Camps", url: "https://www.theguardian.com/world/2017/aug/14/death-of-chinese-teen-sparks-outrage-at-internet-addiction-camps" }
    ],
    eeaBaseline: "Young people found meaning through roles in their tribe-hunting, crafting, caring for younger children. Natural activities provided engagement without need for 'treatment.'",
    modernViolation: "A teenager escaping into virtual worlds because the real world offered no purpose, community, or meaning-then punished with violence for this rational escape.",
    systemicCause: "Society that offers no meaningful roles for youth, then criminalizes their escape into virtual alternatives. Profit-driven 'treatment' industry with no accountability."
  },

  // SOCIAL STRUCTURE / ISOLATION CASES
  {
    id: "spitz-hospitalism",
    name: "René Spitz Hospitalism Studies",
    year: "1945",
    location: "United States/Europe",
    category: "social-structure",
    headline: "30-37% infant mortality in clean, fed, staffed orphanages-only variable was lack of physical affection",
    summary: "Psychiatrist René Spitz documented that infants in well-maintained orphanages-clean, fed, medically attended-died at rates of 30-37% by age 2. The only difference from thriving children was human contact. Nurses were forbidden from holding babies except for essential care. These infants literally died from lack of touch, proving that human connection is as essential as food.",
    sources: [
      { name: "APA - Spitz Studies", url: "https://psycnet.apa.org/record/1946-04349-001" },
      { name: "Attachment Theory Origins", url: "https://www.simplypsychology.org/bowlby.html" }
    ],
    eeaBaseline: "Infants spent their entire early life in near-constant physical contact with mother and multiple caregivers. Touch was continuous, not scheduled.",
    modernViolation: "Efficient institutional care that met all measurable needs (food, hygiene, temperature) but eliminated the unmeasurable need for human touch.",
    systemicCause: "Institutions optimized for efficiency, not humanity. The assumption that meeting physical needs is sufficient. Touch seen as luxury, not necessity."
  },
  {
    id: "roseto-effect",
    name: "The Roseto Effect",
    year: "1955-1985",
    location: "Pennsylvania, USA",
    category: "social-structure",
    headline: "Italian-American town had 50% less heart disease-not from diet, but from tight community that dissolved with 'progress'",
    summary: "Roseto, Pennsylvania had half the heart disease mortality of neighboring towns despite same diet, same smoking rates, same healthcare access. The difference: three-generation households, strong community bonds, collective rituals, and no visible wealth hierarchy. As younger generations adopted American individualism-separate homes, status competition, weakened ties-the health advantage vanished completely by 1985.",
    sources: [
      { name: "Malcolm Gladwell - Outliers", url: "https://www.gladwellbooks.com/titles/malcolm-gladwell/outliers/9780316017923/" },
      { name: "Original Study - Stewart Wolf", url: "https://pubmed.ncbi.nlm.nih.gov/14245755/" }
    ],
    eeaBaseline: "Humans lived in tight-knit, multigenerational communities where everyone knew everyone, wealth was shared, and social bonds were lifelong.",
    modernViolation: "American individualism dissolved the community. Separate households, private wealth accumulation, weakened social bonds-all markers of 'success' that killed the protective effect.",
    systemicCause: "Economic systems that reward mobility and individualism. Cultural narrative that 'progress' means independence. Community seen as backward, isolation as advancement."
  },
  {
    id: "widowhood-effect",
    name: "The Widowhood Effect",
    year: "Meta-analysis",
    location: "Global",
    category: "social-structure",
    headline: "66% increased mortality risk in first 3 months after spouse dies-grief doesn't just hurt, it kills",
    summary: "Meta-analyses confirm that losing a spouse increases mortality risk by 66% in the first 3 months, with elevated risk persisting for years. This isn't metaphor-social connection is a physiological need. The immune system weakens, cardiovascular stress increases, and the body begins to fail when a primary social bond is severed. Humans are not designed to be alone.",
    sources: [
      { name: "JAMA - Widowhood Mortality", url: "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2521396" },
      { name: "Harvard Study - Social Connection", url: "https://www.hsph.harvard.edu/news/hsph-in-the-news/social-bonds-health/" }
    ],
    eeaBaseline: "Loss was experienced within a supportive community. Grieving individuals were surrounded by tribe members who shared the loss and prevented isolation.",
    modernViolation: "Widows/widowers often left alone in separate housing. No automatic community support. Expected to 'move on' quickly. Grief treated as individual problem.",
    systemicCause: "Nuclear family isolation means loss of one person can mean loss of primary social contact entirely. No community infrastructure to catch people after loss."
  },
  {
    id: "solitary-confinement",
    name: "Solitary Confinement",
    year: "Ongoing",
    location: "United States",
    category: "social-structure",
    headline: "Psychosis documented within 24-48 hours of solitary-we use isolation as punishment because it destroys the mind",
    summary: "Research documents that solitary confinement causes psychosis, hallucinations, and severe psychological damage within 24-48 hours in some cases. The UN considers >15 days to be torture. Yet 80,000+ Americans are in solitary on any given day, some for years or decades. We deliberately weaponize humans' need for social contact, proving that isolation is not merely uncomfortable-it is incompatible with mental function.",
    sources: [
      { name: "UN - Solitary as Torture", url: "https://www.un.org/press/en/2011/gashc4014.doc.htm" },
      { name: "Psychology Today - Solitary Effects", url: "https://www.psychologytoday.com/us/blog/shadow-boxing/201905/what-does-solitary-confinement-do-the-brain" }
    ],
    eeaBaseline: "Humans never experienced complete social isolation. Even exile meant joining another group. The brain simply has no program for total isolation.",
    modernViolation: "Deliberate, prolonged isolation used as punishment and control. Humans kept in conditions that inevitably produce insanity, then punished for going insane.",
    systemicCause: "Prison-industrial complex profits from bodies, not outcomes. Isolation is cheap and convenient. Long-term psychological damage externalized to society."
  },

  // VISIBLE PURPOSE CASES
  {
    id: "whitehall-studies",
    name: "Whitehall Studies",
    year: "1967-present",
    location: "United Kingdom",
    category: "visible-purpose",
    headline: "40,000 civil servants studied: 4x mortality difference between top and bottom grades-not money, but control and status",
    summary: "The Whitehall studies tracked 40,000 British civil servants for decades and found that those in the lowest employment grades had 4x the mortality rate of those at the top-even controlling for lifestyle factors. The key variable wasn't money or healthcare access, but control over one's work and perceived status. Low-grade workers had less autonomy, less respect, and died younger.",
    sources: [
      { name: "Original Whitehall Studies", url: "https://www.ucl.ac.uk/epidemiology-health-care/research/epidemiology-and-public-health/research/whitehall-ii" },
      { name: "Michael Marmot - Status Syndrome", url: "https://www.bloomsbury.com/us/status-syndrome-9780805078541/" }
    ],
    eeaBaseline: "Hunter-gatherers were fiercely egalitarian. Status differences existed but were fluid. Everyone had autonomy over their daily activities.",
    modernViolation: "Rigid hierarchies where some people spend their entire careers being told what to do, treated as interchangeable, given no voice in decisions affecting them.",
    systemicCause: "Capitalist organization concentrates control at the top. Efficiency metrics treat workers as inputs. Status hierarchies maintained to extract compliance."
  },
  {
    id: "deaths-of-despair",
    name: "Deaths of Despair",
    year: "1998-present",
    location: "United States",
    category: "visible-purpose",
    headline: "150,000 Americans die yearly from suicide, overdose, alcohol-concentrated in communities that lost economic purpose",
    summary: "Economists Anne Case and Angus Deaton documented 'deaths of despair'-suicide, drug overdose, alcohol-killing 150,000+ Americans annually. These deaths are concentrated among white working-class Americans in communities where manufacturing jobs disappeared. It's not poverty per se-it's loss of purpose, status, and meaning when work that defined generations vanished.",
    sources: [
      { name: "Case & Deaton Research", url: "https://www.pnas.org/doi/10.1073/pnas.1518393112" },
      { name: "Deaths of Despair Book", url: "https://press.princeton.edu/books/hardcover/9780691190785/deaths-of-despair-and-the-future-of-capitalism" }
    ],
    eeaBaseline: "Work provided visible contribution to the tribe. Everyone could see how their efforts helped the community survive. Purpose was embedded in daily life.",
    modernViolation: "Manufacturing jobs provided purpose and identity for generations. Their elimination left no replacement-only disability checks, opioids, and despair.",
    systemicCause: "Globalization moved jobs without replacing community function. Opioid industry marketed to the despair. No political response to purposelessness."
  },

  // NATURE/ENVIRONMENT CASES
  {
    id: "ulrich-window-study",
    name: "Roger Ulrich Window Study",
    year: "1984",
    location: "Pennsylvania, USA",
    category: "closed-loops",
    headline: "Same surgery, same hospital-patients with tree view recovered in 7.96 days vs 8.70 days for brick wall view",
    summary: "Roger Ulrich's landmark study compared surgical patients with windows facing trees versus brick walls. Tree-view patients: 7.96 days recovery (vs 8.70), fewer negative nurse notes, fewer strong painkillers requested. Nature contact-even just a view-measurably speeds healing. Yet we build hospitals, schools, and offices that deliberately sever people from natural environments.",
    sources: [
      { name: "Original Ulrich Study", url: "https://pubmed.ncbi.nlm.nih.gov/6143402/" },
      { name: "Biophilic Design Research", url: "https://www.terrapinbrightgreen.com/reports/14-patterns/" }
    ],
    eeaBaseline: "Humans recovered from illness and injury in natural environments, surrounded by plants, natural light, moving air, and the sounds of nature.",
    modernViolation: "Healthcare facilities often designed for efficiency, not healing. Windowless rooms, artificial light, machine sounds-environments that impede the recovery they're meant to support.",
    systemicCause: "Building costs prioritize square footage over windows. Medical system doesn't bill for 'nature views.' Evidence-based design ignored because it can't be monetized."
  },
  {
    id: "harlow-surrogate",
    name: "Harry Harlow Surrogate Studies",
    year: "1958",
    location: "Wisconsin, USA",
    category: "distributed-care",
    headline: "Infant monkeys chose cloth mother 17-18 hours/day over wire mother with food-contact comfort beats nutrition",
    summary: "Harry Harlow's famous experiments showed infant rhesus monkeys preferred spending 17-18 hours/day clinging to a soft cloth 'mother' over a wire 'mother' with milk. They would only leave to feed, then return immediately. Touch and comfort are not luxuries-they are primary biological needs that trump even food. Yet we design childcare systems that minimize physical contact.",
    sources: [
      { name: "Harlow's Classic Studies", url: "https://psycnet.apa.org/record/1959-02006-001" },
      { name: "Attachment Research", url: "https://www.psychologicalscience.org/publications/journals/pspi/attachment.html" }
    ],
    eeaBaseline: "Human infants were in near-constant physical contact with caregivers. Touch was the baseline, not an occasional reward.",
    modernViolation: "Efficient childcare minimizes holding. Cribs, car seats, bouncers, and screens replace human contact. Touch-starved infants from infancy.",
    systemicCause: "Childcare systems optimized for cost. Parents exhausted and unavailable. Cultural fear of 'spoiling' through too much contact."
  },
  {
    id: "nature-deficit-disorder",
    name: "Nature-Deficit Disorder",
    year: "2005-present",
    location: "United States",
    category: "closed-loops",
    headline: "American children: 4-7 minutes outdoor play daily vs 7+ hours screens-ADHD correlates with nature access",
    summary: "Richard Louv coined 'nature-deficit disorder' after documenting that American children spend 4-7 minutes daily in unstructured outdoor play vs 7+ hours on screens. Research shows ADHD symptoms correlate with nature access-children in greener environments show fewer symptoms. We diagnose children with attention disorders rather than acknowledging their environments lack anything worth paying attention to.",
    sources: [
      { name: "Last Child in the Woods", url: "https://richardlouv.com/books/last-child/" },
      { name: "Nature and ADHD Research", url: "https://pubmed.ncbi.nlm.nih.gov/15582281/" }
    ],
    eeaBaseline: "Children spent all day outdoors-exploring, climbing, playing in varied natural environments that demanded and developed their attention.",
    modernViolation: "Children confined to indoor spaces, transported in cars, forbidden from independent outdoor play, attention artificially managed by screens and medications.",
    systemicCause: "Suburban design requires cars. Fear culture prevents outdoor play. Schools eliminate recess. Nature becomes screen time."
  },

  // CIRCADIAN/SLEEP CASES
  {
    id: "nurse-shift-study",
    name: "Nurses' Health Study - Night Shift",
    year: "1988-2010",
    location: "United States",
    category: "closed-loops",
    headline: "75,000 nurses tracked: 15+ years of rotating night shifts = 38% higher heart disease mortality",
    summary: "The Nurses' Health Study tracked 75,000 nurses for 22 years and found those who worked rotating night shifts for 15+ years had 38% higher heart disease mortality. Circadian disruption isn't just tiredness-it causes measurable physiological damage. Yet millions of workers are required to fight their biology for shift schedules designed around production needs, not human needs.",
    sources: [
      { name: "Nurses' Health Study Results", url: "https://pubmed.ncbi.nlm.nih.gov/26444895/" },
      { name: "Circadian Disruption Research", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5479574/" }
    ],
    eeaBaseline: "Humans slept when it was dark and woke when it was light. Circadian rhythms synchronized with natural light/dark cycles for hundreds of thousands of years.",
    modernViolation: "24/7 economy requires workers to be awake when biology demands sleep. Rotating shifts prevent any adaptation. Bodies destroyed for economic convenience.",
    systemicCause: "Capitalism values 24/7 productivity over human biology. Night shift workers are disproportionately poor and have no choice. Health costs externalized."
  },

  // DISTRIBUTED CARE / PARENTING CASES
  {
    id: "transfer-trauma",
    name: "Transfer Trauma",
    year: "Ongoing",
    location: "Global",
    category: "distributed-care",
    headline: "Elderly relocated from long-term homes show 500% mortality spike-place attachment isn't sentiment, it's survival",
    summary: "Research documents that elderly people relocated from long-term residences-even to 'better' facilities-show mortality spikes up to 500% higher than matched controls. Place attachment isn't sentimental-it's physiological. Familiar environments reduce cognitive load and stress. Uprooting elderly people kills them, yet we do it routinely for economic and family convenience.",
    sources: [
      { name: "Transfer Trauma Research", url: "https://pubmed.ncbi.nlm.nih.gov/7342199/" },
      { name: "Relocation Stress Syndrome", url: "https://www.nursingtimes.net/clinical-archive/relocation-stress-syndrome-23-01-2006/" }
    ],
    eeaBaseline: "Elderly people remained in familiar environments, surrounded by lifelong community members, until death. Place and people were continuous.",
    modernViolation: "Elderly people moved from home to home as family circumstances change, from independent living to assisted living to nursing homes, each transition a mortal stress.",
    systemicCause: "Geographic mobility scatters families. Eldercare facilities designed for institutional efficiency. Each 'upgrade' may be a death sentence."
  },
  {
    id: "baby-sarang-kim",
    name: "Baby Sarang Kim",
    year: "2009",
    location: "South Korea",
    category: "distributed-care",
    headline: "3-month-old starved to death while parents spent 12 hours daily raising virtual baby in online game",
    summary: "A 3-month-old South Korean baby starved to death while her parents spent 12 hours daily at internet cafes raising a virtual child in an online game. They fed their digital daughter while their real daughter died. This isn't inexplicable evil-it's the logical endpoint of systems that make virtual worlds more rewarding than unbearably difficult real-world parenting without support.",
    sources: [
      { name: "The Guardian - Korean Baby Death", url: "https://www.theguardian.com/world/2010/mar/05/korean-girl-starved-death-parents-online-game" },
      { name: "BBC - Online Game Addiction", url: "https://www.bbc.com/news/10179015" }
    ],
    eeaBaseline: "Childcare was distributed across the tribe. Multiple caregivers ensured no infant was ever dependent on exhausted, isolated individuals.",
    modernViolation: "Parents alone with infant, no community support, exhausted and desperate. Virtual worlds offer achievement and escape that real parenting can't compete with.",
    systemicCause: "Nuclear family isolation leaves parents without support. Addictive game design creates supernormal stimuli. No safety net caught this family until death."
  },

  // TECHNOLOGY/ATTENTION CASES
  {
    id: "amanda-todd",
    name: "Amanda Todd",
    year: "2012",
    location: "British Columbia, Canada",
    category: "real-feedback",
    headline: "15-year-old cyberbullied for years after photo extortion, posted YouTube video explaining her pain, suicide one month later",
    summary: "Amanda Todd was 12 when she was manipulated into exposing herself online, then blackmailed with the images. For 3 years, the photos followed her to every new school, every new social media account. She made a YouTube video explaining her pain, holding up flashcards describing her torment. She died by suicide one month later. Digital permanence means one mistake as a child can haunt you forever.",
    sources: [
      { name: "CBC - Amanda Todd Story", url: "https://www.cbc.ca/news/canada/british-columbia/amanda-todd-1.5283715" },
      { name: "Her YouTube Video", url: "https://www.youtube.com/watch?v=vOHXGNx-E7E" }
    ],
    eeaBaseline: "Reputation existed within a tribe of ~150 who knew your whole story. Mistakes could be redeemed over time. Moving to a new group meant a fresh start.",
    modernViolation: "Digital evidence is permanent and follows you everywhere. One mistake at 12 can define you forever. There is no escape, no fresh start, no redemption.",
    systemicCause: "Platforms designed for permanence and virality. No meaningful age protection. Predators have global reach. No real consequences for digital harassment."
  },
  {
    id: "gaming-marathon-deaths",
    name: "Gaming Marathon Deaths",
    year: "2005-present",
    location: "Asia (multiple)",
    category: "closed-loops",
    headline: "Multiple deaths from 40+ hour gaming sessions-heart failure, blood clots, exhaustion in internet cafes",
    summary: "Multiple documented deaths across Asia from gaming sessions exceeding 40 hours-heart failure, blood clots, exhaustion. Victims die in internet cafes, sometimes unnoticed for hours. Internet cafes responded by installing timers, not questioning why games are more compelling than survival instincts. These games are engineered to be more engaging than anything the real world offers.",
    sources: [
      { name: "BBC - Gaming Deaths", url: "https://www.bbc.com/news/world-asia-pacific-12541769" },
      { name: "Washington Post - Marathon Gaming", url: "https://www.washingtonpost.com/news/morning-mix/wp/2015/01/19/taiwanese-man-dies-after-3-day-online-gaming-binge/" }
    ],
    eeaBaseline: "Natural activities had natural endpoints-ate until full, walked until arrived, played until tired. Body signals governed activity duration.",
    modernViolation: "Games engineered to override satiety signals. No natural completion point. Achievement loops more compelling than bodily needs. Literally designed to never let you stop.",
    systemicCause: "Game companies optimize for engagement metrics without limit. Real world offers no comparable achievement systems. Addiction is the business model."
  },

  // FOOD/METABOLISM CASES
  {
    id: "ultra-processed-food",
    name: "Ultra-Processed Food Mortality",
    year: "Meta-analysis",
    location: "Global",
    category: "real-feedback",
    headline: "Every 10% increase in ultra-processed food = 4% higher all-cause mortality; 62% of American diet is now engineered",
    summary: "Meta-analyses show every 10% increase in ultra-processed food consumption increases all-cause mortality by 4%. Ultra-processed foods now constitute 62% of the American diet. These are products engineered to override satiety signals, combining fat/sugar/salt in ratios that don't exist in nature, designed by food scientists to maximize consumption, not nutrition.",
    sources: [
      { name: "BMJ - Ultra-Processed Food Study", url: "https://www.bmj.com/content/365/bmj.l1949" },
      { name: "NIH - NOVA Classification", url: "https://pubmed.ncbi.nlm.nih.gov/30744710/" }
    ],
    eeaBaseline: "Food required effort to obtain and prepare. Satiety signals accurately reflected nutritional needs. Overconsumption was physically impossible.",
    modernViolation: "Food engineered to override satiety signals. 'Bliss points' calculated to maximize consumption. Cheap, convenient, and designed to be impossible to eat in moderation.",
    systemicCause: "Food industry profits from maximizing consumption. Regulation captured by industry. True costs externalized to healthcare system."
  },

  // MORE PSYCHIATRIC/MEDICAL CASES
  {
    id: "opioid-overdose-crisis",
    name: "Opioid Overdose Crisis",
    year: "1999-present",
    location: "United States",
    category: "visible-purpose",
    headline: "500,000+ Americans dead from opioid overdoses since 1999-pharmaceutical companies knew addiction was inevitable",
    summary: "Over 500,000 Americans have died from opioid overdoses since 1999, with pharmaceutical companies like Purdue Pharma deliberately marketing OxyContin as non-addictive while knowing otherwise. But this isn't just corporate malfeasance-it's demand meeting supply. People in despair seeking chemical escape from purposeless lives met companies happy to provide it.",
    sources: [
      { name: "CDC Opioid Data", url: "https://www.cdc.gov/drugoverdose/epidemic/index.html" },
      { name: "Empire of Pain (Sackler Investigation)", url: "https://www.penguinrandomhouse.com/books/612793/empire-of-pain-by-patrick-radden-keefe/" }
    ],
    eeaBaseline: "Pain was managed through community care, rest, and natural recovery. Chronic purposelessness was prevented by tribal belonging and meaningful work.",
    modernViolation: "Pills prescribed for both physical and existential pain. Chemical management of despair rather than addressing environmental causes.",
    systemicCause: "Healthcare system that bills for pills, not community. Pharma profits from addiction. Communities destroyed by deindustrialization left desperate for any relief."
  },
  {
    id: "teen-psychiatric-medication",
    name: "Teen Psychiatric Medication Surge",
    year: "2015-2023",
    location: "United States",
    category: "real-feedback",
    headline: "41% of teen girls and 20% of teen boys now take psychiatric medication-we're medicating environmental distress",
    summary: "Psychiatric medication use among US teens has surged, with 41% of teen girls and 20% of teen boys now taking medications for anxiety, depression, or ADHD. Rather than addressing why teens are anxious (social media, academic pressure, lack of purpose), we medicate them to tolerate intolerable conditions. The drugs may be necessary-but only because the environment is broken.",
    sources: [
      { name: "CDC Youth Mental Health Data", url: "https://www.cdc.gov/healthyyouth/mental-health/index.htm" },
      { name: "Express Scripts - Teen Medication Trends", url: "https://www.express-scripts.com/corporate/americas-state-mind-report" }
    ],
    eeaBaseline: "Adolescents transitioned to adult roles within supportive communities. Anxiety and uncertainty were managed through rituals, mentorship, and clear paths to adulthood.",
    modernViolation: "Teens face years of abstract credentialing with uncertain outcomes, social comparison via curated feeds, and no clear path to meaningful adulthood.",
    systemicCause: "Education system that delays adulthood. Social media that maximizes comparison. Job market that offers no security. Pills are cheaper than fixing any of this."
  },

  // ADDITIONAL CASES
  {
    id: "screen-time-toddlers",
    name: "Toddler Screen Time Crisis",
    year: "2024",
    location: "United States",
    category: "distributed-care",
    headline: "Average 2-year-old now gets 3+ hours daily screen time; AAP recommends zero-exhausted parents have no choice",
    summary: "Despite pediatric guidelines recommending zero screen time under 2, the average American 2-year-old now gets 3+ hours daily. This isn't parental failure-it's environmental reality. Without extended family help, with both parents working, screens become the only affordable 'babysitter.' We created conditions where screens are necessary, then blame parents for using them.",
    sources: [
      { name: "JAMA Pediatrics - Screen Time Study", url: "https://jamanetwork.com/journals/jamapediatrics/fullarticle/2722666" },
      { name: "AAP Screen Time Guidelines", url: "https://www.aap.org/en/patient-care/media-and-children/" }
    ],
    eeaBaseline: "Childcare was shared across extended family and tribe. No parent was alone with children for extended periods. Entertainment was interaction, not screens.",
    modernViolation: "Isolated parents, no extended family nearby, both parents working, childcare unaffordable. Screens become necessary survival tool for overwhelmed caregivers.",
    systemicCause: "No parental leave. Childcare costs exceed rent. Extended family scattered by economics. We demand screenless parenting without providing alternatives."
  },
  {
    id: "bullshit-jobs",
    name: "Bullshit Jobs Phenomenon",
    year: "2013-present",
    location: "Global",
    category: "visible-purpose",
    headline: "40% of workers believe their jobs are meaningless-we create work to justify paychecks, not because it needs doing",
    summary: "Anthropologist David Graeber's research found that roughly 40% of workers believe their jobs make no meaningful contribution to the world. These 'bullshit jobs'-administrative bloat, unnecessary management layers, pointless paperwork-exist not because the work needs doing but because we've tied survival to employment. People spend their lives on work they know is meaningless.",
    sources: [
      { name: "Bullshit Jobs Book", url: "https://www.simonandschuster.com/books/Bullshit-Jobs/David-Graeber/9781501143311" },
      { name: "Original Essay", url: "https://www.strike.coop/bullshit-jobs/" }
    ],
    eeaBaseline: "All work directly supported survival. Hunting provided food. Gathering provided food. Tool-making enabled hunting. Every task had visible, immediate purpose.",
    modernViolation: "Much modern work has no visible benefit to anyone. Workers know this but must perform meaninglessness to survive. Purpose replaced by paycheck.",
    systemicCause: "Employment as identity and survival mechanism. Automation should reduce work but instead creates pointless jobs. Dignity tied to 'having a job' regardless of meaning."
  },

  // Additional cases to reach 30+
  {
    id: "chronic-sleep-debt",
    name: "Global Sleep Deprivation Crisis",
    year: "2020-present",
    location: "Global",
    category: "closed-loops",
    headline: "1 in 3 adults are chronically sleep-deprived; artificial light and 24/7 connectivity override our circadian biology",
    summary: "The CDC reports that 1 in 3 American adults don't get enough sleep. Globally, sleep duration has decreased by 1-2 hours per night compared to a century ago. Electric lighting, screens, shift work, and the 'always on' culture override our evolved circadian rhythms. Sleep deprivation is linked to obesity, diabetes, heart disease, depression, and early mortality.",
    sources: [
      { name: "CDC Sleep Statistics", url: "https://www.cdc.gov/sleep/data-and-statistics/adults.html" },
      { name: "Sleep Foundation - Statistics", url: "https://www.sleepfoundation.org/how-sleep-works/sleep-facts-statistics" }
    ],
    eeaBaseline: "Humans slept with the sun cycle-darkness triggered melatonin, morning light woke us naturally. Sleep was protected by the environment itself.",
    modernViolation: "24/7 artificial lighting, screens emitting blue light, work demands at all hours, and entertainment options that never close override our biology.",
    systemicCause: "Economic systems that reward 'hustle culture' and 24/7 productivity. Technology designed for engagement without biological limits. Cities that never sleep."
  },
  {
    id: "childhood-obesity-crisis",
    name: "Childhood Obesity Epidemic",
    year: "1980-present",
    location: "Global",
    category: "closed-loops",
    headline: "Childhood obesity has tripled since 1975; children now develop 'adult' diseases like type 2 diabetes",
    summary: "Childhood obesity has nearly tripled worldwide since 1975. In the US, nearly 20% of children are obese. Children now develop type 2 diabetes, fatty liver disease, and hypertension-diseases that barely existed in children 50 years ago. This isn't about willpower; it's about environments engineered to make movement rare and hyperpalatable food abundant.",
    sources: [
      { name: "WHO Obesity Facts", url: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" },
      { name: "CDC Childhood Obesity", url: "https://www.cdc.gov/obesity/php/data-research/childhood-obesity-facts.html" }
    ],
    eeaBaseline: "Children ran, climbed, and played for hours daily. Food was whole, seasonal, and scarce enough that overconsumption wasn't possible.",
    modernViolation: "Children sit in schools, then sit in cars, then sit at screens. Food is engineered for maximum calorie consumption. 'Safety' means staying indoors.",
    systemicCause: "Car-dependent suburbs with no safe play areas. Schools that cut recess and PE. Food industry engineering hyperpalatable products. Screens designed for endless engagement."
  },
  {
    id: "friendship-recession",
    name: "The Friendship Recession",
    year: "2020-present",
    location: "United States",
    category: "social-structure",
    headline: "Americans' close friendships have declined by 50% since 1990; 15% of men report having no close friends",
    summary: "The Survey Center on American Life found that Americans report having fewer close friends than ever. The share of Americans with no close friends has quadrupled since 1990. 15% of men report having no close friends at all. Meanwhile, the average hours spent socializing has dropped dramatically. We're more connected digitally and more alone than ever.",
    sources: [
      { name: "Survey Center on American Life", url: "https://www.americansurveycenter.org/research/the-state-of-american-friendship-change-challenges-and-loss/" },
      { name: "The Atlantic - Friendship Recession", url: "https://www.theatlantic.com/ideas/archive/2022/05/american-friendship-crisis/629830/" }
    ],
    eeaBaseline: "Friendships formed automatically through shared daily life. You saw the same people every day while working, eating, playing. Friendship required no scheduling.",
    modernViolation: "Friendships now require calendar coordination, transportation, and energy after exhausting work. Digital substitutes create illusion of connection without substance.",
    systemicCause: "Car-dependent suburbs scatter people. Long work hours leave no time. Geographic mobility breaks bonds. Social media replaces quality with quantity."
  },
  {
    id: "parental-leave-usa",
    name: "Zero Paid Parental Leave",
    year: "1993-present",
    location: "United States",
    category: "distributed-care",
    headline: "The US is the only wealthy nation with zero guaranteed paid parental leave-forcing parents back to work within weeks of birth",
    summary: "The United States stands alone among developed nations in guaranteeing zero weeks of paid parental leave. The Family and Medical Leave Act only guarantees 12 weeks unpaid leave-and only for those at companies with 50+ employees. Many new parents return to work within 2 weeks of giving birth, leaving newborns in care of strangers or inadequate arrangements.",
    sources: [
      { name: "Pew Research - Parental Leave", url: "https://www.pewresearch.org/short-reads/2019/12/16/u-s-lacks-mandated-paid-parental-leave/" },
      { name: "OECD Family Database", url: "https://www.oecd.org/els/family/database.htm" }
    ],
    eeaBaseline: "New mothers were supported by extended family and community. Other adults held, fed, and cared for newborns. Mothers were never isolated with sole responsibility.",
    modernViolation: "Parents-especially mothers-must choose between income and caring for their infant. Economic survival demands returning to work while biologically still recovering.",
    systemicCause: "Economy that treats childcare as private problem. Corporate interests that lobbied against mandatory leave. Cultural narrative that 'strong' parents don't need help."
  },
  {
    id: "commute-hell",
    name: "The Extreme Commute",
    year: "2019",
    location: "United States",
    category: "visible-purpose",
    headline: "Average American spends 27 minutes each way commuting-some 'super commuters' travel 90+ minutes; this lost time is linked to divorce and depression",
    summary: "Americans spend an average of 27.6 minutes commuting each way-nearly an hour daily. 'Super commuters' (90+ minutes each way) have grown 15% in recent years. Long commutes correlate with higher divorce rates, lower life satisfaction, less exercise, and more obesity. We literally waste years of our lives traveling between home and work.",
    sources: [
      { name: "Census Bureau Commute Data", url: "https://www.census.gov/newsroom/press-releases/2021/one-way-travel-time-to-work-rises.html" },
      { name: "Study on Commuting and Divorce", url: "https://www.sciencedirect.com/science/article/abs/pii/S0094119011000131" }
    ],
    eeaBaseline: "Work happened where you lived. Commuting didn't exist. The separation of 'home' and 'work' into distant locations requiring travel is entirely modern.",
    modernViolation: "Housing unaffordable near jobs. Jobs concentrated in expensive urban centers. Hours lost daily in cars or trains, adding stress and stealing time from family and rest.",
    systemicCause: "Zoning that separates residential from commercial. Housing markets that price workers out of cities. Lack of public transit investment. Remote work resistance."
  },
  {
    id: "suburban-isolation",
    name: "Suburban Isolation Design",
    year: "1950-present",
    location: "United States",
    category: "social-structure",
    headline: "American suburbs were explicitly designed to separate people; cul-de-sacs and lack of sidewalks make casual social contact nearly impossible",
    summary: "Post-WWII suburban design prioritized cars over people, private yards over shared spaces, and separation over community. Cul-de-sacs, lack of sidewalks, strict zoning, and garage-facing homes mean many Americans never casually encounter neighbors. Studies show suburban residents have fewer friends and higher rates of social isolation than urban dwellers.",
    sources: [
      { name: "Suburban Nation Book", url: "https://www.amazon.com/Suburban-Nation-Rise-Sprawl-American/dp/0865477507" },
      { name: "Strong Towns - Suburban Isolation", url: "https://www.strongtowns.org/journal/2019/6/3/why-suburbia-works-against-us" }
    ],
    eeaBaseline: "Human settlements were designed around shared spaces-village commons, wells, markets. You couldn't avoid encountering your neighbors daily.",
    modernViolation: "Suburban design actively prevents casual encounter. No shared spaces. Cars as only transportation. Each family isolated on their plot.",
    systemicCause: "Post-war housing policy favoring car-dependent sprawl. Zoning laws mandating separation. Developer incentives for low-density, car-centric design."
  },
  {
    id: "teacher-attrition",
    name: "Mass Teacher Exodus",
    year: "2020-present",
    location: "United States",
    category: "visible-purpose",
    headline: "Teachers are leaving the profession at record rates-55% say they'll leave earlier than planned; those who stay report unprecedented burnout",
    summary: "A 2022 NEA survey found 55% of teachers plan to leave education earlier than planned-up from 37% pre-pandemic. Teachers cite low pay, lack of respect, political attacks, and impossible workloads. Average teacher tenure has dropped. Schools face massive shortages, with some states hiring people without teaching credentials. The people we trust with children's development are fleeing.",
    sources: [
      { name: "NEA Teacher Survey", url: "https://www.nea.org/sites/default/files/2022-02/NEA%20Member%20COVID-19%20Survey%20Summary.pdf" },
      { name: "EdWeek - Teacher Shortages", url: "https://www.edweek.org/teaching-learning/teacher-shortages-arent-just-a-covid-problem-heres-what-the-data-show/2022/09" }
    ],
    eeaBaseline: "Teaching children was distributed across the community. Knowledge passed through play, observation, and mentorship. No single person bore sole responsibility for 30 children.",
    modernViolation: "One teacher responsible for 25-35 children, 7 hours daily. Blamed for systemic failures. Underpaid while expected to be therapist, security guard, and entertainer.",
    systemicCause: "Defunding of public education. Political weaponization of teaching. Impossible accountability metrics. Society demanding teachers fix problems it created."
  },
  {
    id: "healthcare-burnout",
    name: "Healthcare Worker Burnout Crisis",
    year: "2020-present",
    location: "Global",
    category: "visible-purpose",
    headline: "Over 50% of healthcare workers report burnout; hospitals face mass resignations as those who heal others can't heal themselves",
    summary: "More than half of healthcare workers report symptoms of burnout. Nursing turnover reached 27% in 2021. Doctors have suicide rates 2x the general population. The pandemic accelerated a crisis that was already brewing: the people we trust to heal us are being destroyed by systems that treat them as disposable productivity units.",
    sources: [
      { name: "CDC - Healthcare Worker Mental Health", url: "https://www.cdc.gov/niosh/topics/healthcare/workplaceviol.html" },
      { name: "Mayo Clinic - Physician Burnout", url: "https://www.mayoclinicproceedings.org/article/S0025-6196(21)00744-8/fulltext" }
    ],
    eeaBaseline: "Healers worked within communities where they knew patients personally. They saw the results of their work. The community protected and valued them.",
    modernViolation: "12+ hour shifts with strangers. Endless documentation. Patients as 'throughput.' Moral injury from profit-driven care decisions. Personal sacrifice expected as default.",
    systemicCause: "Healthcare as profit center. Administrative bloat eating resources. EMR systems designed for billing not care. Staffing ratios set by accountants not healers."
  },
  {
    id: "quarter-life-crisis",
    name: "The Quarter-Life Crisis",
    year: "2000-present",
    location: "Global",
    category: "visible-purpose",
    headline: "75% of young adults report experiencing a 'quarter-life crisis'-feeling lost, directionless, and questioning life choices before age 35",
    summary: "Research shows roughly 75% of people aged 25-35 experience a 'quarter-life crisis'-intense anxiety about career, relationships, and life direction. Unlike previous generations who followed predictable paths (school → job → marriage → house), young adults face paradox of choice, economic precarity, and no clear milestones. It's not a phase-it's the rational response to an illegible future.",
    sources: [
      { name: "LinkedIn Quarter-Life Crisis Survey", url: "https://news.linkedin.com/2017/11/linkedin-s-quarter-life-crisis" },
      { name: "Psychology Today - Quarter-Life Crisis", url: "https://www.psychologytoday.com/us/basics/quarter-life-crisis" }
    ],
    eeaBaseline: "Life paths were clear and communally validated. You became an adult through known rituals. Your role was defined by your community. 'What should I do with my life?' wasn't a question.",
    modernViolation: "Infinite career options but no guidance. Economic precarity making milestones unreachable. Social media showing curated highlight reels. No elders providing direction.",
    systemicCause: "Collapse of predictable life paths. Student debt delaying adulthood. Housing costs preventing independence. Gig economy removing career ladders."
  },
  {
    id: "retirement-crisis",
    name: "The Retirement Mortality Spike",
    year: "1990-present",
    location: "Global",
    category: "visible-purpose",
    headline: "Studies show retirement increases mortality risk by 20% and accelerates cognitive decline-we evolved to be useful, not leisured",
    summary: "Multiple studies show that retirement increases mortality risk. A meta-analysis found retirement increases risk of death by 20% in early years. Retirees show accelerated cognitive decline and higher rates of depression. The 'golden years' narrative hides a darker reality: humans evolved to be useful members of their community, and being told you're no longer needed can be fatal.",
    sources: [
      { name: "BMJ - Retirement and Mortality", url: "https://jech.bmj.com/content/73/4/337" },
      { name: "Harvard Study on Retirement", url: "https://www.health.harvard.edu/blog/is-retirement-good-for-health-or-bad-for-it-2016100310178" }
    ],
    eeaBaseline: "Elderly people contributed wisdom, childcare, and specialized knowledge until death. 'Retirement' didn't exist-you mattered until the end.",
    modernViolation: "Arbitrary age cutoff declares people useless. Removed from work identity. Isolated from daily social structure. Expected to enjoy purposeless 'leisure.'",
    systemicCause: "Industrial economy that values productivity over wisdom. Mandatory retirement ages. Pension systems that require departure. Youth-focused culture devaluing experience."
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
            These aren't broken individuals-they're predictable outcomes of broken systems.
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
                These cases illustrate <strong>environmental mismatch</strong>-the gap between what humans evolved for and the conditions we actually live in. Each case is categorized by the core need being violated:
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
