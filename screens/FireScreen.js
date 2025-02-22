import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import Slider from "@react-native-community/slider";
import { LineChart, BarChart } from "react-native-chart-kit";

const FireScreen = () => {
    const [age, setAge] = useState(28);
    const [income, setIncome] = useState(700000);
    const [expense, setExpense] = useState(400000);
    const [savingsRate, setSavingsRate] = useState(30);
    const [investmentReturn, setInvestmentReturn] = useState(7);
    const [withdrawalRate, setWithdrawalRate] = useState(4); // FIRE rule of 4%
    const [fireTarget, setFireTarget] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const annualSavings = (income * savingsRate) / 100;
        const fireGoal = (expense * 100) / withdrawalRate; // FIRE Number Calculation
        const yearsToFire = fireGoal / annualSavings;

        setFireTarget(yearsToFire + age);
        setProgress((annualSavings / fireGoal) * 100);
    }, [income, expense, savingsRate, withdrawalRate]);

    // Sample Data for Projections
    const chartData = Array.from({ length: 20 }, (_, i) => ({
        year: age + i,
        netWorth: (income * savingsRate) / 100 * i * Math.pow(1 + investmentReturn / 100, i),
    }));

    return (
        <ScrollView style={{ padding: 16, backgroundColor: "black", minHeight: "100%" }}>
            <Text style={{ fontSize: 24, color: "white", fontWeight: "bold", marginBottom: 16 }}>
                🔥 FIRE Planner
            </Text>

            {/* Age Input */}
            <View style={{ padding: 16, marginBottom: 16, backgroundColor: "#222", borderRadius: 10 }}>
                <Text style={{ fontSize: 18, color: "gray" }}>Current Age: {age}</Text>
                <TextInput
                    style={{ backgroundColor: "#333", color: "white", padding: 8, marginTop: 8, borderRadius: 8 }}
                    keyboardType="numeric"
                    value={String(age)}
                    onChangeText={(val) => setAge(Number(val))}
                />
            </View>

            {/* Income Input */}
            <View style={{ padding: 16, marginBottom: 16, backgroundColor: "#222", borderRadius: 10 }}>
                <Text style={{ fontSize: 18, color: "gray" }}>Annual Income: ₹{income.toLocaleString()}</Text>
                <TextInput
                    style={{ backgroundColor: "#333", color: "white", padding: 8, marginTop: 8, borderRadius: 8 }}
                    keyboardType="numeric"
                    value={String(income)}
                    onChangeText={(val) => setIncome(Number(val))}
                />
            </View>

            {/* Expense Input */}
            <View style={{ padding: 16, marginBottom: 16, backgroundColor: "#222", borderRadius: 10 }}>
                <Text style={{ fontSize: 18, color: "gray" }}>Annual Expenses: ₹{expense.toLocaleString()}</Text>
                <TextInput
                    style={{ backgroundColor: "#333", color: "white", padding: 8, marginTop: 8, borderRadius: 8 }}
                    keyboardType="numeric"
                    value={String(expense)}
                    onChangeText={(val) => setExpense(Number(val))}
                />
            </View>

            {/* Savings Rate Slider */}
            <View style={{ padding: 16, marginBottom: 16, backgroundColor: "#222", borderRadius: 10 }}>
                <Text style={{ fontSize: 18, color: "gray" }}>Savings Rate: {savingsRate}%</Text>
                <Slider
                    value={savingsRate}
                    onValueChange={setSavingsRate}
                    minimumValue={10}
                    maximumValue={80}
                    step={1}
                    style={{ width: "100%" }}
                    minimumTrackTintColor="#00ff99"
                    maximumTrackTintColor="#888"
                    thumbTintColor="#00ff99"
                />
            </View>

            {/* Investment Return Slider */}
            <View style={{ padding: 16, marginBottom: 16, backgroundColor: "#222", borderRadius: 10 }}>
                <Text style={{ fontSize: 18, color: "gray" }}>Investment Return Rate: {investmentReturn}%</Text>
                <Slider
                    value={investmentReturn}
                    onValueChange={setInvestmentReturn}
                    minimumValue={3}
                    maximumValue={15}
                    step={1}
                    style={{ width: "100%" }}
                    minimumTrackTintColor="#00ff99"
                    maximumTrackTintColor="#888"
                    thumbTintColor="#00ff99"
                />
            </View>

            {/* FIRE Age Result */}
            <View style={{ padding: 16, marginBottom: 16, backgroundColor: "#222", borderRadius: 10 }}>
                <Text style={{ fontSize: 20, color: "green", fontWeight: "bold" }}>
                    🚀 FIRE Age: {Math.round(fireTarget)} years
                </Text>
            </View>

            {/* FIRE Projection Chart */}
            <View style={{ padding: 16, marginBottom: 16, backgroundColor: "#222", borderRadius: 10 }}>
                <Text style={{ fontSize: 18, color: "gray" }}>Projected Net Worth Growth</Text>
                <LineChart
                    data={{
                        labels: chartData.map((d) => d.year),
                        datasets: [{ data: chartData.map((d) => d.netWorth) }],
                    }}
                    width={350}
                    height={200}
                    yAxisLabel="₹"
                    chartConfig={{
                        backgroundColor: "#222",
                        backgroundGradientFrom: "#222",
                        backgroundGradientTo: "#333",
                        color: () => "#00ff99",
                    }}
                    bezier
                />
            </View>
        </ScrollView>
    );
};

export default FireScreen;
