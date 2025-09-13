import { test, expect } from "@playwright/test";
import { QUERY as PRODUCT_SEARCH_QUERY } from "../../utils/data-test/product";
import { ProductsApiData } from "../../utils/data-test/products-api";
import { UsersApiData } from "../../utils/data-test/users-api"
import { parse, FORM_URLENCODED_HEADER, toFormUrlEncoded } from "../../utils/helpers/apiHelpers"

test.describe('Products API', () => {
    test('TC - 01: GET returns full product list', async ({ request }) => {
        const res = await request.get(ProductsApiData.endpoints.products)
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json: any = await parse(res);

        expect(json, 'JSON parseable').toBeTruthy();
        expect(json).toEqual(
            expect.objectContaining({
                responseCode: 200,
                products: expect.any(Array),
            })
        )
        expect(json.products.length, 'products length').toBe(ProductsApiData.expected.brandCount);

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
        const res = await request.post(ProductsApiData.endpoints.products)
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.methodNotSupported);
        expect(json.message).toEqual(ProductsApiData.messages.methodNotSupported);

    });

    test('TC - 03 GET returns brands list ', async ({ request }) => {
        const res = await request.get(ProductsApiData.endpoints.brands);
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.ok);
        expect(json.brands.length, 'brands length').toBe(ProductsApiData.expected.brandCount);
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
        const res = await request.post(ProductsApiData.endpoints.brands);
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.methodNotSupported);
        expect(json.message).toEqual(ProductsApiData.messages.methodNotSupported);

    });

    test('TC - 05 Search product by keyword returns filtered results', async ({ request }) => {
        const keyword = PRODUCT_SEARCH_QUERY
        const res = await request.post(ProductsApiData.endpoints.search, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({ search_product: keyword }).toString(),
        });

        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json: any = await parse(res);
        console.log(json.products.length, 'products length');
        expect(json.products.length, 'products length').toBe(ProductsApiData.expected.searchCount);
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
        const res = await request.post(ProductsApiData.endpoints.search, {
            headers: FORM_URLENCODED_HEADER,
            data: toFormUrlEncoded({}),
        });

        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.exist);
        expect(json.message).toEqual(ProductsApiData.messages.missingSearchParam);
    });

})
