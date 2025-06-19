/* eslint-disable ts/consistent-type-definitions */

import type vSiblingFocus from '../directives/siblingFocus';

declare module 'vue' {
  export interface GlobalDirectives {
    vSiblingFocus: typeof vSiblingFocus;
  }
}
