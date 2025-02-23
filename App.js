import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, TouchableOpacity,StyleSheet,Text } from "react-native";
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
import FireScreen from "./screens/FireScreen";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Function to Add Notifications Button in the Header
function screenOptionsWithNotification({ navigation, route }) {
    return {
        headerRight: () => (
            <TouchableOpacity 
                style={styles.notificationBtn}
                onPress={() => navigation.navigate("Notifications")}
            >
                <View style={styles.notificationIconContainer}>
                    <Icon name="bell" size={22} color="#6EE7B7" />
                    <View style={styles.notificationBadge} />
                </View>
            </TouchableOpacity>
        ),
        headerLeft: () => (
            <View style={styles.headerLeft}>
                <Icon name={getHeaderIcon(route.name)} size={22} color="#6EE7B7" />
                <Text style={styles.headerTitle}>{route.name}</Text>
            </View>
        ),
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTitle: '',
    };
}

const getHeaderIcon = (routeName) => ({
    Home: "home",
    "Expenses Analytics": "pie-chart",
    Expenses: "credit-card",
    "Ask AI": "cpu",
    Profile: "user",
    Fire: "trending-up",
    Notifications: "bell"
}[routeName] || "circle");

// ✅ Bottom Tab Navigator with Notifications Button
function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route, navigation }) => ({
                tabBarIcon: ({ focused }) => {
                    let iconName;
                    if (route.name === "Home") {
                        iconName = "home";
                    } else if (route.name === "Expenses") {
                        iconName = "credit-card";
                    } else if (route.name === "Expenses Analytics") {
                        iconName = "pie-chart";
                    } else if (route.name === "Ask ai") {
                        iconName = "message-circle";
                    } else if (route.name === "Profile") {
                        iconName = "user";
                    } else if (route.name === "Fire") {
                        iconName = "trending-up";
                    }

                    return (
                        <View style={[
                            styles.tabIconWrapper,
                            focused && styles.tabIconActive
                        ]}>
                            <Icon 
                                name={iconName} 
                                size={24} 
                                color={focused ? "#6EE7B7" : "#94A3B8"} 
                            />
                        </View>
                    );
                },
                tabBarShowLabel: true,
                tabBarStyle: {
                    ...styles.tabBar,
                    backgroundColor: "#1E293B",
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    position: "absolute",
                    height: 75,
                },
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarActiveTintColor: "#6EE7B7",
                tabBarInactiveTintColor: "#94A3B8",
                
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={screenOptionsWithNotification} />
            <Tab.Screen name="Expenses Analytics" component={ExpensesScreen} options={screenOptionsWithNotification} />
            <Tab.Screen name="Expenses" component={AddExpenseScreen} options={screenOptionsWithNotification} />
            <Tab.Screen name="Ask ai" component={AIChatScreen} options={screenOptionsWithNotification} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={screenOptionsWithNotification} />
            <Tab.Screen name="Fire" component={FireScreen} options={screenOptionsWithNotification} />
        </Tab.Navigator>
    );
}

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            console.log("Auth state changed:", user); // Debugging
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
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#0F172A',
                    elevation: 0, // Android
                    shadowOpacity: 0, // iOS
                },
                headerTintColor: '#6EE7B7',
                headerTitleStyle: {
                    color: '#F8FAFC',
                    fontSize: wp('5%'),
                    fontWeight: '600',
                },
                cardStyle: { backgroundColor: '#0F172A' },
            }}
        >
            {user ? (
                <>
                    <Stack.Screen 
                        name="Tabs" 
                        component={BottomTabs} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="Notifications" 
                        component={NotificationsScreen}
                        options={{
                            headerBackTitleVisible: false,
                            headerTitleAlign: 'center',
                        }} 
                    />
                </>
            ) : (
                <>
                    <Stack.Screen 
                        name="Login" 
                        component={LoginScreen}
                       
                    />
                    <Stack.Screen 
                        name="Signup" 
                        component={SignupScreen}
                        options={{
                           
                            headerTintColor: '#6EE7B7',
                        }} 
                    />
                </>
            )}
        </Stack.Navigator>
    </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0F172A",
    },
    loadingText: {
        color: "#94A3B8",
        marginTop: 16,
        fontSize: 16,
    },
    tabBar: {
        backgroundColor: "#1E293B",
        borderTopWidth: 0,
        height: 84,
        paddingBottom: 24,
        paddingTop: 12,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#6EE7B7",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    tabIconWrapper: {
        width: 48,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 24,
    },
    tabIconActive: {
        backgroundColor:"rgba(110, 231, 183, 0.66)",
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 7,
    },
    header: {
        backgroundColor: "#0F172A",
        height: 70,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 16,
       
    },
    headerTitle: {
        color: "#F8FAFC",
        fontSize: 20,
        fontWeight: "600",
        marginLeft: 12,
    },
    notificationBtn: {
        marginRight: 16,
        padding: 8,
    },
    notificationIconContainer: {
        position: "relative",
    },
    notificationBadge: {
        position: "absolute",
        right: -2,
        top: -2,
        backgroundColor: "#FB7185",
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#0F172A",
    }
});