// Feature flags for controlling Day 8 bonus features
export const FEATURE_FLAGS = {
  // Day 8 bonus features - default to false if not set
  ENABLE_DAY8_BONUS_FEATURES: import.meta.env.VITE_ENABLE_DAY8_BONUS_FEATURES === 'true',
  
  // Individual bonus features (only active if main flag is true)
  ENABLE_SEARCH: import.meta.env.VITE_ENABLE_DAY8_BONUS_FEATURES === 'true',
  ENABLE_PRICE_RANGE: import.meta.env.VITE_ENABLE_DAY8_BONUS_FEATURES === 'true',
  ENABLE_SORTING: import.meta.env.VITE_ENABLE_DAY8_BONUS_FEATURES === 'true',
  ENABLE_RATING_SORT: import.meta.env.VITE_ENABLE_DAY8_BONUS_FEATURES === 'true',
  ENABLE_MOCK_ERROR_TOGGLE: import.meta.env.VITE_ENABLE_DAY8_BONUS_FEATURES === 'true',
  ENABLE_MOBILE_FILTER_TOGGLE: import.meta.env.VITE_ENABLE_DAY8_BONUS_FEATURES === 'true',
} as const;

// Helper function to check if bonus features are enabled
export const isBonusFeaturesEnabled = () => FEATURE_FLAGS.ENABLE_DAY8_BONUS_FEATURES;

// Helper function to check individual features
export const isFeatureEnabled = (feature: keyof typeof FEATURE_FLAGS) => FEATURE_FLAGS[feature];
