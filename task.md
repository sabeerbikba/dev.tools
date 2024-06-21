# Dev.tools TODO:s



## Tasks for allready exist component

- [ ] need to add image for you.com in  SearchEngines Component
- [ ] need to rename link and Component name and link name in to SearchEngines Component
- [ ] need to add og:image with website name and tools availble
- [ ] make website available offline not PWA
- [ ] all button need to looks like same 
- [ ] integation tailwind css in LiveReact and LiveHtml component give toggle button in Livehtml component  
- [ ] inside typescriptPlayground component reset config  option reset buttons in inside optionBtns btn
- [ ] in typescriptplayground component need to crate save option function 
- [ ] give word-wrap button in markdownEditor component 
- [ ] in wordCounter componennt in character counter options give checkbox including spces  or exclude space 
- [ ] also give sort option to WordCounter component 
- [ ] need to remove Monaco Editor from WordCounter component 
- [ ] some time monaco editor did't load because of server give fallback editor after specific time editor did't load
- [ ] Easing functions Add website in Websites component - <<!--** https://easings.net/ **-->> 

### COMPLETED

- [x] need to add <<!--** https://gist.github.com/sabeerbikba/baa8d4dda596e9ca94b4894e8599d0a7 **-->> in metaTagsGenrator 
- [x] add in title and meta title , live html for SEO - 06/05/24
- [x] need open link in another tab of borser list in autoprefixer tab also check for all links - 06/05/24
- [x] add google console in websites.jsx - 06/05/24
- [x] delete task.todo file from repo - 06/05/24
- [x] need to correct stringConverter component logic when [ chnage case with selector ] - 13/06/24
- [x] in string convertor component give option convert text LowerCase and UpperCase - 13/06/24
- [x] need to add comment in index.html file like this <!--**  Github: https://github.com/sabeerbikba/dev.tools  **--> - 02/06/24
- [X] minify css use `<style></style>` and for javascript `<script></script>` and html default : COMPLETED - `LiveHtml` Compoent





## New Tools Ideas

- json server direcly from browser without server or node inside broswer if possible <<!--** https://github.com/typicode/json-server -->>
- [ ] <<!--** https://github.com/mathiasbynens/mothereff.in **-->>
   - [ ]  HTML entity encoder/decoder - <<!--** https://mothereff.in/html-entities **-->>
      - need to show all entities 
         - html_entities - <<!--** https://www.w3schools.com/html/html_entities.asp **-->>
         - html_symbols - <<!--** https://www.w3schools.com/html/html_symbols.asp **-->>
         - html_emojis - <<!--** https://www.w3schools.com/html/html_emojis.asp **-->>
   - [ ] URL encoder/decoder - <<!--** https://mothereff.in/url **-->>    console.log("broswer support storage!!");
   - [ ] ES2015 Unicode regular expression transpiler - <<!--** https://mothereff.in/regexpu **-->>
   - [ ] UTF-8 string length & byte counter - <<!--** https://mothereff.in/byte-counter **-->>
   - [ ] Lua minifier - <<!--** https://mothereff.in/lua-minifier **-->>
-  <<!--** https://github.com/jaywcjlove/tools **-->>
   - [ ] Generate Password - <<!--** https://wangchujiang.com/tools/#/generate-password **-->>
   - [ ] PDF to IMG -  <<!--** https://wangchujiang.com/tools/#/pdf-to-img **-->> 
   - [ ] exif-viewer <<!--** https://wangchujiang.com/tools/#/exif-viewer **-->> 
   - [ ] generate-github-badges - <<!--** https://wangchujiang.com/tools/#/generate-github-badges **-->>
- [ ] svg editor using lib <<!--** https://github.com/SVG-Edit/svgedit **-->>
- [ ] if possible better use <<!--** https://github.com/givanz/VvvebJs **-->> drag and drop web editor better then grapejs 
- [ ] CSV to Table inspired by this vsCode extension - <<!--** https://github.com/Plasma/csv-to-table **-->>
   - [ ] and also json table

- [ ] social media id link genrator : <<!--** https://faq.whatsapp.com/5913398998672934 **-->> : <<!--** https://web.whatsapp.com/send?phone=yourphonenumber **-->>
   * *also include instrction how find usernames
   - instagram
   - whatsApp - inclue two links 
   - facebook
   - likedin
   - telegram group join - user link
   - other apps open with a tag like - genrator 
   - <a href="mailto:hege@example.com">hege@example.com</a>
   - normal sms app
   - *find more
- [ ] (Browser Info) browser all api support need to show table with api name and supprt yes or no example 
   - [ ] screen width and height live 
   - [ ] device info with navigator API 
```javascipt
// this code check localStorage api support or not
if (typeof(Storage) !== "undefined") {
  // Code for yes in table
} else {
  // Sorry! set no in table 
}
```
| keySomething | value |
|----------|----------|
| height | `45`px | <-- need to change as screen size change
| width | `120`px | <-- same for it 
| localStoage Supported | yes|
| ISE supported | no |


- [ ] code snippets saving block to save code snippets 
- [ ] fake data genrator using faker
- [ ] HTML and CSS basic all color names and preview with also color code need to show in  code * made design
- [ ] base64 viewer what that is image or video or auto if better use selectors
- [ ] jsx and tsx code formaatter 
- [ ] color shades genrator in colorConverterComponent
- [ ] html-to-jsx.jsx and jsx-to-html
- [ ] robots.txt genrator
  - if user set every site allow to crow notify to use that if all pages allow not reason to add robots.txt file
- [ ] css filters
- [ ] css tools <<!--** [ * html-css-js.com || + GPT || ] **-->>
- [ ] boxShadow *
- [ ] textShadow and styling spacing what can do with text - also need to support google fonts  
- [ ] gradient*
- [ ] font *
  - [ ] font-family: Specifies the font family for text.
  - [ ] font-size: Sets the size of the font.
  - [ ] font-style: Specifies the style of the font (normal, italic, oblique).
  - [ ] font-weight: Sets the weight or thickness of the font (normal, bold, bolder, lighter, 100-900).
  - [ ] font-variant: Controls the appearance of small caps in the font.
  - [ ] font-stretch: Adjusts the width of the font.
  - [ ] font: Shorthand for setting multiple font properties in one declaration (e.g., font: italic bold 12px/30px Arial, sans-serif;).
  - [ ] line-height: Sets the height of lines of text.
  - [ ] letter-spacing: Adjusts the spacing between characters.
  - [ ] word-spacing: Controls the spacing between words.
  - [ ] text-align: Specifies the horizontal alignment of text (left, right, center, justify).
  - [ ] text-decoration: Adds decorations such as underline, overline, line-through, or blink to text.
  - [ ] text-transform: Controls the capitalization of text (uppercase, lowercase, capitalize).
  - [ ] text-indent: Sets the indentation of the first line of text.
  - [ ] text-shadow: Adds a shadow to text.
  - [ ] white-space: Defines how white space inside an element is handled.
  - [ ] font-display: Controls how font files are loaded and displayed by the browser.
  - [ ] font-feature-settings: Enables or disables specific OpenType features in fonts.
  - [ ] font-kerning: Controls the use of kerning pairs in fonts.
  - [ ] font-variant-caps: Specifies the capitalization of text (normal, small-caps).
  - [ ] font-variant-east-asian: Controls the display of East Asian characters in fonts.
  - [ ] font-variant-ligatures: Enables or disables ligatures in fonts.
  - [ ] font-variant-numeric: Controls the display of numeric characters in fonts.
  - [ ] font-variation-settings: Controls the variation in font styles for variable fonts.
  - [ ] font-smooth: This property controls font smoothing, which is the anti-aliasing effect applied to fonts to make them appear smoother on screen. It's mostly supported in older versions of web browsers and is not commonly used anymore.
  - [ ] font-size-adjust: This property adjusts the font size based on the x-height of the first-choice font, ensuring that fonts of similar x-heights appear at the same size, regardless of the font family or fallback font used. This property is useful for maintaining consistent text sizes across different fonts.
  - [ ] font-optical-sizing: This property allows you to control whether font rendering should optimize for legibility or rendering speed. It's primarily used for fine-tuning the appearance of text in different contexts, such as print or digital screens.
- [ ] table *
- [ ] border*
- [ ] border-radius*
- [ ] transform *
- [ ] backgoround *
- [ ] css sprite genrator +
- [ ] css shape genrator+
- [ ] css color pallte genrator +
- [ ] css timeline editor +
- [ ] css responsive designe teste (like in developer tool devices)+
- [ ] grid builder +
- [ ] css filters also opacity
- [ ] css cursor testing
- [ ] <<!--** https://cssgenerator.org/ **-->>
- [ ] Box Shadow
- [ ] Text Shadow
- [ ] CSS Cursor
- [ ] Border
- [ ] Border Radius
- [ ] Gradient CSS
- [ ] Transform CSS
- [ ] RGBA & Hex Color
- [ ] Multiple Columns
- [ ] Filter
* [ ] code minifiers
- [ ] Convert css in js or vanilla css to tailwind css or vice versa
- [ ] Html tables code genrater
- [ ] Send html templates from client
- add google fonts and google all developer helping products in websites component
- [ ] images
   - [ ] corp
   - [ ] compress
   * [ images corp and compression tool using lib react-image-file-resizer and react-image-crop ]
- [ ] more compression tools
  - <<!--** https://fffuel.co/ **-->>
  - <<!--** https://animista.net/play/basic/shadow-inset/shadow-inset-lr **-->>
  - <<!--** https://svgartista.net/?referrer=animista **-->>
- Convert Tools
   - [ ] json-schema-to-openapi-schema.jsx ??
   - [ ] toml-to-json.jsx
   - [ ] toml-to-yaml.jsx
   - [ ] yaml-to-json.jsx
   - [ ] yaml-to-toml.jsx
   - [ ] json-to-toml.jsx
   - [ ] json-to-yaml.jsx

### COMPLETED

- [x] Live react code - 24/05/24 : [/LiveReact](https://devtools-sabeerbikba.vercel.app/LiveReact)
- [x] live .md editor - 25/05/24 : [/MarkdownEditor](https://devtools-sabeerbikba.vercel.app/MarkdownEditor)
- [x] loremIpsum genrator: <<!--**https://www.mobilefish.com/services/lipsum/lipsum.php **-->> - 24/05/24 : [/LoremIpsumGenrator](https://devtools-sabeerbikba.vercel.app/LoremIpsumGenrator)
- [x] typescript play that simmilar to <<!--**https://www.typescriptlang.org/play/ **-->> <<!--**https://github.com/microsoft/TypeScript-Website **-->> -  [/TypescriptPlayground](https://devtools-sabeerbikba.vercel.app/TypescriptPlayground)
- [x] html css javascript code minifier -  [/LiveHtml](https://devtools-sabeerbikba.vercel.app/LiveHtml)

## Advance

* [ ] Logo Color Matcher: Recommend colors for a logo based on industry standards or psychological impact.
- [ ] **featureUpdate:** live preview for hugo with editor markdown file live preview of website page will look like after upload css
