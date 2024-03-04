import gjsblockbasic from 'grapesjs-blocks-basic'
import grapesjs from 'grapesjs';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsPresetNewsletter from 'grapesjs-preset-newsletter';
import gjsForms from 'grapesjs-plugin-forms';
import gjsLorySlider from 'grapesjs-lory-slider'
import gjsTabs from 'grapesjs-tabs'
import customCodePlugin from 'grapesjs-custom-code';
import plugin2 from 'grapesjs-tui-image-editor';
import plugin3 from 'grapesjs-style-gradient';
import gjsStyleFilter from 'grapesjs-style-filter';
import gjsStyleBg from 'grapesjs-style-bg';
import gjsPluginExport from 'grapesjs-plugin-export';
import 'grapesjs/dist/css/grapes.min.css';
import GjsEditor from '@grapesjs/react';

export default function GrapesJSEditor() {
  const onEditor = (editor) => {
    console.log('Editor loaded', { editor });
  };

  return (
    <GjsEditor
      grapesjs={grapesjs}
      options={{
        height: '100vh',
        storageManager: false,
        plugins: [
          plugin3,
          gjsblockbasic,
          gjsPresetWebpage,
          gjsForms,
          gjsPresetNewsletter,
          gjsLorySlider,
          gjsTabs,
          customCodePlugin,
          plugin2,
          gjsStyleFilter,
          gjsStyleBg,
          gjsPluginExport,
        ]
      }}
      onEditor={onEditor}
    />
  );
}