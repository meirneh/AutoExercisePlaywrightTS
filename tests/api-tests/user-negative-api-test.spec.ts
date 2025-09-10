import { test, expect } from "@playwright/test";
function safeParse(text: string): any | null {
    try {
        return JSON.parse(text);
    } catch {
        const match = text.match(/{[\s\S]*}/); // intenta extraer JSON dentro de HTML
        if (match) {
            try { return JSON.parse(match[0]); } catch { return null; }
        }
        return null;
    }
}
test.describe('Products API', () => {
    test('TC-01: GET returns full product list', async ({ request }) => {
        const res = await request.get('https://automationexercise.com/api/productsList');
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        console.log('RESPONSE SCHEMA:\n', JSON.stringify(json, null, 2));

        expect(json, 'JSON parseable').toBeTruthy();
        expect(json).toEqual(
            expect.objectContaining({
                responseCode: 200,
                products: expect.any(Array),
            })
        )
        expect(json.products.length, 'products length').toBe(34);

        for (const p of json.products) {
            expect(p).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(String),
                    brand: expect.any(String),
                    category: expect.objectContaining({
                        usertype: expect.objectContaining({
                            usertype: expect.any(String),
                        }),
                        category: expect.any(String),
                    })


                }),

            )
        }
    })



})
