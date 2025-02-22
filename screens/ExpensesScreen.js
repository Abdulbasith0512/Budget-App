import React, { useEffect, useState, useCallback } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Alert, 
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Dimensions
} from "react-native";
import { fetchExpenses } from "../services/api";
import { auth } from "../config/firebase";
import CardComponents from "../components/cardComponets";

export default function ExpensesScreen({ navigation }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const { width, height } = Dimensions.get('window');
    const [scale, setScale] = useState(width / 375);

    const normalize = useCallback((size) => {
        return Math.round(scale * size);
    }, [scale]);

    useEffect(() => {
        const onChange = () => {
            const { width } = Dimensions.get('window');
            setScale(width / 375);
        };

        const subscription = Dimensions.addEventListener('change', onChange);
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        let isMounted = true;

        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!isMounted) return;

            if (!user) {
                console.log("User not authenticated. Redirecting...");
                navigation.replace("Login");
            } else {
                console.log("User authenticated:", user.email);
                setUser(user);
                loadExpenses(); // Fetch expenses after user is set
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    const loadExpenses = async () => {
        let isMounted = true;
        try {
            console.log("Fetching expenses...");
            const data = await fetchExpenses();
            console.log("Fetched Expenses:", data);

            if (isMounted) {
                setExpenses(data);
            }
        } catch (error) {
            console.error("Error fetching expenses:", error.message);
            if (isMounted) {
                Alert.alert("Error", error.message);
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
        return () => {
            isMounted = false;
        };
    };

    if (!user || loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading Expenses...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            

            <View style={styles.content}>
                <CardComponents expenses={expenses} />
            </View>

            <TouchableOpacity 
                style={[styles.button, { padding: normalize(15) }]}
                onPress={() => navigation.goBack()}
                accessibilityLabel="Go back to home screen"
                accessibilityRole="button"
            >
                <Text style={[styles.buttonText, { fontSize: normalize(16) }]}>
                    Back to Home
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F8FF',
    },
    headerContainer: {
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    header: {
        marginTop: 20,
        marginBottom: 40,
        width: '100%',
        maxWidth: 600,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    subtitle: {
        color: '#666',
    },
    content: {
        flex: 1,
        marginBottom: 80,
        paddingHorizontal: 20,
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F8FF',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    button: {
        position: 'absolute',
        bottom: '10%',
        left: '5%',
        right: '5%',
        maxWidth: 500,
        alignSelf: 'center',
        backgroundColor: '#1976D2',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 1000,
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
    }
});