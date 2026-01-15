"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import SeriesStrip from "@/components/SeriesStrip";

interface ImageData {
  id: number;
  file_name: string;
  folder_name: string;
  title: string;
  body_text: string;
  image_type: string;
  categories: string[];
  series: string[];
  framework_concepts: string[];
  tags: string[];
  image_url: string;
  is_favorite: boolean;
  show_first_default: boolean;
}

interface TaxonomyIndex {
  by_category: Record<string, number[]>;
  by_series: Record<string, number[]>;
  by_framework_concept: Record<string, number[]>;
}

type ViewMode = "grid" | "series";

type SortOption = "relevant" | "alphabetical" | "category";

// Admin secret for delete functionality
const ADMIN_SECRET = 'mR7x9Kp2vL4nQ8';

// Series name mappings: original name → display name
// These make series names clearer and more descriptive
const SERIES_DISPLAY_NAMES: Record<string, string> = {
  // Core Framework Series
  "EEA": "What We Evolved For",
  "The Mismatch Actually": "What's Actually Happening",
  "The Mismatch Actually 100 VOL2": "What's Actually Happening Vol 2",
  "The Mismatch Actually 100 MATCHED VOL5": "When Needs Are Met",
  "The Mismatch Actually 100 PSYCHIATRY VOL10": "The Psychiatry Problem",
  "The Mismatch Actually 100 EVERYONE WRONG VOL11": "What Everyone Gets Wrong",

  // Solutions Series
  "The Mismatch Answer": "The Demismatch Solution",
  "The Mismatch Answer 100 VOL3": "Solutions Vol 2",
  "The Mismatch Answer 100 POSITIVE VOL4": "Moments That Feel Right",
  "The Mismatch Answer 100 REAL THING VOL7": "The Real Thing vs The Proxy",
  "The Mismatch Answer 100 DEMISMATCH TECH VOL6": "Technology: Help or Harm?",
  "The Mismatch Answer 100 ESTEEM DYNAMICS VOL8": "Status, Esteem & Hierarchy",
  "The Mismatch Answer 50 STATUS GAME VOL9": "The Status Game",

  // Signals & Emotions
  // UNUSED: "The Sequencing" (folder: the_sequencing) - removed from DB
  "Fear & Anxiety": "Fear & Anxiety Signals",
  "Emotions": "The Emotional Dashboard",
  "Dashboard Overload": "When the Dashboard Breaks",
  // UNUSED: "Dashboard Calibrated" (folder: dashboard_calibrated_series) - removed from DB

  // Life Domains
  "Dating & Mating": "Dating, Mating & Pair Bonding",
  "Money & Status": "Money, Status & Resources",
  "Food & Body": "Food, Body & Physical Needs",
  "Social Dynamics": "Social Dynamics & Hierarchy",
  "Survive & Reproduce": "Survival & Reproduction Drives",
  "Meaning & Purpose": "Meaning & Purpose",
  // UNUSED: "Meaning & Purpose 100" (folder: meaning_purpose_sacred_100_prompts_v2) - removed from DB

  // Perspective Series
  // UNUSED: "The Trap Recognized" (folder: the_trap_recognized) - removed from DB
  // UNUSED: "The Bridge" (folder: the_bridge_series) - removed from DB
  // UNUSED: "The Same Scene Two Eyes" (folder: the_same_scene_two_eyes) - removed from DB
  "The Real Thing": "The Real Thing",
  "The Real Thing PART2": "The Real Thing Part 2",
  "Hoffman Interface Theory": "Perception as Interface",
  "The Scale Matters": "Scale Matters: 150 vs Millions",

  // Destination Series
  // UNUSED: "Utopia" (folder: utopia_100_prompts) - removed from DB
  "Dystopia": "The Warning: Misaligned Living",

  // Other
  // UNUSED: "Misc" (folder: the_lies_we_tell) - removed from DB
  "Technology": "Technology",
  // UNUSED: "Work Rest & Productivity" (shared images only) - removed from DB

  // New Series
  "The Diagnosis": "The Diagnosis",
};

// Series that are hidden from the library (removed from DB or deprecated)
const UNUSED_SERIES: string[] = [
  "The Sequencing",
  "Dashboard Calibrated",
  "Meaning & Purpose 100",
  "The Trap Recognized",
  "The Bridge",
  "The Same Scene Two Eyes",
  "Utopia",
  "Misc",
  "Work Rest & Productivity",
  // Newly removed:
  "The Mismatch Answer 100 DEMISMATCH TECH VOL6",  // Technology: Help or Harm?
  "The Mismatch Answer 100 REAL THING VOL7",       // The Real Thing vs The Proxy
  "The Mismatch Answer 100 VOL3",                  // Solutions Vol 2
  "The Mismatch Answer",                           // The Demismatch Solution
  "Dystopia",                                      // The Warning: Misaligned Living
  "Money & Status",                                // Money, Status & Resources
  "The Mismatch Actually 100 EVERYONE WRONG VOL11", // What Everyone Gets Wrong
];

// Series ordering: defines the logical flow through the framework
// Series not in this list will appear at the end, sorted by count
const SERIES_ORDER: string[] = [
  // 1. Start with the baseline - what humans evolved for
  "EEA",

  // 1.5. The Diagnosis - recognizing the problem
  "The Diagnosis",

  // 2. The mismatch - what's going wrong
  "The Mismatch Actually",
  "The Mismatch Actually 100 VOL2",
  "Dashboard Overload",
  "The Mismatch Actually 100 PSYCHIATRY VOL10",
  "The Mismatch Actually 100 EVERYONE WRONG VOL11",

  // 3. Understanding the signals
  // UNUSED: "The Sequencing" - removed from library
  "Fear & Anxiety",
  "Emotions",
  "Hoffman Interface Theory",

  // 4. Life domains affected
  "Dating & Mating",
  "Social Dynamics",
  "Money & Status",
  "Food & Body",
  "Survive & Reproduce",
  "Meaning & Purpose",
  // UNUSED: "Meaning & Purpose 100"
  "The Scale Matters",

  // 5. Recognizing the problem
  // UNUSED: "The Trap Recognized"
  // UNUSED: "The Same Scene Two Eyes"
  "Dystopia",

  // 6. The solution - demismatch
  "The Mismatch Answer",
  "The Mismatch Answer 100 VOL3",
  "The Mismatch Answer 100 POSITIVE VOL4",
  "The Mismatch Answer 100 REAL THING VOL7",
  "The Mismatch Answer 100 DEMISMATCH TECH VOL6",
  "The Mismatch Answer 100 ESTEEM DYNAMICS VOL8",
  "The Mismatch Answer 50 STATUS GAME VOL9",

  // 7. When it works - matched state
  "The Mismatch Actually 100 MATCHED VOL5",
  // UNUSED: "Dashboard Calibrated"
  "The Real Thing",
  "The Real Thing PART2",
  // UNUSED: "The Bridge"

  // 8. The destination
  // UNUSED: "Utopia"

  // 9. Misc at the end
  "Technology",
  // UNUSED: "Work Rest & Productivity"
  // UNUSED: "Misc"
];

// Helper to get display name for a series
function getSeriesDisplayName(originalName: string): string {
  return SERIES_DISPLAY_NAMES[originalName] || originalName;
}

// Helper to get sort order for a series (lower = earlier)
function getSeriesOrder(seriesName: string): number {
  const index = SERIES_ORDER.indexOf(seriesName);
  return index >= 0 ? index : SERIES_ORDER.length + 1000; // Unlisted series go to end
}

// High-value framework concepts with bonus weights
const CONCEPT_WEIGHTS: Record<string, number> = {
  proxy_consumption: 3,
  dunbar_violation: 3,
  open_loop_anxiety: 2,
  delayed_return: 2,
  stranger_overload: 2,
  internal_audience: 1,
  environmental_signal: 1,
  status_competition: 1,
};

// Calculate relevance score for an image (no tags selected)
function calculateRelevanceScore(img: ImageData): number {
  let score = 0;

  // Framework concept count (base score)
  score += img.framework_concepts.length * 2;

  // Core concept bonuses
  for (const concept of img.framework_concepts) {
    score += CONCEPT_WEIGHTS[concept] || 0;
  }

  // Category breadth bonus
  score += Math.min(img.categories.length, 3) * 0.5;

  return score;
}

// Calculate tag-specific relevance when quick tags are selected
function calculateTagRelevance(
  img: ImageData,
  selectedTags: Set<string>,
  tagMappings: Record<string, { tags: string[]; categories: string[]; concepts: string[] }>,
  tagFrequencies: Record<string, number>,
  taxonomy: TaxonomyIndex | null
): number {
  let score = 0;
  const imgTagsLower = img.tags.map(t => t.toLowerCase());

  for (const tagName of selectedTags) {
    const mapping = tagMappings[tagName];
    if (!mapping) continue;

    // Find matched tags from the mapping
    const matchedTags: string[] = [];
    for (const mappingTag of mapping.tags) {
      const tagLower = mappingTag.toLowerCase();
      if (imgTagsLower.some(t => t.includes(tagLower))) {
        matchedTags.push(mappingTag);
      }
    }

    // 1. Tag centrality - is this tag core to the image?
    const tagInTitle = mapping.tags.some(t =>
      img.title?.toLowerCase().includes(t.toLowerCase())
    );
    if (tagInTitle) score += 5;

    // 2. Focus bonus - fewer total tags = more focused image
    const totalTags = img.tags?.length || 0;
    if (totalTags <= 5) score += 3;
    else if (totalTags <= 10) score += 1;
    else if (totalTags >= 20) score -= 2; // penalize kitchen sink

    // 3. Tag specificity - rarer matches are more specific
    for (const matchedTag of matchedTags) {
      const frequency = tagFrequencies[matchedTag.toLowerCase()] || 1;
      score += 3 / Math.sqrt(frequency); // rarer = higher score
    }

    // 4. Direct tag match count
    score += matchedTags.length * 2;

    // 5. Category match bonus
    for (const cat of mapping.categories) {
      if (img.categories.includes(cat) || (taxonomy && taxonomy.by_category[cat]?.includes(img.id))) {
        score += 1;
      }
    }

    // 6. Framework concept match bonus
    for (const concept of mapping.concepts) {
      if (img.framework_concepts.includes(concept) || (taxonomy && taxonomy.by_framework_concept[concept]?.includes(img.id))) {
        score += 2;
      }
    }
  }

  // 7. Multi-tag intersection bonus
  if (selectedTags.size > 1) {
    const tagsMatched = Array.from(selectedTags).filter(tagName => {
      const mapping = tagMappings[tagName];
      if (!mapping) return false;
      return mapping.tags.some(t =>
        imgTagsLower.some(imgTag => imgTag.includes(t.toLowerCase()))
      ) || mapping.categories.some(cat => img.categories.includes(cat) || (taxonomy && taxonomy.by_category[cat]?.includes(img.id)))
        || mapping.concepts.some(c => img.framework_concepts.includes(c) || (taxonomy && taxonomy.by_framework_concept[c]?.includes(img.id)));
    }).length;

    if (tagsMatched === selectedTags.size) {
      score += 10; // bonus for matching ALL selected tags
    }
  }

  return score;
}

function formatLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// Simple tag mappings for quick filters
interface TagMapping {
  tags: string[];
  categories: string[];
  concepts: string[];
}

// Primary quick tags - always visible (12-15 max)
const PRIMARY_TAGS = [
  'DUNBAR',
  'TRIBE', 
  'LONELINESS',
  'ANXIETY',
  'DEPRESSION',
  'SCREENS',
  'PROXY',
  'EXPLOITATION',
  'OPEN LOOPS',
  'STATUS',
  'BELONGING',
  'MISMATCH',
  'SIGNALS',
  'PARENTING',
  'SOLUTIONS'
];

// Secondary tags - shown on expand
const SECONDARY_TAGS = [
  'ADDICTION', 'BURNOUT', 'COMPARISON', 'DATING', 'DEATH',
  'EMPTINESS', 'FAMILY', 'FITNESS', 'FOOD', 'FRIENDSHIP',
  'GRIEF', 'HUSTLE', 'INTERNAL AUDIENCE', 'ISOLATION', 
  'MARRIAGE', 'MEANING', 'MONEY', 'NATURE', 'NEWS',
  'NOTIFICATIONS', 'OVERWHELM', 'PURPOSE', 'REJECTION',
  'RITUAL', 'SCROLLING', 'SEX', 'SHAME', 'SLEEP',
  'SOCIAL ANXIETY', 'STRANGERS', 'SURVIVAL', 'TRADITION',
  'TRUST', 'VALIDATION', 'WORK'
];

// All tags combined for backward compatibility
const QUICK_TAGS = [...PRIMARY_TAGS, ...SECONDARY_TAGS];

const TAG_MAPPINGS: Record<string, TagMapping> = {
  "ANXIETY": {
    tags: ["anxiety", "stress", "worry", "fear", "panic", "nervous", "dread", "unease", "social anxiety", "fear response"],
    categories: ["mental_emotional", "survival_safety"],
    concepts: ["open_loop_anxiety", "environmental_signal"]
  },
  "SOCIAL ANXIETY": {
    tags: ["social anxiety", "social fear", "awkward", "shy", "nervous around people"],
    categories: ["social_connection", "mental_emotional"],
    concepts: ["stranger_overload", "dunbar_violation"]
  },
  "DEPRESSION": {
    tags: ["depression", "depressed", "hopeless", "despair", "sad", "numb", "empty"],
    categories: ["mental_emotional"],
    concepts: ["environmental_signal", "delayed_return"]
  },
  "OPEN LOOPS": {
    tags: ["open loop", "open loops", "unfinished", "unresolved", "incomplete", "nagging", "hanging"],
    categories: ["attention_cognition", "mental_emotional"],
    concepts: ["open_loop_anxiety"]
  },
  "PROXY": {
    tags: ["proxy", "proxy consumption", "proxy connection", "substitute", "fake", "simulated", "virtual"],
    categories: ["proxy_superstimuli", "technology_digital"],
    concepts: ["proxy_consumption"]
  },
  "DUNBAR": {
    tags: ["dunbar's number", "dunbar", "150", "too many people", "social limit", "cognitive limit"],
    categories: ["tribal_structure", "social_connection"],
    concepts: ["dunbar_violation"]
  },
  "SURVIVAL": {
    tags: ["survival", "threat", "threat detection", "danger", "fight or flight", "fear response", "hypervigilance"],
    categories: ["survival_safety"],
    concepts: ["environmental_signal", "open_loop_anxiety"]
  },
  "BELONGING": {
    tags: ["belonging", "belong", "acceptance", "inclusion", "fitting in", "part of", "included"],
    categories: ["social_connection", "tribal_structure"],
    concepts: ["tribal_bonding"]
  },
  "TRADITION": {
    tags: ["tradition", "ritual", "ceremony", "customs", "heritage", "ancestral", "elders"],
    categories: ["tradition_ritual"],
    concepts: ["tribal_bonding", "de_mismatch"]
  },
  "TRUST": {
    tags: ["trust", "distrust", "betrayal", "reliability", "faith", "dependable", "broken trust"],
    categories: ["social_connection", "relationships_mating"],
    concepts: ["tribal_bonding", "stranger_overload"]
  },
  "NOTIFICATIONS": {
    tags: ["notification", "notifications", "alert", "alerts", "ping", "buzz", "ding", "push notification"],
    categories: ["technology_digital", "attention_cognition"],
    concepts: ["open_loop_anxiety", "proxy_consumption"]
  },
  "LONELINESS": {
    tags: ["loneliness", "lonely", "alone", "isolation", "social isolation", "disconnection", "alienation", "solitude"],
    categories: ["social_connection", "mental_emotional"],
    concepts: ["dunbar_violation", "stranger_overload"]
  },
  "BURNOUT": {
    tags: ["burnout", "exhaustion", "exhausted", "overwhelm", "tired", "fatigue", "depleted", "drained"],
    categories: ["work_purpose", "mental_emotional", "health_wellbeing"],
    concepts: ["delayed_return"]
  },
  "EMPTINESS": {
    tags: ["emptiness", "meaninglessness", "void", "hollow", "numb", "boredom", "existential", "purposeless", "unfulfilled"],
    categories: ["mental_emotional", "identity_self"],
    concepts: ["delayed_return", "proxy_consumption"]
  },
  "SHAME": {
    tags: ["shame", "guilt", "embarrassment", "inadequacy", "failure", "not good enough", "unworthy", "humiliation"],
    categories: ["mental_emotional", "identity_self"],
    concepts: ["internal_audience", "status_competition"]
  },
  "GRIEF": {
    tags: ["grief", "loss", "mourning", "bereavement", "death", "dying", "sadness", "heartbreak"],
    categories: ["death_mortality", "mental_emotional"],
    concepts: []
  },
  "OVERWHELM": {
    tags: ["overwhelm", "overwhelmed", "too much", "overload", "information overload", "sensory overload", "chaos"],
    categories: ["mental_emotional", "attention_cognition"],
    concepts: ["open_loop_anxiety", "stranger_overload"]
  },
  "REJECTION": {
    tags: ["rejection", "abandoned", "abandonment", "excluded", "exclusion", "unwanted", "dismissed", "ghosted"],
    categories: ["relationships_mating", "social_connection", "mental_emotional"],
    concepts: ["mate_selection", "status_competition"]
  },
  "WORK": {
    tags: ["work", "career", "job", "office", "labor", "workplace", "employment", "profession", "boss", "employee", "corporate", "9 to 5"],
    categories: ["work_purpose"],
    concepts: ["delayed_return"]
  },
  "LOVE": {
    tags: ["love", "romance", "romantic", "relationship", "relationships", "intimacy", "affection", "partner", "couple", "heart"],
    categories: ["relationships_mating"],
    concepts: ["mate_selection", "tribal_bonding"]
  },
  "FAMILY": {
    tags: ["family", "mother", "father", "parents", "children", "kids", "siblings", "brother", "sister", "relatives", "home", "household"],
    categories: ["family_parenting"],
    concepts: ["kin_selection"]
  },
  "MONEY": {
    tags: ["money", "wealth", "debt", "financial", "finance", "capitalism", "rich", "poor", "income", "salary", "bills", "economy", "bank"],
    categories: ["economics_resources"],
    concepts: ["delayed_return", "status_competition"]
  },
  "SEX": {
    tags: ["sex", "sexual", "sexuality", "attraction", "desire", "mating", "reproduction", "lust", "seduction"],
    categories: ["relationships_mating"],
    concepts: ["mate_selection", "fitness_evaluation"]
  },
  "SCREENS": {
    tags: ["technology", "social media", "smartphone", "screen time", "digital", "phone", "tablet", "computer", "device", "online", "internet", "apps"],
    categories: ["technology_digital"],
    concepts: ["proxy_consumption"]
  },
  "SCROLLING": {
    tags: ["scrolling", "scroll", "feed", "infinite scroll", "timeline", "social media", "doom scrolling", "endless"],
    categories: ["technology_digital", "attention_cognition"],
    concepts: ["proxy_consumption", "open_loop_anxiety"]
  },
  "COMPARISON": {
    tags: ["comparison", "social comparison", "compare", "envy", "jealousy", "keeping up", "better than", "worse than"],
    categories: ["status_reputation", "mental_emotional"],
    concepts: ["internal_audience", "status_competition", "fitness_evaluation"]
  },
  "NEWS": {
    tags: ["news", "media", "headlines", "journalism", "politics", "current events", "breaking news", "24/7"],
    categories: ["technology_digital", "attention_cognition"],
    concepts: ["open_loop_anxiety", "stranger_overload"]
  },
  "HUSTLE": {
    tags: ["hustle", "grind", "productivity", "work culture", "side hustle", "entrepreneur", "success", "ambition", "driven"],
    categories: ["work_purpose"],
    concepts: ["delayed_return", "status_competition"]
  },
  "ADDICTION": {
    tags: ["addiction", "addicted", "dopamine", "habit", "compulsion", "craving", "withdrawal", "dependent"],
    categories: ["proxy_superstimuli", "mental_emotional"],
    concepts: ["proxy_consumption"]
  },
  "DATING": {
    tags: ["dating", "dating apps", "tinder", "bumble", "hinge", "swipe", "match", "single", "courtship", "romance"],
    categories: ["relationships_mating"],
    concepts: ["mate_selection", "proxy_consumption", "stranger_overload"]
  },
  "MARRIAGE": {
    tags: ["marriage", "married", "wedding", "spouse", "husband", "wife", "divorce", "vows", "commitment"],
    categories: ["relationships_mating", "family_parenting"],
    concepts: ["mate_selection", "tribal_bonding"]
  },
  "PARENTING": {
    tags: ["parenting", "parent", "motherhood", "fatherhood", "childcare", "raising kids", "baby", "toddler", "teenager"],
    categories: ["family_parenting"],
    concepts: ["kin_selection"]
  },
  "FRIENDSHIP": {
    tags: ["friendship", "friends", "friend", "buddy", "pal", "social bonds", "companionship", "bestie"],
    categories: ["social_connection"],
    concepts: ["tribal_bonding", "dunbar_violation"]
  },
  "FOOD": {
    tags: ["food", "eating", "diet", "nutrition", "hunger", "obesity", "meal", "snack", "junk food", "processed food", "calories"],
    categories: ["food_body"],
    concepts: ["proxy_consumption"]
  },
  "FITNESS": {
    tags: ["fitness", "exercise", "gym", "workout", "physical activity", "training", "muscles", "cardio", "running", "lifting"],
    categories: ["food_body", "health_wellbeing"],
    concepts: ["fitness_evaluation", "internal_audience"]
  },
  "SLEEP": {
    tags: ["sleep", "insomnia", "rest", "tired", "circadian", "bed", "night", "wake", "dreams", "fatigue", "sleepless"],
    categories: ["health_wellbeing"],
    concepts: ["environmental_signal"]
  },
  "BODY IMAGE": {
    tags: ["body image", "beauty standards", "appearance", "looks", "attractive", "ugly", "weight", "thin", "fat", "mirror"],
    categories: ["food_body", "identity_self"],
    concepts: ["fitness_evaluation", "internal_audience", "status_competition"]
  },
  "STRANGERS": {
    tags: ["strangers", "stranger", "anonymity", "anonymous", "unknown", "unfamiliar", "crowd", "public"],
    categories: ["social_connection"],
    concepts: ["stranger_overload", "dunbar_violation"]
  },
  "STATUS": {
    tags: ["status", "reputation", "hierarchy", "rank", "prestige", "respect", "clout", "influence", "power"],
    categories: ["status_reputation"],
    concepts: ["status_competition", "internal_audience"]
  },
  "VALIDATION": {
    tags: ["validation", "approval", "likes", "attention", "recognition", "praise", "feedback", "acceptance"],
    categories: ["status_reputation", "identity_self"],
    concepts: ["internal_audience", "proxy_consumption"]
  },
  "ISOLATION": {
    tags: ["isolation", "isolated", "cut off", "disconnected", "withdrawn", "hermit", "alone", "solitary"],
    categories: ["social_connection"],
    concepts: ["dunbar_violation", "stranger_overload"]
  },
  "AGING": {
    tags: ["aging", "old", "elderly", "senior", "getting older", "retirement", "wrinkles", "decline", "elder"],
    categories: ["death_mortality", "identity_self"],
    concepts: []
  },
  "DEATH": {
    tags: ["death", "dying", "mortality", "end of life", "funeral", "grave", "loss", "terminal"],
    categories: ["death_mortality"],
    concepts: []
  },
  "TRIBE": {
    tags: ["tribe", "tribal", "clan", "band", "group", "belonging", "kinship", "village"],
    categories: ["tribal_structure", "social_connection"],
    concepts: ["tribal_bonding", "demand_sharing"]
  },
  "NATURE": {
    tags: ["nature", "outdoors", "forest", "wilderness", "natural", "trees", "mountains", "ocean", "outside", "fresh air", "sunlight"],
    categories: ["nature_environment"],
    concepts: ["de_mismatch"]
  },
  "COMMUNITY": {
    tags: ["community", "village", "neighborhood", "neighbors", "local", "together", "collective", "commune"],
    categories: ["social_connection", "tribal_structure"],
    concepts: ["tribal_bonding", "dunbar_violation"]
  },
  "RITUAL": {
    tags: ["ritual", "tradition", "ceremony", "practice", "custom", "routine", "sacred", "celebration"],
    categories: ["tradition_ritual"],
    concepts: ["tribal_bonding"]
  },
  "PURPOSE": {
    tags: ["purpose", "meaning", "fulfillment", "contribution", "calling", "mission", "why", "direction"],
    categories: ["work_purpose", "identity_self"],
    concepts: ["de_mismatch", "delayed_return"]
  },
  "MEANING": {
    tags: ["meaning", "meaningful", "significance", "purpose", "fulfillment", "depth", "value", "matters"],
    categories: ["identity_self", "work_purpose"],
    concepts: ["de_mismatch"]
  },
  "EXPLOITATION": {
    tags: ["exploitation", "exploit", "exploitative", "monetize", "profit", "extraction", "manipulation", "predatory"],
    categories: ["economics_resources", "proxy_superstimuli"],
    concepts: ["proxy_consumption", "status_competition"]
  },
  "MISMATCH": {
    tags: ["mismatch", "evolutionary mismatch", "environmental mismatch", "misalignment", "disconnect", "incompatible"],
    categories: [],
    concepts: ["environmental_signal", "dunbar_violation", "open_loop_anxiety", "delayed_return"]
  },
  "SIGNALS": {
    tags: ["signal", "signals", "biological signal", "emotion", "emotions", "feeling", "feelings", "response", "alert"],
    categories: ["mental_emotional"],
    concepts: ["environmental_signal", "open_loop_anxiety"]
  },
  "SOLUTIONS": {
    tags: ["solution", "solutions", "fix", "remedy", "intervention", "de-mismatch", "demismatch", "healing", "recovery", "improvement"],
    categories: [],
    concepts: ["de_mismatch", "tribal_bonding"]
  },
  "INTERNAL AUDIENCE": {
    tags: ["internal audience", "phantom audience", "imagined audience", "judgment", "self-conscious", "self-awareness", "reputation anxiety"],
    categories: ["mental_emotional", "identity_self"],
    concepts: ["internal_audience", "status_competition"]
  }
};

// Normalize tag for matching (handles spaces, hyphens, underscores, case)
function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/[\s\-_]/g, '');
}

// Check if an image matches a quick tag (checks tags, title, categories, and framework_concepts)
function imageMatchesQuickTag(img: ImageData, tagName: string, taxonomy: TaxonomyIndex | null): boolean {
  const mapping = TAG_MAPPINGS[tagName];
  if (!mapping) return false;

  // Normalize the quick tag name itself
  const normalizedTagName = normalizeTag(tagName);
  
  // Get all image tags normalized
  const imgTagsNormalized = (img.tags || []).map(t => normalizeTag(t));
  
  // 1. Check if image title contains the tag (strong signal)
  const titleNormalized = normalizeTag(img.title || '');
  if (titleNormalized.includes(normalizedTagName)) {
    return true;
  }
  
  // 2. Check if any of the mapping's tags match any of the image's tags
  for (const mappingTag of mapping.tags) {
    const normalizedMappingTag = normalizeTag(mappingTag);
    
    // Check against image tags
    for (const imgTag of imgTagsNormalized) {
      if (imgTag === normalizedMappingTag || 
          imgTag.includes(normalizedMappingTag) || 
          normalizedMappingTag.includes(imgTag)) {
        return true;
      }
    }
    
    // Also check if mapping tag appears in title
    if (titleNormalized.includes(normalizedMappingTag)) {
      return true;
    }
  }
  
  // 3. Check categories (fallback)
  for (const mappingCat of mapping.categories) {
    const normalizedMappingCat = normalizeTag(mappingCat);
    for (const imgCat of (img.categories || [])) {
      const normalizedImgCat = normalizeTag(imgCat);
      if (normalizedImgCat === normalizedMappingCat || 
          normalizedImgCat.includes(normalizedMappingCat) ||
          normalizedMappingCat.includes(normalizedImgCat)) {
        return true;
      }
    }
    // Check taxonomy index as fallback
    if (taxonomy && taxonomy.by_category[mappingCat]?.includes(img.id)) {
      return true;
    }
  }
  
  // 4. Check framework concepts (fallback)
  for (const mappingConcept of mapping.concepts) {
    const normalizedMappingConcept = normalizeTag(mappingConcept);
    for (const imgConcept of (img.framework_concepts || [])) {
      const normalizedImgConcept = normalizeTag(imgConcept);
      if (normalizedImgConcept === normalizedMappingConcept ||
          normalizedImgConcept.includes(normalizedMappingConcept) ||
          normalizedMappingConcept.includes(normalizedImgConcept)) {
        return true;
      }
    }
    // Check taxonomy index as fallback
    if (taxonomy && taxonomy.by_framework_concept[mappingConcept]?.includes(img.id)) {
      return true;
    }
  }

  return false;
}

export default function LibraryPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <span className="w-8 h-8 border-2 border-[#C75B39]/30 border-t-[#C75B39] rounded-full animate-spin inline-block" />
          <p className="mt-4 text-[#4A4A4A]">Loading library...</p>
        </div>
      </main>
    }>
      <LibraryContent />
    </Suspense>
  );
}

function LibraryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Data state
  const [allImages, setAllImages] = useState<ImageData[]>([]);
  const [taxonomy, setTaxonomy] = useState<TaxonomyIndex | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [tagSearch, setTagSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedQuickTags, setSelectedQuickTags] = useState<Set<string>>(new Set());

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>("series");

  // Admin mode - enabled via ?admin=secret URL param
  const isAdminMode = searchParams.get("admin") === ADMIN_SECRET;

  // UI state
  const [sortBy, setSortBy] = useState<SortOption>("relevant");
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [toast, setToast] = useState("");
  const [displayCount, setDisplayCount] = useState(30);
  const [showAllTags, setShowAllTags] = useState(true);
  
  // Zoom state (1 = smallest/most columns, 5 = largest/fewest columns)
  const [zoomLevel, setZoomLevel] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('library-zoom');
      return saved ? parseInt(saved, 10) : 3;
    }
    return 3;
  });

  // Track window size for responsive grid
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize filters from URL
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const tagsParam = searchParams.get("tags");
    const quickTagsParam = searchParams.get("quicktags");
    const sortParam = searchParams.get("sort") as SortOption;
    const queryParam = searchParams.get("q");

    if (categoryParam) setSelectedCategories(new Set(categoryParam.split(",")));
    if (tagsParam) setSelectedTags(new Set(tagsParam.split(",")));
    if (quickTagsParam) setSelectedQuickTags(new Set(quickTagsParam.split(",")));
    if (sortParam) setSortBy(sortParam);
    if (queryParam) setSearchQuery(queryParam);
  }, [searchParams]);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const [taxonomyRes, imagesRes] = await Promise.all([
          fetch("/api/taxonomy"),
          fetch("/api/images")
        ]);

        if (!taxonomyRes.ok || !imagesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const taxonomyData = await taxonomyRes.json();
        const imagesData = await imagesRes.json();

        // Handle error response
        if (imagesData.error) {
          throw new Error(imagesData.error);
        }

        setTaxonomy(taxonomyData);
        setAllImages(imagesData.images || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load library data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Handle image click from SeriesStrip (looks up full image data by id)
  const handleImageClick = useCallback((image: { id: number }) => {
    const fullImage = allImages.find(img => img.id === image.id);
    if (fullImage) {
      setSelectedImage(fullImage);
    }
  }, [allImages]);

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (selectedCategories.size > 0) params.set("category", Array.from(selectedCategories).join(","));
    if (selectedTags.size > 0) params.set("tags", Array.from(selectedTags).join(","));
    if (selectedQuickTags.size > 0) params.set("quicktags", Array.from(selectedQuickTags).join(","));
    if (sortBy !== "relevant") params.set("sort", sortBy);
    if (searchQuery) params.set("q", searchQuery);

    const queryString = params.toString();
    router.replace(`/library${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [selectedCategories, selectedTags, selectedQuickTags, sortBy, searchQuery, router]);

  useEffect(() => {
    if (!isLoading) {
      updateURL();
    }
  }, [selectedCategories, selectedTags, selectedQuickTags, sortBy, searchQuery, isLoading, updateURL]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    if (!taxonomy) return {};
    const counts: Record<string, number> = {};
    for (const [cat, ids] of Object.entries(taxonomy.by_category)) {
      counts[cat] = ids.length;
    }
    return counts;
  }, [taxonomy]);

  // Note: imagesBySeries is computed later from filteredImages so it respects filters.

  // Compute tag frequency map (lookup object for scoring)
  const tagFrequencyMap = useMemo(() => {
    const freq: Record<string, number> = {};
    for (const img of allImages) {
      for (const tag of img.tags) {
        const tagLower = tag.toLowerCase();
        freq[tagLower] = (freq[tagLower] || 0) + 1;
      }
    }
    return freq;
  }, [allImages]);

  // Compute tag frequencies (sorted array for UI display)
  const tagFrequencies = useMemo(() => {
    const freq: Record<string, number> = {};
    for (const img of allImages) {
      for (const tag of img.tags) {
        freq[tag] = (freq[tag] || 0) + 1;
      }
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50);
  }, [allImages]);

  // Compute search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    const suggestions: Array<{ text: string; type: "tag" | "category" }> = [];

    // Search in tags
    for (const [tag] of tagFrequencies) {
      if (tag.toLowerCase().includes(query)) {
        suggestions.push({ text: tag, type: "tag" });
      }
    }

    // Search in categories
    if (taxonomy) {
      for (const cat of Object.keys(taxonomy.by_category)) {
        if (cat.toLowerCase().includes(query) || formatLabel(cat).toLowerCase().includes(query)) {
          suggestions.push({ text: formatLabel(cat), type: "category" });
        }
      }
    }

    return suggestions.slice(0, 8);
  }, [searchQuery, tagFrequencies, taxonomy]);

  // Filter images
  const filteredImages = useMemo(() => {
    let result = allImages;

    // Early return if no images
    if (result.length === 0) {
      return [];
    }

    // Filter out images that belong ONLY to unused series
    result = result.filter(img => {
      if (!img.series || !Array.isArray(img.series) || img.series.length === 0) {
        return true; // Keep images with no series (will go to "Other")
      }
      // Keep if at least one series is NOT in UNUSED_SERIES
      return img.series.some(s => !UNUSED_SERIES.includes(s));
    });

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(img => {
        // Search in title
        if (img.title.toLowerCase().includes(query)) return true;
        // Search in tags
        if (img.tags.some(tag => tag.toLowerCase().includes(query))) return true;
        // Search in categories
        if (img.categories.some(cat => cat.toLowerCase().includes(query) || formatLabel(cat).toLowerCase().includes(query))) return true;
        return false;
      });
    }

    // Filter by category
    if (selectedCategories.size > 0 && taxonomy) {
      const validIds = new Set<number>();
      for (const cat of selectedCategories) {
        for (const id of taxonomy.by_category[cat] || []) {
          validIds.add(id);
        }
      }
      result = result.filter(img => validIds.has(img.id));
    }

    // Filter by tags (AND logic with fuzzy matching)
    if (selectedTags.size > 0) {
      result = result.filter(img => {
        // Image must match ALL selected tags
        return Array.from(selectedTags).every(selectedTag => {
          const normalizedSelected = normalizeTag(selectedTag);
          
          // Check tags array
          if (img.tags?.some(imgTag => {
            const normalizedImg = normalizeTag(imgTag);
            return normalizedImg.includes(normalizedSelected) || 
                   normalizedSelected.includes(normalizedImg);
          })) {
            return true;
          }
          
          // Check themes array if exists
          if ('themes' in img && Array.isArray((img as any).themes)) {
            if ((img as any).themes.some((theme: string) => {
              const normalizedTheme = normalizeTag(theme);
              return normalizedTheme.includes(normalizedSelected) ||
                     normalizedSelected.includes(normalizedTheme);
            })) {
              return true;
            }
          }
          
          // Check categories array
          if (img.categories?.some(cat => {
            const normalizedCat = normalizeTag(cat);
            return normalizedCat.includes(normalizedSelected) ||
                   normalizedSelected.includes(normalizedCat);
          })) {
            return true;
          }
          
          // Check framework_concepts array
          if (img.framework_concepts?.some(concept => {
            const normalizedConcept = normalizeTag(concept);
            return normalizedConcept.includes(normalizedSelected) ||
                   normalizedSelected.includes(normalizedConcept);
          })) {
            return true;
          }
          
          return false;
        });
      });
    }

    // Filter by quick tags (AND logic - image must match ALL selected quick tags)
    // Only filter if quick tags are selected
    // Note: imageMatchesQuickTag can work without taxonomy (uses image's own metadata),
    // but taxonomy provides fallback matching
    if (selectedQuickTags.size > 0) {
      result = result.filter(img =>
        Array.from(selectedQuickTags).every(tagName => imageMatchesQuickTag(img, tagName, taxonomy))
      );
    }

    // Sort
    switch (sortBy) {
      case "relevant":
        if (selectedQuickTags.size > 0) {
          // Tag-specific relevance scoring when quick tags are selected
          result = [...result].sort((a, b) => {
            // Primary: tag-specific relevance score (descending)
            const tagScoreA = calculateTagRelevance(a, selectedQuickTags, TAG_MAPPINGS, tagFrequencyMap, taxonomy);
            const tagScoreB = calculateTagRelevance(b, selectedQuickTags, TAG_MAPPINGS, tagFrequencyMap, taxonomy);
            if (tagScoreB !== tagScoreA) return tagScoreB - tagScoreA;

            // Secondary: framework concept score as tiebreaker
            return calculateRelevanceScore(b) - calculateRelevanceScore(a);
          });
        } else {
          // Original relevance scoring when no quick tags selected
          result = [...result].sort((a, b) => {
            return calculateRelevanceScore(b) - calculateRelevanceScore(a);
          });
        }
        break;
      case "alphabetical":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "category":
        result = [...result].sort((a, b) =>
          (a.categories[0] || "").localeCompare(b.categories[0] || "")
        );
        break;
    }

    return result;
  }, [allImages, searchQuery, selectedCategories, selectedTags, selectedQuickTags, sortBy, taxonomy, tagFrequencyMap]);

  // Group images by series for series view (respects current filters)
  const imagesBySeries = useMemo(() => {
    const grouped: Record<string, ImageData[]> = {};

    for (const img of filteredImages) {
      if (img.series && Array.isArray(img.series) && img.series.length > 0) {
        for (const series of img.series) {
          if (!series || !series.trim()) continue;
          // Skip series that are marked as unused/hidden
          if (UNUSED_SERIES.includes(series)) continue;
          if (!grouped[series]) grouped[series] = [];
          grouped[series].push(img);
        }
      } else {
        // If an image has no series, it must still appear in series view (e.g. for search results).
        const bucket = 'Other';
        if (!grouped[bucket]) grouped[bucket] = [];
        grouped[bucket].push(img);
      }
    }

    // Ensure default-first images are shown first within each series.
    for (const series of Object.keys(grouped)) {
      grouped[series] = [...grouped[series]].sort((a, b) => {
        const defaultDiff = Number(!!b.show_first_default) - Number(!!a.show_first_default);
        if (defaultDiff != 0) return defaultDiff;
        return a.id - b.id;
      });
    }

    // Sort series using the defined order, falling back to count for unlisted series
    const sortedEntries = Object.entries(grouped)
      .filter(([name]) => name !== 'Misc' && name !== 'Other')
      .sort(([nameA, a], [nameB, b]) => {
        const orderA = getSeriesOrder(nameA);
        const orderB = getSeriesOrder(nameB);
        // If both have defined order, use that
        if (orderA !== orderB) return orderA - orderB;
        // Otherwise sort by count (descending)
        return b.length - a.length;
      });

    // Other and Misc always go at the end
    if (grouped['Other']) sortedEntries.push(['Other', grouped['Other']]);
    if (grouped['Misc']) sortedEntries.push(['Misc', grouped['Misc']]);

    return sortedEntries;
  }, [filteredImages]);

  // Filter tags by search
  const filteredTags = useMemo(() => {
    if (!tagSearch) return tagFrequencies;
    const search = tagSearch.toLowerCase();
    return tagFrequencies.filter(([tag]) => tag.toLowerCase().includes(search));
  }, [tagFrequencies, tagSearch]);

  // Toggle functions
  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const toggleQuickTag = (tagName: string) => {
    setSelectedQuickTags(prev => {
      const next = new Set(prev);
      if (next.has(tagName)) next.delete(tagName);
      else next.add(tagName);
      return next;
    });
  };


  const clearAllFilters = () => {
    setSelectedCategories(new Set());

    setSelectedTags(new Set());
    setSelectedQuickTags(new Set());
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedCategories.size > 0 ||
    selectedTags.size > 0 ||
    selectedQuickTags.size > 0 ||
    searchQuery.length > 0;

  // Watermark and download functions
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const addWatermark = async (imageUrl: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0);

        const watermarkText = "demismatch.com";
        const padding = 10;
        const fontSize = Math.max(12, Math.min(24, img.width / 30));

        ctx.font = `${fontSize}px "Space Mono", monospace`;
        ctx.textBaseline = "bottom";
        ctx.textAlign = "right";

        const textWidth = ctx.measureText(watermarkText).width;
        const x = img.width - padding;
        const y = img.height - padding;

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(x - textWidth - 8, y - fontSize - 4, textWidth + 16, fontSize + 8);

        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillText(watermarkText, x, y);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Could not create blob"));
          },
          "image/png",
          0.95
        );
      };
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = imageUrl;
    });
  };

  const copyToClipboard = async (imageUrl: string) => {
    try {
      showToast("Preparing image...");
      const watermarkedBlob = await addWatermark(imageUrl);
      await navigator.clipboard.write([
        new ClipboardItem({ [watermarkedBlob.type]: watermarkedBlob }),
      ]);
      showToast("Image copied to clipboard!");
    } catch (err) {
      console.error("Copy error:", err);
      try {
        await navigator.clipboard.writeText(imageUrl);
        showToast("Image URL copied!");
      } catch {
        showToast("Failed to copy image");
      }
    }
  };

  const downloadImage = async (image: ImageData) => {
    try {
      showToast("Preparing download...");
      const watermarkedBlob = await addWatermark(image.image_url);
      const url = URL.createObjectURL(watermarkedBlob);
      const a = document.createElement("a");
      a.href = url;
      // Use file_name (e.g., "36_THE_3AM_WORRY.png") as the download name
      const baseName = image.file_name.replace(/\.[^/.]+$/, ""); // Remove extension
      a.download = `${baseName}_demismatch.com.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Image downloaded!");
    } catch (err) {
      console.error("Download error:", err);
      showToast("Failed to download image");
    }
  };

  // Admin: Delete image (instant, no confirmation)
  const deleteImage = async (imageId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/images/${imageId}?secret=${ADMIN_SECRET}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        // Remove from local state immediately
        setAllImages(prev => prev.filter(img => img.id !== imageId));
        showToast("Deleted");
      } else {
        showToast("Delete failed");
      }
    } catch {
      showToast("Delete failed");
    }
  };

  const handleSeriesImageClick = useCallback((imageId: number) => {
    const full = allImages.find(img => img.id === imageId);
    if (full) setSelectedImage(full);
  }, [allImages]);

  // Load more for infinite scroll
  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + 30, filteredImages.length));
  };

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(30);
  }, [selectedCategories, selectedTags, selectedQuickTags, searchQuery]);

  // Save zoom level to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('library-zoom', zoomLevel.toString());
    }
  }, [zoomLevel]);

  // Zoom functions
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(5, prev + 1));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(1, prev - 1));
  };

  // Calculate grid columns based on zoom level
  const getGridCols = () => {
    if (isMobile) return 1;
    // Desktop: zoom 1 = 5 cols, zoom 2 = 4 cols, zoom 3 = 3 cols, zoom 4 = 2 cols, zoom 5 = 1 col
    return 6 - zoomLevel;
  };

  const getGap = () => {
    // Smaller gap for more columns, larger gap for fewer columns
    const gaps = ['0.5rem', '0.75rem', '1rem', '1rem', '1rem'];
    return gaps[zoomLevel - 1];
  };

  const displayedImages = filteredImages.slice(0, displayCount);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <span className="w-8 h-8 border-2 border-[#C75B39]/30 border-t-[#C75B39] rounded-full animate-spin inline-block" />
          <p className="mt-4 text-[#4A4A4A]">Loading library...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Link href="/" className="inline-block mt-4 px-6 py-3 bg-[#C75B39] text-white font-medium hover:bg-[#A84A2D] transition-colors rounded-lg">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col">
      <Navigation />

      {/* Admin Mode Banner */}
      {isAdminMode && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-1 text-xs font-medium z-[100]">
          ADMIN MODE — Delete enabled (hover images to delete)
        </div>
      )}

      {/* Header */}
      <header className="pt-20 p-4 md:p-6 md:pt-24 border-b border-[#E5E0D8] bg-[#FAF9F6]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Image Library</h1>
            <p className="text-sm text-[#4A4A4A]">Visual explanations of mismatch concepts</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8B8B]" />
            <input
              type="text"
              placeholder="Search by title, tag, category, or concept..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E0D8] text-[#1A1A1A] placeholder:text-[#8B8B8B] focus:border-[#C75B39] focus:outline-none focus:ring-2 focus:ring-[#C75B39]/20 rounded-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8B8B] hover:text-[#1A1A1A]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-[#E5E0D8] shadow-xl overflow-hidden rounded-lg">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left hover:bg-[#F5F3EF] flex items-center gap-2"
                  onMouseDown={() => {
                    setSearchQuery(suggestion.text);
                    setShowSuggestions(false);
                  }}
                >
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    suggestion.type === "tag" ? "bg-[#F5F3EF] text-[#4A4A4A]" :
                    suggestion.type === "category" ? "bg-blue-100 text-blue-700" :
                    "bg-[#C75B39]/20 text-[#C75B39]"
                  }`}>
                    {suggestion.type}
                  </span>
                  <span className="text-sm text-[#1A1A1A]">{suggestion.text}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Filter Tags */}
        <div className="mt-4 space-y-3">
          {/* Primary tags - clean horizontal layout */}
          <div className="flex flex-wrap gap-2 justify-center">
            {PRIMARY_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleQuickTag(tag)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  selectedQuickTags.has(tag)
                    ? "bg-[#C75B39] text-white border-[#C75B39]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-[#C75B39]"
                }`}
              >
                {tag}
              </button>
            ))}
            
            {/* Expander */}
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="px-3 py-1.5 text-sm text-gray-500 hover:text-[#C75B39] transition-colors"
            >
              {showAllTags ? 'Show less' : `+${SECONDARY_TAGS.length} more`}
            </button>
          </div>
          
          {/* Secondary tags - only when expanded */}
          {showAllTags && (
            <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-gray-100">
              {SECONDARY_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleQuickTag(tag)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    selectedQuickTags.has(tag)
                      ? "bg-[#C75B39] text-white border-[#C75B39]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#C75B39]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 w-full">
          {/* Active Filters Bar */}
          {hasActiveFilters && (
            <div className="mb-4 space-y-3">
              {/* Quick Tags Filter Bar */}
              {selectedQuickTags.size > 0 && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                  <span className="text-sm text-gray-600 whitespace-nowrap">Filtering by:</span>
                  <div className="flex flex-wrap gap-2 flex-1">
                    {Array.from(selectedQuickTags).map(tag => (
                      <span 
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[#C75B39] text-white text-sm rounded-full"
                      >
                        {tag}
                        <button 
                          onClick={() => toggleQuickTag(tag)}
                          className="hover:bg-[#b54d2e] rounded-full p-0.5 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  {selectedQuickTags.size > 1 && (
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      (matching ALL tags)
                    </span>
                  )}
                  <button 
                    onClick={() => setSelectedQuickTags(new Set())}
                    className="text-sm text-[#C75B39] hover:underline whitespace-nowrap"
                  >
                    Clear all
                  </button>
                </div>
              )}
              
              {/* Other Filters */}
              {(selectedCategories.size > 0 || selectedTags.size > 0) && (
                <div className="flex flex-wrap items-center gap-2">
                  {Array.from(selectedCategories).map(cat => (
                    <span key={cat} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-[#C75B39] text-white rounded-full">
                      {formatLabel(cat)}
                      <button onClick={() => toggleCategory(cat)} className="hover:opacity-70">✕</button>
                    </span>
                  ))}
                  {Array.from(selectedTags).map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-[#C75B39] text-white rounded-full">
                      #{tag}
                      <button onClick={() => toggleTag(tag)} className="hover:opacity-70">✕</button>
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedCategories(new Set());
                      setSelectedTags(new Set());
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results Header */}
          <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-[#4A4A4A]">
              Showing {displayedImages.length} of {filteredImages.length} images
              {selectedQuickTags.size > 0 && (
                <span className="text-gray-500 ml-1">
                  {' '}matching {selectedQuickTags.size === 1 ? 'tag' : 'all tags'}: {Array.from(selectedQuickTags).join(' + ')}
                </span>
              )}
            </p>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 border border-[#E5E0D8] rounded-lg bg-white">
                <button
                  onClick={() => setViewMode("series")}
                  className={`p-2 transition-colors ${viewMode === "series" ? "text-[#C75B39] bg-[#C75B39]/10" : "text-[#4A4A4A] hover:text-[#C75B39]"}`}
                  title="View by Series"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "text-[#C75B39] bg-[#C75B39]/10" : "text-[#4A4A4A] hover:text-[#C75B39]"}`}
                  title="View as Grid"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </button>
              </div>
              {/* Zoom Controls (affects grid density + series tile size) */}
              {(
                <div className="flex items-center gap-1 border border-[#E5E0D8] rounded-lg bg-white">
                  <button
                    onClick={zoomOut}
                    disabled={zoomLevel <= 1}
                    className="p-2 text-[#4A4A4A] hover:text-[#C75B39] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Zoom out (more images per row)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </button>
                  <span className="px-2 text-xs text-[#4A4A4A] min-w-[3rem] text-center" title="Zoom level: smaller = more images per row">
                    Zoom {zoomLevel}
                  </span>
                  <button
                    onClick={zoomIn}
                    disabled={zoomLevel >= 5}
                    className="p-2 text-[#4A4A4A] hover:text-[#C75B39] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Zoom in (fewer images per row)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </button>
                </div>
              )}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 bg-white border border-[#E5E0D8] text-sm text-[#1A1A1A] focus:border-[#C75B39] focus:outline-none rounded"
              >
                <option value="relevant">Sort: Most Relevant</option>
                <option value="alphabetical">Sort: A-Z</option>
                <option value="category">Sort: Category</option>
              </select>
            </div>
          </div>

          {/* Series View */}
          {viewMode === "series" ? (
            <div className="space-y-0 w-full min-w-0 overflow-x-hidden">
              {imagesBySeries.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#8B8B8B]">No series found</p>
                  <p className="text-xs text-[#8B8B8B] mt-2">Check the browser console for debug information</p>
                </div>
              ) : (
                imagesBySeries.map(([seriesName, seriesImages]) => (
                  <SeriesStrip
                    key={seriesName}
                    seriesName={getSeriesDisplayName(seriesName)}
                    originalSeriesName={seriesName}
                    images={seriesImages}
                    onImageClick={handleSeriesImageClick}
                    onDelete={isAdminMode ? deleteImage : undefined}
                    isAdminMode={isAdminMode}
                    zoomLevel={zoomLevel}
                    isMobile={isMobile}
                  />
                ))
              )}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#8B8B8B]">No images match your filters</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-white border border-[#E5E0D8] text-[#4A4A4A] hover:border-[#C75B39] transition-colors rounded"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
                <div 
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${getGridCols()}, minmax(0, 1fr))`,
                    gap: getGap(),
                  } as React.CSSProperties}
                >
                  {displayedImages.map((image) => (
                    <div
                      key={image.id}
                      className="group relative overflow-hidden cursor-pointer bg-[#F5F3EF] rounded-lg"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image.image_url}
                        alt=""
                        title=""
                        className="w-full aspect-square object-cover group-hover:opacity-80 transition-opacity"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).alt = '';
                          (e.target as HTMLImageElement).title = '';
                        }}
                      />
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isAdminMode && (
                          <button
                            className="p-1.5 bg-red-600 rounded hover:bg-red-700 text-white"
                            onClick={(e) => deleteImage(image.id, e)}
                            title="Delete image"
                          >
                            <TrashIcon />
                          </button>
                        )}
                        <button
                          className="p-1.5 bg-black/60 rounded hover:bg-black/80"
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(image.image_url); }}
                        >
                          <CopyIcon />
                        </button>
                        <button
                          className="p-1.5 bg-black/60 rounded hover:bg-black/80"
                          onClick={(e) => { e.stopPropagation(); downloadImage(image); }}
                        >
                          <DownloadIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              {/* Load More */}
              {displayCount < filteredImages.length && (
                <div className="text-center mt-6">
                  <button onClick={loadMore} className="px-6 py-3 bg-white border border-[#E5E0D8] text-[#4A4A4A] hover:border-[#C75B39] hover:text-[#C75B39] transition-colors rounded-lg">
                    Load More ({filteredImages.length - displayCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white border border-[#E5E0D8] text-[#4A4A4A] hover:border-[#C75B39] hover:text-[#C75B39] z-10 transition-colors rounded-lg"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="w-full"
            />
            <div className="p-4">
              {selectedImage.tags.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-[#8B8B8B] uppercase mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedImage.tags.slice(0, 10).map(tag => (
                      <span key={tag} className="text-xs text-[#8B8B8B]">
                        #{tag}
                      </span>
                    ))}
                    {selectedImage.tags.length > 10 && (
                      <span className="text-xs text-[#8B8B8B]">
                        +{selectedImage.tags.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-3 bg-[#C75B39] text-white font-medium hover:bg-[#A84A2D] transition-colors flex items-center justify-center gap-2 rounded-lg"
                  onClick={() => copyToClipboard(selectedImage.image_url)}
                >
                  <CopyIcon />
                  Copy
                </button>
                <button
                  className="flex-1 px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] text-[#1A1A1A] font-medium hover:bg-[#F5F3EF] hover:border-[#C75B39] transition-colors flex items-center justify-center gap-2 rounded-lg"
                  onClick={() => downloadImage(selectedImage)}
                >
                  <DownloadIcon />
                  Download
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white border border-[#E5E0D8] text-[#1A1A1A] text-sm font-medium shadow-lg z-50 rounded-lg">
          {toast}
        </div>
      )}

    </main>
  );
}

// Icons

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

