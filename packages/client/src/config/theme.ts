export const THEME = {
  token: {
    // Base Colors - Professional Blue
    colorPrimary: "#2563eb", // Vibrant blue
    colorSecondary: "#7c3aed", // Purple accent
    colorSuccess: "#059669", // Emerald green
    colorWarning: "#d97706", // Amber
    colorError: "#dc2626", // Red
    colorInfo: "#0369a1", // Sky blue

    // Text Colors
    colorTextBase: "#1e293b",
    colorTextSecondary: "#475569",
    colorTextTertiary: "#94a3b8",
    colorTextPlaceholder: "#cbd5e1",

    // Background Colors
    colorBgBase: "#ffffff",
    colorBgContainer: "#f8fafc",
    colorBgElevated: "#ffffff",
    colorBgLayout: "#f1f5f9",
    // Border Colors
    colorBorder: "#222831", // Default border color
    colorBorderSecondary: "#f0f0f0", // Secondary border

    // Font Settings
    fontFamily: "'Robot', Arial, sans-serif",
    fontSize: 14, // Base font size

    // Heading Sizes
    fontSizeHeading1: 2.12,
    fontSizeHeading2: 1.875,
    fontSizeHeading3: 1.5,
    fontSizeHeading4: 1.25,
    fontSizeHeading5: 1,

    // Font Weights
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightStrong: 600,

    // Spacing and Sizing
    marginXS: 8,
    marginSM: 12,
    margin: 16,
    marginMD: 20,
    marginLG: 24,
    marginXL: 32,

    paddingXS: 8,
    paddingSM: 12,
    padding: 16,
    paddingMD: 20,
    paddingLG: 24,
    paddingXL: 32,

    // Border Radius
    borderRadius: 6,
    borderRadiusSM: 4,
    borderRadiusLG: 8,
    borderRadiusXL: 12,

    // Shadows
    boxShadow:
      "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
    boxShadowSecondary:
      "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",

    // Animation
    motionDurationSlow: "0.3s",
    motionDurationMid: "0.2s",
    motionDurationFast: "0.1s",

    // Component Specific
    controlHeight: 32, // Default height of controls
    controlHeightSM: 24, // Small height of controls
    controlHeightLG: 40, // Large height of controls

    // Z-Index
    zIndexBase: 0,
    zIndexPopupBase: 1000,
    zIndexPopover: 1030,
    zIndexModal: 1000,
    zIndexDrawer: 1000,
  },
  components: {
    Button: {
      colorPrimary: "#222831",
      algorithm: true, // Enable algorithm
      borderRadius: 11,
      controlHeight: 36,
    },
    Menu: {
      colorItemBgSelected: "#e6f7ef",
      colorItemTextSelected: "#222831",
    },
    Card: {
      colorBgContainer: "#ffffff",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: 8,
    },
    Table: {
      colorBgContainer: "#ffffff",
      headerBg: "#f5f5f5",
    },
    Input: {
      colorBgContainer: "#ffffff",
      borderRadius: 4,
    },
    Select: {
      colorBgContainer: "#ffffff",
      borderRadius: 4,
    },
    Modal: {
      borderRadius: 8,
    },
    Tabs: {
      inkBarColor: "#A1D6B2",
    },
  },
};
