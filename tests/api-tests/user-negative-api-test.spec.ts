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

const USER_EMAIL = "cohen@gmail.com";
const USER_PASSWORD = "1234";
const USER_NAME = "Haim Cohen";
const INVALID_USER_EMAIL = "levi@gmail.com";
const INVALID_USER_PASSWORD = "4321";


test.describe('User API - negative (create/delete)', () => {

    test('TC - 01 Create/Register User Account ', async ({ request }) => {

        const form = new URLSearchParams({
            name: USER_NAME,
            email: USER_EMAIL,
            password: USER_PASSWORD,
            title: "Mr",
            birth_date: "11",
            birth_month: "12",
            birth_year: "1975",
            firstname: "Haim",
            lastname: "Cohen",
            company: "Cohen.td",
            address1: "Ha Iasmin 10",
            address2: "Ha Zayt 20",
            country: "Israel",
            state: "Central District",
            city: "Tel Aviv",
            zipcode: "12345",
            mobile_number: "050-1234567"
        }).toString();

        const res = await request.post('https://automationexercise.com/api/createAccount', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: form,
        });
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        console.log('RESPONSE SCHEMA:\n', JSON.stringify(json, null, 2));
        expect(json.responseCode).toEqual(201);
        expect(json.message).toEqual("User created!");
    });

    test('TC - 02 Create/Register User Account with registered email (negative) ', async ({ request }) => {
        const form = new URLSearchParams({
            name: USER_NAME,
            email: USER_EMAIL,
            password: USER_PASSWORD,
            title: "Mr",
            birth_date: "11",
            birth_month: "12",
            birth_year: "1975",
            firstname: "Haim",
            lastname: "Cohen",
            company: "Cohen.td",
            address1: "Ha Iasmin 10",
            address2: "Ha Zayt 20",
            country: "Israel",
            state: "Central District",
            city: "Tel Aviv",
            zipcode: "12345",
            mobile_number: "050-1234567"
        }).toString();

        const res = await request.post('https://automationexercise.com/api/createAccount', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: form,
        });
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        console.log('RESPONSE SCHEMA:\n', JSON.stringify(json, null, 2));
        expect(json.responseCode).toEqual(400);
        expect(json.message).toEqual("Email already exists!");
    });

    test('TC - 03 POST To Verify Login without email parameter ', async ({ request }) => {
        const res = await request.post('https://automationexercise.com/api/verifyLogin', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({
                password: USER_PASSWORD,
            }).toString(),
        });
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        console.log('RESPONSE SCHEMA:\n', JSON.stringify(json, null, 2));
        expect(json.responseCode).toEqual(400);
        expect(json.message).toEqual("Bad request, email or password parameter is missing in POST request.");
    });

    test('TC - 04 To Verify Login without password parameter', async ({ request }) => {
        const res = await request.post('https://automationexercise.com/api/verifyLogin', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({
                email: USER_EMAIL,
            }).toString(),
        });
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        console.log('RESPONSE SCHEMA:\n', JSON.stringify(json, null, 2));
        expect(json.responseCode).toEqual(400);
        expect(json.message).toEqual("Bad request, email or password parameter is missing in POST request.");
    })

    test('TC - 05 Verify Login with invalid email', async ({ request }) => {
        const res = await request.post('https://automationexercise.com/api/verifyLogin', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({
                email: INVALID_USER_EMAIL,
                password: USER_PASSWORD,
            }).toString(),
        });
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        console.log('RESPONSE SCHEMA:\n', JSON.stringify(json, null, 2));
        expect(json.responseCode).toEqual(404);
        expect(json.message).toEqual("User not found!");
    });

    test('TC - 06 Verify Login with invalid password', async ({ request }) => {
        const res = await request.post('https://automationexercise.com/api/verifyLogin', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({
                email: USER_EMAIL,
                password: INVALID_USER_PASSWORD,
            }).toString(),
        });
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        console.log('RESPONSE SCHEMA:\n', JSON.stringify(json, null, 2));
        expect(json.responseCode).toEqual(404);
        expect(json.message).toEqual("User not found!");
    });

    test('TC - 07 DEL To Verify Login (method not supported)', async ({ request }) => {
        const res = await request.delete('https://automationexercise.com/api/verifyLogin', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({
                email: USER_EMAIL,
                password: USER_PASSWORD,
            }).toString(),
        });
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        console.log('RESPONSE SCHEMA:\n', JSON.stringify(json, null, 2));
        expect(json.responseCode).toEqual(405);
        expect(json.message).toEqual("This request method is not supported.");
    });

    test('TC - 08 Delete User Account', async ({ request }) => {
        const res = await request.delete('https://automationexercise.com/api/deleteAccount', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({
                email: USER_EMAIL,
                password: USER_PASSWORD,
            }).toString(),
        });
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        expect(json.responseCode).toEqual(200);
        expect(json.message).toEqual("Account deleted!");
        console.log('RESPONSE SCHEMA:\n', JSON.stringify(json, null, 2));
    });







})

