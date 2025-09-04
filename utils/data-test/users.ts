import type { UserData } from "../../pages/SignUpPage";
export const userData: UserData = {
    accountInfo: {
        name: "Haim Cohen",
        email: "cohen@gmail.com",
        password: "1234",
        gender: "Mr"
    },
    birthDate: { day: "11", month: "12", year: "1975" },
    options: { newsletter: true, offers: true },
    address: {
        firstName: "Haim",
        lastName: "Cohen",
        company: "Cohen.td",
        address1: "Ha Iasmin 10",
        address2: "Ha Zayt 20",
        country: "Israel",
        state: "Central District",
        city: "Tel Aviv",
        zipcode: "12345",
        mobileNumber: "050-1234567"
    }
};