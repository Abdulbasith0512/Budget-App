import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Alert, 
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Platform
} from "react-native";
import { fetchExpenses } from "../services/api";
import { auth } from "../config/firebase";
import CardComponents from "../components/cardComponets";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function ExpensesScreen({ navigation }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    
    

   

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

        
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F8FF',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerContainer: {
        paddingHorizontal: wp('5%'),
        alignItems: 'center',
    },
    header: {
        marginTop: hp('%'),
        marginBottom: hp('%'),
        width: '100%',
        maxWidth: wp('90%'),
    },
    title: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        marginBottom: hp('1%'),
        color: '#333',
    },
    subtitle: {
        fontSize: wp('4%'),
        color: '#666',
    },
    content: {
        flex: 1,
        marginBottom: hp('10%'),
        paddingHorizontal: wp('5%'),
        width: '100%',
        maxWidth: wp('90%'),
        alignSelf: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F8FF',
    },
    loadingText: {
        marginTop: hp('1%'),
        fontSize: wp('4%'),
        color: '#666',
    },
    button: {
        position: 'absolute',
        bottom: hp('10%'),
        left: wp('5%'),
        right: wp('5%'),
        maxWidth: wp('90%'),
        alignSelf: 'center',
        backgroundColor: '#1976D2',
        borderRadius: wp('6%'),
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: hp('6%'),
        padding: wp('4%'),
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
        fontSize: wp('4%'),
        fontWeight: '500',
    },
    '@media (min-width: 768px)': {
        content: {
            maxWidth: wp('80%'),
        },
        button: {
            maxWidth: wp('60%'),
            bottom: hp('8%'),
        },
        title: {
            fontSize: wp('4%'),
        },
        subtitle: {
            fontSize: wp('3%'),
        },
    },
    '@media (min-width: 1024px)': {
        content: {
            maxWidth: wp('70%'),
        },
        button: {
            maxWidth: wp('50%'),
            bottom: hp('6%'),
        },
    },
});

