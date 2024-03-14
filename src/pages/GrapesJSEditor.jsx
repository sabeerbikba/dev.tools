import GjsEditor from '@grapesjs/react';
import grapesjs from 'grapesjs';
import gjsblockbasic from 'grapesjs-blocks-basic';
import customCodePlugin from 'grapesjs-custom-code';
import gjsPluginExport from 'grapesjs-plugin-export';
import gjsForms from 'grapesjs-plugin-forms';
import gjsPresetNewsletter from 'grapesjs-preset-newsletter';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsStyleBg from 'grapesjs-style-bg';
import gjsStyleFilter from 'grapesjs-style-filter';
import gjsStyleGradient from 'grapesjs-style-gradient';
import gjsTuiImageEditor from 'grapesjs-tui-image-editor';
import 'grapesjs/dist/css/grapes.min.css';

export default function GrapesJSEditor() {
  const onEditor = (editor) => {
    console.log('Editor loaded', { editor });
  };

  return (
    <div style={{ minWidth: '1620px' }}>
      <GjsEditor
        grapesjs={grapesjs}
        options={{
          height: '100vh',
          storageManager: true,
          plugins: [
            gjsblockbasic,
            customCodePlugin,
            gjsPluginExport,
            gjsForms,
            gjsPresetNewsletter,
            gjsPresetWebpage,
            gjsStyleBg,
            gjsStyleFilter,
            gjsStyleGradient,
            gjsTuiImageEditor,
          ]
        }}
        onEditor={onEditor}
      />
    </div>
  );
}