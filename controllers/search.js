
async function getProducts_name() {
    try {
        const response = await fetch('http://127.0.0.1:3000/api/v1/products');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}
export function setupSearchAutocomplete(inputElementId, resultBoxId, availableKeywords) {
    const resultBox = document.getElementById(resultBoxId);
    const inputBox = document.getElementById(inputElementId);

    inputBox.addEventListener('keyup', function () {
        let result = [];
        let input = inputBox.value.toLowerCase();

        if (input.length) {
            result = availableKeywords.filter(keyword =>
                keyword.toLowerCase().includes(input)
            );
        }

        display(result);

        if (!result.length) {
            resultBox.innerHTML = '';
        }
    });

    function display(result) {
        const searchResult = result.map(list =>
            `<li onclick="selectInput('${list}')">${list}</li>`
        );
        resultBox.innerHTML = "<ul>" + searchResult.join('') + "</ul>";
    }

    window.selectInput = function (list) {
        inputBox.value = list;
        resultBox.innerHTML = '';
    };
}

document.addEventListener('DOMContentLoaded', async function () {
    var availableKeywords = await getProducts_name();
    setupSearchAutocomplete('input', 'resultbox', availableKeywords);
});

document.getElementById('searchButton').addEventListener('click', function () {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();

    // Find the product object that matches the search input
    const foundProduct = availableKeywords.find(product => product.product_name.toLowerCase() === searchValue);


    // If the product is found, redirect to its product details page using its product_id
    if (foundProduct && foundProduct.product_id) {
        window.location.href = `/product-details/${foundProduct.product_id}`;
    } else {
        alert('Product not found');
    }
});




