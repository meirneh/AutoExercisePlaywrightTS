// utils/helpers/consent.ts
import type { Page, Frame } from '@playwright/test';

type Root = Page | Frame;

const clickAcceptIn = async (root: Root): Promise<boolean> => {
    // 1) botón por accesibilidad (más robusto que CSS)
    const roleBtn = root.getByRole('button', { name: /^(consent|accept|i agree|allow all)$/i }).first();
    if (await roleBtn.isVisible().catch(() => false)) {
        await roleBtn.click().catch(() => { });
        return true;
    }

    // 2) fallback CSS por si el rol no engancha
    const cssBtn = root
        .locator(
            [
                'button:has-text("Consent")',
                'button:has-text("Allow all")',
                'button:has-text("I agree")',
                'button:has-text("Accept")',
            ].join(', ')
        )
        .first();
    if (await cssBtn.isVisible().catch(() => false)) {
        await cssBtn.click().catch(() => { });
        return true;
    }
    return false;
};

const pressEsc = async (root: Root): Promise<void> => {
    try {
        if ('keyboard' in root) {
            await (root as Page).keyboard.press('Escape');
        } else {
            await (root as Frame).page().keyboard.press('Escape');
        }
    } catch { }
};

const tryCloseIn = async (root: Root): Promise<boolean> => {
    // intentar click en botón
    if (await clickAcceptIn(root)) return true;

    // último recurso: ESC
    await pressEsc(root);
    return false;
};

// Público: reintenta hasta ~6s, en página y todos los iframes
export const acceptCookiesIfPresent = async (page: Page): Promise<void> => {
    const deadline = Date.now() + 6000; // ~6s
    while (Date.now() < deadline) {
        // 1) page
        if (await tryCloseIn(page)) return;

        // 2) iframes
        for (const frame of page.frames()) {
            if (await tryCloseIn(frame)) return;
        }

        // pequeño backoff para dejar que se inyecte
        await page.waitForTimeout(300);
    }
    // si no apareció, no bloqueamos el test
};

