"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface ImageData {
  id: number;
  file_name: string;
  folder_name: string;
  title: string;
  body_text: string;
  image_type: string;
  categories: string[];
  framework_concepts: string[];
  tags: string[];
  image_url: string;
}

interface TaxonomyIndex {
  by_category: Record<string, number[]>;
  by_framework_concept: Record<string, number[]>;
}

type SortOption = "relevant" | "alphabetical" | "type" | "category";

const IMAGE_TYPES = ["problem", "solution", "comparison", "explanation"];

// Type priority for relevance sorting (lower = higher priority)
const TYPE_PRIORITY: Record<string, number> = {
  problem: 0,
  comparison: 1,
  explanation: 2,
  solution: 3,
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
  tagFrequencies: Record<string, number>
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
      if (img.categories.includes(cat)) {
        score += 1;
      }
    }

    // 6. Framework concept match bonus
    for (const concept of mapping.concepts) {
      if (img.framework_concepts.includes(concept)) {
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
      ) || mapping.categories.some(cat => img.categories.includes(cat))
        || mapping.concepts.some(c => img.framework_concepts.includes(c));
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

const QUICK_TAGS = [
  // Feelings first
  "ANXIETY", "LONELINESS", "DEPRESSION", "BURNOUT", "SOCIAL ANXIETY", "EMPTINESS",
  "SHAME", "OVERWHELM", "GRIEF", "REJECTION",
  // Core framework concepts
  "OPEN LOOPS", "PROXY", "DUNBAR", "COMPARISON", "SURVIVAL",
  // Life topics
  "WORK", "LOVE", "SCREENS", "DATING", "FAMILY", "MONEY", "FOOD", "SLEEP", "SEX", "STATUS",
  "BELONGING", "TRUST", "SCROLLING", "NEWS", "HUSTLE", "NOTIFICATIONS", "ADDICTION",
  "STRANGERS", "VALIDATION", "ISOLATION", "PARENTING", "MARRIAGE", "FRIENDSHIP",
  "AGING", "DEATH", "FITNESS", "BODY IMAGE",
  // Solutions
  "TRIBE", "NATURE", "COMMUNITY", "RITUAL", "TRADITION", "PURPOSE", "MEANING"
];

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
  }
};

// Check if an image matches a quick tag
function imageMatchesQuickTag(img: ImageData, tagName: string): boolean {
  const mapping = TAG_MAPPINGS[tagName];
  if (!mapping) return false;

  // Check if any of the image's tags match
  const imgTagsLower = img.tags.map(t => t.toLowerCase());
  for (const tag of mapping.tags) {
    if (imgTagsLower.some(t => t.includes(tag.toLowerCase()))) {
      return true;
    }
  }

  // Check if any of the image's categories match
  for (const cat of mapping.categories) {
    if (img.categories.includes(cat)) {
      return true;
    }
  }

  // Check if any of the image's concepts match
  for (const concept of mapping.concepts) {
    if (img.framework_concepts.includes(concept)) {
      return true;
    }
  }

  return false;
}

export default function LibraryPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="spinner" />
          <p className="mt-4 text-[var(--text-secondary)]">Loading library...</p>
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

  // UI state
  const [sortBy, setSortBy] = useState<SortOption>("relevant");
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["types"]));
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [toast, setToast] = useState("");
  const [displayCount, setDisplayCount] = useState(30);

  // DEV ONLY: Edit state
  const [editingImage, setEditingImage] = useState<ImageData | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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

    // Filter by tags
    if (selectedTags.size > 0) {
      result = result.filter(img =>
        Array.from(selectedTags).every(tag => img.tags.includes(tag))
      );
    }

    // Filter by quick tags (AND logic - image must match ALL selected quick tags)
    if (selectedQuickTags.size > 0) {
      result = result.filter(img =>
        Array.from(selectedQuickTags).every(tagName => imageMatchesQuickTag(img, tagName))
      );
    }

    // Sort
    switch (sortBy) {
      case "relevant":
        if (selectedQuickTags.size > 0) {
          // Tag-specific relevance scoring when quick tags are selected
          result = [...result].sort((a, b) => {
            // Primary: tag-specific relevance score (descending)
            const tagScoreA = calculateTagRelevance(a, selectedQuickTags, TAG_MAPPINGS, tagFrequencyMap);
            const tagScoreB = calculateTagRelevance(b, selectedQuickTags, TAG_MAPPINGS, tagFrequencyMap);
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

  const displayedImages = filteredImages.slice(0, displayCount);

  // Sidebar content (shared between desktop and mobile)
  const FilterContent = () => (
    <div className="space-y-4">
      {/* Image Types */}
      <div className="border-b border-[var(--border-color)] pb-4">
        <button
          className="w-full flex items-center justify-between py-2 text-sm font-bold tracking-wide"
          onClick={() => toggleSection("types")}
        >
          <span>Image Type</span>
          <span>{expandedSections.has("types") ? "−" : "+"}</span>
        </button>
        {expandedSections.has("types") && (
          <div className="space-y-2 mt-2">
            {IMAGE_TYPES.map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.has(type)}
                  onChange={() => toggleType(type)}
                  className="accent-[var(--accent-primary)]"
                />
                <span className="text-sm capitalize">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Filters (collapsed by default) */}
      <div className="pb-4">
        <button
          className="w-full flex items-center justify-between py-2 text-xs font-medium tracking-wide text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <span>ADVANCED FILTERS</span>
          <span>{showAdvancedFilters ? "−" : "+"}</span>
        </button>

        {showAdvancedFilters && (
          <div className="mt-3 space-y-4 pl-2 border-l-2 border-[var(--border-color)]">
            {/* Categories */}
            <div>
              <button
                className="w-full flex items-center justify-between py-1 text-sm font-bold tracking-wide"
                onClick={() => toggleSection("categories")}
              >
                <span>Categories</span>
                <span>{expandedSections.has("categories") ? "−" : "+"}</span>
              </button>
              {expandedSections.has("categories") && taxonomy && (
                <div className="space-y-1 mt-2 max-h-48 overflow-y-auto">
                  {Object.keys(taxonomy.by_category).sort().map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="accent-[var(--accent-primary)]"
                      />
                      <span className="text-sm flex-1">{formatLabel(cat)}</span>
                      <span className="text-xs text-[var(--text-muted)]">{categoryCounts[cat]}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Framework Concepts */}
            <div>
              <button
                className="w-full flex items-center justify-between py-1 text-sm font-bold tracking-wide"
                onClick={() => toggleSection("concepts")}
              >
                <span>Framework Concepts</span>
                <span>{expandedSections.has("concepts") ? "−" : "+"}</span>
              </button>
              {expandedSections.has("concepts") && taxonomy && (
                <div className="space-y-1 mt-2 max-h-48 overflow-y-auto">
                  {Object.keys(taxonomy.by_framework_concept).sort().map(concept => (
                    <label key={concept} className="flex items-center gap-2 cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={selectedConcepts.has(concept)}
                        onChange={() => toggleConcept(concept)}
                        className="accent-[var(--accent-primary)]"
                      />
                      <span className="text-sm flex-1">{formatLabel(concept)}</span>
                      <span className="text-xs text-[var(--text-muted)]">{conceptCounts[concept]}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <button
                className="w-full flex items-center justify-between py-1 text-sm font-bold tracking-wide"
                onClick={() => toggleSection("tags")}
              >
                <span>Tags</span>
                <span>{expandedSections.has("tags") ? "−" : "+"}</span>
              </button>
              {expandedSections.has("tags") && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Search tags..."
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded text-sm mb-2"
                  />
                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                    {filteredTags.map(([tag, count]) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          selectedTags.has(tag)
                            ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                            : "bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)]"
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
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="spinner" />
          <p className="mt-4 text-[var(--text-secondary)]">Loading library...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--error)]">{error}</p>
          <Link href="/" className="btn-primary mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <HomeIcon />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold tracking-[0.15em]">
              <span className="text-[var(--accent-primary)]">DEMISMATCH</span> IMAGE LIBRARY
            </h1>
          </div>
          <button
            className="md:hidden btn-secondary py-2 px-3"
            onClick={() => setShowMobileFilters(true)}
          >
            <FilterIcon />
            <span className="ml-2">Filters</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
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
              className="w-full pl-12 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-xl overflow-hidden">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left hover:bg-[var(--bg-tertiary)] flex items-center gap-2"
                  onMouseDown={() => {
                    setSearchQuery(suggestion.text);
                    setShowSuggestions(false);
                  }}
                >
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    suggestion.type === "tag" ? "bg-gray-500/30 text-gray-400" :
                    suggestion.type === "category" ? "bg-blue-500/30 text-blue-400" :
                    "bg-[var(--accent-primary)]/30 text-[var(--accent-primary)]"
                  }`}>
                    {suggestion.type}
                  </span>
                  <span className="text-sm">{suggestion.text}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Filter Tags */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {QUICK_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleQuickTag(tag)}
                className={`quick-tag ${selectedQuickTags.has(tag) ? "quick-tag-active" : ""}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 border-r border-[var(--border-color)] p-4 overflow-y-auto">
          <FilterContent />
        </aside>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.8)]" onClick={() => setShowMobileFilters(false)}>
            <div
              className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-[var(--bg-primary)] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                <h2 className="font-bold">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)}>✕</button>
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
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {Array.from(selectedTypes).map(type => (
                <span key={type} className="filter-pill">
                  {type}
                  <button onClick={() => toggleType(type)} className="ml-1">✕</button>
                </span>
              ))}
              {Array.from(selectedCategories).map(cat => (
                <span key={cat} className="filter-pill">
                  {formatLabel(cat)}
                  <button onClick={() => toggleCategory(cat)} className="ml-1">✕</button>
                </span>
              ))}
              {Array.from(selectedConcepts).map(concept => (
                <span key={concept} className="filter-pill">
                  {formatLabel(concept)}
                  <button onClick={() => toggleConcept(concept)} className="ml-1">✕</button>
                </span>
              ))}
              {Array.from(selectedTags).map(tag => (
                <span key={tag} className="filter-pill">
                  #{tag}
                  <button onClick={() => toggleTag(tag)} className="ml-1">✕</button>
                </span>
              ))}
              {Array.from(selectedQuickTags).map(tag => (
                <span key={tag} className="filter-pill bg-[var(--accent-primary)] text-[var(--bg-primary)]">
                  {tag}
                  <button onClick={() => toggleQuickTag(tag)} className="ml-1">✕</button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-xs text-[var(--error)] hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Header */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[var(--text-secondary)]">
              Showing {displayedImages.length} of {filteredImages.length} images
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded text-sm"
            >
              <option value="relevant">Sort: Most Relevant</option>
              <option value="alphabetical">Sort: A-Z</option>
              <option value="type">Sort: Type</option>
              <option value="category">Sort: Category</option>
            </select>
          </div>

          {/* Image Grid */}
          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--text-muted)]">No images match your filters</p>
              <button onClick={clearAllFilters} className="btn-secondary mt-4">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative rounded-lg overflow-hidden cursor-pointer bg-[var(--bg-tertiary)]"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full aspect-square object-cover group-hover:opacity-80 transition-opacity"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-white text-xs line-clamp-2">{image.title}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded mt-1 inline-block ${
                          image.image_type === "problem" ? "bg-red-500/80" :
                          image.image_type === "solution" ? "bg-green-500/80" :
                          image.image_type === "comparison" ? "bg-blue-500/80" :
                          "bg-gray-500/80"
                        }`}>
                          {image.image_type}
                        </span>
                      </div>
                    </div>
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
                  <button onClick={loadMore} className="btn-secondary">
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
          className="modal-overlay"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="modal-content max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
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
              <h3 className="text-lg font-bold mb-2">{selectedImage.title}</h3>

              <span className={`text-xs px-2 py-1 rounded inline-block mb-3 ${
                selectedImage.image_type === "problem" ? "bg-red-500/20 text-red-400" :
                selectedImage.image_type === "solution" ? "bg-green-500/20 text-green-400" :
                selectedImage.image_type === "comparison" ? "bg-blue-500/20 text-blue-400" :
                "bg-gray-500/20 text-gray-400"
              }`}>
                {selectedImage.image_type}
              </span>

              {selectedImage.body_text && (
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  {selectedImage.body_text}
                </p>
              )}

              {selectedImage.categories.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Categories</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedImage.categories.map(cat => (
                      <span key={cat} className="text-xs bg-[var(--bg-tertiary)] px-2 py-1 rounded">
                        {formatLabel(cat)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedImage.framework_concepts.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Framework Concepts</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedImage.framework_concepts.map(concept => (
                      <span key={concept} className="text-xs bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] px-2 py-1 rounded">
                        {formatLabel(concept)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedImage.tags.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-[var(--text-muted)] uppercase mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedImage.tags.slice(0, 10).map(tag => (
                      <span key={tag} className="text-xs text-[var(--text-muted)]">
                        #{tag}
                      </span>
                    ))}
                    {selectedImage.tags.length > 10 && (
                      <span className="text-xs text-[var(--text-muted)]">
                        +{selectedImage.tags.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  className="btn-primary flex-1"
                  onClick={() => copyToClipboard(selectedImage.image_url)}
                >
                  <CopyIcon />
                  Copy
                </button>
                <button
                  className="btn-secondary flex-1"
                  onClick={() => downloadImage(selectedImage)}
                >
                  <DownloadIcon />
                  Download
                </button>
              </div>

              {/* DEV ONLY: Edit button */}
              <button
                className="w-full mt-3 py-2 px-4 bg-blue-600/20 border border-blue-600/50 text-blue-400 rounded hover:bg-blue-600/30 text-sm font-medium flex items-center justify-center gap-2"
                onClick={() => { setEditingImage(selectedImage); setEditPrompt(""); }}
              >
                <EditIcon /> Edit with AI (Dev Only)
              </button>

              {/* DEV ONLY: Delete button */}
              <button
                className="w-full mt-2 py-2 px-4 bg-red-600/20 border border-red-600/50 text-red-400 rounded hover:bg-red-600/30 text-sm font-medium flex items-center justify-center gap-2"
                onClick={() => deleteImage(selectedImage)}
              >
                <TrashIcon /> Delete Image (Dev Only)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* DEV ONLY: Edit Modal */}
      {editingImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => !isEditing && setEditingImage(null)}
        >
          <div
            className="bg-[var(--bg-secondary)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
              <h2 className="text-lg font-bold">Edit Image with AI</h2>
              <button
                onClick={() => !isEditing && setEditingImage(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                disabled={isEditing}
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="aspect-square w-full max-w-sm mx-auto rounded overflow-hidden bg-[var(--bg-tertiary)]">
                <img
                  src={editingImage.image_url}
                  alt={editingImage.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="text-sm text-[var(--text-secondary)] text-center">
                {editingImage.title}
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Describe your edit:
                </label>
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="e.g., 'fix the garbled text', 'change the font to bold', 'remove the person on the left', 'make it more vibrant'..."
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-blue-500 focus:outline-none min-h-[100px] resize-none"
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
                    className="px-3 py-1 text-xs bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)] rounded-full text-[var(--text-secondary)]"
                    disabled={isEditing}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingImage(null)}
                  className="flex-1 py-2 px-4 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded hover:bg-[var(--bg-primary)]"
                  disabled={isEditing}
                >
                  Cancel
                </button>
                <button
                  onClick={() => editImage(editingImage)}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

              <p className="text-xs text-[var(--text-muted)] text-center">
                ⚠️ This will replace the original image. Make sure you have a backup if needed.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Icons
function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

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
