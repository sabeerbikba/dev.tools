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
import Websites from "@/pages/Websites";
// import Test from "./pages/testing/Test" // Testing purpose
import NoPage from "@/pages/NoPage";

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
    icon: <Code className="w-5 h-5" />,
    isPopular: true,
  },
  {
    path: "live-react",
    element: <LiveReact />,
    description:
      "Interactive React playground with live JSX preview. Great for testing components in-browser.",
    category: "Editor",
    icon: <Braces className="w-5 h-5" />,
  },
  {
    path: "search-engines",
    element: <SearchEngine />,
    description:
      "Dev-focused search interface. Skip the step of Googling a search engine—just enter text, pick an engine, go. Also includes code snippet support like CodePen.",
    category: "SEO",
    icon: <Search className="w-5 h-5" />,
  },
  {
    path: "meta-tags-generator",
    element: <MetaTagsGenrator />,
    isLazy: true,
    description:
      "Generate SEO meta tags with support for social previews like Twitter Cards and Open Graph.",
    category: "SEO",
    icon: <Tag className="w-5 h-5" />,
  },
  {
    path: "image-placeholder-generator",
    element: <ImgPlaceholderGen />,
    isLazy: true,
    description:
      "Create BlurHash and LQIP image placeholders to speed up UI loads with minimal effort.",
    category: "Image",
    icon: <Image className="w-5 h-5" />,
  },
  {
    path: "sqip-lqip-previewer",
    element: <SQIPPreviewer />,
    isLazy: true,
    description:
      "Preview SVG-based SQIP and LQIP placeholders. Optimize loading performance with visual feedback.",
    category: "Image",
    icon: <SlidersHorizontal className="w-5 h-5" />,
  },
  {
    path: "typescript-playground",
    element: <TypescriptPlayground />,
    isLazy: true,
    fallbackText: "Downloading TypeScript...",
    description:
      "Real-time TypeScript editor. Write, test, and debug TypeScript code directly in the browser.",
    category: "Editor",
    icon: <Type className="w-5 h-5" />,
  },
  {
    path: "grapesjs-editor",
    element: <GrapesJSEditor />,
    isLazy: true,
    description:
      "Drag-and-drop page builder powered by GrapesJS. Customize components visually without code.",
    category: "Builder",
    icon: <LayoutTemplate className="w-5 h-5" />,
  },
  {
    path: "lorem-ipsum-generator",
    element: <LoremIpsumGenerator />,
    isLazy: true,
    description:
      "Generate Lorem Ipsum text for mockups, wireframes, and content placeholders instantly.",
    category: "Content",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    path: "css-unit-converter",
    element: <UnitConverter />,
    description:
      "Convert between CSS units like px, em and Tailwind equivalents.",
    category: "Utility",
    icon: <SlidersHorizontal className="w-5 h-5" />,
  },
  {
    path: "markdown-editor",
    element: <MarkdownEditor />,
    isLazy: true,
    description:
      "Live Markdown editor with GitHub-style preview. Perfect for editing README.md without switching tabs.",
    category: "Editor",
    icon: <FileText className="w-5 h-5" />,
    isPopular: true,
  },
  {
    path: "diff-viewer",
    element: <DiffViewer />,
    isLazy: true,
    description:
      "Side-by-side diff tool. Compare and visualize text/code differences instantly.",
    category: "Utility",
    icon: <FileDiff className="w-5 h-5" />,
    isPopular: true,
  },
  {
    path: "character-and-word-counter",
    element: <CharacterAndWordCounter />,
    description:
      "Real-time counter for characters, words, paragraphs, and custom delimiters. Minimal and fast.",
    category: "Utility",
    icon: <TextCursorInput className="w-5 h-5" />,
  },
  {
    path: "color-converter",
    element: <ColorConverter />,
    isLazy: true,
    description:
      "Convert between HEX, RGB, RGBA, and HSL color formats with real-time preview.",
    category: "Color",
    icon: <Palette className="w-5 h-5" />,
  },
  {
    path: "browser-ready-css",
    element: <AutoprefixerTool />,
    isLazy: true,
    description:
      "Add necessary vendor prefixes to your CSS. Make it browser-ready with one click.",
    category: "CSS",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    path: "string-converter",
    element: <StringConverter />,
    description:
      "Convert strings into camelCase, PascalCase, kebab-case, snake_case, and more.",
    category: "Utility",
    icon: <Type className="w-5 h-5" />,
  },
  {
    path: "qr-code-generator",
    element: <QrCodeGenerator />,
    isLazy: true,
    description: "Generate QR codes from strings. Download-ready.",
    category: "Generator",
    icon: <QrCode className="w-5 h-5" />,
  },
  {
    path: "hash-generator",
    element: <HashGenerator />,
    isLazy: true,
    description:
      "Generate hashes (MD5, SHA1, SHA224, SHA256, SHA384, SHA512, keccak256) from input string.",
    category: "Security",
    icon: <Hash className="w-5 h-5" />,
  },
  {
    path: "image-metadata-viewer",
    element: <ImageMetadataViewer />,
    isLazy: true,
    description:
      "Inspect EXIF metadata from images: camera, GPS, timestamps, device info, and more.",
    category: "Image",
    icon: <Eye className="w-5 h-5" />,
  },
  {
    path: "websites",
    element: <Websites />,
    description:
      "Handpicked dev tools, sites, and resources. Bookmark-worthy stuff for web developers.",
    category: "Directory",
    icon: <ListChecks className="w-5 h-5" />,
    isPopular: true,
  },
  {
    path: "*",
    element: <NoPage />,
  },
];

const paths = routes.slice(1, -1).map(({ path }) => "/" + path);

export { formatToolName, routes, paths };
