
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { colors } from "../constants/colors";
import type { TaskItem } from "./TasksScreen";

type Props = {
    task: TaskItem;
    onBack: () => void;
    onStatusChange?: (
        taskId: string,
        completed: boolean
    ) => void;
};

const CLASS_COLORS: Record<string, string> = {
    "AP Physics": colors.blocks.purple,
    "Linear Algebra": colors.blocks.blue,
    "AP Business": colors.blocks.yellow,
    English: colors.blocks.pink,
    "AP Cybersecurity": colors.blocks.green,
};

export default function TaskDetailsScreen({
    task,
    onBack,
    onStatusChange,
}: Props) {
    const [completed, setCompleted] = useState(
        task.status === "completed"
    );

    const classColor =
        CLASS_COLORS[task.className] ??
        colors.blocks.green;

    function toggleCompleted() {
        const nextValue = !completed;
        setCompleted(nextValue);
        onStatusChange?.(task.id, nextValue);
    }

    const priorityColor =
        task.priority === "High"
            ? "#E87575"
            : task.priority === "Medium"
                ? "#E9A23B"
                : "#3FA77B";

    return (
        <View style={styles.screen}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.backButton}
                        accessibilityRole="button"
                    >
                        <Text style={styles.backArrow}>‹</Text>
                        <Text style={styles.backText}>
                            Tasks
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.logo}>FluxUP</Text>
                </View>

                <Text style={styles.eyebrow}>
                    TASK DETAILS
                </Text>

                <Text style={styles.heading}>
                    One task at a time.
                </Text>

                <Text style={styles.subtitle}>
                    Everything you need to know about
                    this task, all in one place.
                </Text>

                {/* Main task card */}
                <View style={styles.mainCard}>
                    <View
                        style={[
                            styles.colorAccent,
                            { backgroundColor: classColor },
                        ]}
                    />

                    <View style={styles.mainCardContent}>
                        <View style={styles.badgeRow}>
                            <View style={styles.typeBadge}>
                                <Text style={styles.typeBadgeText}>
                                    {task.type === "test"
                                        ? "Test"
                                        : "Assignment"}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.statusBadge,
                                    completed &&
                                    styles.statusBadgeCompleted,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.statusText,
                                        completed &&
                                        styles.statusTextCompleted,
                                    ]}
                                >
                                    {completed
                                        ? "Completed"
                                        : "To do"}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.taskTitle}>
                            {task.title}
                        </Text>

                        <Text style={styles.className}>
                            {task.className}
                        </Text>
                    </View>
                </View>

                {/* Details section */}
                <Text style={styles.sectionTitle}>
                    Task information
                </Text>

                <View style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Text style={styles.detailIconText}>
                                ▦
                            </Text>
                        </View>

                        <View style={styles.detailCopy}>
                            <Text style={styles.detailLabel}>
                                Due date
                            </Text>
                            <Text style={styles.detailValue}>
                                {task.dueLabel}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Text style={styles.detailIconText}>
                                ◈
                            </Text>
                        </View>

                        <View style={styles.detailCopy}>
                            <Text style={styles.detailLabel}>
                                Priority
                            </Text>

                            <View style={styles.priorityRow}>
                                <View
                                    style={[
                                        styles.priorityDot,
                                        {
                                            backgroundColor:
                                                priorityColor,
                                        },
                                    ]}
                                />

                                <Text style={styles.detailValue}>
                                    {task.priority} priority
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Text style={styles.detailIconText}>
                                ◇
                            </Text>
                        </View>

                        <View style={styles.detailCopy}>
                            <Text style={styles.detailLabel}>
                                Class
                            </Text>

                            <Text style={styles.detailValue}>
                                {task.className}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Text style={styles.detailIconText}>
                                ✓
                            </Text>
                        </View>

                        <View style={styles.detailCopy}>
                            <Text style={styles.detailLabel}>
                                Status
                            </Text>

                            <Text style={styles.detailValue}>
                                {completed
                                    ? "Completed"
                                    : "Not completed"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Notes section */}
                <Text style={styles.sectionTitle}>
                    Notes & description
                </Text>

                <View style={styles.notesCard}>
                    <Text style={styles.notesTitle}>
                        No notes added yet
                    </Text>

                    <Text style={styles.notesDescription}>
                        Task descriptions and additional
                        instructions will appear here
                        when available.
                    </Text>
                </View>

                {/* Completion card */}
                <View style={styles.completionCard}>
                    <View style={styles.completionCopy}>
                        <Text style={styles.completionTitle}>
                            {completed
                                ? "Task completed!"
                                : "Ready to check this off?"}
                        </Text>

                        <Text
                            style={styles.completionDescription}
                        >
                            {completed
                                ? "You can mark it incomplete if you need to revisit it."
                                : "Mark this task complete when you're finished."}
                        </Text>
                    </View>

                    <View style={styles.completionIcon}>
                        <Text
                            style={styles.completionIconText}
                        >
                            {completed ? "✓" : "○"}
                        </Text>
                    </View>
                </View>

                {/* Main action */}
                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        completed &&
                        styles.incompleteButton,
                    ]}
                    onPress={toggleCompleted}
                    activeOpacity={0.8}
                >
                    <Text
                        style={[
                            styles.completeButtonText,
                            completed &&
                            styles.incompleteButtonText,
                        ]}
                    >
                        {completed
                            ? "Mark as incomplete"
                            : "✓ Mark as completed"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.returnButton}
                    onPress={onBack}
                >
                    <Text style={styles.returnText}>
                        Back to tasks
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        width: "100%",
        maxWidth: 760,
        alignSelf: "center",
        paddingHorizontal: 24,
        paddingTop: 27,
        paddingBottom: 45,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 32,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    backArrow: {
        color: colors.brand.primary,
        fontSize: 29,
    },
    backText: {
        color: colors.brand.primary,
        fontSize: 14,
        fontWeight: "700",
    },
    logo: {
        color: colors.brand.primary,
        fontSize: 25,
        fontWeight: "800",
        letterSpacing: -1,
    },
    eyebrow: {
        color: colors.text.secondary,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.3,
        marginBottom: 11,
    },
    heading: {
        color: colors.text.primary,
        fontSize: 29,
        fontWeight: "800",
        letterSpacing: -1,
    },
    subtitle: {
        color: colors.text.secondary,
        fontSize: 14,
        lineHeight: 22,
        marginTop: 9,
        marginBottom: 27,
    },
    mainCard: {
        backgroundColor: colors.surface,
        borderRadius: 19,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
        marginBottom: 30,
    },
    colorAccent: {
        height: 9,
    },
    mainCardContent: {
        padding: 21,
    },
    badgeRow: {
        flexDirection: "row",
        gap: 9,
        marginBottom: 19,
    },
    typeBadge: {
        backgroundColor: "#E6F3ED",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 9,
    },
    typeBadgeText: {
        color: colors.brand.dark,
        fontSize: 11,
        fontWeight: "800",
    },
    statusBadge: {
        backgroundColor: "#FFF1D9",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 9,
    },
    statusBadgeCompleted: {
        backgroundColor: "#DDF4E6",
    },
    statusText: {
        color: "#9A742D",
        fontSize: 11,
        fontWeight: "800",
    },
    statusTextCompleted: {
        color: "#367A55",
    },
    taskTitle: {
        color: colors.text.primary,
        fontSize: 24,
        fontWeight: "800",
        lineHeight: 32,
        letterSpacing: -0.6,
    },
    className: {
        color: colors.text.secondary,
        fontSize: 13,
        marginTop: 9,
    },
    sectionTitle: {
        color: colors.text.primary,
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 13,
    },
    detailsCard: {
        backgroundColor: colors.surface,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 17,
        marginBottom: 29,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        gap: 13,
    },
    detailIcon: {
        width: 39,
        height: 39,
        borderRadius: 12,
        backgroundColor: "#EDF5F0",
        alignItems: "center",
        justifyContent: "center",
    },
    detailIconText: {
        color: colors.brand.primary,
        fontSize: 19,
        fontWeight: "700",
    },
    detailCopy: {
        flex: 1,
    },
    detailLabel: {
        color: colors.text.secondary,
        fontSize: 11,
        marginBottom: 5,
    },
    detailValue: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "700",
    },
    divider: {
        height: 1,
        backgroundColor: colors.divider,
        marginVertical: 4,
    },
    priorityRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    notesCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 19,
        marginBottom: 24,
    },
    notesTitle: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 7,
    },
    notesDescription: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 20,
    },
    completionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EAF5ED",
        borderRadius: 16,
        padding: 18,
        marginBottom: 24,
    },
    completionCopy: {
        flex: 1,
    },
    completionTitle: {
        color: colors.text.primary,
        fontSize: 15,
        fontWeight: "800",
    },
    completionDescription: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 19,
        marginTop: 5,
    },
    completionIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#CDE8D7",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 12,
    },
    completionIconText: {
        color: colors.brand.dark,
        fontSize: 23,
        fontWeight: "800",
    },
    completeButton: {
        backgroundColor: colors.brand.primary,
        minHeight: 55,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    completeButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
    },
    incompleteButton: {
        backgroundColor: "#E7F0EB",
    },
    incompleteButtonText: {
        color: colors.brand.dark,
    },
    returnButton: {
        alignItems: "center",
        paddingVertical: 19,
    },
    returnText: {
        color: colors.text.secondary,
        fontSize: 13,
        fontWeight: "700",
    },
});
