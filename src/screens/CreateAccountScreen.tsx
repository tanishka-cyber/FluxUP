import React, { useState } from "react";

import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CreateAccountScreen({
    onBack,
    onAccountCreated,
    onSignIn,
}: {
    onBack: () => void;
    onAccountCreated: () => void;
    onSignIn: () => void;
}) {
    // Controls whether the password is visible.
    const [showPassword, setShowPassword] = useState(false);

    return (
        // Outer browser page.
        <View style={styles.page}>

            {/* Phone-sized Flux screen. */}
            <View style={styles.screen}>

                {/* Entire screen is scrollable. */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
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
                        <Text style={styles.logo}>
                            Flux
                        </Text>

                        {/* Heading. */}
                        <Text style={styles.title}>
                            Create your account
                        </Text>

                        {/* Supporting text. */}
                        <Text style={styles.subtitle}>
                            Get started with Flux in seconds.
                        </Text>

                        {/* FULL NAME */}

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Full name
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Jane Doe"
                                placeholderTextColor="#96A39E"
                                autoCapitalize="words"
                            />
                        </View>

                        {/* EMAIL */}

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Email address
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
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
                                    placeholder="Create a password"
                                    placeholderTextColor="#96A39E"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />

                                {/* Show / hide password. */}
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

                        {/* CREATE ACCOUNT BUTTON */}

                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={onAccountCreated}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.primaryButtonText}>
                                Create account
                            </Text>
                        </TouchableOpacity>

                        {/* Existing account prompt. */}
                        <View style={styles.signInRow}>

                            <Text style={styles.signInText}>
                                Already have an account?
                            </Text>

                            <TouchableOpacity
                                onPress={onSignIn}
                                activeOpacity={0.7}
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

    // Scrollable area.
    scrollView: {
        flex: 1,
    },

    // Allows content to grow naturally.
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

    // --------------------------------------------------
    // CONTENT
    // --------------------------------------------------

    content: {
        flexGrow: 1,
        zIndex: 1,
        paddingHorizontal: 28,
        paddingTop: 28,
        paddingBottom: 55,
    },

    // Flux logo.
    logo: {
        fontSize: 25,
        fontWeight: "800",
        color: "#087A70",
        letterSpacing: -1,
        marginBottom: 42,
    },

    // Main heading.
    title: {
        fontSize: 32,
        lineHeight: 38,
        fontWeight: "700",
        color: "#172C27",
        letterSpacing: -0.8,
    },

    // Supporting text.
    subtitle: {
        marginTop: 10,
        fontSize: 15,
        lineHeight: 22,
        color: "#527D78",
        marginBottom: 30,
    },

    // --------------------------------------------------
    // INPUTS
    // --------------------------------------------------

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

    // --------------------------------------------------
    // CREATE ACCOUNT BUTTON
    // --------------------------------------------------

    primaryButton: {
        height: 54,
        borderRadius: 14,
        backgroundColor: "#087F70",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
    },

    primaryButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },

    // --------------------------------------------------
    // SIGN IN LINK
    // --------------------------------------------------

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