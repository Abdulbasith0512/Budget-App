import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, Image } from "react-native";
import { fetchExpenses } from "../services/api";
import { format } from "date-fns";

const formatDate = (timestamp) => {
    if (timestamp?._seconds) {
        return new Date(timestamp._seconds * 1000).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            month: "short",
            day: "numeric",
        });
    }
    return "Invalid Date";
};

// Icon Mapping for Expense Categories
const categoryIcons = {
    Salary: require("../assets/salary.png"),  // Replace with actual icon paths
    Groceries: require("../assets/groceries.png"),
    Rent: require("../assets/rent.png"),
    Transport: require("../assets/transport.png"),
    Default: require("../assets/default.png"), 
};

export default function CardComponents() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        try {
            setLoading(true);
            const data = await fetchExpenses();
            console.log("Fetched Expenses from API:", data);

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
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image 
                source={categoryIcons[item.category] || categoryIcons.Default} 
                style={styles.icon} 
            />
            <View style={styles.details}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.date}>{formatDate(item.date)}</Text> {/* Use formatted date */}
            </View>
            <View style={styles.amountContainer}>
                <Text style={[styles.amount, item.amount < 0 ? styles.expense : styles.income]}>
                    ₹{item.amount}
                </Text>
                <Text style={styles.category}>{item.category}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Expenses</Text>
            {loading ? <Text>Loading...</Text> : (
                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#f8f9fa",
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 15,
    },
    details: {
        flex: 1,
    },
    description: {
        fontSize: 18,
        fontWeight: "bold",
    },
    date: {
        fontSize: 14,
        color: "#6c757d",
    },
    amountContainer: {
        alignItems: "flex-end",
    },
    amount: {
        fontSize: 16,
        fontWeight: "bold",
    },
    income: {
        color: "#28a745",
    },
    expense: {
        color: "#dc3545",
    },
    category: {
        fontSize: 14,
        color: "#6c757d",
    },
});
