import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { auth, signOut } from "../config/firebase";
import { Ionicons } from "@expo/vector-icons"; 
import profileImage from "../assets/profile.png";


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
        <View style={styles.container}>
           
            <View style={styles.header}>
                
            </View>

           
            <View style={styles.profileContainer}>
                <Image 
                    source={profileImage} 
                    style={styles.profileImage} 
                />
                <Text style={styles.userName}>John Smith</Text>
                <Text style={styles.userId}>ID: {auth.currentUser?.email || "25030024"}</Text>
            </View>

            
            <View style={styles.menuContainer}>
                <MenuItem icon="person-outline" text="Edit Profile" />
                <MenuItem icon="shield-checkmark-outline" text="Security" />
                <MenuItem icon="settings-outline" text="Setting" />
                <MenuItem icon="help-circle-outline" text="Help" />
                <MenuItem icon="log-out-outline" text="Logout" onPress={handleLogout} />
            </View>
        </View>
    );
}
// Reusable Menu Item Component
const MenuItem = ({ icon, text, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <Ionicons name={icon} size={24} color="#007AFF" />
        <Text style={styles.menuText}>{text}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    header: {
        backgroundColor: "#f1b695",
        height: 150,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        
    },
    headerText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
    },
    notificationIcon: {
        position: "absolute",
        right: 20,
        top: 50,
    },
    profileContainer: {
        alignItems: "center",
        marginTop: -50,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "white",
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 8,
    },
    userId: {
        fontSize: 14,
        color: "gray",
    },
    menuContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    menuText: {
        fontSize: 16,
        marginLeft: 15,
    },
});

