"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";

// Case types
type CaseType = "individual" | "systemic";

// Mismatch categories
const CATEGORIES = [
  {
    id: "all",
    name: "All",
    color: "#1a1a1a",
  },
  {
    id: "social-disconnection",
    name: "Social Disconnection",
    color: "#dc2626",
  },
  {
    id: "purpose-deprivation",
    name: "Purpose Deprivation",
    color: "#7c3aed",
  },
  {
    id: "autonomy-erosion",
    name: "Autonomy Erosion",
    color: "#ea580c",
  },
  {
    id: "circadian-disruption",
    name: "Circadian Disruption",
    color: "#2563eb",
  },
  {
    id: "attention-hijacking",
    name: "Attention Hijacking",
    color: "#0891b2",
  },
  {
    id: "community-collapse",
    name: "Community Collapse",
    color: "#be185d",
  },
  {
    id: "nature-severance",
    name: "Nature Severance",
    color: "#15803d",
  },
];

interface Case {
  id: string;
  name: string;
  title?: string;
  year: string;
  location: string;
  category: string;
  type: CaseType;
  oneLiner: string;
  summary: string;
  image: string;
  imageAlt: string;
  sources?: string[];
}

// INDIVIDUAL CASES - Real people with names
const INDIVIDUAL_CASES: Case[] = [
  // ATTENTION HIJACKING
  {
    id: "molly-russell",
    name: "Molly Russell",
    year: "2017",
    location: "Harrow, London, UK",
    category: "attention-hijacking",
    type: "individual",
    oneLiner: "Instagram's algorithms fed her 2,100 posts about depression and suicide in her final six months",
    summary: "14-year-old who died by suicide after viewing thousands of images promoting self-harm and suicide on Instagram and Pinterest. A coroner ruled that social media algorithms that created 'binge periods' of harmful content contributed to her death. Pinterest sent her emails with headings like '10 depression pins you might like.'",
    image: "https://upload.wikimedia.org/wikipedia/en/4/41/Molly_Russell.jpg",
    imageAlt: "Molly Russell",
    sources: ["UK Coroner's Court 2022", "CBS News"]
  },
  {
    id: "megan-meier",
    name: "Megan Meier",
    year: "2006",
    location: "Missouri, USA",
    category: "attention-hijacking",
    type: "individual",
    oneLiner: "A neighbor's mom created a fake boy to befriend her, then told her the world would be better without her",
    summary: "13-year-old who hanged herself after being cyberbullied through a fake MySpace account created by her neighbor's mother. 'Josh Evans' befriended Megan for six weeks before sending messages saying the world would be a better place without her.",
    image: "https://upload.wikimedia.org/wikipedia/en/3/39/Megan_Meier.jpg",
    imageAlt: "Megan Meier",
    sources: ["Megan Meier Foundation"]
  },
  {
    id: "amanda-todd",
    name: "Amanda Todd",
    year: "2012",
    location: "British Columbia, Canada",
    category: "attention-hijacking",
    type: "individual",
    oneLiner: "She held up flashcards on YouTube telling her story of blackmail before hanging herself a month later",
    summary: "15-year-old who died by suicide after years of cyberbullying and sextortion. A predator convinced her to flash her chest on webcam, then blackmailed her for years. Her YouTube video using flashcards to tell her story went viral after her death.",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a6/Amanda_Todd.jpg",
    imageAlt: "Amanda Todd",
    sources: ["Canadian Encyclopedia", "Wikipedia"]
  },
  {
    id: "ryan-halligan",
    name: "Ryan Halligan",
    year: "2003",
    location: "Vermont, USA",
    category: "attention-hijacking",
    type: "individual",
    oneLiner: "A popular girl pretended to like him online, then copy-pasted their private chats to humiliate him",
    summary: "13-year-old who hanged himself after being cyberbullied through instant messages. A bully spread rumors he was gay, and a girl he liked pretended to be interested only to share their private conversations to embarrass him.",
    image: "https://images.unsplash.com/photo-1516733968668-dbdce39c0c2f?w=800",
    imageAlt: "Empty computer screen at night",
    sources: ["Ryan's Story Foundation", "Vermont Bully Prevention Law"]
  },
  {
    id: "daniel-perry",
    name: "Daniel Perry",
    year: "2013",
    location: "Scotland, UK",
    category: "attention-hijacking",
    type: "individual",
    oneLiner: "A Philippines sextortion gang told him to 'commit suicide now' and he jumped from a bridge an hour later",
    summary: "17-year-old apprentice mechanic who jumped from the Forth Bridge after being blackmailed by a criminal gang. They recorded him on Skype, demanded money, and when he couldn't pay, told him 'Commit suicide now' and 'Are you dead yet?'",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800",
    imageAlt: "Bridge at night",
    sources: ["CNN", "Deadline News"]
  },
  {
    id: "jessica-logan",
    name: "Jessica Logan",
    year: "2008",
    location: "Ohio, USA",
    category: "attention-hijacking",
    type: "individual",
    oneLiner: "She went on TV to warn about sexting dangers, then hanged herself two months later",
    summary: "18-year-old high school senior who hanged herself after her ex-boyfriend distributed a nude photo she had sent him. Despite seeking help from counselors and police, she couldn't stop the harassment. She bravely appeared on local TV to share her story in May 2008, then died by suicide in July.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800",
    imageAlt: "Phone screen glowing in dark",
    sources: ["Cyberbullying Research Center"]
  },

  // SOCIAL DISCONNECTION
  {
    id: "tyler-clementi",
    name: "Tyler Clementi",
    year: "2010",
    location: "New Jersey, USA",
    category: "social-disconnection",
    type: "individual",
    oneLiner: "His roommate livestreamed him kissing another man, then tweeted about it to his followers",
    summary: "18-year-old Rutgers freshman and talented violinist who jumped from the George Washington Bridge after his roommate used a webcam to spy on him kissing another man, then posted about it on Twitter. He had just come out to his parents days before.",
    image: "https://upload.wikimedia.org/wikipedia/en/9/9e/Tyler_Clementi.jpg",
    imageAlt: "Tyler Clementi",
    sources: ["Tyler Clementi Foundation"]
  },
  {
    id: "phoebe-prince",
    name: "Phoebe Prince",
    year: "2010",
    location: "Massachusetts, USA",
    category: "social-disconnection",
    type: "individual",
    oneLiner: "The Irish immigrant was bullied for three months straight, even attacked with a drink can",
    summary: "15-year-old Irish immigrant who hanged herself after nearly three months of relentless bullying at South Hadley High School. She was verbally assaulted, physically attacked, and harassed via text and Facebook. Six students were criminally charged.",
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800",
    imageAlt: "Empty school hallway",
    sources: ["Boston Magazine", "Wikipedia"]
  },
  {
    id: "jadin-bell",
    name: "Jadin Bell",
    year: "2013",
    location: "Oregon, USA",
    category: "social-disconnection",
    type: "individual",
    oneLiner: "The gay cheerleader hanged himself from an elementary school playground after being called slurs",
    summary: "15-year-old gay sophomore and cheerleader who hanged himself from a playground structure after intense bullying. His father began walking across America to raise awareness but was killed by a truck halfway through. Mark Wahlberg portrayed his father in the 2020 film 'Joe Bell.'",
    image: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=800",
    imageAlt: "Empty playground",
    sources: ["Wikipedia", "Salon"]
  },
  {
    id: "felicia-garcia",
    name: "Felicia Garcia",
    year: "2012",
    location: "Staten Island, USA",
    category: "social-disconnection",
    type: "individual",
    oneLiner: "Football players taunted her on the train platform moments before she jumped to her death",
    summary: "15-year-old who jumped in front of a train at Staten Island Railway station as football players from her school taunted her with sexually explicit jeers. An orphan who lived with her aunt, she had been bullied about her sexual history. Her last words to a friend were 'Finally, it's here.'",
    image: "https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=800",
    imageAlt: "Empty train platform",
    sources: ["The World", "HuffPost"]
  },
  {
    id: "rehtaeh-parsons",
    name: "Rehtaeh Parsons",
    year: "2013",
    location: "Nova Scotia, Canada",
    category: "social-disconnection",
    type: "individual",
    oneLiner: "After her alleged gang rape was photographed and shared, classmates called her a slut for years",
    summary: "17-year-old who died after being taken off life support following a suicide attempt. She was allegedly gang-raped at 15, photographed during the assault, and the image was widely distributed. She switched schools four times trying to escape harassment.",
    image: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=800",
    imageAlt: "Person sitting alone",
    sources: ["CBC News", "Wikipedia"]
  },

  // PURPOSE DEPRIVATION (Overwork/Karoshi)
  {
    id: "matsuri-takahashi",
    name: "Matsuri Takahashi",
    year: "2015",
    location: "Tokyo, Japan",
    category: "purpose-deprivation",
    type: "individual",
    oneLiner: "She worked 130 hours of overtime the month before she jumped from her dormitory on Christmas Day",
    summary: "24-year-old Dentsu advertising agency employee who died by suicide after being forced to work extreme overtime hours. Despite company policies capping overtime at 70 hours, electronic gate records showed she worked 130 hours of overtime in a single month. Her death sparked nationwide outrage.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800",
    imageAlt: "Office building at night",
    sources: ["Unseen Japan", "RM Magazine"]
  },
  {
    id: "miwa-sado",
    name: "Miwa Sado",
    year: "2013",
    location: "Tokyo, Japan",
    category: "purpose-deprivation",
    type: "individual",
    oneLiner: "Found dead in bed holding her cell phone after 159 hours of overtime covering elections",
    summary: "31-year-old NHK journalist who died of congestive heart failure after logging 159 hours of overtime in one month while covering political elections. She was found dead in her bed by a friend, still holding her cell phone. NHK didn't publicly acknowledge her karoshi death until 2017.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
    imageAlt: "Person slumped at desk",
    sources: ["NBC News", "CNN Money"]
  },
  {
    id: "kenichi-uchino",
    name: "Kenichi Uchino",
    year: "2002",
    location: "Japan",
    category: "purpose-deprivation",
    type: "individual",
    oneLiner: "A father of two who collapsed at 4am during his fourth hour of overtime and never woke up",
    summary: "30-year-old father-of-two who died of a heart attack at 4am while working overtime. He had been working more than 80 hours of overtime each month for the previous six months. His death was officially ruled as karoshi (death from overwork).",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
    imageAlt: "Office at night",
    sources: ["World Economic Forum", "Wikipedia Karoshi"]
  },

  // AUTONOMY EROSION
  {
    id: "kalief-browder",
    name: "Kalief Browder",
    year: "2015",
    location: "New York, USA",
    category: "autonomy-erosion",
    type: "individual",
    oneLiner: "Accused of stealing a backpack at 16, he spent 3 years at Rikers without trial, 2 years in solitary",
    summary: "22-year-old who hanged himself after spending three years detained at Rikers Island without trial for allegedly stealing a backpack. Nearly two years were spent in solitary confinement. Though charges were eventually dropped, he struggled with paranoia and depression.",
    image: "https://upload.wikimedia.org/wikipedia/en/0/0c/Kalief_Browder.png",
    imageAlt: "Kalief Browder",
    sources: ["Innocence Project", "Wikipedia"]
  },
  {
    id: "herman-wallace",
    name: "Herman Wallace",
    year: "2013",
    location: "Louisiana, USA",
    category: "autonomy-erosion",
    type: "individual",
    oneLiner: "He spent 41 years in solitary for a murder he denied, dying 3 days after his release",
    summary: "One of the 'Angola Three' who spent 41 years in solitary confinement at Louisiana State Penitentiary for a prison guard's murder he maintained he didn't commit. His conviction was overturned in 2013. He died of liver cancer three days after release, saying 'I am free' in his final moments.",
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800",
    imageAlt: "Prison cell",
    sources: ["CBS News", "Wikipedia Angola Three"]
  },
  {
    id: "albert-woodfox",
    name: "Albert Woodfox",
    year: "2022",
    location: "Louisiana, USA",
    category: "autonomy-erosion",
    type: "individual",
    oneLiner: "He survived 43 years in solitary at Angola Prison—the longest in US history",
    summary: "Spent 43 years and 10 months in solitary confinement at Louisiana's Angola Prison, the longest period of solitary confinement in American history. Released in 2016, he died from COVID-19 complications in 2022 at age 75.",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800",
    imageAlt: "Prison bars",
    sources: ["NPR", "Wikipedia Angola Three"]
  },
  {
    id: "thomas-silverstein",
    name: "Thomas Silverstein",
    year: "2019",
    location: "Colorado, USA",
    category: "autonomy-erosion",
    type: "individual",
    oneLiner: "He spent the last 36 years of his life in complete isolation until his heart gave out",
    summary: "Died at age 67 after spending the final 36 years of his life in solitary confinement, making him the longest-held prisoner in solitary within the Bureau of Prisons at the time of his death.",
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800",
    imageAlt: "Solitary cell",
    sources: ["Wikipedia", "Solitary Watch"]
  },

  // FOXCONN
  {
    id: "lu-xin",
    name: "Lu Xin",
    year: "2010",
    location: "Shenzhen, China",
    category: "purpose-deprivation",
    type: "individual",
    oneLiner: "A 24-year-old migrant worker who jumped from a Foxconn building making iPhones",
    summary: "24-year-old rural migrant worker who died by suicide at Foxconn's Shenzhen factory on May 6, 2010. He was one of 18 Foxconn employees who attempted suicide in 2010. Foxconn responded by installing nets on buildings and requiring workers to sign no-suicide pledges.",
    image: "https://images.unsplash.com/photo-1567789884554-0b844b597180?w=800",
    imageAlt: "Factory building",
    sources: ["Wikipedia Foxconn Suicides", "Cambridge"]
  },

  // CIGHID ORPHANAGE
  {
    id: "cighid-orphanage",
    name: "138 Children of Cighid",
    year: "1987-1990",
    location: "Cighid, Romania",
    category: "social-disconnection",
    type: "individual",
    oneLiner: "138 disabled children died in 2.5 years—most were only 3 years old when buried",
    summary: "Between October 1987 and March 1990, 138 children died at Cighid orphanage out of 183 admitted, a mortality rate of 75%. Children were given one piece of bread and thin gruel daily. Many froze to death. 137 graves with children's names and ages remain.",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800",
    imageAlt: "Empty crib",
    sources: ["RFE/RL", "Wikipedia Romanian Orphans"]
  },
];

// SYSTEMIC CASES - Patterns and studies affecting populations
const SYSTEMIC_CASES: Case[] = [
  // SOCIAL DISCONNECTION
  {
    id: "spitz-hospitalism",
    title: "Spitz Hospitalism Studies",
    name: "René Spitz Research",
    year: "1945",
    location: "South America",
    category: "social-disconnection",
    type: "systemic",
    oneLiner: "They had food, shelter, and medical care. They didn't have arms around them. They died anyway.",
    summary: "Babies in clean, well-fed orphanages dying at rates of 30-37%. Staff rarely spoke to or held the children. The only variable missing: human touch.",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800",
    imageAlt: "Empty hospital crib",
    sources: ["Spitz, R.A. (1945) Hospitalism: Psychoanalytic Study of the Child"]
  },
  {
    id: "romanian-orphanages",
    title: "Romanian Orphanage Crisis",
    name: "170,000+ Children",
    year: "1989-present",
    location: "Romania",
    category: "social-disconnection",
    type: "systemic",
    oneLiner: "The institution met their physical needs. Their brains needed to be known.",
    summary: "170,000+ children warehoused in state orphanages. Brain scans showed physical damage—reduced grey and white matter. Children might see 17 different caretakers in a week.",
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800",
    imageAlt: "Child alone looking through window",
    sources: ["Bucharest Early Intervention Project (Harvard/Tulane)"]
  },
  {
    id: "widowhood-effect",
    title: "The Widowhood Effect",
    name: "NIH Study",
    year: "2008",
    location: "United States",
    category: "social-disconnection",
    type: "systemic",
    oneLiner: "You can literally die from losing the person who knew you.",
    summary: "NIH study of 370,000+ couples: when a spouse dies, the surviving partner faces dramatically elevated mortality. Men face 70% higher risk, women 27%.",
    image: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=800",
    imageAlt: "Elderly person sitting alone",
    sources: ["National Institutes of Health 2008"]
  },
  {
    id: "kodokushi",
    title: "Kodokushi (Lonely Death)",
    name: "Japan Crisis",
    year: "2024",
    location: "Japan",
    category: "social-disconnection",
    type: "systemic",
    oneLiner: "His rent was paid automatically. His life wasn't.",
    summary: "37,227 people found dead alone in just the first half of 2024. 130 bodies remained undiscovered for over a year. 70% were elderly.",
    image: "https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=800",
    imageAlt: "Empty apartment room",
    sources: ["National Police Agency Japan 2024"]
  },
  {
    id: "hikikomori",
    title: "Hikikomori Epidemic",
    name: "1.46 Million Withdrawn",
    year: "2022",
    location: "Japan",
    category: "social-disconnection",
    type: "systemic",
    oneLiner: "Unable to meet impossible expectations, they withdrew. Society now publishes guides for when their parents' bodies decompose.",
    summary: "1.46 million Japanese living in complete social withdrawal, often confined to a single room for years. 34.7% withdrawn for 7+ years—doubled from 2010.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
    imageAlt: "Dark room with computer glow",
    sources: ["Japan Cabinet Office 2022"]
  },
  {
    id: "solitary-confinement",
    title: "Solitary Confinement Psychosis",
    name: "382,440 Inmates Studied",
    year: "2020",
    location: "United States",
    category: "social-disconnection",
    type: "systemic",
    oneLiner: "The walls weren't closing in. His brain was.",
    summary: "Systematic review of 382,440 inmates: solitary confinement increases self-harm, suicide, and permanent brain changes. The hippocampus physically shrinks.",
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800",
    imageAlt: "Empty cell with barred window",
    sources: ["Frontiers in Psychiatry 2020"]
  },
  {
    id: "holt-lunstad",
    title: "Loneliness as Mortality Risk",
    name: "Meta-Analysis",
    year: "2015",
    location: "Global",
    category: "social-disconnection",
    type: "systemic",
    oneLiner: "Lacking social connection is now a clinical risk factor for death.",
    summary: "Landmark analysis of 308,849 participants: loneliness and social isolation are mortality risk factors equivalent to smoking 15 cigarettes daily.",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800",
    imageAlt: "Person sitting alone on bench",
    sources: ["Holt-Lunstad et al., BYU 2015"]
  },

  // PURPOSE DEPRIVATION
  {
    id: "whitehall-studies",
    title: "The Whitehall Studies",
    name: "17,500+ Civil Servants",
    year: "1967-present",
    location: "United Kingdom",
    category: "purpose-deprivation",
    type: "systemic",
    oneLiner: "The executives weren't dying of stress. The messengers were dying of powerlessness.",
    summary: "17,500+ civil servants: mortality 3x higher for lowest employment grades vs highest—regardless of lifestyle. Traditional risk factors explained only 40% of the difference.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800",
    imageAlt: "Office hierarchy cubicles",
    sources: ["Sir Michael Marmot, UCL"]
  },
  {
    id: "ikigai-mortality",
    title: "Ikigai & Mortality",
    name: "43,391 Adults",
    year: "2008",
    location: "Japan",
    category: "purpose-deprivation",
    type: "systemic",
    oneLiner: "Without a reason to wake up, the body stops bothering.",
    summary: "43,391 Japanese adults followed 7 years: those without ikigai (life purpose) had 1.5x higher all-cause mortality and 60% higher cardiovascular death.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    imageAlt: "Person staring out window pensively",
    sources: ["Ohsaki Cohort Study 2008"]
  },
  {
    id: "retirement-mortality",
    title: "Early Retirement Deaths",
    name: "Shell Oil Study",
    year: "2000-2018",
    location: "United States",
    category: "purpose-deprivation",
    type: "systemic",
    oneLiner: "They called it 'freedom.' Their bodies called it abandonment.",
    summary: "Shell Oil study: retiring at 55 doubled death risk before 65 vs working past 60. German study of 88,399: early retirement increases premature death risk 13.4%.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    imageAlt: "Empty desk with packed box",
    sources: ["NBER, Shell Oil cohort study"]
  },
  {
    id: "veteran-suicide",
    title: "Veteran Transition Crisis",
    name: "57% Higher Risk",
    year: "2022",
    location: "United States",
    category: "purpose-deprivation",
    type: "systemic",
    oneLiner: "In uniform, they had purpose. Out of it, they had nothing.",
    summary: "Veterans at 57% higher suicide risk. First year after military most vulnerable (46.2 per 100,000). 80% say civilians don't understand them.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800",
    imageAlt: "Soldier silhouette facing away",
    sources: ["Stop Soldier Suicide, VA"]
  },
  {
    id: "karoshi",
    title: "Karoshi Epidemic",
    name: "750,000 Global Deaths",
    year: "2024",
    location: "Global",
    category: "purpose-deprivation",
    type: "systemic",
    oneLiner: "They worked themselves to death. Literally.",
    summary: "1,304 recognized karoshi cases in Japan in 2024—record high. Globally, WHO/ILO estimate 750,000 deaths from working 55+ hours/week.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
    imageAlt: "Person slumped at desk late night",
    sources: ["Japan Ministry of Health, WHO/ILO 2021"]
  },

  // AUTONOMY EROSION
  {
    id: "amazon-warehouse",
    title: "Amazon Warehouse Deaths",
    name: "Systematic Pattern",
    year: "2022",
    location: "United States",
    category: "autonomy-erosion",
    type: "systemic",
    oneLiner: "Cardboard was placed around the body as a screen, and operations continued.",
    summary: "Three workers died at separate warehouses within weeks during heat wave. Rafael Mota Frias pleaded for fans before dying. Cardboard was placed around one body while operations continued.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
    imageAlt: "Warehouse worker among boxes",
    sources: ["NBC News, OSHA investigations"]
  },
  {
    id: "rana-plaza",
    title: "Rana Plaza Collapse",
    name: "1,134 Deaths",
    year: "2013",
    location: "Bangladesh",
    category: "autonomy-erosion",
    type: "systemic",
    oneLiner: "They saw the cracks. They were told to ignore them or lose their pay.",
    summary: "1,134 deaths when garment factory collapsed. Building evacuated day before due to cracks—management threatened to withhold pay if workers didn't return.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    imageAlt: "Garment factory workers",
    sources: ["ILO, Harvard Business School"]
  },
  {
    id: "foxconn-wave",
    title: "Foxconn Suicide Wave",
    name: "14 Deaths, 400,000 Workers",
    year: "2010",
    location: "China",
    category: "autonomy-erosion",
    type: "systemic",
    oneLiner: "Machines have seemingly held humans captive.",
    summary: "14 deaths among 400,000 workers at Apple supplier. 12-hour shifts, 100-hour weeks, $1-2/hour. Company response: suicide nets and no-suicide pledges.",
    image: "https://images.unsplash.com/photo-1567789884554-0b844b597180?w=800",
    imageAlt: "Factory assembly line",
    sources: ["20 Chinese universities report"]
  },
  {
    id: "china-996",
    title: "China 996 Work Deaths",
    name: "Systemic Overwork",
    year: "2021",
    location: "China",
    category: "autonomy-erosion",
    type: "systemic",
    oneLiner: "The work schedule was declared illegal. The deaths continued.",
    summary: "Pinduoduo employee (23) collapsed past midnight after 300+ hours/month. ByteDance employee (28) died after gym. 996 system: 9am-9pm, 6 days/week.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
    imageAlt: "Office at night with lights on",
    sources: ["NPR, South China Morning Post"]
  },

  // CIRCADIAN DISRUPTION
  {
    id: "nurses-night-shift",
    title: "Nurses' Health Study",
    name: "74,862 Nurses",
    year: "1988-2010",
    location: "United States",
    category: "circadian-disruption",
    type: "systemic",
    oneLiner: "They kept patients alive through the night. The night shifts took years off their own lives.",
    summary: "74,862 nurses followed 22 years. 14,181 deaths. Women with 5+ years rotating night shifts showed significantly increased mortality. WHO calls shift work a 'probable carcinogen.'",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
    imageAlt: "Nurse in hospital corridor at night",
    sources: ["Nurses' Health Study, IARC"]
  },
  {
    id: "iarc-night-shift",
    title: "Night Shift Cancer Risk",
    name: "WHO Classification",
    year: "2019",
    location: "Global",
    category: "circadian-disruption",
    type: "systemic",
    oneLiner: "1 in 5 workers worldwide are exposed to a probable carcinogen every shift.",
    summary: "WHO's cancer agency classified night shift work as 'probably carcinogenic' based on breast, prostate, colon cancer evidence. Mechanism: melatonin suppression.",
    image: "https://images.unsplash.com/photo-1516733968668-dbdce39c0c2f?w=800",
    imageAlt: "Night shift worker under artificial light",
    sources: ["IARC Monographs Volume 124"]
  },

  // ATTENTION HIJACKING
  {
    id: "teen-suicide-social",
    title: "Teen Suicide & Social Media",
    name: "62% Rise 2007-2021",
    year: "2007-2021",
    location: "United States",
    category: "attention-hijacking",
    type: "systemic",
    oneLiner: "Around 2010-11, smartphones took off. So did the death rate.",
    summary: "Youth suicide rose 62% from 2007-2021. Teen girls 10-14 saw 131% jump. 22% of high schoolers considered suicide in 2021 vs 16% in 2011.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    imageAlt: "Teenagers on phones",
    sources: ["CDC, Jonathan Haidt"]
  },
  {
    id: "instagram-eating",
    title: "Instagram Body Image Harm",
    name: "Facebook's Own Research",
    year: "2021",
    location: "Global",
    category: "attention-hijacking",
    type: "systemic",
    oneLiner: "An innocent search for healthy recipes led to accounts named 'eternally starved.'",
    summary: "Facebook whistleblower revealed internal research: 'We make body issues worse for one in three girls.' 13-year-old searching 'healthy recipes' led to graphic eating disorder content.",
    image: "https://images.unsplash.com/photo-1585282263861-f55e341878f8?w=800",
    imageAlt: "Person scrolling social media",
    sources: ["Frances Haugen whistleblower, Facebook Papers"]
  },

  // COMMUNITY COLLAPSE
  {
    id: "roseto-effect",
    title: "The Roseto Effect",
    name: "50% Less Heart Disease",
    year: "1955-1985",
    location: "Pennsylvania, USA",
    category: "community-collapse",
    type: "systemic",
    oneLiner: "Same diet, same smoking, same genes. Different community. Half the heart attacks.",
    summary: "Italian-American town with half the heart disease despite identical diet, smoking, exercise. Only difference: tight-knit community. When cohesion eroded, heart disease matched neighbors.",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800",
    imageAlt: "Community gathering at table",
    sources: ["Wolf & Bruhn 1992"]
  },
  {
    id: "deaths-of-despair",
    title: "Deaths of Despair",
    name: "500,000+ Dead",
    year: "1998-present",
    location: "United States",
    category: "community-collapse",
    type: "systemic",
    oneLiner: "They didn't die from lack of money. They died from lack of a reason to be alive.",
    summary: "500,000+ middle-aged white Americans dead from suicide, overdose, alcohol. US life expectancy declined 3 years—unprecedented.",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800",
    imageAlt: "Abandoned main street",
    sources: ["Case & Deaton 2020"]
  },
  {
    id: "alaska-native",
    title: "Alaska Native Suicide Crisis",
    name: "500% Increase",
    year: "1960-present",
    location: "Alaska",
    category: "community-collapse",
    type: "systemic",
    oneLiner: "Before contact, suicide was unknown. After assimilation, it became the second cause of death.",
    summary: "Suicide nearly unheard of through 1959. Then increased 500% during rapid social transition. Alaska Natives die by suicide at 4x US average.",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800",
    imageAlt: "Remote Alaska landscape",
    sources: ["Suicide Prevention Resource Center"]
  },
  {
    id: "european-heatwave",
    title: "2003 European Heat Wave",
    name: "70,000+ Deaths",
    year: "2003",
    location: "Europe",
    category: "community-collapse",
    type: "systemic",
    oneLiner: "They died in their apartments. No one noticed until the smell.",
    summary: "70,000+ deaths, 14,802 in France. 82% of victims 75+. 92% of Paris home deaths lived alone. No one checked on the elderly.",
    image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800",
    imageAlt: "Empty apartment building",
    sources: ["French National Institute of Health"]
  },

  // NATURE SEVERANCE
  {
    id: "nurses-green-space",
    title: "Green Space & Mortality",
    name: "121,000 Women",
    year: "2008-2016",
    location: "United States",
    category: "nature-severance",
    type: "systemic",
    oneLiner: "The trees weren't exercising for them. They were calming their minds.",
    summary: "121,000 women: those in highest green space areas were 12% less likely to die during 8-year follow-up. Mental health, not exercise, was the driver.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    imageAlt: "Sunlight through forest trees",
    sources: ["Nurses' Health Study, Harvard"]
  },
  {
    id: "artificial-light",
    title: "Artificial Light at Night",
    name: "83% of World Affected",
    year: "Ongoing",
    location: "Global",
    category: "nature-severance",
    type: "systemic",
    oneLiner: "We engineered darkness out of our lives and called the consequences mental illness.",
    summary: "83% of world population lives under light-polluted skies. Blue light after sunset suppresses melatonin by up to 85%. Correlates with cancer, obesity, depression.",
    image: "https://images.unsplash.com/photo-1514897575457-c4db467cf78e?w=800",
    imageAlt: "City lights at night",
    sources: ["WHO, IARC"]
  },
];

// Combine all cases
const ALL_CASES = [...INDIVIDUAL_CASES, ...SYSTEMIC_CASES];

// Component: Case card - ONE-LINER FOCUSED
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
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col"
    >
      {/* Image - smaller */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src={caseData.image}
          alt={caseData.imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Name overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-white font-bold text-lg leading-tight">
            {caseData.name}
          </p>
          <p className="text-white/70 text-xs mt-0.5">
            {caseData.year} • {caseData.location}
          </p>
        </div>

        {/* Category badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white uppercase tracking-wider"
          style={{ backgroundColor: category?.color || '#666' }}
        >
          {category?.name}
        </div>
      </div>

      {/* ONE-LINER - The Hook */}
      <div className="p-5 flex-1 flex flex-col justify-center">
        <blockquote className="text-gray-900 text-base leading-relaxed font-medium">
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
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-72">
          <Image
            src={caseData.image}
            alt={caseData.imageAlt}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

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
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white uppercase tracking-wider mb-3"
              style={{ backgroundColor: category?.color }}
            >
              {category?.name}
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">{caseData.name}</h1>
            <p className="text-white/80 text-sm">{caseData.year} • {caseData.location}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* THE HOOK - One-liner prominent */}
          <blockquote className="mb-6 p-5 bg-gray-900 text-white rounded-xl">
            <p className="text-xl italic leading-relaxed">"{caseData.oneLiner}"</p>
          </blockquote>

          {/* Summary */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">The Story</h2>
            <p className="text-gray-700 leading-relaxed">{caseData.summary}</p>
          </div>

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
  const [caseType, setCaseType] = useState<CaseType>("individual");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showWarning, setShowWarning] = useState(true);

  const cases = caseType === "individual" ? INDIVIDUAL_CASES : SYSTEMIC_CASES;

  const filteredCases = useMemo(() => {
    if (selectedCategory === "all") return cases;
    return cases.filter(c => c.category === selectedCategory);
  }, [selectedCategory, cases]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: cases.length };
    cases.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [cases]);

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
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
        <div className="max-w-5xl mx-auto">
          <p className="text-[#c75b3a] font-medium mb-4 tracking-wide uppercase text-sm">Evidence Base</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Cases from the<br />Mismatched World
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
            Real stories of what happens when environments fundamentally misalign with human nature.
            These are not stories of broken individuals—they are stories of broken containers.
          </p>
        </div>
      </header>

      {/* Type Toggle */}
      <div className="sticky top-20 z-40 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          {/* Individual / Systemic Toggle */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex bg-gray-200 rounded-full p-1">
              <button
                onClick={() => { setCaseType("individual"); setSelectedCategory("all"); }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  caseType === "individual"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Individual Cases
              </button>
              <button
                onClick={() => { setCaseType("systemic"); setSelectedCategory("all"); }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  caseType === "systemic"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Systemic Patterns
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide justify-center flex-wrap">
            {CATEGORIES.map(category => {
              const count = categoryCounts[category.id] || 0;
              if (category.id !== "all" && count === 0) return null;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
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

      {/* Description based on type */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <p className="text-center text-gray-600 text-sm">
          {caseType === "individual"
            ? "Named individuals whose lives illuminate the human cost of mismatch"
            : "Studies and patterns showing systemic scale of the problem"
          }
        </p>
      </div>

      {/* Cases Grid */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
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
              "To be known by people who cared",
              "To have a role only they could fill",
              "To see the result of their work",
              "To have their emotions witnessed",
              "To touch and be touched",
              "To know their absence would be noticed",
              "To sleep when dark, wake when light",
              "To move their bodies through space",
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
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-6 text-sm mb-6">
            <Link href="/framework" className="hover:text-white transition">Framework</Link>
            <Link href="/library" className="hover:text-white transition">Library</Link>
            <Link href="/systems" className="hover:text-white transition">For Systems</Link>
            <Link href="/practitioners" className="hover:text-white transition">For Practitioners</Link>
            <Link href="/sources" className="hover:text-white transition">Sources</Link>
          </div>
          <p className="text-sm">
            {INDIVIDUAL_CASES.length} individual cases • {SYSTEMIC_CASES.length} systemic patterns •
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
