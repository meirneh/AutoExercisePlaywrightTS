import { userData } from "./users";

export const UsersApiData = {

    endpoints: {
        create: "https://automationexercise.com/api/createAccount",
        login: "https://automationexercise.com/api/verifyLogin",
        getByEmail: "https://automationexercise.com/api/getUserDetailByEmail",
        update: "https://automationexercise.com/api/updateAccount",
        delete: "https://automationexercise.com/api/deleteAccount",
    },

    headers: {
        formUrlEncoded: { "Content-Type": "application/x-www-form-urlencoded" },
    },
    expected: {
        httpOk: 200,
        responseCodes: {
            created: 201,
            ok: 200,
        },
    },
    messages: {
        userCreated: "User created!",
        userExists: "User exists!",
        userUpdated: "User updated!",
        accountDeleted: "Account deleted!",
    },

} as const;

export const DefaultUpdate = {
    address1: "Ha Shoshan 10",
    address2: "Ha Shaked 20",
    zipcode: "222222",
    city: "Sabion",
} as const;

export const UserApiPayloads = {
    create: (ud = userData) => ({
        name: ud.accountInfo.name,
        email: ud.accountInfo.email,
        password: ud.accountInfo.password,
        title: ud.accountInfo.gender,
        birth_day: ud.birthDate.day,
        birth_month: ud.birthDate.month,
        birth_year: ud.birthDate.year,
        firstname: ud.address.firstName,
        lastname: ud.address.lastName,
        company: ud.address.company,
        address1: ud.address.address1,
        address2: ud.address.address2,
        country: ud.address.country,
        state: ud.address.state,
        city: ud.address.city,
        zipcode: ud.address.zipcode,
        mobile_number: ud.address.mobileNumber,
    }),

    login: (ud = userData) => ({
        email: ud.accountInfo.email,
        password: ud.accountInfo.password,
    }),
    getByEmail: (ud = userData) => ({
        email: ud.accountInfo.email,
    }),
    update: (ud = userData, upd = DefaultUpdate) => ({
        email: ud.accountInfo.email,
        password: ud.accountInfo.password,
        address1: upd.address1,
        address2: upd.address2,
        zipcode: upd.zipcode,
        city: upd.city,
    }),

    delete: (ud = userData) => ({
        email: ud.accountInfo.email,
        password: ud.accountInfo.password,
    }),
}