"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";

// Mismatch categories - named after the actual mismatch, not the domain
const CATEGORIES = [
  {
    id: "all",
    name: "All Cases",
    color: "#1a1a1a",
    description: "All documented cases of environmental mismatch"
  },
  {
    id: "social-disconnection",
    name: "Social Disconnection",
    color: "#dc2626",
    description: "Loss of meaningful human bonds, touch deprivation, and isolation from community"
  },
  {
    id: "purpose-deprivation",
    name: "Purpose Deprivation",
    color: "#7c3aed",
    description: "Loss of meaning, role, and visible impact from one's work and existence"
  },
  {
    id: "autonomy-erosion",
    name: "Autonomy Erosion",
    color: "#ea580c",
    description: "Loss of control over daily decisions, schedules, and personal agency"
  },
  {
    id: "circadian-disruption",
    name: "Circadian Disruption",
    color: "#2563eb",
    description: "Forced opposition to natural sleep-wake cycles and light exposure patterns"
  },
  {
    id: "movement-deprivation",
    name: "Movement Deprivation",
    color: "#16a34a",
    description: "Sedentary confinement and loss of natural physical activity patterns"
  },
  {
    id: "nutritional-mismatch",
    name: "Nutritional Mismatch",
    color: "#854d0e",
    description: "Replacement of ancestral foods with industrial products the body cannot process"
  },
  {
    id: "attention-hijacking",
    name: "Attention Hijacking",
    color: "#0891b2",
    description: "Algorithmic exploitation of attention and information overwhelm"
  },
  {
    id: "nature-severance",
    name: "Nature Severance",
    color: "#15803d",
    description: "Disconnection from natural environments, light, and biophilic needs"
  },
  {
    id: "community-collapse",
    name: "Community Collapse",
    color: "#be185d",
    description: "Erosion of belonging, cultural continuity, and intergenerational connection"
  },
];

interface Case {
  id: string;
  title: string;
  year: string;
  location: string;
  category: string;
  summary: string;
  stat: string;
  statLabel: string;
  oneLiner: string;
  keyFinding?: string;
  environmentIgnored?: string;
  sources?: string[];
  image: string;
  imageAlt: string;
}

// Comprehensive cases database - 60+ cases
const CASES: Case[] = [
  // SOCIAL DISCONNECTION
  {
    id: "spitz-hospitalism",
    title: "Spitz Hospitalism Studies",
    year: "1945",
    location: "South America",
    category: "social-disconnection",
    summary: "Babies in clean, well-fed orphanages dying at rates of 30-37%. Staff rarely spoke to or held the children. The only variable missing: human touch.",
    stat: "1 in 3",
    statLabel: "infants died",
    oneLiner: "They had food, shelter, and medical care. They didn't have arms around them. They died anyway.",
    keyFinding: "Babies require touch to survive. This is not optional. This is not psychological. This is biological.",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800",
    imageAlt: "Empty hospital crib",
    sources: ["Spitz, R.A. (1945) Hospitalism: Psychoanalytic Study of the Child"]
  },
  {
    id: "romanian-orphanages",
    title: "Romanian Orphanage Crisis",
    year: "1989-present",
    location: "Romania",
    category: "social-disconnection",
    summary: "170,000+ children warehoused in state orphanages. Brain scans showed physical damage—reduced grey and white matter. Children might see 17 different caretakers in a week.",
    stat: "170,000+",
    statLabel: "children affected",
    oneLiner: "The institution met their physical needs. Their brains needed to be known.",
    keyFinding: "Children placed in foster care before age 2 showed significant recovery. After age 2, damage was largely irreversible.",
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800",
    imageAlt: "Child alone looking through window",
    sources: ["Bucharest Early Intervention Project (Harvard/Tulane)"]
  },
  {
    id: "widowhood-effect",
    title: "The Widowhood Effect",
    year: "2008",
    location: "United States",
    category: "social-disconnection",
    summary: "NIH study of 370,000+ couples: when a spouse dies, the surviving partner faces dramatically elevated mortality. Men face 70% higher risk, women 27%.",
    stat: "66%",
    statLabel: "increased mortality in 90 days",
    oneLiner: "You can literally die from losing the person who knew you.",
    keyFinding: "'Dying of a broken heart' is not poetry. It's biology. Takotsubo cardiomyopathy causes actual heart muscle damage from grief.",
    image: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=800",
    imageAlt: "Elderly person sitting alone",
    sources: ["National Institutes of Health 2008"]
  },
  {
    id: "kodokushi",
    title: "Kodokushi (Lonely Death)",
    year: "2024",
    location: "Japan",
    category: "social-disconnection",
    summary: "37,227 people found dead alone in just the first half of 2024. 130 bodies remained undiscovered for over a year. 70% were elderly.",
    stat: "76,000+",
    statLabel: "lonely deaths projected for 2024",
    oneLiner: "His rent was paid automatically. His life wasn't.",
    keyFinding: "In a village, your absence is noticed within hours. In modern Japan, your corpse can decompose for three years.",
    image: "https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=800",
    imageAlt: "Empty apartment room",
    sources: ["National Police Agency Japan 2024"]
  },
  {
    id: "hikikomori",
    title: "Hikikomori Epidemic",
    year: "2022",
    location: "Japan",
    category: "social-disconnection",
    summary: "1.46 million Japanese living in complete social withdrawal, often confined to a single room for years. 34.7% withdrawn for 7+ years—doubled from 2010.",
    stat: "1.46M",
    statLabel: "people withdrawn",
    oneLiner: "Unable to meet impossible expectations, they withdrew. Society now publishes guides for when their parents' bodies decompose.",
    keyFinding: "These aren't people with a disorder. They're people who found the container unbearable.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
    imageAlt: "Dark room with computer glow",
    sources: ["Japan Cabinet Office 2022"]
  },
  {
    id: "solitary-confinement",
    title: "Solitary Confinement Psychosis",
    year: "2020",
    location: "United States",
    category: "social-disconnection",
    summary: "Systematic review of 382,440 inmates: solitary confinement increases self-harm, suicide, and permanent brain changes. The hippocampus physically shrinks.",
    stat: "12x",
    statLabel: "more likely to die by suicide",
    oneLiner: "The walls weren't closing in. His brain was.",
    keyFinding: "No torture required. Just absence of human contact. The brain requires social input to maintain coherence.",
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800",
    imageAlt: "Empty cell with barred window",
    sources: ["Frontiers in Psychiatry 2020"]
  },
  {
    id: "covid-isolation-deaths",
    title: "COVID Isolation Deaths",
    year: "2020-2021",
    location: "United States",
    category: "social-disconnection",
    summary: "Pandemic isolation projected 75,000 'deaths of despair.' Anxiety rose from 8% to 25.5%. Social isolation listed as contributing cause of death for nursing home residents—unprecedented.",
    stat: "75,000",
    statLabel: "projected deaths of despair",
    oneLiner: "We locked them away to save their lives. Some died from the saving.",
    keyFinding: "Minnesota recorded first-ever death certificates citing 'social isolation' as cause of death.",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800",
    imageAlt: "Person looking through window during lockdown",
    sources: ["Petterson et al. 2020, The Lancet"]
  },
  {
    id: "nursing-home-touch",
    title: "Nursing Home Touch Deprivation",
    year: "2020-2021",
    location: "United States",
    category: "social-disconnection",
    summary: "COVID restrictions led to 15% increase in depression, 150% increase in weight loss among residents. 76% felt lonelier. Touch is critical for dementia patients.",
    stat: "150%",
    statLabel: "increase in weight loss",
    oneLiner: "The isolation robbed them of whatever good days they had left.",
    keyFinding: "Just 5 minutes of hand massage reduces cortisol and raises serotonin in dementia patients.",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800",
    imageAlt: "Elderly hands reaching out",
    sources: ["Altarum Survey 2020"]
  },
  {
    id: "holt-lunstad-loneliness",
    title: "Loneliness Mortality Meta-Analysis",
    year: "2015",
    location: "Global",
    category: "social-disconnection",
    summary: "Landmark analysis of 308,849 participants: loneliness and social isolation are mortality risk factors equivalent to smoking 15 cigarettes daily.",
    stat: "50%",
    statLabel: "higher survival with strong social ties",
    oneLiner: "Lacking social connection is now a clinical risk factor for death.",
    keyFinding: "Social isolation increases mortality by 29%, loneliness by 26%, living alone by 32%.",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800",
    imageAlt: "Person sitting alone on bench",
    sources: ["Holt-Lunstad et al., BYU 2015"]
  },
  {
    id: "bridgend-cluster",
    title: "Bridgend Suicide Cluster",
    year: "2007-2008",
    location: "Wales, UK",
    category: "social-disconnection",
    summary: "10 young people (15-34) died by suicide in 2 months. Media reporting and social contagion identified as transmission mechanisms. Statistically significant cluster (p=0.029).",
    stat: "10",
    statLabel: "deaths in 2 months",
    oneLiner: "Suicide spread like a virus through their social network.",
    keyFinding: "Up to 2% of youth suicides occur in clusters close in time and space.",
    image: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=800",
    imageAlt: "Empty town street at dusk",
    sources: ["PLOS One 2013"]
  },

  // PURPOSE DEPRIVATION
  {
    id: "whitehall-studies",
    title: "The Whitehall Studies",
    year: "1967-present",
    location: "United Kingdom",
    category: "purpose-deprivation",
    summary: "17,500+ civil servants: mortality 3x higher for lowest employment grades vs highest—regardless of lifestyle. Traditional risk factors explained only 40% of the difference.",
    stat: "3.6x",
    statLabel: "higher heart disease in lowest grade",
    oneLiner: "The executives weren't dying of stress. The messengers were dying of powerlessness.",
    keyFinding: "It wasn't stress killing people. It was lack of control, autonomy, and visible impact.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800",
    imageAlt: "Office hierarchy cubicles",
    sources: ["Sir Michael Marmot, UCL"]
  },
  {
    id: "ikigai-mortality",
    title: "Ikigai & Mortality Study",
    year: "2008",
    location: "Japan",
    category: "purpose-deprivation",
    summary: "43,391 Japanese adults followed 7 years: those without ikigai (life purpose) had 1.5x higher all-cause mortality and 60% higher cardiovascular death.",
    stat: "1.5x",
    statLabel: "higher mortality without purpose",
    oneLiner: "Without a reason to wake up, the body stops bothering.",
    keyFinding: "Effect particularly strong for men. Purpose appears to be a biological requirement.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    imageAlt: "Person staring out window pensively",
    sources: ["Ohsaki Cohort Study 2008"]
  },
  {
    id: "retirement-mortality",
    title: "Early Retirement Mortality",
    year: "2000-2018",
    location: "United States/Germany",
    category: "purpose-deprivation",
    summary: "Shell Oil study: retiring at 55 doubled death risk before 65 vs working past 60. German study of 88,399: early retirement increases premature death risk 13.4%.",
    stat: "2x",
    statLabel: "death risk retiring at 55",
    oneLiner: "They called it 'freedom.' Their bodies called it abandonment.",
    keyFinding: "Mortality increases 1.5% at age 62 when Americans become retirement-eligible.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    imageAlt: "Empty desk with packed box",
    sources: ["NBER, Shell Oil cohort study"]
  },
  {
    id: "veteran-suicide",
    title: "Veteran Transition Crisis",
    year: "2022",
    location: "United States",
    category: "purpose-deprivation",
    summary: "Veterans at 57% higher suicide risk. First year after military most vulnerable (46.2 per 100,000). 80% say civilians don't understand them. 54% had no VA contact before death.",
    stat: "57%",
    statLabel: "higher suicide risk",
    oneLiner: "In uniform, they had purpose. Out of it, they had nothing.",
    keyFinding: "Veterans struggling with civilian transition 5x more likely to have suicidal thoughts.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800",
    imageAlt: "Soldier silhouette facing away",
    sources: ["Stop Soldier Suicide, VA"]
  },
  {
    id: "bullshit-jobs",
    title: "Bullshit Jobs Phenomenon",
    year: "2018",
    location: "Global",
    category: "purpose-deprivation",
    summary: "19% of US workers believe their jobs have no social value. They report 'profound psychological violence' despite good pay and benefits.",
    stat: "19%",
    statLabel: "see their job as pointless",
    oneLiner: "I was suicidal even though I owned a home and had a fiancée. The job was killing me.",
    keyFinding: "Depression and suicidal ideation correlated with perceived job uselessness, not pay.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
    imageAlt: "Empty office cubicle farm",
    sources: ["David Graeber, 'Bullshit Jobs' 2018"]
  },

  // AUTONOMY EROSION
  {
    id: "amazon-warehouse-deaths",
    title: "Amazon Warehouse Deaths",
    year: "2022",
    location: "United States",
    category: "autonomy-erosion",
    summary: "Three workers died at separate warehouses within weeks during heat wave. Rafael Mota Frias pleaded for fans before dying. Cardboard was placed around one body while operations continued.",
    stat: "3",
    statLabel: "deaths in weeks",
    oneLiner: "Cardboard was placed around the body as a screen, and operations continued.",
    keyFinding: "Amazon workers injured at rate 2x all other warehouse workers. Weekly turnover: 3%.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
    imageAlt: "Warehouse worker among boxes",
    sources: ["NBC News, OSHA investigations"]
  },
  {
    id: "rana-plaza",
    title: "Rana Plaza Collapse",
    year: "2013",
    location: "Bangladesh",
    category: "autonomy-erosion",
    summary: "1,134 deaths when garment factory collapsed. Building evacuated day before due to cracks—management threatened to withhold pay if workers didn't return.",
    stat: "1,134",
    statLabel: "deaths",
    oneLiner: "They saw the cracks. They were told to ignore them or lose their pay.",
    keyFinding: "Deadliest garment factory disaster and deadliest structural failure in modern history.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    imageAlt: "Garment factory workers",
    sources: ["ILO, Harvard Business School"]
  },
  {
    id: "foxconn-suicides",
    title: "Foxconn Suicide Wave",
    year: "2010",
    location: "China",
    category: "autonomy-erosion",
    summary: "14 deaths among 400,000 workers at Apple supplier. 12-hour shifts, 100-hour weeks, $1-2/hour. Company response: suicide nets and no-suicide pledges.",
    stat: "14",
    statLabel: "deaths",
    oneLiner: "Machines have seemingly held humans captive.",
    keyFinding: "20 Chinese universities described conditions as 'labor camp.' Workers stood 'like punishment' for 8 hours.",
    image: "https://images.unsplash.com/photo-1567789884554-0b844b597180?w=800",
    imageAlt: "Factory assembly line",
    sources: ["20 Chinese universities report"]
  },
  {
    id: "china-996",
    title: "China 996 Work Deaths",
    year: "2021",
    location: "China",
    category: "autonomy-erosion",
    summary: "Pinduoduo employee (23) collapsed past midnight after 300+ hours/month. ByteDance employee (28) died after gym. 996 system: 9am-9pm, 6 days/week.",
    stat: "300+",
    statLabel: "hours/month worked",
    oneLiner: "The work schedule was declared illegal. The deaths continued.",
    keyFinding: "996 declared illegal in 2021 by Chinese Supreme Court. Enforcement remains questionable.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
    imageAlt: "Office at night with lights on",
    sources: ["NPR, South China Morning Post"]
  },
  {
    id: "karoshi",
    title: "Karoshi (Overwork Death)",
    year: "2024",
    location: "Japan",
    category: "autonomy-erosion",
    summary: "1,304 recognized karoshi cases in 2024—record high. Globally, WHO/ILO estimate 750,000 deaths from working 55+ hours/week. 1 in 5 Japanese workers at karoshi risk.",
    stat: "750,000",
    statLabel: "global deaths from overwork",
    oneLiner: "They worked themselves to death. Literally.",
    keyFinding: "Miwa Sado logged 159 overtime hours before her heart failure death.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
    imageAlt: "Person slumped at desk late night",
    sources: ["Japan Ministry of Health, WHO/ILO 2021"]
  },
  {
    id: "call-center-deaths",
    title: "Call Center Worker Deaths",
    year: "2021",
    location: "Philippines/India",
    category: "autonomy-erosion",
    summary: "BPO workers dying from cardiac arrests linked to sleep deprivation. Filipino agents average 5.8 hours sleep. One collapsed during 8pm-6am shift and died.",
    stat: "80%",
    statLabel: "attrition rate",
    oneLiner: "The constant lack of sleep accumulated over years until their hearts gave out.",
    keyFinding: "83% of India BPO workers have sleep disorders vs 39.5% general population.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800",
    imageAlt: "Call center at night",
    sources: ["ILO, Philippine Employees' Compensation Commission"]
  },

  // CIRCADIAN DISRUPTION
  {
    id: "nurses-night-shift",
    title: "Nurses' Health Study",
    year: "1988-2010",
    location: "United States",
    category: "circadian-disruption",
    summary: "74,862 nurses followed 22 years. 14,181 deaths. Women with 5+ years rotating night shifts showed significantly increased mortality. WHO calls shift work a 'probable carcinogen.'",
    stat: "38%",
    statLabel: "higher CVD mortality (15+ years)",
    oneLiner: "They kept patients alive through the night. The night shifts took years off their own lives.",
    keyFinding: "IARC classified night shift work as 'probably carcinogenic to humans' (Group 2A).",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
    imageAlt: "Nurse in hospital corridor at night",
    sources: ["Nurses' Health Study, IARC"]
  },
  {
    id: "iarc-night-shift",
    title: "Night Shift Carcinogen Classification",
    year: "2019",
    location: "Global",
    category: "circadian-disruption",
    summary: "WHO's cancer agency classified night shift work as 'probably carcinogenic' based on breast, prostate, colon cancer evidence. Mechanism: melatonin suppression.",
    stat: "20%",
    statLabel: "of global workforce exposed",
    oneLiner: "1 in 5 workers worldwide are exposed to a probable carcinogen every shift.",
    keyFinding: "Strongest evidence for breast cancer in women. Affects circadian rhythm, immune function.",
    image: "https://images.unsplash.com/photo-1516733968668-dbdce39c0c2f?w=800",
    imageAlt: "Night shift worker under artificial light",
    sources: ["IARC Monographs Volume 124"]
  },
  {
    id: "trucker-fatigue",
    title: "Truck Driver Fatigue Deaths",
    year: "2017",
    location: "United States",
    category: "circadian-disruption",
    summary: "Sleep deprivation factor in 30-40% of heavy truck crashes. Study of 80 long-haul drivers: average <5 hours sleep daily. 24 hours awake = 0.10% BAC impairment.",
    stat: "91,000",
    statLabel: "drowsy driving crashes/year",
    oneLiner: "For each truck driver fatality, another 3-4 people are killed.",
    keyFinding: "NTSB found drowsy driving caused over half of crashes leading to driver death.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
    imageAlt: "Truck on highway at night",
    sources: ["NTSB, NHTSA, FMCSA"]
  },

  // MOVEMENT DEPRIVATION
  {
    id: "sitting-disease",
    title: "Occupational Sitting Mortality",
    year: "2024",
    location: "Global",
    category: "movement-deprivation",
    summary: "481,688 participants: those who 'mostly sat' had 16% higher all-cause mortality, 34% higher CVD mortality. Even exercise didn't fully offset risk.",
    stat: "34%",
    statLabel: "higher CVD mortality",
    oneLiner: "Sitting is the new smoking. But nobody's making you take smoke breaks.",
    keyFinding: "Inflection point at 10.6 hours/day sitting. 26,257 deaths documented in study.",
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800",
    imageAlt: "Office workers at desks",
    sources: ["JAMA Network Open 2024"]
  },
  {
    id: "coal-miners-lung",
    title: "Coal Miners Black Lung",
    year: "1970-2016",
    location: "United States",
    category: "movement-deprivation",
    summary: "75,178 miners died with black lung 1970-2016. Modern miners face 8x higher respiratory death odds. NIOSH confirmed largest PMF cluster ever in 2018.",
    stat: "75,178",
    statLabel: "deaths",
    oneLiner: "Modern coal miners have higher death rates than their predecessors.",
    keyFinding: "21% of long-tenured Central Appalachia workers show radiographic evidence of disease.",
    image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800",
    imageAlt: "Coal mine entrance",
    sources: ["CDC/NIOSH"]
  },

  // NUTRITIONAL MISMATCH
  {
    id: "ultra-processed-mortality",
    title: "Ultra-Processed Food Deaths",
    year: "2025",
    location: "United States",
    category: "nutritional-mismatch",
    summary: "Meta-analysis of 8 countries: 10% increase in UPF = 2.7% increased mortality. US: 124,000+ preventable deaths annually linked to UPF. 14% of premature deaths.",
    stat: "124,000+",
    statLabel: "preventable deaths/year in US",
    oneLiner: "We didn't change. The food changed. The bodies are keeping score.",
    keyFinding: "Highest risks: processed meats, sugary breakfast foods, artificially sweetened beverages.",
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800",
    imageAlt: "Fast food meal",
    sources: ["American Journal of Preventive Medicine 2025"]
  },
  {
    id: "harvard-upf-study",
    title: "Harvard UPF 34-Year Study",
    year: "2024",
    location: "United States",
    category: "nutritional-mismatch",
    summary: "74,563 women, 39,501 men followed 34 years. Highest UPF consumers: 4% higher all-cause mortality, 9% higher non-cancer/CVD mortality.",
    stat: "48,000+",
    statLabel: "deaths documented",
    oneLiner: "Your great-grandmother wouldn't recognize what you call food.",
    keyFinding: "Effect strongest for non-cancer, non-CVD causes—suggesting broader systemic damage.",
    image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800",
    imageAlt: "Processed food aisle",
    sources: ["Harvard T.H. Chan School of Public Health, BMJ 2024"]
  },

  // ATTENTION HIJACKING
  {
    id: "molly-russell",
    title: "Molly Russell",
    year: "2017",
    location: "United Kingdom",
    category: "attention-hijacking",
    summary: "14-year-old viewed 2,100+ Instagram posts about depression, self-harm, and suicide before her death. She hadn't searched for it. The algorithm fed it to her.",
    stat: "2,100+",
    statLabel: "harmful posts served",
    oneLiner: "The algorithm saw her vulnerability and monetized it.",
    keyFinding: "Pinterest sent emails: '10 depression pins you might like.' Coroner ruled online content contributed to death.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800",
    imageAlt: "Phone screen glowing in dark",
    sources: ["UK Coroner's Court 2022"]
  },
  {
    id: "amanda-todd",
    title: "Amanda Todd",
    year: "2012",
    location: "Canada",
    category: "attention-hijacking",
    summary: "15-year-old died by suicide after years of blackmail. At 12, a stranger captured an image and stalked her for years, distributing it whenever she moved schools.",
    stat: "Years",
    statLabel: "of inescapable pursuit",
    oneLiner: "In a village, shame completes and you move on. Online, it follows you forever.",
    keyFinding: "Every time she moved schools, the stranger found her. There was no fresh start.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800",
    imageAlt: "Social media notifications",
    sources: ["Aydin Coban conviction"]
  },
  {
    id: "teen-suicide-social-media",
    title: "Teen Suicide & Social Media",
    year: "2007-2021",
    location: "United States",
    category: "attention-hijacking",
    summary: "Youth suicide rose 62% from 2007-2021. Teen girls 10-14 saw 131% jump. 22% of high schoolers considered suicide in 2021 vs 16% in 2011.",
    stat: "131%",
    statLabel: "increase for girls 10-14",
    oneLiner: "Around 2010-11, smartphones took off. So did the death rate.",
    keyFinding: "Suicide rate for 10-14 year-olds tripled 2007-2021, coinciding with smartphone adoption.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    imageAlt: "Teenagers on phones",
    sources: ["CDC, Jonathan Haidt"]
  },
  {
    id: "instagram-eating-disorders",
    title: "Instagram Eating Disorder Harm",
    year: "2021",
    location: "Global",
    category: "attention-hijacking",
    summary: "Facebook whistleblower revealed internal research: 'We make body issues worse for one in three girls.' 13-year-old searching 'healthy recipes' led to graphic ED content.",
    stat: "1 in 3",
    statLabel: "girls felt worse about bodies",
    oneLiner: "An innocent search for healthy recipes led to accounts named 'eternally starved.'",
    keyFinding: "1,961 lawsuits pending against Meta. 70%+ filed specifically against them.",
    image: "https://images.unsplash.com/photo-1585282263861-f55e341878f8?w=800",
    imageAlt: "Person scrolling social media",
    sources: ["Frances Haugen whistleblower, Facebook Papers"]
  },
  {
    id: "gaming-deaths",
    title: "Gaming Marathon Deaths",
    year: "2002-2021",
    location: "Asia",
    category: "attention-hijacking",
    summary: "24 documented gaming deaths: 18 in internet cafes. First case 2002: 86 hours straight. 2005: Seungseob Lee died after 50 hours of StarCraft.",
    stat: "24",
    statLabel: "documented deaths",
    oneLiner: "The game gave him purpose, challenge, and connection. His real life offered none of these.",
    keyFinding: "23 of 24 victims male. In some cases, other gamers continued playing around the corpse.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    imageAlt: "Gaming setup at night",
    sources: ["BMC Psychiatry 2022"]
  },
  {
    id: "distracted-walking-deaths",
    title: "Smartphone Distracted Walking Deaths",
    year: "2021",
    location: "United States",
    category: "attention-hijacking",
    summary: "2,500 pedestrian deaths where phone distraction was a factor. Injuries from phone use doubled since 2004. Pedestrian deaths climbed 42% in a decade.",
    stat: "2,500",
    statLabel: "deaths in 2021",
    oneLiner: "They were looking at their phones. The cars weren't looking at them.",
    keyFinding: "Texting delays crossing by 2 seconds, causes 4x more unsafe behaviors.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    imageAlt: "Person walking while texting",
    sources: ["AAA Foundation, National Safety Council"]
  },

  // NATURE SEVERANCE
  {
    id: "nurses-green-space",
    title: "Green Space Mortality Study",
    year: "2008-2016",
    location: "United States",
    category: "nature-severance",
    summary: "121,000 women: those in highest green space areas were 12% less likely to die during 8-year follow-up. Mental health, not exercise, was the driver.",
    stat: "12%",
    statLabel: "mortality reduction",
    oneLiner: "The trees weren't exercising for them. They were calming their minds.",
    keyFinding: "Effect mediated primarily through mental health/depression, not physical activity.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    imageAlt: "Sunlight through forest trees",
    sources: ["Nurses' Health Study, Harvard"]
  },
  {
    id: "nature-deficit-adhd",
    title: "Nature Deficit & ADHD",
    year: "2008",
    location: "United States",
    category: "nature-severance",
    summary: "Richard Louv coined 'nature-deficit disorder': children average 4-7 min/day outdoors vs 7+ hours on screens. Studies show nature relieves ADHD symptoms.",
    stat: "4-7 min",
    statLabel: "outdoors daily for children",
    oneLiner: "We removed nature from childhood and wondered why children couldn't pay attention.",
    keyFinding: "Forest exposure reduces cortisol in 20 minutes. ADHD symptoms improve in green spaces.",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800",
    imageAlt: "Child in nature",
    sources: ["Richard Louv, Children & Nature Network"]
  },
  {
    id: "artificial-light-health",
    title: "Artificial Light at Night",
    year: "Ongoing",
    location: "Global",
    category: "nature-severance",
    summary: "83% of world population lives under light-polluted skies. Blue light after sunset suppresses melatonin by up to 85%. Correlates with cancer, obesity, depression.",
    stat: "85%",
    statLabel: "melatonin suppression",
    oneLiner: "We engineered darkness out of our lives and called the consequences mental illness.",
    keyFinding: "The body has no way to know what time it is except through light. We broke that signal.",
    image: "https://images.unsplash.com/photo-1514897575457-c4db467cf78e?w=800",
    imageAlt: "City lights at night",
    sources: ["WHO, IARC"]
  },

  // COMMUNITY COLLAPSE
  {
    id: "roseto-effect",
    title: "The Roseto Effect",
    year: "1955-1985",
    location: "Pennsylvania, USA",
    category: "community-collapse",
    summary: "Italian-American town with half the heart disease despite identical diet, smoking, exercise. Only difference: tight-knit community. When cohesion eroded, heart disease matched neighbors.",
    stat: "50%",
    statLabel: "less heart disease",
    oneLiner: "Same diet, same smoking, same genes. Different community. Half the heart attacks.",
    keyFinding: "The 'Roseto Effect' disappeared when the community did.",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800",
    imageAlt: "Community gathering at table",
    sources: ["Wolf & Bruhn 1992"]
  },
  {
    id: "deaths-of-despair",
    title: "Deaths of Despair",
    year: "1998-present",
    location: "United States",
    category: "community-collapse",
    summary: "500,000+ middle-aged white Americans dead from suicide, overdose, alcohol. US life expectancy declined 3 years—unprecedented. 70,000+ deaths annually now.",
    stat: "500,000+",
    statLabel: "deaths since 1998",
    oneLiner: "They didn't die from lack of money. They died from lack of a reason to be alive.",
    keyFinding: "It's not poverty. It's loss of: jobs, marriage, community, church, purpose.",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800",
    imageAlt: "Abandoned main street",
    sources: ["Case & Deaton 2020"]
  },
  {
    id: "alaska-native-suicide",
    title: "Alaska Native Suicide Crisis",
    year: "1960-present",
    location: "Alaska",
    category: "community-collapse",
    summary: "Suicide nearly unheard of through 1959. Then increased 500% during rapid social transition. Alaska Natives die by suicide at 4x US average.",
    stat: "500%",
    statLabel: "increase 1960-1995",
    oneLiner: "Before contact, suicide was unknown. After assimilation, it became the second cause of death.",
    keyFinding: "Cultural disconnection, alienation, pressure to assimilate all contribute.",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800",
    imageAlt: "Remote Alaska landscape",
    sources: ["Suicide Prevention Resource Center"]
  },
  {
    id: "aboriginal-suicide",
    title: "Australian Aboriginal Suicide",
    year: "2014",
    location: "Australia",
    category: "community-collapse",
    summary: "Aboriginal youth suicide 3x higher under 18, 12x higher under 15. Kimberley region: 174 per 100,000—one of world's highest. Stolen Generations a major driver.",
    stat: "174",
    statLabel: "per 100,000 in Kimberley",
    oneLiner: "Connection to culture reduces suicide 44%. They took that connection away.",
    keyFinding: "Even in poverty, cultural connection protects. Disconnection kills.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    imageAlt: "Australian outback",
    sources: ["AIHW, Professor Pat Dudgeon"]
  },
  {
    id: "blue-zones-decline",
    title: "Blue Zones in Decline",
    year: "2020s",
    location: "Okinawa, Sardinia",
    category: "community-collapse",
    summary: "Blue Zone longevity hotspots are fading. Okinawa male longevity now ranked 26th of 47 Japanese prefectures. Traditional moai support groups disappearing.",
    stat: "26th",
    statLabel: "Okinawa's longevity ranking now",
    oneLiner: "The centenarians are dying. So is everything that kept them alive.",
    keyFinding: "Lacking strong relationships as damaging as smoking 15 cigarettes daily.",
    image: "https://images.unsplash.com/photo-1545126178-862cdb469409?w=800",
    imageAlt: "Elderly people in community",
    sources: ["Dan Buettner, Harvard Medical School"]
  },
  {
    id: "postpartum-isolation",
    title: "Postpartum Isolation Deaths",
    year: "2010-2023",
    location: "United States",
    category: "community-collapse",
    summary: "Suicide is leading cause of maternal mortality—20% of postpartum deaths. Attempts tripled over past decade. Isolation and lack of support are key risk factors.",
    stat: "20%",
    statLabel: "of postpartum deaths by suicide",
    oneLiner: "Two parents in a box was never enough. It was never how humans raised children.",
    keyFinding: "Women with PPD have elevated suicide risk up to 18 years postpartum.",
    image: "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800",
    imageAlt: "Mother alone with baby",
    sources: ["JAMA Network Open"]
  },
  {
    id: "holiday-heart-deaths",
    title: "Holiday Heart Attack Deaths",
    year: "Annual",
    location: "United States",
    category: "community-collapse",
    summary: "December 25 has more cardiac deaths than any other day. 37% increase Christmas Eve, peaking at 10pm. Stress of disconnection during 'connected' time.",
    stat: "37%",
    statLabel: "increase Christmas Eve",
    oneLiner: "The holidays kill. Not from joy—from the gap between expectation and reality.",
    keyFinding: "Loneliness amplified during seasons that emphasize togetherness.",
    image: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800",
    imageAlt: "Person alone during holidays",
    sources: ["American Heart Association, BMJ"]
  },
  {
    id: "european-heatwave",
    title: "2003 European Heat Wave",
    year: "2003",
    location: "Europe",
    category: "community-collapse",
    summary: "70,000+ deaths, 14,802 in France. 82% of victims 75+. 92% of Paris home deaths lived alone. Most buildings lacked AC. No one checked on the elderly.",
    stat: "70,000+",
    statLabel: "deaths",
    oneLiner: "They died in their apartments. No one noticed until the smell.",
    keyFinding: "Deaths at home (+74%) and retirement homes (+91%) far exceeded hospitals (+45%).",
    image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800",
    imageAlt: "Empty apartment building",
    sources: ["French National Institute of Health"]
  },
  {
    id: "grenfell-tower",
    title: "Grenfell Tower Fire",
    year: "2017",
    location: "London, UK",
    category: "community-collapse",
    summary: "72 deaths in tower fire. 41% of disabled residents died, 25% of children. They raised safety concerns for years. They were dismissed again and again.",
    stat: "72",
    statLabel: "deaths",
    oneLiner: "They knew they were sitting ducks. Their warnings were ignored.",
    keyFinding: "Disabled people housed on upper floors with no evacuation plans despite complaints.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
    imageAlt: "High-rise apartment building",
    sources: ["Grenfell Tower Inquiry"]
  },
  {
    id: "transfer-trauma",
    title: "Transfer Trauma Deaths",
    year: "Ongoing",
    location: "Global",
    category: "community-collapse",
    summary: "Frail elderly moved between care facilities face 2x mortality. 50-60% die within 12 months of nursing home admission. The body interprets uprooting as abandonment.",
    stat: "2x",
    statLabel: "mortality from relocation",
    oneLiner: "They didn't die from their diseases. They died from being moved.",
    keyFinding: "Courts have recognized since 1970s that 'transfer produces increased mortality.'",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800",
    imageAlt: "Nursing home hallway",
    sources: ["NANDA International"]
  },
  {
    id: "icu-delirium",
    title: "ICU Delirium Deaths",
    year: "Ongoing",
    location: "Global",
    category: "community-collapse",
    summary: "ICU delirium in 20-70% of patients. For elderly, delirium increases 6-month mortality (HR 3.2). Each day of delirium increases 1-year death risk (HR 1.10).",
    stat: "3.2x",
    statLabel: "6-month mortality risk",
    oneLiner: "The ICU environment itself causes brain damage.",
    keyFinding: "Environmental disorientation—loss of day/night, family, familiar surroundings—triggers cascade.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800",
    imageAlt: "Hospital ICU equipment",
    sources: ["Annals of Intensive Care"]
  },
];

// Component: Category navigation pill
function CategoryPill({
  category,
  isActive,
  count,
  onClick
}: {
  category: typeof CATEGORIES[0];
  isActive: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
        isActive
          ? 'text-white shadow-lg scale-105'
          : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      style={isActive ? { backgroundColor: category.color } : {}}
    >
      <span>{category.name}</span>
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
        isActive ? 'bg-white/20' : 'bg-gray-100'
      }`}>
        {count}
      </span>
    </button>
  );
}

// Component: Case card with image
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
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={caseData.image}
          alt={caseData.imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Category badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: category?.color || '#666' }}
        >
          {category?.name}
        </div>

        {/* Stat overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-white">{caseData.stat}</p>
              <p className="text-sm text-white/80">{caseData.statLabel}</p>
            </div>
            <div className="text-right text-white/70 text-xs">
              <p>{caseData.year}</p>
              <p>{caseData.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#c75b3a] transition-colors">
          {caseData.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {caseData.summary}
        </p>

        <blockquote className="text-sm italic text-gray-700 border-l-2 border-gray-300 pl-3">
          "{caseData.oneLiner}"
        </blockquote>
      </div>
    </article>
  );
}

// Component: Case detail modal
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
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-64">
          <Image
            src={caseData.image}
            alt={caseData.imageAlt}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-3"
              style={{ backgroundColor: category?.color }}
            >
              {category?.name}
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">{caseData.title}</h1>
            <p className="text-white/80 text-sm">{caseData.year} • {caseData.location}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Key stat */}
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl mb-6">
            <div className="text-4xl font-bold text-red-600">{caseData.stat}</div>
            <div className="text-red-800">{caseData.statLabel}</div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">The Case</h2>
            <p className="text-gray-700 leading-relaxed">{caseData.summary}</p>
          </div>

          {/* Key Finding */}
          {caseData.keyFinding && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Finding</h2>
              <p className="text-gray-700 leading-relaxed">{caseData.keyFinding}</p>
            </div>
          )}

          {/* Environment Ignored */}
          {caseData.environmentIgnored && (
            <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h2 className="text-sm font-semibold text-amber-800 uppercase tracking-wider mb-2">Environment Not Addressed</h2>
              <p className="text-amber-900">{caseData.environmentIgnored}</p>
            </div>
          )}

          {/* One-liner */}
          <blockquote className="my-6 p-6 bg-gray-900 text-white rounded-xl">
            <p className="text-xl italic leading-relaxed">"{caseData.oneLiner}"</p>
          </blockquote>

          {/* Sources */}
          {caseData.sources && caseData.sources.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sources</h2>
              <ul className="space-y-1">
                {caseData.sources.map((source, idx) => (
                  <li key={idx} className="text-sm text-gray-500">{source}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main page component
export default function CasesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showWarning, setShowWarning] = useState(true);

  const filteredCases = useMemo(() => {
    if (selectedCategory === "all") return CASES;
    return CASES.filter(c => c.category === selectedCategory);
  }, [selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: CASES.length };
    CASES.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, []);

  const currentCategory = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Content Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Content Warning</h2>
            <p className="text-gray-600 mb-6 text-sm">
              This page documents real cases of suffering and death caused by environmental mismatch.
              Content includes suicide, child mortality, workplace death, and institutional neglect.
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="w-full bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition font-medium"
            >
              I understand, continue
            </button>
            <Link
              href="/"
              className="block mt-3 text-gray-500 hover:text-gray-700 text-sm"
            >
              Return to home
            </Link>
          </div>
        </div>
      )}

      {/* Hero */}
      <header className="pt-32 pb-12 px-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#c75b3a] font-medium mb-4 tracking-wide uppercase text-sm">Evidence Base</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Cases from the<br />Mismatched World
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
            Documented cases where environments fundamentally misaligned with human nature
            led to suffering and death. These are not stories of broken individuals—they
            are stories of broken containers.
          </p>
          <div className="mt-8 flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{CASES.length}</span>
              <span>documented cases</span>
            </div>
            <div className="w-px h-8 bg-gray-600" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{CATEGORIES.length - 1}</span>
              <span>mismatch categories</span>
            </div>
          </div>
        </div>
      </header>

      {/* Category description */}
      {currentCategory && currentCategory.id !== 'all' && (
        <div
          className="border-b-4 px-6 py-4"
          style={{ borderColor: currentCategory.color, backgroundColor: `${currentCategory.color}10` }}
        >
          <div className="max-w-6xl mx-auto">
            <p className="text-gray-700">
              <span className="font-semibold" style={{ color: currentCategory.color }}>
                {currentCategory.name}:
              </span>{' '}
              {currentCategory.description}
            </p>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <nav className="sticky top-20 z-30 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            {CATEGORIES.map(category => (
              <CategoryPill
                key={category.id}
                category={category}
                isActive={selectedCategory === category.id}
                count={categoryCounts[category.id] || 0}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Cases Grid */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map(c => (
              <CaseCard
                key={c.id}
                caseData={c}
                onClick={() => setSelectedCase(c)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* The Pattern Section */}
      <section className="px-6 py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Georgia, serif' }}>
            The Pattern
          </h2>
          <p className="text-center text-gray-400 mb-10">
            Every case follows the same structure:
          </p>
          <div className="grid md:grid-cols-5 gap-4 text-center">
            {[
              { num: 1, text: "Individual labeled as broken" },
              { num: 2, text: "Environment not addressed" },
              { num: 3, text: "Proxies offered instead of solutions" },
              { num: 4, text: "Mismatch proves profitable" },
              { num: 5, text: "Death follows predictably" },
            ].map(step => (
              <div key={step.num} className="p-4">
                <div className="w-10 h-10 rounded-full bg-[#c75b3a] text-white flex items-center justify-center font-bold mx-auto mb-3">
                  {step.num}
                </div>
                <p className="text-sm text-gray-300">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What They Needed */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            What They Actually Needed
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Not diagnoses. Not medication. Not willpower.
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            {[
              "To be known by 25-50 people daily",
              "To have a role only they could fill",
              "To see the result of their work",
              "To have their emotions witnessed",
              "To touch and be touched",
              "To know their absence would be noticed in hours",
              "To sleep when dark, wake when light",
              "To move their bodies through space",
              "To eat food their ancestors would recognize",
              "To have control over daily decisions",
              "To belong to something beyond themselves",
            ].map((need, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-700 text-sm">{need}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-2xl font-bold text-[#c75b3a]">
            Demismatch first. Then augment.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-[#c75b3a]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Understand the Framework
          </h2>
          <p className="text-xl text-white/90 mb-8">
            These cases illustrate violations of fundamental human needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/framework"
              className="bg-white text-[#c75b3a] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Read the Framework
            </Link>
            <Link
              href="/app"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Analyze Anything
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-6 text-sm mb-6">
            <Link href="/framework" className="hover:text-white transition">Framework</Link>
            <Link href="/library" className="hover:text-white transition">Library</Link>
            <Link href="/systems" className="hover:text-white transition">For Systems</Link>
            <Link href="/practitioners" className="hover:text-white transition">For Practitioners</Link>
            <Link href="/sources" className="hover:text-white transition">Sources</Link>
          </div>
          <p className="text-sm">
            {CASES.length} documented cases across {CATEGORIES.length - 1} mismatch categories •
            Updated December 2024
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
