/**
 * Calculates a recency score with configurable parameters
 *
 * @param {number} accessCount - Total number of accesses
 * @param {number} lastAccessed - Timestamp of last access (ms)
 * @param {Object} options - Configuration options
 * @returns {number} Score between 0-100
 */
function calculateRecencyScore(
  accessCount: number,
  lastAccessed: number,
  options = {}
) {
  // Default configuration (can be overridden)
  const config = {
    baseScore: 100,
    halfLifeHours: 168, // 7 days (was 72)
    timeWeight: 0.6, // Weight for recency (was 0.7)
    frequencyWeight: 0.4, // Weight for frequency (was 0.3)
    frequencyDamping: 4, // Divisor for frequency boost (was 3)
    decayFloor: 0.1, // Minimum decay value (10%)
    decayCurve: "exponential", // 'exponential', 'polynomial', or 'hybrid'
    ...options,
  };

  const now = Date.now();
  const hoursSinceAccess = (now - lastAccessed) / (1000 * 60 * 60);

  // Calculate time decay based on selected curve
  let timeDecay;
  switch (config.decayCurve) {
    case "polynomial":
      // Gentler initial decay, steeper later
      timeDecay =
        1 / (1 + Math.pow(hoursSinceAccess / config.halfLifeHours, 2));
      break;

    case "hybrid":
      // Exponential with a floor to prevent complete decay
      timeDecay = Math.max(
        config.decayFloor,
        Math.exp(-hoursSinceAccess / config.halfLifeHours)
      );
      break;

    case "exponential":
    default:
      timeDecay = Math.exp(-hoursSinceAccess / config.halfLifeHours);
  }

  // Logarithmic frequency boost (prevents domination by frequent accesses)
  const frequencyBoost = Math.log10(accessCount + 1);

  // Combine components with configurable weights
  const rawScore =
    config.baseScore *
    (config.timeWeight * timeDecay +
      config.frequencyWeight * (frequencyBoost / config.frequencyDamping));

  // Normalize to 0-100 scale
  return Math.min(100, Math.max(0, rawScore));
}

// ============================================
// Example Usage & Presets
// ============================================

// Preset: Aggressive decay (original behavior)
const aggressiveConfig = {
  halfLifeHours: 72,
  timeWeight: 0.7,
  frequencyWeight: 0.3,
  decayCurve: "exponential",
};

// Preset: Balanced (recommended default)
const balancedConfig = {
  halfLifeHours: 168, // 7 days
  timeWeight: 0.6,
  frequencyWeight: 0.4,
  decayCurve: "hybrid",
  decayFloor: 0.15,
};

// Preset: Long-term memory
const longTermConfig = {
  halfLifeHours: 720, // 30 days
  timeWeight: 0.5,
  frequencyWeight: 0.5,
  decayCurve: "polynomial",
};

// Test different scenarios
function demonstrateScoring() {
  const scenarios = [
    { name: "Just accessed", accessCount: 5, hoursAgo: 0 },
    { name: "1 day ago", accessCount: 5, hoursAgo: 24 },
    { name: "3 days ago", accessCount: 5, hoursAgo: 72 },
    { name: "1 week ago", accessCount: 5, hoursAgo: 168 },
    { name: "2 weeks ago", accessCount: 5, hoursAgo: 336 },
    { name: "High frequency, old", accessCount: 50, hoursAgo: 336 },
    { name: "Low frequency, recent", accessCount: 2, hoursAgo: 24 },
  ];

  console.log("=".repeat(80));
  console.log("RECENCY SCORE COMPARISON");
  console.log("=".repeat(80));

  scenarios.forEach((scenario) => {
    const lastAccessed = Date.now() - scenario.hoursAgo * 60 * 60 * 1000;

    const aggressive = calculateRecencyScore(
      scenario.accessCount,
      lastAccessed,
      aggressiveConfig
    );

    const balanced = calculateRecencyScore(
      scenario.accessCount,
      lastAccessed,
      balancedConfig
    );

    const longTerm = calculateRecencyScore(
      scenario.accessCount,
      lastAccessed,
      longTermConfig
    );

    console.log(`\n${scenario.name} (${scenario.accessCount} accesses):`);
    console.log(`  Aggressive: ${aggressive.toFixed(1)}`);
    console.log(`  Balanced:   ${balanced.toFixed(1)}`);
    console.log(`  Long-term:  ${longTerm.toFixed(1)}`);
  });
}

// Run demonstration
demonstrateScoring();
