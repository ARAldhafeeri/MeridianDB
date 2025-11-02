export const THEME = {
  token: {
    // Base Colors
    colorPrimary: "#ff6b00",
    colorSuccess: "#ff6b00",
    colorWarning: "#ff6b00",
    colorError: "#ff4d4f",
    colorInfo: "#ff6b00",
    colorBgContainer: "#ffffff",
    colorBgLayout: "#000000",
    colorText: "#000000",
    colorTextSecondary: "#595959",
    colorBorder: "#d9d9d9",
    fontSize: 16,
    borderRadius: 8,
    // Text Colors
    colorTextBase: "#222831", // Default text color
    colorTextTertiary: "#8c8c8c", // Tertiary text color
    colorTextPlaceholder: "#bfbfbf",

    // Background Colors
    colorBgBase: "#fff", // Base background color
    colorBgElevated: "#f5f5f5", // Elevated component background

    // Border Colors
    colorBorderSecondary: "#f0f0f0", // Secondary border

    // Font Settings
    fontFamily: "'Robot', Arial, sans-serif",

    // Heading Sizes

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
