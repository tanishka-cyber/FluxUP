
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { colors } from "../constants/colors";

export type StudentProfile = {
    name: string;
    email: string;
    school: string;
    grade: string;
};

type ProfileScreenProps = {
    profile: StudentProfile;
    onBack: () => void;
    onSave: (profile: StudentProfile) => void;
};

const GRADE_OPTIONS = [
    "9th Grade",
    "10th Grade",
    "11th Grade",
    "12th Grade",
    "College",
    "Other",
];

export default function ProfileScreen({
    profile,
    onBack,
    onSave,
}: ProfileScreenProps) {
    const [name, setName] = useState(profile.name);
    const [email, setEmail] = useState(profile.email);
    const [school, setSchool] = useState(profile.school);
    const [grade, setGrade] = useState(profile.grade);

    const [showGrades, setShowGrades] = useState(false);

    const initial = name.trim().charAt(0).toUpperCase() || "?";

    function handleSave() {
        if (!name.trim()) {
            Alert.alert(
                "Name required",
                "Please enter your name."
            );
            return;
        }

        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            Alert.alert(
                "Invalid email",
                "Please enter a valid email address."
            );
            return;
        }

        if (!school.trim()) {
            Alert.alert(
                "School required",
                "Please enter your school."
            );
            return;
        }

        onSave({
            name: name.trim(),
            email: email.trim(),
            school: school.trim(),
            grade,
        });
    }

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}

                <View style={styles.topRow}>
                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.backButton}
                    >
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>

                    <Text style={styles.logo}>FluxUP</Text>
                </View>

                <Text style={styles.eyebrow}>
                    YOUR ACCOUNT
                </Text>

                <Text style={styles.heading}>
                    A little about you.
                </Text>

                <Text style={styles.subtitle}>
                    Keep your student information up to date
                    so Flux feels like your own space.
                </Text>

                {/* PROFILE AVATAR */}

                <View style={styles.avatarSection}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarInitial}>
                            {initial}
                        </Text>
                    </View>

                    <Text style={styles.avatarName}>
                        {name.trim() || "Your name"}
                    </Text>

                    <Text style={styles.avatarSubtitle}>
                        Student profile
                    </Text>
                </View>

                {/* PERSONAL INFORMATION */}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Personal information
                    </Text>

                    <Text style={styles.sectionCaption}>
                        EDITABLE
                    </Text>
                </View>

                <View style={styles.formCard}>
                    <Text style={styles.inputLabel}>
                        Full name
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Your full name"
                        placeholderTextColor={colors.text.muted}
                        autoCapitalize="words"
                    />

                    <Text style={styles.inputLabel}>
                        Email address
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="you@example.com"
                        placeholderTextColor={colors.text.muted}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoCorrect={false}
                    />

                    <Text style={styles.inputLabel}>
                        School
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={school}
                        onChangeText={setSchool}
                        placeholder="Your school"
                        placeholderTextColor={colors.text.muted}
                    />

                    <Text style={styles.inputLabel}>
                        Grade level
                    </Text>

                    <TouchableOpacity
                        style={styles.gradeSelector}
                        onPress={() => setShowGrades(!showGrades)}
                        activeOpacity={0.75}
                    >
                        <Text style={styles.gradeValue}>
                            {grade || "Select your grade"}
                        </Text>

                        <Text style={styles.dropdownArrow}>
                            {showGrades ? "⌃" : "⌄"}
                        </Text>
                    </TouchableOpacity>

                    {showGrades && (
                        <View style={styles.gradeMenu}>
                            {GRADE_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.gradeOption,
                                        grade === option &&
                                        styles.gradeOptionSelected,
                                    ]}
                                    onPress={() => {
                                        setGrade(option);
                                        setShowGrades(false);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.gradeOptionText,
                                            grade === option &&
                                            styles.gradeOptionTextSelected,
                                        ]}
                                    >
                                        {option}
                                    </Text>

                                    {grade === option && (
                                        <Text style={styles.selectedCheck}>
                                            ✓
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* ACCOUNT INFORMATION */}

                <Text style={styles.sectionTitle}>
                    Your Flux account
                </Text>

                <View style={styles.accountCard}>
                    <View style={styles.accountIcon}>
                        <Text style={styles.accountIconText}>
                            ✦
                        </Text>
                    </View>

                    <View style={styles.accountCopy}>
                        <Text style={styles.accountTitle}>
                            Your space, your pace.
                        </Text>

                        <Text style={styles.accountDescription}>
                            Your classes, commitments, and planner
                            help you stay organized in one place.
                        </Text>
                    </View>
                </View>

                {/* SAVE BUTTON */}

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    activeOpacity={0.85}
                >
                    <Text style={styles.saveText}>
                        Save changes →
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onBack}
                >
                    <Text style={styles.cancelText}>
                        Cancel
                    </Text>
                </TouchableOpacity>

                <Text style={styles.footer}>
                    Made for students finding their flow.
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#F3F3EF",
    },
    scroll: {
        width: "100%",
        maxWidth: 430,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: 26,
        paddingTop: 30,
        paddingBottom: 45,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 32,
    },
    backButton: {
        paddingVertical: 8,
        paddingRight: 15,
    },
    backText: {
        color: colors.text.secondary,
        fontSize: 14,
        fontWeight: "600",
    },
    logo: {
        color: colors.brand.primary,
        fontSize: 27,
        fontWeight: "800",
        letterSpacing: -1.2,
    },
    eyebrow: {
        color: colors.brand.primary,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.3,
        marginBottom: 12,
    },
    heading: {
        color: colors.text.primary,
        fontSize: 31,
        fontWeight: "800",
        letterSpacing: -1,
        lineHeight: 37,
        marginBottom: 12,
    },
    subtitle: {
        color: colors.text.secondary,
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 26,
    },
    avatarSection: {
        alignItems: "center",
        backgroundColor: "#EAF5EE",
        borderRadius: 20,
        paddingVertical: 27,
        marginBottom: 29,
    },
    avatarCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: colors.brand.primary,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    avatarInitial: {
        color: "#FFFFFF",
        fontSize: 30,
        fontWeight: "800",
    },
    avatarName: {
        color: colors.text.primary,
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 5,
    },
    avatarSubtitle: {
        color: colors.text.secondary,
        fontSize: 12,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 13,
    },
    sectionTitle: {
        color: colors.text.primary,
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 13,
    },
    sectionCaption: {
        color: colors.text.muted,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1,
    },
    formCard: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 17,
        marginBottom: 29,
    },
    inputLabel: {
        color: colors.text.primary,
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 9,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
        borderRadius: 12,
        paddingHorizontal: 13,
        paddingVertical: 13,
        color: colors.text.primary,
        fontSize: 14,
        marginBottom: 19,
    },
    gradeSelector: {
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
        borderRadius: 12,
        paddingHorizontal: 13,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    gradeValue: {
        color: colors.text.primary,
        fontSize: 14,
    },
    dropdownArrow: {
        color: colors.text.secondary,
        fontSize: 19,
    },
    gradeMenu: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        marginTop: 8,
        overflow: "hidden",
    },
    gradeOption: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    gradeOptionSelected: {
        backgroundColor: colors.brand.light,
    },
    gradeOptionText: {
        color: colors.text.primary,
        fontSize: 13,
    },
    gradeOptionTextSelected: {
        color: colors.brand.dark,
        fontWeight: "800",
    },
    selectedCheck: {
        color: colors.brand.primary,
        fontWeight: "800",
    },
    accountCard: {
        backgroundColor: "#FFF4D9",
        borderRadius: 17,
        padding: 17,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 27,
    },
    accountIcon: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: "#F7E6A8",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
    },
    accountIconText: {
        color: "#A47C2C",
        fontSize: 23,
    },
    accountCopy: {
        flex: 1,
    },
    accountTitle: {
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: "800",
        marginBottom: 5,
    },
    accountDescription: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 18,
    },
    saveButton: {
        backgroundColor: colors.brand.primary,
        borderRadius: 15,
        minHeight: 55,
        alignItems: "center",
        justifyContent: "center",
    },
    saveText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
    },
    cancelButton: {
        alignItems: "center",
        paddingVertical: 18,
    },
    cancelText: {
        color: colors.text.secondary,
        fontSize: 13,
        fontWeight: "600",
    },
    footer: {
        color: colors.text.muted,
        fontSize: 11,
        textAlign: "center",
        marginTop: 15,
    },
});
