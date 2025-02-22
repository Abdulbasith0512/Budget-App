import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { auth, createUserWithEmailAndPassword } from "../config/firebase";

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Success", "Account Created!");
            navigation.replace("Home");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View>
            <Text style={{ fontSize: 20 }}>Sign Up</Text>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} />
            <Button title="Create Account" onPress={handleSignup} />
            <Button title="Back to Login" onPress={() => navigation.navigate("Login")} />
        </View>
    );
}
