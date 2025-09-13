import { test, expect } from "@playwright/test";
import { UsersApiData, UserApiPayloads } from "../../utils/data-test/users-api"
import { WRONG_EMAIL, WRONG_PASSWORD } from "../../utils/data-test/auth";
import { parse, toFormUrlEncoded, FORM_URLENCODED_HEADER } from "../../utils/helpers/apiHelpers";

test.describe('User API - negative (create/delete)', () => {

    test('TC - 01 Create/Register User Account ', async ({ request }) => {
        const form = new URLSearchParams(UserApiPayloads.create()).toString();
        const res = await request.post(UsersApiData.endpoints.create, {
            headers: FORM_URLENCODED_HEADER,
            data: form,
        });

        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.created);
        expect(json.message).toEqual(UsersApiData.messages.userCreated);
    });

    test('TC - 02 Create/Register User Account with registered email (negative) ', async ({ request }) => {
        const form = toFormUrlEncoded(UserApiPayloads.create());
        const res = await request.post(UsersApiData.endpoints.create, {
            headers: FORM_URLENCODED_HEADER,
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
            headers: FORM_URLENCODED_HEADER,
            data: toFormUrlEncoded({ password })
        });
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.exist);
        expect(json.message).toEqual(UsersApiData.messages.missingEmailOrPassword);
    });

    test('TC - 04 To Verify Login without password parameter', async ({ request }) => {

        const { email } = UserApiPayloads.login();
        const res = await request.post(UsersApiData.endpoints.login, {
            headers: FORM_URLENCODED_HEADER,
            data: toFormUrlEncoded({ email })
        });
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json = await parse(res)
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.exist);
        expect(json.message).toEqual(UsersApiData.messages.missingEmailOrPassword);
    })

    test('TC - 05 Verify Login with invalid email', async ({ request }) => {
        const { password } = UserApiPayloads.login();
        const res = await request.post(UsersApiData.endpoints.login, {
            headers: FORM_URLENCODED_HEADER,
            data: toFormUrlEncoded({ email: WRONG_EMAIL, password })
        });
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.notFound);
        expect(json.message).toEqual(UsersApiData.messages.userNotFound);
    });

    test('TC - 06 Verify Login with invalid password', async ({ request }) => {
        const { email } = UserApiPayloads.login();
        const res = await request.post(UsersApiData.endpoints.login, {
            headers: FORM_URLENCODED_HEADER,
            data: toFormUrlEncoded({ email, password: WRONG_PASSWORD }),
        })
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.notFound);
        expect(json.message).toEqual(UsersApiData.messages.userNotFound);
    });

    test('TC - 07 DEL To Verify Login (method not supported)', async ({ request }) => {
        const { email, password } = UserApiPayloads.login();
        const res = await request.delete(UsersApiData.endpoints.login, {
            headers: FORM_URLENCODED_HEADER,
            data: toFormUrlEncoded({ email, password }),
        })
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.methodNotSupported);
        expect(json.message).toEqual(UsersApiData.messages.methodNotSupported);
    });

   test('TC - 08 Delete User Account', async ({ request }) => {
        const res = await request.delete(UsersApiData.endpoints.delete, {
            headers: FORM_URLENCODED_HEADER,
            data: toFormUrlEncoded(UserApiPayloads.delete()),
        });
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.ok);
        expect(json.message).toEqual(UsersApiData.messages.accountDeleted);
    });
})

