"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";

// Domain definitions with colors and icons
const DOMAINS = [
  { id: "all", name: "All Cases", color: "#666666", icon: "grid" },
  { id: "social-connection", name: "Social Connection", color: "#E53935", icon: "users" },
  { id: "purpose-meaning", name: "Purpose & Meaning", color: "#7B1FA2", icon: "target" },
  { id: "autonomy-control", name: "Autonomy & Control", color: "#F57C00", icon: "sliders" },
  { id: "sleep-circadian", name: "Sleep & Circadian", color: "#1976D2", icon: "moon" },
  { id: "movement", name: "Movement", color: "#388E3C", icon: "activity" },
  { id: "food", name: "Food", color: "#795548", icon: "coffee" },
  { id: "attention-information", name: "Attention & Information", color: "#00838F", icon: "smartphone" },
  { id: "aging-transitions", name: "Aging & Transitions", color: "#5D4037", icon: "clock" },
  { id: "parenting-childhood", name: "Parenting & Childhood", color: "#C2185B", icon: "heart" },
  { id: "nature-biophilia", name: "Nature & Biophilia", color: "#2E7D32", icon: "tree" },
  { id: "temperature-hormesis", name: "Temperature & Hormesis", color: "#0097A7", icon: "thermometer" },
];

interface Case {
  id: string;
  title: string;
  year: string;
  location: string;
  type: string;
  domain: string;
  subdomain: string;
  summary: string;
  mortalityStat?: string;
  keyFinding: string;
  environmentIgnored: string;
  oneLiner: string;
  namedCases?: string[];
  sources?: string[];
}

// All cases data
const CASES: Case[] = [
  // SOCIAL CONNECTION - Touch Deprivation
  {
    id: "spitz-hospitalism",
    title: "René Spitz's Hospitalism Studies",
    year: "1945",
    location: "South American orphanages",
    type: "Research",
    domain: "social-connection",
    subdomain: "Touch Deprivation",
    summary: "Babies in clean, well-fed orphanages dying at rates of 30-37%. The only variable missing: human touch and connection. Staff were overworked and untrained; they rarely spoke to the children or picked them up.",
    mortalityStat: "1 in 3 infants died",
    keyFinding: "Babies require touch to survive. This is not optional. This is not psychological. This is biological. Remove touch, and the body enters survival mode. Maintain that state long enough, and the body gives up entirely.",
    environmentIgnored: "No one asked why babies with adequate food and shelter were dying. The answer was obvious but invisible: they weren't being held.",
    oneLiner: "They had food, shelter, and medical care. They didn't have arms around them. They died anyway.",
    sources: ["Spitz, R.A. (1945) Hospitalism: An Inquiry Into the Genesis of Psychiatric Conditions in Early Childhood", "Documentary: Grief: A Peril in Infancy (1947)"],
  },
  {
    id: "romanian-orphanages",
    title: "Romanian Orphanage Studies",
    year: "1989-present",
    location: "Romania",
    type: "Natural Experiment",
    domain: "social-connection",
    subdomain: "Touch Deprivation",
    summary: "After Ceausescu's fall in 1989, more than 170,000 children were discovered warehoused in state-run orphanages. Children might see 17 different caretakers in a week. Brain scans showed significantly reduced grey and white matter.",
    mortalityStat: "Children 3+ SD below developmental norms",
    keyFinding: "Children placed in foster care before age 2 showed significant recovery. Children who stayed past age 2 showed lasting, largely irreversible deficits. Effects persisted into adulthood on 22-year follow-up.",
    environmentIgnored: "Communist policies banned contraception, forcing unwanted pregnancies. Poverty forced abandonment. Institutions were the 'solution.' No one redesigned the container.",
    oneLiner: "The institution met their physical needs. Their brains needed to be known.",
    sources: ["Bucharest Early Intervention Project (Harvard/Tulane/University of Maryland)"],
  },
  // SOCIAL CONNECTION - Pair Bonding
  {
    id: "widowhood-effect",
    title: "The Widowhood Effect",
    year: "Meta-analysis",
    location: "Global",
    type: "Epidemiological",
    domain: "social-connection",
    subdomain: "Pair Bonding",
    summary: "When a long-term spouse dies, the surviving partner faces dramatically elevated mortality risk. This is not metaphor. This is measured. Heart disease is the #1 cause of death after widowhood.",
    mortalityStat: "66% increased mortality in first 90 days",
    keyFinding: "'Dying of a broken heart' is not poetry. It's biology. The body downregulates when the attachment figure disappears. Inflammation increases 17%. Immune function drops. The technical term is Takotsubo cardiomyopathy.",
    environmentIgnored: "We medicalize the bereaved. We prescribe antidepressants. We don't rebuild the web of connection that kept them alive.",
    oneLiner: "You can literally die from losing the person who knew you.",
    sources: ["NIH study of 370,000 couples"],
  },
  // SOCIAL CONNECTION - Community Dissolution
  {
    id: "roseto-effect",
    title: "The Roseto Effect",
    year: "1955-1985",
    location: "Roseto, Pennsylvania, USA",
    type: "50-year Prospective Study",
    domain: "social-connection",
    subdomain: "Community Dissolution",
    summary: "An Italian-American town with half the heart disease mortality of neighboring towns, despite identical diet, smoking rates, and exercise levels. The only difference: tight-knit community structure with three-generation households and strong family meals.",
    mortalityStat: "Heart attack mortality 1/1000 vs 3.5/1000 national average",
    keyFinding: "When community cohesion eroded in the 1960s-70s, heart disease rose to match neighboring towns. The 'Roseto Effect' disappeared when the community did.",
    environmentIgnored: "We treat heart disease with statins and lifestyle advice. We don't prescribe community.",
    oneLiner: "Same diet, same smoking, same genes. Different community. Half the heart attacks.",
    sources: ["Wolf & Bruhn, 'The Power of Clan' (1992)"],
  },
  {
    id: "deaths-of-despair",
    title: "Deaths of Despair",
    year: "1998-present",
    location: "United States",
    type: "Epidemiological",
    domain: "social-connection",
    subdomain: "Community Dissolution",
    summary: "500,000+ middle-aged white Americans dead from suicide, drug overdose, and alcohol-related liver disease since 1998. U.S. life expectancy declined for three consecutive years - unprecedented in modern history.",
    mortalityStat: "70,000+ deaths per year; 749% increase in rural drug overdose",
    keyFinding: "It's not poverty. It's loss of: stable jobs, marriage, community, church, purpose. 'Destroy work and, in the end, working-class life cannot survive.'",
    environmentIgnored: "We called it an 'opioid epidemic' and blamed pharma. We didn't ask why millions of Americans found opioids preferable to consciousness.",
    oneLiner: "They didn't die from lack of money. They died from lack of a reason to be alive.",
    sources: ["Case & Deaton, 'Deaths of Despair and the Future of Capitalism' (2020)"],
  },
  // SOCIAL CONNECTION - Extreme Isolation
  {
    id: "solitary-confinement",
    title: "Solitary Confinement Psychosis",
    year: "Ongoing",
    location: "US Prison System",
    type: "Systematic Documentation",
    domain: "social-connection",
    subdomain: "Extreme Isolation",
    summary: "Healthy adults with no prior mental illness developing hallucinations, psychosis, and permanent personality changes from isolation alone. 22-24 hours/day alone in 80 sq ft cell. No torture required. Just absence of human contact.",
    mortalityStat: "50% of prison suicides occur in solitary (which holds ~5% of inmates)",
    keyFinding: "The brain requires social input to maintain coherence. Remove that input, and the brain generates its own - hallucinations, voices, paranoid ideation. This isn't weakness. This is architecture.",
    environmentIgnored: "Charles Dickens, visiting Cherry Hill Prison in 1842, called solitary 'immeasurably worse than any torture of the body.'",
    oneLiner: "The walls weren't closing in. His brain was.",
    sources: ["Stuart Grassian, Harvard Medical School"],
  },
  {
    id: "hikikomori",
    title: "Hikikomori Epidemic",
    year: "Ongoing",
    location: "Japan (spreading globally)",
    type: "Epidemiological",
    domain: "social-connection",
    subdomain: "Extreme Isolation",
    summary: "Over 1.5 million Japanese people living in complete social withdrawal, often confined to a single room for years or decades. Most are male. Many began withdrawal after a workplace failure or inability to meet impossible social expectations.",
    mortalityStat: "Average duration: 7+ years",
    keyFinding: "These aren't people with a disorder. They're people who found the container unbearable and retreated to the only space they could control. The withdrawal is a symptom of mismatch, not a disease.",
    environmentIgnored: "Impossible expectations. Punitive job markets that close doors to anyone who left the workforce. Shame cultures that isolate families.",
    oneLiner: "Unable to meet impossible expectations, they withdrew. The society that created them now has a guide for what to do when their parents' bodies start to decompose.",
    namedCases: ["Man, 43: Hikikomori 7 years after business bankruptcy", "Man, 54: Left father's corpse uncollected for over half a year", "Man, 46: Left mother's body in house for over a year"],
  },
  {
    id: "kodokushi",
    title: "Kodokushi (Lonely Death)",
    year: "Ongoing",
    location: "Japan",
    type: "Epidemiological",
    domain: "social-connection",
    subdomain: "Extreme Isolation",
    summary: "People dying alone and remaining undiscovered for weeks, months, or years. Over 20,000 kodokushi deaths in first 3 months of 2024 alone. 40%+ discovered after decomposition had begun.",
    mortalityStat: "20,000+ in Q1 2024; 40%+ discovered decomposing",
    keyFinding: "In a village, your absence is noticed within hours. In modern Japan, your corpse can decompose for three years before anyone asks where you went.",
    environmentIgnored: "We automate payments. We don't automate checking on people.",
    oneLiner: "His monthly rent was paid automatically. His life wasn't.",
    namedCases: ["Man, 69: Corpse discovered three years after death - only when bank savings were depleted"],
  },
  // PURPOSE & MEANING - Work Without Impact
  {
    id: "whitehall-studies",
    title: "The Whitehall Studies",
    year: "1967-present",
    location: "UK (British Civil Service)",
    type: "Longitudinal Cohort",
    domain: "purpose-meaning",
    subdomain: "Work Without Impact",
    summary: "17,500+ civil servants studied for decades. Discovery: The lower your position in the hierarchy, the higher your mortality - regardless of lifestyle factors.",
    mortalityStat: "Lowest grade: 3.6x heart disease mortality vs highest grade",
    keyFinding: "It wasn't 'executive stress' killing people. Executives lived longest. It was lack of control, lack of autonomy, lack of visible impact. Your position in the structure is written into your body.",
    environmentIgnored: "We treat cardiovascular disease with statins and lifestyle advice. We don't restructure work to give people agency.",
    oneLiner: "The executives weren't dying of stress. The messengers were dying of powerlessness.",
    sources: ["Lead researcher: Michael Marmot"],
  },
  {
    id: "bullshit-jobs",
    title: "Bullshit Jobs",
    year: "Contemporary",
    location: "Global",
    type: "Survey Research",
    domain: "purpose-meaning",
    subdomain: "Work Without Impact",
    summary: "19% of US workers believe their jobs have no social value. They may be well-paid, have good benefits, and carry prestige - yet report profound misery and 'psychological violence.'",
    mortalityStat: "Depression and suicidal ideation correlated with perceived job uselessness",
    keyFinding: "Humans need to see the result of their labor. Hunter-gatherers saw the animal fall. Farmers saw the crop grow. Office workers see emails disappear into the void. The loop doesn't close. Purpose dies.",
    environmentIgnored: "We tell people to 'find meaning' in their work. We don't ask why half the workforce is doing work that doesn't need to be done.",
    oneLiner: "I was deeply depressed and suicidal, even though I owned a home and had a beautiful fiancée. I knew I would kill myself if I had to keep that job.",
    sources: ["David Graeber, 'Bullshit Jobs' (2018)"],
  },
  // AUTONOMY & CONTROL - Warehouse Work
  {
    id: "amazon-deaths",
    title: "Amazon Fulfillment Center Deaths",
    year: "Ongoing",
    location: "United States, Germany, Global",
    type: "Pattern Documentation",
    domain: "autonomy-control",
    subdomain: "Warehouse Work",
    summary: "Workers collapsing on warehouse floors, dying of heart attacks while filling orders. In one case, cardboard was placed around the body as a screen and operations continued.",
    mortalityStat: "Weekly turnover rate 3% (entire workforce replaced every 8 months)",
    keyFinding: "Workers do fragments of tasks that feed into processes they'll never see the end of. No loop closes. No work lands on anyone they'll ever meet. Their bodies are components. When a component breaks, you screen it with cardboard and keep the line moving.",
    environmentIgnored: "Jeff Bezos called an entrenched workforce 'a march to mediocrity.'",
    oneLiner: "Cardboard was placed around the body as a screen, and operations continued.",
    namedCases: ["Jeff Lockhart Jr., 29: Collapsed and died on warehouse floor", "Billy Foister, 48: Heart attack, lay on floor 20 min before treatment", "Leipzig, Germany: Cardboard placed around body, operations continued"],
  },
  // SLEEP & CIRCADIAN
  {
    id: "nurses-night-shift",
    title: "Nurses' Health Study - Night Shift Mortality",
    year: "1988-2010",
    location: "United States",
    type: "Prospective Cohort",
    domain: "sleep-circadian",
    subdomain: "Shift Work",
    summary: "74,862 nurses followed for 22 years. Those who worked rotating night shifts for 5+ years had significantly elevated mortality from all causes.",
    mortalityStat: "15+ years night shift: 38% higher heart disease mortality",
    keyFinding: "The circadian system isn't a preference. It's an operating system. Override it chronically and the body breaks down. WHO classified night shift work as 'probable carcinogen' in 2007.",
    environmentIgnored: "We accept shift work as economically necessary. We don't ask what happens to bodies forced to operate against their biological programming.",
    oneLiner: "They kept patients alive through the night. The night shifts took years off their own lives.",
    sources: ["Gu et al., American Journal of Preventive Medicine (2015)"],
  },
  // MOVEMENT
  {
    id: "sitting-disease",
    title: "Sitting Disease / Occupational Sitting Mortality",
    year: "2024",
    location: "Taiwan (study), Global (phenomenon)",
    type: "Prospective Cohort",
    domain: "movement",
    subdomain: "Sedentary Work",
    summary: "Workers who sit for most of their workday have 16% higher all-cause mortality and 34% higher cardiovascular mortality than those who don't sit.",
    mortalityStat: "12+ hours sitting/day: 38% higher mortality risk",
    keyFinding: "Sedentary jobs increased 83% since 1950 in US. Average American adult sits 9.5 hours/day. 3.8% of all deaths globally attributable to sitting. Exercise doesn't fully cancel sitting damage.",
    environmentIgnored: "We designed offices around desks. We built cities around cars. We created work that can only be done while stationary. Then we told people to exercise more.",
    oneLiner: "Sitting is the new smoking. But nobody's making you take smoke breaks.",
    sources: ["JAMA Network Open (2024)"],
  },
  // FOOD
  {
    id: "ultra-processed-food",
    title: "Ultra-Processed Food Mortality",
    year: "Meta-analysis",
    location: "Global",
    type: "Meta-analysis",
    domain: "food",
    subdomain: "Industrial Diet",
    summary: "Ultra-processed foods now comprise 60%+ of American calories. Each 10% increase in UPF consumption increases all-cause mortality by 2.7-10%.",
    mortalityStat: "124,000+ preventable deaths/year in US attributable to UPF",
    keyFinding: "The body didn't evolve to process industrial food products. The gut microbiome, the satiety signals, the metabolic pathways - all calibrated for foods that don't exist in our diet anymore.",
    environmentIgnored: "We subsidize corn and soy. We make UPFs the cheapest, most accessible, most convenient option. We blame individuals for 'bad choices.'",
    oneLiner: "We didn't change. The food changed. The bodies are just keeping score.",
    sources: ["BMJ (2024), American Journal of Preventive Medicine (2025)"],
  },
  // ATTENTION & INFORMATION - Algorithm-Driven
  {
    id: "molly-russell",
    title: "Molly Russell",
    year: "2017",
    location: "United Kingdom",
    type: "Individual Case / Legal Finding",
    domain: "attention-information",
    subdomain: "Algorithm-Driven Death",
    summary: "A 14-year-old girl died by suicide after viewing 2,100+ Instagram posts related to depression, self-harm, and suicide in the 6 months before her death. She hadn't searched for this content. The algorithm fed it to her.",
    mortalityStat: "2,100 harmful posts viewed; 130 posts/day in final months",
    keyFinding: "Pinterest sent emails: '10 depression pins you might like.' Meta executive testified content was 'safe.' The algorithm saw a vulnerable child and monetized her.",
    environmentIgnored: "Every click taught the algorithm what kept her engaged. What kept her engaged was content about dying. It optimized for engagement. She died.",
    oneLiner: "The algorithm saw her vulnerability and monetized it.",
    sources: ["UK Coroner's Court (2022) - Verdict: 'Died from an act of self-harm while suffering depression and the negative effects of online content.'"],
  },
  {
    id: "amanda-todd",
    title: "Amanda Todd",
    year: "2012",
    location: "Canada",
    type: "Individual Case",
    domain: "attention-information",
    subdomain: "Algorithm-Driven Death",
    summary: "A 15-year-old died by suicide after years of blackmail and cyberbullying. At 12, a stranger convinced her to flash her chest online. He captured the image and spent years stalking her, distributing it to classmates, teachers, and family whenever she moved schools.",
    mortalityStat: "Dead at 15 after years of inescapable online persecution",
    keyFinding: "Every time she moved schools, the stranger found her. Sent the image to new classmates, teachers, parents. There was no fresh start. No new town where nobody knows. The image lives in servers.",
    environmentIgnored: "In a village, shame completes and you move on. Online, it follows you forever.",
    oneLiner: "In a village, shame completes and you move on. Online, it follows you forever.",
    sources: ["Perpetrator Aydin Coban eventually convicted"],
  },
  // ATTENTION & INFORMATION - Gaming
  {
    id: "gaming-marathon-deaths",
    title: "Gaming Marathon Deaths",
    year: "Ongoing",
    location: "Taiwan, China, South Korea",
    type: "Pattern Documentation",
    domain: "attention-information",
    subdomain: "Gaming Immersion",
    summary: "Multiple deaths from marathon gaming sessions leading to cardiac arrest, stroke, exhaustion. In some cases, other gamers continued playing around the corpse.",
    mortalityStat: "Deaths after 50-86+ hour sessions",
    keyFinding: "The game gave him what his life couldn't: a role, a challenge, visible progress, connection to others, immediate feedback. His body gave out before he could bring himself to leave.",
    environmentIgnored: "No one asked: Why is the game more appealing than his life? What is his life missing?",
    oneLiner: "The game gave him a role, a challenge, visible progress, and connection. His real life offered none of these.",
    namedCases: ["Man, 32, Taiwan (2015): Dead after 3-day binge; corpse lay stiff for hours while others played", "Man, 28, South Korea (2005): Quit job, died after 50-hour StarCraft session", "Man, South Korea (2002): First documented gaming death after 86 hours"],
  },
  {
    id: "esports-hotel-isolation",
    title: "Chinese Esports Hotel Isolation",
    year: "2023-2025",
    location: "Changchun, China",
    type: "Individual Case",
    domain: "attention-information",
    subdomain: "Gaming Immersion",
    summary: "A man lived in an esports hotel room for nearly 2 years without ever leaving. Food delivered via apps. No human contact except through games. When he finally moved out, cleaners found garbage piled 1 meter high.",
    keyFinding: "He didn't have 'gaming addiction' or 'social anxiety.' He had an environment that made isolation frictionless and connection effortful.",
    environmentIgnored: "Privacy emphasized, staff interference minimized. Contactless delivery, 'do not disturb' culture.",
    oneLiner: "The room was designed to let him disappear. He did.",
  },
  // AGING & TRANSITIONS
  {
    id: "transfer-trauma",
    title: "Transfer Trauma / Relocation Stress Syndrome",
    year: "Documented since 1960s",
    location: "Global",
    type: "Systematic Documentation",
    domain: "aging-transitions",
    subdomain: "Institutionalization",
    summary: "Frail elderly transferred between care facilities - or from home to institution - experience dramatically elevated mortality. The transfer itself is often the cause of death.",
    mortalityStat: "Relocation = 2x mortality risk; 50-60% mortality in first 12 months after nursing home admission",
    keyFinding: "Courts have recognized since 1970s that 'transfer of geriatric patients to any unfamiliar surroundings produces an increased rate of mortality.'",
    environmentIgnored: "The nursing home is their home. Staff know them. Routines are predictable. Uproot them and you remove every anchor. The body interprets this as abandonment.",
    oneLiner: "They didn't die from their diseases. They died from being moved.",
    namedCases: ["Mountain View facility: 20 patients told to move; more than half are now dead", "Kelowna, Canada: 24 residents given notice; nearly 30% died within one year"],
  },
  // PARENTING & CHILDHOOD
  {
    id: "baby-sarang-kim",
    title: "Baby Sarang Kim",
    year: "2009",
    location: "South Korea",
    type: "Individual Case",
    domain: "parenting-childhood",
    subdomain: "Isolated Nuclear Family",
    summary: "A 3-month-old baby starved to death while her parents raised a virtual child in the online game Prius. The parents would leave her alone for 6-12 hour gaming sessions. She weighed 5.5 pounds at death - less than birth weight.",
    mortalityStat: "Weighed 5.5 lbs at death - less than birth weight",
    keyFinding: "In Prius, players raise a virtual child called 'Anima' who gains powers as she is nurtured. The parents knew how to care for the virtual child. They had mastered the interface.",
    environmentIgnored: "Unemployed, poor, living with wife's parents. No parenting education, no support network, no one checking on them. Two parents in a box is not enough. It was never enough.",
    oneLiner: "They knew how to raise a virtual child. Their real baby lacked the interface.",
    sources: ["Documentary: 'Love Child' (2014)"],
  },
  {
    id: "rebecca-riley",
    title: "Rebecca Riley",
    year: "2006",
    location: "Massachusetts, USA",
    type: "Individual Case",
    domain: "parenting-childhood",
    subdomain: "Psychiatric Mismatch",
    summary: "A 4-year-old diagnosed with bipolar disorder and ADHD at 28 months - based on being 'hyperactive' and having 'mood switches.' In other words: a normal toddler. She was prescribed Seroquel, Depakote, and Clonidine. She died of an overdose.",
    mortalityStat: "Dead at age 4 from prescribed medications",
    keyFinding: "Father: unmedicated bipolar, 'intermittent rage disorder.' Family collecting $2,700/month in disability for three children all diagnosed with same disorders by same doctor. A school nurse called her a 'floppy doll' six weeks before she died.",
    environmentIgnored: "A stressed toddler in a chaotic, impoverished, isolated household was labeled as the broken one. The intervention was medication, not environment. She didn't need Seroquel. She needed a village.",
    oneLiner: "She was never sick. She was alone in chaos.",
  },
  {
    id: "zoraya-ter-beek",
    title: "Zoraya ter Beek",
    year: "2024",
    location: "Netherlands",
    type: "Individual Case",
    domain: "parenting-childhood",
    subdomain: "Psychiatric Mismatch",
    summary: "A 29-year-old woman legally euthanized after her psychiatrist said 'there is nothing more we can do for you.' She had been diagnosed with depression, autism, and borderline personality disorder.",
    mortalityStat: "Dead at 29, legally, with medical assistance",
    keyFinding: "No one asked: What does her daily social environment look like? How many people know her name? What is her role? Where does she belong? What loops aren't closing?",
    environmentIgnored: "Instead, the question was: What's wrong with her brain chemistry? When her suffering was deemed untreatable by psychiatric intervention, euthanasia was offered before environmental intervention was tried.",
    oneLiner: "'Nothing more we can do' - without ever trying the one thing that might work.",
  },
  // NATURE & BIOPHILIA
  {
    id: "ulrich-window-study",
    title: "Ulrich Hospital Window Study",
    year: "1984",
    location: "Pennsylvania, USA",
    type: "Controlled Study",
    domain: "nature-biophilia",
    subdomain: "Nature Deprivation",
    summary: "Post-surgical patients in identical hospital rooms, same procedure, same nurses. Only difference: one group looked at a brick wall, the other at deciduous trees through their window.",
    mortalityStat: "Tree-view: 7.96 days stay vs Wall-view: 8.70 days",
    keyFinding: "Tree-view patients had 1.13 negative nurse comments per patient vs 3.96 for wall-view. Tree-view patients needed fewer pain medications, especially narcotics.",
    environmentIgnored: "Hospitals are designed for efficiency, not healing. Windows face parking lots. Walls are beige. Nature is 'decoration' rather than medicine.",
    oneLiner: "Same surgery, same nurses, same hospital. Different window. One week faster recovery.",
    sources: ["Ulrich, R.S. (1984). Science. 'View through a window may influence recovery from surgery.'"],
  },
  {
    id: "nature-deficit-disorder",
    title: "Nature-Deficit Disorder",
    year: "Contemporary",
    location: "Global (industrialized nations)",
    type: "Epidemiological Pattern",
    domain: "nature-biophilia",
    subdomain: "Nature Deprivation",
    summary: "Richard Louv coined the term to describe what happens when children grow up without regular exposure to natural environments. Average American child: 4-7 minutes/day outdoors vs 7+ hours/day on screens.",
    mortalityStat: "4-7 min/day outdoors vs 7+ hours/day screens",
    keyFinding: "Children who play in green spaces show reduced ADHD symptoms. Forest exposure measurably reduces cortisol in 20 minutes. The brain expects natural visual patterns, sounds, light cycles.",
    environmentIgnored: "We build schools without windows. We pave playgrounds. We tell children with 'attention problems' to sit still in fluorescent rooms. We never ask: What input is missing?",
    oneLiner: "We removed nature from childhood and wondered why children couldn't pay attention.",
    sources: ["Louv, R. 'Last Child in the Woods' (2005)"],
  },
  {
    id: "harlow-surrogate-mothers",
    title: "Harlow Surrogate Mother Studies",
    year: "1958",
    location: "University of Wisconsin, USA",
    type: "Experimental Research",
    domain: "nature-biophilia",
    subdomain: "Touch & Comfort",
    summary: "Infant rhesus monkeys separated from mothers at birth, given choice between wire 'mother' with milk bottle or cloth-covered 'mother' with no food.",
    mortalityStat: "17-18 hours/day with cloth mother vs 1 hour with wire mother (food source)",
    keyFinding: "Even when only wire mother provided food, infants clung to cloth mother. Monkeys raised with wire mother only: severe social deficits, inability to mate or parent. Isolation for 6+ months: largely irreversible damage.",
    environmentIgnored: "Pre-Harlow, child-rearing advice warned against 'spoiling' children with too much holding. Touch was seen as optional luxury, not biological necessity.",
    oneLiner: "They chose the mother who held them over the mother who fed them.",
    sources: ["Harlow, H.F. (1958). 'The Nature of Love'"],
  },
  {
    id: "artificial-light-at-night",
    title: "Artificial Light at Night (ALAN)",
    year: "Ongoing",
    location: "Global",
    type: "Epidemiological Pattern",
    domain: "nature-biophilia",
    subdomain: "Light & Circadian Mismatch",
    summary: "83% of world population lives under light-polluted skies. Blue light exposure after sunset suppresses melatonin by up to 85%.",
    mortalityStat: "Night shift work classified by WHO as 'probable carcinogen'",
    keyFinding: "Light pollution correlates with breast cancer, prostate cancer, obesity, depression. The body has no way to know what time it is except through light.",
    environmentIgnored: "We designed cities to never get dark. We put screens in bedrooms. We praise 'burning the midnight oil.' We don't mention that darkness is a biological requirement.",
    oneLiner: "We engineered darkness out of our lives and called the consequences mental illness.",
  },
  // TEMPERATURE & HORMESIS
  {
    id: "thermoneutral-living",
    title: "Thermoneutral Living",
    year: "Contemporary",
    location: "Industrial Societies",
    type: "Pattern Analysis",
    domain: "temperature-hormesis",
    subdomain: "Thermal Comfort Zone",
    summary: "Humans evolved with daily and seasonal temperature variation. Now we maintain 68-72°F (20-22°C) in every building, every season.",
    keyFinding: "Brown adipose tissue activated by cold burns calories, improves insulin sensitivity. Finnish sauna 2-3x/week correlates with 24% lower all-cause mortality. Cold water immersion shows measurable immune enhancement.",
    environmentIgnored: "We built HVAC systems to eliminate thermal stress. We never asked whether thermal stress was necessary for metabolic health.",
    oneLiner: "We made every room the same temperature and wondered why metabolism broke.",
  },
];

// Common threads
const COMMON_THREADS = [
  "The individual was labeled as broken. Diagnosed, pathologized, blamed.",
  "The environment was not addressed. No one asked what the container lacked.",
  "Proxies were offered instead of solutions. Medication instead of connection. Virtual worlds instead of real community.",
  "The mismatch was profitable. Gaming companies, pharma, Amazon, social media - all profit from the broken container.",
  "The death was predictable. These aren't freak accidents. They're logical endpoints of environments designed against human nature.",
];

// What they needed
const WHAT_THEY_NEEDED = [
  "To be known by 25-50 people daily",
  "To have a role that only they could fill",
  "To see the result of their work",
  "To have their emotions witnessed",
  "To touch and be touched",
  "To know that their absence would be noticed within hours",
  "To sleep when it's dark and wake when it's light",
  "To move their bodies through space",
  "To eat food their great-grandmothers would recognize",
  "To have control over their daily decisions",
  "To belong to something that would exist beyond their death",
];

// Domain icon component
function DomainIcon({ icon, className = "w-5 h-5" }: { icon: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    users: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    target: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
    sliders: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
    moon: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
    activity: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    coffee: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>,
    smartphone: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>,
    clock: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    heart: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    tree: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 22v-7M12 8l4 7H8l4-7z" /><path d="M12 2l6 11H6L12 2z" /></svg>,
    thermometer: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" /></svg>,
  };
  return icons[icon] || icons.grid;
}

// Case card component
function CaseCard({ caseData, onClick }: { caseData: Case; onClick: () => void }) {
  const domain = DOMAINS.find(d => d.id === caseData.domain);

  return (
    <article
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="px-2 py-1 text-xs font-medium rounded-full text-white"
            style={{ backgroundColor: domain?.color || '#666' }}
          >
            {domain?.name || caseData.domain}
          </span>
          <span className="text-xs text-gray-500">{caseData.year}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">{caseData.location}</span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#c75b3a] transition-colors">
          {caseData.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {caseData.summary}
        </p>

        {caseData.mortalityStat && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-r">
            <p className="text-red-800 font-semibold text-sm">{caseData.mortalityStat}</p>
          </div>
        )}

        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 text-sm">
          "{caseData.oneLiner}"
        </blockquote>
      </div>
    </article>
  );
}

// Case detail modal
function CaseDetail({ caseData, onClose }: { caseData: Case; onClose: () => void }) {
  const domain = DOMAINS.find(d => d.id === caseData.domain);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span
              className="p-2 rounded-lg text-white"
              style={{ backgroundColor: domain?.color || '#666' }}
            >
              <DomainIcon icon={domain?.icon || 'grid'} />
            </span>
            <div>
              <p className="text-sm text-gray-500">{domain?.name}</p>
              <p className="text-xs text-gray-400">{caseData.subdomain}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{caseData.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{caseData.year}</span>
              <span>•</span>
              <span>{caseData.location}</span>
              <span>•</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded">{caseData.type}</span>
            </div>
          </header>

          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">The Case</h2>
            <p className="text-gray-700 leading-relaxed">{caseData.summary}</p>
          </section>

          {caseData.mortalityStat && (
            <section className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <h2 className="text-lg font-semibold text-red-900 mb-1">The Data</h2>
              <p className="text-red-800 text-xl font-bold">{caseData.mortalityStat}</p>
            </section>
          )}

          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Key Finding</h2>
            <p className="text-gray-700 leading-relaxed">{caseData.keyFinding}</p>
          </section>

          <section className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <h2 className="text-lg font-semibold text-amber-900 mb-2">Environment Not Addressed</h2>
            <p className="text-amber-800 leading-relaxed">{caseData.environmentIgnored}</p>
          </section>

          {caseData.namedCases && caseData.namedCases.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Named Cases</h2>
              <ul className="space-y-2">
                {caseData.namedCases.map((nc, idx) => (
                  <li key={idx} className="text-gray-700 text-sm pl-4 border-l-2 border-gray-300">
                    {nc}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <blockquote className="my-8 p-6 bg-gray-900 text-white rounded-xl">
            <p className="text-xl italic leading-relaxed">"{caseData.oneLiner}"</p>
          </blockquote>

          {caseData.sources && caseData.sources.length > 0 && (
            <section className="pt-6 border-t border-gray-200">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Sources</h2>
              <ul className="space-y-1">
                {caseData.sources.map((source, idx) => (
                  <li key={idx} className="text-sm text-gray-600">{source}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CasesPage() {
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showContentWarning, setShowContentWarning] = useState(true);

  const filteredCases = useMemo(() => {
    if (selectedDomain === "all") return CASES;
    return CASES.filter(c => c.domain === selectedDomain);
  }, [selectedDomain]);

  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = { all: CASES.length };
    CASES.forEach(c => {
      counts[c.domain] = (counts[c.domain] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Navigation />

      {/* Content Warning */}
      {showContentWarning && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Content Warning</h2>
            <p className="text-gray-600 mb-6">
              This page contains documented cases involving death, suicide, child mortality,
              institutional abuse, and mental health crises. The content is presented for
              educational purposes to illustrate environmental mismatch.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowContentWarning(false)}
                className="w-full bg-[#c75b3a] text-white px-6 py-3 rounded-lg hover:bg-[#b54d2e] transition font-medium"
              >
                I understand, continue
              </button>
              <Link
                href="/"
                className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Return to home
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              If you're in crisis, please contact a crisis helpline in your country.
            </p>
          </div>
        </div>
      )}

      {/* Hero */}
      <header className="pt-32 pb-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Cases from the Mismatched World
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            A collection of cases where environments fundamentally misaligned with human nature
            led to suffering and death. These are not stories of broken individuals —
            they are stories of broken containers.
          </p>
          <p className="mt-6 text-lg text-[#c75b3a] font-medium italic">
            Every case follows the same pattern: An individual is labeled as broken.
            The environment is not addressed. Death follows predictably.
          </p>
        </div>
      </header>

      {/* Domain Filter */}
      <nav className="sticky top-20 z-30 bg-[#faf9f6]/95 backdrop-blur-sm border-y border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {DOMAINS.map(domain => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedDomain === domain.id
                    ? 'text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
                style={selectedDomain === domain.id ? { backgroundColor: domain.color } : {}}
              >
                <DomainIcon icon={domain.icon} className="w-4 h-4" />
                <span>{domain.name}</span>
                <span className={`text-xs ${selectedDomain === domain.id ? 'text-white/80' : 'text-gray-400'}`}>
                  ({domainCounts[domain.id] || 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Cases Grid */}
      <section className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500 mb-6">
            Showing {filteredCases.length} case{filteredCases.length !== 1 ? 's' : ''}
            {selectedDomain !== 'all' && ` in ${DOMAINS.find(d => d.id === selectedDomain)?.name}`}
          </p>

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

      {/* Common Threads */}
      <section className="px-8 py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Georgia, serif' }}>
            Common Threads
          </h2>
          <div className="space-y-4">
            {COMMON_THREADS.map((thread, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-white/10 rounded-lg">
                <span className="text-[#c75b3a] font-bold text-lg">{idx + 1}.</span>
                <p className="text-gray-200">{thread}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What They Needed */}
      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            What They Actually Needed
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Not better diagnoses. Not more medication. Not stronger willpower.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {WHAT_THEY_NEEDED.map((need, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-gray-700">{need}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-2xl font-bold text-[#c75b3a]">
            Demismatch first. Then augment.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-16 bg-[#c75b3a] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Understand the Framework
          </h2>
          <p className="text-xl text-white/90 mb-8">
            These cases illustrate violations of fundamental human needs.
            Learn the complete specification for human nature.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/framework"
              className="bg-white text-[#c75b3a] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Read the Framework
            </Link>
            <Link
              href="/app"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Analyze Anything
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-8 text-sm text-gray-600 mb-6">
            <Link href="/framework" className="hover:text-gray-900">Framework</Link>
            <Link href="/systems" className="hover:text-gray-900">For Systems</Link>
            <Link href="/practitioners" className="hover:text-gray-900">For Practitioners</Link>
            <Link href="/foryou" className="hover:text-gray-900">For You</Link>
            <Link href="/library" className="hover:text-gray-900">Library</Link>
            <Link href="/sources" className="hover:text-gray-900">Sources</Link>
          </div>
          <p className="text-sm text-gray-500">
            Document version 2.1 • Last updated December 2024 •
            9 domains, 18 sub-domains, 30+ documented cases
          </p>
        </div>
      </footer>

      {/* Case Detail Modal */}
      {selectedCase && (
        <CaseDetail caseData={selectedCase} onClose={() => setSelectedCase(null)} />
      )}
    </main>
  );
}
