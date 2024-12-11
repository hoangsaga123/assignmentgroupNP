import { listingProduct, categoriesFilter, priceSortDecendingOrder, titleSort, priceSortAscendingOrder } from "./productFunction.js";

// These functions will be used to sort and filter product.

// Mock data array and list
const products = [
    { id: 1, title: "it for beginner by Mackel Junior", price: 10.99, description: "Book only for the hardest", category: "text book" },
    { id: 2, title: "pencilcase", price: 60.99, description: "good for storing your favourite pen", category: "stationary" },
    { id: 3, title: "xps 13 dell", price: 30.99, description: "excellent for programming and lightweight", category: "electronic" },
    { id: 4, title: "Xpen", price: 20.99, description: "very high tech pen", category: "stationary" },
    { id: 5, title: "ipad pro", price: 1.99, description: "exellent for taking note", category: "electronic" },
]

// Display product listing

console.log("Product Listing:");
listingProduct(products);

// Title sort by alphabet order

console.log("Sort products by title in alphabet order:");
const alphabetTitleSortedProducts = titleSort(products);
listingProduct(alphabetTitleSortedProducts);

// Filter products by category

console.log("Filter products by category:");
categoriesFilter(products, "game");

// Sort products by price in decending order
console.log("Sort products by price in decending order:");
const decendingPriceSortedProducts = priceSortDecendingOrder(products);
listingProduct(decendingPriceSortedProducts);

// Sort products by title in ascending order

console.log("Sort products by price in ascending order:");
const ascendingPriceSortedProducts = priceSortAscendingOrder(products);
listingProduct(ascendingPriceSortedProducts);