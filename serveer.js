const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Debugging MongoDB Connection
console.log("Connecting to MongoDB:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
});

// ✅ Order Schema with Status Tracking
const OrderSchema = new mongoose.Schema({
    user: String,
    restaurant: String,
    items: Array,
    status: { type: String, default: "Order Placed" },
    orderTime: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", OrderSchema);

// ✅ API to Place an Order
app.post("/order", async (req, res) => {
    try {
        const { user, restaurant, items } = req.body;

        if (!user || !restaurant || !items || items.length === 0) {
            return res.status(400).json({ error: "Missing required order details" });
        }

        console.log("📦 New Order Received:", req.body);
        const newOrder = new Order({ user, restaurant, items });
        await newOrder.save();

        console.log(`✅ Order ${newOrder._id} placed for ${restaurant}`);
        res.json({ message: "✅ Order placed successfully!", orderId: newOrder._id });
    } catch (error) {
        console.error("❌ Error saving order:", error);
        res.status(500).json({ error: "Failed to place order" });
    }
});

// ✅ API to Get Orders for a Restaurant
app.get("/orders/:restaurant", async (req, res) => {
    try {
        console.log(`📋 Fetching PENDING orders for: ${req.params.restaurant}`);

        const orders = await Order.find({ restaurant: req.params.restaurant, status: { $ne: "Order Ready" } })
                                  .sort({ orderTime: -1 });

        console.log("📜 Found Pending Orders:", orders);

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No pending orders found" });
        }

        res.json(orders);
    } catch (error) {
        console.error("❌ Error fetching pending orders:", error);
        res.status(500).json({ error: "Failed to fetch pending orders" });
    }
});

// ✅ API to Update Order Status
app.put("/order-status/:id", async (req, res) => {
    try {
        const { status } = req.body;
        console.log(`🔄 Updating Order ${req.params.id} to status: ${status}`);

        const order = await Order.findByIdAndUpdate(req.params.id, { status: status }, { new: true });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        console.log(`✅ Order ${order._id} updated to: ${status}`);
        res.json({ message: `✅ Order updated to: ${status}` });
    } catch (error) {
        console.error("❌ Error updating order status:", error);
        res.status(500).json({ error: "Failed to update order status" });
    }
});

// ✅ API to Get All Orders (Record Keeping)
app.get("/all-orders/:restaurant", async (req, res) => {
    try {
        console.log(`📋 Fetching ALL orders for: ${req.params.restaurant}`);

        const orders = await Order.find({ restaurant: req.params.restaurant }).sort({ orderTime: -1 });

        console.log("📜 Found All Orders:", orders);

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No records found" });
        }

        res.json(orders);
    } catch (error) {
        console.error("❌ Error fetching all orders:", error);
        res.status(500).json({ error: "Failed to fetch all orders" });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
