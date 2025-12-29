import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

const envContent = readFileSync('/Users/maartenrischen/SQUARETRUTHS/.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) envVars[m[1]] = m[2];
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabase = createClient(supabaseUrl, envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const UNUSED_SERIES = [
  "The Sequencing", "Dashboard Calibrated", "Meaning & Purpose 100",
  "The Trap Recognized", "The Bridge", "The Same Scene Two Eyes",
  "Utopia", "Misc", "Work Rest & Productivity",
  "The Mismatch Answer 100 DEMISMATCH TECH VOL6",
  "The Mismatch Answer 100 REAL THING VOL7", "The Mismatch Answer 100 VOL3",
  "The Mismatch Answer", "Dystopia", "Money & Status",
  "The Mismatch Actually 100 EVERYONE WRONG VOL11"
];

function isUnused(img) {
  if (!img.series || img.series.length === 0) return false;
  return img.series.every(s => UNUSED_SERIES.includes(s));
}

// COMPREHENSIVE keyword mapping for ALL questions based on ANSWER content
// Format: { primary: [must match], secondary: [bonus points] }
const questionKeywords = {
  // Questions 1-20: User-defined, kept as-is

  // Question 21: "Why can't you stop ruminating?" - Answer: rumination, planning, unsolvable problems
  21: { primary: ['rumination', 'ruminat', 'overthink', 'loop'], secondary: ['worry', 'thought', 'plan', 'churn', 'problem'] },

  // Question 22: "Why do you imagine people judging you?" - Answer: internal audience, imaginary critics
  22: { primary: ['audience', 'judgment', 'judge', 'critic'], secondary: ['watch', 'eyes', 'imagin', 'anxiety', 'harsh'] },

  // Question 23: "Why do you always assume the worst?" - Answer: negativity bias, threat detection
  23: { primary: ['negativ', 'worst', 'threat', 'bias'], secondary: ['catastroph', 'fear', 'danger', 'pessim', 'phantom'] },

  // Question 24: "Why can you never be good enough?" - Answer: perfectionism trap, contradictory standards
  24: { primary: ['perfect', 'enough', 'good', 'standard'], secondary: ['inadequa', 'fail', 'trap', 'contradic'] },

  // Question 25: "Why is almost-having-control worse?" - Answer: partial control, anxiety zone
  25: { primary: ['control', 'partial', 'uncertain'], secondary: ['helpless', 'power', 'agency', 'affect', 'determin'] },

  // Question 26: "How many close friends do you need?" - Answer: Five, 3am call
  26: { primary: ['five', 'friend', 'close', 'intimate'], secondary: ['vulnerab', 'call', 'circle', 'deep'] },

  // Question 27: "How many people can you care about?" - Answer: 15, deaths would devastate
  27: { primary: ['fifteen', 'care', 'devastat'], secondary: ['active', 'contact', 'month', 'meaningful'] },

  // Question 29: "Why does modern work feel meaningless?" - Answer: immediate-return, hunt→eat, abstraction
  29: { primary: ['work', 'meaningless', 'abstract', 'delayed'], secondary: ['hunt', 'eat', 'effort', 'survival', 'invisible'] },

  // Question 30: "What are bullshit jobs?" - Answer: nothing tangible, visible contribution need
  30: { primary: ['bullshit', 'meaningless', 'pointless', 'tangible'], secondary: ['job', 'work', 'useless', 'contribut', 'benefit'] },

  // Question 31: "Why are you exhausted by crowds?" - Answer: stranger overload
  31: { primary: ['stranger', 'crowd', 'overload', 'exhaust'], secondary: ['city', 'assess', 'unknown', 'encounter'] },

  // Question 32: "How many strangers did ancestors encounter?" - Answer: 1,000 lifetime vs thousands daily
  32: { primary: ['stranger', 'ancestor', 'encounter'], secondary: ['lifetime', 'daily', 'known', 'face'] },

  // Question 33: "Why comparing to millions?" - Answer: status competition mismatch
  33: { primary: ['compar', 'status', 'million', 'billion'], secondary: ['compet', 'global', 'local', 'ordinary'] },

  // Question 34: "Why do you care so much about status?" - Answer: survival, indirect fitness
  34: { primary: ['status', 'survival', 'prestige'], secondary: ['resource', 'allies', 'mates', 'protect', 'drive'] },

  // Question 35: "Why do fake things feel better?" - Answer: hyperstimuli
  35: { primary: ['hyperstimul', 'fake', 'exaggerat'], secondary: ['hijack', 'porn', 'junk', 'inadequat', 'real'] },

  // Question 36: "Why connected to people who don't know you?" - Answer: parasocial relationships
  36: { primary: ['parasocial', 'celebrity', 'one-way'], secondary: ['bond', 'influenc', 'bandwidth', 'name'] },

  // Question 37: "Why is suffering profitable?" - Answer: atomized individual, ideal consumer
  37: { primary: ['profit', 'suffer', 'consumer', 'atomiz'], secondary: ['customer', 'sever', 'business', 'model'] },

  // Question 38: "How do companies make money from unhappiness?" - Answer: exploitation formula
  38: { primary: ['exploit', 'formula', 'monetiz'], secondary: ['block', 'proxy', 'satisfy', 'return'] },

  // Question 39: "Why does being alone make you easier to manipulate?" - Answer: atomized, no counter-narrative
  39: { primary: ['alone', 'manipul', 'atomiz', 'vulnerab'], secondary: ['counter', 'narrative', 'community', 'watch'] },

  // Question 40: "Why are slot machines and social media addictive?" - Answer: variable ratio reinforcement
  40: { primary: ['slot', 'machine', 'variable', 'ratio'], secondary: ['gambl', 'random', 'reward', 'lever', 'refresh'] },

  // Question 41: "What is dopamine and how is it hijacked?" - Answer: reward-seeking, anticipation
  41: { primary: ['dopamine', 'reward', 'anticipat'], secondary: ['spike', 'trigger', 'tolerance', 'effort'] },

  // Question 42: "How does social media exploit you?" - Answer: scrolling, you're the product
  42: { primary: ['scroll', 'exploit', 'product', 'media'], secondary: ['attention', 'algorithm', 'feed', 'dunbar', 'loneli'] },

  // Question 43: "Is depression really a chemical imbalance?" - Answer: serotonin hypothesis debunked
  43: { primary: ['serotonin', 'chemical', 'imbalance', 'debunk'], secondary: ['hypothes', 'market', 'ssri', 'override'] },

  // Question 44: "What does psychiatric medication actually do?" - Answer: signal override, oil light
  44: { primary: ['medication', 'signal', 'override', 'suppress'], secondary: ['pill', 'oil', 'light', 'engine', 'degrad'] },

  // Question 45: "How does pharma exploit you?" - Answer: invented chemical imbalance, ghostwritten
  45: { primary: ['pharma', 'invent', 'chemical', 'ghostwrit'], secondary: ['sell', 'paid', 'expert', 'check'] },

  // Question 46: "What are ghostwritten studies?" - Answer: research written by pharma
  46: { primary: ['ghostwrit', 'pharma', 'research', 'paper'], secondary: ['academic', 'litigat', 'market', 'scientif'] },

  // Question 47: "Why is chronic stress destroying your body?" - Answer: cortisol, tiger never leaves
  47: { primary: ['cortisol', 'stress', 'chronic', 'tiger'], secondary: ['spike', 'dissipat', 'mobiliz', 'body'] },

  // Question 48: "How does news media exploit you?" - Answer: threat activation, open loops
  48: { primary: ['news', 'media', 'threat', 'loop'], secondary: ['worry', 'cortisol', 'engage', 'fix'] },

  // Question 49: "How does food industry exploit you?" - Answer: bliss point
  49: { primary: ['food', 'bliss', 'point', 'sugar'], secondary: ['fat', 'salt', 'crave', 'addict', 'moderat'] },

  // Question 50: "How do dating apps exploit you?" - Answer: business model requires failure
  50: { primary: ['dating', 'app', 'swipe', 'fail'], secondary: ['match', 'lost', 'user', 'engage', 'outcome'] },

  // Question 51: "How does porn exploit you?" - Answer: hyperstimuli, mating drive
  51: { primary: ['porn', 'hyperstimul', 'mating', 'novelty'], secondary: ['dopamine', 'overwhelm', 'partner', 'proxy'] },

  // Question 52: "How does self-help exploit you?" - Answer: requires that it doesn't work
  52: { primary: ['self-help', 'self help', 'book', 'individual'], secondary: ['solution', 'systemic', 'work', 'buy'] },

  // Question 53: "Why obsessed with celebrities?" - Answer: hyperstimulus for status, parasocial
  53: { primary: ['celebrity', 'fame', 'parasocial', 'status'], secondary: ['bond', 'invest', 'displac', 'reciproc'] },

  // Question 54: "Why do sports fans act like it matters?" - Answer: tribal belonging through proxy
  54: { primary: ['sport', 'team', 'fan', 'tribal'], secondary: ['belong', 'proxy', 'enemy', 'goal'] },

  // Question 55: "Why isn't this common knowledge?" - Answer: incentives, money, funding
  55: { primary: ['incent', 'money', 'fund', 'profit'], secondary: ['conspir', 'drug', 'environment', 'ghostwrit'] },

  // Question 56: "Who are the most exploited customers?" - Answer: whales
  56: { primary: ['whale', 'exploit', 'gambl', 'vulnerab'], secondary: ['revenue', 'problem', 'addict', 'profit'] },

  // Question 57: "How does advertising exploit you?" - Answer: manufacturing inadequacy
  57: { primary: ['advertis', 'inadequa', 'manufactur'], secondary: ['weapon', 'psycholog', 'feel', 'buy', 'creat'] },

  // Question 58: "How does gambling exploit you?" - Answer: variable ratio, loot boxes
  58: { primary: ['gambl', 'loot', 'box', 'variable'], secondary: ['ratio', 'export', 'whale', 'engage'] },

  // Question 59: "Rats - drugs or loneliness?" - Answer: Rat Park, environment
  59: { primary: ['rat', 'park', 'loneli', 'isolat'], secondary: ['enrich', 'environment', 'drug', 'administer'] },

  // Question 60: "What is addiction actually?" - Answer: drive-seeking redirected to proxies
  60: { primary: ['addiction', 'addict', 'proxy', 'substitu'], secondary: ['drive', 'redirect', 'block', 'medic'] },

  // Question 61: "What is ADHD actually?" - Answer: hunter cognition in farmer world
  61: { primary: ['adhd', 'hunter', 'cognit', 'scan'], secondary: ['attention', 'movement', 'novelty', 'classroom', 'disorder'] },

  // Question 63: "What is social anxiety actually?" - Answer: fear of internal audience
  63: { primary: ['anxiety', 'social', 'internal', 'audience'], secondary: ['fear', 'critic', 'scrutin', 'stranger'] },

  // Question 64: "What is burnout?" - Answer: work/purpose mismatch
  64: { primary: ['burnout', 'burn', 'exhaust', 'purpose'], secondary: ['effort', 'visible', 'contribut', 'loop', 'meaningless'] },

  // Question 65: "What is imposter syndrome?" - Answer: accurate recognition, credentials without contribution
  65: { primary: ['imposter', 'impostor', 'credential', 'syndrome'], secondary: ['recogni', 'visible', 'contribut', 'signal'] },

  // Question 66: "Are psychiatric conditions real diseases?" - Answer: no biomarkers
  66: { primary: ['disease', 'biomarker', 'blood', 'test'], secondary: ['behavior', 'descript', 'category', 'real'] },

  // Question 67: "These conditions are heritable?" - Answer: so is height, doesn't make disease
  67: { primary: ['herit', 'height', 'inherit', 'genetic'], secondary: ['cognitive', 'pattern', 'role', 'variation', 'patholog'] },

  // Question 68: "What about brain differences?" - Answer: musicians have different brains too
  68: { primary: ['brain', 'differ', 'musician', 'taxi'], secondary: ['pathology', 'consequence', 'mismatch', 'condition'] },

  // Question 69: "What about neuroplasticity?" - Answer: brain changes based on experience
  69: { primary: ['neuroplastic', 'brain', 'change', 'experience'], secondary: ['effect', 'cause', 'chronic', 'reshape'] },

  // Question 70: "What's wrong with therapy?" - Answer: proxy, paid intimacy
  70: { primary: ['therapy', 'therapist', 'proxy', 'paid'], secondary: ['intima', 'session', 'bridge', 'environment', 'tribe'] },

  // Question 71: "What's a 15-minute medication check?" - Answer: adjust dosage, no context
  71: { primary: ['medication', '15', 'minute', 'check'], secondary: ['dosage', 'context', 'environment', 'time', 'psychiatr'] },

  // Question 72: "Is medication ever necessary?" - Answer: destroyed social structures
  72: { primary: ['medication', 'necessary', 'social', 'who'], secondary: ['structur', 'manag', 'outcome', 'develop', 'support'] },

  // Question 73: "Do people die from this?" - Answer: Zoraya ter Beek, euthanized
  73: { primary: ['die', 'death', 'euthana', 'zoraya'], secondary: ['psychiatr', 'environment', 'intervention'] },

  // Question 74: "What did humans do every night?" - Answer: fire circle, 2-4 hours
  74: { primary: ['fire', 'circle', 'night', 'campfire'], secondary: ['storytell', 'bond', 'process', 'screen'] },

  // Question 75: "Were parents meant to raise kids alone?" - Answer: alloparenting, 20+ adults
  75: { primary: ['alloparent', 'parent', 'alone', 'nuclear'], secondary: ['child', 'adult', 'burnout', 'family', 'twenty'] },

  // Question 76: "Why separate children by age?" - Answer: institutional convenience
  76: { primary: ['age', 'child', 'separate', 'mixed'], secondary: ['institution', 'conveni', 'play', 'mentor'] },

  // Question 77: "What is apprenticeship?" - Answer: learning through observation
  77: { primary: ['apprentice', 'learn', 'observ', 'participat'], secondary: ['skill', 'visible', 'contribut', 'purpose'] },

  // Question 78: "How did hunter-gatherers prevent poverty?" - Answer: demand sharing
  78: { primary: ['demand', 'sharing', 'poverty', 'surplus'], secondary: ['give', 'ask', 'tomorrow', 'group'] },

  // Question 79: "What was work like before money?" - Answer: immediate-return, hunt→eat
  79: { primary: ['immediate', 'return', 'hunt', 'gather'], secondary: ['consume', 'tangible', 'closed', 'loop', 'effort'] },

  // Question 80: "Did hunter-gatherers have leaders?" - Answer: no permanent leaders
  80: { primary: ['leader', 'permanent', 'expert', 'domain'], secondary: ['tracker', 'hunt', 'diplomat', 'person'] },

  // Question 81: "How did tribes prevent takeover?" - Answer: egalitarian enforcement
  81: { primary: ['egalitarian', 'dominan', 'boast', 'hoard'], secondary: ['coalition', 'suppress', 'hierarchy', 'boehm'] },

  // Question 82: "How did tribes handle conflict?" - Answer: conflict resolution cascade
  82: { primary: ['conflict', 'resolu', 'humor', 'cascade'], secondary: ['ridicul', 'shun', 'exile', 'violence', 'joke'] },

  // Question 83: "What about circadian rhythm?" - Answer: wake with light
  83: { primary: ['circadian', 'light', 'wake', 'sleep'], secondary: ['morning', 'afternoon', 'fire', 'dark', 'alarm'] },

  // Question 84: "What is birth spacing?" - Answer: 3-4 years between children
  84: { primary: ['birth', 'spacing', 'breastfeed', 'child'], secondary: ['year', 'parent', 'grandmoth', 'father', 'infant'] },

  // Question 85: "What about physical contact for infants?" - Answer: constant, carried
  85: { primary: ['infant', 'contact', 'carry', 'baby'], secondary: ['constant', 'co-sleep', 'distress', 'hold'] },

  // Question 86: "Is it normal for groups to break apart?" - Answer: fission-fusion
  86: { primary: ['fission', 'fusion', 'break', 'apart'], secondary: ['conflict', 'faction', 'metabol', 'dysfunction', 'healthy'] },

  // Question 87: "How did small tribes avoid inbreeding?" - Answer: metapopulation
  87: { primary: ['metapopul', 'inbred', 'marriage', 'exchang'], secondary: ['seasonal', 'gather', 'tribe', 'network'] },

  // Question 88: "Why do modern tribes need explicit governance?" - Answer: hierarchy-damaged
  88: { primary: ['governance', 'hierarchy', 'explicit', 'damage'], secondary: ['eea', 'mechanism', 'corporat', 'structur'] },

  // Question 89: "What's the difference between tribe and cult?" - Answer: viable exit
  89: { primary: ['cult', 'tribe', 'leader', 'exit'], secondary: ['charismat', 'informat', 'isolat', 'punish', 'viable'] },

  // Question 90: "How prevent permanent leader?" - Answer: rotation
  90: { primary: ['rotation', 'rotat', 'permanent', 'power'], secondary: ['schedule', 'occupy', 'influence', 'position', 'equal'] },

  // Question 91: "Why does everyone need to see everything?" - Answer: transparency
  91: { primary: ['transparen', 'see', 'everything', 'information'], secondary: ['asymmetr', 'hierarchy', 'power', 'back-channel'] },

  // Question 92: "Why shouldn't one person hold multiple roles?" - Answer: domain separation
  92: { primary: ['domain', 'separ', 'role', 'multiple'], secondary: ['power', 'concentr', 'accumul', 'dominan'] },

  // Question 93: "How keep manipulators out?" - Answer: onboarding filter
  93: { primary: ['onboard', 'filter', 'manipul', 'trial'], secondary: ['period', 'surface', 'dominan', 'pattern'] },

  // Question 94: "What if you want to leave?" - Answer: viable exit
  94: { primary: ['leave', 'exit', 'viable', 'quit'], secondary: ['value', 'bar', 'cult', 'distinguish'] },

  // Question 95: "What went wrong with Auroville?" - Answer: scale without Dunbar
  95: { primary: ['auroville', 'scale', 'dunbar', 'fail'], secondary: ['flat', 'governance', 'band', 'lesson'] },

  // Question 96: "What would it mean to fix this?" - Answer: demismatch
  96: { primary: ['demismatch', 'fix', 'align', 'conscious'], secondary: ['biology', 'cave', 'forward', 'condition'] },

  // Question 97: "Why can't technology just fix you?" - Answer: can't augment broken
  97: { primary: ['augment', 'broken', 'amplif', 'dysfunct'], secondary: ['technolog', 'isolat', 'purposeless', 'demismatch'] },

  // Question 98: "Can technology enhance once not broken?" - Answer: that's augment
  98: { primary: ['augment', 'enhanc', 'communicat', 'tribe'], secondary: ['ai', 'capability', 'foundation', 'replac'] },

  // Question 99: "Can technology help or only make worse?" - Answer: pharmakon
  99: { primary: ['pharmakon', 'poison', 'cure', 'both'], secondary: ['implement', 'heal', 'harm', 'serve'] },

  // Question 100: "What if technology required meeting in person?" - Answer: decay function, meet in person
  100: { primary: ['decay', 'meet', 'person', 'face'], secondary: ['physical', 'presence', 'together', 'gather', 'engagement'] },

  // Question 101: "Can AI help find your people?" - Answer: tribe formation AI
  101: { primary: ['ai', 'tribe', 'formation', 'match'], secondary: ['nervous', 'conflict', 'style', 'discover'] },

  // Question 102: "Can you use existing tech for real connection?" - Answer: video calls with tribe
  102: { primary: ['video', 'call', 'tribe', 'parasocial'], secondary: ['infinite', 'scroll', 'stranger', 'proxy'] },

  // Question 103: "Why won't VC fund demismatch tech?" - Answer: decay functions are churn engines
  103: { primary: ['vc', 'venture', 'fund', 'decay'], secondary: ['churn', 'engag', 'growth', 'metric', 'misalign'] },

  // Question 104: "What's the end goal?" - Answer: most human post-human
  104: { primary: ['post-human', 'posthuman', 'goal', 'thriv'], secondary: ['match', 'enhanc', 'technolog', 'baseline', 'need'] },

  // Question 105: "How do you know if you've arrived?" - Answer: role, group, goal
  105: { primary: ['role', 'group', 'goal', 'arriv'], secondary: ['wake', 'credential', 'yes', 'no'] },

  // Question 106: "What do WHO studies show?" - Answer: better outcomes in developing countries
  106: { primary: ['who', 'develop', 'outcome', 'schizophren'], secondary: ['medication', 'social', 'support', 'environment'] },

  // Question 107: "What do hunter-gatherer studies show?" - Answer: chronic conditions rare
  107: { primary: ['hunter', 'gatherer', 'study', 'rare'], secondary: ['chronic', 'absent', 'match', 'patholog'] },

  // Question 108: "What do environmental interventions show?" - Answer: nature exposure reduces symptoms
  108: { primary: ['nature', 'expos', 'interven', 'symptom'], secondary: ['co-liv', 'reduc', 'medication', 'environment'] },

  // Question 109: "What do intentional communities show?" - Answer: long-term stability possible
  109: { primary: ['intentional', 'communit', 'stabil', 'twin'], secondary: ['oaks', 'east', 'wind', 'year', 'convergen'] },

  // Question 110: "What is Twin Oaks?" - Answer: since 1967, labor credits
  110: { primary: ['twin', 'oaks', 'labor', 'credit'], secondary: ['1967', 'rotat', 'transparen', 'satisfact'] },

  // Question 111: "What is East Wind?" - Answer: since 1974, nut butter
  111: { primary: ['east', 'wind', 'nut', 'butter'], secondary: ['1974', 'coordinat', 'transparen', 'anxiety'] },

  // Question 112: "What's step one?" - Answer: reduce mismatch load
  112: { primary: ['step', 'one', 'reduc', 'load'], secondary: ['audit', 'parasocial', 'loop', 'circadian', 'move'] },

  // Question 113: "What's step two?" - Answer: deepen, not broaden
  113: { primary: ['step', 'two', 'deepen', 'broaden'], secondary: ['invest', 'relationship', 'depth', 'breadth'] },

  // Question 114: "What's step three?" - Answer: reduce proxy dependence
  114: { primary: ['step', 'three', 'proxy', 'depend'], secondary: ['time-box', 'alternativ', 'cold', 'turkey'] },

  // Question 115: "What's step four?" - Answer: build
  115: { primary: ['step', 'four', 'build', 'dinner'], secondary: ['finish', 'project', 'contribut', 'closed', 'loop'] },

  // Question 116: "What's the smallest change right now?" - Answer: identify your 5
  116: { primary: ['small', 'change', 'five', 'meal'], secondary: ['loop', 'light', 'movement', 'demismatch'] },

  // Question 117: "What if you can't build tribe right now?" - Answer: reduce mismatch load first
  117: { primary: ['can\'t', 'build', 'tribe', 'reduc'], secondary: ['circadian', 'nature', 'stranger', 'position'] },

  // Question 118: "How long does this take?" - Answer: years, not weeks
  118: { primary: ['year', 'week', 'long', 'slow'], secondary: ['double', 'shift', 'quick', 'fix', 'proxy'] },

  // Question 119: "Why is building a new life exhausting?" - Answer: double shift
  119: { primary: ['double', 'shift', 'exhaust', 'unsustain'], secondary: ['8 hour', 'capitalist', 'tribal', 'mainten'] },

  // Question 120: "Why do most attempts fail?" - Answer: great filter
  120: { primary: ['great', 'filter', 'fail', 'attempt'], secondary: ['burnout', 'resource', 'hierarchy', 'character'] },

  // Question 121: "Who can attempt this first?" - Answer: people with resources
  121: { primary: ['resource', 'flexib', 'first', 'privilege'], secondary: ['saving', 'relationship', 'fair', 'adopt'] },

  // Question 122: "What if your tribe attempt fails?" - Answer: fission-fusion is normal
  122: { primary: ['fission', 'fusion', 'fail', 'temporar'], secondary: ['skill', 'persist', 'teach', 'second'] },

  // Question 123: "What's the most common mistake?" - Answer: reading about mismatch while sitting alone
  123: { primary: ['read', 'alone', 'scroll', 'mistake'], secondary: ['understand', 'progress', 'close', 'tab', 'find'] },

  // Question 124: "Will life be meaningful without struggle?" - Answer: constructive scarcity
  124: { primary: ['meaning', 'struggle', 'scarcit', 'challeng'], secondary: ['constructiv', 'effort', 'cooperat', 'suffer'] },

  // Question 125: "Isn't some suffering necessary?" - Answer: toxic vs constructive scarcity
  125: { primary: ['suffer', 'necessary', 'toxic', 'constructiv'], secondary: ['scarcit', 'impos', 'trauma', 'growth'] },

  // Question 126: "Why isn't UBI the answer?" - Answer: solves resource, not meaning
  126: { primary: ['ubi', 'money', 'resource', 'meaning'], secondary: ['role', 'tribe', 'purpose', 'comfort', 'atomiz'] },

  // Question 127: "What does automation change?" - Answer: eliminates human roles
  127: { primary: ['automat', 'role', 'eliminat', 'product'], secondary: ['proxy', 'purpose', 'disappear', 'job'] },

  // Question 128: "What drives all human behavior?" - Answer: survive and reproduce
  128: { primary: ['survive', 'reproduc', 'drive', 'behavior'], secondary: ['direct', 'indirect', 'fitness', 'hunger', 'status'] },

  // Question 129: "Why urges you can't control?" - Answer: direct fitness
  129: { primary: ['urge', 'control', 'direct', 'fitness'], secondary: ['survival', 'automatic', 'malfunction', 'evolv'] },

  // Question 130: "Why need approval so badly?" - Answer: indirect fitness, social survival
  130: { primary: ['approval', 'indirect', 'fitness', 'validation'], secondary: ['survival', 'social', 'ate', 'mate', 'protect', 'machinery', 'need'] },

  // Question 131: "Why feel obligated to return favors?" - Answer: reciprocal altruism
  131: { primary: ['reciproc', 'favor', 'obligat', 'altruism'], secondary: ['cooperat', 'help', 'tomorrow', 'evolv'] },

  // Question 132: "Difference between wants and needs?" - Answer: wants shaped by mismatch
  132: { primary: ['want', 'need', 'differ', 'fame'], secondary: ['money', 'tribe', 'connect', 'dissatisf'] },

  // Question 133: "Can you train for more relationships?" - Answer: no, biological limit
  133: { primary: ['train', 'limit', 'biolog', 'dunbar'], secondary: ['neocortex', 'time', 'follower', 'friend', 'architectur'] },

  // Question 134: "What's the right size for community?" - Answer: the band, ~50 people
  134: { primary: ['band', 'fifty', '50', 'size'], secondary: ['family', 'meal', 'fire', 'circle', 'hardware'] },

  // Question 135: "Why feel like stranger in your city?" - Answer: beyond 150
  135: { primary: ['stranger', 'city', '150', 'million'], secondary: ['dunbar', 'limit', 'action'] },

  // Question 136: "Can technology extend Dunbar's number?" - Answer: weak ties yes, strong ties no
  136: { primary: ['technolog', 'dunbar', 'extend', 'weak'], secondary: ['strong', 'tie', 'intimate', 'connect', 'loose'] },

  // Question 137: "Why does your brain lie about what you need?" - Answer: outdated software
  137: { primary: ['brain', 'lie', 'outdated', 'software'], secondary: ['calibrat', 'survival', 'truth', 'dashboard'] },

  // Question 138: "Do you perceive reality accurately?" - Answer: no, you perceive a dashboard
  138: { primary: ['perceiv', 'reality', 'dashboard', 'accurac'], secondary: ['evolut', 'optim', 'survival', 'truth', 'fitness'] },

  // Question 139: "Why are mass shootings modern?" - Answer: killing strangers inconceivable in EEA
  139: { primary: ['shooting', 'kill', 'stranger', 'mass'], secondary: ['eea', 'overload', 'category', 'known'] },

  // Question 141: "Is all entertainment bad?" - Answer: art isn't proxy, continues fire circle
  141: { primary: ['art', 'entertainment', 'fire', 'circle'], secondary: ['proxy', 'deplet', 'nourish', 'sense', 'truth'] },

  // Question 142: "Is this anti-psychiatry?" - Answer: anti-misdiagnosis
  142: { primary: ['anti', 'psychiatr', 'misdiagnos', 'response'], secondary: ['real', 'pattern', 'disease', 'mismatch'] },

  // Question 143: "Is this anti-technology?" - Answer: no, pharmakon
  143: { primary: ['anti', 'technolog', 'pharmakon', 'design'], secondary: ['poison', 'cure', 'mismatch', 'demismatch'] },

  // Question 144: "What is this website?" - Answer: framework, spec sheet
  144: { primary: ['website', 'framework', 'spec', 'sheet'], secondary: ['explain', 'suffer', 'thriv', 'therapy', 'self-help'] },

  // Question 145: "What are you trying to do?" - Answer: change how people understand suffering
  145: { primary: ['understand', 'suffer', 'environment', 'change'], secondary: ['see', 'unsee'] },

  // Question 146: "Why should you care?" - Answer: you're probably suffering and blaming yourself
  146: { primary: ['care', 'suffer', 'blame', 'yourself'], secondary: ['solution', 'work', 'understand', 'problem'] },

  // Question 147: "Who is this for?" - Answer: anyone who feels something is deeply wrong
  147: { primary: ['who', 'wrong', 'therapist', 'technolog'], secondary: ['parent', 'kid', 'struggle', 'name'] },

  // Question 148: "What should you do after reading?" - Answer: stop blaming, build
  148: { primary: ['stop', 'blame', 'build', 'tribe'], secondary: ['closure', 'contribut', 'understand', 'change'] },

  // Question 149: "Why is this free?" - Answer: no one owns truth
  149: { primary: ['free', 'truth', 'fork', 'improv'], secondary: ['profit', 'point', 'suffer'] },

  // Question 150: "What's with all the images?" - Answer: 2,500+ visuals, framework is dense
  150: { primary: ['visual', 'library', 'graphic', 'gallery'], secondary: ['image', 'picture', 'framework', 'dense', 'visceral', 'free', 'art'] },

  // Question 151: "How do you know this isn't self-help?" - Answer: self-help sells individual solutions
  151: { primary: ['self-help', 'individual', 'systemic', 'personal'], secondary: ['sell', 'solution', 'problem', 'collect'] },

  // Question 160: "The one thing to remember?" - Answer: you're not broken
  160: { primary: ['broken', 'environment', 'mismatch', 'fish'], secondary: ['fix', 'build', 'condition', 'thriv', 'water'] },

  // Question 161: "What now?" - Answer: close this tab, start building, find one person
  161: { primary: ['start', 'begin', 'action', 'now'], secondary: ['close', 'build', 'person', 'meal', 'loop', 'do'] }
};

// Score function
function scoreImage(img, keywords) {
  const titleLower = (img.file_name || '').toLowerCase();
  const bodyLower = (img.search_text || img.title || '').toLowerCase();
  let score = 0;

  // Primary keywords - high weight
  for (const kw of keywords.primary || []) {
    if (titleLower.includes(kw)) score += 200;
    if (bodyLower.includes(kw)) score += 30;
  }

  // Secondary keywords - lower weight
  for (const kw of keywords.secondary || []) {
    if (titleLower.includes(kw)) score += 50;
    if (bodyLower.includes(kw)) score += 10;
  }

  return score;
}

// Extract keywords from answer text as fallback
function extractFromAnswer(answer) {
  const clean = answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').toLowerCase();
  const stopwords = ['which', 'about', 'their', 'there', 'would', 'could', 'should', 'being', 'these', 'those', 'what', 'your', 'that', 'this', 'with', 'from', 'have', 'they', 'were', 'because', 'actually', 'problem', 'people', 'something'];
  const words = clean.split(/\s+/).filter(w => w.length > 4 && !stopwords.includes(w));
  const unique = [...new Set(words)].slice(0, 8);
  return { primary: unique.slice(0, 3), secondary: unique.slice(3) };
}

async function fetchAllImages() {
  const allData = [];
  let offset = 0;
  while (true) {
    const { data } = await supabase
      .from('image_embeddings')
      .select('id, file_name, folder_name, image_url, series, search_text, title')
      .range(offset, offset + 999)
      .order('id');
    if (!data || data.length === 0) break;
    allData.push(...data);
    offset += 1000;
    if (data.length < 1000) break;
  }
  return allData;
}

async function generateCompleteMatches() {
  console.log('Loading FAQ data...');
  const faqData = JSON.parse(readFileSync('/private/tmp/faq_data.json', 'utf8'));
  const userImageMap = JSON.parse(readFileSync('/private/tmp/generated_imagemap.json', 'utf8'));

  // Get all question IDs from FAQ data
  const allQuestionIds = faqData.map(f => f.id).sort((a, b) => a - b);
  console.log(`Found ${allQuestionIds.length} questions: ${allQuestionIds[0]} to ${allQuestionIds[allQuestionIds.length - 1]}`);

  console.log('Fetching all images from Supabase...');
  const allImages = await fetchAllImages();
  const usableImages = allImages.filter(img => !isUnused(img));
  console.log(`Total: ${allImages.length}, Usable: ${usableImages.length}`);

  // Track used images from tiles 1-20
  const usedInFirst20 = new Set();
  for (let i = 1; i <= 20; i++) {
    (userImageMap[String(i)] || []).forEach(u => usedInFirst20.add(u));
  }

  const globalUsedTop4 = new Set(usedInFirst20);
  const finalImageMap = {};

  // Keep tiles 1-20 exactly as user specified
  for (let i = 1; i <= 20; i++) {
    finalImageMap[String(i)] = userImageMap[String(i)] || [];
  }

  console.log('\nGenerating matches for questions 21+...');

  for (const qId of allQuestionIds) {
    if (qId <= 20) continue; // Skip user-defined tiles

    const faq = faqData.find(f => f.id === qId);
    if (!faq) continue;

    const question = faq.q || faq.question;
    const answer = faq.a || faq.answer;

    // Get keywords - predefined or extracted from answer
    const keywords = questionKeywords[qId] || extractFromAnswer(answer);

    // Score all usable images
    const scored = usableImages.map(img => ({
      img,
      score: scoreImage(img, keywords)
    })).filter(s => s.score > 0);

    scored.sort((a, b) => b.score - a.score);

    // Select images - be VERY lenient about uniqueness
    // Priority: best match for the question, even if reused
    const selected = [];
    const usedHere = new Set();         // Track by URL
    const usedFileNames = new Set();    // Track by file name to avoid duplicate images in different folders

    // Only enforce uniqueness for first 2 images, and only if alternatives are similarly good
    const strictUniqueness = 2;

    for (const { img, score } of scored) {
      const url = img.image_url || `${supabaseUrl}/storage/v1/object/public/mismatch-images/${img.folder_name}/${img.file_name}`;
      const fileName = img.file_name;

      // Skip if URL already used OR if same file name already used (prevents duplicates from different folders)
      if (usedHere.has(url) || usedFileNames.has(fileName)) continue;

      // Check uniqueness only for first 2 positions
      if (selected.length < strictUniqueness) {
        if (globalUsedTop4.has(url)) {
          // Find the best scoring UNIQUE alternative
          const bestUniqueAlt = scored.find(s => {
            const altUrl = s.img.image_url || `${supabaseUrl}/storage/v1/object/public/mismatch-images/${s.img.folder_name}/${s.img.file_name}`;
            return !globalUsedTop4.has(altUrl) && !usedHere.has(altUrl);
          });

          // Only skip reused image if alternative scores at least 70% as well
          // This means: if BULLSHIT_JOB scores 400 and alternative scores 140 (35%), use BULLSHIT_JOB
          if (bestUniqueAlt && bestUniqueAlt.score >= score * 0.7) {
            continue; // Skip this reused one, use the unique alternative
          }
          // Otherwise, use the reused one because it's significantly better
        } else {
          globalUsedTop4.add(url);
        }
      }

      selected.push(url);
      usedHere.add(url);
      usedFileNames.add(fileName);
      if (selected.length >= 20) break;
    }

    // If we didn't get enough, add remaining high-scoring images (allow reuse)
    if (selected.length < 10) {
      for (const { img } of scored) {
        if (selected.length >= 20) break;
        const url = img.image_url || `${supabaseUrl}/storage/v1/object/public/mismatch-images/${img.folder_name}/${img.file_name}`;
        if (!usedHere.has(url)) {
          selected.push(url);
          usedHere.add(url);
        }
      }
    }

    finalImageMap[String(qId)] = selected;

    // Progress output every 10 questions
    if (qId % 10 === 0 || qId === 21) {
      const topFiles = selected.slice(0, 2).map(u => u.split('/').pop()).join(', ');
      console.log(`Q${qId}: ${question.substring(0, 40)}... → ${topFiles || 'NONE'}`);
    }
  }

  // Save results
  writeFileSync('/private/tmp/final_imagemap.json', JSON.stringify(finalImageMap, null, 2));
  console.log('\nSaved to /private/tmp/final_imagemap.json');

  // Show comprehensive quality check
  console.log('\n=== QUALITY CHECK ===');
  const checkQuestions = [21, 30, 40, 42, 50, 60, 70, 74, 80, 100, 120, 130, 140, 150, 160, 161];
  for (const qId of checkQuestions) {
    const faq = faqData.find(f => f.id === qId);
    if (faq) {
      const top4 = finalImageMap[String(qId)]?.slice(0, 4).map(u => u.split('/').pop()).join(', ');
      console.log(`Q${qId}: ${faq.q?.substring(0, 50)}...`);
      console.log(`   → ${top4 || 'NONE'}`);
    }
  }

  // Statistics
  let totalWithMatches = 0;
  let totalWith4Plus = 0;
  for (const qId of allQuestionIds) {
    const matches = finalImageMap[String(qId)]?.length || 0;
    if (matches > 0) totalWithMatches++;
    if (matches >= 4) totalWith4Plus++;
  }
  console.log(`\n=== STATISTICS ===`);
  console.log(`Questions with matches: ${totalWithMatches}/${allQuestionIds.length}`);
  console.log(`Questions with 4+ matches: ${totalWith4Plus}/${allQuestionIds.length}`);

  // Now update the HTML with all matches
  console.log('\nUpdating HTML file...');
  const questionDataForHtml = faqData.map(faq => {
    const urls = finalImageMap[String(faq.id)] || [];
    return {
      id: faq.id,
      question: faq.q || faq.question,
      answer: faq.a || faq.answer,
      preselected: urls.map((url, idx) => ({
        id: 0,
        file_name: url.split('/').pop(),
        folder_name: decodeURIComponent(url.split('/').slice(-2, -1)[0]),
        title: url.split('/').pop().replace(/^\d+_/, '').replace(/\.png|\.jpeg|\.jpg/i, '').replace(/_/g, ' '),
        image_url: url,
        score: 100 - idx
      }))
    };
  });

  let html = readFileSync('/private/tmp/image_selector_v6.html', 'utf8');
  const regex = /const questionData = \[[\s\S]*?\];/;
  html = html.replace(regex, 'const questionData = ' + JSON.stringify(questionDataForHtml) + ';');
  writeFileSync('/private/tmp/image_selector_v7.html', html);
  console.log('Updated /private/tmp/image_selector_v7.html');

  console.log('\n=== DONE ===');
}

generateCompleteMatches().catch(console.error);
