
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { colors } from "../constants/colors";

export type NotificationPreferences = {
    assignments: boolean;
    tests: boolean;
    schedule: boolean;
    commitments: boolean;
    quietHours: boolean;
    reminderTiming: "1 hour" | "1 day" | "2 days" | "1 week";
    quietStart: string;
    quietEnd: string;
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
    assignments: true,
    tests: true,
    schedule: true,
    commitments: true,
    quietHours: false,
    reminderTiming: "1 day",
    quietStart: "9:00 PM",
    quietEnd: "7:00 AM",
};

type Props = {
    preferences: NotificationPreferences;
    onBack: () => void;
    onSave: (preferences: NotificationPreferences) => void;
};

const REMINDER_OPTIONS: NotificationPreferences["reminderTiming"][] = [
    "1 hour",
    "1 day",
    "2 days",
    "1 week",
];

const QUIET_TIMES = [
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
    "11:00 PM",
    "12:00 AM",
];

type ToggleKey =
    | "assignments"
    | "tests"
    | "schedule"
    | "commitments";

const SETTINGS: {
    key: ToggleKey;
    icon: string;
    title: string;
    description: string;
    background: string;
}[] = [
        {
            key: "assignments",
            icon: "✎",
            title: "Assignment reminders",
            description: "Know when coursework deadlines are approaching.",
            background: "#E4EDFF",
        },
        {
            key: "tests",
            icon: "◇",
            title: "Tests & exams",
            description: "Stay informed about upcoming assessments.",
            background: "#F0E6FF",
        },
        {
            key: "schedule",
            icon: "▦",
            title: "Schedule updates",
            description: "Keep up with changes to your school day.",
            background: "#E0F2E6",
        },
        {
            key: "commitments",
            icon: "☆",
            title: "Extracurriculars",
            description: "Remember clubs, activities, and commitments.",
            background: "#FFF0D6",
        },
    ];

export default function NotificationSettingsScreen({
    preferences,
    onBack,
    onSave,
}: Props) {
    const [settings, setSettings] = useState<NotificationPreferences>({
        ...preferences,
    });

    const [editingTime, setEditingTime] = useState<
        "start" | "end" | null
    >(null);

    function toggle(key: ToggleKey) {
        setSettings((current) => ({
            ...current,
            [key]: !current[key],
        }));
    }

    function selectQuietTime(value: string) {
        if (editingTime === "start") {
            setSettings((current) => ({
                ...current,
                quietStart: value,
            }));
        } else if (editingTime === "end") {
            setSettings((current) => ({
                ...current,
                quietEnd: value,
            }));
        }
        setEditingTime(null);
    }

    return (
        <View style={styles.page}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onBack}
                        accessibilityRole="button"
                        accessibilityLabel="Go back without saving"
                    >
                        <Text style={styles.backArrow}>‹</Text>
                    </TouchableOpacity>

                    <Text style={styles.logo}>FluxUP</Text>
                    <View style={{ width: 40 }} />
                </View>

                <Text style={styles.eyebrow}>MAKE IT YOURS</Text>
                <Text style={styles.title}>Notification settings.</Text>
                <Text style={styles.subtitle}>
                    Choose what matters to you. We'll keep the rest
                    out of your way.
                </Text>

                <View style={styles.introCard}>
                    <Text style={styles.introIcon}>✦</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.introTitle}>
                            Your focus comes first.
                        </Text>
                        <Text style={styles.introDescription}>
                            Stay informed without feeling overwhelmed.
                            You can update these preferences anytime.
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Remind me about</Text>

                <View style={styles.settingsCard}>
                    {SETTINGS.map((item, index) => (
                        <View
                            key={item.key}
                            style={[
                                styles.settingRow,
                                index < SETTINGS.length - 1 && styles.rowBorder,
                            ]}
                        >
                            <View
                                style={[
                                    styles.settingIcon,
                                    { backgroundColor: item.background },
                                ]}
                            >
                                <Text style={styles.settingIconText}>
                                    {item.icon}
                                </Text>
                            </View>

                            <View style={styles.settingCopy}>
                                <Text style={styles.settingTitle}>
                                    {item.title}
                                </Text>
                                <Text style={styles.settingDescription}>
                                    {item.description}
                                </Text>
                            </View>

                            <Switch
                                value={settings[item.key]}
                                onValueChange={() => toggle(item.key)}
                                trackColor={{
                                    false: "#DCE3DD",
                                    true: "#91CEAA",
                                }}
                                thumbColor={
                                    settings[item.key]
                                        ? colors.brand.primary
                                        : "#FFFFFF"
                                }
                                accessibilityLabel={item.title}
                            />
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>
                    Deadline reminder timing
                </Text>
                <Text style={styles.sectionDescription}>
                    Choose how early you'd like to be reminded about
                    assignments and tests.
                </Text>

                <View style={styles.timingCard}>
                    <Text style={styles.fieldLabel}>REMIND ME BEFORE</Text>

                    <View style={styles.optionsRow}>
                        {REMINDER_OPTIONS.map((option) => {
                            const selected =
                                settings.reminderTiming === option;

                            return (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.timingOption,
                                        selected && styles.timingOptionActive,
                                    ]}
                                    onPress={() =>
                                        setSettings((current) => ({
                                            ...current,
                                            reminderTiming: option,
                                        }))
                                    }
                                    accessibilityRole="radio"
                                    accessibilityState={{ selected }}
                                >
                                    <Text
                                        style={[
                                            styles.timingText,
                                            selected && styles.timingTextActive,
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Quiet hours</Text>

                <View style={styles.quietCard}>
                    <View style={styles.quietHeader}>
                        <View style={styles.quietIcon}>
                            <Text style={styles.quietIconText}>☾</Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={styles.settingTitle}>
                                Pause nonurgent alerts
                            </Text>
                            <Text style={styles.settingDescription}>
                                Make room for rest and uninterrupted focus.
                            </Text>
                        </View>

                        <Switch
                            value={settings.quietHours}
                            onValueChange={(quietHours) =>
                                setSettings((current) => ({
                                    ...current,
                                    quietHours,
                                }))
                            }
                            trackColor={{
                                false: "#DCE3DD",
                                true: "#91CEAA",
                            }}
                            thumbColor={
                                settings.quietHours
                                    ? colors.brand.primary
                                    : "#FFFFFF"
                            }
                            accessibilityLabel="Enable quiet hours"
                        />
                    </View>

                    {settings.quietHours && (
                        <>
                            <View style={styles.timeSelectionRow}>
                                <TouchableOpacity
                                    style={styles.timeBox}
                                    onPress={() =>
                                        setEditingTime(
                                            editingTime === "start" ? null : "start"
                                        )
                                    }
                                >
                                    <Text style={styles.fieldLabel}>FROM</Text>
                                    <Text style={styles.timeValue}>
                                        {settings.quietStart} ▾
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.timeBox}
                                    onPress={() =>
                                        setEditingTime(
                                            editingTime === "end" ? null : "end"
                                        )
                                    }
                                >
                                    <Text style={styles.fieldLabel}>UNTIL</Text>
                                    <Text style={styles.timeValue}>
                                        {settings.quietEnd} ▾
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {editingTime !== null && (
                                <View style={styles.timeOptions}>
                                    <Text style={styles.timeOptionsTitle}>
                                        Select {editingTime === "start"
                                            ? "start"
                                            : "end"} time
                                    </Text>

                                    <View style={styles.timeGrid}>
                                        {QUIET_TIMES.map((time) => (
                                            <TouchableOpacity
                                                key={time}
                                                style={styles.timeChoice}
                                                onPress={() => selectQuietTime(time)}
                                            >
                                                <Text style={styles.timeChoiceText}>
                                                    {time}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            <Text style={styles.quietNote}>
                                Quiet hours can span overnight, such as
                                9:00 PM to 7:00 AM.
                            </Text>
                        </>
                    )}
                </View>

                <View style={styles.demoBanner}>
                    <Text style={styles.demoBannerText}>
                        ✦ These settings are saved for this app session.
                        Automatic reminders and push delivery will be
                        connected later.
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => onSave(settings)}
                >
                    <Text style={styles.saveText}>
                        Save preferences →
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onBack}
                >
                    <Text style={styles.cancelText}>
                        Back without saving
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#F3F3EF",
    },
    scroll: {
        flex: 1,
        width: "100%",
        maxWidth: 430,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 27,
        paddingBottom: 48,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 34,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 13,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },
    backArrow: {
        color: colors.text.primary,
        fontSize: 29,
        marginTop: -4,
    },
    logo: {
        fontSize: 25,
        fontWeight: "800",
        color: colors.brand.primary,
        letterSpacing: -1,
    },
    eyebrow: {
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.3,
        color: colors.brand.primary,
        marginBottom: 10,
    },
    title: {
        color: colors.text.primary,
        fontSize: 30,
        fontWeight: "800",
        letterSpacing: -1,
        marginBottom: 10,
    },
    subtitle: {
        color: colors.text.secondary,
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 23,
    },
    introCard: {
        flexDirection: "row",
        gap: 12,
        padding: 17,
        borderRadius: 17,
        backgroundColor: "#EAF5EE",
        marginBottom: 29,
    },
    introIcon: {
        color: colors.brand.primary,
        fontSize: 25,
    },
    introTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: colors.text.primary,
        marginBottom: 6,
    },
    introDescription: {
        color: colors.text.secondary,
        fontSize: 11,
        lineHeight: 18,
    },
    sectionTitle: {
        color: colors.text.primary,
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 11,
    },
    sectionDescription: {
        fontSize: 12,
        lineHeight: 19,
        color: colors.text.secondary,
        marginBottom: 14,
    },
    settingsCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 17,
        paddingHorizontal: 15,
        marginBottom: 29,
    },
    settingRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        gap: 11,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: "#EFF1ED",
    },
    settingIcon: {
        width: 39,
        height: 39,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    settingIconText: {
        fontSize: 22,
        color: colors.brand.dark,
    },
    settingCopy: {
        flex: 1,
    },
    settingTitle: {
        color: colors.text.primary,
        fontSize: 12,
        fontWeight: "800",
        marginBottom: 5,
    },
    settingDescription: {
        color: colors.text.secondary,
        fontSize: 10,
        lineHeight: 16,
    },
    timingCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 17,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 29,
    },
    fieldLabel: {
        fontSize: 10,
        color: colors.text.secondary,
        fontWeight: "800",
        letterSpacing: 0.7,
        marginBottom: 12,
    },
    optionsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    timingOption: {
        paddingHorizontal: 14,
        paddingVertical: 11,
        backgroundColor: "#F2F4F0",
        borderRadius: 11,
        borderWidth: 1,
        borderColor: "#F2F4F0",
    },
    timingOptionActive: {
        backgroundColor: "#E6F4EB",
        borderColor: colors.brand.primary,
    },
    timingText: {
        color: colors.text.secondary,
        fontSize: 12,
        fontWeight: "700",
    },
    timingTextActive: {
        color: colors.brand.dark,
        fontWeight: "800",
    },
    quietCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 17,
        padding: 16,
        marginBottom: 20,
    },
    quietHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
    },
    quietIcon: {
        width: 39,
        height: 39,
        borderRadius: 12,
        backgroundColor: "#EAE8F6",
        alignItems: "center",
        justifyContent: "center",
    },
    quietIconText: {
        fontSize: 24,
        color: "#7962A3",
    },
    timeSelectionRow: {
        flexDirection: "row",
        gap: 11,
        marginTop: 20,
    },
    timeBox: {
        flex: 1,
        backgroundColor: "#F5F7F4",
        borderRadius: 12,
        padding: 13,
    },
    timeValue: {
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: "800",
    },
    timeOptions: {
        backgroundColor: "#F5F7F4",
        padding: 12,
        borderRadius: 13,
        marginTop: 12,
    },
    timeOptionsTitle: {
        fontSize: 12,
        fontWeight: "800",
        color: colors.text.primary,
        marginBottom: 12,
    },
    timeGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    timeChoice: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 10,
        paddingVertical: 9,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: colors.border,
    },
    timeChoiceText: {
        color: colors.brand.dark,
        fontSize: 11,
        fontWeight: "700",
    },
    quietNote: {
        fontSize: 11,
        lineHeight: 17,
        color: colors.text.secondary,
        marginTop: 13,
    },
    demoBanner: {
        backgroundColor: "#FFF4D9",
        padding: 15,
        borderRadius: 13,
        marginBottom: 22,
    },
    demoBannerText: {
        color: "#866A3C",
        fontSize: 11,
        lineHeight: 18,
    },
    saveButton: {
        backgroundColor: colors.brand.primary,
        borderRadius: 15,
        paddingVertical: 18,
        alignItems: "center",
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
        fontWeight: "700",
    },
});
