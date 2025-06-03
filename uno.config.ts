// uno config goes here
import { defineConfig, presetAttributify, presetWind4 } from 'unocss';

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify({ /* preset options */ }),
  ],
  shortcuts: {
    btn: 'px-4 py-1 rounded  bg-green-600 text-white cursor-pointer hover:bg-green-700 disabled:opacity-50 disabled:cursor-default',
  },

});
