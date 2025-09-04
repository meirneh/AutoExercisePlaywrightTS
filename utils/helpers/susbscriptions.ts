import type HeaderFooterPage from "../../pages/HeaderFooterPage";

export const submitSubscription = async (
    headerFooterPage: HeaderFooterPage,
    email: string,
): Promise<void> => {
    await headerFooterPage.goToSuscription();
    await headerFooterPage.verifySuscriptionTitle();
    await headerFooterPage.suscribeUser(email);
    await headerFooterPage.verifySuscribeMessage();
}