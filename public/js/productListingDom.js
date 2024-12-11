window.addEventListener('DOMContentLoaded', (event) => {
    const messageElement = document.getElementById('success-message');
    if (messageElement) {
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000); // Hide the message after 5 seconds
    }

    const priceRangeInput = document.getElementById('priceRange');
    const priceRangeDisplay = document.getElementById('priceRangeShow');
    const categoryCheckboxes = document.querySelectorAll('.category-filter');
    const conditionCheckboxes = document.querySelectorAll('.condition-filter');
    const productCards = document.querySelectorAll('.product-card');
    const userEmail = getUserEmail

    // Show initial price range value
    priceRangeDisplay.textContent = priceRangeInput.value;

    // Event listener for price range filter
    priceRangeInput.addEventListener('input', function () {
        priceRangeDisplay.textContent = priceRangeInput.value; // Update the displayed price value
        filterProducts(); // Call the filter function when the price changes
    });

    // Event listener for category checkboxes
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts); // Call filter when category is checked/unchecked
    });

    // Event listener for condition checkboxes
    conditionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts); // Call filter when condition is checked/unchecked
    });

    // Main function to filter products
    function filterProducts(email) {
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        const selectedConditions = Array.from(conditionCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        const maxPrice = parseFloat(priceRangeInput.value);

        // Loop through product cards and apply filters
        productCards.forEach(card => {
            const productCategory = card.getAttribute('data-category');
            const productCondition = card.getAttribute('data-condition');
            const productPrice = parseFloat(card.getAttribute('data-price'));

            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(productCategory);
            const conditionMatch = selectedConditions.length === 0 || selectedConditions.includes(productCondition);
            const priceMatch = productPrice <= maxPrice;

            // Display or hide the product card based on the filter match
            if (categoryMatch && conditionMatch && priceMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
});



// Create collapse filters
  let coll = document.getElementsByClassName("filterCollapsible");
  let i;
  
  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("activeFilter");
      let content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }

  function redirectProductDetail(productId) {
    // Assuming you have a product detail route like /product-details/:id
    window.location.href = `/product-details/${productId}`;
  }
  
  function getUserEmail(email) {
    return email
  }