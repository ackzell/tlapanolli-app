import type { Directive } from 'vue';

type SiblingFocusOptions = {
  prevClass?: string;
  nextClass?: string;
  itemSelector?: string;
  maxSiblings?: number;
};

const defaultOptions: Required<SiblingFocusOptions> = {
  prevClass: 'prev-sibling',
  nextClass: 'next-sibling',
  itemSelector: 'a',
  maxSiblings: 1,
};

function clearSiblingClasses(el: HTMLElement, options: Required<SiblingFocusOptions>) {
  const { prevClass, nextClass, maxSiblings } = options;
  for (let i = 1; i <= maxSiblings; i++) {
    const prevSelector = maxSiblings > 1 ? `.${prevClass}-${i}` : `.${prevClass}`;
    const nextSelector = maxSiblings > 1 ? `.${nextClass}-${i}` : `.${nextClass}`;
    el.querySelectorAll(`${prevSelector}, ${nextSelector}`).forEach((item) => {
      item.classList.remove(`${prevClass}-${i}`, `${nextClass}-${i}`, prevClass, nextClass);
    });
  }
}

function updateSiblings(el: HTMLElement, target: Element, options: Required<SiblingFocusOptions>) {
  const { itemSelector, prevClass, nextClass, maxSiblings } = options;
  const targetItem = target.closest(itemSelector) as HTMLElement | null;
  if (!targetItem)
    return;
  const items = Array.from(el.querySelectorAll(itemSelector)) as HTMLElement[];
  const currentIndex = items.indexOf(targetItem);
  if (currentIndex === -1)
    return;

  for (let i = 1; i <= maxSiblings; i++) {
    const prevIndex = currentIndex - i;
    const nextIndex = currentIndex + i;
    if (prevIndex >= 0) {
      items[prevIndex].classList.add(maxSiblings > 1 ? `${prevClass}-${i}` : prevClass);
    }
    if (nextIndex < items.length) {
      items[nextIndex].classList.add(maxSiblings > 1 ? `${nextClass}-${i}` : nextClass);
    }
  }
}

export const vSiblingFocus: Directive<HTMLElement, SiblingFocusOptions | undefined> = {
  mounted(el, binding) {
    const options: Required<SiblingFocusOptions> = {
      ...defaultOptions,
      ...binding.value,
    };

    function handle(event: Event) {
      clearSiblingClasses(el, options);
      updateSiblings(el, event.target as Element, options);
    }

    function clear() {
      clearSiblingClasses(el, options);
    }

    el.addEventListener('focusin', handle, true);
    el.addEventListener('mouseenter', handle, true);
    el.addEventListener('focusout', clear, true);
    el.addEventListener('mouseleave', clear, true);

    (el as any)._siblingFocusCleanup = () => {
      el.removeEventListener('focusin', handle, true);
      el.removeEventListener('mouseenter', handle, true);
      el.removeEventListener('focusout', clear, true);
      el.removeEventListener('mouseleave', clear, true);
      clearSiblingClasses(el, options);
    };
  },
  updated(el, binding) {
    // Optionally clear classes if config changes
    clearSiblingClasses(el, {
      ...defaultOptions,
      ...binding.value,
    });
  },
  unmounted(el) {
    (el as any)._siblingFocusCleanup?.();
    delete (el as any)._siblingFocusCleanup;
  },
};

export type { SiblingFocusOptions };
export default vSiblingFocus;
