
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
    onCreateAccount: () => void;
    onSignedIn?: () => void;
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

export default function SignInScreen({
    onBack,
    onCreateAccount,
    onSignedIn,
}: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSignIn() {
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            setErrorMessage("Enter your email and password.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            setErrorMessage("Enter a valid email address.");
            return;
        }

        if (loading) return;

        setLoading(true);
        setErrorMessage("");

        try {
            const { error } =
                await supabase.auth.signInWithPassword({
                    email: normalizedEmail,
                    password,
                });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            setPassword("");
            onSignedIn?.();
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Could not sign in. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleForgotPassword() {
        const normalizedEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            setErrorMessage(
                "Enter your email address first, then tap Forgot password."
            );
            return;
        }

        if (loading) return;

        setLoading(true);
        setErrorMessage("");

        try {
            const { error } =
                await supabase.auth.resetPasswordForEmail(
                    normalizedEmail
                );

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            showMessage(
                "Check your email",
                "If an account exists for this email, password reset instructions will be sent. The reset link requires a configured redirect and password-update screen."
            );
        } catch {
            setErrorMessage(
                "Could not request a password reset."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleGoogleSignIn() {
        showMessage(
            "Google sign-in",
            "Google sign-in is coming soon. Please use email and password for now."
        );
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
                        <TouchableOpacity
                            onPress={onBack}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.logo}>FluxUP</Text>
                        </TouchableOpacity>

                        <Text style={styles.title}>
                            Welcome back
                        </Text>

                        <Text style={styles.subtitle}>
                            Sign in to continue planning your school life with FluxUP.
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Email address
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
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
                            <Text style={styles.inputLabel}>
                                Password
                            </Text>

                            <View style={styles.passwordRow}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#96A39E"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoComplete="current-password"
                                    value={password}
                                    onChangeText={setPassword}
                                    editable={!loading}
                                    onSubmitEditing={handleSignIn}
                                />

                                <TouchableOpacity
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    activeOpacity={0.7}
                                    accessibilityLabel={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    <Text style={styles.eye}>
                                        {showPassword ? "◉" : "◌"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.forgotButton}
                            onPress={handleForgotPassword}
                            disabled={loading}
                        >
                            <Text style={styles.forgotText}>
                                Forgot password?
                            </Text>
                        </TouchableOpacity>

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
                            onPress={handleSignIn}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.primaryButtonText}>
                                    Sign in
                                </Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.dividerRow}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.divider} />
                        </View>

                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={handleGoogleSignIn}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.socialIcon}>G</Text>
                            <Text style={styles.socialText}>
                                Continue with Google
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.googleNote}>
                            Google sign-in will be available after setup.
                        </Text>

                        <View style={styles.createAccountRow}>
                            <Text style={styles.createAccountText}>
                                Don't have an account?
                            </Text>

                            <TouchableOpacity
                                onPress={onCreateAccount}
                                disabled={loading}
                            >
                                <Text style={styles.createAccountLink}>
                                    Create one
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={onBack}
                            disabled={loading}
                        >
                            <Text style={styles.backText}>
                                ← Back
                            </Text>
                        </TouchableOpacity>
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
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
        width: 230,
        height: 230,
        borderRadius: 115,
        backgroundColor: "#D4EDF2",
        top: -90,
        right: -80,
    },
    greenCircle: {
        position: "absolute",
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: "#D7F0D4",
        top: 90,
        left: -100,
    },
    pinkCircle: {
        position: "absolute",
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: "#F5DDE4",
        bottom: 80,
        right: -75,
    },
    yellowCircle: {
        position: "absolute",
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: "#F7E9BE",
        bottom: -40,
        left: -55,
    },
    content: {
        flexGrow: 1,
        zIndex: 1,
        paddingHorizontal: 28,
        paddingTop: 48,
        paddingBottom: 55,
    },
    logo: {
        fontSize: 25,
        fontWeight: "800",
        color: "#087A70",
        letterSpacing: -1,
        marginBottom: 58,
    },
    title: {
        fontSize: 32,
        lineHeight: 38,
        fontWeight: "700",
        color: "#172C27",
        letterSpacing: -0.8,
    },
    subtitle: {
        marginTop: 12,
        fontSize: 15,
        lineHeight: 22,
        color: "#527D78",
        maxWidth: 350,
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 17,
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
    forgotButton: {
        alignSelf: "flex-end",
        marginTop: -3,
        marginBottom: 22,
    },
    forgotText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#087F70",
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
    primaryButton: {
        height: 54,
        borderRadius: 14,
        backgroundColor: "#087F70",
        alignItems: "center",
        justifyContent: "center",
    },
    disabledButton: {
        opacity: 0.65,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 23,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#E4EBE8",
    },
    dividerText: {
        marginHorizontal: 12,
        fontSize: 13,
        color: "#96A39E",
    },
    socialButton: {
        height: 54,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#D8E3DF",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    socialIcon: {
        fontSize: 17,
        fontWeight: "700",
        color: "#4285F4",
        marginRight: 10,
    },
    socialText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#263D38",
    },
    googleNote: {
        textAlign: "center",
        color: "#71807B",
        fontSize: 11,
        marginTop: 9,
    },
    createAccountRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    createAccountText: {
        fontSize: 14,
        color: "#71807B",
    },
    createAccountLink: {
        fontSize: 14,
        fontWeight: "700",
        color: "#087F70",
        marginLeft: 5,
    },
    backButton: {
        alignSelf: "center",
        marginTop: 25,
        paddingVertical: 8,
    },
    backText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#527D78",
    },
});
