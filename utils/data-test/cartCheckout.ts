import type {ProductsList} from "../../pages/ProductsPage";
import type { UserData } from "../../pages/SignUpPage";
import type { DeliveryAddress } from "../../pages/CheckoutPage";
import type { PaymentDetailsSplit } from "../../pages/PaymentPage";
import { productList, resultList } from "./product";

export type CartExpect = { name: string; price: number; quantity: number; total: number };
import { userData } from "./users"; // brings it to the local scope
export { userData }; 
export { userInfoAddress } from "./addresses";
export { card } from "./cards";  
export const ORDER_COMMENT = "This is a Test Text";
export const SEARCH_QUERY_TSHIRT = "tshirt";
export const PATH_VIEW_CART = "view_cart";
export const SELECTED_TWO_PRODUCTS = [productList[0].name, productList[5].name];
export const EXPECT_CART_TWO_ITEMS:  CartExpect[] = [
  { name: productList[0].name, price: 500, quantity: 1, total: 500 }, // Blue Top
  { name: productList[5].name, price: 400, quantity: 1, total: 400 }, // Summer White Top
];

export const EXPECT_CART_TOTAL_TWO_ITEMS  = 900;
export const QTY_STYLISH_DRESS = 4;
export const PRICE_STYLISH_DRESS = 1000;

export const EXPECT_STYLISH_DRESS_CART: CartExpect[] = [
  {
    name: productList[2].name,
    price: PRICE_STYLISH_DRESS,
    quantity: QTY_STYLISH_DRESS,
    total: PRICE_STYLISH_DRESS * QTY_STYLISH_DRESS,
  },
];

export const EXPECT_SEARCH_CART: CartExpect[]  = [
  { name: resultList[0].name, price: 400, quantity: 1, total: 400 },
  { name: resultList[1].name, price: 1299, quantity: 1, total: 1299 },
];