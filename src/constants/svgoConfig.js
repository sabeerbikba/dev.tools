import { lowerCase, omit } from "lodash";

export const nativeRequiredSettings = {
  cleanupAttrs: true,
  inlineStyles: true,
  minifyStyles: true,
  convertStyleToAttrs: true,
  removeDoctype: true,
  removeXMLProcInst: false,
  removeComments: true,
  removeMetadata: true,
  removeDimensions: false
};

export const defaultSettings = {
  optimizeSvg: true,
  ...nativeRequiredSettings,
  removeComments: true,
  removeMetadata: true,
  removeTitle: true,
  removeDesc: true,
  removeUselessDefs: true,
  removeEditorsNSData: true,
  removeEmptyAttrs: true,
  removeHiddenElems: true,
  removeEmptyText: true,
  removeEmptyContainers: true,
  removeViewBox: false,
  cleanupEnableBackground: true,
  convertColors: true,
  convertPathData: true,
  convertTransform: true,
  removeUnknownsAndDefaults: true,
  removeNonInheritableGroupAttrs: true,
  removeUselessStrokeAndFill: true,
  removeUnusedNS: true,
  cleanupIDs: true,
  cleanupNumericValues: false,
  moveElemsAttrsToGroup: true,
  moveGroupAttrsToElems: true,
  collapseGroups: true,
  removeRasterImages: true,
  mergePaths: true,
  convertShapeToPath: true,
  sortAttrs: true
};

export const defaultNativeSettings = omit(
  defaultSettings,
  Object.keys(nativeRequiredSettings)
);

export const formFields = settings =>
  Object.keys(settings).map((property) => ({
    label: lowerCase(property),
    type: "SWITCH", // Assuming InputType.SWITCH corresponds to "SWITCH" in JavaScript
    key: property,
    ...(property !== "optimizeSvg"
      ? {
        isDisabled: (values) => !values.optimizeSvg,
        props: { paddingLeft: 20, borderLeft: "2px solid #FDF8F3" }
      }
      : {})
  }));
