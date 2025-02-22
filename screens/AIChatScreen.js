import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { getFinancialAdvice } from "../services/api";

export default function AIChatScreen() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");

    const handleAskAI = async () => {
        if (!input) return;
        const advice = await getFinancialAdvice(input);
        setResponse(advice);
    };

    return (
        <View>
            <Text>Ask AI for Financial Advice:</Text>
            <TextInput value={input} onChangeText={setInput} />
            <Button title="Ask AI" onPress={handleAskAI} />
            {response ? <Text>AI: {response}</Text> : null}
        </View>
    );
}
