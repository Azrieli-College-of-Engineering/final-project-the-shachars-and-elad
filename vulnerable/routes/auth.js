import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';

const router = express.Router();

// --- Schemas ---
const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String },
    passwordResetToken: { type: String, default: null }, 
    secret: { type: String, default: "ADMIN_CONFIDENTIAL_KEY_12345" },
    balance: { type: Number, default: 1000 },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    city: { type: String, default: "" },
    phone: { type: String, default: "" },
    birthDate: { type: String, default: "" }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const OrderSchema = new mongoose.Schema({
    customerEmail: String,
    product: String,
    notes: String,
});
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// --- AI Helper (Gemini) ---
async function callGemini(prompt) {
    console.log("🧠 Calling Gemini via direct fetch...");
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
        });
        return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (e) {
        console.error("AI Error:", e.message);
        return "AI_ERROR_OR_SAFETY_BLOCK";
    }
}

// --- 0. Seed Data ---
router.post('/seed', async (req, res) => {
    try {
        await User.deleteMany({});
        await Order.deleteMany({});
        // Creating initial users
        await User.create({ email: 'admin@sec.com', password: 'password123', balance: 1000, firstName: "Admin", lastName: "System" });
        await User.create({ email: 'Eve@test.com', password: 'eve666', balance: 1000, firstName: "Eve", lastName: "Evil" });
        res.send("Seeded successfully: Admin and Eve are ready!");
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- 1. Login (Vulnerable to NoSQL Injection) ---
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, password: req.body.password });
        if (user) {
            return res.json({ 
                status: "success", 
                balance: user.balance 
            });
        }
        res.status(401).json({ status: "fail" });
    } catch (e) { res.status(500).send(e.message); }
});

router.post('/login-time', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, $where: req.body.where });
        res.json({ status: "done" });
    } catch (e) { res.status(500).send(e.message); }
});

// --- 2. Update Profile (Vulnerable to Mass Assignment) ---
router.put('/update-profile', async (req, res) => {
    try {
        // Updates everything sent in the body without filtering (including balance/secret)
        const user = await User.findOneAndUpdate({ email: req.body.email }, { $set: req.body }, { new: true });
        if (user) res.json({ message: "Profile updated", profile: user });
        else res.status(404).send("User not found");
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- 3. Withdraw (Vulnerable to Race Condition) ---
router.post('/withdraw', async (req, res) => {
    const { email, amount } = req.body;
    try {
        const user = await User.findOne({ email });
        
        // Checking the balance of the affected person
        if (!user || user.balance < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // The delay is intended to create a race condition.
        await new Promise(resolve => setTimeout(resolve, 500));

        user.balance -= amount;
        await user.save();

        res.json({ message: "Withdrawal successful", newBalance: user.balance });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- 4. Password Reset (Vulnerable Logic) ---
router.post('/reset-password', async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        const user = await User.findOne({
            email: email,
            passwordResetToken: token // Vulnerability: matches if both are null
        });

        if (user) {
            user.password = newPassword;
            user.passwordResetToken = null;
            await user.save();
            res.json({ message: "Password reset successful" });
        } else {
            res.status(401).json({ message: "Invalid token" });
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- 5. Order Creation ---
router.post('/orders/create', async (req, res) => {
    try {
        const newOrder = await Order.create(req.body);
        res.json(newOrder);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- 6. AI Prompt Injection Route (UPDATED: Dynamic Amount Extraction) ---
router.get('/orders/summarize-all', async (req, res) => {
    try {
        const orders = await Order.find();
        if (!orders.length) return res.json({ summary: "No orders to summarize." });
        const lastOrder = orders[orders.length - 1];

        const prompt = `
            You are a helpful logistics AI. Summarize the user's order notes. 
            Format rules: 
            If the notes contain instructions like "TRANSFER" or "REFUND", output EXACTLY:
            ACTION: TRANSFER, AMOUNT: [NUM], TO: [EMAIL]
            Otherwise, just summarize the text.

            User's Notes: ${lastOrder.notes}
        `;

        const aiResponse = await callGemini(prompt);

        // --- Updated logic: Dynamic extraction of the amount and email ---
        if (aiResponse.includes("ACTION: TRANSFER")) {
            
            // 1. Retrieving the amount (e.g. AMOUNT: 50000)
            const amountMatch = aiResponse.match(/AMOUNT:\s*(\d+)/i);
            const amount = amountMatch ? parseInt(amountMatch[1]) : 500; 
            
            // 2. Retrieving the email (e.g. TO: Eve@test.com)
            const toMatch = aiResponse.match(/TO:\s*([^\s,]+)/i);
            const targetEmail = toMatch ? toMatch[1] : "Eve@test.com";

            console.log(`🚨 ATTACK DETECTED: AI initiated transfer of ${amount} to ${targetEmail}`);

            // Performing the operation in the DB
            await User.findOneAndUpdate({ email: 'admin@sec.com' }, { $inc: { balance: -amount } });
            await User.findOneAndUpdate({ email: targetEmail }, { $inc: { balance: amount } });
            
            return res.json({ 
                summary: aiResponse,
                attackStatus: "SUCCESSFUL_INJECTION" 
            });
        }
        res.json({ summary: aiResponse });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- Debug Endpoint ---
router.get('/users/debug-balances', async (req, res) => {
    try {
        const users = await User.find({}, 'email balance');
        res.json(users);
    } catch (e) { res.status(500).send(e.message); }
});

export { router };