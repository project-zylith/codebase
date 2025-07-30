const colorPalette = {
  primary: "#18111B", // Deep black background
  secondary: "#5B21B6", // Dark purple for cards/containers
  tertiary: "#F8F8FF", // Off-white for text
  quaternary: "#7C3AED", // Main purple for buttons/accents
  quinary: "#C4B5FD", // Light purple for subtle text
  accent: "#A21CAF", // Neon purple for highlights
  background: "#18111B", // Main background (same as primary)
  card: "#23182A", // Card background (darker than secondary)
  border: "#7C3AED", // Border accent (same as quaternary)
  button: "#7C3AED", // Button background (same as quaternary)
  buttonText: "#F8F8FF", // Button text (same as tertiary)
};

const colorPalette2 = {
  primary: "#E8D5E8", // Soft lavender background
  secondary: "#A8C8E8", // Soft blue for cards/containers
  tertiary: "#2D3748", // Deep blue-gray for text
  quaternary: "#FF6B9D", // Coral pink for buttons/accents
  quinary: "#4A90A4", // Muted teal for subtle text
  accent: "#FF8FA3", // Bright coral for highlights
  background: "#F0E6F0", // Light lavender background
  card: "#B8D4F0", // Light blue card background
  border: "#FF6B9D", // Coral border accent
  button: "#FF6B9D", // Coral button background
  buttonText: "#FFFFFF", // White button text
};

const colorPalette3 = {
  primary: "#1A2332", // Deep night sky blue
  secondary: "#2D3E50", // Darker blue-gray for cards/containers
  tertiary: "#F4E4C1", // Warm cream for text (like moonlight)
  quaternary: "#C4A484", // Sandy beige for buttons/accents
  quinary: "#8FA0B3", // Soft gray-blue for subtle text (cloud highlights)
  accent: "#E6D7B8", // Warm cream accent (bright moon areas)
  background: "#0F1419", // Very dark night background
  card: "#34495E", // Medium blue-gray card background
  border: "#C4A484", // Sandy border accent
  button: "#C4A484", // Sandy button background
  buttonText: "#1A2332", // Dark text on sandy buttons
};

// const colorPalette5 = {
//   primary: "#2C3E50", // Deep space blue-gray
//   secondary: "#34495E", // Medium blue-gray for cards/containers
//   tertiary: "#F5E6D3", // Warm cream for text (like planet surfaces)
//   quaternary: "#E67E22", // Warm orange for buttons/accents (Saturn rings)
//   quinary: "#95A5A6", // Soft gray for subtle text (distant planets)
//   accent: "#F39C12", // Bright orange accent (star glow)
//   background: "#1A252F", // Very dark space background
//   card: "#3A4A5C", // Card background with space depth
//   border: "#E67E22", // Orange border accent
//   button: "#E67E22", // Orange button background
//   buttonText: "#F5E6D3", // Cream text on orange buttons
// };

// const colorPalette4 = {
//   primary: "#1B4332", // Deep forest green
//   secondary: "#2D5A3D", // Medium forest green for cards/containers
//   tertiary: "#F1F8E9", // Very light green-white for text
//   quaternary: "#66BB6A", // Fresh green for buttons/accents
//   quinary: "#A5D6A7", // Light green for subtle text
//   accent: "#4CAF50", // Bright green accent
//   background: "#0F2419", // Very dark forest background
//   card: "#2E7D32", // Medium green card background
//   border: "#66BB6A", // Green border accent
//   button: "#66BB6A", // Green button background
//   buttonText: "#F1F8E9", // Light text on green buttons
// };

const colorPalette4 = {
  primary: "#1A3A32", // Deep mint green
  secondary: "#2D5A4F", // Medium mint green for cards/containers
  tertiary: "#F0FDF4", // Very light mint-white for text
  quaternary: "#10B981", // Fresh mint for buttons/accents
  quinary: "#6EE7B7", // Light mint for subtle text
  accent: "#34D399", // Bright mint accent
  background: "#0F2F26", // Very dark mint background
  card: "#1E4A3F", // Medium mint card background
  border: "#10B981", // Mint border accent
  button: "#10B981", // Mint button background
  buttonText: "#F0FDF4", // Light text on mint buttons
};

const colorPalette5 = {
  primary: "#FFFFFF", // Pure white
  secondary: "#F8F9FA", // Light gray for cards/containers
  tertiary: "#212529", // Dark gray/black for text
  quaternary: "#343A40", // Dark gray for buttons/accents
  quinary: "#6C757D", // Medium gray for subtle text
  accent: "#000000", // Pure black accent
  background: "#FFFFFF", // White background
  card: "#F1F3F4", // Very light gray card background
  border: "#343A40", // Dark gray border accent
  button: "#343A40", // Dark gray button background
  buttonText: "#FFFFFF", // White text on dark buttons
};

const colorPalette6 = {
  primary: "#1F2937", // Deep slate gray
  secondary: "#374151", // Medium slate for cards/containers
  tertiary: "#F9FAFB", // Off-white for text
  quaternary: "#F59E0B", // Warm amber for buttons/accents
  quinary: "#9CA3AF", // Light gray for subtle text
  accent: "#FBBF24", // Bright amber accent
  background: "#111827", // Very dark slate background
  card: "#4B5563", // Medium gray card background
  border: "#F59E0B", // Amber border accent
  button: "#F59E0B", // Amber button background
  buttonText: "#1F2937", // Dark text on amber buttons
};

const colorPalette7 = {
  primary: "#2D1B69", // Deep royal purple
  secondary: "#4C1D95", // Medium purple for cards/containers
  tertiary: "#F3E8FF", // Light lavender for text
  quaternary: "#EC4899", // Hot pink for buttons/accents
  quinary: "#C084FC", // Light purple for subtle text
  accent: "#F472B6", // Bright pink accent
  background: "#1E1B4B", // Very dark purple background
  card: "#5B21B6", // Medium purple card background
  border: "#EC4899", // Pink border accent
  button: "#EC4899", // Pink button background
  buttonText: "#F3E8FF", // Light text on pink buttons
};

const colorPalette8 = {
  primary: "#0F172A", // Deep navy blue
  secondary: "#1E293B", // Medium navy for cards/containers
  tertiary: "#F1F5F9", // Light blue-gray for text
  quaternary: "#06B6D4", // Cyan for buttons/accents
  quinary: "#94A3B8", // Light blue-gray for subtle text
  accent: "#22D3EE", // Bright cyan accent
  background: "#020617", // Very dark navy background
  card: "#334155", // Medium blue-gray card background
  border: "#06B6D4", // Cyan border accent
  button: "#06B6D4", // Cyan button background
  buttonText: "#0F172A", // Dark text on cyan buttons
};

const colorPalette9 = {
  primary: "#451A03", // Deep terracotta
  secondary: "#7C2D12", // Medium terracotta for cards/containers
  tertiary: "#FEF3C7", // Light cream for text
  quaternary: "#DC2626", // Red for buttons/accents
  quinary: "#FCA5A5", // Light red for subtle text
  accent: "#EF4444", // Bright red accent
  background: "#2D0A02", // Very dark terracotta background
  card: "#991B1B", // Medium red card background
  border: "#DC2626", // Red border accent
  button: "#DC2626", // Red button background
  buttonText: "#FEF3C7", // Light text on red buttons
};

const colorPalette10 = {
  primary: "#064E3B", // Deep emerald
  secondary: "#065F46", // Medium emerald for cards/containers
  tertiary: "#ECFDF5", // Light green-white for text
  quaternary: "#059669", // Emerald green for buttons/accents
  quinary: "#6EE7B7", // Light emerald for subtle text
  accent: "#10B981", // Bright emerald accent
  background: "#022C22", // Very dark emerald background
  card: "#047857", // Medium emerald card background
  border: "#059669", // Emerald border accent
  button: "#059669", // Emerald button background
  buttonText: "#ECFDF5", // Light text on emerald buttons
};

const nebula = {
  primary: "#0A0A1A", // Deep space black (main background)
  secondary: "#1A0A2A", // Dark cosmic purple for cards/containers
  tertiary: "#FFFFFF", // Pure white for text
  quaternary: "#FF6B9D", // Vibrant pink for buttons/accents
  quinary: "#00D4FF", // Electric cyan for subtle text
  accent: "#FFFFF0", // Ivory for highlights
  background: "#050510", // Very dark nebula background
  card: "#150A25", // Dark cosmic card background
  border: "#FF6B9D", // Pink border accent
  button: "#FF6B9D", // Pink button background
  buttonText: "#FFFFFF", // White text on pink buttons
};

// It would be cool to have a color palette that is random. Which I can achieve by making a number of different palettes and then randomly selecting one.
// Creating each how I have the first one and putting them in an array would work.

export default colorPalette;
export {
  colorPalette2,
  colorPalette3,
  colorPalette4,
  colorPalette5,
  colorPalette6,
  colorPalette7,
  colorPalette8,
  colorPalette9,
  colorPalette10,
  nebula,
};
