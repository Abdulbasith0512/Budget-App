import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    Alert,
    TouchableOpacity,
    SafeAreaView,
    Switch,
    Dimensions,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { addExpense, categorizeExpense } from "../services/api";
import { auth } from "../config/firebase";

const { width } = Dimensions.get('window');
const scale = width / 375;
const normalize = (size) => Math.round(scale * size);

export default function AddExpenseScreen({ navigation }) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [user, setUser] = useState(null);
    const [isIncome, setIsIncome] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                navigation.replace("Login");
            } else {
                setUser(user);
            }
        });

        return unsubscribe;
    }, []);

    const handleCategorization = async () => {
        if (!description) return Alert.alert("Error", "Enter a description");
        const result = await categorizeExpense(description);
        setCategory(result);
    };

    const handleAddTransaction = async () => {
        if (!description || !amount) {
            return Alert.alert("Error", "All fields are required");
        }

        try {
            const finalAmount = isIncome ? 
                Math.abs(parseFloat(amount)) : 
                -Math.abs(parseFloat(amount));

            await addExpense(
                description, 
                finalAmount, 
                category || (isIncome ? "Income" : "Other")
            );
            
            Alert.alert(
                "Success", 
                `${isIncome ? "Income" : "Expense"} added successfully!`
            );
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    if (!user) return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00B386" />
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>
                            Add {isIncome ? 'Income' : 'Expense'}
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Track your financial flow
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.switchContainer}>
                            <TouchableOpacity 
                                style={[
                                    styles.switchButton,
                                    !isIncome && styles.switchButtonActive
                                ]}
                                onPress={() => setIsIncome(false)}
                            >
                                <Text style={[
                                    styles.switchText,
                                    !isIncome && styles.switchTextActive
                                ]}>Expense</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[
                                    styles.switchButton,
                                    isIncome && styles.switchButtonActive
                                ]}
                                onPress={() => setIsIncome(true)}
                            >
                                <Text style={[
                                    styles.switchText,
                                    isIncome && styles.switchTextActive
                                ]}>Income</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.amountContainer}>
                            <Text style={styles.currencySymbol}>₹</Text>
                            <TextInput
                                style={styles.amountInput}
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                                placeholder="0.00"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={styles.input}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="What's this for?"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <TouchableOpacity 
                            style={styles.categoryButton}
                            onPress={handleCategorization}
                        >
                            <Text style={styles.categoryButtonText}>
                                {category ? category : 'Select Category'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[
                                styles.submitButton,
                                { backgroundColor: isIncome ? '#00B386' : '#FF6B6B' }
                            ]}
                            onPress={handleAddTransaction}
                        >
                            <Text style={styles.submitButtonText}>
                                Add {isIncome ? 'Income' : 'Expense'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: normalize(20),
    },
    header: {
        marginBottom: normalize(30),
    },
    headerTitle: {
        fontSize: normalize(24),
        fontWeight: '600',
        color: '#333',
        marginBottom: normalize(8),
    },
    headerSubtitle: {
        fontSize: normalize(16),
        color: '#666',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(20),
        padding: normalize(20),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    switchContainer: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        borderRadius: normalize(12),
        padding: normalize(4),
        marginBottom: normalize(20),
    },
    switchButton: {
        flex: 1,
        paddingVertical: normalize(12),
        alignItems: 'center',
        borderRadius: normalize(10),
    },
    switchButtonActive: {
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    switchText: {
        fontSize: normalize(16),
        color: '#666',
        fontWeight: '500',
    },
    switchTextActive: {
        color: '#00B386',
        fontWeight: '600',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: normalize(30),
    },
    currencySymbol: {
        fontSize: normalize(36),
        color: '#333',
        marginRight: normalize(8),
    },
    amountInput: {
        fontSize: normalize(36),
        color: '#333',
        minWidth: normalize(150),
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: normalize(20),
    },
    label: {
        fontSize: normalize(14),
        color: '#666',
        marginBottom: normalize(8),
    },
    input: {
        backgroundColor: '#F8F9FA',
        borderRadius: normalize(12),
        padding: normalize(16),
        fontSize: normalize(16),
        color: '#333',
    },
    categoryButton: {
        backgroundColor: '#F8F9FA',
        borderRadius: normalize(12),
        padding: normalize(16),
        alignItems: 'center',
        marginBottom: normalize(20),
    },
    categoryButtonText: {
        fontSize: normalize(16),
        color: '#666',
        fontWeight: '500',
    },
    submitButton: {
        borderRadius: normalize(12),
        padding: normalize(16),
        alignItems: 'center',
        marginTop: normalize(10),
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: normalize(16),
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: normalize(12),
        fontSize: normalize(16),
        color: '#666',
    },
});