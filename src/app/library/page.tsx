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
}

interface TaxonomyIndex {
  by_category: Record<string, number[]>;
  by_series: Record<string, number[]>;
  by_framework_concept: Record<string, number[]>;
}

type ViewMode = "grid" | "series";

type SortOption = "relevant" | "alphabetical" | "type" | "category";

const IMAGE_TYPES = ["problem", "solution", "comparison"];

// Type priority for relevance sorting (lower = higher priority)
const TYPE_PRIORITY: Record<string, number> = {
  problem: 0,
  comparison: 1,
  solution: 2,
};

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
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedConcepts, setSelectedConcepts] = useState<Set<string>>(new Set());
  const [tagSearch, setTagSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedQuickTags, setSelectedQuickTags] = useState<Set<string>>(new Set());

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>("series");

  // UI state
  const [sortBy, setSortBy] = useState<SortOption>("relevant");
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["types"]));
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [toast, setToast] = useState("");
  const [displayCount, setDisplayCount] = useState(30);
  const [showAllTags, setShowAllTags] = useState(false);
  
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

  // DEV ONLY: Edit state
  const [editingImage, setEditingImage] = useState<ImageData | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // ADMIN: Metadata editing state
  const [metadataImage, setMetadataImage] = useState<ImageData | null>(null);
  const [metadataForm, setMetadataForm] = useState({
    image_type: "",
    categories: "",
    framework_concepts: "",
    tags: "",
    user_rating: "",
    user_notes: "",
    is_favorite: false
  });
  const [isSavingMetadata, setIsSavingMetadata] = useState(false);

  // Initialize filters from URL
  useEffect(() => {
    const typeParam = searchParams.get("type");
    const categoryParam = searchParams.get("category");
    const conceptParam = searchParams.get("concept");
    const tagsParam = searchParams.get("tags");
    const quickTagsParam = searchParams.get("quicktags");
    const sortParam = searchParams.get("sort") as SortOption;
    const queryParam = searchParams.get("q");

    if (typeParam) setSelectedTypes(new Set(typeParam.split(",")));
    if (categoryParam) setSelectedCategories(new Set(categoryParam.split(",")));
    if (conceptParam) setSelectedConcepts(new Set(conceptParam.split(",")));
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

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (selectedTypes.size > 0) params.set("type", Array.from(selectedTypes).join(","));
    if (selectedCategories.size > 0) params.set("category", Array.from(selectedCategories).join(","));
    if (selectedConcepts.size > 0) params.set("concept", Array.from(selectedConcepts).join(","));
    if (selectedTags.size > 0) params.set("tags", Array.from(selectedTags).join(","));
    if (selectedQuickTags.size > 0) params.set("quicktags", Array.from(selectedQuickTags).join(","));
    if (sortBy !== "relevant") params.set("sort", sortBy);
    if (searchQuery) params.set("q", searchQuery);

    const queryString = params.toString();
    router.replace(`/library${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [selectedTypes, selectedCategories, selectedConcepts, selectedTags, selectedQuickTags, sortBy, searchQuery, router]);

  useEffect(() => {
    if (!isLoading) {
      updateURL();
    }
  }, [selectedTypes, selectedCategories, selectedConcepts, selectedTags, selectedQuickTags, sortBy, searchQuery, isLoading, updateURL]);

  // Compute category and concept counts
  const categoryCounts = useMemo(() => {
    if (!taxonomy) return {};
    const counts: Record<string, number> = {};
    for (const [cat, ids] of Object.entries(taxonomy.by_category)) {
      counts[cat] = ids.length;
    }
    return counts;
  }, [taxonomy]);

  const conceptCounts = useMemo(() => {
    if (!taxonomy) return {};
    const counts: Record<string, number> = {};
    for (const [concept, ids] of Object.entries(taxonomy.by_framework_concept)) {
      counts[concept] = ids.length;
    }
    return counts;
  }, [taxonomy]);

  // Group images by series for series view
  const imagesBySeries = useMemo(() => {
    const grouped: Record<string, ImageData[]> = {};
    let imagesWithSeries = 0;
    let totalSeriesCount = 0;
    
    for (const img of allImages) {
      if (img.series && Array.isArray(img.series) && img.series.length > 0) {
        imagesWithSeries++;
        totalSeriesCount += img.series.length;
        for (const series of img.series) {
          if (series && series.trim()) { // Only add non-empty series names
            if (!grouped[series]) {
              grouped[series] = [];
            }
            grouped[series].push(img);
          }
        }
      }
    }
    
    // Debug logging
    if (allImages.length > 0) {
      console.log(`[Series Debug] Total images: ${allImages.length}, Images with series: ${imagesWithSeries}, Total series entries: ${totalSeriesCount}`);
      console.log(`[Series Debug] Series found:`, Object.keys(grouped));
      if (imagesWithSeries > 0) {
        const sampleImage = allImages.find(img => img.series && img.series.length > 0);
        if (sampleImage) {
          console.log(`[Series Debug] Sample image series:`, sampleImage.series);
        }
      }
    }
    
    // Sort series by image count (descending)
    const sortedEntries = Object.entries(grouped)
      .filter(([name]) => name !== 'Misc') // Put Misc last
      .sort(([, a], [, b]) => b.length - a.length);
    
    // Add Misc at the end if it exists
    if (grouped['Misc']) {
      sortedEntries.push(['Misc', grouped['Misc']]);
    }
    
    return sortedEntries;
  }, [allImages]);

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
    const suggestions: Array<{ text: string; type: "tag" | "category" | "concept" }> = [];

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

      // Search in concepts
      for (const concept of Object.keys(taxonomy.by_framework_concept)) {
        if (concept.toLowerCase().includes(query) || formatLabel(concept).toLowerCase().includes(query)) {
          suggestions.push({ text: formatLabel(concept), type: "concept" });
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
        // Search in framework concepts
        if (img.framework_concepts.some(c => c.toLowerCase().includes(query) || formatLabel(c).toLowerCase().includes(query))) return true;
        return false;
      });
    }

    // Filter by type
    if (selectedTypes.size > 0) {
      result = result.filter(img => selectedTypes.has(img.image_type));
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

    // Filter by concept
    if (selectedConcepts.size > 0 && taxonomy) {
      const validIds = new Set<number>();
      for (const concept of selectedConcepts) {
        for (const id of taxonomy.by_framework_concept[concept] || []) {
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

            // Secondary: image type priority (problem > comparison > explanation > solution)
            const typeDiff = (TYPE_PRIORITY[a.image_type] ?? 4) - (TYPE_PRIORITY[b.image_type] ?? 4);
            if (typeDiff !== 0) return typeDiff;

            // Tertiary: framework concept score as tiebreaker
            return calculateRelevanceScore(b) - calculateRelevanceScore(a);
          });
        } else {
          // Original relevance scoring when no quick tags selected
          result = [...result].sort((a, b) => {
            const typeDiff = (TYPE_PRIORITY[a.image_type] ?? 4) - (TYPE_PRIORITY[b.image_type] ?? 4);
            if (typeDiff !== 0) return typeDiff;
            return calculateRelevanceScore(b) - calculateRelevanceScore(a);
          });
        }
        break;
      case "alphabetical":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "type":
        result = [...result].sort((a, b) => a.image_type.localeCompare(b.image_type));
        break;
      case "category":
        result = [...result].sort((a, b) =>
          (a.categories[0] || "").localeCompare(b.categories[0] || "")
        );
        break;
    }

    return result;
  }, [allImages, searchQuery, selectedTypes, selectedCategories, selectedConcepts, selectedTags, selectedQuickTags, sortBy, taxonomy, tagFrequencyMap]);

  // Filter tags by search
  const filteredTags = useMemo(() => {
    if (!tagSearch) return tagFrequencies;
    const search = tagSearch.toLowerCase();
    return tagFrequencies.filter(([tag]) => tag.toLowerCase().includes(search));
  }, [tagFrequencies, tagSearch]);

  // Toggle functions
  const toggleType = (type: string) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const toggleConcept = (concept: string) => {
    setSelectedConcepts(prev => {
      const next = new Set(prev);
      if (next.has(concept)) next.delete(concept);
      else next.add(concept);
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const clearAllFilters = () => {
    setSelectedTypes(new Set());
    setSelectedCategories(new Set());
    setSelectedConcepts(new Set());
    setSelectedTags(new Set());
    setSelectedQuickTags(new Set());
    setSearchQuery("");
  };

  const hasActiveFilters = selectedTypes.size > 0 || selectedCategories.size > 0 ||
    selectedConcepts.size > 0 || selectedTags.size > 0 || selectedQuickTags.size > 0 || searchQuery.length > 0;

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

  // ADMIN: Open metadata editor
  const openMetadataEditor = (image: ImageData) => {
    setMetadataImage(image);
    setMetadataForm({
      image_type: image.image_type || "problem",
      categories: image.categories?.join(", ") || "",
      framework_concepts: image.framework_concepts?.join(", ") || "",
      tags: image.tags?.join(", ") || "",
      user_rating: "", // Would need to fetch from masterlist
      user_notes: "",
      is_favorite: false
    });
  };

  // ADMIN: Save metadata changes
  const saveMetadata = async () => {
    if (!metadataImage) return;
    
    setIsSavingMetadata(true);
    try {
      const updates: Record<string, unknown> = {
        image_type: metadataForm.image_type,
        categories: metadataForm.categories.split(",").map(s => s.trim()).filter(Boolean),
        framework_concepts: metadataForm.framework_concepts.split(",").map(s => s.trim()).filter(Boolean),
        tags_normalized: metadataForm.tags.split(",").map(s => s.trim()).filter(Boolean),
      };
      
      if (metadataForm.user_rating) {
        updates.user_rating = parseInt(metadataForm.user_rating) || null;
      }
      if (metadataForm.user_notes) {
        updates.user_notes = metadataForm.user_notes;
      }
      updates.is_favorite = metadataForm.is_favorite;

      const res = await fetch(`/api/images/${metadataImage.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save");
      }

      const responseData = await res.json();
      console.log('Metadata save response:', responseData);

      // Update local state with response data
      if (responseData.image) {
        setAllImages(prev => prev.map(img =>
          img.id === metadataImage.id
            ? {
                ...img,
                image_type: responseData.image.image_type,
                categories: responseData.image.categories || [],
                framework_concepts: responseData.image.framework_concepts || [],
                tags: responseData.image.tags_normalized || []
              }
            : img
        ));
      }

      setMetadataImage(null);
      showToast("✓ Saved to masterlist & database!");
    } catch (err) {
      console.error("Save metadata error:", err);
      showToast(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSavingMetadata(false);
    }
  };

  // DEV ONLY: Delete image from Supabase
  const deleteImage = async (image: ImageData) => {
    if (!confirm(`Delete "${image.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/images/${image.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setAllImages(prev => prev.filter(img => img.id !== image.id));
      setSelectedImage(null);
      showToast(`Deleted: ${image.title}`);
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete image");
    }
  };

  // DEV ONLY: Edit image using Gemini AI
  const editImage = async (image: ImageData) => {
    if (!editPrompt.trim()) {
      showToast("Please enter an edit prompt");
      return;
    }

    setIsEditing(true);

    try {
      showToast("Sending to AI for editing...");

      // Just send the prompt - the API will use the public URL from Supabase
      const res = await fetch(`/api/images/${image.id}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: editPrompt })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Edit failed");
      }

      const data = await res.json();

      setAllImages(prev => prev.map(img =>
        img.id === image.id
          ? { ...img, image_url: data.newImageUrl }
          : img
      ));

      setEditingImage(null);
      setEditPrompt("");
      setSelectedImage(null);
      showToast("Image edited successfully!");

    } catch (err) {
      console.error("Edit error:", err);
      showToast(`Failed to edit: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsEditing(false);
    }
  };

  // Load more for infinite scroll
  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + 30, filteredImages.length));
  };

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(30);
  }, [selectedTypes, selectedCategories, selectedConcepts, selectedTags, selectedQuickTags, searchQuery]);

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

  // Sidebar content (shared between desktop and mobile)
  const FilterContent = () => (
    <div className="space-y-4">
      {/* Image Types */}
      <div className="border-b border-[#E5E0D8] pb-4">
        <button
          className="w-full flex items-center justify-between py-2 text-sm font-bold tracking-wide text-[#1A1A1A]"
          onClick={() => toggleSection("types")}
        >
          <span>Image Type</span>
          <span className="text-[#8B8B8B]">{expandedSections.has("types") ? "−" : "+"}</span>
        </button>
        {expandedSections.has("types") && (
          <div className="space-y-2 mt-2">
            {IMAGE_TYPES.map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.has(type)}
                  onChange={() => toggleType(type)}
                  className="accent-[#C75B39]"
                />
                <span className="text-sm capitalize text-[#4A4A4A]">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Filters (collapsed by default) */}
      <div className="pb-4">
        <button
          className="w-full flex items-center justify-between py-2 text-xs font-medium tracking-wide text-[#8B8B8B] hover:text-[#4A4A4A]"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <span>ADVANCED FILTERS</span>
          <span>{showAdvancedFilters ? "−" : "+"}</span>
        </button>

        {showAdvancedFilters && (
          <div className="mt-3 space-y-4 pl-2 border-l-2 border-[#E5E0D8]">
            {/* Categories */}
            <div>
              <button
                className="w-full flex items-center justify-between py-1 text-sm font-bold tracking-wide text-[#1A1A1A]"
                onClick={() => toggleSection("categories")}
              >
                <span>Categories</span>
                <span className="text-[#8B8B8B]">{expandedSections.has("categories") ? "−" : "+"}</span>
              </button>
              {expandedSections.has("categories") && taxonomy && (
                <div className="space-y-1 mt-2 max-h-48 overflow-y-auto">
                  {Object.keys(taxonomy.by_category).sort().map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="accent-[#C75B39]"
                      />
                      <span className="text-sm flex-1 text-[#4A4A4A]">{formatLabel(cat)}</span>
                      <span className="text-xs text-[#8B8B8B]">{categoryCounts[cat]}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Framework Concepts */}
            <div>
              <button
                className="w-full flex items-center justify-between py-1 text-sm font-bold tracking-wide text-[#1A1A1A]"
                onClick={() => toggleSection("concepts")}
              >
                <span>Framework Concepts</span>
                <span className="text-[#8B8B8B]">{expandedSections.has("concepts") ? "−" : "+"}</span>
              </button>
              {expandedSections.has("concepts") && taxonomy && (
                <div className="space-y-1 mt-2 max-h-48 overflow-y-auto">
                  {Object.keys(taxonomy.by_framework_concept).sort().map(concept => (
                    <label key={concept} className="flex items-center gap-2 cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={selectedConcepts.has(concept)}
                        onChange={() => toggleConcept(concept)}
                        className="accent-[#C75B39]"
                      />
                      <span className="text-sm flex-1 text-[#4A4A4A]">{formatLabel(concept)}</span>
                      <span className="text-xs text-[#8B8B8B]">{conceptCounts[concept]}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <button
                className="w-full flex items-center justify-between py-1 text-sm font-bold tracking-wide text-[#1A1A1A]"
                onClick={() => toggleSection("tags")}
              >
                <span>Tags</span>
                <span className="text-[#8B8B8B]">{expandedSections.has("tags") ? "−" : "+"}</span>
              </button>
              {expandedSections.has("tags") && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Search tags..."
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5E0D8] text-sm text-[#1A1A1A] placeholder:text-[#8B8B8B] focus:border-[#C75B39] focus:outline-none mb-2 rounded"
                  />
                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                    {filteredTags.map(([tag, count]) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          selectedTags.has(tag)
                            ? "bg-[#C75B39] text-white"
                            : "bg-[#F5F3EF] text-[#4A4A4A] hover:bg-[#E5E0D8]"
                        }`}
                      >
                        {tag} ({count})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

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

      {/* Header */}
      <header className="pt-20 p-4 md:p-6 md:pt-24 border-b border-[#E5E0D8] bg-[#FAF9F6]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Image Library</h1>
            <p className="text-sm text-[#4A4A4A]">Visual explanations of mismatch concepts</p>
          </div>
          <button
            className="md:hidden py-2 px-3 flex items-center gap-2 text-sm text-[#4A4A4A] border border-[#E5E0D8] hover:border-[#C75B39] transition-colors rounded"
            onClick={() => setShowMobileFilters(true)}
          >
            <FilterIcon />
            <span>Filters</span>
          </button>
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
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 border-r border-[#E5E0D8] p-4 overflow-y-auto bg-[#FAF9F6]">
          <FilterContent />
        </aside>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileFilters(false)}>
            <div
              className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[#E5E0D8] flex items-center justify-between">
                <h2 className="font-bold text-[#1A1A1A]">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-[#8B8B8B] hover:text-[#1A1A1A]">✕</button>
              </div>
              <div className="p-4">
                <FilterContent />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
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
              {(selectedTypes.size > 0 || selectedCategories.size > 0 || selectedConcepts.size > 0 || selectedTags.size > 0) && (
                <div className="flex flex-wrap items-center gap-2">
                  {Array.from(selectedTypes).map(type => (
                    <span key={type} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-[#C75B39] text-white rounded-full">
                      {type}
                      <button onClick={() => toggleType(type)} className="hover:opacity-70">✕</button>
                    </span>
                  ))}
                  {Array.from(selectedCategories).map(cat => (
                    <span key={cat} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-[#C75B39] text-white rounded-full">
                      {formatLabel(cat)}
                      <button onClick={() => toggleCategory(cat)} className="hover:opacity-70">✕</button>
                    </span>
                  ))}
                  {Array.from(selectedConcepts).map(concept => (
                    <span key={concept} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-[#C75B39] text-white rounded-full">
                      {formatLabel(concept)}
                      <button onClick={() => toggleConcept(concept)} className="hover:opacity-70">✕</button>
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
                      setSelectedTypes(new Set());
                      setSelectedCategories(new Set());
                      setSelectedConcepts(new Set());
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
              {/* Zoom Controls - only in grid mode */}
              {viewMode === "grid" && (
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
                  <span className="px-2 text-xs text-[#4A4A4A] min-w-[3rem] text-center">
                    {zoomLevel}/5
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
                <option value="type">Sort: Type</option>
                <option value="category">Sort: Category</option>
              </select>
            </div>
          </div>

          {/* Series View */}
          {viewMode === "series" ? (
            <div className="space-y-0">
              {imagesBySeries.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#8B8B8B]">No series found</p>
                  <p className="text-xs text-[#8B8B8B] mt-2">Check the browser console for debug information</p>
                </div>
              ) : (
                imagesBySeries.map(([seriesName, seriesImages]) => (
                  <SeriesStrip
                    key={seriesName}
                    seriesName={seriesName}
                    images={seriesImages}
                  />
                ))
              )}
            </div>
          ) : (
            /* Grid View */
            filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#8B8B8B]">No images match your filters</p>
                <button onClick={clearAllFilters} className="mt-4 px-4 py-2 bg-white border border-[#E5E0D8] text-[#4A4A4A] hover:border-[#C75B39] transition-colors rounded">
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
                        <button
                          className="p-1.5 bg-amber-600/80 rounded hover:bg-amber-600"
                          onClick={(e) => { e.stopPropagation(); openMetadataEditor(image); }}
                          title="Edit metadata"
                        >
                          <MetadataIcon />
                        </button>
                        <button
                          className="p-1.5 bg-blue-600/80 rounded hover:bg-blue-600"
                          onClick={(e) => { e.stopPropagation(); setEditingImage(image); setEditPrompt(""); }}
                          title="Edit image with AI"
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="p-1.5 bg-red-600/80 rounded hover:bg-red-600"
                          onClick={(e) => { e.stopPropagation(); deleteImage(image); }}
                          title="Delete image"
                        >
                          <TrashIcon />
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
              <h3 className="text-lg font-bold mb-2 text-[#1A1A1A]">{selectedImage.title}</h3>

              <span className={`text-xs px-2 py-1 rounded inline-block mb-3 ${
                selectedImage.image_type === "problem" ? "bg-red-100 text-red-700" :
                selectedImage.image_type === "solution" ? "bg-green-100 text-green-700" :
                selectedImage.image_type === "comparison" ? "bg-blue-100 text-blue-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {selectedImage.image_type}
              </span>

              {selectedImage.body_text && (
                <p className="text-sm text-[#4A4A4A] mb-4">
                  {selectedImage.body_text}
                </p>
              )}

              {selectedImage.categories.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-[#8B8B8B] uppercase mb-1">Categories</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedImage.categories.map(cat => (
                      <span key={cat} className="text-xs bg-[#F5F3EF] text-[#4A4A4A] px-2 py-1 rounded">
                        {formatLabel(cat)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedImage.framework_concepts.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-[#8B8B8B] uppercase mb-1">Framework Concepts</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedImage.framework_concepts.map(concept => (
                      <span key={concept} className="text-xs bg-[#C75B39]/20 text-[#C75B39] px-2 py-1 rounded">
                        {formatLabel(concept)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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

              {/* ADMIN: Edit Metadata button */}
              <button
                className="w-full mt-3 py-2 px-4 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 text-sm font-medium flex items-center justify-center gap-2 rounded-lg"
                onClick={() => { openMetadataEditor(selectedImage); setSelectedImage(null); }}
              >
                <MetadataIcon /> Edit Metadata (Admin)
              </button>

              {/* DEV ONLY: Edit button */}
              <button
                className="w-full mt-2 py-2 px-4 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-sm font-medium flex items-center justify-center gap-2 rounded-lg"
                onClick={() => { setEditingImage(selectedImage); setEditPrompt(""); }}
              >
                <EditIcon /> Edit with AI (Dev Only)
              </button>

              {/* DEV ONLY: Delete button */}
              <button
                className="w-full mt-2 py-2 px-4 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-sm font-medium flex items-center justify-center gap-2 rounded-lg"
                onClick={() => deleteImage(selectedImage)}
              >
                <TrashIcon /> Delete Image (Dev Only)
              </button>
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

      {/* DEV ONLY: Edit Modal */}
      {editingImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => !isEditing && setEditingImage(null)}
        >
          <div
            className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#E5E0D8] flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1A1A1A]">Edit Image with AI</h2>
              <button
                onClick={() => !isEditing && setEditingImage(null)}
                className="text-[#8B8B8B] hover:text-[#1A1A1A]"
                disabled={isEditing}
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="aspect-square w-full max-w-sm mx-auto overflow-hidden bg-[#F5F3EF] rounded-lg">
                <img
                  src={editingImage.image_url}
                  alt={editingImage.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="text-sm text-[#4A4A4A] text-center">
                {editingImage.title}
              </p>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#1A1A1A]">
                  Describe your edit:
                </label>
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="e.g., 'fix the garbled text', 'change the font to bold', 'remove the person on the left', 'make it more vibrant'..."
                  className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E0D8] text-[#1A1A1A] placeholder:text-[#8B8B8B] focus:border-[#C75B39] focus:outline-none min-h-[100px] resize-none rounded-lg"
                  disabled={isEditing}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "Fix garbled/corrupted text",
                  "Make text more readable",
                  "Enhance contrast",
                  "Remove background elements",
                  "Simplify the image"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setEditPrompt(suggestion)}
                    className="px-3 py-1 text-xs bg-[#F5F3EF] hover:bg-[#E5E0D8] rounded-full text-[#4A4A4A]"
                    disabled={isEditing}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingImage(null)}
                  className="flex-1 py-2 px-4 bg-[#F5F3EF] text-[#4A4A4A] hover:bg-[#E5E0D8] rounded-lg"
                  disabled={isEditing}
                >
                  Cancel
                </button>
                <button
                  onClick={() => editImage(editingImage)}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-lg"
                  disabled={isEditing || !editPrompt.trim()}
                >
                  {isEditing ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
                      Editing...
                    </>
                  ) : (
                    <>
                      <EditIcon />
                      Apply Edit
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-[#8B8B8B] text-center">
                Warning: This will replace the original image. Make sure you have a backup if needed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN: Metadata Editor Modal */}
      {metadataImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => !isSavingMetadata && setMetadataImage(null)}
        >
          <div
            className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#E5E0D8] flex items-center justify-between bg-amber-50">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">Edit Metadata</h2>
                <p className="text-xs text-amber-700">Changes sync to masterlist.json → database</p>
              </div>
              <button
                onClick={() => !isSavingMetadata && setMetadataImage(null)}
                className="text-[#8B8B8B] hover:text-[#1A1A1A]"
                disabled={isSavingMetadata}
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Image preview */}
              <div className="flex gap-4 items-start">
                <img
                  src={metadataImage.image_url}
                  alt={metadataImage.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-bold text-[#1A1A1A]">{metadataImage.title}</h3>
                  <p className="text-sm text-[#8B8B8B]">ID: {metadataImage.id}</p>
                  <p className="text-sm text-[#8B8B8B]">{metadataImage.file_name}</p>
                </div>
              </div>

              {/* Image Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1A1A1A]">
                  Image Type
                </label>
                <div className="flex gap-2">
                  {["problem", "solution", "comparison"].map(type => (
                    <button
                      key={type}
                      onClick={() => setMetadataForm(f => ({ ...f, image_type: type }))}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        metadataForm.image_type === type
                          ? type === "problem" ? "bg-red-500 text-white border-red-500" :
                            type === "solution" ? "bg-green-500 text-white border-green-500" :
                            "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-[#4A4A4A] border-[#E5E0D8] hover:border-[#C75B39]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1A1A1A]">
                  Categories <span className="text-[#8B8B8B] font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={metadataForm.categories}
                  onChange={(e) => setMetadataForm(f => ({ ...f, categories: e.target.value }))}
                  placeholder="e.g., mental_emotional, social_connection"
                  className="w-full px-4 py-2 bg-[#FAF9F6] border border-[#E5E0D8] text-[#1A1A1A] placeholder:text-[#8B8B8B] focus:border-[#C75B39] focus:outline-none rounded-lg"
                />
              </div>

              {/* Framework Concepts */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1A1A1A]">
                  Framework Concepts <span className="text-[#8B8B8B] font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={metadataForm.framework_concepts}
                  onChange={(e) => setMetadataForm(f => ({ ...f, framework_concepts: e.target.value }))}
                  placeholder="e.g., proxy_consumption, dunbar_violation"
                  className="w-full px-4 py-2 bg-[#FAF9F6] border border-[#E5E0D8] text-[#1A1A1A] placeholder:text-[#8B8B8B] focus:border-[#C75B39] focus:outline-none rounded-lg"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1A1A1A]">
                  Tags <span className="text-[#8B8B8B] font-normal">(comma-separated)</span>
                </label>
                <textarea
                  value={metadataForm.tags}
                  onChange={(e) => setMetadataForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="e.g., anxiety, loneliness, social media, modern life"
                  className="w-full px-4 py-2 bg-[#FAF9F6] border border-[#E5E0D8] text-[#1A1A1A] placeholder:text-[#8B8B8B] focus:border-[#C75B39] focus:outline-none rounded-lg min-h-[80px] resize-none"
                />
              </div>

              {/* Rating & Favorite */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 text-[#1A1A1A]">
                    Rating <span className="text-[#8B8B8B] font-normal">(1-5)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={metadataForm.user_rating}
                    onChange={(e) => setMetadataForm(f => ({ ...f, user_rating: e.target.value }))}
                    placeholder="1-5"
                    className="w-full px-4 py-2 bg-[#FAF9F6] border border-[#E5E0D8] text-[#1A1A1A] placeholder:text-[#8B8B8B] focus:border-[#C75B39] focus:outline-none rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 text-[#1A1A1A]">
                    Favorite
                  </label>
                  <button
                    onClick={() => setMetadataForm(f => ({ ...f, is_favorite: !f.is_favorite }))}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                      metadataForm.is_favorite
                        ? "bg-yellow-400 text-white border-yellow-400"
                        : "bg-white text-[#4A4A4A] border-[#E5E0D8] hover:border-yellow-400"
                    }`}
                  >
                    {metadataForm.is_favorite ? "★ Favorited" : "☆ Not Favorite"}
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1A1A1A]">
                  Notes
                </label>
                <textarea
                  value={metadataForm.user_notes}
                  onChange={(e) => setMetadataForm(f => ({ ...f, user_notes: e.target.value }))}
                  placeholder="Your notes about this image..."
                  className="w-full px-4 py-2 bg-[#FAF9F6] border border-[#E5E0D8] text-[#1A1A1A] placeholder:text-[#8B8B8B] focus:border-[#C75B39] focus:outline-none rounded-lg min-h-[80px] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#E5E0D8]">
                <button
                  onClick={() => setMetadataImage(null)}
                  className="flex-1 py-2 px-4 bg-[#F5F3EF] text-[#4A4A4A] hover:bg-[#E5E0D8] rounded-lg"
                  disabled={isSavingMetadata}
                >
                  Cancel
                </button>
                <button
                  onClick={saveMetadata}
                  className="flex-1 py-2 px-4 bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-lg"
                  disabled={isSavingMetadata}
                >
                  {isSavingMetadata ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <MetadataIcon />
                      Save to Masterlist
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-amber-700 text-center bg-amber-50 p-2 rounded-lg">
                ⚡ Changes are saved to masterlist.json first, then synced to the database.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Icons
function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
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

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function MetadataIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
      <path d="M3 12h12" />
      <path d="M3 6h12" />
      <path d="M3 18h12" />
      <circle cx="3" cy="6" r="1" fill="currentColor" />
      <circle cx="3" cy="12" r="1" fill="currentColor" />
      <circle cx="3" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}
