import { test, expect } from "@playwright/test";
import { UsersApiData, UserApiPayloads, DefaultUpdate } from "../../utils/data-test/users-api"

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

test.describe('User API - happy path (create/delete)', () => {

    test('TC - 01 Create/Register User Account ', async ({ request }) => {
        const form = new URLSearchParams(UserApiPayloads.create()).toString();
        const res = await request.post(UsersApiData.endpoints.create, {
            headers: UsersApiData.headers.formUrlEncoded,
            data: form,
        });

        expect(res.status(), 'status code').toBe(200);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(201);
        expect(json.message).toEqual("User created!");
    });

    test('TC - 02 Verify Login ', async ({ request }) => {
        const res = await request.post(UsersApiData.endpoints.login, {
            headers: UsersApiData.headers.formUrlEncoded,
            data: new URLSearchParams(UserApiPayloads.login()).toString(),
        })

        expect(res.status(), 'status code').toBe(200);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.httpOk);
        expect(json.message).toEqual(UsersApiData.messages.userExists);
    });

    test('TC - 03 Get User Account by Email', async ({ request }) => {
        const res = await request.get(
            `${UsersApiData.endpoints.getByEmail}?email=${encodeURIComponent(UserApiPayloads.getByEmail().email)}`
        );
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.httpOk);
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
        const res = await request.put(UsersApiData.endpoints.update, {
            headers: UsersApiData.headers.formUrlEncoded,
            data: new URLSearchParams(UserApiPayloads.update(undefined, DefaultUpdate)).toString(),
        });
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.ok);
        expect(json.message).toEqual(UsersApiData.messages.userUpdated);
    });

    test('TC - 05 Get User Account by Email', async ({ request }) => {
        const res = await request.get(`${UsersApiData.endpoints.getByEmail}?email=${encodeURIComponent(UserApiPayloads.getByEmail().email)}`);
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.ok);
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
                address1: DefaultUpdate.address1,
                address2: DefaultUpdate.address2,
                country: expect.stringMatching(/\S/),
                state: expect.stringMatching(/\S/),
                zipcode: DefaultUpdate.zipcode,
                city: DefaultUpdate.city,
            })
        );
    });

    test('TC - 06 Delete User Account', async ({ request }) => {
        const res = await request.delete(UsersApiData.endpoints.delete, {
            headers: UsersApiData.headers.formUrlEncoded,
            data: new URLSearchParams(UserApiPayloads.delete()).toString(),
        });
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.ok);
        expect(json.message).toEqual(UsersApiData.messages.accountDeleted);
    });
})
