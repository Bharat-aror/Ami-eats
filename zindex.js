// Store cart items in an array
let cart = [];

// Function to add items to the cart
function addToCart(itemName, price, restaurant) {
    cart.push({ item: itemName, price, restaurant });
    alert(`${itemName} added to cart!`);
}
function filterMeals() {
    const input = document.getElementById('search-bar').value.toLowerCase();
    const meals = document.querySelectorAll('.meal');

    meals.forEach(meal => {
        const text = meal.textContent.toLowerCase();
        if (text.includes(input)) {
            meal.style.display = "block";
        } else {
            meal.style.display = "none";
        }
    });
}

// Function to filter restaurants based on search input
function searchRestaurant() {
    const input = document.getElementById('search-bar').value.toLowerCase();
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    
    restaurantCards.forEach(card => {
        const restaurantName = card.querySelector('.restaurant-name').textContent.toLowerCase();
        if (restaurantName.includes(input)) {
            card.style.display = 'block';  // Show the restaurant card
        } else {
            card.style.display = 'none';   // Hide the restaurant card
        }
    });
}

// Function to place an order (Send order to the backend)
// Function to place an order directly
function placeOrder(restaurant, foodItem, price) {
    fetch("http://localhost:5000/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user: "Student",
            restaurant: restaurant,
            items: [{ item: foodItem, price: price }]
        })
    })
    .then(res => res.json())
    .then(data => {
        // Show confirmation message in a pop-up
        alert("✅ Order Placed Successfully!\nYour order for " + foodItem + " at " + restaurant + " has been placed.");
    })
    .catch(err => console.error(err));
}
