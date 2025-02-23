import React, { useEffect, useState, useCallback } from "react";
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    Alert, 
    Image, 
    ActivityIndicator, 
    TouchableOpacity,
    Dimensions,
    Platform 
} from "react-native";
import { fetchExpenses } from "../services/api";

const { width } = Dimensions.get('window');
const scale = width / 375;

const normalize = (size) => Math.round(scale * size);

const formatDate = (timestamp) => {
    if (timestamp?._seconds) {
        return new Date(timestamp._seconds * 1000).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            month: "short",
            day: "numeric",
        });
    }
    return "Invalid Date";
};

const categoryIcons = {
    Salary: require("../assets/salary.png"),
    Groceries: require("../assets/groceries.png"),
    Rent: require("../assets/rent.png"),
    transport: require("../assets/transport.png"),
    Default: require("../assets/default.png"),
};

export default function CardComponents() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        loadExpenses();
    }, []);

    const calculateTotals = (data) => {
        const totals = data.reduce((acc, item) => {
            if (item.amount < 0) {
                acc.expenses += Math.abs(item.amount);
            } else {
                acc.income += item.amount;
            }
            return acc;
        }, { expenses: 0, income: 0 });
        
        totals.balance = totals.income - totals.expenses;
        return totals;
    };

    const loadExpenses = async () => {
        try {
            setError(null);
            setLoading(true);
            const data = await fetchExpenses();

            if (!Array.isArray(data)) {
                throw new Error("Invalid data format from API");
            }

            const totals = calculateTotals(data);
            setExpenses(data);
            setTotalExpenses(totals.expenses);
            setTotalIncome(totals.income);
            setBalance(totals.balance);
        } catch (error) {
            console.error("Error fetching expenses:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadExpenses().finally(() => setRefreshing(false));
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.transactionCard}>
            <View style={styles.iconContainer}>
                <Image 
                    source={categoryIcons[item.category] || categoryIcons.Default} 
                    style={styles.icon} 
                />
            </View>
            <View style={styles.transactionDetails}>
                <View style={styles.transactionHeader}>
                <Text style={styles.description}>{item.description}</Text>
                    <Text style={[styles.amount, item.amount < 0 ? styles.expense : styles.income]}>
                        {item.amount < 0 ? '-' : '+'}₹{Math.abs(item.amount).toLocaleString()}
                    </Text>
                </View>
                <View style={styles.transactionFooter}>
                    <Text style={styles.date}>{formatDate(item.date)}</Text>
                    <Text style={styles.transactionTitle}>{item.category}</Text>
                </View>
            </View>
        </View>
    );

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity onPress={loadExpenses} style={styles.retryButton}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Balance Section */}
            <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Account Balance</Text>
                <View style={styles.balanceRow}>
                    <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
                </View>
                
                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${(totalExpenses/totalIncome) * 100}%` }]} />
                </View>
                
                {/* Summary Cards */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Income</Text>
                        <Text style={styles.summaryAmount}>₹{totalIncome.toLocaleString()}</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Expense</Text>
                        <Text style={styles.summaryExpense}>₹{totalExpenses.toLocaleString()}</Text>
                    </View>
                </View>
            </View>

            {/* Transactions Section */}
            <View style={styles.transactionsContainer}>
                <View style={styles.transactionsHeader}>
                    <Text style={styles.transactionsTitle}>Transactions</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See all</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#00B386" />
                    </View>
                ) : (
                    <FlatList
                        data={expenses}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No transactions found</Text>
                        }
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    balanceContainer: {
        backgroundColor: '#00B386',
        padding: normalize(20),
        borderBottomLeftRadius: normalize(25),
        borderBottomRightRadius: normalize(25),
    },
    balanceLabel: {
        color: '#E0FFF7',
        fontSize: normalize(14),
        marginBottom: normalize(8),
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(20),
    },
    balanceAmount: {
        color: '#FFFFFF',
        fontSize: normalize(28),
        fontWeight: '600',
    },
    progressBarContainer: {
        height: normalize(8),
        backgroundColor: '#052224',
        borderRadius: normalize(4),
        marginBottom: normalize(20),
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: normalize(4),
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: normalize(10),
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        padding: normalize(15),
        borderRadius: normalize(15),
        width: '48%',
    },
    summaryLabel: {
        color: '#666',
        fontSize: normalize(14),
        marginBottom: normalize(5),
    },
    summaryAmount: {
        color: '#00B386',
        fontSize: normalize(16),
        fontWeight: '600',
    },
    summaryExpense: {
        color: '#FF6B6B',
        fontSize: normalize(16),
        fontWeight: '600',
    },
    transactionsContainer: {
        flex: 1,
        padding: normalize(20),
    },
    transactionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(15),
    },
    transactionsTitle: {
        fontSize: normalize(18),
        fontWeight: '600',
        color: '#333',
    },
    seeAll: {
        color: '#00B386',
        fontSize: normalize(14),
    },
    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: normalize(15),
        borderRadius: normalize(15),
        marginBottom: normalize(10),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    iconContainer: {
        backgroundColor: '#F0F6FF',
        padding: normalize(10),
        borderRadius: normalize(12),
        marginRight: normalize(15),
    },
    icon: {
        width: normalize(24),
        height: normalize(24),
    },
    transactionDetails: {
        flex: 1,
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(5),
    },
    transactionTitle: {
        fontSize: normalize(12),
        fontWeight: '500',
        color: '#666',
    },
    transactionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    amount: {
        fontSize: normalize(16),
        fontWeight: '600',
    },
    income: {
        color: '#00B386',
    },
    expense: {
        color: '#FF6B6B',
    },
    date: {
        color: '#666',
        fontSize: normalize(14),
    },
    frequency: {
        color: '#666',
        fontSize: normalize(14),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: normalize(20),
    },
    errorText: {
        fontSize: normalize(16),
        color: '#FF6B6B',
        marginBottom: normalize(16),
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#00B386',
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(24),
        borderRadius: normalize(8),
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: normalize(16),
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: normalize(16),
        color: '#666',
        marginTop: normalize(24),
    },
});