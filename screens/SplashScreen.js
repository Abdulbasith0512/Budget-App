import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
    Platform
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';

const SplashScreen = ({ navigation }) => {
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const titleMoveAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        // Start animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(titleMoveAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();

        // Navigate to main screen after delay
        setTimeout(() => {
            navigation.replace('Login');
        }, 3000);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
            
            <Animated.View style={[
                styles.logoContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                }
            ]}>
                <View style={styles.iconCircle}>
                    <Feather name="dollar-sign" size={wp('15%')} color="#6EE7B7" />
                </View>
            </Animated.View>

            <Animated.View style={[
                styles.textContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: titleMoveAnim }]
                }
            ]}>
                <Text style={styles.title}>Budgeting</Text>
                <Text style={styles.subtitle}>For All</Text>
                <Text style={styles.tagline}>Manage your finances wisely</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: hp('4%'),
    },
    iconCircle: {
        width: wp('30%'),
        height: wp('30%'),
        borderRadius: wp('15%'),
        backgroundColor: 'rgba(110, 231, 183, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(110, 231, 183, 0.3)',
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: wp('12%'),
        fontWeight: 'bold',
        color: '#F8FAFC',
        letterSpacing: wp('0.5%'),
    },
    subtitle: {
        fontSize: wp('8%'),
        fontWeight: '600',
        color: '#6EE7B7',
        marginTop: hp('-1%'),
    },
    tagline: {
        fontSize: wp('4%'),
        color: '#94A3B8',
        marginTop: hp('2%'),
        letterSpacing: wp('0.2%'),
    },
});

export default SplashScreen;