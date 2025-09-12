import { test, expect } from "@playwright/test";
import { userData } from "../../utils/data-test/users";
import { UsersApiData, UserApiPayloads } from "../../utils/data-test/users-api"
import { WRONG_EMAIL, WRONG_PASSWORD } from "../../utils/data-test/auth";

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
    const bodyText = await (res.text?.() ?? res.body?.text?.() ?? Promise.resolve(""));
    return safeParse(bodyText);
}


const API = {
    CREATE: "https://automationexercise.com/api/createAccount",
    LOGIN: "https://automationexercise.com/api/verifyLogin",
    GET_BY_EMAIL: "https://automationexercise.com/api/getUserDetailByEmail",
    UPDATE: "https://automationexercise.com/api/updateAccount",
    DELETE: "https://automationexercise.com/api/deleteAccount",
};

test.describe('User API - negative (create/delete)', () => {

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

    test('TC - 02 Create/Register User Account with registered email (negative) ', async ({ request }) => {

        const form = new URLSearchParams(UserApiPayloads.create()).toString();
        const res = await request.post(UsersApiData.endpoints.create, {
            headers: UsersApiData.headers.formUrlEncoded,
            data: form,
        });
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.exist);
        expect(json.message).toEqual(UsersApiData.messages.emailAlreadyExist);
    });

    test('TC - 03 POST To Verify Login without email parameter ', async ({ request }) => {
        const { password } = UserApiPayloads.login();
        const res = await request.post(UsersApiData.endpoints.login, {
            headers: UsersApiData.headers.formUrlEncoded,
            data: new URLSearchParams({ password }).toString()
        });
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.exist);
        expect(json.message).toEqual("Bad request, email or password parameter is missing in POST request.");
    });

    test('TC - 04 To Verify Login without password parameter', async ({ request }) => {

        const { email } = UserApiPayloads.login();
        const res = await request.post(UsersApiData.endpoints.login, {
            headers: UsersApiData.headers.formUrlEncoded,
            data: new URLSearchParams({ email }).toString()
        });
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json = await parse(res)
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.exist);
        expect(json.message).toEqual(UsersApiData.messages.missingEmailOrPassword);
    })

    test('TC - 05 Verify Login with invalid email', async ({ request }) => {
        const { password } = UserApiPayloads.login();
        const res = await request.post(UsersApiData.endpoints.login, {
            headers: UsersApiData.headers.formUrlEncoded,
            data: new URLSearchParams({ email: WRONG_EMAIL, password }).toString()
        });
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.notFound);
        expect(json.message).toEqual(UsersApiData.messages.userNotFound);
    });

    test('TC - 06 Verify Login with invalid password', async ({ request }) => {
        const { email } = UserApiPayloads.login();
        const res = await request.post(UsersApiData.endpoints.login, {
            headers: UsersApiData.headers.formUrlEncoded,
            data: new URLSearchParams({ email, password: WRONG_PASSWORD }).toString(),
        })
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.notFound);
        expect(json.message).toEqual(UsersApiData.messages.userNotFound);
    });

    test('TC - 07 DEL To Verify Login (method not supported)', async ({ request }) => {
        const { email, password } = UserApiPayloads.login();
        const res = await request.delete(UsersApiData.endpoints.login, {
            headers: UsersApiData.headers.formUrlEncoded,
            data: new URLSearchParams({ email, password }).toString(),
        })
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.methodNotSupported);
        expect(json.message).toEqual(UsersApiData.messages.methodNotSupported);
    });

    test('TC - 08 Delete User Account', async ({ request }) => {
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

