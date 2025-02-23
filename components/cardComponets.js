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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
        padding: wp('5%'),
        borderBottomLeftRadius: wp('6%'),
        borderBottomRightRadius: wp('6%'),
    },
    balanceLabel: {
        color: '#E0FFF7',
        fontSize: wp('3.5%'),
        marginBottom: hp('1%'),
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('2.5%'),
    },
    balanceAmount: {
        color: '#FFFFFF',
        fontSize: wp('7%'),
        fontWeight: '600',
    },
    progressBarContainer: {
        height: hp('1%'),
        backgroundColor: '#052224',
        borderRadius: wp('1%'),
        marginBottom: hp('2.5%'),
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: wp('1%'),
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('1.2%'),
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        padding: wp('4%'),
        borderRadius: wp('4%'),
        width: '48%',
    },
    summaryLabel: {
        color: '#666',
        fontSize: wp('3.5%'),
        marginBottom: hp('0.6%'),
    },
    summaryAmount: {
        color: '#00B386',
        fontSize: wp('4%'),
        fontWeight: '600',
    },
    summaryExpense: {
        color: '#FF6B6B',
        fontSize: wp('4%'),
        fontWeight: '600',
    },
    transactionsContainer: {
        flex: 1,
        padding: wp('5%'),
    },
    transactionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    transactionsTitle: {
        fontSize: wp('4.5%'),
        fontWeight: '600',
        color: '#333',
    },
    seeAll: {
        color: '#00B386',
        fontSize: wp('3.5%'),
    },
    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: wp('4%'),
        borderRadius: wp('4%'),
        marginBottom: hp('1.2%'),
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
        padding: wp('2.5%'),
        borderRadius: wp('3%'),
        marginRight: wp('4%'),
    },
    icon: {
        width: wp('6%'),
        height: wp('6%'),
    },
    transactionDetails: {
        flex: 1,
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('0.6%'),
    },
    description: {
        fontSize: wp('4%'),
        fontWeight: '500',
        color: '#333',
        flex: 1,
        marginRight: wp('2%'),
    },
    transactionTitle: {
        fontSize: wp('3%'),
        fontWeight: '500',
        color: '#666',
    },
    transactionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    amount: {
        fontSize: wp('4%'),
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
        fontSize: wp('3.5%'),
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
        padding: wp('5%'),
    },
    errorText: {
        fontSize: wp('4%'),
        color: '#FF6B6B',
        marginBottom: hp('2%'),
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#00B386',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('6%'),
        borderRadius: wp('2%'),
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: wp('4%'),
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: wp('4%'),
        color: '#666',
        marginTop: hp('3%'),
    },
    '@media (min-width: 768px)': {
        balanceAmount: {
            fontSize: wp('6%'),
        },
        summaryCard: {
            padding: wp('3%'),
        },
        transactionCard: {
            maxWidth: wp('80%'),
            alignSelf: 'center',
        },
        icon: {
            width: wp('5%'),
            height: wp('5%'),
        },
    },
    '@media (min-width: 1024px)': {
        balanceContainer: {
            maxWidth: wp('80%'),
            alignSelf: 'center',
        },
        transactionCard: {
            maxWidth: wp('70%'),
        },
        summaryContainer: {
            maxWidth: wp('80%'),
            alignSelf: 'center',
        },
    },
});
