import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import { fetchExpenses } from "../services/api";
import { auth } from "../config/firebase";
import CardComponents from "../components/cardComponets";

export default function HomeScreen({ navigation }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                navigation.replace("Login");
            } else {
                loadExpenses();
            }
        });

        return unsubscribe;
    }, []);

    /*const loadExpenses = async () => {
        try {
            setLoading(true);
            const data = await fetchExpenses();
            console.log("Fetched Expenses from API:", data); // Debugging

            if (!Array.isArray(data)) {
                console.error("API did not return an array:", data);
                Alert.alert("Error", "Invalid data format from API");
                return;
            }

            setExpenses(data);
        } catch (error) {
            console.error("Error fetching expenses:", error.message);
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };*/

    return (
        <View>
            
            <CardComponents />
            <Button title="Add Expense" onPress={() => navigation.navigate("AddExpense")} />
            <Button title="Ask AI" onPress={() => navigation.navigate("AIChat")} />
            <Button title="Logout" onPress={() => auth.signOut()} />
        </View>
    );
}
