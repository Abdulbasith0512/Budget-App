import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import { auth, createUserWithEmailAndPassword } from "../config/firebase";

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match!");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Success", "Account Created!");
            navigation.replace("Home");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <>
            {/* Top Section - Logo & Headings */}
            <View style={styles.container2}>
                <Text style={styles.logo}>
                    NUT<Text style={styles.logoHighlight}>SHELL</Text>
                </Text>
                

            </View>
            <Text style={styles.heading}>Join NUTSHELL Today!</Text>
            <Text style={styles.signupTitle}>Sign Up</Text>

            {/* Bottom Section - Form & Buttons */}
            <View style={styles.container1}>
                <TextInput style={styles.input} placeholder="Enter your full name" value={fullName} onChangeText={setFullName} />
                <TextInput style={styles.input} placeholder="Enter your email" value={email} onChangeText={setEmail} />
                <TextInput style={styles.input} placeholder="Create a password" secureTextEntry value={password} onChangeText={setPassword} />
                <TextInput style={styles.input} placeholder="Confirm your password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

                <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                    <Text style={styles.signupButtonText}>Sign Up</Text>
                </TouchableOpacity>

                <Text style={styles.loginText}>
                    Already have an account?{" "}
                    <Text style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
                        Log In
                    </Text>
                </Text>

                <Text style={styles.socialText}>Sign Up with socials</Text>
                <View style={styles.socialButtons}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image source={require("../assets/google.png")} style={styles.icon} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.termsText}>
                    By signing up, you agree to our <Text style={styles.link}>Terms of Service</Text> and{" "}
                    <Text style={styles.link}>Privacy Policy</Text>.
                </Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container1: {
        alignItems: "center",
        flex: 1,
        padding: 20,
    },
    container2: {
        alignItems: "flex-start",
        width: "100%",
        marginBottom: 20,
    },
    logo: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000",
    },
    logoHighlight: {
        color: "#f4a38c",
    },
    heading: {
        fontSize: 16,
        color: "#666",
        marginVertical: 5,
    },
    signupTitle: {
        fontSize: 30,
        fontWeight: "bold",
        marginVertical: 10,
    },
    input: {
        width: "100%",
        backgroundColor: "#f2f2f2",
        padding: 12,
        borderRadius: 5,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: "#f4a38c",
    },
    signupButton: {
        backgroundColor: "#f4a38c",
        padding: 15,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
        marginVertical: 10,
    },
    signupButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    loginText: {
        fontSize: 14,
        marginTop: 5,
        color: "#666",
    },
    loginLink: {
        color: "#f4a38c",
        fontWeight: "bold",
    },
    socialText: {
        fontSize: 14,
        marginVertical: 10,
        color: "#666",
    },
    socialButtons: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
    },
    socialButton: {
        backgroundColor: "#e0e0e0",
        padding: 5,
        marginHorizontal: 10,
        borderRadius: 5,
    },
    icon: {
        width: 30,
        height: 30,
    },
    termsText: {
        fontSize: 12,
        textAlign: "center",
        color: "#888",
        marginTop: 15,
    },
    link: {
        color: "#f4a38c",
        fontWeight: "bold",
    },
});
