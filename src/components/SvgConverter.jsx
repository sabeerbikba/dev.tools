import { useCallback } from "react";
// import { EditorPanelProps } from "@components/EditorPanel";
import svgToDataUrl from "svg-to-dataurl";
import PropTypes from 'prop-types';
import { Alert, Badge, Heading, Pane } from "evergreen-ui";

import Form from "../components/Form";
import ConversionPanel, { Transformer } from "../components/ConversionPanel";

export const SvgConverter = ({
  transformer,
  resultTitle,
  formFields,
  optimizedValue,
  settings,
  setSettings
}) => {
  const getSettingsPanel = useCallback(({ open, toggle }) => {
    return (
      <Form
        initialValues={settings}
        open={open}
        toggle={toggle}
        title={"SVGO Settings"}
        onSubmit={setSettings}
        formsFields={formFields}
      />
    );
  }, []);

  return (
    <ConversionPanel
      transformer={transformer}
      editorTitle="SVG"
      resultLanguage="javascript"
      resultTitle={resultTitle}
      editorLanguage="html"
      editorDefaultValue="svg"
      settings={settings}
      editorProps={{
        settingElement: getSettingsPanel,
        topNotifications: ({ toggleSettings }) =>
          settings.optimizeSvg && (
            <Alert
              intent="warning"
              backgroundColor="#FEF8E7"
              title={
                <>
                  SVGO optimization is turned on. You can turn it off or
                  configure it in{" "}
                  <Heading
                    size={400}
                    is="a"
                    color={"blue"}
                    onClick={toggleSettings}
                  >
                    settings
                  </Heading>
                </>
              }
            />
          ),
        previewElement: (value) => (
          <Pane display="flex" flexDirection="row" flex={1}>
            <Pane display={"flex"} flex={1} position="relative">
              <img
                style={{
                  flex: 1,
                  width: "100%",
                  borderRight: "1px solid #eee"
                }}
                src={svgToDataUrl(value)}
                alt="original"
              />

              <Badge
                position="absolute"
                bottom={10}
                right={10}
                color="green"
                isSolid
              >
                Original
              </Badge>
            </Pane>
            <Pane display={"flex"} flex={1} position="relative">
              {optimizedValue && (
                <img
                  style={{
                    flex: 1,
                    width: "100%"
                  }}
                  src={svgToDataUrl(optimizedValue)}
                  alt="optimized"
                />
              )}

              <Badge
                position="absolute"
                bottom={10}
                right={10}
                color="green"
                isSolid
              >
                Result
              </Badge>
            </Pane>
          </Pane>
        ),
        acceptFiles: "image/svg+xml"
      }}
    />
  );
};
SvgConverter.propTypes = {
  transformer: PropTypes.func.isRequired,
  resultTitle: PropTypes.string.isRequired,
  formFields: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isDisabled: PropTypes.func,
    props: PropTypes.object,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    }))
  })).isRequired,
  optimizedValue: PropTypes.string,
  settings: PropTypes.object.isRequired,
  setSettings: PropTypes.func.isRequired,
};