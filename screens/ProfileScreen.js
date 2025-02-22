import React from "react";
import { View, Text, Button, Alert } from "react-native";
import { auth, signOut } from "../config/firebase";

export default function ProfileScreen({ navigation }) {
    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert("Success", "Logged Out!");
            navigation.replace("Login");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View>
            <Text style={{ fontSize: 20 }}>Welcome, {auth.currentUser?.email}</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
}
