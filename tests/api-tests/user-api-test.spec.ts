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

test.describe('User API - happy path (create/delete)', () => {

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

    test('TC - 02 Verify Login ', async ({ request }) => {
        const res = await request.post('https://automationexercise.com/api/verifyLogin', {
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
        expect(json.responseCode).toEqual(200);
        expect(json.message).toEqual("User exists!");
    });

    test('TC - 03 Get User Account by Email', async ({ request }) => {
        // const res = await request.get("https://automationexercise.com/api/getUserDetailByEmail?email=cohen@gmail.com");
        //   const res = await request.get("https://automationexercise.com/api/getUserDetailByEmail?email=${encodeURIComponent(USER_EMAIL)}");
        const url = `https://automationexercise.com//api/getUserDetailByEmail?email=${encodeURIComponent(USER_EMAIL)}`;
        const res = await request.get(url);
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
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
                birth_day: expect.stringMatching(/\S/),
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
            email: USER_EMAIL,
            password: USER_PASSWORD,
            address1: NEW_ADDRESS1,
            address2: NEW_ADDRESS2,
            zipcode: NEW_ZIPCODE,
            city: NEW_CITY,
        }).toString();

        const res = await request.put('https://automationexercise.com/api/updateAccount', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: form,
        });

        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
        console.log('RESPONSE SCHEMA:\n', JSON.stringify(json, null, 2));
        expect(json.responseCode).toEqual(200);
        expect(json.message).toEqual("User updated!");
        console.log('UPDATED FIELDS =>', {
            address1: NEW_ADDRESS1,
            address2: NEW_ADDRESS2,
            zipcode: NEW_ZIPCODE,
            city: NEW_CITY,
        });
    });

    test('TC - 05 Get User Account by Email', async ({ request }) => {
        const EXPECTED_ADDRESS1 = 'Ha Shoshan 10';
        const EXPECTED_ADDRESS2 = 'Ha Shaked 20';
        const EXPECTED_ZIPCODE = '222222';
        const EXPECTED_CITY = 'Sabion';
        const res = await request.get("https://automationexercise.com/api/getUserDetailByEmail?email=cohen@gmail.com");
        expect(res.status(), 'status code').toBe(200);
        const bodyText = await res.text();
        const json = safeParse(bodyText);
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
                birth_day: expect.stringMatching(/\S/),
                birth_month: expect.stringMatching(/\S/),
                birth_year: expect.stringMatching(/\S/),
                first_name: expect.stringMatching(/\S/),
                last_name: expect.stringMatching(/\S/),
                company: expect.stringMatching(/\S/),
                address1: EXPECTED_ADDRESS1,
                address2: EXPECTED_ADDRESS2,
                country: expect.stringMatching(/\S/),
                state: expect.stringMatching(/\S/),
                city: EXPECTED_CITY,
                zipcode: EXPECTED_ZIPCODE,
            }),


        )
    });

    test('TC - 06 Delete User Account', async ({ request }) => {
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
