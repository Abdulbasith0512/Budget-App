import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { addExpense, categorizeExpense } from "../services/api";
import { auth } from "../config/firebase";

export default function AddExpenseScreen({ navigation }) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                navigation.replace("Login");
            } else {
                setUser(user);
            }
        });

        return unsubscribe;
    }, []);

    const handleCategorization = async () => {
        if (!description) return Alert.alert("Error", "Enter a description");
        const result = await categorizeExpense(description);
        setCategory(result);
    };

    const handleAddExpense = async () => {
        if (!description || !amount) return Alert.alert("Error", "All fields are required");

        try {
            await addExpense(description, parseFloat(amount), category || "other");
            Alert.alert("Success", "Expense added!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    if (!user) return <Text>Loading...</Text>;

    return (
        <View>
            <Text>Description:</Text>
            <TextInput value={description} onChangeText={setDescription} />
            <Text>Amount:</Text>
            <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" />
            <Button title="Categorize Expense" onPress={handleCategorization} />
            {category ? <Text>Category: {category}</Text> : null}
            <Button title="Add Expense" onPress={handleAddExpense} />
        </View>
    );
}
