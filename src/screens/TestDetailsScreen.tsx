
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { colors } from "../constants/colors";

type Props = {
    onBack: () => void;
    onAddStudyBlock?: () => void;
    testTitle?: string;
    className?: string;
    testDate?: string;
};

type TestInfo = {
    title: string;
    topics: string[];
    preparation: string[];
    note: string;
};

// Frontend-only sample test information.
// Each class has its own test content.
const sampleTests: Record<string, TestInfo> = {
    "AP Physics": {
        title: "Forces & Motion Test",
        topics: [
            "Newton's laws of motion",
            "Free-body diagrams",
            "Net force and acceleration",
            "Friction and inclined planes",
        ],
        preparation: [
            "Review class notes",
            "Complete practice problems",
            "Check incorrect answers",
            "Review formulas and units",
        ],
        note:
            "Focus on setting up force diagrams before calculating.",
    },

    "Linear Algebra": {
        title: "Linear Transformations Test",
        topics: [
            "Matrix operations",
            "Linear transformations",
            "Matrix multiplication",
            "Solving systems",
        ],
        preparation: [
            "Review Chapter 2",
            "Redo challenging examples",
            "Complete practice set",
            "Check calculations",
        ],
        note:
            "Practice explaining each transformation step.",
    },

    "AP Business": {
        title: "Marketing Strategies Test",
        topics: [
            "Target markets",
            "Market segmentation",
            "Competitive analysis",
            "Marketing mix",
        ],
        preparation: [
            "Review vocabulary",
            "Study class examples",
            "Practice case questions",
            "Summarize key concepts",
        ],
        note:
            "Connect each strategy to a real business example.",
    },

    English: {
        title: "Literary Analysis Test",
        topics: [
            "Theme and central idea",
            "Textual evidence",
            "Literary devices",
            "Author's purpose",
        ],
        preparation: [
            "Review reading notes",
            "Identify key passages",
            "Practice short responses",
            "Review feedback",
        ],
        note:
            "Use specific evidence when explaining your interpretation.",
    },

    "AP Cybersecurity": {
        title: "Network Security Test",
        topics: [
            "OSI and TCP/IP models",
            "Common protocols and ports",
            "Network threats",
            "Access controls",
        ],
        preparation: [
            "Review vocabulary",
            "Practice network scenarios",
            "Study protocols and ports",
            "Check missed questions",
        ],
        note:
            "Practice identifying which network layer a problem affects.",
    },
};

export default function TestDetailsScreen({
    onBack,
    onAddStudyBlock,
    testTitle,
    className = "AP Physics",
    testDate = "Fri, Nov 8",
}: Props) {
    const [checked, setChecked] =
        useState<string[]>([]);

    const [showTopics, setShowTopics] =
        useState(true);

    const info = sampleTests[className] ?? {
        title: "Upcoming Test",
        topics: [],
        preparation: [],
        note: "No study notes added yet.",
    };

    const done = info.preparation.filter(
        (step) => checked.includes(step)
    ).length;

    const progress = info.preparation.length
        ? done / info.preparation.length
        : 0;

    function toggle(step: string) {
        setChecked((current) =>
            current.includes(step)
                ? current.filter(
                    (value) => value !== step
                )
                : [...current, step]
        );
    }

    return (
        <View style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.page}
                showsVerticalScrollIndicator={false}
            >
                {/* Back navigation */}
                <TouchableOpacity
                    onPress={onBack}
                    style={styles.back}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                >
                    <Text style={styles.backText}>
                        ‹  Back to planner
                    </Text>
                </TouchableOpacity>

                {/* Test heading */}
                <Text style={styles.eyebrow}>
                    TEST DETAILS
                </Text>

                <Text style={styles.title}>
                    {testTitle || info.title}
                </Text>

                <Text style={styles.className}>
                    {className}
                </Text>

                {/* Test summary */}
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <Text style={styles.muted}>
                            Test date
                        </Text>

                        <Text style={styles.value}>
                            {testDate}
                        </Text>
                    </View>

                    <View style={styles.rule} />

                    <View style={styles.infoRow}>
                        <Text style={styles.muted}>
                            Priority
                        </Text>

                        <View style={styles.priority}>
                            <Text style={styles.priorityText}>
                                High
                            </Text>
                        </View>
                    </View>

                    <View style={styles.rule} />

                    <View style={styles.infoRow}>
                        <Text style={styles.muted}>
                            Study status
                        </Text>

                        <Text style={styles.value}>
                            {done} of {info.preparation.length} steps done
                        </Text>
                    </View>
                </View>

                {/* Topics to study */}
                <TouchableOpacity
                    style={styles.sectionRow}
                    onPress={() =>
                        setShowTopics(!showTopics)
                    }
                    activeOpacity={0.7}
                >
                    <Text style={styles.sectionTitle}>
                        Topics to study
                    </Text>

                    <Text style={styles.toggle}>
                        {showTopics ? "Hide −" : "Show +"}
                    </Text>
                </TouchableOpacity>

                {showTopics && (
                    <View style={styles.card}>
                        {info.topics.length > 0 ? (
                            info.topics.map((topic, index) => (
                                <View
                                    key={topic}
                                    style={[
                                        styles.topicRow,
                                        index > 0 &&
                                        styles.topicBorder,
                                    ]}
                                >
                                    <View style={styles.dot} />

                                    <Text style={styles.topicText}>
                                        {topic}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.muted}>
                                No topics added yet.
                            </Text>
                        )}
                    </View>
                )}

                {/* Study plan */}
                <View style={styles.sectionRow}>
                    <Text style={styles.sectionTitle}>
                        Study plan
                    </Text>

                    <Text style={styles.progressLabel}>
                        {done}/{info.preparation.length} done
                    </Text>
                </View>

                <View style={styles.track}>
                    <View
                        style={[
                            styles.fill,
                            {
                                width: `${progress * 100}%`,
                            },
                        ]}
                    />
                </View>

                {/* Interactive study checklist */}
                <View style={styles.card}>
                    {info.preparation.length > 0 ? (
                        info.preparation.map(
                            (step, index) => {
                                const isChecked =
                                    checked.includes(step);

                                return (
                                    <TouchableOpacity
                                        key={step}
                                        style={[
                                            styles.checkRow,
                                            index > 0 &&
                                            styles.topicBorder,
                                        ]}
                                        onPress={() =>
                                            toggle(step)
                                        }
                                        activeOpacity={0.7}
                                        accessibilityRole="checkbox"
                                        accessibilityState={{
                                            checked: isChecked,
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.checkbox,
                                                isChecked &&
                                                styles.checked,
                                            ]}
                                        >
                                            {isChecked && (
                                                <Text style={styles.tick}>
                                                    ✓
                                                </Text>
                                            )}
                                        </View>

                                        <Text
                                            style={[
                                                styles.topicText,
                                                isChecked &&
                                                styles.struck,
                                            ]}
                                        >
                                            {step}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }
                        )
                    ) : (
                        <Text style={styles.muted}>
                            No study steps added yet.
                        </Text>
                    )}
                </View>

                {/* Study tip */}
                <Text style={styles.sectionTitle}>
                    Study tip
                </Text>

                <View style={styles.tip}>
                    <Text style={styles.tipText}>
                        ✦  {info.note}
                    </Text>
                </View>

                {/* Future study scheduling */}
                {onAddStudyBlock ? (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onAddStudyBlock}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>
                            ＋  Add study block
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.disabledButton}>
                        <Text style={styles.disabledText}>
                            Add study block · Coming soon
                        </Text>
                    </View>
                )}

                <Text style={styles.footer}>
                    Sample test information. Your real
                    tests will appear when connected.
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },

    page: {
        width: "100%",
        maxWidth: 430,
        alignSelf: "center",
        paddingHorizontal: 24,
        paddingTop: 35,
        paddingBottom: 45,
    },

    back: {
        marginBottom: 28,
        paddingVertical: 4,
    },

    backText: {
        color: colors.brand.primary,
        fontSize: 15,
        fontWeight: "700",
    },

    eyebrow: {
        color: colors.text.secondary,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.4,
        marginBottom: 11,
    },

    title: {
        color: colors.text.primary,
        fontSize: 30,
        lineHeight: 37,
        fontWeight: "800",
        letterSpacing: -1,
    },

    className: {
        color: colors.brand.primary,
        fontSize: 14,
        fontWeight: "700",
        marginTop: 8,
        marginBottom: 25,
    },

    card: {
        backgroundColor: colors.surface,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 17,
        paddingVertical: 8,
        marginBottom: 24,
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 13,
        gap: 12,
    },

    muted: {
        color: colors.text.secondary,
        fontSize: 13,
    },

    value: {
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: "700",
        textAlign: "right",
    },

    rule: {
        height: 1,
        backgroundColor: colors.divider,
    },

    priority: {
        backgroundColor: "#FCE9E1",
        borderRadius: 9,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    priorityText: {
        color: "#C76A42",
        fontSize: 12,
        fontWeight: "800",
    },

    sectionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },

    sectionTitle: {
        color: colors.text.primary,
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 12,
    },

    toggle: {
        color: colors.brand.primary,
        fontSize: 12,
        fontWeight: "700",
    },

    topicRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
    },

    topicBorder: {
        borderTopWidth: 1,
        borderTopColor: colors.divider,
    },

    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: colors.brand.primary,
    },

    topicText: {
        flex: 1,
        color: colors.text.primary,
        fontSize: 13,
        lineHeight: 20,
    },

    progressLabel: {
        color: colors.brand.primary,
        fontSize: 12,
        fontWeight: "700",
    },

    track: {
        height: 7,
        backgroundColor: "#E6EDE8",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 15,
    },

    fill: {
        height: "100%",
        backgroundColor: colors.brand.primary,
        borderRadius: 10,
    },

    checkRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 15,
    },

    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: colors.brand.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    checked: {
        backgroundColor: colors.brand.primary,
    },

    tick: {
        color: "#FFFFFF",
        fontWeight: "800",
        fontSize: 12,
    },

    struck: {
        textDecorationLine: "line-through",
        color: colors.text.secondary,
    },

    tip: {
        backgroundColor: "#EAF5EC",
        borderRadius: 16,
        padding: 18,
        marginBottom: 25,
    },

    tipText: {
        color: colors.text.primary,
        fontSize: 13,
        lineHeight: 21,
    },

    button: {
        backgroundColor: colors.brand.primary,
        minHeight: 54,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
    },

    disabledButton: {
        backgroundColor: "#E9EFEB",
        minHeight: 54,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },

    disabledText: {
        color: colors.text.secondary,
        fontSize: 14,
        fontWeight: "700",
    },

    footer: {
        color: colors.text.muted,
        fontSize: 11,
        textAlign: "center",
        marginTop: 18,
        lineHeight: 17,
    },
});
