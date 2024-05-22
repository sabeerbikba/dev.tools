const compilerOption = {
   Target: {
      options: ["ES3", "ES5", "ES2015", "ES2016", "ES2017", "ES2018", "ES2019", "ES2020", "ES2021", "ES2022", "ESNext", "JSON"],
      text: "Set the JavaScript language version for emitted JavaScript and include compatible library declarations."
   },
   JSX: {
      options: ["None", "Preserve", "React", "ReactNative", "ReactJSX", "ReactJSXDev",],
      text: "Specify what JSX code is generated.",
   },
   Module: {
      options: ["None", "CommonJS", "AMD", "UMD", "System", "ES2015", "ES2020", "ES2022", "ESNext", "Node16", "NodeNext", "Preserve",],
      text: "Specify what module code is generated.",
   }
};

const compilerOptionTicks = {
   "Output Formatting": [{
      check: false,
      label: "preserveWatchOutput",
      text: "Disable wiping the console in watch mode."
   }, {
      check: false,
      label: "pretty",
      text: "Enable color and formatting in TypeScript's output to make compiler errors easier to read."
   }, {
      check: false,
      label: "noErrorTruncation",
      text: "Disable truncating types in error messages."
   }],
   "Emit": [{
      check: true,
      label: "declaration",
      text: "Generate .d.ts files from TypeScript and JavaScript files in your project."
   }, {
      check: false,
      label: "inlineSourceMap",
      text: "Include sourcemap files inside the emitted JavaScript."
   }, {
      check: false,
      label: "removeComments",
      text: "Disable emitting comments."
   }, {
      check: false,
      label: "importHelpers",
      text: "Allow importing helper functions from tslib once per project, instead of including them per-file."
   }, {
      check: false,
      label: "downlevelIteration",
      text: "Emit more compliant, but verbose and less performant JavaScript for iteration."
   }, {
      check: false,
      label: "inlineSources",
      text: "Include source code in the sourcemaps inside the emitted JavaScript."
   }, {
      check: false,
      label: "stripInternal",
      text: "Disable emitting declarations that have <code>@internal</code> in their JSDoc comments."
   }, {
      check: false,
      label: "noEmitHelpers",
      text: "Disable generating custom helper functions like __extends in compiled output."
   }, {
      check: false,
      label: "preserveConstEnums",
      text: "Disable erasing <code>const enum</code> declarations in generated code."
   }, {
      check: false,
      label: "preserveValueImports",
      text: "Preserve unused imported values in the JavaScript output that would otherwise be removed."
   }],
   "Interop Constraints": [{
      check: false,
      label: "isolatedModules",
      text: "Ensure that each file can be safely transpiled without relying on other imports."
   }, {
      check: false,
      label: "verbatimModuleSyntax",
      text: "Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting."
   }, {
      check: false,
      label: "allowSyntheticDefaultImports",
      text: "Allow 'import x from y' when a module doesn't have a default export."
   }, {
      check: true,
      label: "esModuleInterop",
      text: "Emit additional JavaScript to ease support for importing CommonJS modules. This enables allowSyntheticDefaultImports for type compatibility."
   }],
   "Type Checking": [{
      check: true,
      label: "strict",
      text: "Enable all strict type-checking options."
   }, {
      check: true,
      label: "noImplicitAny",
      text: "Enable error reporting for expressions and declarations with an implied <code>any</code> type."
   }, {
      check: true,
      label: "strictNullChecks",
      text: "When type checking, take into account <code>null</code> and <code>undefined</code>."
   }, {
      check: true,
      label: "strictFunctionTypes",
      text: "When assigning functions, check to ensure parameters and the return values are subtype-compatible."
   }, {
      check: true,
      label: "strictBindCallApply",
      text: "Check that the arguments for <code>bind</code>, <code>call</code>, and <code>apply</code> methods match the original function."
   }, {
      check: true,
      label: "strictPropertyInitialization",
      text: "Check for class properties that are declared but not set in the constructor."
   }, {
      check: true,
      label: "noImplicitThis",
      text: "Enable error reporting when <code>this</code> is given the type <code>any</code>."
   }, {
      check: false,
      label: "useUnknownInCatchVariables",
      text: "Default catch clause variables as <code>unknown</code> instead of <code>any</code>."
   }, {
      check: true,
      label: "alwaysStrict",
      text: "Ensure 'use strict' is always emitted."
   }, {
      check: false,
      label: "noUnusedLocals",
      text: "Enable error reporting when local variables aren't read."
   }, {
      check: false,
      label: "noUnusedParameters",
      text: "Raise an error when a function parameter isn't read."
   }, {
      check: false,
      label: "exactOptionalPropertyTypes",
      text: "Interpret optional property types as written, rather than adding <code>undefined</code>."
   }, {
      check: true,
      label: "noImplicitReturns",
      text: "Enable error reporting for codepaths that do not explicitly return in a function."
   }, {
      check: false,
      label: "noFallthroughCasesInSwitch",
      text: "Enable error reporting for fallthrough cases in switch statements."
   }, {
      check: false,
      label: "noUncheckedIndexedAccess",
      text: "Add <code>undefined</code> to a type when accessed using an index."
   }, {
      check: false,
      label: "noImplicitOverride",
      text: "Ensure overriding members in derived classes are marked with an override modifier."
   }, {
      check: false,
      label: "noPropertyAccessFromIndexSignature",
      text: "Enforces using indexed accessors for keys declared using an indexed type."
   }, {
      check: false,
      label: "allowUnusedLabels",
      text: "Disable error reporting for unused labels."
   }, {
      check: false,
      label: "allowUnreachableCode",
      text: "Disable error reporting for unreachable code."
   }],
   "Modules": [{
      check: false,
      label: "allowUmdGlobalAccess",
      text: "Allow accessing UMD globals from modules."
   }, {
      check: false,
      label: "allowImportingTsExtensions",
      text: "Allow imports to include TypeScript file extensions."
   }, {
      check: false,
      label: "resolvePackageJsonExports",
      text: "Use the package.json 'exports' field when resolving package imports."
   }, {
      check: false,
      label: "resolvePackageJsonImports",
      text: "Use the package.json 'imports' field when resolving imports."
   }, {
      check: false,
      label: "allowArbitraryExtensions",
      text: "Enable importing files with any extension, provided a declaration file is present."
   }],
   "Language and Environment": [{
      check: false,
      label: "experimentalDecorators",
      text: "Enable experimental support for TC39 stage 2 draft decorators."
   }, {
      check: false,
      label: "emitDecoratorMetadata",
      text: "Emit design-type metadata for decorated declarations in source files."
   }, {
      check: false,
      label: "noLib",
      text: " Disable including any library files, including the default lib.d.ts."
   }, {
      check: false,
      label: "useDefineForClassFields",
      text: "Emit ECMAScript-standard-compliant class fields."
   }],
   "Projects": [{
      check: false,
      label: "disableSourceOfProjectReferenceRedirect",
      text: "Disable preferring source files instead of declaration files when referencing composite projects."
   },],
   "Backwards Compatibility": [{
      check: false,
      label: "noImplicitUseStrict",
      text: "Disable adding 'use strict' directives in emitted JavaScript files."
   }, {
      check: false,
      label: "suppressExcessPropertyErrors",
      text: "Disable reporting of excess property errors during the creation of object literals."
   }, {
      check: false,
      label: "suppressImplicitAnyIndexErrors",
      text: "Suppress <code>noImplicitAny</code> errors when indexing objects that lack index signatures."
   }, {
      check: false,
      label: "noStrictGenericChecks",
      text: "Disable strict checking of generic signatures in function types."
   }, {
      check: false,
      label: "keyofStringsOnly",
      text: "Make keyof only return strings instead of string, numbers or symbols. Legacy option."
   },]
};

export { compilerOption, compilerOptionTicks };