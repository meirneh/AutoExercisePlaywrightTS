
import { test, expect } from "../../utils/fixtures/fixtures";
import { UsersApiData, UserApiPayloads, DefaultUpdate } from "../../utils/data-test/users-api";
import { parse, toFormUrlEncoded, FORM_URLENCODED_HEADER } from "../../utils/helpers/apiHelpers"

test.describe('User API - happy path (create/delete)', () => {

    test('TC - 01 Create/Register User Account ', async ({ api }) => {
        const { res, json } = await api.createUser();
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.created);
        expect(json.message).toEqual(UsersApiData.messages.userCreated);
    });

    test('TC - 02 Verify Login ', async ({ api }) => {
        const { res, json } = await api.loginUser();
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.ok);
        expect(json.message).toEqual(UsersApiData.messages.userExists);
    });

    test('TC - 03 Get User Account by Email', async ({ api }) => {
        const { res, json } = await api.getUserByEmail();
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
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
            headers: FORM_URLENCODED_HEADER,
            data: toFormUrlEncoded(UserApiPayloads.update(undefined, DefaultUpdate)),
        });
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        const json: any = await parse(res);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.ok);
        expect(json.message).toEqual(UsersApiData.messages.userUpdated);
    });

    test('TC - 05 Get User Account by Email', async ({ api }) => {
        const { res, json } = await api.getUserByEmail();
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.ok);
        expect(json).toEqual(
            expect.objectContaining({
                responseCode: UsersApiData.expected.responseCodes.ok,
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

    test('TC - 06 Delete User Account', async ({ api }) => {
        const { res, json } = await api.deleteUser();
        expect(res.status(), 'status code').toBe(UsersApiData.expected.httpOk);
        expect(json.responseCode).toEqual(UsersApiData.expected.responseCodes.ok);
        expect(json.message).toEqual(UsersApiData.messages.accountDeleted);
    });
})
