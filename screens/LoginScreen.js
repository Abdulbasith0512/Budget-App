import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { auth, signInWithEmailAndPassword, signInWithPopup, googleProvider } from "../config/firebase";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) navigation.replace("Home");
        });
        return unsubscribe;
    }, []);

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View>
            <Text style={{ fontSize: 20 }}>Login</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Sign in with Google" onPress={handleGoogleLogin} />
            <Button title="Signup" onPress={() => navigation.navigate("Signup")} />
        </View>
    );
}
