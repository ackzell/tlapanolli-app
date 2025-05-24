// uno config goes here
import { defineConfig, presetAttributify, presetMini } from 'unocss';

export default defineConfig({
  presets: [
    presetMini(),
    presetAttributify({ /* preset options */ }),
  ],
});
