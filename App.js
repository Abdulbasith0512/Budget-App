import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { auth } from "./config/firebase";
import Icon from "react-native-vector-icons/Feather";

// Import Screens
import HomeScreen from "./screens/HomeScreen";
import ExpensesScreen from "./screens/ExpensesScreen";
import AddExpenseScreen from "./screens/AddExpenseScreen";
import AIChatScreen from "./screens/AIChatScreen";
import ProfileScreen from "./screens/ProfileScreen"; // Add a Profile screen
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === "Home") {
                        iconName = "home";
                    } else if (route.name === "Expenses") {
                        iconName = "bar-chart";
                    } else if (route.name === "Transactions") {
                        iconName = "repeat";
                    } else if (route.name === "Layers") {
                        iconName = "layers";
                    } else if (route.name === "Profile") {
                        iconName = "user";
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarShowLabel: false, // Hide text labels
                tabBarStyle: {
                    backgroundColor: "#DFF3E3", // Light green background
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    position: "absolute",
                    height: 70,
                },
                tabBarIconStyle: { marginBottom: 5 },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Expenses" component={ExpensesScreen} />
            <Tab.Screen name="Transactions" component={AddExpenseScreen} />
            <Tab.Screen name="Layers" component={AIChatScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {user ? (
                <BottomTabs /> // ✅ Display the bottom navigation when logged in
            ) : (
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
}
