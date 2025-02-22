import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, TouchableOpacity } from "react-native";
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
import ProfileScreen from "./screens/ProfileScreen";

import NotificationsScreen from "./screens/NotificationsScreen"; 

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Function to Add Notifications Button in the Header
function screenOptionsWithNotification({ navigation }) {
    return {
        headerRight: () => (
            <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.navigate("Notifications")}>
                <Icon name="bell" size={24} color="black" />
            </TouchableOpacity>
        ),
    };
}

// ✅ Bottom Tab Navigator with Notifications Button
function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route, navigation }) => ({
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
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "#DFF3E3",
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    position: "absolute",
                    height: 70,
                },
                headerRight: () => (
                    <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.navigate("Notifications")}>
                        <Icon name="bell" size={24} color="black" />
                    </TouchableOpacity>
                ),
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={screenOptionsWithNotification} />
            <Tab.Screen name="Expenses" component={ExpensesScreen} options={screenOptionsWithNotification} />
            <Tab.Screen name="Transactions" component={AddExpenseScreen} options={screenOptionsWithNotification} />
            <Tab.Screen name="Layers" component={AIChatScreen} options={screenOptionsWithNotification} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={screenOptionsWithNotification} />
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
            <Stack.Navigator>
                {user ? (
                    <>
                        <Stack.Screen name="Tabs" component={BottomTabs} options={{ headerShown: false }} />
                        <Stack.Screen name="Notifications" component={NotificationsScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
