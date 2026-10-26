
import React, { useMemo, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { colors } from "../constants/colors";

type TaskStatus = "pending" | "completed";
type TaskType = "assignment" | "test";
type TaskFilter = "All" | "Today" | "Upcoming" | "Completed";

export type TaskItem = {
    id: string;
    title: string;
    className: string;
    type: TaskType;
    dueDate: string;
    dueLabel: string;
    priority: "High" | "Medium" | "Low";
    status: TaskStatus;
};

type Props = {
    onBack: () => void;
    onOpenAssignment?: (
        title: string,
        className: string
    ) => void;
    onOpenTest?: (className: string) => void;
    onOpenTask?: (task: TaskItem) => void;
    onAddTask?: () => void;
    onOpenPlanner?: () => void;
};

// Sample frontend tasks.
// These will be replaced by real saved coursework
// when we connect the backend.
const INITIAL_TASKS: TaskItem[] = [
    {
        id: "1",
        title: "Forces & Motion review",
        className: "AP Physics",
        type: "assignment",
        dueDate: "2026-10-24",
        dueLabel: "Oct 24",
        priority: "High",
        status: "pending",
    },
    {
        id: "2",
        title: "Problem Set 4",
        className: "Linear Algebra",
        type: "assignment",
        dueDate: "2026-10-25",
        dueLabel: "Oct 25",
        priority: "High",
        status: "pending",
    },
    {
        id: "3",
        title: "Market Analysis",
        className: "AP Business",
        type: "assignment",
        dueDate: "2026-10-27",
        dueLabel: "Oct 27",
        priority: "Medium",
        status: "pending",
    },
    {
        id: "4",
        title: "Physics Unit Test",
        className: "AP Physics",
        type: "test",
        dueDate: "2026-10-29",
        dueLabel: "Oct 29",
        priority: "High",
        status: "pending",
    },
    {
        id: "5",
        title: "Narrative Draft",
        className: "English",
        type: "assignment",
        dueDate: "2026-10-30",
        dueLabel: "Oct 30",
        priority: "Medium",
        status: "pending",
    },
    {
        id: "6",
        title: "Cybersecurity Practice",
        className: "AP Cybersecurity",
        type: "assignment",
        dueDate: "2026-11-02",
        dueLabel: "Nov 2",
        priority: "Low",
        status: "pending",
    },
    {
        id: "7",
        title: "Chapter 2 Notes",
        className: "Linear Algebra",
        type: "assignment",
        dueDate: "2026-10-21",
        dueLabel: "Oct 21",
        priority: "Medium",
        status: "completed",
    },
];

const CLASS_COLORS: Record<string, string> = {
    "AP Physics": colors.blocks.purple,
    "Linear Algebra": colors.blocks.blue,
    "AP Business": colors.blocks.yellow,
    English: colors.blocks.pink,
    "AP Cybersecurity": colors.blocks.green,
};

const FILTERS: TaskFilter[] = [
    "All",
    "Today",
    "Upcoming",
    "Completed",
];

const PRIORITY_ORDER = {
    High: 0,
    Medium: 1,
    Low: 2,
};

function getLocalDateKey() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function TasksScreen({
    onBack,
    onOpenAssignment,
    onOpenTest,
    onOpenTask,
    onAddTask,
    onOpenPlanner,
}: Props) {
    const [tasks, setTasks] =
        useState<TaskItem[]>(INITIAL_TASKS);

    const [activeFilter, setActiveFilter] =
        useState<TaskFilter>("All");

    const [selectedClass, setSelectedClass] =
        useState("All classes");

    const [sortByPriority, setSortByPriority] =
        useState(false);

    const today = getLocalDateKey();

    const completedCount = tasks.filter(
        (task) => task.status === "completed"
    ).length;

    const remainingCount =
        tasks.length - completedCount;

    const completionPercent =
        tasks.length === 0
            ? 0
            : Math.round(
                (completedCount / tasks.length) * 100
            );

    const classNames = useMemo(
        () => [
            "All classes",
            ...Array.from(
                new Set(
                    tasks.map((task) => task.className)
                )
            ),
        ],
        [tasks]
    );

    const visibleTasks = useMemo(() => {
        const filtered = tasks.filter((task) => {
            if (
                selectedClass !== "All classes" &&
                task.className !== selectedClass
            ) {
                return false;
            }

            if (activeFilter === "Completed") {
                return task.status === "completed";
            }

            if (task.status === "completed") {
                return activeFilter === "All";
            }

            if (activeFilter === "Today") {
                return task.dueDate === today;
            }

            if (activeFilter === "Upcoming") {
                return task.dueDate > today;
            }

            return true;
        });

        return filtered.sort((a, b) => {
            if (sortByPriority) {
                const priorityDifference =
                    PRIORITY_ORDER[a.priority] -
                    PRIORITY_ORDER[b.priority];

                if (priorityDifference !== 0) {
                    return priorityDifference;
                }
            }

            return a.dueDate.localeCompare(b.dueDate);
        });
    }, [
        tasks,
        activeFilter,
        selectedClass,
        sortByPriority,
        today,
    ]);

    function toggleTask(id: string) {
        setTasks((current) =>
            current.map((task) =>
                task.id === id
                    ? {
                        ...task,
                        status:
                            task.status === "completed"
                                ? "pending"
                                : "completed",
                    }
                    : task
            )
        );
    }

    function openTask(task: TaskItem) {
        if (onOpenTask) {
            onOpenTask(task);
            return;
        }

        if (task.type === "test") {
            onOpenTest?.(task.className);
        } else {
            onOpenAssignment?.(
                task.title,
                task.className
            );
        }
    }

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
                    >
                        <Text style={styles.backArrow}>
                            ‹
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.logo}>FluxUP</Text>

                    <View style={styles.headerSpacer} />
                </View>

                {/* Heading */}
                <Text style={styles.eyebrow}>
                    YOUR WORKSPACE
                </Text>

                <Text style={styles.heading}>
                    Your tasks, organized.
                </Text>

                <Text style={styles.description}>
                    One thing at a time. You've got this.
                </Text>

                {/* Progress card */}
                <View style={styles.progressCard}>
                    <View style={styles.progressTop}>
                        <View>
                            <Text style={styles.progressLabel}>
                                YOUR PROGRESS
                            </Text>

                            <Text style={styles.progressHeading}>
                                {completedCount} of {tasks.length} done
                            </Text>

                            <Text style={styles.progressSubtitle}>
                                {remainingCount} remaining
                            </Text>
                        </View>

                        <View style={styles.percentCircle}>
                            <Text style={styles.percentText}>
                                {completionPercent}%
                            </Text>
                        </View>
                    </View>

                    <View style={styles.progressTrack}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${completionPercent}%`,
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* Filter tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                >
                    {FILTERS.map((filter) => {
                        const active =
                            activeFilter === filter;

                        return (
                            <TouchableOpacity
                                key={filter}
                                onPress={() =>
                                    setActiveFilter(filter)
                                }
                                style={[
                                    styles.filterButton,
                                    active &&
                                    styles.filterButtonActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterText,
                                        active &&
                                        styles.filterTextActive,
                                    ]}
                                >
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Class filter */}
                <View style={styles.filterHeading}>
                    <Text style={styles.sectionTitle}>
                        Assignments & tests
                    </Text>

                    <TouchableOpacity
                        onPress={() =>
                            setSortByPriority(
                                (current) => !current
                            )
                        }
                    >
                        <Text style={styles.sortText}>
                            {sortByPriority
                                ? "Priority ↓"
                                : "Due date ↓"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.classFilterRow}
                >
                    {classNames.map((className) => {
                        const active =
                            selectedClass === className;

                        return (
                            <TouchableOpacity
                                key={className}
                                onPress={() =>
                                    setSelectedClass(className)
                                }
                                style={[
                                    styles.classFilter,
                                    active &&
                                    styles.classFilterActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.classFilterText,
                                        active &&
                                        styles.classFilterTextActive,
                                    ]}
                                >
                                    {className}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Task list */}
                <View style={styles.listHeading}>
                    <Text style={styles.listLabel}>
                        {activeFilter.toUpperCase()} TASKS
                    </Text>

                    <Text style={styles.listCount}>
                        {visibleTasks.length} shown
                    </Text>
                </View>

                {visibleTasks.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>
                            Nothing here yet.
                        </Text>

                        <Text style={styles.emptyDescription}>
                            Try another filter or check back
                            when new assignments are added.
                        </Text>
                    </View>
                ) : (
                    visibleTasks.map((task) => {
                        const completed =
                            task.status === "completed";

                        return (
                            <View
                                key={task.id}
                                style={styles.taskCard}
                            >
                                <View
                                    style={[
                                        styles.classStrip,
                                        {
                                            backgroundColor:
                                                CLASS_COLORS[
                                                task.className
                                                ] ??
                                                colors.blocks.green,
                                        },
                                    ]}
                                />

                                <TouchableOpacity
                                    style={styles.checkboxTouch}
                                    onPress={() =>
                                        toggleTask(task.id)
                                    }
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
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.taskContent}
                                    onPress={() =>
                                        openTask(task)
                                    }
                                    activeOpacity={0.7}
                                >
                                    <View
                                        style={styles.taskTopRow}
                                    >
                                        <Text
                                            style={styles.classLabel}
                                        >
                                            {task.className}
                                        </Text>

                                        <Text
                                            style={styles.dueLabel}
                                        >
                                            {task.dueLabel}
                                        </Text>
                                    </View>

                                    <Text
                                        style={[
                                            styles.taskTitle,
                                            completed &&
                                            styles.completedTitle,
                                        ]}
                                    >
                                        {task.title}
                                    </Text>

                                    <View
                                        style={styles.taskMetaRow}
                                    >
                                        <View
                                            style={[
                                                styles.typeBadge,
                                                task.type === "test" &&
                                                styles.testBadge,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.typeText,
                                                    task.type === "test" &&
                                                    styles.testText,
                                                ]}
                                            >
                                                {task.type === "test"
                                                    ? "Test"
                                                    : "Assignment"}
                                            </Text>
                                        </View>

                                        <View
                                            style={[
                                                styles.priorityDot,
                                                {
                                                    backgroundColor:
                                                        task.priority === "High"
                                                            ? "#E87575"
                                                            : task.priority ===
                                                                "Medium"
                                                                ? "#E9A23B"
                                                                : "#58AE87",
                                                },
                                            ]}
                                        />

                                        <Text
                                            style={styles.priorityText}
                                        >
                                            {task.priority} priority
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.arrowTouch}
                                    onPress={() =>
                                        openTask(task)
                                    }
                                >
                                    <Text style={styles.arrow}>
                                        ›
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })
                )}

                {/* Add task: Screen 18 */}
                {onAddTask ? (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={onAddTask}
                    >
                        <Text
                            style={styles.addButtonText}
                        >
                            ＋ Add new task
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.addButtonDisabled}>
                        <Text
                            style={styles.addButtonDisabledText}
                        >
                            ＋ Add new task · Coming soon
                        </Text>
                    </View>
                )}

                <Text style={styles.footerNote}>
                    Small steps add up. Keep your
                    schedule moving forward.
                </Text>
            </ScrollView>

            {/* Bottom navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={onOpenPlanner ?? onBack}
                >
                    <Text style={styles.navIcon}>
                        ▦
                    </Text>
                    <Text style={styles.navText}>
                        Planner
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                >
                    <Text
                        style={styles.navIconActive}
                    >
                        ☑
                    </Text>
                    <Text
                        style={styles.navTextActive}
                    >
                        Tasks
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={onAddTask}
                    disabled={!onAddTask}
                >
                    <Text style={styles.navIcon}>
                        ＋
                    </Text>
                    <Text style={styles.navText}>
                        Add
                    </Text>
                </TouchableOpacity>

                <View style={styles.navItem}>
                    <Text style={styles.navIcon}>
                        ◷
                    </Text>
                    <Text style={styles.navText}>
                        Focus
                    </Text>
                </View>
            </View>
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
        paddingTop: 28,
        paddingBottom: 40,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 25,
    },
    backButton: {
        width: 35,
        height: 35,
        justifyContent: "center",
    },
    backArrow: {
        color: colors.brand.primary,
        fontSize: 29,
    },
    logo: {
        color: colors.brand.primary,
        fontSize: 25,
        fontWeight: "800",
        letterSpacing: -1,
    },
    headerSpacer: {
        width: 35,
    },
    eyebrow: {
        color: colors.text.secondary,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.4,
        marginBottom: 10,
    },
    heading: {
        color: colors.text.primary,
        fontSize: 29,
        fontWeight: "800",
        letterSpacing: -1,
        lineHeight: 36,
    },
    description: {
        color: colors.text.secondary,
        fontSize: 14,
        lineHeight: 21,
        marginTop: 9,
        marginBottom: 24,
    },
    progressCard: {
        backgroundColor: "#EAF5ED",
        borderRadius: 18,
        padding: 19,
        marginBottom: 24,
    },
    progressTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 17,
    },
    progressLabel: {
        color: colors.brand.dark,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.2,
    },
    progressHeading: {
        color: colors.text.primary,
        fontSize: 19,
        fontWeight: "800",
        marginTop: 7,
    },
    progressSubtitle: {
        color: colors.text.secondary,
        fontSize: 12,
        marginTop: 5,
    },
    percentCircle: {
        width: 65,
        height: 65,
        borderRadius: 33,
        backgroundColor: "#D2EBDD",
        alignItems: "center",
        justifyContent: "center",
    },
    percentText: {
        color: colors.brand.dark,
        fontSize: 17,
        fontWeight: "800",
    },
    progressTrack: {
        height: 8,
        backgroundColor: "#D0E6D9",
        borderRadius: 5,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: colors.brand.primary,
        borderRadius: 5,
    },
    filterRow: {
        gap: 8,
        paddingBottom: 5,
        marginBottom: 23,
    },
    filterButton: {
        paddingHorizontal: 17,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "#F0F3EF",
    },
    filterButtonActive: {
        backgroundColor: colors.brand.primary,
    },
    filterText: {
        color: colors.text.secondary,
        fontSize: 12,
        fontWeight: "700",
    },
    filterTextActive: {
        color: "#FFFFFF",
    },
    filterHeading: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    sectionTitle: {
        color: colors.text.primary,
        fontSize: 18,
        fontWeight: "800",
    },
    sortText: {
        color: colors.brand.primary,
        fontSize: 11,
        fontWeight: "800",
    },
    classFilterRow: {
        gap: 8,
        paddingBottom: 6,
        marginBottom: 21,
    },
    classFilter: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 11,
        paddingHorizontal: 13,
        paddingVertical: 9,
        backgroundColor: colors.surface,
    },
    classFilterActive: {
        backgroundColor: colors.brand.light,
        borderColor: "#B7DCCB",
    },
    classFilterText: {
        color: colors.text.secondary,
        fontSize: 11,
        fontWeight: "700",
    },
    classFilterTextActive: {
        color: colors.brand.dark,
    },
    listHeading: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 13,
    },
    listLabel: {
        color: colors.text.secondary,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.1,
    },
    listCount: {
        color: colors.text.muted,
        fontSize: 11,
    },
    taskCard: {
        backgroundColor: colors.surface,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
        marginBottom: 11,
        minHeight: 105,
    },
    classStrip: {
        width: 6,
        alignSelf: "stretch",
    },
    checkboxTouch: {
        paddingHorizontal: 13,
        paddingVertical: 20,
    },
    checkbox: {
        width: 19,
        height: 19,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: "#92A39A",
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxCompleted: {
        backgroundColor: colors.brand.primary,
        borderColor: colors.brand.primary,
    },
    checkmark: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "800",
    },
    taskContent: {
        flex: 1,
        paddingVertical: 15,
    },
    taskTopRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        marginBottom: 7,
    },
    classLabel: {
        color: colors.text.secondary,
        fontSize: 10,
        fontWeight: "700",
        flexShrink: 1,
    },
    dueLabel: {
        color: colors.brand.dark,
        fontSize: 10,
        fontWeight: "800",
    },
    taskTitle: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 10,
    },
    completedTitle: {
        textDecorationLine: "line-through",
        color: colors.text.muted,
    },
    taskMetaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        flexWrap: "wrap",
    },
    typeBadge: {
        backgroundColor: "#E5F3EA",
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 8,
    },
    testBadge: {
        backgroundColor: "#FCE9E6",
    },
    typeText: {
        color: "#377F5D",
        fontSize: 10,
        fontWeight: "700",
    },
    testText: {
        color: "#C66A61",
    },
    priorityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginLeft: 3,
    },
    priorityText: {
        color: colors.text.secondary,
        fontSize: 10,
    },
    arrowTouch: {
        paddingHorizontal: 12,
        paddingVertical: 20,
    },
    arrow: {
        color: colors.text.muted,
        fontSize: 23,
    },
    emptyCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 15,
        padding: 22,
        marginBottom: 15,
    },
    emptyTitle: {
        color: colors.text.primary,
        fontSize: 15,
        fontWeight: "800",
    },
    emptyDescription: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 19,
        marginTop: 7,
    },
    addButton: {
        borderWidth: 1,
        borderColor: "#BDD7CC",
        borderStyle: "dashed",
        borderRadius: 14,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    addButtonText: {
        color: colors.brand.primary,
        fontSize: 13,
        fontWeight: "800",
    },
    addButtonDisabled: {
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: "dashed",
        borderRadius: 14,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    addButtonDisabledText: {
        color: colors.text.muted,
        fontSize: 12,
        fontWeight: "700",
    },
    footerNote: {
        color: colors.text.muted,
        fontSize: 11,
        textAlign: "center",
        lineHeight: 18,
        marginTop: 23,
    },
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 12,
        paddingBottom: 12,
    },
    navItem: {
        alignItems: "center",
        gap: 4,
        minWidth: 55,
    },
    navIcon: {
        color: colors.text.muted,
        fontSize: 21,
    },
    navIconActive: {
        color: colors.brand.primary,
        fontSize: 21,
    },
    navText: {
        color: colors.text.secondary,
        fontSize: 10,
    },
    navTextActive: {
        color: colors.brand.primary,
        fontSize: 10,
        fontWeight: "800",
    },
});
