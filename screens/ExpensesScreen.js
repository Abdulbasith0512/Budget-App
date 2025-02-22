import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert, ActivityIndicator } from "react-native";
import { fetchExpenses } from "../services/api";
import { auth } from "../config/firebase";

export default function ExpensesScreen({ navigation }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                console.log("User not authenticated. Redirecting...");
                navigation.replace("Login");
            } else {
                console.log("User authenticated:", user.email);
                setUser(user);
                loadExpenses(); // Fetch expenses after user is set
            }
        });

        return unsubscribe;
    }, []);

    const loadExpenses = async () => {
        try {
            console.log("Fetching expenses...");
            const data = await fetchExpenses();
            console.log("Fetched Expenses:", data);

            setExpenses(data);
        } catch (error) {
            console.error("Error fetching expenses:", error.message);
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user || loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading Expenses...</Text>
            </View>
        );
    }

    return (
        <View>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Your Expenses</Text>
            {expenses.length > 0 ? (
                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View key={item.id} style={{ padding: 10, borderBottomWidth: 1 }}>
                            <Text style={{ fontSize: 18 }}>{item.description}</Text>
                            <Text>₹{item.amount} ({item.category})</Text>
                        </View>
                    )}
                />
            ) : (
                <Text>No expenses found.</Text>
            )}
            <Button title="Back to Home" onPress={() => navigation.goBack()} />
        </View>
    );
}
