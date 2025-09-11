import { test, expect } from "@playwright/test";

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
    CREATE: "https://automationexercise.com/api/createAccount",
    LOGIN: "https://automationexercise.com/api/verifyLogin",
    GET_BY_EMAIL: "https://automationexercise.com/api/getUserDetailByEmail",
    UPDATE: "https://automationexercise.com/api/updateAccount",
    DELETE: "https://automationexercise.com/api/deleteAccount",
};

const FORM_HEADERS = { "Content-Type": "application/x-www-form-urlencoded" };

const USER = {
    name: "Haim Cohen",
    email: "cohen@gmail.com",
    password: "1234",
    title: "Mr",
    birth_day: "1",
    birth_month: "1",
    birth_year: "1990",
    firstname: "Haim",
    lastname: "Cohen",
    company: "MyCompany",
    address1: "Ha Iasmin 10",
    address2: "Ha Zayt 2",
    country: "Israel",
    state: "Center",
    city: "Raanana",
    zipcode: "111111",
    mobile_number: "0500000000",
};

const USER_EMAIL = "cohen@gmail.com";
const USER_PASSWORD = "1234";
const USER_NAME = "Haim Cohen";
const INVALID = {
    noRegistered: "levi@gmail.com",
    wrongPassword: "4321",
};


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

        const res = await request.post(API.CREATE, {
            headers: FORM_HEADERS,
            data: form,
        });

        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
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

        const res = await request.post(API.CREATE, {
            headers: FORM_HEADERS,
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

        const res = await request.post(API.LOGIN, {
            headers: FORM_HEADERS,
            data: new URLSearchParams({
                password: USER.password,
            }).toString(),
        });
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        expect(json.responseCode).toEqual(400);
        expect(json.message).toEqual("Bad request, email or password parameter is missing in POST request.");
    });

    test('TC - 04 To Verify Login without password parameter', async ({ request }) => {

        const res = await request.post(API.LOGIN, {
            headers: FORM_HEADERS,
            data: new URLSearchParams({
                email: USER.email,
            }).toString(),
        });
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        expect(json.responseCode).toEqual(400);
        expect(json.message).toEqual("Bad request, email or password parameter is missing in POST request.");
    })

    test('TC - 05 Verify Login with invalid email', async ({ request }) => {

        const res = await request.post(API.LOGIN, {
            headers: FORM_HEADERS,
            data: new URLSearchParams({
                email: INVALID.noRegistered,
                password: USER.password,
            }).toString(),
        });
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        expect(json.responseCode).toEqual(404);
        expect(json.message).toEqual("User not found!");
    });

    test('TC - 06 Verify Login with invalid password', async ({ request }) => {
        const res = await request.post(API.LOGIN, {
            headers: FORM_HEADERS,
            data: new URLSearchParams({
                email: USER.email,
                password: INVALID.wrongPassword,
            }).toString(),
        });
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        expect(json.responseCode).toEqual(404);
        expect(json.message).toEqual("User not found!");
    });

    test('TC - 07 DEL To Verify Login (method not supported)', async ({ request }) => {
        const res = await request.delete(API.LOGIN, {
            headers: FORM_HEADERS,
            data: new URLSearchParams({
                email: USER.email,
                password: USER.password,
            }).toString(),
        });
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        expect(json.responseCode).toEqual(405);
        expect(json.message).toEqual("This request method is not supported.");
    });

    test('TC - 08 Delete User Account', async ({ request }) => {
        const res = await request.delete(API.DELETE, {
            headers: FORM_HEADERS,
            data: new URLSearchParams({
                email: USER.email,
                password: USER.password,
            }).toString(),
        });
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        expect(json.responseCode).toEqual(200);
        expect(json.message).toEqual("Account deleted!");
    });
})

