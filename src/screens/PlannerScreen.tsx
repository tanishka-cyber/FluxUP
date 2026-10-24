import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { colors } from "../constants/colors";

type ViewMode = "Day" | "Week" | "Month";

export type Commitment = {
    id: string;
    name: string;
    days: string[];
    startTime: string;
    endTime: string;
    weekly: boolean;
};

type Props = {
    commitments?: Commitment[];
};

type PlannerItem = {
    id: string;
    time: string;
    title: string;
    subtitle: string;
    color: string;
    tasks?: string[];
    startMinutes: number;
    endMinutes: number;
    kind: "class" | "commitment";
};

const schedule: Omit<PlannerItem, "startMinutes" | "endMinutes" | "kind">[] = [
    {
        id: "1",
        time: "8:00 – 8:50 AM",
        title: "Linear Algebra",
        subtitle: "Period 1 · Room 214",
        color: colors.blocks.blue,
        tasks: ["Problem Set 4 · Due tomorrow"],
    },
    {
        id: "2",
        time: "8:55 – 9:45 AM",
        title: "AP Physics",
        subtitle: "Period 2 · Room 108",
        color: colors.blocks.purple,
        tasks: ["Forces & Motion review"],
    },
    {
        id: "3",
        time: "9:50 – 10:40 AM",
        title: "AP Business",
        subtitle: "Period 3 · Room 302",
        color: colors.blocks.yellow,
        tasks: ["Market analysis · Due Friday"],
    },
    {
        id: "4",
        time: "10:45 – 11:35 AM",
        title: "English",
        subtitle: "Period 4 · Room 116",
        color: colors.blocks.pink,
        tasks: ["Narrative draft · Revise introduction"],
    },
    {
        id: "5",
        time: "11:35 AM – 12:05 PM",
        title: "Lunch",
        subtitle: "Take a break and recharge",
        color: colors.blocks.green,
    },
    {
        id: "6",
        time: "12:10 – 1:00 PM",
        title: "AP Cybersecurity",
        subtitle: "Period 5 · Computer Lab",
        color: colors.blocks.blue,
        tasks: ["CyberPatriots practice"],
    },
    {
        id: "7",
        time: "1:05 – 1:55 PM",
        title: "Free Period",
        subtitle: "A little breathing room",
        color: colors.blocks.orange,
        tasks: ["Finish one small assignment"],
    },
];

const weekDays = [
    { day: "M", date: "12", fullDay: "Monday" },
    { day: "T", date: "13", fullDay: "Tuesday" },
    { day: "W", date: "14", fullDay: "Wednesday" },
    { day: "T", date: "15", fullDay: "Thursday" },
    { day: "F", date: "16", fullDay: "Friday" },
    { day: "S", date: "17", fullDay: "Saturday" },
    { day: "S", date: "18", fullDay: "Sunday" },
];

function timeToMinutes(value: string): number {
    const match = value.trim().toUpperCase().match(
        /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/
    );

    if (!match) return 9999;

    let hour = Number(match[1]);
    const minute = Number(match[2] ?? "0");
    const meridiem = match[3];

    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;

    return hour * 60 + minute;
}

function getTimeParts(time: string) {
    const parts = time.split("–").map((part) => part.trim());
    return {
        start: parts[0] ?? "",
        end: parts[1] ?? parts[0] ?? "",
    };
}

function normalizeTime(time: string, otherTime: string): string {
    if (/AM|PM/i.test(time)) return time;

    const meridiem = otherTime.toUpperCase().match(/AM|PM/)?.[0];
    return meridiem ? `${time} ${meridiem}` : time;
}

export default function PlannerScreen({ commitments = [] }: Props) {
    const [viewMode, setViewMode] = useState<ViewMode>("Day");
    const [selectedDate, setSelectedDate] = useState("14");
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);

    const selectedDay =
        weekDays.find((item) => item.date === selectedDate)?.fullDay ??
        "Wednesday";

    const calendarItems: PlannerItem[] = [
        ...schedule.map((item) => {
            const parts = getTimeParts(item.time);
            const start = normalizeTime(parts.start, parts.end);

            return {
                ...item,
                startMinutes: timeToMinutes(start),
                endMinutes: timeToMinutes(parts.end),
                kind: "class" as const,
            };
        }),

        ...commitments
            .filter((commitment) =>
                commitment.days.some(
                    (day) => day.toLowerCase() === selectedDay.toLowerCase()
                )
            )
            .map((commitment) => ({
                id: `commitment-${commitment.id}`,
                time: `${commitment.startTime} – ${commitment.endTime}`,
                title: commitment.name,
                subtitle: commitment.weekly
                    ? "Extracurricular · Repeats weekly"
                    : "Extracurricular",
                color: colors.blocks.green,
                startMinutes: timeToMinutes(commitment.startTime),
                endMinutes: timeToMinutes(commitment.endTime),
                kind: "commitment" as const,
            })),
    ].sort((a, b) => a.startMinutes - b.startMinutes);

    function toggleTask(task: string) {
        setCompletedTasks((current) =>
            current.includes(task)
                ? current.filter((item) => item !== task)
                : [...current, task]
        );
    }

    return (
        <View style={styles.screen}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.page}
            >
                <View style={styles.topBar}>
                    <Text style={styles.logo}>Flux</Text>

                    <View style={styles.profileCircle}>
                        <Text style={styles.profileInitial}>T</Text>
                    </View>
                </View>

                <View style={styles.greetingRow}>
                    <View style={styles.greetingCopy}>
                        <Text style={styles.eyebrow}>
                            {selectedDay.toUpperCase()}, OCTOBER {selectedDate}
                        </Text>

                        <Text style={styles.heading}>Your day, in flow.</Text>

                        <Text style={styles.description}>
                            A little progress goes a long way.
                        </Text>
                    </View>
                </View>

                <View style={styles.viewSelector}>
                    {(["Day", "Week", "Month"] as ViewMode[]).map((mode) => (
                        <TouchableOpacity
                            key={mode}
                            onPress={() => setViewMode(mode)}
                            style={[
                                styles.viewButton,
                                viewMode === mode && styles.viewButtonActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.viewButtonText,
                                    viewMode === mode &&
                                    styles.viewButtonTextActive,
                                ]}
                            >
                                {mode}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.dateStrip}>
                    {weekDays.map((item) => {
                        const selected = selectedDate === item.date;

                        return (
                            <TouchableOpacity
                                key={item.date}
                                onPress={() => setSelectedDate(item.date)}
                                style={[
                                    styles.dateButton,
                                    selected && styles.dateButtonSelected,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.dateDay,
                                        selected && styles.dateTextSelected,
                                    ]}
                                >
                                    {item.day}
                                </Text>

                                <Text
                                    style={[
                                        styles.dateNumber,
                                        selected && styles.dateTextSelected,
                                    ]}
                                >
                                    {item.date}
                                </Text>

                                {selected && <View style={styles.dateDot} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.overviewCard}>
                    <View>
                        <Text style={styles.overviewLabel}>
                            YOUR SCHEDULE
                        </Text>

                        <Text style={styles.overviewTitle}>
                            {calendarItems.length} planned blocks
                        </Text>
                    </View>

                    <View style={styles.progressCircle}>
                        <Text style={styles.progressNumber}>
                            {completedTasks.length}
                        </Text>
                        <Text style={styles.progressSlash}>done</Text>
                    </View>
                </View>

                <View style={styles.sectionHeadingRow}>
                    <Text style={styles.sectionHeading}>
                        {viewMode === "Day"
                            ? "Today's schedule"
                            : viewMode === "Week"
                                ? "This week's schedule"
                                : "Your month"}
                    </Text>

                    <Text style={styles.sectionCaption}>
                        {commitments.length > 0
                            ? "CLASSES & ACTIVITIES"
                            : "SCHOOL DAY"}
                    </Text>
                </View>

                {viewMode === "Month" ? (
                    <View style={styles.monthCard}>
                        <Text style={styles.monthTitle}>October 2026</Text>

                        <View style={styles.monthGrid}>
                            {["M", "T", "W", "T", "F", "S", "S"].map(
                                (day, index) => (
                                    <Text
                                        key={`${day}-${index}`}
                                        style={styles.monthDayLabel}
                                    >
                                        {day}
                                    </Text>
                                )
                            )}

                            {Array.from({ length: 35 }, (_, index) => {
                                const date = index - 2;
                                const validDate = date >= 1 && date <= 31;

                                const hasCommitment = commitments.some(
                                    (commitment) =>
                                        commitment.days.some(
                                            (day) =>
                                                day.toLowerCase() ===
                                                (weekDays.find(
                                                    (item) =>
                                                        item.date ===
                                                        String(date)
                                                )?.fullDay ?? "").toLowerCase()
                                        )
                                );

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        disabled={!validDate}
                                        onPress={() => {
                                            if (validDate) {
                                                setSelectedDate(String(date));
                                                setViewMode("Day");
                                            }
                                        }}
                                        style={[
                                            styles.monthDate,
                                            String(date) === selectedDate &&
                                            validDate &&
                                            styles.monthDateSelected,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.monthDateText,
                                                String(date) === selectedDate &&
                                                validDate &&
                                                styles.dateTextSelected,
                                                !validDate && styles.emptyDateText,
                                            ]}
                                        >
                                            {validDate ? date : ""}
                                        </Text>

                                        {validDate &&
                                            ([14, 16, 20, 23].includes(date) ||
                                                hasCommitment) && (
                                                <View
                                                    style={styles.monthEventDot}
                                                />
                                            )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Text style={styles.monthNote}>
                            Select a date to view its schedule.
                        </Text>
                    </View>
                ) : (
                    <>
                        {calendarItems.map((item) => (
                            <View key={item.id} style={styles.timelineRow}>
                                <View style={styles.timeColumn}>
                                    <Text style={styles.timeText}>
                                        {item.time.split("–")[0].trim()}
                                    </Text>
                                    <View style={styles.timelineLine} />
                                </View>

                                <View
                                    style={[
                                        styles.classCard,
                                        { backgroundColor: item.color },
                                    ]}
                                >
                                    <View style={styles.classHeader}>
                                        <View style={styles.classCopy}>
                                            <Text style={styles.classTitle}>
                                                {item.title}
                                            </Text>

                                            <Text style={styles.classSubtitle}>
                                                {item.subtitle}
                                            </Text>

                                            {item.kind === "commitment" && (
                                                <Text
                                                    style={styles.activityTime}
                                                >
                                                    {item.time}
                                                </Text>
                                            )}
                                        </View>

                                        <View style={styles.classIndicator} />
                                    </View>

                                    {item.tasks?.map((task) => {
                                        const taskKey = `${item.id}-${task}`;
                                        const completed =
                                            completedTasks.includes(taskKey);

                                        return (
                                            <TouchableOpacity
                                                key={taskKey}
                                                onPress={() =>
                                                    toggleTask(taskKey)
                                                }
                                                style={styles.taskRow}
                                            >
                                                <View
                                                    style={[
                                                        styles.taskCheckbox,
                                                        completed &&
                                                        styles.taskCheckboxCompleted,
                                                    ]}
                                                >
                                                    {completed && (
                                                        <Text
                                                            style={
                                                                styles.taskCheckmark
                                                            }
                                                        >
                                                            ✓
                                                        </Text>
                                                    )}
                                                </View>

                                                <Text
                                                    style={[
                                                        styles.taskText,
                                                        completed &&
                                                        styles.taskTextCompleted,
                                                    ]}
                                                >
                                                    {task}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        ))}

                        {calendarItems.length === 0 && (
                            <View style={styles.emptyCard}>
                                <Text style={styles.emptyTitle}>
                                    Nothing scheduled yet
                                </Text>
                                <Text style={styles.emptyDescription}>
                                    Your activities will appear here when you
                                    add commitments for this day.
                                </Text>
                            </View>
                        )}
                    </>
                )}

                <View style={styles.focusCard}>
                    <View style={styles.focusIcon}>
                        <Text style={styles.focusIconText}>✦</Text>
                    </View>

                    <View style={styles.focusCopy}>
                        <Text style={styles.focusTitle}>
                            A little focus time?
                        </Text>

                        <Text style={styles.focusDescription}>
                            Use a free period to make progress on your next
                            deadline.
                        </Text>
                    </View>
                </View>

                <Text style={styles.bottomNote}>
                    Your plan can change. Flux can help you adjust as you go.
                </Text>
            </ScrollView>

            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navIconActive}>▦</Text>
                    <Text style={styles.navTextActive}>Planner</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navIcon}>✓</Text>
                    <Text style={styles.navText}>Tasks</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navIcon}>＋</Text>
                    <Text style={styles.navText}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navIcon}>◷</Text>
                    <Text style={styles.navText}>Focus</Text>
                </TouchableOpacity>
            </View>
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
        maxWidth: 760,
        alignSelf: "center",
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 35,
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 32,
    },
    logo: {
        fontSize: 30,
        fontWeight: "800",
        color: colors.brand.primary,
        letterSpacing: -1.3,
    },
    profileCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: colors.brand.light,
        alignItems: "center",
        justifyContent: "center",
    },
    profileInitial: {
        color: colors.brand.dark,
        fontSize: 16,
        fontWeight: "800",
    },
    greetingRow: {
        marginBottom: 24,
    },
    greetingCopy: {
        flex: 1,
    },
    eyebrow: {
        color: colors.text.secondary,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.4,
        marginBottom: 9,
    },
    heading: {
        color: colors.text.primary,
        fontSize: 31,
        fontWeight: "800",
        letterSpacing: -1,
    },
    description: {
        color: colors.text.secondary,
        fontSize: 14,
        marginTop: 8,
    },
    viewSelector: {
        flexDirection: "row",
        backgroundColor: "#F0F3EF",
        padding: 4,
        borderRadius: 14,
        marginBottom: 20,
    },
    viewButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 11,
        borderRadius: 11,
    },
    viewButtonActive: {
        backgroundColor: colors.surface,
    },
    viewButtonText: {
        color: colors.text.secondary,
        fontSize: 13,
        fontWeight: "600",
    },
    viewButtonTextActive: {
        color: colors.brand.dark,
        fontWeight: "800",
    },
    dateStrip: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 23,
    },
    dateButton: {
        width: 39,
        height: 67,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
    },
    dateButtonSelected: {
        backgroundColor: colors.brand.primary,
    },
    dateDay: {
        color: colors.text.secondary,
        fontSize: 11,
        marginBottom: 7,
    },
    dateNumber: {
        color: colors.text.primary,
        fontSize: 15,
        fontWeight: "800",
    },
    dateTextSelected: {
        color: "#FFFFFF",
    },
    dateDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#FFFFFF",
        marginTop: 4,
    },
    overviewCard: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 19,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 29,
    },
    overviewLabel: {
        color: colors.text.secondary,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.2,
    },
    overviewTitle: {
        color: colors.text.primary,
        fontSize: 19,
        fontWeight: "800",
        marginTop: 6,
    },
    progressCircle: {
        flexDirection: "row",
        alignItems: "baseline",
        backgroundColor: colors.brand.light,
        paddingHorizontal: 13,
        paddingVertical: 9,
        borderRadius: 14,
    },
    progressNumber: {
        color: colors.brand.dark,
        fontSize: 20,
        fontWeight: "800",
    },
    progressSlash: {
        color: colors.brand.dark,
        fontSize: 11,
        marginLeft: 3,
    },
    sectionHeadingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    sectionHeading: {
        color: colors.text.primary,
        fontSize: 19,
        fontWeight: "800",
        letterSpacing: -0.4,
    },
    sectionCaption: {
        color: colors.text.muted,
        fontSize: 9,
        fontWeight: "800",
        letterSpacing: 1,
    },
    timelineRow: {
        flexDirection: "row",
        marginBottom: 12,
    },
    timeColumn: {
        width: 76,
        alignItems: "flex-start",
        paddingTop: 15,
    },
    timeText: {
        color: colors.text.secondary,
        fontSize: 10,
        fontWeight: "700",
    },
    timelineLine: {
        width: 1,
        flex: 1,
        minHeight: 55,
        backgroundColor: colors.border,
        marginLeft: 2,
        marginTop: 10,
    },
    classCard: {
        flex: 1,
        borderRadius: 17,
        padding: 16,
    },
    classHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    classCopy: {
        flex: 1,
    },
    classTitle: {
        color: colors.text.primary,
        fontSize: 15,
        fontWeight: "800",
    },
    classSubtitle: {
        color: "#53645E",
        fontSize: 11,
        marginTop: 5,
    },
    activityTime: {
        color: "#53645E",
        fontSize: 11,
        fontWeight: "700",
        marginTop: 7,
    },
    classIndicator: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#FFFFFF",
        marginLeft: 10,
    },
    taskRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.55)",
        borderRadius: 10,
        padding: 10,
        marginTop: 13,
        gap: 9,
    },
    taskCheckbox: {
        width: 16,
        height: 16,
        borderRadius: 5,
        borderWidth: 1.3,
        borderColor: "#71827A",
        alignItems: "center",
        justifyContent: "center",
    },
    taskCheckboxCompleted: {
        backgroundColor: colors.brand.primary,
        borderColor: colors.brand.primary,
    },
    taskCheckmark: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "800",
    },
    taskText: {
        color: colors.text.primary,
        fontSize: 11,
        flex: 1,
        lineHeight: 16,
    },
    taskTextCompleted: {
        textDecorationLine: "line-through",
        color: colors.text.secondary,
    },
    emptyCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 18,
    },
    emptyTitle: {
        color: colors.text.primary,
        fontSize: 15,
        fontWeight: "800",
    },
    emptyDescription: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 6,
    },
    focusCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E3F3E8",
        borderRadius: 18,
        padding: 18,
        marginTop: 16,
        gap: 13,
    },
    focusIcon: {
        width: 40,
        height: 40,
        borderRadius: 13,
        backgroundColor: "#C5E8D0",
        alignItems: "center",
        justifyContent: "center",
    },
    focusIconText: {
        color: colors.brand.dark,
        fontSize: 23,
    },
    focusCopy: {
        flex: 1,
    },
    focusTitle: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "800",
    },
    focusDescription: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 4,
    },
    monthCard: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: colors.border,
    },
    monthTitle: {
        color: colors.text.primary,
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 18,
    },
    monthGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    monthDayLabel: {
        width: `${100 / 7}%`,
        textAlign: "center",
        color: colors.text.secondary,
        fontSize: 11,
        fontWeight: "700",
        paddingBottom: 10,
    },
    monthDate: {
        width: `${100 / 7}%`,
        height: 43,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
    },
    monthDateSelected: {
        backgroundColor: colors.brand.primary,
    },
    monthDateText: {
        color: colors.text.primary,
        fontSize: 12,
        fontWeight: "600",
    },
    emptyDateText: {
        color: "transparent",
    },
    monthEventDot: {
        position: "absolute",
        bottom: 4,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.brand.primary,
    },
    monthNote: {
        color: colors.text.secondary,
        fontSize: 11,
        marginTop: 15,
    },
    bottomNote: {
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
        paddingBottom: 10,
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
        color: colors.text.muted,
        fontSize: 10,
    },
    navTextActive: {
        color: colors.brand.primary,
        fontSize: 10,
        fontWeight: "800",
    },
});