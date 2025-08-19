import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useId,
} from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import ContentEditable from "react-contenteditable";
import { X, ExternalLink as ExternalLinkIcon } from "lucide-react";

import cn from "@/utils/cn";
import BasicBtn from "@/common/BasicBtn";
import CopyBtn from "@/common/CopyBtn";
import PasteBtn from "@/common/PasteBtn";
import { formatToolName } from "@/routes";
import ExternalLink from "@/common/ExternalLink";
import ToggleSwitch from "@/common/ToggleSwitch";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import useLocalStorageReducer from "@/hooks/useLocalStorageReducer";

const defaultColor = "#000000";

const googleFonts = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Oswald",
  "Source Sans Pro",
  "Raleway",
  "PT Sans",
  "Lora",
  "Nunito",
  "Poppins",
  "Playfair Display",
  "Merriweather",
  "Ubuntu",
  "Mukti",
  "Fira Sans",
  "Work Sans",
  "Libre Baskerville",
  "Crimson Text",
];

const inputsDisableClasses =
  "pointer-events-none select-none opacity-60 z-[-200] relative";

const pickBackground = (textHex) => {
  const rgb = ((hex) => {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((x) => x + x)
        .join("");
    }
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  })(textHex);

  const luminance = (({ r, g, b }) => {
    // WCAG formula
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  })(rgb);

  return luminance > 0.38 ? "#000000" : undefined;
};

const shouldPickBackground = (textHex) => pickBackground(textHex) !== undefined;

const actionTypes = {
  UPDATE_VALUE: "UPDATE_VALUE",
  UPDATE_OBJECT_VALUE: "UPDATE_OBJECT_VALUE",
  RESET_VALUE: "RESET_VALUE",
};

const defaultStyles = {
  text: "Sample Text for Advanced Styling",

  // Basic Text Formatting
  color: defaultColor,
  fontSize: 14,
  fontWeight: "400",
  fontStyle: "normal",
  enableFontFamily: false,
  fontFamily: "Arial, sans-serif",
  lineHeight: 1.45,
  letterSpacing: 0,
  wordSpacing: 0,
  textAlign: "left",
  textIndent: 0,
  direction: "ltr",

  // Transformations
  textTransform: "none",
  whiteSpace: "normal",

  // Text Decoration & Effects
  textDecorationLine: "none",
  textUnderlineOffset: "2",
  textDecorationColor: defaultColor,
  textDecorationSkipInk: "auto",
  textDecorationStyle: "unset",
  textDecorationThickness: 1,
  WebkitTextStrokeWidth: 0,
  WebkitTextStrokeColor: defaultColor,
  opacity: 1,

  // Text Gradient
  textGradient: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
  textGradientImg: "",
  backgroundColor: "transparent",

  textShadow: [{ xOffset: 0, yOffset: 0, blur: 5, color: defaultColor }],

  // Text Wrapping & Container Control
  webkitLineClamp: 3,
  webkitBoxOrient: "unset",

  // Pseudo-elements
  //   firstLineColor: "#ff6b6b",
  //   firstLetterColor: "#4ecdc4",
  //   firstLetterSize: 48,
  //   selectionColor: "#ffffff",
  //   selectionBackground: "#3b82f6",

  // Feature toggles
  enableTextGradient: false,
  enableShadow: false,
  enableDecoration: false,
  enableStroke: false,
  enableClamp: false,
  // enablePseudo: false,

  //   TODO: Add Pleasedo
  //   enablePleasedoBefore: false,
  //   enablePleasedoAfter: false,
  //   enablePleasedoFirstLetter: false,
  //   enablePleasedoSelection: false,
  //   enablePleasedoHover: false,

  googleFonts: {
    enabled: false,
    inputLink: "",
    selectedOption: "",
    loadedFonts: new Set(), // select options
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_VALUE: {
      return { ...state, [action.field]: action.value };
    }
    case actionTypes.UPDATE_OBJECT_VALUE: {
      const currentValue = state[action.payload.field];
      if (Array.isArray(currentValue)) {
        return {
          ...state,
          [action.payload.field]: action.payload.value,
        };
      }
      return {
        ...state,
        [action.payload.field]: {
          ...currentValue,
          ...action.payload.value,
        },
      };
    }
    case actionTypes.RESET_VALUE: {
      return defaultStyles;
    }
    default: {
      console.error("Unknown action: " + action.type);
      console.warn(
        "you not added action.type: " + action.type + " add and try"
      );
      return state;
    }
  }
};

const AdvancedTextStylingTool = () => {
  const editableRef = useRef(null);
  const isOnline = useOnlineStatus();
  const [styles, dispatch] = useLocalStorageReducer(
    "css-text-styling",
    reducer,
    defaultStyles
  );

  const updateValues = (values) => {
    Object.keys(values).forEach((field) => {
      dispatch({ type: actionTypes.UPDATE_VALUE, field, value: values[field] });
    });
  };

  const updateObjectValue = (field, valueUpdater) => {
    const currentValue = styles[field];
    const updatedValue =
      typeof valueUpdater === "function"
        ? valueUpdater(currentValue)
        : valueUpdater;

    dispatch({
      type: actionTypes.UPDATE_OBJECT_VALUE,
      payload: { field, value: updatedValue },
    });
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?${googleFonts
      .map((font) => `family=${font.replace(" ", "+")}`)
      .join("&")}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const loadCustomGoogleFont = () => {
    let input = styles.googleFonts.inputLink || "";

    // Extract the first valid Google Fonts URL
    const urlMatch = input.match(/https:\/\/fonts\.googleapis\.com\/[^'")\s]+/);
    if (!urlMatch) {
      toast.warn(`Please enter valid url`);
      updateObjectValue("googleFonts", { inputLink: "" });
      return;
    }

    const linkUrl = urlMatch[0];

    const familyMatches = [...linkUrl.matchAll(/family=([^&:]+)/g)].map(
      (m) => m[1].replace(/\+/g, " ") // Extract ALL families from the url
    );

    if (!familyMatches.length) return;

    updateObjectValue("googleFonts", (prev) => {
      const mergedFonts = new Set([...prev.loadedFonts, ...familyMatches]);

      if (mergedFonts.size === prev.loadedFonts.size) {
        toast.info(`Fonts already loaded`);
        return prev;
      }

      const base = "https://fonts.googleapis.com/css2?";
      const familyParams = [...mergedFonts]
        .map((f) => `family=${f.replace(/\s+/g, "+")}`)
        .join("&");
      const newUrl = `${base}${familyParams}&display=swap`;

      let linkEl = document.head.querySelector("link[data-google-fonts]");
      if (!linkEl) {
        linkEl = document.createElement("link");
        linkEl.rel = "stylesheet";
        linkEl.setAttribute("data-google-fonts", "true"); // marker
        document.head.appendChild(linkEl);
      }
      linkEl.href = newUrl;

      return {
        ...prev,
        loadedFonts: mergedFonts,
        selectedOption: [...mergedFonts][0],
      };
    });

    updateObjectValue("googleFonts", { inputLink: "" });
  };

  const updateTextShadow = (index, key, value) => {
    updateObjectValue("textShadow", (currentShadows) =>
      currentShadows.map((shadow, i) =>
        i === index ? { ...shadow, [key]: value } : shadow
      )
    );
  };

  const addTextShadow = () => {
    updateObjectValue("textShadow", (currentShadows) => [
      ...currentShadows,
      { xOffset: 2, yOffset: 2, blur: 4, color: defaultColor },
    ]);
  };

  const removeTextShadow = (index) => {
    updateObjectValue("textShadow", (currentShadows) =>
      currentShadows.length > 1
        ? currentShadows.filter((_, i) => i !== index)
        : currentShadows
    );
  };

  const isGoogleFontsInputEmpty = !styles.googleFonts.inputLink.trim();

  const hashTextDecorationThicknessEnable = ![
    "underline",
    "overline",
    "line-through",
  ].includes(styles.textDecorationLine);

  const hasShadows = (num, op = ">=") => {
    const compareOps = {
      ">": (a, b) => a > b,
      ">=": (a, b) => a >= b,
      "<": (a, b) => a < b,
      "<=": (a, b) => a <= b,
      "===": (a, b) => a === b,
    };

    if (!compareOps[op]) {
      console.error(`Invalid comparison operator: "${op}"`);
      return false;
    }

    return compareOps[op](styles.textShadow.length, num);
  };

  const buildStyles = () => {
    const s = {};
    const setStyleIfChanged = (key, unit = "") => {
      if (styles[key] !== defaultStyles[key]) {
        s[key] = unit ? `${styles[key]}${unit}` : styles[key];
      }
    };

    // Basic
    setStyleIfChanged("fontSize", "px");
    setStyleIfChanged("fontWeight");
    setStyleIfChanged("fontStyle");
    if (styles.enableFontFamily) {
      s.fontFamily = styles.fontFamily;
    } else if (styles.googleFonts.enabled) {
      s.fontFamily = styles.googleFonts.selectedOption;
    }
    setStyleIfChanged("lineHeight");
    setStyleIfChanged("letterSpacing", "px");
    setStyleIfChanged("wordSpacing", "px");
    setStyleIfChanged("textAlign");
    setStyleIfChanged("textIndent", "px");
    setStyleIfChanged("direction");
    setStyleIfChanged("opacity");
    setStyleIfChanged("textTransform");
    setStyleIfChanged("whiteSpace");

    // Text gradient or color
    if (styles.enableTextGradient) {
      s.backgroundImage = styles.textGradient;
      s.WebkitBackgroundClip = "text";
      s.WebkitTextFillColor = "transparent";
      s.backgroundClip = "text";
    } else if (styles.WebkitTextStrokeColor === defaultColor) {
      // s.color = styles.color;
      setStyleIfChanged("color");
    }
    if (
      !styles.enableTextGradient &&
      styles.backgroundColor !== "transparent"
    ) {
      s.backgroundColor = styles.backgroundColor;
    }

    // Shadow
    if (styles.enableShadow) {
      s.textShadow = styles.textShadow
        .map(
          (shadow) =>
            `${shadow.xOffset}px ${shadow.yOffset}px ${shadow.blur}px ${shadow.color}`
        )
        .join(", ");
    }

    // Decoration
    if (styles.enableDecoration) {
      setStyleIfChanged("textDecorationLine");
      if (styles.textDecorationLine === "underline") {
        setStyleIfChanged("textUnderlineOffset", "px");
      }
      if (!hashTextDecorationThicknessEnable) {
        setStyleIfChanged("textDecorationColor");
        setStyleIfChanged("textDecorationStyle");
        setStyleIfChanged("textDecorationThickness", "px");
      }
      if (styles.textDecorationLine === "underline") {
        setStyleIfChanged("textDecorationSkipInk");
      }
    }

    // Stroke
    if (styles.enableStroke) {
      setStyleIfChanged("WebkitTextStrokeWidth", "px");
      if (
        styles.WebkitTextStrokeWidth !== defaultStyles.WebkitTextStrokeWidth
      ) {
        setStyleIfChanged("WebkitTextStrokeColor");
      }
    }

    // Line clamp
    if (styles.enableClamp) {
      s.display = "-webkit-box";
      s.WebkitLineClamp = styles.webkitLineClamp;
      s.WebkitBoxOrient = styles.webkitBoxOrient;
      s.overflow = "hidden";
    }

    return s;
  };

  const objectToCSS = (styleObj) => {
    return Object.entries(styleObj)
      .map(([key, value]) => {
        const kebab = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        return `${kebab}: ${value};`;
      })
      .join("\n");
  };

  const textStyle = buildStyles();
  const cssString = objectToCSS(buildStyles());

  /** Task TODO:
   * After pleasudo suppot added need to use Monaco Edito
   */

  /** Coming soon fetures
   * css to tailwind - https://github.com/ritz078/transform/blob/master/pages/css-to-tailwind.tsx
   * pleasudo styles
   * hyphens css propery
   */

  return (
    <div className="min-h-screen p-4 max-lg:!pt-0 text-white">
      <div className="max-w-[1400px] my-0 mx-auto">
        {/* Controls Section - Left */}
        <ColumnGrid gap={6} stackOnLg>
          <div className="bg-gray-800/15 rounded-lg shadow order-1 max-lg:order-2">
            <div className="p-4 border-b  border-[#e5e7eb] !bg-[#282a2c] !opacity-100 max-lg:sticky max-lg:top-[40%]">
              <div className="flex justify-between items-center">
                <h2 className="text-[18px] font-bold">Style Controls</h2>
                <BasicBtn
                  onClick={() => {
                    dispatch({ type: actionTypes.RESET_VALUE });
                    editableRef.current?.resetAll();
                  }}
                  classNames="!py-[6px] !px-3 bg-[#f3f4f6] !w-[100px] !h-[35px] rounded-[6px] cursor-pointer text-xs"
                  btnText="Reset All"
                />
              </div>
            </div>

            <div className="lg:max-h-[90vh] overflow-y-auto -z-50 p-5">
              <StyleSection
                id="basic"
                label="📝 Basic Typography"
                permanentEnabled
              >
                <ColumnGrid>
                  <SelectWithOptions
                    label="Font Family"
                    value={styles.fontFamily}
                    onChange={(e) =>
                      updateValues({ fontFamily: e.target.value })
                    }
                    disabled={!styles.enableFontFamily}
                    options={{
                      systemFonts: [
                        "Arial, sans-serif",
                        "Helvetica, sans-serif",
                        "Times New Roman, serif",
                        "Georgia, serif",
                        "Courier New, monospace",
                        "Verdana, sans-serif",
                        "Trebuchet MS, sans-serif",
                        "Impact, sans-serif",
                        "Comic Sans MS, cursive",
                        "Palatino, serif",
                      ],
                      googleFonts,
                    }}
                    others={
                      <ToggleSwitch
                        enabled={styles.enableFontFamily}
                        onClick={() => {
                          updateValues({
                            enableFontFamily: !styles.enableFontFamily,
                          });
                        }}
                        smallVersion
                      />
                    }
                  />

                  <SelectWithOptions
                    label="Font Weight"
                    value={styles.fontWeight}
                    onChange={(e) =>
                      updateValues({ fontWeight: e.target.value })
                    }
                    options={[
                      ["400", "Normal"],
                      ["100", "Thin"],
                      ["300", "Light"],
                      ["500", "Medium"],
                      ["600", "Semi Bold"],
                      ["700", "Bold"],
                      ["900", "Black"],
                    ]}
                    valueTextDiff
                    valueTextDiffValueNeededInText
                  />
                </ColumnGrid>

                <InputRange
                  label={`Font Size: ${styles.fontSize}px${
                    styles.fontSize === defaultStyles.fontSize
                      ? " (default)"
                      : ""
                  }`}
                  defaultVal={defaultStyles.fontSize}
                  min={8}
                  max={120}
                  value={styles.fontSize}
                  onChange={(e) =>
                    updateValues({ fontSize: parseInt(e.target.value) })
                  }
                />

                <ColumnGrid>
                  <InputColor
                    label="Text Color"
                    value={styles.color}
                    onChange={(e) => updateValues({ color: e.target.value })}
                    isDisalbed={styles.enableTextGradient}
                    infoText="🔗 Disabled when gradient is active"
                    infoVisble={!styles.enableTextGradient}
                  />

                  <SelectWithOptions
                    label="Text Align"
                    value={styles.textAlign}
                    onChange={(e) =>
                      updateValues({ textAlign: e.target.value })
                    }
                    options={["left", "center", "right", "justify"]}
                  />
                </ColumnGrid>

                <ColumnGrid>
                  <SelectWithOptions
                    label="Transform"
                    value={styles.textTransform}
                    onChange={(e) =>
                      updateValues({ textTransform: e.target.value })
                    }
                    options={[
                      ["none", "None"],
                      ["uppercase", "UPPERCASE"],
                      ["lowercase", "lowercase"],
                      ["capitalize", "Capitalize"],
                    ]}
                    valueTextDiff
                  />

                  <SelectWithOptions
                    label="White Space"
                    value={styles.whiteSpace}
                    onChange={(e) =>
                      updateValues({ whiteSpace: e.target.value })
                    }
                    options={[
                      ["normal", "Normal"],
                      ["nowrap", "No Wrap"],
                      ["pre", "Pre"],
                      ["pre-wrap", "Pre Wrap"],
                    ]}
                    valueTextDiff
                  />
                </ColumnGrid>

                <ColumnGrid>
                  <SelectWithOptions
                    label="Font Style"
                    value={styles.fontStyle}
                    onChange={(e) =>
                      updateValues({ fontStyle: e.target.value })
                    }
                    options={["normal", "italic", "oblique"]}
                  />
                  <SelectWithOptions
                    label="Direction"
                    value={styles.direction}
                    onChange={(e) =>
                      updateValues({ direction: e.target.value })
                    }
                    options={["ltr", "rtl"]}
                  />
                </ColumnGrid>

                <ColumnGrid>
                  <InputRange
                    label={`Text Indent: ${styles.textIndent}px`}
                    min={-10}
                    max={50}
                    value={styles.textIndent}
                    defaultVal={defaultStyles.textIndent}
                    onChange={(e) =>
                      updateValues({ textIndent: parseInt(e.target.value) })
                    }
                  />
                  <InputRange
                    label={`Opacity: ${styles.opacity}`}
                    min={0}
                    max={1}
                    step={0.05}
                    value={styles.opacity}
                    defaultVal={defaultStyles.opacity}
                    onChange={(e) =>
                      updateValues({ opacity: parseFloat(e.target.value) })
                    }
                  />
                </ColumnGrid>

                <ColumnGrid>
                  <InputRange
                    label={`Line Clamp: ${styles.webkitLineClamp} lines`}
                    min="1"
                    max="10"
                    value={styles.webkitLineClamp}
                    defaultVal={defaultStyles.webkitLineClamp}
                    onChange={(e) =>
                      updateValues({
                        webkitLineClamp: parseInt(e.target.value),
                      })
                    }
                  />
                  <InputRange
                    label={`Line Height: ${styles.lineHeight}`}
                    min={0.5}
                    max={3}
                    step={0.05}
                    value={styles.lineHeight}
                    defaultVal={defaultStyles.lineHeight}
                    onChange={(e) =>
                      updateValues({ lineHeight: parseFloat(e.target.value) })
                    }
                  />
                </ColumnGrid>

                <ColumnGrid>
                  <InputRange
                    label={`Letter Spacing: ${styles.letterSpacing}px`}
                    min={-5}
                    max={20}
                    step={0.5}
                    value={styles.letterSpacing}
                    defaultVal={defaultStyles.letterSpacing}
                    onChange={(e) =>
                      updateValues({
                        letterSpacing: parseFloat(e.target.value),
                      })
                    }
                  />

                  <InputRange
                    label={`Word Spacing: ${styles.wordSpacing}px`}
                    min={-10}
                    max={50}
                    step={1}
                    value={styles.wordSpacing}
                    defaultVal={defaultStyles.wordSpacing}
                    onChange={(e) =>
                      updateValues({ wordSpacing: parseInt(e.target.value) })
                    }
                  />
                </ColumnGrid>
              </StyleSection>

              <StyleSection
                id="text-gradient"
                label="🌈 Text Gradient"
                isChecked={styles.enableTextGradient}
                onChange={(e) =>
                  updateValues({ enableTextGradient: e.target.checked })
                }
              >
                <TextArea
                  label="Gradient CSS"
                  value={styles.textGradient}
                  onChange={(e) =>
                    updateValues({ textGradient: e.target.value })
                  }
                  fontSmall
                />

                <ColumnGrid gap={1.5}>
                  {[
                    {
                      name: "Rainbow",
                      value:
                        "linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)",
                    },
                    {
                      name: "Sunset",
                      value:
                        "linear-gradient(45deg, #ff6b6b, #ffa500, #ff1493)",
                    },
                    {
                      name: "Ocean",
                      value:
                        "linear-gradient(45deg, #4ecdc4, #44a08d, #1e3c72)",
                    },
                    {
                      name: "Fire",
                      value:
                        "linear-gradient(45deg, #ff4757, #ff6348, #ff7675)",
                    },
                    {
                      name: "Purple",
                      value: "linear-gradient(45deg, #667eea, #764ba2)",
                    },
                    {
                      name: "Gold",
                      value: "linear-gradient(45deg, #f7971e, #ffd200)",
                    },
                    {
                      name: "Image",
                      value:
                        "url(https://96f15340-1f87-43d1-a2d9-ca1a985c87f9.mdnplay.dev/shared-assets/images/examples/leopard.jpg)",
                    },
                    {
                      name: "Cusom Image (select)",
                      value: styles.textGradientImg,
                    },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        if (preset.name.startsWith("Cusom Image")) {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          updateValues({
                            textGradient: styles.textGradientImg,
                          });
                          if (!styles.textGradientImg) {
                            updateValues({ textGradient: styles.text });
                          }

                          input.onchange = () => {
                            const file = input.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              updateValues({ textGradient: `url(${url})` });
                              updateValues({ textGradientImg: `url(${url})` });
                            }
                          };

                          input.click();
                        } else updateValues({ textGradient: preset.value });
                      }}
                      style={{
                        background: preset.value,
                        textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                      }}
                      className="bg-contain bg-no-repeat bg-center p-1.5 rounded text-white text-[10px] cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </ColumnGrid>
              </StyleSection>

              <StyleSection
                id="shadow"
                label="🌟 Text Shadow"
                isChecked={styles.enableShadow}
                onChange={(e) =>
                  updateValues({ enableShadow: e.target.checked })
                }
                warning={{
                  enabled: styles.enableShadow && hasShadows(6),
                  text: hasShadows(10)
                    ? "Shadow limit reached"
                    : "Too many shadows",
                }}
                children={
                  <>
                    <span className="text-xs font-medium">Shadows</span>
                    <div>
                      <BasicBtn
                        btnText="Reset Shadows"
                        onClick={() =>
                          updateValues({
                            textShadow: defaultStyles.textShadow,
                          })
                        }
                        btnDisabled={hasShadows(1, "===")}
                        classNames="!h-6 !w-22 text-[10px] !py-1 !px-2 !rounded mr-2"
                      />
                      <BasicBtn
                        btnText="Add Shadow"
                        onClick={addTextShadow}
                        btnDisabled={hasShadows(10)}
                        classNames="!h-6 !w-19 text-[10px] !py-1 !px-2 !rounded"
                      />
                    </div>
                  </>
                }
                others={styles.textShadow.map((shadow, index) => (
                  <div
                    key={index}
                    className="p-3 bg-[#2d3748] rounded-md mb-2 text-white"
                  >
                    <div className="flex-center mb-2 !justify-between">
                      <span className="text-[10px] font-medium	text-[#a0aec0]">
                        Shadow {index + 1}
                      </span>
                      {hasShadows(1, ">") && index !== 0 && (
                        <button
                          onClick={() => removeTextShadow(index)}
                          className="py-0.5 px-1.5 bg-[#e53e3e] text-white border-none rounded-[3px] cursor-pointer text-[8px]"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {[
                        {
                          label: "X offset",
                          value: shadow.xOffset,
                          updateFunKey: "xOffset",
                        },
                        {
                          label: "Y offset",
                          value: shadow.yOffset,
                          updateFunKey: "yOffset",
                        },
                        {
                          label: "Blur",
                          value: shadow.blur,
                          updateFunKey: "blur",
                        },
                      ].map(({ label, value, updateFunKey }, key) => (
                        <div className="flex items-center gap-2" key={key}>
                          <label className="text-[9px] text-[#a0aec0] min-w-[40px]">
                            {label}
                          </label>
                          <input
                            type="number"
                            value={value}
                            onChange={(e) =>
                              updateTextShadow(
                                index,
                                updateFunKey,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-[50px] py-0.5 px-1 !bg-[#4a5568] border-[1px] border-[#718096] roundec-[3px] !text-white text-[10px]"
                          />
                          <input
                            type="range"
                            min="-50"
                            max="50"
                            value={value}
                            onChange={(e) =>
                              updateTextShadow(
                                index,
                                updateFunKey,
                                parseInt(e.target.value)
                              )
                            }
                            className="[flex:1] accent-[#3b82f6]"
                          />
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <label className="text-[9px] text-[#a0aec0] min-w-[40px]">
                          Color
                        </label>
                        <div className="size-5 rounded-[50%] border border-[#718096] relative cursor-pointer">
                          <input
                            type="color"
                            value={shadow.color}
                            onChange={(e) =>
                              updateTextShadow(index, "color", e.target.value)
                            }
                            className="absolute size-full opacity-0 cursor-pointer"
                          />
                        </div>
                        <span className="text-[9px] text-[#a0aec0] font-mono">
                          {shadow.color}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              />

              <StyleSection
                id="decoration"
                label="✏️ Text Decoration"
                isChecked={styles.enableDecoration}
                onChange={(e) =>
                  updateValues({ enableDecoration: e.target.checked })
                }
              >
                <div className="flex flex-col gap-3">
                  <ColumnGrid>
                    <SelectWithOptions
                      label="Decoration"
                      value={styles.textDecorationLine}
                      onChange={(e) =>
                        updateValues({ textDecorationLine: e.target.value })
                      }
                      options={[
                        "none",
                        "underline",
                        "overline",
                        "line-through",
                        "grammar-error",
                        "spelling-error",
                      ]}
                    />

                    <SelectWithOptions
                      label="Style"
                      value={styles.textDecorationStyle}
                      onChange={(e) =>
                        updateValues({ textDecorationStyle: e.target.value })
                      }
                      options={[
                        "unset",
                        "dashed",
                        "dotted",
                        "double",
                        "solid",
                        "wavy",
                      ]}
                      disabled={hashTextDecorationThicknessEnable}
                    />

                    <InputRange
                      label={`Decoration Thickness ${styles.textDecorationThickness}px`}
                      min={1}
                      max={5}
                      step={0.1}
                      value={styles.textDecorationThickness}
                      defaultVal={defaultStyles.textDecorationThickness}
                      onChange={(e) =>
                        updateValues({
                          textDecorationThickness: parseFloat(e.target.value),
                        })
                      }
                      isDisalbed={hashTextDecorationThicknessEnable}
                    />

                    <InputRange
                      label={`Underline offset: ${styles.textUnderlineOffset}px`}
                      min={1}
                      max={10}
                      value={styles.textUnderlineOffset}
                      defaultVal={defaultStyles.textUnderlineOffset}
                      onChange={(e) =>
                        updateValues({ textUnderlineOffset: e.target.value })
                      }
                      isDisalbed={styles.textDecorationLine !== "underline"}
                    />

                    <InputColor
                      label="Decoration Color"
                      value={styles.textDecorationColor}
                      onChange={(e) =>
                        updateValues({ textDecorationColor: e.target.value })
                      }
                      isDisalbed={hashTextDecorationThicknessEnable}
                    />

                    <SelectWithOptions
                      label="Skip Ink"
                      value={styles.textDecorationSkipInk}
                      onChange={(e) =>
                        updateValues({ textDecorationSkipInk: e.target.value })
                      }
                      options={["auto", "none"]}
                      disabled={styles.textDecorationLine !== "underline"}
                    />
                  </ColumnGrid>
                </div>
              </StyleSection>

              <StyleSection
                id="stroke"
                label="🖊️ Text Stroke"
                isChecked={styles.enableStroke}
                onChange={(e) =>
                  updateValues({ enableStroke: e.target.checked })
                }
              >
                <ColumnGrid>
                  <InputRange
                    label={`Stroke Width: ${styles.WebkitTextStrokeWidth}px`}
                    min={0}
                    max={10}
                    step={0.5}
                    value={styles.WebkitTextStrokeWidth}
                    defaultVal={defaultStyles.WebkitTextStrokeWidth}
                    onChange={(e) =>
                      updateValues({
                        WebkitTextStrokeWidth: parseFloat(e.target.value),
                      })
                    }
                  />

                  <InputColor
                    label="Stroke Color"
                    value={styles.WebkitTextStrokeColor}
                    onChange={(e) =>
                      updateValues({ WebkitTextStrokeColor: e.target.value })
                    }
                    isDisalbed={
                      styles.WebkitTextStrokeWidth ===
                      defaultStyles.WebkitTextStrokeWidth
                    }
                  />
                </ColumnGrid>
              </StyleSection>

              <StyleSection
                id="lline-clamp"
                label="🗜️ Line clamp"
                isChecked={styles.enableClamp}
                onChange={(e) =>
                  updateValues({ enableClamp: e.target.checked })
                }
              >
                <InputRange
                  label={`Line clamp: ${styles.webkitLineClamp} lines`}
                  min={0}
                  max={20}
                  value={styles.webkitLineClamp}
                  defaultVal={defaultStyles.webkitLineClamp}
                  onChange={(e) =>
                    updateValues({ webkitLineClamp: parseInt(e.target.value) })
                  }
                />

                <SelectWithOptions
                  label="Box Orient"
                  value={styles.webkitBoxOrient}
                  onChange={(e) =>
                    updateValues({ webkitBoxOrient: e.target.value })
                  }
                  options={["unset", "vertical", "horizontal"]}
                />
              </StyleSection>
            </div>
          </div>

          {/* Preview Section - Right */}
          <div className="bg-[#282a2c] rounded-lg top-4 shadow h-[fit-content] order-2 max-lg:order-1 max-lg:sticky max-lg:z-50 max-lg:max-h-[40vh] max-lg:overflow-y-auto max-lg:border-b max-lg:sticky max-lg:top-0">
            <div className="p-[20px] border-b-[1px] border-[#e5e7eb]">
              <h2 className="text-lg font-semibold">Live Preview</h2>
            </div>
            <div className="p-[20px] lg:overflow-y-auto lg:max-h-[90vh]">
              <EditableText
                ref={editableRef}
                textStyle={textStyle}
                styles={styles}
                updateStyle={updateValues}
              />
              <hr className="hr" />

              <TextArea
                mt
                label="Preview Text"
                value={styles.text}
                onChange={(e) => updateValues({ text: e.target.value })}
                others={
                  <div className="ml-auto mb-1 flex gap-1">
                    <BasicBtn
                      btnText="clear"
                      onClick={() => updateValues({ text: "" })}
                      classNames="!h-6 !w-19 text-xs !py-1 !px-2 !rounded"
                      btnDisabled={!styles.text}
                    />
                    <BasicBtn
                      btnText="add text"
                      onClick={() =>
                        updateValues({
                          text: !styles.text.trim()
                            ? defaultStyles.text
                            : `${styles.text} ${styles.text}`,
                        })
                      }
                      classNames="!h-6 !w-22 text-xs !py-1 !px-2 !rounded"
                    />
                  </div>
                }
              />

              <div className="mt-4">
                <div className="flex justify-between">
                  <label className="block font-sm font-medium mb-1">
                    Load Custom Google Font
                  </label>
                  <ExternalLink
                    href="https://fonts.google.com/"
                    className="flex text-[11px] gap-1 bg-white/10 px-2 pt-0.5 mb-0.5 mr-2 rounded h-5"
                  >
                    Fonts <ExternalLinkIcon className="size-3" />
                  </ExternalLink>
                </div>
                <div>
                  <input
                    type="text"
                    value={styles.googleFonts.inputLink}
                    onChange={(e) =>
                      updateObjectValue("googleFonts", {
                        inputLink: e.target.value,
                      })
                    }
                    placeholder="https://fonts.googleapis.com/css2?family=..."
                    className="p-2 rounded-md text-xs w-full"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <BasicBtn
                    btnText="Load Font"
                    onClick={loadCustomGoogleFont}
                    classNames="[flex:1] !py-2 !px-3 !h-[50px] bg-[#3b82f6] text-white border-none rounded-md cursor-pointer text-xs"
                    btnDisabled={isGoogleFontsInputEmpty}
                  />
                  <PasteBtn
                    onPaste={(val) =>
                      updateObjectValue("googleFonts", {
                        inputLink: val,
                      })
                    }
                    btnDisabled={!isGoogleFontsInputEmpty}
                    styles={{ flex: 1, height: "50px" }}
                  />
                  <BasicBtn
                    btnText="Clear"
                    onClick={(val) =>
                      updateObjectValue("googleFonts", {
                        inputLink: "",
                      })
                    }
                    classNames="[flex:1] !py-2 !px-3 !h-[50px] bg-[#3b82f6] text-white border-none rounded-md cursor-pointer text-xs"
                    btnDisabled={isGoogleFontsInputEmpty}
                  />
                  {Boolean(styles.googleFonts.loadedFonts.size) && (
                    <SelectWithOptions
                      label="Loaded Fonts"
                      options={Array.from(styles.googleFonts.loadedFonts)}
                      disabledEntire={styles.enableFontFamily}
                      disabled={!styles.googleFonts.enabled}
                      value={styles.googleFonts.selectedOption}
                      onChange={(e) =>
                        updateObjectValue("googleFonts", {
                          selectedOption: e.target.value,
                        })
                      }
                      classNames="[flex:2] z-10 max-w-[125px]"
                      defaultNotNeded
                      others={
                        <ToggleSwitch
                          enabled={
                            styles.enableFontFamily
                              ? false
                              : styles.googleFonts.enabled
                          }
                          onClick={() => {
                            if (!isOnline && !styles.googleFonts.enabled) {
                              toast.warn(
                                `Internet required - check your connection`,
                                {
                                  autoClose: 3000,
                                }
                              );
                            }
                            updateObjectValue("googleFonts", (prev) => ({
                              enabled: !prev.enabled,
                            }));
                          }}
                          className={cn(
                            styles.enableFontFamily && inputsDisableClasses
                          )}
                          smallVersion
                        />
                      }
                    />
                  )}
                </div>
              </div>

              <div className="mt-4 p-2 border-[#e5e7eb] rounded-lg">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-semibold">
                      📋 Generated CSS
                    </h3>
                    <CopyBtn
                      btnText="Copy CSS"
                      disabled={cssString === ""}
                      copyText={cssString}
                      className="py-1 px-2 bg-[#10b981] !h-8 text-white border-none rounded cursor-pointer text-[10px]"
                    />
                  </div>
                  <textarea
                    value={cssString}
                    readOnly
                    className="w-full h-[200px] p-2 font-mono text-[10px] rounded bg-[#f9fafb] resize-y text-black"
                  />
                </div>
                <div className={"mt-4 " + inputsDisableClasses + " !z-10"}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-semibold">
                      📋 Generated tailwindCss
                    </h3>
                    <CopyBtn
                      btnText="Copy tailwwind"
                      disabled={true}
                      copyText={cssString}
                      className="py-1 px-2 bg-[#10b981] !h-8 text-white border-none rounded cursor-pointer text-[10px]"
                    />
                  </div>
                  <div className="flex-center h-[200px] w-full bg-white rounded text-black">
                    Coming Soon...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ColumnGrid>
      </div>
    </div>
  );
};

const StyleSection = ({
  id,
  label,
  isChecked,
  onChange,
  children,
  others,
  customCss,
  permanentEnabled,
  warning = { enabled: false, text: "" },
}) => (
  <div className="mb-6 p-4 border-[#e5e7eb] rounded-lg">
    <div className={cn(!permanentEnabled && "flex items-center gap-2", "mb-4")}>
      {!permanentEnabled && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          id={`enable-${id}`}
        />
      )}
      <label htmlFor={`enable-${id}`} className="text-base font-bold">
        {label}
      </label>
      {warning.enabled && (
        <div
          className={cn(
            "ml-auto border  border-white/20 px-2 py-0.5 rounded text-[0.805rem]",
            warning.enabled ? "inline-block" : "hidden"
          )}
        >
          {"⚠️" + "  " + warning.text}
        </div>
      )}
    </div>

    {others ? (
      <div
        className={
          !isChecked && !permanentEnabled ? inputsDisableClasses : undefined
        }
      >
        <div className="flex justify-between items-center mb-3">{children}</div>
        {others}
      </div>
    ) : (
      <div
        className={cn(
          customCss ? customCss : "flex flex-col gap-3",
          !isChecked && !permanentEnabled && inputsDisableClasses
        )}
      >
        {children}
      </div>
    )}
  </div>
);

const SelectWithOptions = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  disabledEntire = false,
  valueTextDiff,
  valueTextDiffValueNeededInText,
  defaultNotNeded,
  classNames,
  others,
}) => (
  <div
    className={cn(
      classNames,
      disabledEntire && inputsDisableClasses,
      disabledEntire && "z-10"
    )}
  >
    <LabelWithExtras label={label} others={others} textClass="text-xs" />
    <select
      value={value}
      onChange={onChange}
      className={cn(
        "w-full p-1.5 text-xs rounded disabled:opacity-50",
        disabled && inputsDisableClasses
      )}
    >
      {Array.isArray(options)
        ? valueTextDiff
          ? options.map(([value, text], i) => (
              <option value={value} key={value}>
                {i
                  ? `${text}${
                      valueTextDiffValueNeededInText ? " " + value : ""
                    }`
                  : `${text}${
                      valueTextDiffValueNeededInText ? " " + value : ""
                    }${defaultNotNeded ? "" : " (default)"}`}
              </option>
            ))
          : options.map((option, i) => (
              <option value={option} key={option}>
                {i
                  ? formatToolName(option).titleCase
                  : `${formatToolName(option).titleCase}${
                      defaultNotNeded ? "" : " (default)"
                    }`}
              </option>
            ))
        : Object.entries(options).map(([optGrpLabel, opts]) => (
            <optgroup
              label={optGrpLabel
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (c) => c.toUpperCase())}
              key={optGrpLabel}
            >
              {opts.map((opt) => (
                <option value={opt} key={opt}>
                  {formatToolName(opt.split(",")[0]).titleCase}
                </option>
              ))}
            </optgroup>
          ))}
    </select>
  </div>
);

const InputRange = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
  defaultVal,
  isDisalbed,
}) => {
  const uniqueId = useId().replace(/:/g, "");
  const inputId = `range-${uniqueId}`;

  useEffect(() => {
    const styleId = "input-range-styles";
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const defaultTrackSplit =
      ((Math.min(Math.max(defaultVal, min), max) - min) / (max - min)) * 100;
    const cssRule = `
           input[type="range"].${inputId}::-webkit-slider-runnable-track {
               background: linear-gradient(to right, #b5b5b5 0%, #b5b5b5 ${defaultTrackSplit}%, #efefef ${defaultTrackSplit}%, #efefef 100%);
            }`;

    if (!styleElement.textContent.includes(`.${inputId}`)) {
      styleElement.textContent += cssRule;
    }
  }, [inputId]);

  return (
    <div className={cn(isDisalbed && inputsDisableClasses)}>
      <label className="block text-xs font-medium mb-1">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={"w-full text-styling " + inputId}
      />
    </div>
  );
};

const InputColor = ({
  label,
  value,
  onChange,
  isDisalbed,
  infoText,
  infoVisble,
  others,
  className,
}) => (
  <div className={cn(isDisalbed && inputsDisableClasses, className)}>
    <LabelWithExtras label={label} others={others} textClass="text-xs" />
    <input
      type="color"
      value={value}
      onChange={onChange}
      className="w-full h-8 rounded"
    />
    {infoText && (
      <p
        className={cn(
          infoVisble && "invisible",
          "text-[10px] mt-1 whitespace-nowrap"
        )}
      >
        {infoText}
      </p>
    )}
  </div>
);

const TextArea = ({ mt, label, value, onChange, fontSmall, others }) => (
  <div className={mt ? "mt-4" : mt}>
    <LabelWithExtras label={label} others={others} textClass="text-xs" />
    <textarea
      value={value}
      onChange={onChange}
      className={cn(
        "w-full p-2 rounded-md resize-y min-h-[60px] font-mono bg-white text-black",
        fontSmall ? "text-[11px]" : "text-sm"
      )}
    />
  </div>
);

const EditableText = forwardRef(({ textStyle, styles, updateStyle }, ref) => {
  const defaultBgColor = "#ffffff";
  const childRef = useRef(null);
  const [customBgColor, setCustomBgColor] = useState(defaultBgColor);
  const [isBgColorEnabled, setBgEnabled] = useState(false);
  const isShouldPickBackground = shouldPickBackground(customBgColor);

  const resetAll = () => {
    setCustomBgColor(defaultBgColor);
    setBgEnabled(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      resetAll,
    }),
    [defaultBgColor]
  );

  useEffect(() => {
    if (styles.enableTextGradient) {
      setBgEnabled(true);
    } else {
      setBgEnabled(false);
    }
  }, [styles.enableTextGradient]);

  useEffect(() => {
    if (
      shouldPickBackground(styles.color) ||
      shouldPickBackground(styles.WebkitTextStrokeColor)
    ) {
      setCustomBgColor(defaultColor);
    } else {
      setCustomBgColor(defaultBgColor);
    }
  }, [styles.color, styles.WebkitTextStrokeColor]);

  const htmlToPlainText = (html = "") => {
    if (!html) return "";
    let s = html;

    s = s.replace(/<div><br\s*\/?><\/div>/gi, "<br>");
    s = s.replace(/<div>(.*?)<\/div>/gi, "$1<br>");
    s = s.replace(/<p>(.*?)<\/p>/gi, "$1<br>");
    s = s.replace(/<br\s*\/?>/gi, "\n");
    s = s.replace(/<[^>]+>/g, "");

    const tmp = document.createElement("textarea");
    tmp.innerHTML = s;
    s = tmp.value;

    return s.replace(/\u00A0/g, "").replace(/\u200B/g, "");
  };

  const textToHtml = (text = "") =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\r\n|\r|\n/g, "<br>");

  const normalize = (str = "") => str.replace(/\s+/g, " ").trim();

  const handleChange = (e) => {
    const html = e.target.value;
    const plain = htmlToPlainText(html);
    if (plain !== (styles.text || "")) {
      updateStyle({ text: plain });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      const sel = window.getSelection();
      if (sel && sel.toString().length > 0) {
        const selected = normalize(sel.toString());
        const whole = normalize(styles.text || "");
        if (selected === whole) {
          e.preventDefault();
          updateStyle({ text: "" });
          setTimeout(() => childRef.current && childRef.current.focus(), 0);
        }
      }
    }
  };

  const html = textToHtml(styles.text || "");

  const focusAtEnd = (el, event) => {
    if (!el) return;
    if (childRef.current && !childRef.current.contains(event.target)) {
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  console.log(
    "ss",
    customBgColor !== defaultBgColor && isBgColorEnabled
      ? customBgColor
      : undefined ??
          pickBackground(styles.WebkitTextStrokeColor) ??
          pickBackground(styles.color) ??
          defaultBgColor
  );

  return (
    <div>
      <div
        onClick={(event) => focusAtEnd(childRef.current, event)}
        className="min-h-[200px] lg:max-w-[550px] overflow-x-auto text-black p-6 rounded-lg bg-white relative [@media(min-width:1450px)]:max-w-[650px]"
        title="Click to edit"
        style={{
          backgroundColor: customBgColor,
        }}
      >
        <ContentEditable
          innerRef={childRef}
          html={html}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={textStyle}
          className="focus:outline-none focus:ring-0"
        />
      </div>
      <div className="flex h-14 mt-2 gap-2 relative">
        <span className="h-full flex flex-col items-center grow-[0.1]">
          Background Color:
          <ToggleSwitch
            enabled={isBgColorEnabled}
            onClick={() => setBgEnabled(!isBgColorEnabled)}
          />
        </span>
        <div
          className={cn(
            !isBgColorEnabled && inputsDisableClasses,
            "flex grow-5 gap-2 z-10"
          )}
        >
          <InputColor
            label="Custom"
            value={customBgColor}
            onChange={(e) => setCustomBgColor(e.target.value)}
            className="grow-[4]"
          />
          <button
            onClick={() => {
              setCustomBgColor(
                isShouldPickBackground ? defaultColor : defaultBgColor
              );
            }}
            className={cn(
              "inline-block h-8 w-32 py-0.5 px-1border rounded-full shadow text-[11px] grow mt-4.5",
              !isShouldPickBackground
                ? "bg-white text-black"
                : "bg-black/70 text-white"
            )}
          >
            !bg-color <span className="text-xs">B/W</span>
          </button>
        </div>
      </div>
    </div>
  );
});

const ColumnGrid = ({ children, gap = 3, stackOnLg, className }) => {
  const gapClasses = {
    1.5: "gap-1.5",
    3: "gap-3",
    6: "gap-6",
  };

  return (
    <div
      className={cn(
        "grid [grid-template-columns:1fr_1fr]",
        gapClasses[gap] || gapClasses[3],
        stackOnLg && "max-lg:[grid-template-columns:1fr]",
        className
      )}
    >
      {children}
    </div>
  );
};

const LabelWithExtras = ({ label, others, textClass, diffTextClass }) =>
  Boolean(others) ? (
    <div className="flex">
      <label
        className={cn(
          "block font-medium mb-1",
          diffTextClass ?? textClass ?? "text-sm"
        )}
      >
        {label}
      </label>
      {others}
    </div>
  ) : (
    <label className={cn("block font-medium mb-1", textClass ?? "text-sm")}>
      {label}
    </label>
  );

StyleSection.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.node.isRequired,
  others: PropTypes.node,
  customCss: PropTypes.string,
  permanentEnabled: PropTypes.bool,
  warning: PropTypes.shape({
    enabled: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
  }),
};

SelectWithOptions.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.array),
    PropTypes.objectOf(PropTypes.array),
  ]).isRequired,
  disabled: PropTypes.bool,
  disabledEntire: PropTypes.bool,
  valueTextDiff: PropTypes.bool,
  valueTextDiffValueNeededInText: PropTypes.bool,
  defaultNotNeded: PropTypes.bool,
  classNames: PropTypes.string,
  others: PropTypes.node,
};

InputRange.prototype = {
  label: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultVal: PropTypes.number.isRequired,
  isDisalbed: PropTypes.bool,
};

InputColor.prototype = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  isDisalbed: PropTypes.bool,
  infoText: PropTypes.string,
  infoVisble: PropTypes.bool,
  others: PropTypes.node,
  className: PropTypes.string,
};

TextArea.prototype = {
  mt: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  fontSmall: PropTypes.bool,
  others: PropTypes.node,
};

EditableText.propTypes = {
  textStyle: PropTypes.object,
  styles: PropTypes.shape({
    text: PropTypes.string,
    enablePseudo: PropTypes.bool,
  }).isRequired,
  updateStyle: PropTypes.func.isRequired,
};

ColumnGrid.propTypes = {
  children: PropTypes.node.isRequired,
  gap: PropTypes.oneOf([1.5, 3, 6]),
  stackOnLg: PropTypes.bool,
  className: PropTypes.string,
};

LabelWithExtras.propTypes = {
  label: PropTypes.string.isRequired,
  others: PropTypes.node, // isRequred but showing error
  textClass: PropTypes.string,
  diffTextClass: PropTypes.string,
};

export default AdvancedTextStylingTool;
