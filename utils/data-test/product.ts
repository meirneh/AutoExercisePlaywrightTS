import type { ProductsList } from "../../pages/ProductsPage";
import type { ProductDetails } from "../../pages/ProductDetailsPage";
import type { RecommendedItemList } from "../../pages/HeaderFooterPage";

export const QUERY = "tshirt";

export const productList: ProductsList[] = [
    { name: 'Blue Top' },
    { name: 'Men Tshirt' },
    { name: 'Sleeveless Dress' },
    { name: 'Stylish Dress' },
    { name: 'Winter Top' },
    { name: 'Summer White Top' },
    { name: 'Madame Top For Women' },
    { name: 'Fancy Green Top' },
    { name: 'Sleeves Printed Top - White' },
    { name: 'Half Sleeves Top Schiffli Detailing - Pink' },
    { name: 'Frozen Tops For Kids' },
    { name: 'Full Sleeves Top Cherry - Pink' },
    { name: 'Printed Off Shoulder Top - White' },
    { name: 'Sleeves Top and Short - Blue & Pink' },
    { name: 'Little Girls Mr. Panda Shirt' },
    { name: 'Sleeveless Unicorn Patch Gown - Pink' },
    { name: 'Cotton Mull Embroidered Dress' },
    { name: 'Blue Cotton Indie Mickey Dress' },
    { name: 'Long Maxi Tulle Fancy Dress Up Outfits -Pink' },
    { name: 'Sleeveless Unicorn Print Fit & Flare Net Dress - Multi' },
    { name: 'Colour Blocked Shirt – Sky Blue' },
    { name: 'Pure Cotton V-Neck T-Shirt' },
    { name: 'Green Side Placket Detail T-Shirt' },
    { name: 'Premium Polo T-Shirts' },
    { name: 'Pure Cotton Neon Green Tshirt' },
    { name: 'Soft Stretch Jeans' },
    { name: 'Regular Fit Straight Jeans' },
    { name: 'Grunt Blue Slim Fit Jeans' },
    { name: 'Rose Pink Embroidered Maxi Dress' },
    { name: 'Cotton Silk Hand Block Print Saree' },
    { name: 'Rust Red Linen Saree' },
    { name: 'Beautiful Peacock Blue Cotton Linen Saree' },
    { name: 'Lace Top For Women' },
    { name: 'GRAPHIC DESIGN MEN T SHIRT - BLUE' }
];

export const resultList: ProductsList[] = [
    { name: 'Men Tshirt' },
    { name: 'Pure Cotton V-Neck T-Shirt' },
    { name: 'Green Side Placket Detail T-Shirt' },
    { name: 'Premium Polo T-Shirts' },
    { name: 'Pure Cotton Neon Green Tshirt' },
    { name: 'GRAPHIC DESIGN MEN T SHIRT - BLUE' }

];

export const productsTopsList: ProductsList[] = [
    { name: 'Blue Top' },
    { name: 'Winter Top' },
    { name: 'Summer White Top' },
    { name: 'Madame Top For Women' },
    { name: 'Fancy Green Top' },
    { name: 'Lace Top For Women' }
];

export const productsTShirtsList: ProductsList[] = [
    { name: 'Men Tshirt' },
    { name: 'Pure Cotton V-Neck T-Shirt' },
    { name: 'Green Side Placket Detail T-Shirt' },
    { name: 'Premium Polo T-Shirts' },
    { name: 'Pure Cotton Neon Green Tshirt' },
    { name: 'GRAPHIC DESIGN MEN T SHIRT - BLUE' }
];

export const brandHMList: ProductsList[] = [
    { name: 'Men Tshirt' },
    { name: 'Summer White Top' },
    { name: 'Pure Cotton V-Neck T-Shirt' },
    { name: 'Pure Cotton Neon Green Tshirt' },
    { name: 'Regular Fit Straight Jeans' }
];

export const productDetails: ProductDetails = {
    name: productList[0].name,
    category: "Category: Women > Tops",
    price: "Rs. 500",
    availability: "Availability: In Stock",
    condition: "Condition: New",
    brand: "Brand: Polo"
};

export const recommendedItemList: RecommendedItemList[] = [
    { name: 'Blue Top' },
    { name: 'Men Tshirt' },
    { name: 'Sleeveless Dress' },
    { name: 'Stylish Dress' },
    { name: 'Winter Top' },
    { name: 'Summer White Top' },
    { name: 'Madame Top For Women' },
    { name: 'Fancy Green Top' },
    { name: 'Sleeves Printed Top - White' },
    { name: 'Half Sleeves Top Schiffli Detailing - Pink' },
    { name: 'Frozen Tops For Kids' },
    { name: 'Full Sleeves Top Cherry - Pink' },
    { name: 'Printed Off Shoulder Top - White' },
    { name: 'Sleeves Top and Short - Blue & Pink' },
    { name: 'Little Girls Mr. Panda Shirt' },
    { name: 'Sleeveless Unicorn Patch Gown - Pink' },
    { name: 'Cotton Mull Embroidered Dress' },
    { name: 'Blue Cotton Indie Mickey Dress' },
    { name: 'Long Maxi Tulle Fancy Dress Up Outfits -Pink' },
    { name: 'Sleeveless Unicorn Print Fit & Flare Net Dress - Multi' },
    { name: 'Colour Blocked Shirt – Sky Blue' },
    { name: 'Pure Cotton V-Neck T-Shirt' },
    { name: 'Green Side Placket Detail T-Shirt' },
    { name: 'Premium Polo T-Shirts' },
    { name: 'Pure Cotton Neon Green Tshirt' },
    { name: 'Soft Stretch Jeans' },
    { name: 'Regular Fit Straight Jeans' },
    { name: 'Grunt Blue Slim Fit Jeans' },
    { name: 'Rose Pink Embroidered Maxi Dress' },
    { name: 'Cotton Silk Hand Block Print Saree' },
    { name: 'Rust Red Linen Saree' },
    { name: 'Beautiful Peacock Blue Cotton Linen Saree' },
    { name: 'Lace Top For Women' },
    { name: 'GRAPHIC DESIGN MEN T SHIRT - BLUE' },
    { name: 'Blue Top' },
    { name: 'Men Tshirt' },
    { name: 'Rs. 1000' },
    { name: 'Stylish Dress' },
    { name: 'Winter Top' },
    { name: 'Summer White Top' }
];

export const item = { name: recommendedItemList[19].name, price: 1100, quantity: 1, total: 1100 };