import { lazy } from "react";
import {
  Code,
  Search,
  Tag,
  Image,
  SlidersHorizontal,
  Type,
  FileText,
  Eye,
  Palette,
  Braces,
  LayoutTemplate,
  FileDiff,
  TextCursorInput,
  QrCode,
  Hash,
  ClipboardList,
  ListChecks,
  CaseSensitive,
  Monitor,
} from "lucide-react";

import HomePage from "@/Home";
import SearchEngine from "@/pages/SearchEngine";
const LiveHtml = lazy(() => import("@/pages/LiveHtml"));
import LiveReact from "@/pages/LiveReact";
const MetaTagsGenrator = lazy(() => import("@/pages/MetaTagsGenrator"));
const ImgPlaceholderGen = lazy(() => import("@/pages/ImgPlaceholderGen"));
const SQIPPreviewer = lazy(() => import("@/pages/SQIPPreviewer"));
const TypescriptPlayground = lazy(() => import("@/pages/TypescriptPlayground"));
const GrapesJSEditor = lazy(() => import("@/pages/GrapesJSEditor"));
const LoremIpsumGenerator = lazy(() => import("@/pages/LoremIpsumGenrator"));
import ScreenSize from "@/pages/ScreenSize";
import UnitConverter from "@/pages/UnitConverter";
const MarkdownEditor = lazy(() => import("@/pages/MarkdownEditor"));
const DiffViewer = lazy(() => import("@/pages/DiffViewer"));
import CharacterAndWordCounter from "@/pages/CharacterAndWordCounter";
const ColorConverter = lazy(() => import("@/pages/ColorConverter"));
const AutoprefixerTool = lazy(() => import("@/pages/AutoPrefixer"));
import StringConverter from "@/pages/StringConverter";
const QrCodeGenerator = lazy(() => import("@/pages/QRCodeGenrator"));
const HashGenerator = lazy(() => import("@/pages/HashGenerator"));
const ImageMetadataViewer = lazy(() => import("@/pages/ImageMetadataViewer"));
const TextStylingTool = lazy(() => import("@/pages/CssTextStyling"));
import Websites from "@/pages/Websites";
// import Test from "@/pages/testing/Test"; // Testing purpose
import NoPage from "@/pages/NoPage";

const size5 = "size-5";

const formatToolName = (slug) => {
  const words = slug
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  return {
    pascalCase: words.join(""), // LiveHtml
    titleCase: words.join(" "), // Live Html
  };
};

const routes = [
  {
    path: "/",
    element: <HomePage />,
    index: true,
  },
  {
    path: "live-html",
    element: <LiveHtml />,
    isLazy: true,
    description:
      "Real-time HTML and SVG editor with instant side-by-side preview. Great for testing or tweaking SVGs live.",
    category: "Editor",
    icon: <Code className={size5} />,
    isPopular: true,
  },
  {
    path: "live-react",
    element: <LiveReact />,
    description:
      "Interactive React playground with live JSX preview. Great for testing components in-browser.",
    category: "Editor",
    icon: <Braces className={size5} />,
  },
  {
    path: "markdown-editor",
    element: <MarkdownEditor />,
    isLazy: true,
    description:
      "Live Markdown editor with GitHub-style preview. Perfect for editing README.md without switching tabs.",
    category: "Editor",
    icon: <FileText className={size5} />,
    isPopular: true,
  },

  {
    path: "search-engines",
    element: <SearchEngine />,
    description:
      "Dev-focused search interface. Skip the step of Googling a search engine—just enter text, pick an engine, go. Also includes code snippet support like CodePen.",
    category: "SEO",
    icon: <Search className={size5} />,
  },
  {
    path: "meta-tags-generator",
    element: <MetaTagsGenrator />,
    isLazy: true,
    description:
      "Generate SEO meta tags with support for social previews like Twitter Cards and Open Graph.",
    category: "SEO",
    icon: <Tag className={size5} />,
  },
  {
    path: "image-placeholder-generator",
    element: <ImgPlaceholderGen />,
    isLazy: true,
    description:
      "Create BlurHash and LQIP image placeholders to speed up UI loads with minimal effort.",
    category: "Image",
    icon: <Image className={size5} />,
  },
  {
    path: "sqip-lqip-previewer",
    element: <SQIPPreviewer />,
    isLazy: true,
    description:
      "Preview SVG-based SQIP and LQIP placeholders. Optimize loading performance with visual feedback.",
    category: "Image",
    icon: <SlidersHorizontal className={size5} />,
  },
  {
    path: "typescript-playground",
    element: <TypescriptPlayground />,
    isLazy: true,
    fallbackText: "Downloading TypeScript...",
    description:
      "Real-time TypeScript editor. Write, test, and debug TypeScript code directly in the browser.",
    category: "Editor",
    icon: <Type className={size5} />,
  },
  {
    path: "grapesjs-editor",
    element: <GrapesJSEditor />,
    isLazy: true,
    description:
      "Drag-and-drop page builder powered by GrapesJS. Customize components visually without code.",
    category: "Builder",
    icon: <LayoutTemplate className={size5} />,
  },
  {
    path: "diff-viewer",
    element: <DiffViewer />,
    isLazy: true,
    description:
      "Side-by-side diff tool. Compare and visualize text/code differences instantly.",
    category: "Utility",
    icon: <FileDiff className={size5} />,
    isPopular: true,
  },
  {
    path: "browser-ready-css",
    element: <AutoprefixerTool />,
    isLazy: true,
    description:
      "Add necessary vendor prefixes to your CSS. Make it browser-ready with one click.",
    category: "CSS",
    icon: <ClipboardList className={size5} />,
  },

  {
    path: "character-and-word-counter",
    element: <CharacterAndWordCounter />,
    description:
      "Real-time counter for characters, words, paragraphs, and custom delimiters. Minimal and fast.",
    category: "Utility",
    icon: <TextCursorInput className={size5} />,
  },
  {
    path: "lorem-ipsum-generator",
    element: <LoremIpsumGenerator />,
    isLazy: true,
    description:
      "Generate Lorem Ipsum text for mockups, wireframes, and content placeholders instantly.",
    category: "Content",
    icon: <FileText className={size5} />,
  },
  {
    path: "image-metadata-viewer",
    element: <ImageMetadataViewer />,
    isLazy: true,
    description:
      "Inspect EXIF metadata from images: camera, GPS, timestamps, device info, and more.",
    category: "Image",
    icon: <Eye className={size5} />,
  },
  {
    path: "string-converter",
    element: <StringConverter />,
    description:
      "Convert strings into camelCase, PascalCase, kebab-case, snake_case, and more.",
    category: "Utility",
    icon: <Type className={size5} />,
  },
  {
    path: "qr-code-generator",
    element: <QrCodeGenerator />,
    isLazy: true,
    description: "Generate QR codes from input strings. Download-ready. ",
    category: "Generator",
    icon: <QrCode className={size5} />,
  },
  {
    path: "hash-generator",
    element: <HashGenerator />,
    isLazy: true,
    description:
      "Generate hashes (MD5, SHA1, SHA224, SHA256, SHA384, SHA512, keccak256) from input string.",
    category: "Security",
    icon: <Hash className={size5} />,
  },
  {
    path: "color-converter",
    element: <ColorConverter />,
    isLazy: true,
    description:
      "Convert between HEX, RGB, RGBA, and HSL color formats with real-time preview.",
    category: "Color",
    icon: <Palette className={size5} />,
  },
  {
    isNew: true,
    path: "screen-size",
    element: <ScreenSize />,
    description:
      "Check your device screen width, height, and viewport dimensions in real time.",
    category: "Utility",
    icon: <Monitor className={size5} />,
  },
  {
    path: "css-unit-converter",
    element: <UnitConverter />,
    description:
      "Convert between CSS units like px, em and Tailwind equivalents.",
    category: "Utility",
    icon: <SlidersHorizontal className={size5} />,
  },
  {
    isNew: true,
    path: "css-text-styling",
    element: <TextStylingTool />,
    isLazy: true,
    description:
      "Interactive text style playground for tweaking fonts, gradients, shadows, strokes, and advanced CSS properties. Copy-ready output.",
    category: "css",
    icon: <CaseSensitive className={size5} />,
  },
  /* 
  { // Testing purpose
    path: "test",
    element: <Test />,
    description:
      "Interactive text style playground for tweaking fonts, gradients, shadows, strokes, and advanced CSS properties. Copy-ready output.",
    category: "null",
    icon: <CaseSensitive className={size5} />,
  }, 
  */
  {
    path: "websites",
    element: <Websites />,
    description:
      "Handpicked dev tools, sites, and resources. Bookmark-worthy stuff for web developers.",
    category: "Directory",
    icon: <ListChecks className={size5} />,
    isPopular: true,
  },
  {
    path: "*",
    element: <NoPage />,
  },
];

const customSlice = (startIdx, endIdx) =>
  routes
    .slice(startIdx, endIdx)
    .map(({ path }) => (path === "/" ? path : "/" + path));

const paths = customSlice(1, -1);
const mobileResponsivePaths = customSlice(0, 4).concat(customSlice(12, -1));

export { formatToolName, routes, paths, mobileResponsivePaths };
