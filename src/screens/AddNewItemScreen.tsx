
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { colors } from "../constants/colors";
import type { ClassItem } from "./ConfirmClassesScreen";

export type NewItemType = "assignment" | "test" | "event";

export type NewPlannerItem = {
    id: string;
    type: NewItemType;
    title: string;
    classId: string | null;
    dueDate: string;
    priority: "Low" | "Medium" | "High";
    notes: string;
    completed: boolean;
};

type Props = {
    classes: ClassItem[];
    onBack: () => void;
    onSave: (item: NewPlannerItem) => void;
};

const TYPES: { type: NewItemType; label: string; icon: string }[] = [
    { type: "assignment", label: "Assignment", icon: "▤" },
    { type: "test", label: "Test", icon: "✎" },
    { type: "event", label: "Event", icon: "▦" },
];

function todayKey(): string {
    const now = new Date();
    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
    ].join("-");
}

export default function AddNewItemScreen({
    classes,
    onBack,
    onSave,
}: Props) {
    const [type, setType] = useState<NewItemType>("assignment");
    const [title, setTitle] = useState("");
    const [classId, setClassId] = useState<string | null>(
        classes[0]?.id ?? null
    );
    const [dueDate, setDueDate] = useState(todayKey());
    const [priority, setPriority] =
        useState<"Low" | "Medium" | "High">("Medium");
    const [notes, setNotes] = useState("");

    function save() {
        if (!title.trim()) {
            Alert.alert("Missing title", "Enter a title first.");
            return;
        }

        if (type !== "event" && !classId) {
            Alert.alert("Missing class", "Select a class first.");
            return;
        }

        const match = dueDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!match) {
            Alert.alert("Invalid date", "Use YYYY-MM-DD.");
            return;
        }

        const year = Number(match[1]);
        const month = Number(match[2]);
        const day = Number(match[3]);
        const date = new Date(year, month - 1, day);

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            Alert.alert("Invalid date", "Enter a real calendar date.");
            return;
        }

        onSave({
            id: `item-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,
            type,
            title: title.trim(),
            classId: type === "event" ? null : classId,
            dueDate,
            priority,
            notes: notes.trim(),
            completed: false,
        });
    }

    return (
        <View style={styles.screen}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.topRow}>
                    <TouchableOpacity onPress={onBack}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.logo}>Flux</Text>
                </View>

                <Text style={styles.eyebrow}>YOUR PLANNER</Text>
                <Text style={styles.heading}>Add something new.</Text>
                <Text style={styles.subtitle}>
                    Keep your assignments, tests, and important events
                    organized in one place.
                </Text>

                <Text style={styles.sectionLabel}>WHAT ARE YOU ADDING?</Text>

                <View style={styles.typeRow}>
                    {TYPES.map((option) => (
                        <TouchableOpacity
                            key={option.type}
                            style={[
                                styles.typeCard,
                                type === option.type && styles.selectedCard,
                            ]}
                            onPress={() => setType(option.type)}
                        >
                            <Text style={styles.typeIcon}>{option.icon}</Text>
                            <Text style={[
                                styles.typeText,
                                type === option.type && styles.selectedText,
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>
                    {type === "assignment"
                        ? "Assignment name"
                        : type === "test"
                            ? "Test name"
                            : "Event name"}
                </Text>

                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder={
                        type === "assignment"
                            ? "e.g. Problem Set 5"
                            : type === "test"
                                ? "e.g. Physics Unit 3 Exam"
                                : "e.g. Robotics meeting"
                    }
                    placeholderTextColor={colors.text.muted}
                />

                {type !== "event" && (
                    <>
                        <Text style={styles.label}>Class</Text>

                        {classes.length === 0 ? (
                            <Text style={styles.helpText}>
                                No classes available. Add a class during
                                schedule setup first.
                            </Text>
                        ) : (
                            <View style={styles.classList}>
                                {classes.map((course) => (
                                    <TouchableOpacity
                                        key={course.id}
                                        style={[
                                            styles.classOption,
                                            classId === course.id &&
                                            styles.classOptionSelected,
                                        ]}
                                        onPress={() => setClassId(course.id)}
                                    >
                                        <View style={[
                                            styles.classDot,
                                            { backgroundColor: course.color },
                                        ]} />
                                        <Text style={styles.className}>
                                            {course.name}
                                        </Text>
                                        <Text style={styles.radio}>
                                            {classId === course.id ? "●" : "○"}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </>
                )}

                <Text style={styles.label}>
                    {type === "event" ? "Event date" : "Due date"}
                </Text>

                <TextInput
                    style={styles.input}
                    value={dueDate}
                    onChangeText={setDueDate}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.text.muted}
                    maxLength={10}
                    keyboardType="numbers-and-punctuation"
                />

                {type !== "event" && (
                    <>
                        <Text style={styles.label}>Priority</Text>
                        <View style={styles.priorityRow}>
                            {(["Low", "Medium", "High"] as const).map(
                                (option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.priorityButton,
                                            priority === option &&
                                            styles.prioritySelected,
                                        ]}
                                        onPress={() => setPriority(option)}
                                    >
                                        <Text style={[
                                            styles.priorityText,
                                            priority === option &&
                                            styles.selectedText,
                                        ]}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            )}
                        </View>
                    </>
                )}

                <Text style={styles.label}>Notes (optional)</Text>
                <TextInput
                    style={[styles.input, styles.notes]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Anything else to remember?"
                    placeholderTextColor={colors.text.muted}
                    multiline
                    textAlignVertical="top"
                />

                <View style={styles.tip}>
                    <Text style={styles.tipSymbol}>✦</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.tipTitle}>
                            One less thing to remember.
                        </Text>
                        <Text style={styles.tipDescription}>
                            Assignments and tests will appear inside their
                            class cards in your Planner.
                        </Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={save}>
                    <Text style={styles.saveText}>
                        Add to my planner →
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onBack}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
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
        marginBottom: 12,
    },
    subtitle: {
        color: colors.text.secondary,
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 29,
    },
    sectionLabel: {
        color: colors.text.secondary,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1,
        marginBottom: 12,
    },
    typeRow: {
        flexDirection: "row",
        gap: 9,
        marginBottom: 25,
    },
    typeCard: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 17,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    selectedCard: {
        borderColor: colors.brand.primary,
        backgroundColor: colors.brand.light,
    },
    typeIcon: {
        color: colors.brand.primary,
        fontSize: 23,
        marginBottom: 8,
    },
    typeText: {
        color: colors.text.secondary,
        fontSize: 12,
        fontWeight: "700",
    },
    selectedText: {
        color: colors.brand.dark,
        fontWeight: "800",
    },
    label: {
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 9,
        marginTop: 10,
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 15,
        paddingVertical: 14,
        color: colors.text.primary,
        fontSize: 14,
        marginBottom: 14,
    },
    classList: {
        gap: 8,
        marginBottom: 15,
    },
    classOption: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 13,
    },
    classOptionSelected: {
        borderColor: colors.brand.primary,
        backgroundColor: "#F0F9F4",
    },
    classDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 11,
    },
    className: {
        flex: 1,
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: "600",
    },
    radio: {
        color: colors.brand.primary,
        fontSize: 18,
    },
    helpText: {
        color: colors.text.secondary,
        fontSize: 12,
        marginBottom: 14,
    },
    priorityRow: {
        flexDirection: "row",
        gap: 9,
        marginBottom: 15,
    },
    priorityButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    prioritySelected: {
        backgroundColor: colors.brand.light,
        borderColor: colors.brand.primary,
    },
    priorityText: {
        color: colors.text.secondary,
        fontSize: 12,
        fontWeight: "700",
    },
    notes: {
        minHeight: 110,
        paddingTop: 14,
    },
    tip: {
        flexDirection: "row",
        backgroundColor: "#FFF4D9",
        borderRadius: 15,
        padding: 16,
        marginTop: 9,
        marginBottom: 25,
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
});
