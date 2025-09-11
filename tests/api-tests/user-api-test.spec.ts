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

const USER_EMAIL = "cohen@gmail.com";

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
// “New” values ​​for the update (TC-04)
const UPDATED = {
    address1: "Ha Shoshan 10",
    address2: "Ha Shaked 20",
    zipcode: "222222",
    city: "Sabion",
};


test.describe('User API - happy path (create/delete)', () => {

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

    test('TC - 02 Verify Login ', async ({ request }) => {
        const res = await request.post(API.LOGIN, {
            headers: FORM_HEADERS,
            data: new URLSearchParams({
                email: USER.email,
                password: USER.password,
            }).toString(),
        });
        expect(res.status(), 'status code').toBe(200);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(200);
        expect(json.message).toEqual("User exists!");
    });

    test('TC - 03 Get User Account by Email', async ({ request }) => {
        const res = await request.get(`${API.GET_BY_EMAIL}?email=${encodeURIComponent(USER.email)}`);
        expect(res.status(), 'status code').toBe(200);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(200);
        expect(json).toEqual(
            expect.objectContaining({
                responseCode: 200,
                user: expect.any(Object),
            })
        );
        expect(json.user).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.stringMatching(/\S/),
                email: expect.stringMatching(/\S/),
                title: expect.stringMatching(/\S/),
                birth_day: expect.any(String),
                birth_month: expect.stringMatching(/\S/),
                birth_year: expect.stringMatching(/\S/),
                first_name: expect.stringMatching(/\S/),
                last_name: expect.stringMatching(/\S/),
                company: expect.stringMatching(/\S/),
                address1: expect.stringMatching(/\S/),
                address2: expect.stringMatching(/\S/),
                country: expect.stringMatching(/\S/),
                state: expect.stringMatching(/\S/),
                city: expect.stringMatching(/\S/),
                zipcode: expect.stringMatching(/\S/),
            }),

        )
    });

    test('TC - 04 Update User Account', async ({ request }) => {
        const NEW_ADDRESS1 = 'Ha Shoshan 10';
        const NEW_ADDRESS2 = 'Ha Shaked 20';
        const NEW_ZIPCODE = '222222';
        const NEW_CITY = 'Sabion';

        const form = new URLSearchParams({
            email: USER.email,
            password: USER.password,
            address1: UPDATED.address1,
            address2: UPDATED.address2,
            zipcode: UPDATED.zipcode,
            city: UPDATED.city,
        }).toString();

        const res = await request.put(API.UPDATE, {
            headers: FORM_HEADERS,
            data: form,
        });

        expect(res.status(), 'status code').toBe(200);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(200);
        expect(json.message).toEqual("User updated!");
    });

    test('TC - 05 Get User Account by Email', async ({ request }) => {
        const res = await request.get(`${API.GET_BY_EMAIL}?email=${encodeURIComponent(USER.email)}`);

        expect(res.status(), 'status code').toBe(200);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(200);
        console.log('RESPONSE SCHEMA:\n', JSON.stringify(json, null, 2));
        expect(json).toEqual(
            expect.objectContaining({
                responseCode: 200,
                user: expect.any(Object),
            })
        );

        expect(json.user).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.stringMatching(/\S/),
                email: expect.stringMatching(/\S/),
                title: expect.stringMatching(/\S/),
                birth_day: expect.any(String),
                birth_month: expect.stringMatching(/\S/),
                birth_year: expect.stringMatching(/\S/),
                first_name: expect.stringMatching(/\S/),
                last_name: expect.stringMatching(/\S/),
                company: expect.stringMatching(/\S/),
                address1: UPDATED.address1,
                address2: UPDATED.address2,
                country: expect.stringMatching(/\S/),
                state: expect.stringMatching(/\S/),
                zipcode: UPDATED.zipcode,
                city: UPDATED.city,
            })
        );
    });

    test('TC - 06 Delete User Account', async ({ request }) => {
        const res = await request.delete(API.DELETE, {
            headers: FORM_HEADERS,
            data: new URLSearchParams({
                email: USER.email,
                password: USER.password,
            }).toString(),
        });
        expect(res.status(), 'status code').toBe(200);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(200);
        expect(json.message).toEqual("Account deleted!");
    });
})
