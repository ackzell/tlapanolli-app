import antfu from '@antfu/eslint-config';

export default antfu({
  unocss: true,
  vue: true,
  rules: {
    'no-console': 'warn',
    // // some import errors happening if I don't have this line
    // 'perfectionist/sort-imports': ['error', { type: 'natural' }],

    // todo: Activate this if .env becomes important
    // 'node/no-process-env': ['error'],
  },
  stylistic: {
    semi: true,
  },
});
