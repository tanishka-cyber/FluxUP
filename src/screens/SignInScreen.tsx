import React, { useState } from "react";

import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SignInScreen({
    onBack,
    onCreateAccount,
}: {
    onBack: () => void;
    onCreateAccount: () => void;
}) {
    // Controls whether the password is visible.
    const [showPassword, setShowPassword] = useState(false);

    return (
        // Outer browser page.
        <View style={styles.page}>

            {/* Phone-sized Flux screen. */}
            <View style={styles.screen}>

                {/* 
                  The entire Sign In page can scroll.
                  The content is allowed to grow naturally beyond
                  the height of the phone screen.
                */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    bounces={true}
                >

                    {/* Decorative pastel background. */}
                    <View
                        style={styles.backgroundDecoration}
                        pointerEvents="none"
                    >
                        <View style={styles.blueCircle} />
                        <View style={styles.greenCircle} />
                        <View style={styles.pinkCircle} />
                        <View style={styles.yellowCircle} />
                    </View>

                    {/* Main content. */}
                    <View style={styles.content}>

                        {/* Flux logo. */}
                        <TouchableOpacity
                            onPress={onBack}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.logo}>Flux</Text>
                        </TouchableOpacity>

                        {/* Heading. */}
                        <Text style={styles.title}>
                            Welcome back
                        </Text>

                        {/* Supporting text. */}
                        <Text style={styles.subtitle}>
                            Sign in to continue planning your school life with Flux.
                        </Text>

                        {/* EMAIL / USERNAME */}

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Email or username
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email or username"
                                placeholderTextColor="#96A39E"
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        {/* PASSWORD */}

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
                                />

                                {/* Password visibility button. */}
                                <TouchableOpacity
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.eye}>
                                        {showPassword ? "◉" : "◌"}
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        </View>

                        {/* Forgot password. */}
                        <TouchableOpacity
                            style={styles.forgotButton}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.forgotText}>
                                Forgot password?
                            </Text>
                        </TouchableOpacity>

                        {/* SIGN IN */}

                        <TouchableOpacity
                            style={styles.primaryButton}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.primaryButtonText}>
                                Sign in
                            </Text>
                        </TouchableOpacity>

                        {/* Divider. */}
                        <View style={styles.dividerRow}>

                            <View style={styles.divider} />

                            <Text style={styles.dividerText}>
                                or
                            </Text>

                            <View style={styles.divider} />

                        </View>

                        {/* GOOGLE */}

                        <TouchableOpacity
                            style={styles.socialButton}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.socialIcon}>
                                G
                            </Text>

                            <Text style={styles.socialText}>
                                Continue with Google
                            </Text>
                        </TouchableOpacity>

                        {/* APPLE */}

                        <TouchableOpacity
                            style={styles.socialButton}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.appleIcon}>
                                ●
                            </Text>

                            <Text style={styles.socialText}>
                                Continue with Apple
                            </Text>
                        </TouchableOpacity>

                        {/* CREATE ACCOUNT */}

                        <View style={styles.createAccountRow}>

                            <Text style={styles.createAccountText}>
                                Don't have an account?
                            </Text>

                            <TouchableOpacity
                                onPress={onCreateAccount}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.createAccountLink}>
                                    Create one
                                </Text>
                            </TouchableOpacity>

                        </View>

                        {/* Back button. */}
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={onBack}
                            activeOpacity={0.7}
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

    // --------------------------------------------------
    // OUTER PAGE
    // --------------------------------------------------

    page: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        backgroundColor: "#F3F3EF",
    },

    // Phone-sized Flux screen.
    screen: {
        width: "100%",
        maxWidth: 430,
        flex: 1,
        backgroundColor: "#FFFDF8",
        position: "relative",
        overflow: "hidden",
    },

    // ScrollView fills the available phone screen.
    scrollView: {
        flex: 1,
    },

    // IMPORTANT:
    // No fixed/minimum height here.
    // This allows the content to grow naturally and
    // lets the ScrollView reach the very bottom.
    scrollContent: {
        flexGrow: 1,
    },

    // --------------------------------------------------
    // BACKGROUND DECORATION
    // --------------------------------------------------

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

    // --------------------------------------------------
    // MAIN CONTENT
    // --------------------------------------------------

    content: {
        flexGrow: 1,
        zIndex: 1,
        paddingHorizontal: 28,
        paddingTop: 48,
        paddingBottom: 55,
    },

    // Flux logo.
    logo: {
        fontSize: 25,
        fontWeight: "800",
        color: "#087A70",
        letterSpacing: -1,
        marginBottom: 58,
    },

    // Slightly smaller than the previous version.
    title: {
        fontSize: 32,
        lineHeight: 38,
        fontWeight: "700",
        color: "#172C27",
        letterSpacing: -0.8,
    },

    // Comfortable but not oversized.
    subtitle: {
        marginTop: 12,
        fontSize: 15,
        lineHeight: 22,
        color: "#527D78",
        maxWidth: 350,
        marginBottom: 30,
    },

    // --------------------------------------------------
    // INPUTS
    // --------------------------------------------------

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

    // --------------------------------------------------
    // FORGOT PASSWORD
    // --------------------------------------------------

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

    // --------------------------------------------------
    // SIGN IN BUTTON
    // --------------------------------------------------

    primaryButton: {
        height: 54,
        borderRadius: 14,
        backgroundColor: "#087F70",
        alignItems: "center",
        justifyContent: "center",
    },

    primaryButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },

    // --------------------------------------------------
    // DIVIDER
    // --------------------------------------------------

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

    // --------------------------------------------------
    // GOOGLE / APPLE
    // --------------------------------------------------

    socialButton: {
        height: 54,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#D8E3DF",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },

    socialIcon: {
        fontSize: 17,
        fontWeight: "700",
        color: "#4285F4",
        marginRight: 10,
    },

    appleIcon: {
        fontSize: 14,
        color: "#172C27",
        marginRight: 10,
    },

    socialText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#263D38",
    },

    // --------------------------------------------------
    // CREATE ACCOUNT
    // --------------------------------------------------

    createAccountRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
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

    // --------------------------------------------------
    // BACK BUTTON
    // --------------------------------------------------

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