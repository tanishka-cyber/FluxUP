
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { supabase } from "../services/supabase";

type Props = {
    onBack: () => void;
    onAccountCreated: () => void;
    onSignIn: () => void;
};

function showMessage(title: string, message: string) {
    if (Platform.OS === "web") {
        if (typeof window !== "undefined") {
            window.alert(`${title}\n\n${message}`);
        }
    } else {
        Alert.alert(title, message);
    }
}

export default function CreateAccountScreen({
    onBack,
    onAccountCreated,
    onSignIn,
}: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleCreateAccount() {
        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanName || !cleanEmail || !password || !confirmPassword) {
            setErrorMessage("Please complete all fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        if (password.length < 8) {
            setErrorMessage("Use a password with at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Your passwords do not match.");
            return;
        }

        if (loading) return;

        setLoading(true);
        setErrorMessage("");

        try {
            const { data, error } = await supabase.auth.signUp({
                email: cleanEmail,
                password,
                options: {
                    data: {
                        full_name: cleanName,
                    },
                },
            });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            setPassword("");
            setConfirmPassword("");

            if (data.session) {
                // Email confirmation is disabled and the student
                // is already authenticated.
                onAccountCreated();
            } else {
                // Email confirmation is enabled.
                showMessage(
                    "Check your email",
                    "Your account was created. Please open your email and confirm your address before signing in."
                );
                onSignIn();
            }
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Could not create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.page}>
            <View style={styles.screen}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View
                        style={styles.backgroundDecoration}
                        pointerEvents="none"
                    >
                        <View style={styles.blueCircle} />
                        <View style={styles.greenCircle} />
                        <View style={styles.pinkCircle} />
                        <View style={styles.yellowCircle} />
                    </View>

                    <View style={styles.content}>
                        <TouchableOpacity onPress={onBack}>
                            <Text style={styles.logo}>FluxUP</Text>
                        </TouchableOpacity>

                        <Text style={styles.title}>
                            Create your account
                        </Text>

                        <Text style={styles.subtitle}>
                            Get started with Flux in seconds.
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Full name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Jane Doe"
                                placeholderTextColor="#96A39E"
                                autoCapitalize="words"
                                autoComplete="name"
                                value={name}
                                onChangeText={setName}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor="#96A39E"
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                autoComplete="email"
                                value={email}
                                onChangeText={setEmail}
                                editable={!loading}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={styles.passwordRow}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="At least 8 characters"
                                    placeholderTextColor="#96A39E"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoComplete="new-password"
                                    value={password}
                                    onChangeText={setPassword}
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    accessibilityLabel={
                                        showPassword ? "Hide password" : "Show password"
                                    }
                                >
                                    <Text style={styles.eye}>
                                        {showPassword ? "◉" : "◌"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Confirm password
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Re-enter your password"
                                placeholderTextColor="#96A39E"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                editable={!loading}
                                onSubmitEditing={handleCreateAccount}
                            />
                        </View>

                        {!!errorMessage && (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>
                                    {errorMessage}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.primaryButton,
                                loading && styles.disabledButton,
                            ]}
                            onPress={handleCreateAccount}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.primaryButtonText}>
                                    Create account
                                </Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.signInRow}>
                            <Text style={styles.signInText}>
                                Already have an account?
                            </Text>
                            <TouchableOpacity
                                onPress={onSignIn}
                                disabled={loading}
                            >
                                <Text style={styles.signInLink}>
                                    Sign in
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        backgroundColor: "#F3F3EF",
    },
    screen: {
        width: "100%",
        maxWidth: 430,
        flex: 1,
        backgroundColor: "#FFFDF8",
        position: "relative",
        overflow: "hidden",
    },
    scrollView: { flex: 1 },
    scrollContent: { flexGrow: 1 },
    backgroundDecoration: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 0,
    },
    blueCircle: {
        position: "absolute",
        width: 210,
        height: 210,
        borderRadius: 105,
        backgroundColor: "#D4EDF2",
        top: -80,
        right: -75,
    },
    greenCircle: {
        position: "absolute",
        width: 175,
        height: 175,
        borderRadius: 88,
        backgroundColor: "#D7F0D4",
        top: 75,
        left: -100,
    },
    pinkCircle: {
        position: "absolute",
        width: 155,
        height: 155,
        borderRadius: 78,
        backgroundColor: "#F5DDE4",
        bottom: 55,
        right: -75,
    },
    yellowCircle: {
        position: "absolute",
        width: 125,
        height: 125,
        borderRadius: 63,
        backgroundColor: "#F7E9BE",
        bottom: -40,
        left: -50,
    },
    content: {
        flexGrow: 1,
        zIndex: 1,
        paddingHorizontal: 28,
        paddingTop: 28,
        paddingBottom: 55,
    },
    logo: {
        fontSize: 25,
        fontWeight: "800",
        color: "#087A70",
        letterSpacing: -1,
        marginBottom: 42,
    },
    title: {
        fontSize: 32,
        lineHeight: 38,
        fontWeight: "700",
        color: "#172C27",
        letterSpacing: -0.8,
    },
    subtitle: {
        marginTop: 10,
        fontSize: 15,
        lineHeight: 22,
        color: "#527D78",
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 18,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#375A55",
        marginBottom: 8,
    },
    input: {
        height: 53,
        borderWidth: 1,
        borderColor: "#D8E3DF",
        borderRadius: 13,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        fontSize: 15,
        color: "#172C27",
    },
    passwordRow: {
        height: 53,
        borderWidth: 1,
        borderColor: "#D8E3DF",
        borderRadius: 13,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 16,
        paddingRight: 14,
    },
    passwordInput: {
        flex: 1,
        height: "100%",
        fontSize: 15,
        color: "#172C27",
    },
    eye: {
        fontSize: 18,
        color: "#64827C",
    },
    primaryButton: {
        height: 54,
        borderRadius: 14,
        backgroundColor: "#087F70",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
    },
    disabledButton: { opacity: 0.65 },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    errorBox: {
        backgroundColor: "#FCECE9",
        borderRadius: 11,
        padding: 12,
        marginBottom: 14,
    },
    errorText: {
        color: "#A23D36",
        fontSize: 12,
        lineHeight: 18,
    },
    signInRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    signInText: {
        fontSize: 14,
        color: "#71807B",
    },
    signInLink: {
        fontSize: 14,
        fontWeight: "700",
        color: "#087F70",
        marginLeft: 5,
    },
});
