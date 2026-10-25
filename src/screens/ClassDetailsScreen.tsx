
import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import { colors } from "../constants/colors";

type Props = {
    className?: string;
    onBack: () => void;
    onOpenAssignment?: (
        title: string,
        className: string
    ) => void;
};

type Tab = "Overview" | "Tasks";

type ClassInfo = {
    name: string;
    period: string;
    lesson: string;
    reading: string;
    notes: string;
    tasks: string[];
};

// Frontend-only demonstration information.
const classInformation: Record<string, ClassInfo> = {
    "AP Physics": {
        name: "AP Physics 1",
        period: "Period 2 · Room 108",
        lesson: "Chapter 4: Forces and Motion",
        reading: "Read pages 112 – 118",
        notes: "Review practice problems",
        tasks: [
            "Read pages 112–118",
            "Review practice problems",
            "Complete Forces & Motion worksheet",
        ],
    },

    "Linear Algebra": {
        name: "Linear Algebra",
        period: "Period 1 · Room 214",
        lesson: "Linear transformations",
        reading: "Review Chapter 2",
        notes: "Practice matrix operations",
        tasks: [
            "Problem Set 4",
            "Review linear transformations",
        ],
    },

    "AP Business": {
        name: "AP Business",
        period: "Period 3 · Room 302",
        lesson: "Marketing strategies",
        reading: "Review marketing notes",
        notes: "Prepare market analysis",
        tasks: [
            "Complete market analysis",
            "Review marketing concepts",
        ],
    },

    English: {
        name: "English",
        period: "Period 4 · Room 116",
        lesson: "Narrative writing",
        reading: "Review assigned reading",
        notes: "Revise introduction",
        tasks: [
            "Revise narrative draft",
            "Complete reading assignment",
        ],
    },

    "AP Cybersecurity": {
        name: "AP Cybersecurity",
        period: "Period 5 · Computer Lab",
        lesson: "Network security",
        reading: "Review unit notes",
        notes: "Practice network concepts",
        tasks: [
            "CyberPatriots practice",
            "Review security concepts",
        ],
    },
};

export default function ClassDetailsScreen({
    className = "AP Physics",
    onBack,
    onOpenAssignment,
}: Props) {
    const [activeTab, setActiveTab] =
        useState<Tab>("Overview");

    const [showMore, setShowMore] =
        useState(false);

    const [completedTasks, setCompletedTasks] =
        useState<string[]>([]);

    const selectedClass =
        classInformation[className] ?? {
            name: className,
            period: "Class details",
            lesson: "No lesson added yet",
            reading: "No reading added yet",
            notes: "No notes added yet",
            tasks: [],
        };

    function toggleTask(task: string) {
        const taskKey = `${className}-${task}`;

        setCompletedTasks((current) =>
            current.includes(taskKey)
                ? current.filter(
                    (item) => item !== taskKey
                )
                : [...current, taskKey]
        );
    }

    return (
        <View style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.page}
                showsVerticalScrollIndicator={false}
            >
                {/* Back arrow and page title */}
                <TouchableOpacity
                    style={styles.header}
                    onPress={onBack}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backArrow}>
                        ‹
                    </Text>

                    <Text style={styles.headerTitle}>
                        {selectedClass.name}
                    </Text>
                </TouchableOpacity>

                {/* Class information card */}
                <View style={styles.classCard}>
                    <View style={styles.classIcon}>
                        <Text style={styles.classIconText}>
                            ▣
                        </Text>
                    </View>

                    <View style={styles.classInfo}>
                        <Text style={styles.className}>
                            {selectedClass.name}
                        </Text>

                        <Text style={styles.classPeriod}>
                            {selectedClass.period}
                        </Text>
                    </View>
                </View>

                {/* Overview and Tasks tabs */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === "Overview" &&
                            styles.activeTab,
                        ]}
                        onPress={() =>
                            setActiveTab("Overview")
                        }
                        activeOpacity={0.7}
                    >
                        <Text style={styles.tabText}>
                            Overview
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === "Tasks" &&
                            styles.activeTab,
                        ]}
                        onPress={() =>
                            setActiveTab("Tasks")
                        }
                        activeOpacity={0.7}
                    >
                        <Text style={styles.tabText}>
                            Tasks
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Overview content */}
                {activeTab === "Overview" ? (
                    <View style={styles.notesContainer}>
                        <View style={styles.noteCard}>
                            <Text style={styles.noteTitle}>
                                Today's Notes
                            </Text>

                            <Text style={styles.noteDescription}>
                                {selectedClass.lesson}
                            </Text>
                        </View>

                        <View style={styles.noteCard}>
                            <Text style={styles.noteTitle}>
                                Text
                            </Text>

                            <Text style={styles.noteDescription}>
                                {selectedClass.reading}
                            </Text>
                        </View>

                        <View style={styles.noteCard}>
                            <Text style={styles.noteTitle}>
                                Class notes
                            </Text>

                            <Text style={styles.noteDescription}>
                                {selectedClass.notes}
                            </Text>
                        </View>

                        {showMore && (
                            <View style={styles.noteCard}>
                                <Text style={styles.noteTitle}>
                                    Additional notes
                                </Text>

                                <Text style={styles.noteDescription}>
                                    No additional notes added yet.
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.viewMoreButton}
                            onPress={() =>
                                setShowMore((current) => !current)
                            }
                            activeOpacity={0.7}
                        >
                            <Text style={styles.viewMoreText}>
                                {showMore
                                    ? "View less"
                                    : "View more"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* Tasks tab */
                    <View style={styles.notesContainer}>
                        <View style={styles.noteCard}>
                            <Text style={styles.noteTitle}>
                                Class Tasks
                            </Text>

                            <Text style={styles.noteDescription}>
                                Your upcoming assignments
                            </Text>
                        </View>

                        {selectedClass.tasks.length === 0 ? (
                            <View style={styles.noteCard}>
                                <Text style={styles.noteDescription}>
                                    No tasks added yet.
                                </Text>
                            </View>
                        ) : (
                            selectedClass.tasks.map((task) => {
                                const taskKey =
                                    `${className}-${task}`;

                                const completed =
                                    completedTasks.includes(taskKey);

                                return (
                                    <View
                                        key={taskKey}
                                        style={styles.taskRow}
                                    >
                                        {/* Checkbox completes the task */}
                                        <TouchableOpacity
                                            onPress={() =>
                                                toggleTask(task)
                                            }
                                            activeOpacity={0.7}
                                            accessibilityRole="checkbox"
                                            accessibilityState={{
                                                checked: completed,
                                            }}
                                            style={styles.checkboxButton}
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
                                        </TouchableOpacity>

                                        {/* Assignment name opens Screen 13 */}
                                        <TouchableOpacity
                                            style={styles.taskButton}
                                            activeOpacity={0.7}
                                            onPress={() =>
                                                onOpenAssignment?.(
                                                    task,
                                                    className
                                                )
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.taskText,
                                                    completed &&
                                                    styles.taskCompleted,
                                                ]}
                                            >
                                                {task}
                                            </Text>
                                        </TouchableOpacity>

                                        <Text style={styles.taskArrow}>
                                            ›
                                        </Text>
                                    </View>
                                );
                            })
                        )}
                    </View>
                )}

                <View style={styles.bottomDivider} />
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
        flexGrow: 1,
        width: "100%",
        maxWidth: 430,
        alignSelf: "center",
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 45,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 34,
    },

    backArrow: {
        color: colors.brand.primary,
        fontSize: 32,
        marginRight: 18,
        lineHeight: 36,
    },

    headerTitle: {
        color: colors.brand.primary,
        fontSize: 22,
        fontWeight: "800",
        letterSpacing: -0.5,
    },

    classCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFDF7",
        borderWidth: 1,
        borderColor: "#D9EBE5",
        borderRadius: 17,
        padding: 14,
        marginBottom: 15,
    },

    classIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#D8F1F5",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },

    classIconText: {
        color: "#126B7B",
        fontSize: 28,
        fontWeight: "800",
    },

    classInfo: {
        flex: 1,
    },

    className: {
        color: colors.brand.primary,
        fontSize: 19,
        fontWeight: "800",
        marginBottom: 7,
    },

    classPeriod: {
        color: "#65A7B0",
        fontSize: 13,
        fontWeight: "600",
    },

    tabs: {
        flexDirection: "row",
        backgroundColor: "#F1F8F3",
        borderRadius: 15,
        padding: 3,
        marginBottom: 0,
    },

    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 13,
        borderRadius: 12,
    },

    activeTab: {
        backgroundColor: "#FFFDF8",
        borderWidth: 1,
        borderColor: "#DFEDE5",
    },

    tabText: {
        color: colors.brand.primary,
        fontSize: 16,
        fontWeight: "800",
    },

    notesContainer: {
        marginTop: 0,
    },

    noteCard: {
        backgroundColor: "#FFFDF6",
        borderWidth: 1,
        borderColor: "#E5EEE6",
        borderRadius: 13,
        paddingHorizontal: 17,
        paddingVertical: 17,
        marginBottom: 3,
    },

    noteTitle: {
        color: colors.brand.primary,
        fontSize: 17,
        fontWeight: "800",
        marginBottom: 12,
    },

    noteDescription: {
        color: "#60A6B0",
        fontSize: 14,
        lineHeight: 21,
    },

    viewMoreButton: {
        backgroundColor: "#F4FAF4",
        borderWidth: 1,
        borderColor: "#E4EEE7",
        borderRadius: 13,
        paddingVertical: 17,
        alignItems: "center",
        marginTop: 6,
    },

    viewMoreText: {
        color: colors.brand.primary,
        fontSize: 15,
        fontWeight: "800",
    },

    taskRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFDF6",
        borderWidth: 1,
        borderColor: "#E5EEE6",
        borderRadius: 12,
        padding: 12,
        marginTop: 7,
    },

    checkboxButton: {
        padding: 4,
        marginRight: 8,
    },

    checkbox: {
        width: 19,
        height: 19,
        borderRadius: 5,
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

    taskButton: {
        flex: 1,
        paddingVertical: 5,
    },

    taskText: {
        color: colors.text.primary,
        fontSize: 13,
        lineHeight: 19,
    },

    taskCompleted: {
        textDecorationLine: "line-through",
        color: colors.text.secondary,
    },

    taskArrow: {
        color: colors.brand.primary,
        fontSize: 23,
        marginLeft: 6,
    },

    bottomDivider: {
        height: 1,
        backgroundColor: "#DDEBE5",
        marginTop: 22,
    },
});
