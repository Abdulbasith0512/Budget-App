import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    ScrollView, 
    StyleSheet, 
    Dimensions,
    SafeAreaView,
    Platform, StatusBar
} from "react-native";
import Slider from "@react-native-community/slider";
import { LineChart, BarChart } from "react-native-chart-kit";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const {height, width} = Dimensions.get('window');
const isIphoneX = () => {
    const dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        ((dimen.height === 780 || dimen.width === 780)
        || (dimen.height === 812 || dimen.width === 812)
        || (dimen.height === 844 || dimen.width === 844)
        || (dimen.height === 896 || dimen.width === 896)
        || (dimen.height === 926 || dimen.width === 926))
    );
};



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
        <SafeAreaView style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.headerText}>
                    🔥 FIRE Planner
                </Text>
    
                {/* Age Input */}
                <View style={styles.card}>
                    <Text style={styles.label}>Current Age: {age}</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(age)}
                        onChangeText={(val) => setAge(Number(val))}
                        placeholderTextColor="#666"
                    />
                </View>
    
                {/* Income Input */}
                <View style={styles.card}>
                    <Text style={styles.label}>Annual Income: ₹{income.toLocaleString()}</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(income)}
                        onChangeText={(val) => setIncome(Number(val))}
                        placeholderTextColor="#666"
                    />
                </View>
    
                {/* Expense Input */}
                <View style={styles.card}>
                    <Text style={styles.label}>Annual Expenses: ₹{expense.toLocaleString()}</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={String(expense)}
                        onChangeText={(val) => setExpense(Number(val))}
                        placeholderTextColor="#666"
                    />
                </View>
    
                {/* Savings Rate Slider */}
                <View style={styles.card}>
                    <Text style={styles.label}>Savings Rate: {savingsRate}%</Text>
                    <Slider
                        value={savingsRate}
                        onValueChange={setSavingsRate}
                        minimumValue={10}
                        maximumValue={80}
                        step={1}
                        style={styles.slider}
                        minimumTrackTintColor="#00ff99"
                        maximumTrackTintColor="#444"
                        thumbTintColor="#00ff99"
                    />
                </View>
    
                {/* Investment Return Slider */}
                <View style={styles.card}>
                    <Text style={styles.label}>Investment Return Rate: {investmentReturn}%</Text>
                    <Slider
                        value={investmentReturn}
                        onValueChange={setInvestmentReturn}
                        minimumValue={3}
                        maximumValue={15}
                        step={1}
                        style={styles.slider}
                        minimumTrackTintColor="#00ff99"
                        maximumTrackTintColor="#444"
                        thumbTintColor="#00ff99"
                    />
                </View>
    
                {/* FIRE Age Result */}
                <View style={styles.resultCard}>
                    <Text style={styles.resultText}>
                        🚀 FIRE Age: {Math.round(fireTarget)} years
                    </Text>
                </View>
    
                {/* FIRE Projection Chart */}
                <View style={styles.chartCard}>
                    <Text style={styles.label}>Projected Net Worth Growth</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                    >
                        <LineChart
                            data={{
                                labels: chartData.map((d) => d.year),
                                datasets: [{ data: chartData.map((d) => d.netWorth) }],
                            }}
                            width={width * 1.2}
                            height={220}
                            yAxisLabel="₹"
                            chartConfig={{
                                backgroundColor: "#1a1a1a",
                                backgroundGradientFrom: "#1a1a1a",
                                backgroundGradientTo: "#262626",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 255, 153, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#00ff99"
                                }
                            }}
                            bezier
                            style={styles.chart}
                        />
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingBottom: isIphoneX() ? 34 : 0,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: wp('4%'),
        paddingBottom: hp('10%'),
    },
    headerText: {
        fontSize: wp('7%'),
        color: 'white',
        fontWeight: 'bold',
        marginBottom: hp('3%'),
        textAlign: 'center',
        marginTop: hp('2%'),
    },
    card: {
        padding: wp('4%'),
        marginBottom: hp('2%'),
        backgroundColor: '#1a1a1a',
        borderRadius: wp('3%'),
        shadowColor: '#00ff99',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: wp('92%'),
        alignSelf: 'center',
    },
    label: {
        fontSize: wp('4%'),
        color: '#999',
        marginBottom: hp('1%'),
    },
    input: {
        backgroundColor: '#262626',
        color: 'white',
        padding: wp('3%'),
        borderRadius: wp('2%'),
        fontSize: wp('4%'),
        width: '100%',
        minHeight: hp('6%'),
    },
    slider: {
        width: '100%',
        height: hp('5%'),
    },
    resultCard: {
        padding: wp('5%'),
        marginVertical: hp('3%'),
        backgroundColor: '#1a1a1a',
        borderRadius: wp('3%'),
        borderLeftWidth: 4,
        borderLeftColor: '#00ff99',
        width: wp('92%'),
        alignSelf: 'center',
    },
    resultText: {
        fontSize: wp('6%'),
        color: '#00ff99',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    chartCard: {
        padding: wp('4%'),
        marginBottom: hp('3%'),
        backgroundColor: '#1a1a1a',
        borderRadius: wp('3%'),
        width: wp('92%'),
        alignSelf: 'center',
    },
    chart: {
        marginVertical: hp('1%'),
        borderRadius: wp('4%'),
    },
    // Add responsive styles for different screen sizes
    '@media (min-width: 768px)': {
        card: {
            width: wp('80%'),
            maxWidth: 600,
        },
        chartCard: {
            width: wp('80%'),
            maxWidth: 600,
        },
        resultCard: {
            width: wp('80%'),
            maxWidth: 600,
        },
        headerText: {
            fontSize: wp('5%'),
        },
        input: {
            fontSize: wp('3.5%'),
        },
    },
    // Add tablet-specific styles
    '@media (min-width: 1024px)': {
        card: {
            width: wp('70%'),
            maxWidth: 800,
        },
        chartCard: {
            width: wp('70%'),
            maxWidth: 800,
        },
        resultCard: {
            width: wp('70%'),
            maxWidth: 800,
        },
    }
});

export default FireScreen;
