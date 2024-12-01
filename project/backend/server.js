const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/fsd", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Schemas
const conversationSchema = new mongoose.Schema({
  userId: String, // For identifying the user
  messages: [
    {
      sender: String,
      text: String,
    },
  ],
});

const orderSchema = new mongoose.Schema({
  userId: String,
  orderId: String,
  items: Array,
  status: String, // "Pending", "Preparing", "Ready", "Delivered"
  createdAt: { type: Date, default: Date.now },
});

const Conversation = mongoose.model("Conversation", conversationSchema);
const Order = mongoose.model("Order", orderSchema);

// Mock Menu Data
const menu = [
  { id: 1, name: "Pizza", price: 12.99 },
  { id: 2, name: "Pasta", price: 10.99 },
  { id: 3, name: "Burger", price: 8.99 },
  { id: 4, name: "Sushi", price: 15.99 },
];

// Generate Unique Order ID
const generateOrderId = () => `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

// NLP Logic
const processMessage = async (text, context, userId) => {
  let responseMessages = [];
  text = text.toLowerCase();
  
  if (text.includes("hello") || text.includes("hi")) {
    responseMessages.push("Hello How can I assist you today?'\n' To order please type: ORDER, '\n' To see menu type: MENU '\n' To check nearby restaurants type: 'nearby restaurants'");
   
  } else if (text.includes("menu")) {
    const menuList = menu.map((item) => `${item.name} - $${item.price}`).join(", ");
    responseMessages.push(`Here is our menu: ${menuList}`);
  } else if (text.includes("order")) {
    responseMessages.push(
      "What would you like to order? please specify the items (e.g., Pizza, Burger)."
    );
  } else if (menu.some((item) => text.includes(item.name.toLowerCase()))) {
    const items = menu.filter((item) => text.includes(item.name.toLowerCase()));
    const orderId = generateOrderId();

    // Save the order to MongoDB
    await Order.create({
      userId,
      orderId,
      items: items.map((item) => item.name),
      status: "Pending",
    });

    responseMessages.push(
      `Your order for ${items.map((item) => item.name).join(", ")} has been placed! Your Order ID is ${orderId}.`
    );
    responseMessages.push("You can check the status of your order by providing the Order ID.");
  } else if (text.includes("order id")) {
    const orderId = text.split("order id")[1].trim(); // Extract Order ID from message
    const order = await Order.findOne({ orderId });

    if (order) {
      responseMessages.push(`Your order status is: ${order.status}.`);
    } else {
      responseMessages.push("Sorry, we could not find an order with that ID.");
    }
  } else if (text.includes("status")) {
    responseMessages.push(
      "Your order is currently being prepared. It will be ready shortly."
    );
  } else if (text.includes("nearby restaurants")) {
    const location = { latitude: "12.961568556019683", longitude: "77.61463165283203" }; // Mock location

    const restaurants = await fetchNearbyRestaurants(location);
    responseMessages.push(`Nearby restaurants: ${restaurants.join(", ")}`);
  } else {
    responseMessages.push("I'm sorry, I didn't understand that. Could you clarify?");
  }

  return responseMessages;
};

// Fetch Nearby Restaurants using Google Maps API
const fetchNearbyRestaurants = async (location) => {
  const { latitude, longitude } = location;
  const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API Key

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    // Check if API returned valid results
    if (response.data && response.data.results) {
      return response.data.results.map((restaurant) => restaurant.name);
    } else {
      console.error("No results from Google Maps API");
      return ["No restaurants found nearby."];
    }
  } catch (error) {
    console.error("Error fetching nearby restaurants:", error.message);
    return ["Error fetching restaurant data. Please try again later."];
  }
};


// API: Handle Conversation
app.post("/api/conversation", async (req, res) => {
  const userId = "default_user"; // Replace this with user authentication logic
  const userMessage = req.body.text;

  // Find or create a conversation
  let conversation = await Conversation.findOne({ userId });
  if (!conversation) {
    conversation = new Conversation({ userId, messages: [] });
  }

  // Save user message
  conversation.messages.push({ sender: "user", text: userMessage });

  // Process bot response
  const botResponses = await processMessage(userMessage, conversation.messages, userId);

  // Save bot responses
  botResponses.forEach((response) =>
    conversation.messages.push({ sender: "bot", text: response })
  );

  await conversation.save();

  res.json({ messages: botResponses });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
