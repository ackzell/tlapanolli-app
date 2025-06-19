// THIS WAS WRITTEN ENTIRELY BY CLAUDE AI
// TODO: TRIPLE CHECK

import type { Directive, DirectiveBinding } from 'vue';

type SiblingFocusOptions = {
  prevClass?: string;
  nextClass?: string;
  itemSelector?: string;
  enableMultiple?: boolean;
  maxSiblings?: number;
  enableHover?: boolean;
  prioritizeFocus?: boolean;
  clearHoverOnKeyboard?: boolean;
  mouseMoveThreshold?: number; // Minimum pixels to consider as actual movement
};

type ExtendedHTMLElement = {
  _siblingFocusCleanup?: () => void;
  _siblingFocusOptions?: SiblingFocusOptions;
  _lastInteractionType?: 'mouse' | 'keyboard';
  _lastHoveredElement?: HTMLElement | null;
  _lastMousePosition?: { x: number; y: number };
  _ignoreMouseEvents?: boolean;
} & HTMLElement;

const defaultOptions: Required<SiblingFocusOptions> = {
  prevClass: 'prev-sibling',
  nextClass: 'next-sibling',
  itemSelector: 'a',
  enableMultiple: false,
  maxSiblings: 1,
  enableHover: true,
  prioritizeFocus: true,
  clearHoverOnKeyboard: true,
  mouseMoveThreshold: 5, // pixels
};

export const vSiblingFocus: Directive<ExtendedHTMLElement, SiblingFocusOptions | undefined> = {
  mounted(el: ExtendedHTMLElement, binding: DirectiveBinding<SiblingFocusOptions | undefined>) {
    injectKeyboardModeStyles();

    const options: Required<SiblingFocusOptions> = {
      ...defaultOptions,
      ...binding.value,
    };

    el._siblingFocusOptions = options;
    el._lastInteractionType = 'mouse';
    el._lastHoveredElement = null;
    el._lastMousePosition = { x: 0, y: 0 };
    el._ignoreMouseEvents = false;

    function clearSiblingClasses(): void {
      const { prevClass, nextClass, maxSiblings } = options;

      for (let i = 1; i <= maxSiblings; i++) {
        const prevSelector = maxSiblings > 1 ? `.${prevClass}-${i}` : `.${prevClass}`;
        const nextSelector = maxSiblings > 1 ? `.${nextClass}-${i}` : `.${nextClass}`;

        el.querySelectorAll(`${prevSelector}, ${nextSelector}`).forEach((item: Element) => {
          if (item instanceof HTMLElement) {
            if (maxSiblings > 1) {
              item.classList.remove(`${prevClass}-${i}`, `${nextClass}-${i}`);
            }
            else {
              item.classList.remove(prevClass, nextClass);
            }
          }
        });
      }
    }

    function updateSiblingsForElement(targetElement: Element): void {
      const { itemSelector, prevClass, nextClass, enableMultiple, maxSiblings } = options;

      const targetItem = targetElement.closest(itemSelector) as HTMLElement | null;
      if (!targetItem)
        return;

      const items = Array.from(el.querySelectorAll(itemSelector)) as HTMLElement[];
      const currentIndex = items.indexOf(targetItem);

      if (currentIndex === -1)
        return;

      if (enableMultiple && maxSiblings > 1) {
        for (let i = 1; i <= maxSiblings; i++) {
          const prevIndex = currentIndex - i;
          const nextIndex = currentIndex + i;

          if (prevIndex >= 0) {
            items[prevIndex].classList.add(`${prevClass}-${i}`);
          }

          if (nextIndex < items.length) {
            items[nextIndex].classList.add(`${nextClass}-${i}`);
          }
        }
      }
      else {
        if (currentIndex > 0) {
          items[currentIndex - 1].classList.add(prevClass);
        }

        if (currentIndex < items.length - 1) {
          items[currentIndex + 1].classList.add(nextClass);
        }
      }
    }

    function updateSiblingsForFocus(): void {
      const activeElement = document.activeElement;
      if (!activeElement || !el.contains(activeElement)) {
        clearSiblingClasses();
        return;
      }

      clearSiblingClasses();
      updateSiblingsForElement(activeElement);
    }

    // Track interaction type
    function setMouseMode(): void {
      el._lastInteractionType = 'mouse';
      el._ignoreMouseEvents = false;
      el.classList.remove('keyboard-mode');
    }

    function setKeyboardMode(): void {
      el._lastInteractionType = 'keyboard';
      el._ignoreMouseEvents = true; // Ignore mouse events until actual movement
      el.classList.add('keyboard-mode');

      // IMPORTANT: Clear ALL sibling classes when switching to keyboard mode
      // This removes any lingering hover effects
      clearSiblingClasses();

      // Clear hover effects when switching to keyboard
      if (options.clearHoverOnKeyboard) {
        // Focus the last hovered element if available
        if (el._lastHoveredElement && el.contains(el._lastHoveredElement)) {
          el._lastHoveredElement.focus();
        }
      }
    }

    // Check if mouse actually moved significantly (using page coordinates)
    function hasMouseMoved(event: MouseEvent): boolean {
      if (!el._lastMousePosition)
        return true;

      const currentPageX = event.pageX;
      const currentPageY = event.pageY;

      const deltaX = Math.abs(currentPageX - el._lastMousePosition.x);
      const deltaY = Math.abs(currentPageY - el._lastMousePosition.y);

      return deltaX > options.mouseMoveThreshold || deltaY > options.mouseMoveThreshold;
    }

    // Focus event handlers
    function handleFocusIn(): void {
      if (el._lastInteractionType === 'mouse') {
        setKeyboardMode();
      }

      // Small delay to ensure focus has settled, then update siblings
      requestAnimationFrame(() => {
        // Make sure we clear everything first, then apply keyboard focus styling
        clearSiblingClasses();
        updateSiblingsForFocus();
      });
    }

    function handleFocusOut(): void {
      setTimeout(() => {
        if (!el.contains(document.activeElement)) {
          clearSiblingClasses();
        }
      }, 10);
    }

    // Keyboard event handlers
    function handleKeyDown(): void {
      if (el._lastInteractionType === 'mouse') {
        setKeyboardMode();
      }

      // Update siblings after keyboard navigation
      setTimeout(() => {
        // Clear first, then apply keyboard styling
        clearSiblingClasses();
        updateSiblingsForFocus();
      }, 10);
    }

    // Mouse event handlers
    function handleMouseMove(event: MouseEvent): void {
      // Only respond to actual mouse movement when in keyboard mode
      if (el._lastInteractionType === 'keyboard' && el._ignoreMouseEvents) {
        if (!hasMouseMoved(event))
          return;

        // Actual movement detected, switch to mouse mode
        setMouseMode();
        // Unfocus current element when switching to mouse
        const activeElement = document.activeElement;
        if (activeElement && el.contains(activeElement) && 'blur' in activeElement) {
          (activeElement as HTMLElement).blur();
        }
        clearSiblingClasses();
      }

      // Update last mouse position (using page coordinates)
      el._lastMousePosition = { x: event.pageX, y: event.pageY };
    }

    function handleMouseEnter(event: MouseEvent): void {
      if (!options.enableHover)
        return;

      // Always ignore mouse enter events when in keyboard mode
      if (el._lastInteractionType === 'keyboard' && el._ignoreMouseEvents) {
        return;
      }

      const target = event.target as Element;
      if (!target || !el.contains(target))
        return;

      // Find the focusable item
      const targetItem = target.closest(options.itemSelector) as HTMLElement | null;
      if (!targetItem)
        return;

      // Store last hovered element
      el._lastHoveredElement = targetItem;

      // Only process hover if we're in mouse mode or if there's actual movement
      if (el._lastInteractionType === 'mouse' || hasMouseMoved(event)) {
        if (el._lastInteractionType === 'keyboard') {
          setMouseMode();
          // Unfocus keyboard element
          const activeElement = document.activeElement;
          if (activeElement && el.contains(activeElement) && 'blur' in activeElement) {
            (activeElement as HTMLElement).blur();
          }
        }

        clearSiblingClasses();
        updateSiblingsForElement(target);
      }
    }

    function handleMouseLeave(): void {
      if (!options.enableHover)
        return;

      // Only clear hover effects if we're in mouse mode
      if (el._lastInteractionType === 'mouse') {
        clearSiblingClasses();
      }
    }

    // Initialize mouse position (using page coordinates)
    function handleInitialMouseMove(event: MouseEvent): void {
      el._lastMousePosition = { x: event.pageX, y: event.pageY };
      document.removeEventListener('mousemove', handleInitialMouseMove);
    }
    document.addEventListener('mousemove', handleInitialMouseMove, { once: true });

    // Add event listeners
    el.addEventListener('focusin', handleFocusIn);
    el.addEventListener('focusout', handleFocusOut);
    el.addEventListener('keydown', handleKeyDown);
    el.addEventListener('mousemove', handleMouseMove);

    if (options.enableHover) {
      el.addEventListener('mouseenter', handleMouseEnter, true);
      el.addEventListener('mouseleave', handleMouseLeave);
    }

    // Store cleanup function
    el._siblingFocusCleanup = () => {
      el.removeEventListener('focusin', handleFocusIn);
      el.removeEventListener('focusout', handleFocusOut);
      el.removeEventListener('keydown', handleKeyDown);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter, true);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.classList.remove('keyboard-mode');
      clearSiblingClasses();
    };
  },

  updated(el: ExtendedHTMLElement, binding: DirectiveBinding<SiblingFocusOptions | undefined>) {
    if (binding.value !== binding.oldValue) {
      const options: Required<SiblingFocusOptions> = {
        ...defaultOptions,
        ...binding.value,
      };
      el._siblingFocusOptions = options;
    }
  },

  unmounted(el: ExtendedHTMLElement) {
    el._siblingFocusCleanup?.();
    delete el._siblingFocusOptions;
    delete el._siblingFocusCleanup;
    delete el._lastInteractionType;
    delete el._lastHoveredElement;
    delete el._lastMousePosition;
    delete el._ignoreMouseEvents;
  },
};

export type { SiblingFocusOptions };
export default vSiblingFocus;

function injectKeyboardModeStyles(): void {
  const styleId = 'sibling-focus-keyboard-styles';

  // Check if styles are already injected
  if (document.getElementById(styleId)) {
    return;
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
   /* Disable hover styles when in keyboard mode */
  .keyboard-mode .group:hover {
    border-color: inherit !important;
    box-shadow: none !important;
  }

  /* Hide cursor in keyboard mode */
  .keyboard-mode {
    cursor: none !important;
  }

  .keyboard-mode * {
    cursor: none !important;
  }
  `;

  document.head.appendChild(style);
}
