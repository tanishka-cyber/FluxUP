import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { colors } from "../constants/colors";

type Commitment = {
    id: string;
    name: string;
    days: string[];
    startTime: string;
    endTime: string;
    weekly: boolean;
};

type Props = {
    onBack: () => void;
    onContinue: (commitments: Commitment[]) => void;
};

const DAYS = [
    { short: "M", full: "Monday" },
    { short: "T", full: "Tuesday" },
    { short: "W", full: "Wednesday" },
    { short: "T", full: "Thursday" },
    { short: "F", full: "Friday" },
    { short: "S", full: "Saturday" },
    { short: "S", full: "Sunday" },
];

export default function AddCommitmentsScreen({
    onBack,
    onContinue,
}: Props) {
    const [name, setName] = useState("");
    const [days, setDays] = useState<string[]>([]);
    const [startTime, setStartTime] = useState("4:00 PM");
    const [endTime, setEndTime] = useState("5:00 PM");
    const [weekly, setWeekly] = useState(true);
    const [commitments, setCommitments] = useState<Commitment[]>([]);
    const [error, setError] = useState("");

    function toggleDay(day: string) {
        setDays((current) =>
            current.includes(day)
                ? current.filter((item) => item !== day)
                : [...current, day]
        );
    }

    function addCommitment() {
        if (!name.trim()) {
            setError("Enter an activity name first.");
            return;
        }

        if (days.length === 0) {
            setError("Choose at least one day.");
            return;
        }

        const newCommitment: Commitment = {
            id: Date.now().toString(),
            name: name.trim(),
            days,
            startTime,
            endTime,
            weekly,
        };

        setCommitments((current) => [...current, newCommitment]);
        setName("");
        setDays([]);
        setError("");
    }

    function removeCommitment(id: string) {
        setCommitments((current) =>
            current.filter((item) => item.id !== id)
        );
    }

    return (
        <View style={styles.screen}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backText}>‹ Back</Text>
                </TouchableOpacity>

                <View style={styles.brandRow}>
                    <Text style={styles.brandName}>Flux</Text>
                </View>

                <View style={styles.progressTrack}>
                    <View style={styles.progressFill} />
                </View>

                <Text style={styles.stepLabel}>STEP 5 OF 5</Text>

                <Text style={styles.title}>Your time matters.</Text>
                <Text style={styles.subtitle}>
                    Add your recurring activities so Flux can build a realistic plan
                    around the things you already do.
                </Text>

                <View style={styles.formCard}>
                    <Text style={styles.fieldLabel}>ACTIVITY NAME</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Model UN, volunteering"
                        placeholderTextColor={colors.text.muted}
                        style={styles.input}
                    />

                    <Text style={styles.fieldLabel}>WHICH DAYS?</Text>
                    <View style={styles.daysRow}>
                        {DAYS.map((day, index) => {
                            const selected = days.includes(day.full);

                            return (
                                <TouchableOpacity
                                    key={`${day.full}-${index}`}
                                    onPress={() => toggleDay(day.full)}
                                    style={[
                                        styles.dayButton,
                                        selected && styles.dayButtonSelected,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.dayText,
                                            selected && styles.dayTextSelected,
                                        ]}
                                    >
                                        {day.short}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text style={styles.fieldLabel}>START TIME</Text>
                    <TextInput
                        value={startTime}
                        onChangeText={setStartTime}
                        placeholder="4:00 PM"
                        style={styles.input}
                    />

                    <Text style={styles.fieldLabel}>END TIME</Text>
                    <TextInput
                        value={endTime}
                        onChangeText={setEndTime}
                        placeholder="5:00 PM"
                        style={styles.input}
                    />

                    <TouchableOpacity
                        onPress={() => setWeekly((current) => !current)}
                        style={styles.weeklyRow}
                    >
                        <View
                            style={[
                                styles.checkbox,
                                weekly && styles.checkboxSelected,
                            ]}
                        >
                            {weekly && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <View style={styles.weeklyCopy}>
                            <Text style={styles.weeklyTitle}>Repeat every week</Text>
                            <Text style={styles.weeklySubtitle}>
                                Keep this activity in my schedule
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {!!error && <Text style={styles.error}>{error}</Text>}

                    <TouchableOpacity
                        onPress={addCommitment}
                        style={styles.addButton}
                    >
                        <Text style={styles.addButtonText}>+ Add activity</Text>
                    </TouchableOpacity>
                </View>

                {commitments.length > 0 && (
                    <View style={styles.savedSection}>
                        <Text style={styles.savedHeading}>
                            YOUR ACTIVITIES ({commitments.length})
                        </Text>

                        {commitments.map((item) => (
                            <View key={item.id} style={styles.commitmentCard}>
                                <View style={styles.commitmentDot} />
                                <View style={styles.commitmentInfo}>
                                    <Text style={styles.commitmentName}>{item.name}</Text>
                                    <Text style={styles.commitmentDetails}>
                                        {item.days.map((day) => day.slice(0, 3)).join(", ")}
                                        {" · "}
                                        {item.startTime}–{item.endTime}
                                    </Text>
                                    {item.weekly && (
                                        <Text style={styles.repeatLabel}>Repeats weekly</Text>
                                    )}
                                </View>
                                <TouchableOpacity
                                    onPress={() => removeCommitment(item.id)}
                                >
                                    <Text style={styles.removeText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                <Text style={styles.footerNote}>
                    You can always adjust your commitments later.
                </Text>

                <TouchableOpacity
                    onPress={() => onContinue(commitments)}
                    style={styles.continueButton}
                >
                    <Text style={styles.continueText}>Continue →</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onBack} style={styles.skipButton}>
                    <Text style={styles.skipText}>Back to previous step</Text>
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
    scroll: {
        flex: 1,
    },
    content: {
        width: "100%",
        maxWidth: 600,
        alignSelf: "center",
        paddingHorizontal: 28,
        paddingTop: 24,
        paddingBottom: 48,
    },
    backButton: {
        alignSelf: "flex-start",
        paddingVertical: 8,
        marginBottom: 20,
    },
    backText: {
        color: colors.text.secondary,
        fontSize: 15,
    },
    brandRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        marginBottom: 26,
    },
    brandIcon: {
        width: 34,
        height: 34,
        borderRadius: 11,
        backgroundColor: colors.brand.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    brandIconText: {
        color: colors.text.white,
        fontSize: 23,
        fontWeight: "800",
    },
    brandName: {
        color: "#087F70",
        fontSize: 30,
        fontWeight: "800",
        letterSpacing: -1.2,
    },
    progressTrack: {
        height: 5,
        backgroundColor: colors.border,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 22,
    },
    progressFill: {
        height: "100%",
        width: "100%",
        backgroundColor: colors.brand.primary,
        borderRadius: 10,
    },
    stepLabel: {
        color: colors.brand.primary,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.4,
        marginBottom: 12,
    },
    title: {
        color: colors.text.primary,
        fontSize: 34,
        fontWeight: "800",
        letterSpacing: -1.2,
        marginBottom: 10,
    },
    subtitle: {
        color: colors.text.secondary,
        fontSize: 15,
        lineHeight: 23,
        marginBottom: 26,
    },
    formCard: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 22,
    },
    fieldLabel: {
        color: colors.text.secondary,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.2,
        marginTop: 18,
        marginBottom: 9,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 14,
        color: colors.text.primary,
        backgroundColor: colors.background,
        fontSize: 14,
    },
    daysRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 7,
    },
    dayButton: {
        flex: 1,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },
    dayButtonSelected: {
        backgroundColor: colors.brand.primary,
        borderColor: colors.brand.primary,
    },
    dayText: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.text.secondary,
    },
    dayTextSelected: {
        color: colors.text.white,
    },
    weeklyRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 22,
        gap: 12,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxSelected: {
        backgroundColor: colors.brand.primary,
        borderColor: colors.brand.primary,
    },
    checkmark: {
        color: colors.text.white,
        fontWeight: "800",
        fontSize: 14,
    },
    weeklyCopy: {
        flex: 1,
    },
    weeklyTitle: {
        color: colors.text.primary,
        fontWeight: "700",
        fontSize: 13,
    },
    weeklySubtitle: {
        color: colors.text.secondary,
        fontSize: 12,
        marginTop: 3,
    },
    error: {
        color: colors.status.danger,
        fontSize: 12,
        marginTop: 12,
    },
    addButton: {
        height: 46,
        borderRadius: 12,
        backgroundColor: colors.brand.light,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 22,
    },
    addButtonText: {
        color: colors.brand.dark,
        fontSize: 14,
        fontWeight: "800",
    },
    savedSection: {
        marginTop: 28,
    },
    savedHeading: {
        color: colors.text.secondary,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.2,
        marginBottom: 12,
    },
    commitmentCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        gap: 11,
    },
    commitmentDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.brand.primary,
    },
    commitmentInfo: {
        flex: 1,
    },
    commitmentName: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "700",
    },
    commitmentDetails: {
        color: colors.text.secondary,
        fontSize: 11,
        marginTop: 5,
    },
    repeatLabel: {
        color: colors.brand.primary,
        fontSize: 10,
        fontWeight: "700",
        marginTop: 5,
    },
    removeText: {
        color: colors.status.danger,
        fontSize: 11,
        fontWeight: "700",
    },
    footerNote: {
        color: colors.text.muted,
        textAlign: "center",
        fontSize: 12,
        lineHeight: 18,
        marginTop: 22,
    },
    continueButton: {
        height: 54,
        borderRadius: 15,
        backgroundColor: colors.brand.primary,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    continueText: {
        color: colors.text.white,
        fontSize: 15,
        fontWeight: "800",
    },
    skipButton: {
        alignItems: "center",
        paddingVertical: 17,
    },
    skipText: {
        color: colors.text.secondary,
        fontSize: 13,
    },
});