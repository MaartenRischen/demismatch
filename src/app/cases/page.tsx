"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";

// Mismatch categories
const CATEGORIES = [
  { id: "all", name: "All", color: "#1a1a1a" },
  { id: "social-disconnection", name: "Social Disconnection", color: "#dc2626" },
  { id: "purpose-deprivation", name: "Purpose Deprivation", color: "#7c3aed" },
  { id: "autonomy-erosion", name: "Autonomy Erosion", color: "#ea580c" },
  { id: "attention-hijacking", name: "Attention Hijacking", color: "#0891b2" },
  { id: "community-collapse", name: "Community Collapse", color: "#be185d" },
];

interface Case {
  id: string;
  name: string;
  year: string;
  location: string;
  category: string;
  headline: string; // What exactly happened - the factual event
  oneLiner: string;
  summary: string;
  sources: string[];
  // Framework analysis
  whatIsHappening: string;
  whatIsMissing: string;
  howToPrevent: string;
}

// Individual cases with framework analysis
const CASES: Case[] = [
  // ATTENTION HIJACKING
  {
    id: "molly-russell",
    name: "Molly Russell",
    year: "2017",
    location: "Harrow, London, UK",
    category: "attention-hijacking",
    headline: "14-year-old dies by suicide after Instagram serves 2,100 depression and self-harm posts",
    oneLiner: "Instagram's algorithms fed her 2,100 posts about depression and suicide in her final six months",
    summary: "14-year-old who died by suicide after viewing thousands of images promoting self-harm and suicide on Instagram and Pinterest. A coroner ruled that social media algorithms that created 'binge periods' of harmful content contributed to her death. Pinterest sent her emails with headings like '10 depression pins you might like.'",
    sources: ["UK Coroner's Court 2022", "CBS News"],
    whatIsHappening: "Algorithms designed to maximize engagement detected her vulnerability and served increasingly extreme content. Each interaction trained the system to show more. The platform's business model—selling attention to advertisers—made her suffering profitable.",
    whatIsMissing: "Human curation. Natural information boundaries. Adults who could see what she was consuming. A platform designed for wellbeing rather than engagement. The ability to escape the content once she'd started viewing it.",
    howToPrevent: "Age-verified accounts with parental visibility. Content feeds with natural stopping points. Algorithmic transparency. Legal liability for platforms that serve harmful content to minors. Default privacy settings that limit recommendation systems."
  },
  {
    id: "megan-meier",
    name: "Megan Meier",
    year: "2006",
    location: "Missouri, USA",
    category: "attention-hijacking",
    headline: "13-year-old hangs herself after adult neighbor catfishes her with fake MySpace boyfriend",
    oneLiner: "A neighbor's mom created a fake boy to befriend her, then told her the world would be better without her",
    summary: "13-year-old who hanged herself after being cyberbullied through a fake MySpace account created by her neighbor's mother. 'Josh Evans' befriended Megan for six weeks before sending messages saying the world would be a better place without her.",
    sources: ["Megan Meier Foundation"],
    whatIsHappening: "An adult used the anonymity of online platforms to psychologically manipulate a child. The platform provided no identity verification. There was no way for Megan to know 'Josh' wasn't real. Digital communication removed the empathy cues that might have stopped the abuse.",
    whatIsMissing: "Face-to-face accountability. Identity verification. The natural social consequences that prevent adults from tormenting children. Visual feedback showing the impact of words. A community that would have intervened.",
    howToPrevent: "Identity verification for social media accounts. Platform liability for harassment. Digital literacy education about online relationships. Stronger community networks where adults are accountable to each other. Recognition that online and offline harm are equally real."
  },
  {
    id: "amanda-todd",
    name: "Amanda Todd",
    year: "2012",
    location: "British Columbia, Canada",
    category: "attention-hijacking",
    headline: "15-year-old dies by suicide after years of sextortion and cyberbullying across multiple schools",
    oneLiner: "She held up flashcards on YouTube telling her story of blackmail before hanging herself a month later",
    summary: "15-year-old who died by suicide after years of cyberbullying and sextortion. A predator convinced her to flash her chest on webcam, then blackmailed her for years. Her YouTube video using flashcards to tell her story went viral after her death.",
    sources: ["Canadian Encyclopedia", "Wikipedia"],
    whatIsHappening: "A predator used technology to exploit a child's natural desire for attention and validation. The permanence of digital content meant she could never escape the image. Moving schools didn't help—the internet followed her everywhere.",
    whatIsMissing: "The natural boundaries of physical space that once protected children. Adult supervision of online spaces. Platform mechanisms to remove exploitative content. The ability to truly 'start over' that changing communities once provided.",
    howToPrevent: "Better tools for removing non-consensual images. Criminal consequences for sextortion enforced across borders. Education about online predator tactics. Platforms designed to protect minors. Community support systems that help rather than shame victims."
  },
  {
    id: "ryan-halligan",
    name: "Ryan Halligan",
    year: "2003",
    location: "Vermont, USA",
    category: "attention-hijacking",
    headline: "13-year-old hangs himself after classmates spread rumors and share private messages publicly",
    oneLiner: "A popular girl pretended to like him online, then copy-pasted their private chats to humiliate him",
    summary: "13-year-old who hanged himself after being cyberbullied through instant messages. A bully spread rumors he was gay, and a girl he liked pretended to be interested only to share their private conversations to embarrass him.",
    sources: ["Ryan's Story Foundation", "Vermont Bully Prevention Law"],
    whatIsHappening: "Adolescent cruelty, which has always existed, was amplified by technology that made private conversations public and permanent. The digital record could be shared endlessly. There was no way to take back what was shared.",
    whatIsMissing: "The natural privacy of spoken conversations. The limited audience of pre-internet bullying. Adult visibility into online interactions. Social consequences for digital cruelty. The ability to truly move past adolescent mistakes.",
    howToPrevent: "Digital citizenship education. Parent monitoring tools that don't destroy trust. School policies that address online behavior. Platforms that limit screenshot/sharing of private messages. Community cultures that don't tolerate cruelty."
  },
  {
    id: "daniel-perry",
    name: "Daniel Perry",
    year: "2013",
    location: "Scotland, UK",
    category: "attention-hijacking",
    headline: "17-year-old jumps from bridge one hour after international sextortion gang tells him to kill himself",
    oneLiner: "A Philippines sextortion gang told him to 'commit suicide now' and he jumped from a bridge an hour later",
    summary: "17-year-old apprentice mechanic who jumped from the Forth Bridge after being blackmailed by a criminal gang. They recorded him on Skype, demanded money, and when he couldn't pay, told him 'Commit suicide now' and 'Are you dead yet?'",
    sources: ["CNN", "Deadline News"],
    whatIsHappening: "Organized criminals exploited the global reach of the internet to target a teenager. They operated from another country with impunity. The shame of exposure felt worse than death to a teenage boy.",
    whatIsMissing: "Geographic boundaries that once protected teenagers from international predators. Effective cross-border law enforcement. Education about sextortion tactics. A culture where sexual mistakes don't feel life-ending. Someone he felt he could tell.",
    howToPrevent: "International cooperation on cybercrime. Age-appropriate education about sextortion. Destigmatization of victimhood. Platform tools to report and block sextortion. 24/7 crisis support visible on platforms."
  },
  {
    id: "jessica-logan",
    name: "Jessica Logan",
    year: "2008",
    location: "Ohio, USA",
    category: "attention-hijacking",
    headline: "18-year-old hangs herself after ex-boyfriend distributes nude photo to entire school",
    oneLiner: "She went on TV to warn about sexting dangers, then hanged herself two months later",
    summary: "18-year-old high school senior who hanged herself after her ex-boyfriend distributed a nude photo she had sent him. Despite seeking help from counselors and police, she couldn't stop the harassment. She bravely appeared on local TV to share her story in May 2008, then died by suicide in July.",
    sources: ["Cyberbullying Research Center"],
    whatIsHappening: "A private image shared in trust became permanent public property. Systems that should have protected her—school, police—couldn't stop the distribution. Going public to warn others didn't end the harassment.",
    whatIsMissing: "Legal mechanisms to remove non-consensual intimate images. School policies that address digital harassment. Platform tools to trace and remove distributed images. A culture that blames distributors, not victims.",
    howToPrevent: "Revenge porn laws (now exist in most states). Platform tools for reporting non-consensual intimate images. School policies that treat distribution as seriously as other sexual misconduct. Support services for victims. Education about consent in digital contexts."
  },

  // SOCIAL DISCONNECTION
  {
    id: "tyler-clementi",
    name: "Tyler Clementi",
    year: "2010",
    location: "New Jersey, USA",
    category: "social-disconnection",
    headline: "18-year-old Rutgers freshman jumps from George Washington Bridge after roommate broadcasts intimate moment",
    oneLiner: "His roommate livestreamed him kissing another man, then tweeted about it to his followers",
    summary: "18-year-old Rutgers freshman and talented violinist who jumped from the George Washington Bridge after his roommate used a webcam to spy on him kissing another man, then posted about it on Twitter. He had just come out to his parents days before.",
    sources: ["Tyler Clementi Foundation"],
    whatIsHappening: "A private intimate moment was broadcast without consent during Tyler's most vulnerable time—newly out, away from home for the first time. The violation of privacy combined with the permanence of digital sharing made the shame feel inescapable.",
    whatIsMissing: "A culture where LGBTQ+ identity isn't shameful to expose. Roommate assignment processes that consider compatibility. Clear boundaries around privacy and surveillance. Support systems for newly out students.",
    howToPrevent: "Stronger privacy protections in shared living spaces. LGBTQ+ support resources visible to all students. Roommate conflict resolution processes. Education about consent in the digital age. Criminal consequences for invasion of privacy."
  },
  {
    id: "phoebe-prince",
    name: "Phoebe Prince",
    year: "2010",
    location: "Massachusetts, USA",
    category: "social-disconnection",
    headline: "15-year-old Irish immigrant hangs herself after three months of relentless school bullying",
    oneLiner: "The Irish immigrant was bullied for three months straight, even attacked with a drink can",
    summary: "15-year-old Irish immigrant who hanged herself after nearly three months of relentless bullying at South Hadley High School. She was verbally assaulted, physically attacked, and harassed via text and Facebook. Six students were criminally charged.",
    sources: ["Boston Magazine", "Wikipedia"],
    whatIsHappening: "A new student in a tight-knit community was targeted for social exclusion. The bullying was visible to teachers and administrators who failed to intervene. Digital harassment extended the abuse beyond school hours.",
    whatIsMissing: "Adult intervention when bullying was obvious. School culture that doesn't tolerate social cruelty. Integration support for new students. A tribe that accepted rather than rejected the newcomer.",
    howToPrevent: "Mandatory reporting and intervention protocols for bullying. Anti-bullying curricula that address social dynamics. Buddy systems for new students. Accountability for school administrators who ignore obvious harassment."
  },
  {
    id: "jadin-bell",
    name: "Jadin Bell",
    year: "2013",
    location: "Oregon, USA",
    category: "social-disconnection",
    headline: "15-year-old gay cheerleader hangs himself from playground after anti-gay bullying",
    oneLiner: "The gay cheerleader hanged himself from an elementary school playground after being called slurs",
    summary: "15-year-old gay sophomore and cheerleader who hanged himself from a playground structure after intense bullying. His father began walking across America to raise awareness but was killed by a truck halfway through. Mark Wahlberg portrayed his father in the 2020 film 'Joe Bell.'",
    sources: ["Wikipedia", "Salon"],
    whatIsHappening: "A boy who didn't fit traditional masculinity was systematically excluded and attacked. The bullying was about enforcing gender conformity. Small-town dynamics made escape impossible—everyone knew everyone.",
    whatIsMissing: "A school environment where difference is celebrated. LGBTQ+ role models and support groups. Intervention from adults who witnessed the bullying. A community that protected rather than persecuted.",
    howToPrevent: "GSA (Gender-Sexuality Alliance) clubs in all schools. LGBTQ+ inclusive curricula. Zero-tolerance policies for slurs and harassment. Community education about the impact of homophobic bullying."
  },
  {
    id: "felicia-garcia",
    name: "Felicia Garcia",
    year: "2012",
    location: "Staten Island, USA",
    category: "social-disconnection",
    headline: "15-year-old orphan jumps in front of train while football players taunt her on platform",
    oneLiner: "Football players taunted her on the train platform moments before she jumped to her death",
    summary: "15-year-old who jumped in front of a train at Staten Island Railway station as football players from her school taunted her with sexually explicit jeers. An orphan who lived with her aunt, she had been bullied about her sexual history. Her last words to a friend were 'Finally, it's here.'",
    sources: ["The World", "HuffPost"],
    whatIsHappening: "Sexual rumors were weaponized to socially destroy a vulnerable girl. The bullying was public and participated in by multiple people. She was already isolated—an orphan in a new living situation—with no protective social network.",
    whatIsMissing: "A community that protected vulnerable children. Adults who intervened when football players bullied. Sexual education that doesn't shame girls for sexuality. Support systems for orphaned children.",
    howToPrevent: "Bystander intervention training. Accountability for groups that participate in bullying. Mental health support for foster/orphaned children. School cultures that don't permit sexual shaming."
  },
  {
    id: "rehtaeh-parsons",
    name: "Rehtaeh Parsons",
    year: "2013",
    location: "Nova Scotia, Canada",
    category: "social-disconnection",
    headline: "17-year-old dies after photo of her alleged gang rape is distributed, leading to years of harassment",
    oneLiner: "After her alleged gang rape was photographed and shared, classmates called her a slut for years",
    summary: "17-year-old who died after being taken off life support following a suicide attempt. She was allegedly gang-raped at 15, photographed during the assault, and the image was widely distributed. She switched schools four times trying to escape harassment.",
    sources: ["CBC News", "Wikipedia"],
    whatIsHappening: "A sexual assault was documented and turned into entertainment. The victim was blamed while perpetrators faced no consequences. Digital distribution meant she couldn't escape by changing schools.",
    whatIsMissing: "A justice system that believed and protected victims. A culture that blamed perpetrators, not victims. The ability to escape through geographic distance. Platforms that removed assault documentation.",
    howToPrevent: "Trauma-informed responses to sexual assault reports. Swift removal of assault images from all platforms. Criminal consequences for sharing such images. Support for victims that includes digital reputation management."
  },

  // PURPOSE DEPRIVATION (Overwork/Karoshi)
  {
    id: "matsuri-takahashi",
    name: "Matsuri Takahashi",
    year: "2015",
    location: "Tokyo, Japan",
    category: "purpose-deprivation",
    headline: "24-year-old ad agency employee jumps from dormitory on Christmas Day after 130 hours overtime",
    oneLiner: "She worked 130 hours of overtime the month before she jumped from her dormitory on Christmas Day",
    summary: "24-year-old Dentsu advertising agency employee who died by suicide after being forced to work extreme overtime hours. Despite company policies capping overtime at 70 hours, electronic gate records showed she worked 130 hours of overtime in a single month. Her death sparked nationwide outrage.",
    sources: ["Unseen Japan", "RM Magazine"],
    whatIsHappening: "A young employee was worked to death by a company that ignored its own policies. Her labor was extracted without regard for her humanity. The work had no natural completion point—there was always more to do.",
    whatIsMissing: "Reasonable working hours. Enforcement of labor laws. Visible impact from work. Control over her schedule. The ability to say no. Coworkers who would have noticed her deterioration.",
    howToPrevent: "Enforced overtime limits with real penalties. Electronic monitoring of work hours. Mental health days built into work culture. Management accountability for employee wellbeing. Union representation."
  },
  {
    id: "miwa-sado",
    name: "Miwa Sado",
    year: "2013",
    location: "Tokyo, Japan",
    category: "purpose-deprivation",
    headline: "31-year-old NHK journalist dies of heart failure after 159 hours of overtime in one month",
    oneLiner: "Found dead in bed holding her cell phone after 159 hours of overtime covering elections",
    summary: "31-year-old NHK journalist who died of congestive heart failure after logging 159 hours of overtime in one month while covering political elections. She was found dead in her bed by a friend, still holding her cell phone. NHK didn't publicly acknowledge her karoshi death until 2017.",
    sources: ["NBC News", "CNN Money"],
    whatIsHappening: "The 'importance' of her work—covering elections—was used to justify destroying her body. Her phone in her hand at death shows work had colonized every moment. The company hid her death for four years.",
    whatIsMissing: "Boundaries between work and rest. Recognition that no job is worth dying for. Corporate transparency about working conditions. A culture that values life over productivity.",
    howToPrevent: "Maximum work hour laws with criminal penalties for violations. Mandatory rest periods. Corporate disclosure of employee deaths. News organizations that staff adequately for major events."
  },
  {
    id: "kenichi-uchino",
    name: "Kenichi Uchino",
    year: "2002",
    location: "Japan",
    category: "purpose-deprivation",
    headline: "30-year-old father of two dies of heart attack at 4am while working overtime",
    oneLiner: "A father of two who collapsed at 4am during his fourth hour of overtime and never woke up",
    summary: "30-year-old father-of-two who died of a heart attack at 4am while working overtime. He had been working more than 80 hours of overtime each month for the previous six months. His death was officially ruled as karoshi (death from overwork).",
    sources: ["World Economic Forum", "Wikipedia Karoshi"],
    whatIsHappening: "A father was kept from his children by a work culture that demanded total sacrifice. His body gave out while his company extracted more hours. He died in an office instead of at home with his family.",
    whatIsMissing: "Time with his children. Control over his schedule. A company that valued his life. The ability to refuse overtime. Physical presence in his family's daily life.",
    howToPrevent: "Legal limits on overtime with enforcement. Parental leave and family time protections. Company cultures that don't reward self-destruction. Economic systems that don't require overwork to survive."
  },

  // AUTONOMY EROSION
  {
    id: "kalief-browder",
    name: "Kalief Browder",
    year: "2015",
    location: "New York, USA",
    category: "autonomy-erosion",
    headline: "22-year-old hangs himself after 3 years at Rikers without trial for allegedly stealing a backpack",
    oneLiner: "Accused of stealing a backpack at 16, he spent 3 years at Rikers without trial, 2 years in solitary",
    summary: "22-year-old who hanged himself after spending three years detained at Rikers Island without trial for allegedly stealing a backpack. Nearly two years were spent in solitary confinement. Though charges were eventually dropped, he struggled with paranoia and depression.",
    sources: ["Innocence Project", "Wikipedia"],
    whatIsHappening: "A child was caged for three years without conviction. Solitary confinement caused permanent psychological damage. The system that was supposed to provide justice instead destroyed him. Bail he couldn't afford kept him imprisoned.",
    whatIsMissing: "Speedy trial rights. Alternatives to cash bail. Recognition that solitary confinement is torture. Mental health treatment after release. A justice system that treats poor defendants as human.",
    howToPrevent: "Elimination of cash bail. Strict limits on pretrial detention. Ban on solitary confinement for juveniles. Mental health support for all released prisoners. Accountability for prosecutorial delay."
  },
  {
    id: "herman-wallace",
    name: "Herman Wallace",
    year: "2013",
    location: "Louisiana, USA",
    category: "autonomy-erosion",
    headline: "Man dies 3 days after release from 41 years in solitary confinement for disputed murder",
    oneLiner: "He spent 41 years in solitary for a murder he denied, dying 3 days after his release",
    summary: "One of the 'Angola Three' who spent 41 years in solitary confinement at Louisiana State Penitentiary for a prison guard's murder he maintained he didn't commit. His conviction was overturned in 2013. He died of liver cancer three days after release, saying 'I am free' in his final moments.",
    sources: ["CBS News", "Wikipedia Angola Three"],
    whatIsHappening: "A man was kept in a 6x9 cell for 23 hours a day for 41 years. Solitary confinement was used as punishment for political activism. He was released only when dying, denied the chance to live as a free person.",
    whatIsMissing: "Human contact. Natural light. Physical movement. Meaningful activity. Due process. The ability to appeal an unjust conviction. Years of life stolen.",
    howToPrevent: "Abolition of long-term solitary confinement. Independent oversight of prison conditions. Meaningful appeals processes. Compassionate release for dying prisoners. Recognition of solitary as torture."
  },
  {
    id: "albert-woodfox",
    name: "Albert Woodfox",
    year: "2022",
    location: "Louisiana, USA",
    category: "autonomy-erosion",
    headline: "Man survives 43 years in solitary confinement—longest documented in US history",
    oneLiner: "He survived 43 years in solitary at Angola Prison—the longest in US history",
    summary: "Spent 43 years and 10 months in solitary confinement at Louisiana's Angola Prison, the longest period of solitary confinement in American history. Released in 2016, he died from COVID-19 complications in 2022 at age 75.",
    sources: ["NPR", "Wikipedia Angola Three"],
    whatIsHappening: "The prison system used solitary confinement as retaliation for Black Panther activism. He was kept in conditions that would be illegal for animal shelters. He maintained his sanity through reading and exercise in a tiny space.",
    whatIsMissing: "Decades of human contact. Natural environment. Freedom of movement. Participation in society. The years of life he could have contributed. Justice.",
    howToPrevent: "International standards for solitary confinement. Independent monitoring of prison conditions. Protected rights for political prisoners. Time limits on isolation regardless of charge."
  },
  {
    id: "thomas-silverstein",
    name: "Thomas Silverstein",
    year: "2019",
    location: "Colorado, USA",
    category: "autonomy-erosion",
    headline: "Prisoner dies at 67 after spending final 36 years of life in total solitary confinement",
    oneLiner: "He spent the last 36 years of his life in complete isolation until his heart gave out",
    summary: "Died at age 67 after spending the final 36 years of his life in solitary confinement, making him the longest-held prisoner in solitary within the Bureau of Prisons at the time of his death.",
    sources: ["Wikipedia", "Solitary Watch"],
    whatIsHappening: "After killing a guard in prison, he was placed in a specially designed isolation cell and kept there for 36 years. No human contact, no programs, no hope of release. The isolation itself became the punishment.",
    whatIsMissing: "Any possibility of rehabilitation. Human connection. Mental stimulation. Physical activity. Purpose. The recognition that even people who do terrible things remain human.",
    howToPrevent: "Recognition that permanent solitary confinement serves no rehabilitative purpose. Alternative maximum security arrangements that don't destroy humanity. Mental health care for violent prisoners."
  },

  // COMMUNITY COLLAPSE
  {
    id: "cighid-orphanage",
    name: "138 Children of Cighid",
    year: "1987-1990",
    location: "Cighid, Romania",
    category: "community-collapse",
    headline: "138 disabled children die in Romanian orphanage over 2.5 years from starvation and cold",
    oneLiner: "138 disabled children died in 2.5 years—most were only 3 years old when buried",
    summary: "Between October 1987 and March 1990, 138 children died at Cighid orphanage out of 183 admitted, a mortality rate of 75%. Children were given one piece of bread and thin gruel daily. Many froze to death. 137 graves with children's names and ages remain.",
    sources: ["RFE/RL", "Wikipedia Romanian Orphans"],
    whatIsHappening: "A state decided that disabled children were not worth resources. They were warehoused to die. The institution provided the bare minimum for survival—and often not even that. No one was held accountable.",
    whatIsMissing: "Families who could have cared for these children. A community that valued disabled lives. Adequate food, heat, and medical care. Human touch and attention. Any recognition of their humanity.",
    howToPrevent: "Deinstitutionalization of children. Support for families with disabled children. Foster care systems. International monitoring of child welfare. Criminal consequences for institutional neglect."
  },
  {
    id: "lu-xin",
    name: "Lu Xin",
    year: "2010",
    location: "Shenzhen, China",
    category: "purpose-deprivation",
    headline: "24-year-old migrant worker jumps from Foxconn factory—one of 18 suicide attempts that year",
    oneLiner: "A 24-year-old migrant worker who jumped from a Foxconn building making iPhones",
    summary: "24-year-old rural migrant worker who died by suicide at Foxconn's Shenzhen factory on May 6, 2010. He was one of 18 Foxconn employees who attempted suicide in 2010. Foxconn responded by installing nets on buildings and requiring workers to sign no-suicide pledges.",
    sources: ["Wikipedia Foxconn Suicides", "Cambridge"],
    whatIsHappening: "A young person left their community for factory work, living in dormitories with strangers. The work was monotonous, hours extreme, and social bonds impossible to form. The company's response—nets and pledges—addressed nothing.",
    whatIsMissing: "Meaningful work. Community and belonging. Control over his time. Connection to home. Any sense that his labor mattered. A reason to live beyond producing goods.",
    howToPrevent: "Worker protections enforced by international pressure. Supply chain transparency. Reasonable hours and wages. Community-building in worker housing. Mental health support. Labor unions."
  },
];

// Case card component - no images, focus on text
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
      <h3 className="text-lg font-bold text-gray-900 mb-0.5 group-hover:text-[#c75b3a] transition-colors">
        {caseData.name}
      </h3>
      <p className="text-gray-500 text-xs mb-3">{caseData.location}</p>

      {/* Headline - THE EXACT THING THAT HAPPENED */}
      <p className="text-gray-800 text-sm font-semibold leading-snug mb-3">
        {caseData.headline}
      </p>

      {/* One-liner - additional context */}
      <p className="text-gray-500 text-xs leading-relaxed italic">
        {caseData.oneLiner}
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
          {/* THE HEADLINE - What exactly happened */}
          <div className="mb-6 p-5 bg-gray-900 text-white rounded-xl">
            <p className="text-xl font-semibold leading-snug">{caseData.headline}</p>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">The Story</h2>
            <p className="text-gray-700 leading-relaxed">{caseData.summary}</p>
          </div>

          {/* Framework Analysis */}
          <div className="bg-[#FAF9F6] border border-[#c75b3a]/20 rounded-xl p-6 mb-6">
            <h2 className="text-[#c75b3a] font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Framework Analysis
            </h2>

            <div className="space-y-5">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 font-medium">What was actually happening?</p>
                <p className="text-gray-700 text-sm leading-relaxed">{caseData.whatIsHappening}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 font-medium">What was missing?</p>
                <p className="text-gray-700 text-sm leading-relaxed">{caseData.whatIsMissing}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 font-medium">How could this have been prevented?</p>
                <p className="text-gray-700 text-sm leading-relaxed">{caseData.howToPrevent}</p>
              </div>
            </div>
          </div>

          {/* Sources */}
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sources</h2>
            <ul className="space-y-1">
              {caseData.sources.map((source, idx) => (
                <li key={idx} className="text-sm text-gray-500">{source}</li>
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
          <p className="text-[#c75b3a] font-medium mb-4 tracking-wide uppercase text-sm">Individual Cases</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Cases from the<br />Mismatched World
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
            Named individuals whose lives illuminate the human cost of environmental mismatch.
            These are not stories of broken individuals—they are stories of broken containers.
          </p>
          <p className="mt-4 text-gray-400">
            Each case includes framework analysis: What was happening? What was missing? How could it have been prevented?
          </p>
        </div>
      </header>

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

      {/* CTA */}
      <section className="px-6 py-16 bg-[#c75b3a]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            See the Data Behind the Stories
          </h2>
          <p className="text-xl text-white/90 mb-8">
            These individual tragedies are symptoms of systemic patterns.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/stats"
              className="bg-white text-[#c75b3a] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              View Statistics
            </Link>
            <Link
              href="/framework"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Read the Framework
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
            {CASES.length} documented individual cases • Updated December 2024
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
