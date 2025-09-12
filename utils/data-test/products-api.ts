export const ProductsApiData = {
    endpoints: {
        products: 'https://automationexercise.com/api/productsList',
        brands: 'https://automationexercise.com//api/brandsList',
        search: 'https://automationexercise.com/api/searchProduct',
    },

    headers: {
        formUrlEncoded: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },

    expected: {
        productCount: 34,
        brandCount: 34,
        searchCount: 6,
    },

    messages: {
        missingSearchParam:
            'Bad request, search_product parameter is missing in POST request.',
        methodNotSupported:
            'This request method is not supported.',
    }, 

} as const