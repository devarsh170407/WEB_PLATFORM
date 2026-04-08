export const PLATFORM_FEE_PERCENT = 30;

export const CATEGORIES = [
  { label: "HTML Template", value: "HTML_TEMPLATE" },
  { label: "React", value: "REACT" },
  { label: "Next.js", value: "NEXTJS" },
  { label: "WordPress", value: "WORDPRESS" },
  { label: "Vue", value: "VUE" },
  { label: "Angular", value: "ANGULAR" },
  { label: "UI Kit", value: "UI_KIT" },
  { label: "Landing Page", value: "LANDING_PAGE" },
  { label: "E-commerce", value: "ECOMMERCE" },
  { label: "Admin Dashboard", value: "ADMIN_DASHBOARD" },
  { label: "Other", value: "OTHER" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
