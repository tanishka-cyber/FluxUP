
import React, { useState } from "react";
import {
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
import type { ClassItem } from "./ConfirmClassesScreen";
import type { Commitment } from "./PlannerScreen";

type ScheduleTab = "classes" | "commitments";

type Props = {
    classes: ClassItem[];
    commitments: Commitment[];
    initialTab?: ScheduleTab;
    onBack: () => void;
    onSave: (
        classes: ClassItem[],
        commitments: Commitment[]
    ) => void;
};

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const CLASS_COLORS = [
    colors.blocks.blue,
    colors.blocks.purple,
    colors.blocks.green,
    colors.blocks.pink,
    colors.blocks.yellow,
    colors.blocks.orange,
];

export default function UpdateScheduleScreen({
    classes: initialClasses,
    commitments: initialCommitments,
    initialTab = "classes",
    onBack,
    onSave,
}: Props) {
    const [classes, setClasses] = useState<ClassItem[]>(
        initialClasses.map((item) => ({ ...item }))
    );

    const [commitments, setCommitments] = useState<Commitment[]>(
        initialCommitments.map((item) => ({
            ...item,
            days: [...item.days],
        }))
    );

    const [activeTab, setActiveTab] =
        useState<ScheduleTab>(initialTab);

    const [expandedCommitment, setExpandedCommitment] =
        useState<string | null>(null);

    const [error, setError] = useState("");

    function updateClass(
        id: string,
        changes: Partial<ClassItem>
    ) {
        setError("");

        setClasses((current) =>
            current.map((item) =>
                item.id === id ? { ...item, ...changes } : item
            )
        );
    }

    function addClass() {
        const nextPeriod =
            classes.reduce((max, item) => {
                const number = Number(
                    item.period.match(/\d+/)?.[0] || 0
                );

                return Math.max(max, number);
            }, 0) + 1;

        setClasses((current) => [
            ...current,
            {
                id: `class-${Date.now()}-${Math.random()}`,
                name: "",
                teacher: "",
                period: `Period ${nextPeriod}`,
                color:
                    CLASS_COLORS[
                    current.length % CLASS_COLORS.length
                    ],
            },
        ]);

        setError("");
    }

    function removeClass(id: string) {
        setClasses((current) =>
            current.filter((item) => item.id !== id)
        );

        setError("");
    }

    function updateCommitment(
        id: string,
        changes: Partial<Commitment>
    ) {
        setError("");

        setCommitments((current) =>
            current.map((item) =>
                item.id === id ? { ...item, ...changes } : item
            )
        );
    }

    function addCommitment() {
        const id = `commitment-${Date.now()}-${Math.random()}`;

        setCommitments((current) => [
            ...current,
            {
                id,
                name: "",
                days: ["Monday"],
                startTime: "4:00 PM",
                endTime: "5:00 PM",
                weekly: true,
            },
        ]);

        setExpandedCommitment(id);
        setError("");
    }

    function toggleDay(id: string, day: string) {
        setCommitments((current) =>
            current.map((item) => {
                if (item.id !== id) return item;

                return {
                    ...item,
                    days: item.days.includes(day)
                        ? item.days.filter((value) => value !== day)
                        : [...item.days, day],
                };
            })
        );

        setError("");
    }

    function removeCommitment(id: string) {
        setCommitments((current) =>
            current.filter((item) => item.id !== id)
        );

        setExpandedCommitment((current) =>
            current === id ? null : current
        );

        setError("");
    }

    function saveChanges() {
        if (classes.some((item) => !item.name.trim())) {
            setActiveTab("classes");
            setError(
                "Please give every class a name before saving."
            );
            return;
        }

        if (
            commitments.some((item) => !item.name.trim())
        ) {
            setActiveTab("commitments");
            setError(
                "Please give every extracurricular commitment a name."
            );
            return;
        }

        if (
            commitments.some((item) => item.days.length === 0)
        ) {
            setActiveTab("commitments");
            setError(
                "Every commitment needs at least one selected day."
            );
            return;
        }

        setError("");

        onSave(
            classes.map((item) => ({
                ...item,
                name: item.name.trim(),
                period: item.period.trim(),
                teacher: item.teacher.trim(),
            })),
            commitments.map((item) => ({
                ...item,
                name: item.name.trim(),
                startTime: item.startTime.trim(),
                endTime: item.endTime.trim(),
                days: [...item.days],
            }))
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.page}
            behavior={
                Platform.OS === "ios" ? "padding" : undefined
            }
        >
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}

                <View style={styles.topRow}>
                    <TouchableOpacity onPress={onBack}>
                        <Text style={styles.backText}>
                            ← Back
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.logo}>Flux</Text>
                </View>

                <Text style={styles.eyebrow}>
                    YOUR SCHEDULE
                </Text>

                <Text style={styles.heading}>
                    Keep things in sync.
                </Text>

                <Text style={styles.subtitle}>
                    Classes change. Activities shift. Update your
                    schedule here, and your planner will reflect
                    your changes.
                </Text>

                {/* SUMMARY */}

                <View style={styles.summaryCard}>
                    <View style={styles.summaryIcon}>
                        <Text style={styles.summaryIconText}>
                            ▦
                        </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.summaryTitle}>
                            Your current schedule
                        </Text>

                        <Text style={styles.summaryDescription}>
                            {classes.length} classes ·{" "}
                            {commitments.length} commitments
                        </Text>
                    </View>
                </View>

                {/* TABS */}

                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === "classes" &&
                            styles.activeTab,
                        ]}
                        onPress={() => {
                            setActiveTab("classes");
                            setError("");
                        }}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "classes" &&
                                styles.activeTabText,
                            ]}
                        >
                            Classes
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === "commitments" &&
                            styles.activeTab,
                        ]}
                        onPress={() => {
                            setActiveTab("commitments");
                            setError("");
                        }}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "commitments" &&
                                styles.activeTabText,
                            ]}
                        >
                            Commitments
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* ERROR MESSAGE */}

                {!!error && (
                    <View style={styles.errorCard}>
                        <Text style={styles.errorText}>
                            {error}
                        </Text>
                    </View>
                )}

                {/* CLASSES TAB */}

                {activeTab === "classes" ? (
                    <>
                        <Text style={styles.sectionTitle}>
                            Your classes
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Rename classes, update periods, or add
                            new courses.
                        </Text>

                        {classes.length === 0 && (
                            <View style={styles.emptyCard}>
                                <Text style={styles.emptyTitle}>
                                    No classes added
                                </Text>

                                <Text style={styles.emptyDescription}>
                                    Add a class to begin building your
                                    school schedule.
                                </Text>
                            </View>
                        )}

                        {classes.map((course, index) => (
                            <View
                                key={course.id}
                                style={styles.classCard}
                            >
                                <View
                                    style={[
                                        styles.colorStrip,
                                        {
                                            backgroundColor:
                                                course.color,
                                        },
                                    ]}
                                />

                                <View style={styles.cardContent}>
                                    <View style={styles.cardHeading}>
                                        <Text style={styles.cardNumber}>
                                            CLASS {index + 1}
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() =>
                                                removeClass(course.id)
                                            }
                                            style={styles.removeButton}
                                        >
                                            <Text style={styles.removeText}>
                                                Remove
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.fieldLabel}>
                                        Class name
                                    </Text>

                                    <TextInput
                                        style={styles.input}
                                        value={course.name}
                                        onChangeText={(value) =>
                                            updateClass(course.id, {
                                                name: value,
                                            })
                                        }
                                        placeholder="Class name"
                                        placeholderTextColor={
                                            colors.text.muted
                                        }
                                    />

                                    <Text style={styles.fieldLabel}>
                                        Period
                                    </Text>

                                    <TextInput
                                        style={styles.input}
                                        value={course.period}
                                        onChangeText={(value) =>
                                            updateClass(course.id, {
                                                period: value,
                                            })
                                        }
                                        placeholder="Period 1"
                                        placeholderTextColor={
                                            colors.text.muted
                                        }
                                    />

                                    <Text style={styles.fieldLabel}>
                                        Teacher (optional)
                                    </Text>

                                    <TextInput
                                        style={styles.input}
                                        value={course.teacher}
                                        onChangeText={(value) =>
                                            updateClass(course.id, {
                                                teacher: value,
                                            })
                                        }
                                        placeholder="Teacher name"
                                        placeholderTextColor={
                                            colors.text.muted
                                        }
                                    />
                                </View>
                            </View>
                        ))}

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={addClass}
                        >
                            <Text style={styles.addButtonText}>
                                ＋ Add another class
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {/* COMMITMENTS TAB */}

                        <Text style={styles.sectionTitle}>
                            Your commitments
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Manage recurring activities and their
                            weekly times.
                        </Text>

                        {commitments.length === 0 && (
                            <View style={styles.emptyCard}>
                                <Text style={styles.emptyTitle}>
                                    No commitments added yet
                                </Text>

                                <Text style={styles.emptyDescription}>
                                    Add clubs, sports, volunteering, or
                                    anything else you do regularly.
                                </Text>
                            </View>
                        )}

                        {commitments.map((item) => {
                            const expanded =
                                expandedCommitment === item.id;

                            return (
                                <View
                                    key={item.id}
                                    style={styles.commitmentCard}
                                >
                                    <TouchableOpacity
                                        style={styles.commitmentHeader}
                                        onPress={() =>
                                            setExpandedCommitment(
                                                expanded ? null : item.id
                                            )
                                        }
                                    >
                                        <View
                                            style={styles.commitmentIcon}
                                        >
                                            <Text
                                                style={
                                                    styles.commitmentIconText
                                                }
                                            >
                                                ✦
                                            </Text>
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <Text
                                                style={
                                                    styles.commitmentTitle
                                                }
                                            >
                                                {item.name ||
                                                    "New commitment"}
                                            </Text>

                                            <Text
                                                style={
                                                    styles.commitmentDescription
                                                }
                                            >
                                                {item.days
                                                    .map((day) =>
                                                        day.slice(0, 3)
                                                    )
                                                    .join(", ")}
                                                {" · "}
                                                {item.startTime} –{" "}
                                                {item.endTime}
                                            </Text>
                                        </View>

                                        <Text style={styles.chevron}>
                                            {expanded ? "⌃" : "⌄"}
                                        </Text>
                                    </TouchableOpacity>

                                    {expanded && (
                                        <View
                                            style={
                                                styles.commitmentFields
                                            }
                                        >
                                            <Text
                                                style={styles.fieldLabel}
                                            >
                                                Activity name
                                            </Text>

                                            <TextInput
                                                style={styles.input}
                                                value={item.name}
                                                onChangeText={(value) =>
                                                    updateCommitment(
                                                        item.id,
                                                        { name: value }
                                                    )
                                                }
                                                placeholder="e.g. Robotics Club"
                                                placeholderTextColor={
                                                    colors.text.muted
                                                }
                                            />

                                            <Text
                                                style={styles.fieldLabel}
                                            >
                                                Repeats on
                                            </Text>

                                            <View style={styles.daysGrid}>
                                                {DAYS.map((day) => {
                                                    const selected =
                                                        item.days.includes(
                                                            day
                                                        );

                                                    return (
                                                        <TouchableOpacity
                                                            key={day}
                                                            style={[
                                                                styles.dayChip,
                                                                selected &&
                                                                styles.dayChipSelected,
                                                            ]}
                                                            onPress={() =>
                                                                toggleDay(
                                                                    item.id,
                                                                    day
                                                                )
                                                            }
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.dayChipText,
                                                                    selected &&
                                                                    styles.dayChipTextSelected,
                                                                ]}
                                                            >
                                                                {day.slice(0, 3)}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>

                                            <View style={styles.timeRow}>
                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        style={
                                                            styles.fieldLabel
                                                        }
                                                    >
                                                        Start time
                                                    </Text>

                                                    <TextInput
                                                        style={styles.input}
                                                        value={
                                                            item.startTime
                                                        }
                                                        onChangeText={(
                                                            value
                                                        ) =>
                                                            updateCommitment(
                                                                item.id,
                                                                {
                                                                    startTime:
                                                                        value,
                                                                }
                                                            )
                                                        }
                                                        placeholder="4:00 PM"
                                                        placeholderTextColor={
                                                            colors.text.muted
                                                        }
                                                    />
                                                </View>

                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        style={
                                                            styles.fieldLabel
                                                        }
                                                    >
                                                        End time
                                                    </Text>

                                                    <TextInput
                                                        style={styles.input}
                                                        value={item.endTime}
                                                        onChangeText={(
                                                            value
                                                        ) =>
                                                            updateCommitment(
                                                                item.id,
                                                                {
                                                                    endTime:
                                                                        value,
                                                                }
                                                            )
                                                        }
                                                        placeholder="5:00 PM"
                                                        placeholderTextColor={
                                                            colors.text.muted
                                                        }
                                                    />
                                                </View>
                                            </View>

                                            <TouchableOpacity
                                                style={styles.weeklyRow}
                                                onPress={() =>
                                                    updateCommitment(
                                                        item.id,
                                                        {
                                                            weekly:
                                                                !item.weekly,
                                                        }
                                                    )
                                                }
                                            >
                                                <View
                                                    style={[
                                                        styles.checkbox,
                                                        item.weekly &&
                                                        styles.checkboxChecked,
                                                    ]}
                                                >
                                                    {item.weekly && (
                                                        <Text
                                                            style={
                                                                styles.checkmark
                                                            }
                                                        >
                                                            ✓
                                                        </Text>
                                                    )}
                                                </View>

                                                <Text
                                                    style={
                                                        styles.weeklyText
                                                    }
                                                >
                                                    Repeat every week
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={
                                                    styles.removeCommitment
                                                }
                                                onPress={() =>
                                                    removeCommitment(
                                                        item.id
                                                    )
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.removeText
                                                    }
                                                >
                                                    Remove commitment
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            );
                        })}

                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={addCommitment}
                        >
                            <Text style={styles.addButtonText}>
                                ＋ Add another commitment
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* TIP */}

                <View style={styles.tipCard}>
                    <Text style={styles.tipSymbol}>
                        ✦
                    </Text>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.tipTitle}>
                            Your plans can change.
                        </Text>

                        <Text
                            style={styles.tipDescription}
                        >
                            Updating a class keeps its existing
                            assignments connected, as long as you
                            don't remove the class.
                        </Text>
                    </View>
                </View>

                {/* SAVE */}

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveChanges}
                >
                    <Text style={styles.saveText}>
                        Save schedule changes →
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
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    page: {
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
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 32,
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
        marginBottom: 24,
    },
    summaryCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EAF5EE",
        borderRadius: 17,
        padding: 17,
        marginBottom: 25,
    },
    summaryIcon: {
        width: 43,
        height: 43,
        borderRadius: 13,
        backgroundColor: "#D1EBD8",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
    },
    summaryIconText: {
        fontSize: 23,
        color: colors.brand.dark,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: colors.text.primary,
        marginBottom: 5,
    },
    summaryDescription: {
        fontSize: 12,
        color: colors.text.secondary,
    },
    tabs: {
        flexDirection: "row",
        backgroundColor: "#F0F3EF",
        padding: 4,
        borderRadius: 13,
        marginBottom: 27,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: "#FFFFFF",
    },
    tabText: {
        color: colors.text.secondary,
        fontSize: 13,
        fontWeight: "700",
    },
    activeTabText: {
        color: colors.brand.dark,
    },
    errorCard: {
        backgroundColor: "#FCEAE7",
        borderWidth: 1,
        borderColor: "#F0C4BD",
        borderRadius: 12,
        padding: 13,
        marginBottom: 20,
    },
    errorText: {
        color: "#A43F38",
        fontSize: 12,
        fontWeight: "600",
        lineHeight: 19,
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
        marginBottom: 18,
    },
    classCard: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 17,
        overflow: "hidden",
        marginBottom: 12,
    },
    colorStrip: {
        width: 7,
    },
    cardContent: {
        flex: 1,
        padding: 16,
    },
    cardHeading: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 17,
    },
    cardNumber: {
        color: colors.text.secondary,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1,
    },
    removeButton: {
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    removeText: {
        color: "#BD6059",
        fontSize: 12,
        fontWeight: "700",
    },
    fieldLabel: {
        color: colors.text.primary,
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
        borderRadius: 11,
        paddingHorizontal: 12,
        paddingVertical: 12,
        color: colors.text.primary,
        fontSize: 13,
        marginBottom: 17,
    },
    addButton: {
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#BDD7CC",
        borderRadius: 14,
        minHeight: 51,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
        marginBottom: 25,
    },
    addButtonText: {
        color: colors.brand.primary,
        fontSize: 13,
        fontWeight: "800",
    },
    commitmentCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 17,
        marginBottom: 12,
        overflow: "hidden",
    },
    commitmentHeader: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
    },
    commitmentIcon: {
        width: 43,
        height: 43,
        borderRadius: 13,
        backgroundColor: colors.blocks.purple,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    commitmentIconText: {
        fontSize: 21,
        color: colors.brand.dark,
    },
    commitmentTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: colors.text.primary,
        marginBottom: 5,
    },
    commitmentDescription: {
        fontSize: 11,
        color: colors.text.secondary,
        lineHeight: 17,
    },
    chevron: {
        fontSize: 20,
        color: colors.text.secondary,
        marginLeft: 8,
    },
    commitmentFields: {
        borderTopWidth: 1,
        borderTopColor: colors.divider,
        padding: 16,
    },
    daysGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 7,
        marginBottom: 19,
    },
    dayChip: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 9,
    },
    dayChipSelected: {
        backgroundColor: colors.brand.light,
        borderColor: "#BDD7CC",
    },
    dayChipText: {
        color: colors.text.secondary,
        fontSize: 11,
        fontWeight: "700",
    },
    dayChipTextSelected: {
        color: colors.brand.dark,
    },
    timeRow: {
        flexDirection: "row",
        gap: 12,
    },
    weeklyRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        gap: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxChecked: {
        backgroundColor: colors.brand.primary,
        borderColor: colors.brand.primary,
    },
    checkmark: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "800",
    },
    weeklyText: {
        color: colors.text.primary,
        fontSize: 12,
    },
    removeCommitment: {
        paddingVertical: 10,
        alignItems: "center",
    },
    emptyCard: {
        padding: 20,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 15,
        marginBottom: 14,
    },
    emptyTitle: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 6,
    },
    emptyDescription: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 19,
    },
    tipCard: {
        flexDirection: "row",
        backgroundColor: "#FFF4D9",
        padding: 16,
        borderRadius: 15,
        marginBottom: 24,
    },
    tipSymbol: {
        color: "#A47C2C",
        fontSize: 21,
        marginRight: 12,
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
    saveButton: {
        backgroundColor: colors.brand.primary,
        minHeight: 55,
        borderRadius: 15,
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
});
