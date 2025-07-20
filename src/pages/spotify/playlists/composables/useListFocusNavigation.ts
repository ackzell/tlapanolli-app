import { onKeyStroke } from '@vueuse/core';
import { onBeforeUnmount, onMounted, watch } from 'vue';

export function useListFocusNavigation(listSelector: string, active: () => boolean, onSwitchList: () => void) {
    let listEl: HTMLElement | null = null;
    const disposers: Array<() => void> = [];

    function focusFirst() {
        const first = listEl?.querySelector(`${listSelector} > li`) as HTMLElement;
        if (first)
            first.focus();
    }

    function focusNext(element: HTMLElement) {
        const items = Array.from(listEl?.querySelectorAll(`${listSelector} > li`) || []);
        if (!(element instanceof HTMLElement))
            return;
        const idx = items.indexOf(element);
        if (idx > -1 && idx < items.length - 1) {
            (items[idx + 1] as HTMLElement).focus();
        }
    }

    function focusPrevious(element: HTMLElement) {
        const items = Array.from(listEl?.querySelectorAll('a, .spotify-track, li') || []);
        if (!(element instanceof HTMLElement))
            return;
        const idx = items.indexOf(element);
        if (idx > 0) {
            (items[idx - 1] as HTMLElement).focus();
        }
    }

    onMounted(() => {
        listEl = document.querySelector(listSelector) as HTMLElement;
        if (active())
            focusFirst();

        disposers.push(
            onKeyStroke(['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'], (e) => {
                if (!active())
                    return;
                const activeElement = document.activeElement as HTMLElement;
                if (!listEl?.contains(activeElement))
                    return;

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    focusNext(activeElement);
                }
                else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    focusPrevious(activeElement);
                }
                else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    onSwitchList();
                }
            }),
        );
    });

    onBeforeUnmount(() => {
        disposers.forEach(dispose => dispose());
    });

    // Refocus first item when list becomes active
    watch(active, (val) => {
        if (val)
            focusFirst();
    });
}
