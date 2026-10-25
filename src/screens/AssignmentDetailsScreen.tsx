
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import { colors } from "../constants/colors";

type Props = {
    onBack: () => void;
    assignmentTitle?: string;
    className?: string;
    dueDate?: string;
};

type Priority = "High" | "Medium" | "Low";

type AssignmentInfo = {
    title: string;
    className: string;
    dueDate: string;
    priority: Priority;
    estimatedTime: string;
    description: string;
    checklist: string[];
    notes: string;
};

const assignmentInformation: Record<string, AssignmentInfo> = {
    "Linear Algebra": {
        title: "Problem Set 4",
        className: "Linear Algebra",
        dueDate: "Tomorrow",
        priority: "High",
        estimatedTime: "60 minutes",
        description:
            "Complete the assigned linear algebra problem set, focusing on matrix operations and linear transformations.",
        checklist: [
            "Review Chapter 2 concepts",
            "Complete matrix operation problems",
            "Solve linear transformation questions",
            "Check answers and show work",
            "Submit the problem set",
        ],
        notes:
            "Review worked examples before starting the more difficult problems.",
    },

    "AP Physics": {
        title: "Forces & Motion Review",
        className: "AP Physics 1",
        dueDate: "Not specified",
        priority: "High",
        estimatedTime: "45 minutes",
        description:
            "Review Newton's laws of motion and practice solving force and acceleration problems.",
        checklist: [
            "Review Newton's three laws",
            "Practice free-body diagrams",
            "Solve net force problems",
            "Review friction and acceleration",
            "Complete the practice worksheet",
        ],
        notes:
            "Focus on drawing accurate force diagrams before solving equations.",
    },

    "AP Business": {
        title: "Market Analysis",
        className: "AP Business",
        dueDate: "Friday",
        priority: "Medium",
        estimatedTime: "50 minutes",
        description:
            "Analyze a business market, identify its target customers, and evaluate competitors.",
        checklist: [
            "Choose a company or product",
            "Identify the target market",
            "Research competing businesses",
            "Evaluate marketing strategies",
            "Write and review the analysis",
        ],
        notes:
            "Support conclusions with examples and evidence from market research.",
    },

    English: {
        title: "Narrative Draft",
        className: "English",
        dueDate: "Not specified",
        priority: "Medium",
        estimatedTime: "40 minutes",
        description:
            "Revise the narrative draft to improve the introduction, organization, and clarity.",
        checklist: [
            "Read through the current draft",
            "Rewrite the introduction",
            "Improve paragraph transitions",
            "Check grammar and punctuation",
            "Proofread the final draft",
        ],
        notes:
            "Make sure the opening establishes the setting and engages the reader.",
    },

    "AP Cybersecurity": {
        title: "CyberPatriots Practice",
        className: "AP Cybersecurity",
        dueDate: "Not specified",
        priority: "Medium",
        estimatedTime: "60 minutes",
        description:
            "Practice cybersecurity concepts and system-hardening skills for CyberPatriot.",
        checklist: [
            "Review network security concepts",
            "Practice identifying vulnerabilities",
            "Review user accounts and permissions",
            "Practice system security checks",
            "Document findings and solutions",
        ],
        notes:
            "Keep track of problems encountered and how they were resolved.",
    },
};

const defaultAssignment: AssignmentInfo = {
    title: "Assignment Details",
    className: "Class",
    dueDate: "Not specified",
    priority: "Medium",
    estimatedTime: "Not estimated",
    description:
        "No description has been added for this assignment yet.",
    checklist: [],
    notes: "No additional notes yet.",
};

export default function AssignmentDetailsScreen({
    onBack,
    assignmentTitle,
    className = "AP Physics",
    dueDate,
}: Props) {
    const [completedSteps, setCompletedSteps] =
        useState<string[]>([]);

    const [showMore, setShowMore] =
        useState(false);

    const [assignmentCompleted, setAssignmentCompleted] =
        useState(false);

    const classDetails =
        assignmentInformation[className] ??
        defaultAssignment;

    // The title passed from the planner is preserved.
    const displayTitle =
        assignmentTitle || classDetails.title;

    // Use a provided due date only when it is meaningful.
    const displayDueDate =
        dueDate && dueDate !== "Not specified"
            ? dueDate
            : classDetails.dueDate;

    useEffect(() => {
        setCompletedSteps([]);
        setShowMore(false);
        setAssignmentCompleted(false);
    }, [className, assignmentTitle]);

    function toggleStep(step: string) {
        setCompletedSteps((current) =>
            current.includes(step)
                ? current.filter((item) => item !== step)
                : [...current, step]
        );
    }

    const completedCount =
        classDetails.checklist.filter((step) =>
            completedSteps.includes(step)
        ).length;

    const totalCount = classDetails.checklist.length;

    const progress =
        totalCount > 0
            ? completedCount / totalCount
            : 0;

    const priorityColor =
        classDetails.priority === "High"
            ? "#C76A42"
            : classDetails.priority === "Medium"
                ? "#9B782A"
                : colors.brand.primary;

    const priorityBackground =
        classDetails.priority === "High"
            ? "#FCE9E1"
            : classDetails.priority === "Medium"
                ? "#FFF2D8"
                : "#E5F4EA";

    return (
        <View style={styles.screen}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.page}
            >
                {/* Header */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBack}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backArrow}>‹</Text>
                    <Text style={styles.backText}>
                        Back to planner
                    </Text>
                </TouchableOpacity>

                <Text style={styles.stepLabel}>
                    ASSIGNMENT DETAILS
                </Text>

                <Text style={styles.title}>
                    {displayTitle}
                </Text>

                <Text style={styles.classLabel}>
                    {classDetails === defaultAssignment
                        ? className
                        : classDetails.className}
                </Text>

                {/* Assignment summary */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>
                            Due date
                        </Text>
                        <Text style={styles.summaryValue}>
                            {displayDueDate}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>
                            Estimated time
                        </Text>
                        <Text style={styles.summaryValue}>
                            {classDetails.estimatedTime}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>
                            Priority
                        </Text>

                        <View
                            style={[
                                styles.priorityBadge,
                                {
                                    backgroundColor:
                                        priorityBackground,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.priorityText,
                                    { color: priorityColor },
                                ]}
                            >
                                {classDetails.priority}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <Text style={styles.sectionTitle}>
                    About this assignment
                </Text>

                <View style={styles.contentCard}>
                    <Text style={styles.description}>
                        {classDetails.description}
                    </Text>
                </View>

                {/* Checklist */}
                <View style={styles.sectionHeadingRow}>
                    <Text style={styles.sectionTitle}>
                        Your checklist
                    </Text>

                    <Text style={styles.progressCount}>
                        {completedCount}/{totalCount} done
                    </Text>
                </View>

                <View style={styles.progressTrack}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${progress * 100}%`,
                            },
                        ]}
                    />
                </View>

                <View style={styles.checklistCard}>
                    {totalCount === 0 ? (
                        <Text style={styles.emptyText}>
                            No checklist steps added yet.
                        </Text>
                    ) : (
                        classDetails.checklist.map(
                            (step, index) => {
                                const completed =
                                    completedSteps.includes(step);

                                return (
                                    <TouchableOpacity
                                        key={`${index}-${step}`}
                                        style={[
                                            styles.checklistRow,
                                            index !== totalCount - 1 &&
                                            styles.checklistDivider,
                                        ]}
                                        onPress={() =>
                                            toggleStep(step)
                                        }
                                        activeOpacity={0.7}
                                        accessibilityRole="checkbox"
                                        accessibilityState={{
                                            checked: completed,
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.checkbox,
                                                completed &&
                                                styles.checkboxCompleted,
                                            ]}
                                        >
                                            {completed && (
                                                <Text
                                                    style={styles.checkmark}
                                                >
                                                    ✓
                                                </Text>
                                            )}
                                        </View>

                                        <Text
                                            style={[
                                                styles.checklistText,
                                                completed &&
                                                styles.completedText,
                                            ]}
                                        >
                                            {step}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }
                        )
                    )}
                </View>

                {/* Notes */}
                <Text style={styles.sectionTitle}>
                    Helpful notes
                </Text>

                <View style={styles.notesCard}>
                    <Text style={styles.notesText}>
                        {classDetails.notes}
                    </Text>

                    {showMore && (
                        <Text style={styles.extraNote}>
                            These are demonstration details.
                            Your actual assignment instructions
                            will appear here when coursework
                            data is connected.
                        </Text>
                    )}

                    <TouchableOpacity
                        onPress={() =>
                            setShowMore((current) => !current)
                        }
                        style={styles.viewMoreButton}
                    >
                        <Text style={styles.viewMoreText}>
                            {showMore
                                ? "View less"
                                : "View more"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Complete assignment */}
                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        assignmentCompleted &&
                        styles.completedButton,
                    ]}
                    onPress={() =>
                        setAssignmentCompleted(
                            (current) => !current
                        )
                    }
                    activeOpacity={0.8}
                >
                    <Text style={styles.completeButtonText}>
                        {assignmentCompleted
                            ? "✓ Assignment completed"
                            : "Mark assignment complete"}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.footerNote}>
                    Small steps make big progress.
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

    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 28,
    },

    backArrow: {
        color: colors.brand.primary,
        fontSize: 31,
        marginRight: 10,
    },

    backText: {
        color: colors.brand.primary,
        fontSize: 14,
        fontWeight: "700",
    },

    stepLabel: {
        color: colors.text.secondary,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.4,
        marginBottom: 11,
    },

    title: {
        color: colors.text.primary,
        fontSize: 30,
        fontWeight: "800",
        letterSpacing: -1,
        lineHeight: 37,
        marginBottom: 9,
    },

    classLabel: {
        color: colors.brand.primary,
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 25,
    },

    summaryCard: {
        backgroundColor: colors.surface,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 17,
        paddingVertical: 5,
        marginBottom: 28,
    },

    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        gap: 12,
    },

    summaryLabel: {
        color: colors.text.secondary,
        fontSize: 13,
    },

    summaryValue: {
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: "700",
        flexShrink: 1,
        textAlign: "right",
    },

    divider: {
        height: 1,
        backgroundColor: colors.divider,
    },

    priorityBadge: {
        borderRadius: 9,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    priorityText: {
        fontSize: 12,
        fontWeight: "800",
    },

    sectionTitle: {
        color: colors.text.primary,
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 13,
    },

    contentCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 17,
        marginBottom: 27,
    },

    description: {
        color: colors.text.secondary,
        fontSize: 14,
        lineHeight: 22,
    },

    sectionHeadingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    progressCount: {
        color: colors.brand.primary,
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 13,
    },

    progressTrack: {
        height: 7,
        backgroundColor: "#E6EDE8",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 15,
    },

    progressFill: {
        height: "100%",
        backgroundColor: colors.brand.primary,
        borderRadius: 10,
    },

    checklistCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 16,
        marginBottom: 28,
    },

    checklistRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        gap: 12,
    },

    checklistDivider: {
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
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

    checkboxCompleted: {
        backgroundColor: colors.brand.primary,
    },

    checkmark: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "800",
    },

    checklistText: {
        flex: 1,
        color: colors.text.primary,
        fontSize: 13,
        lineHeight: 19,
    },

    completedText: {
        color: colors.text.secondary,
        textDecorationLine: "line-through",
    },

    emptyText: {
        color: colors.text.muted,
        fontSize: 13,
        paddingVertical: 20,
    },

    notesCard: {
        backgroundColor: "#EAF5EC",
        borderRadius: 16,
        padding: 18,
        marginBottom: 27,
    },

    notesText: {
        color: colors.text.primary,
        fontSize: 13,
        lineHeight: 21,
    },

    extraNote: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 19,
        marginTop: 12,
    },

    viewMoreButton: {
        alignSelf: "flex-start",
        marginTop: 14,
    },

    viewMoreText: {
        color: colors.brand.primary,
        fontSize: 13,
        fontWeight: "800",
    },

    completeButton: {
        backgroundColor: colors.brand.primary,
        borderRadius: 15,
        minHeight: 54,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
    },

    completedButton: {
        backgroundColor: colors.brand.dark,
    },

    completeButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
    },

    footerNote: {
        color: colors.text.muted,
        fontSize: 12,
        textAlign: "center",
        marginTop: 19,
    },
});
