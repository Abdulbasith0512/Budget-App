import axios from "axios";
import { auth } from "../config/firebase";

const API_URL = "http://localhost:5001/api";  // Change if backend is deployed

// Function to get the Firebase Auth Token
const getAuthToken = async () => {
    const user = auth.currentUser;
    return user ? await user.getIdToken() : null;
};

// Secure API request with Authentication
const apiRequest = async (method, endpoint, data = null) => {
    const token = await getAuthToken();
    if (!token) throw new Error("User not authenticated");

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    const url = `${API_URL}${endpoint}`;
    const response = await axios({ method, url, data, headers });
    return response.data;
};

// Secure API Calls (Authenticated)
export const fetchExpenses = async () => {
    return await apiRequest("GET", "/expenses");
};

export const addExpense = async (description, amount, category) => {
    return await apiRequest("POST", "/expenses", { description, amount, category });
};

// AI Features (No Authentication Needed)
export const categorizeExpense = async (description) => {
    const response = await axios.post(`${API_URL}/ai/categorize`, { description });
    return response.data.category;
};

export const getFinancialAdvice = async (question) => {
    const response = await axios.post(`${API_URL}/ai/advice`, { question });
    return response.data.advice;
};
