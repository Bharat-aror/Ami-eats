// ✅ Connect to WebSocket Server
const socket = io("http://localhost:5000"); // Connect to the backend for real-time updates

// ✅ Function to Place an Order and Send it to the Backend
function placeOrder(meal, price, discount) {
    document.getElementById('menu-page').style.display = 'none';
    document.getElementById('order-confirmation').style.display = 'grid';

    document.getElementById('meal-name').innerText = meal;
    document.getElementById('meal-price').innerText = price;
    document.getElementById('meal-discount').innerText = discount;

    // ✅ Debugging: Log the order being sent
    console.log("📦 Sending Order:", { user: "Student", restaurant: "Deja Brew", items: [{ item: meal, price: price }] });

    // ✅ Send order details to the backend
    fetch("http://localhost:5000/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user: "Student",
            restaurant: "Deja Brew",
            items: [{ item: meal, price: price }]
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("❌ Server error, order failed.");
        }
        return res.json();
    })
    .then(data => {
        console.log("✅ Order Response:", data);

        // ✅ Show Initial Status on Deja Website
        let orderStatusElement = document.getElementById("order-status");
        if (orderStatusElement) {
            orderStatusElement.innerHTML = `<strong>Your order is placed!</strong>`;
        }
    })
    .catch(err => {
        console.error("❌ Order Failed:", err);
        alert("❌ Order failed! Please try again.");
    });
}

// ✅ Listen for Real-Time Order Status Updates from the Restaurant
socket.on("orderStatusUpdated", (data) => {
    console.log("🔄 Order Update Received:", data);

    let orderStatusElement = document.getElementById("order-status");
    if (orderStatusElement) {
        orderStatusElement.innerHTML = `<strong>Your order is now: ${data.status}</strong>`;
    }

    // ✅ Show a pop-up ONLY if the order is "Order Ready"
    if (data.status === "Order Ready") {
        alert("🚀 Your order is ready for pickup!");
    }
});

// ✅ Function for Fake Payment (Fixed Missing `}`)
function fakePayment() {
    alert("✅ Payment Successful! Your order has been placed.");

    // ✅ Show Order Placed Status
    let orderStatusElement = document.getElementById("order-status");
    if (orderStatusElement) {
        orderStatusElement.innerHTML = `<strong>Your order is placed!</strong>`;
    }
}

// ✅ Function to filter meals based on search input
function filterMeals() {
    const input = document.getElementById("search-bar").value.toLowerCase();
    const meals = document.querySelectorAll(".meal");

    meals.forEach(meal => {
        const text = meal.innerText.toLowerCase();
        meal.style.display = text.includes(input) ? "block" : "none";
    });
}
