
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { colors } from "../constants/colors";

// ==========================================
// SCREEN 22: UPDATE SCHEDULE MENU
// ==========================================

type Props = {
    classCount: number;
    commitmentCount: number;
    onBack: () => void;
    onEditClasses: () => void;
    onEditCommitments: () => void;
    onOpenPlanner: () => void;
};

export default function UpdateScheduleMenuScreen({
    classCount,
    commitmentCount,
    onBack,
    onEditClasses,
    onEditCommitments,
    onOpenPlanner,
}: Props) {
    return (
        <View style={styles.page}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}

                <View style={styles.topRow}>
                    <TouchableOpacity
                        onPress={onBack}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backText}>
                            ← Back
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.logo}>Flux</Text>
                </View>

                {/* INTRODUCTION */}

                <Text style={styles.eyebrow}>
                    YOUR SCHEDULE
                </Text>

                <Text style={styles.heading}>
                    Make room for change.
                </Text>

                <Text style={styles.subtitle}>
                    Classes change. Activities shift. Keep your
                    schedule up to date so Flux can help you
                    stay organized.
                </Text>

                {/* SCHEDULE SUMMARY */}

                <View style={styles.summaryCard}>
                    <View style={styles.summaryIcon}>
                        <Text style={styles.summaryIconText}>
                            ▦
                        </Text>
                    </View>

                    <View style={styles.summaryCopy}>
                        <Text style={styles.summaryTitle}>
                            Your current schedule
                        </Text>

                        <Text style={styles.summaryDescription}>
                            {classCount}{" "}
                            {classCount === 1
                                ? "class"
                                : "classes"}
                            {" · "}
                            {commitmentCount}{" "}
                            {commitmentCount === 1
                                ? "commitment"
                                : "commitments"}
                        </Text>
                    </View>
                </View>

                {/* OPTIONS */}

                <Text style={styles.sectionTitle}>
                    What would you like to update?
                </Text>

                <Text style={styles.sectionSubtitle}>
                    Choose a section to make changes.
                </Text>

                {/* EDIT CLASSES */}

                <TouchableOpacity
                    style={styles.menuCard}
                    onPress={onEditClasses}
                    activeOpacity={0.75}
                >
                    <View
                        style={[
                            styles.menuIcon,
                            styles.classesIcon,
                        ]}
                    >
                        <Text style={styles.menuIconText}>
                            ▤
                        </Text>
                    </View>

                    <View style={styles.menuCopy}>
                        <Text style={styles.menuTitle}>
                            My classes
                        </Text>

                        <Text style={styles.menuDescription}>
                            Rename, add, or remove classes and
                            update school details.
                        </Text>

                        <Text style={styles.menuCount}>
                            {classCount}{" "}
                            {classCount === 1
                                ? "class"
                                : "classes"}
                        </Text>
                    </View>

                    <Text style={styles.chevron}>
                        ›
                    </Text>
                </TouchableOpacity>

                {/* EDIT COMMITMENTS */}

                <TouchableOpacity
                    style={styles.menuCard}
                    onPress={onEditCommitments}
                    activeOpacity={0.75}
                >
                    <View
                        style={[
                            styles.menuIcon,
                            styles.commitmentsIcon,
                        ]}
                    >
                        <Text style={styles.menuIconText}>
                            ✦
                        </Text>
                    </View>

                    <View style={styles.menuCopy}>
                        <Text style={styles.menuTitle}>
                            Extracurricular commitments
                        </Text>

                        <Text style={styles.menuDescription}>
                            Update clubs, volunteering,
                            activities, days, and times.
                        </Text>

                        <Text style={styles.menuCount}>
                            {commitmentCount}{" "}
                            {commitmentCount === 1
                                ? "commitment"
                                : "commitments"}
                        </Text>
                    </View>

                    <Text style={styles.chevron}>
                        ›
                    </Text>
                </TouchableOpacity>

                {/* OPEN PLANNER */}

                <TouchableOpacity
                    style={styles.menuCard}
                    onPress={onOpenPlanner}
                    activeOpacity={0.75}
                >
                    <View
                        style={[
                            styles.menuIcon,
                            styles.plannerIcon,
                        ]}
                    >
                        <Text style={styles.menuIconText}>
                            ▦
                        </Text>
                    </View>

                    <View style={styles.menuCopy}>
                        <Text style={styles.menuTitle}>
                            View my planner
                        </Text>

                        <Text style={styles.menuDescription}>
                            Return to your daily schedule,
                            assignments, and activities.
                        </Text>
                    </View>

                    <Text style={styles.chevron}>
                        ›
                    </Text>
                </TouchableOpacity>

                {/* INFORMATION CARD */}

                <View style={styles.tipCard}>
                    <Text style={styles.tipSymbol}>
                        ✦
                    </Text>

                    <View style={styles.tipCopy}>
                        <Text style={styles.tipTitle}>
                            Your schedule can change.
                        </Text>

                        <Text style={styles.tipDescription}>
                            You can update classes and
                            commitments whenever your
                            school routine changes.
                        </Text>
                    </View>
                </View>

                {/* DONE */}

                <TouchableOpacity
                    style={styles.doneButton}
                    onPress={onBack}
                    activeOpacity={0.85}
                >
                    <Text style={styles.doneText}>
                        Done →
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
    page: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        backgroundColor: "#F3F3EF",
    },

    scroll: {
        width: "100%",
        maxWidth: 430,
        backgroundColor: colors.background,
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 26,
        paddingTop: 30,
        paddingBottom: 40,
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 34,
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
        fontSize: 30,
        fontWeight: "800",
        letterSpacing: -1,
        lineHeight: 37,
        marginBottom: 12,
    },

    subtitle: {
        color: colors.text.secondary,
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 25,
    },

    summaryCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EAF5EE",
        borderRadius: 17,
        padding: 17,
        marginBottom: 32,
    },

    summaryIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "#D1EBD8",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
    },

    summaryIconText: {
        color: colors.brand.dark,
        fontSize: 23,
    },

    summaryCopy: {
        flex: 1,
    },

    summaryTitle: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 5,
    },

    summaryDescription: {
        color: colors.text.secondary,
        fontSize: 12,
    },

    sectionTitle: {
        color: colors.text.primary,
        fontSize: 19,
        fontWeight: "800",
        marginBottom: 7,
    },

    sectionSubtitle: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 19,
        marginBottom: 19,
    },

    menuCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 17,
        padding: 15,
        marginBottom: 12,
    },

    menuIcon: {
        width: 45,
        height: 45,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
    },

    classesIcon: {
        backgroundColor: colors.blocks.blue,
    },

    commitmentsIcon: {
        backgroundColor: colors.blocks.purple,
    },

    plannerIcon: {
        backgroundColor: colors.blocks.green,
    },

    menuIconText: {
        color: colors.text.primary,
        fontSize: 22,
        fontWeight: "700",
    },

    menuCopy: {
        flex: 1,
    },

    menuTitle: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 6,
    },

    menuDescription: {
        color: colors.text.secondary,
        fontSize: 11,
        lineHeight: 18,
    },

    menuCount: {
        color: colors.brand.primary,
        fontSize: 11,
        fontWeight: "700",
        marginTop: 8,
    },

    chevron: {
        color: colors.text.muted,
        fontSize: 26,
        marginLeft: 8,
    },

    tipCard: {
        flexDirection: "row",
        backgroundColor: "#FFF4D9",
        borderRadius: 15,
        padding: 16,
        marginTop: 13,
        marginBottom: 27,
    },

    tipSymbol: {
        color: "#A47C2C",
        fontSize: 21,
        marginRight: 12,
    },

    tipCopy: {
        flex: 1,
    },

    tipTitle: {
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: "800",
        marginBottom: 5,
    },

    tipDescription: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 19,
    },

    doneButton: {
        minHeight: 55,
        borderRadius: 15,
        backgroundColor: colors.brand.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    doneText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
    },
});
