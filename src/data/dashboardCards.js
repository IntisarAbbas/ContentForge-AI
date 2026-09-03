import {
  HiChatBubbleLeftRight,
  HiSparkles,
  HiGlobeAlt,
  HiDocumentText,
  HiCodeBracket,
} from "react-icons/hi2";

export const dashboardCards = [
  {
    id: 1,
    title: "Social Media",
    description: "Generate captions, hashtags and posts.",
    icon: HiChatBubbleLeftRight,
    path: "/tools/social-media",
  },

  {
    id: 2,
    title: "Fashion Ideas",
    description: "Get AI outfit and styling ideas.",
    icon: HiSparkles,
    path: "/tools/fashion-ideas",
  },

  {
    id: 3,
    title: "Website Design",
    description: "Generate modern UI/UX ideas.",
    icon: HiGlobeAlt,
    path: "/tools/website-design",
  },

  {
    id: 4,
    title: "Blog Writer",
    description: "Write SEO friendly blog posts.",
    icon: HiDocumentText,
    path: "/tools/blog-writer",
  },

  {
  id: 5,
  title: "Image Generator",
  description: "Create stunning AI images from text prompts.",
  icon: HiSparkles,
  path: "/image-generator",
},

{
  id: 6,
  title: "Code Generator",
  description: "Generate production-ready code with AI.",
  icon: HiCodeBracket,
  path: "/tools/code-generator"
}
];