import { test, expect } from "@playwright/test";
import { userData } from "../../utils/data-test/users";

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

async function parse(res: Response | any) {
    const bodyText = await res.text();
    return safeParse(bodyText);
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
    title: userData.accountInfo.gender,
    name: userData.accountInfo.name,
    email: userData.accountInfo.email,
    password: userData.accountInfo.password,
    birth_day: userData.birthDate.day,
    birth_month: userData.birthDate.month,
    birth_year: userData.birthDate.year,
    firstname: userData.address.firstName,
    lastname: userData.address.lastName,
    company: userData.address.company,
    address1: userData.address.address1,
    address2: userData.address.address2,
    country: userData.address.country,
    state: userData.address.state,
    city: userData.address.city,
    zipcode: userData.address.zipcode,
    mobile_number: userData.address.mobileNumber,
};

const INVALID = {
    noRegistered: "levi@gmail.com",
    wrongPassword: "4321",
};


test.describe('User API - negative (create/delete)', () => {

    test('TC - 01 Create/Register User Account ', async ({ request }) => {

        const form = new URLSearchParams({
            name: USER.name,
            email: USER.email,
            password: USER.password,
            title: USER.title,
            birth_day: USER.birth_day,
            birth_month: USER.birth_month,
            birth_year: USER.birth_year,
            firstname: USER.firstname,
            lastname: USER.lastname,
            company: USER.company,
            address1: USER.address1,
            address2: USER.address2,
            country: USER.country,
            state: USER.state,
            city: USER.city,
            zipcode: USER.zipcode,
            mobile_number: USER.mobile_number,
        }).toString();

        const res = await request.post(API.CREATE, {
            headers: FORM_HEADERS,
            data: form,
        });

        expect(res.status(), 'status code').toBe(200);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(201);
        expect(json.message).toEqual("User created!");
    });

    test('TC - 02 Create/Register User Account with registered email (negative) ', async ({ request }) => {
        const form = new URLSearchParams({
            name: USER.name,
            email: USER.email,
            password: USER.password,
            title: USER.title,
            birth_day: USER.birth_day,
            birth_month: USER.birth_month,
            birth_year: USER.birth_year,
            firstname: USER.firstname,
            lastname: USER.lastname,
            company: USER.company,
            address1: USER.address1,
            address2: USER.address2,
            country: USER.country,
            state: USER.state,
            city: USER.city,
            zipcode: USER.zipcode,
            mobile_number: USER.mobile_number,
        }).toString();


        const res = await request.post(API.CREATE, {
            headers: FORM_HEADERS,
            data: form,
        });

        expect(res.status(), 'status code').toBe(200);
        const json: any = await parse(res);
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

