import { test, expect } from "@playwright/test";
import { QUERY as PRODUCT_SEARCH_QUERY } from "../../utils/data-test/product";
function safeParse(text: string): any | null {
    try {
        return JSON.parse(text);
    } catch {
        const match = text.match(/{[\s\S]*}/); // tries to extract JSON into HTML
        if (match) {
            try { return JSON.parse(match[0]); } catch { return null; }
        }
        return null;
    }

}

const API = {
    PRODUCTS: 'https://automationexercise.com/api/productsList',
    BRANDS: 'https://automationexercise.com//api/brandsList',
    SEARCH: "https://automationexercise.com/api/searchProduct",
}

const EXPECTED_PRODUCT_COUNT = 34;
const EXPECTED_BRAND_COUNT = 34;
const EXPECTED_SEARCH_COUNT = 6;

test.describe('Products API', () => {
    test('TC - 01: GET returns full product list', async ({ request }) => {
        const res = await request.get(API.PRODUCTS);
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);

        expect(json, 'JSON parseable').toBeTruthy();
        expect(json).toEqual(
            expect.objectContaining({
                responseCode: 200,
                products: expect.any(Array),
            })
        )
        expect(json.products.length, 'products length').toBe(EXPECTED_PRODUCT_COUNT);

        for (const p of json.products) {
            expect(p).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.stringMatching(/\S/),
                    price: expect.stringMatching(/\S/),
                    brand: expect.stringMatching(/\S/),
                    category: expect.objectContaining({
                        usertype: expect.objectContaining({
                            usertype: expect.stringMatching(/\S/),
                        }),
                        category: expect.stringMatching(/\S/),
                    })


                }),

            )
        }
    });

    test('TC - 02: POST to product list is not supported (negative) ', async ({ request }) => {
        const res = await request.post(API.PRODUCTS);
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        expect(json.responseCode).toEqual(405);
        expect(json.message).toEqual("This request method is not supported.");

    });

    test('TC - 03 GET returns brands list ', async ({ request }) => {
        const res = await request.get(API.BRANDS);
        expect(res.status(), 'status code').toBe(200);

        const bodyText = await res.text();
        const json = safeParse(bodyText);
        expect(json.responseCode).toEqual(200);
        expect(json.brands.length, 'brands length').toBe(EXPECTED_BRAND_COUNT);
        expect(json, 'JSON parseable').toBeTruthy();
        expect(json).toEqual(
            expect.objectContaining({
                responseCode: 200,
                brands: expect.any(Array),
            })
        );

        for (const b of json.brands) {
            expect(b).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    brand: expect.stringMatching(/\S/),
                }),

            )
        }
    });

    test('TC - 04 PUT to brands list is not supported (negative)', async ({ request }) => {
        const res = await request.post(API.BRANDS);
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        expect(json.responseCode).toEqual(405);
        expect(json.message).toEqual("This request method is not supported.");

    });

    test('TC - 05 Search product by keyword returns filtered results', async ({ request }) => {
        // const keyword = 'top';
        const keyword = PRODUCT_SEARCH_QUERY
        const res = await request.post(API.SEARCH, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({ search_product: keyword }).toString(),
        });

        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        console.log(json.products.length, 'products length');
        expect(json.products.length, 'products length').toBe(EXPECTED_SEARCH_COUNT);
        for (const p of json.products) {
            expect(p).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.stringMatching(/\S/),
                    price: expect.stringMatching(/\S/),
                    brand: expect.stringMatching(/\S/),
                    category: expect.objectContaining({
                        usertype: expect.objectContaining({
                            usertype: expect.stringMatching(/\S/),
                        }),
                        category: expect.stringMatching(/\S/),
                    }),
                })
            );

            // Match the search term in one of the relevant fields
            const thereIsACoincidence =
                String(p.name).toLowerCase().includes(keyword.toLowerCase()) ||
                String(p.brand).toLowerCase().includes(keyword.toLowerCase()) ||
                String(p.category?.category ?? '').toLowerCase().includes(keyword.toLowerCase()) ||
                String(p.category?.usertype?.usertype ?? '').toLowerCase().includes(keyword.toLowerCase());

            expect(thereIsACoincidence).toBeTruthy();
        }
    });

    test('TC - 06 Search without parameter fails (negative) ', async ({ request }) => {
        const res = await request.post(API.SEARCH, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({}).toString(),
        });

        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        expect(json.responseCode).toEqual(400);
        expect(json.message).toEqual("Bad request, search_product parameter is missing in POST request.");
    });

})
