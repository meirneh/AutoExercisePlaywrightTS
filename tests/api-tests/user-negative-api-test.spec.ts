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


})

