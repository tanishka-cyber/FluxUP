import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Pressable,
} from "react-native";

import { colors } from "../constants/colors";

type Props = {
    onBack: () => void;
    onContinue: () => void;
};

const sampleCoursework = [
    {
        subject: "Linear Algebra",
        title: "Problem Set 4",
        due: "Due Friday",
        color: colors.blocks.blue,
        type: "Assignment",
    },
    {
        subject: "AP Physics",
        title: "Forces and Motion Test",
        due: "Next Tuesday",
        color: colors.blocks.pink,
        type: "Test",
    },
    {
        subject: "AP Business",
        title: "Market Analysis",
        due: "Due next Wednesday",
        color: colors.blocks.yellow,
        type: "Assignment",
    },
];

export default function CourseworkFoundScreen({
    onBack,
    onContinue,
}: Props) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.logo}>FluxUP</Text>

                <Pressable onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </Pressable>

                <View style={styles.successIcon}>
                    <Text style={styles.successCheck}>✓</Text>
                </View>

                <Text style={styles.eyebrow}>COURSEWORK REVIEW</Text>
                <Text style={styles.title}>Your coursework is ready to review</Text>
                <Text style={styles.subtitle}>
                    Here is a preview of how assignments and tests will appear in FluxUP.
                </Text>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryNumber}>3</Text>
                        <Text style={styles.summaryLabel}>Assignments</Text>
                    </View>

                    <View style={styles.summaryDivider} />

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryNumber}>1</Text>
                        <Text style={styles.summaryLabel}>Test</Text>
                    </View>

                    <View style={styles.summaryDivider} />

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryNumber}>4</Text>
                        <Text style={styles.summaryLabel}>Items</Text>
                    </View>
                </View>

                <View style={styles.sectionHeading}>
                    <Text style={styles.sectionTitle}>Coursework preview</Text>
                    <Text style={styles.sectionCaption}>SAMPLE DATA</Text>
                </View>

                {sampleCoursework.map((item, index) => (
                    <View key={index} style={styles.courseworkCard}>
                        <View
                            style={[styles.colorBar, { backgroundColor: item.color }]}
                        />

                        <View style={styles.courseworkContent}>
                            <Text style={styles.subject}>{item.subject}</Text>
                            <Text style={styles.courseworkTitle}>{item.title}</Text>
                            <Text style={styles.due}>{item.due}</Text>
                        </View>

                        <View style={styles.typeTag}>
                            <Text style={styles.typeText}>{item.type}</Text>
                        </View>
                    </View>
                ))}

                <View style={styles.noteCard}>
                    <Text style={styles.noteTitle}>One important step before planning</Text>
                    <Text style={styles.noteDescription}>
                        Next, add your regular commitments and availability so FluxUP can
                        plan around your real life.
                    </Text>
                </View>

                <Pressable style={styles.primaryButton} onPress={onContinue}>
                    <Text style={styles.primaryButtonText}>Continue →</Text>
                </Pressable>

                <Text style={styles.footer}>
                    Preview only. Live coursework import is not connected yet.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 36,
        width: "100%",
        maxWidth: 560,
        alignSelf: "center",
    },
    logo: {
        fontSize: 29,
        fontWeight: "800",
        letterSpacing: -1.2,
        color: colors.brand.primary,
        textAlign: "center",
        marginBottom: 24,
    },
    backButton: {
        alignSelf: "flex-start",
        paddingVertical: 8,
        marginBottom: 20,
    },
    backText: {
        color: colors.text.secondary,
        fontSize: 14,
        fontWeight: "600",
    },
    successIcon: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: colors.brand.light,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },
    successCheck: {
        fontSize: 30,
        fontWeight: "800",
        color: colors.brand.primary,
    },
    eyebrow: {
        textAlign: "center",
        fontSize: 11,
        letterSpacing: 1.7,
        fontWeight: "800",
        color: colors.brand.primary,
        marginBottom: 10,
    },
    title: {
        color: colors.text.primary,
        fontSize: 29,
        lineHeight: 36,
        fontWeight: "800",
        letterSpacing: -0.8,
        textAlign: "center",
    },
    subtitle: {
        color: colors.text.secondary,
        fontSize: 14,
        lineHeight: 22,
        textAlign: "center",
        marginTop: 12,
        marginBottom: 24,
    },
    summaryCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingVertical: 18,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 28,
    },
    summaryItem: {
        alignItems: "center",
        flex: 1,
    },
    summaryNumber: {
        color: colors.brand.primary,
        fontSize: 25,
        fontWeight: "800",
    },
    summaryLabel: {
        color: colors.text.secondary,
        fontSize: 11,
        marginTop: 5,
    },
    summaryDivider: {
        width: 1,
        height: 36,
        backgroundColor: colors.border,
    },
    sectionHeading: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        color: colors.text.primary,
        fontSize: 17,
        fontWeight: "800",
    },
    sectionCaption: {
        color: colors.text.muted,
        fontSize: 9,
        fontWeight: "800",
        letterSpacing: 1,
    },
    courseworkCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
        marginBottom: 10,
        minHeight: 90,
    },
    colorBar: {
        width: 6,
        alignSelf: "stretch",
    },
    courseworkContent: {
        flex: 1,
        paddingHorizontal: 13,
        paddingVertical: 14,
    },
    subject: {
        color: colors.text.secondary,
        fontSize: 11,
        fontWeight: "600",
        marginBottom: 5,
    },
    courseworkTitle: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 5,
    },
    due: {
        color: colors.text.secondary,
        fontSize: 11,
    },
    typeTag: {
        backgroundColor: "#F0F4F1",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
        marginRight: 10,
    },
    typeText: {
        color: colors.text.secondary,
        fontSize: 9,
        fontWeight: "700",
    },
    noteCard: {
        backgroundColor: "#EDF7F0",
        padding: 16,
        borderRadius: 16,
        marginTop: 12,
        marginBottom: 20,
    },
    noteTitle: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 7,
    },
    noteDescription: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 19,
    },
    primaryButton: {
        backgroundColor: colors.brand.primary,
        borderRadius: 15,
        paddingVertical: 17,
        alignItems: "center",
        justifyContent: "center",
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
    },
    footer: {
        color: colors.text.muted,
        fontSize: 10,
        lineHeight: 16,
        textAlign: "center",
        marginTop: 16,
    },
});