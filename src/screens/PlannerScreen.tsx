
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { colors } from "../constants/colors";
import type { ClassItem } from "./ConfirmClassesScreen";
import type { NewPlannerItem } from "./AddNewItemScreen";

export type Commitment = {
    id: string;
    name: string;
    days: string[];
    startTime: string;
    endTime: string;
    weekly: boolean;
};

type Props = {
    classes?: ClassItem[];
    commitments?: Commitment[];
    plannerItems?: NewPlannerItem[];
    onOpenClass?: (name: string) => void;
    onOpenAssignment?: (title: string, className: string) => void;
    onOpenTest?: (className: string) => void;
    onOpenMonth?: () => void;
    onOpenTasks?: () => void;
    onAddItem?: () => void;
    onToggleItem?: (id: string) => void;
    onOpenMore?: () => void;
    onOpenAI?: () => void;
};

type ScheduleBlock = {
    id: string;
    title: string;
    subtitle: string;
    time: string;
    color: string;
    startMinutes: number;
    kind: "class" | "free" | "lunch" | "commitment";
    classId?: string;
};

// Semester dates from the school schedule.
// These are temporary defaults for this school year.
// Later, App.tsx should pass dates extracted from the PDF.
const SEMESTER_DATES = {
    1: {
        start: "2026-08-12",
        end: "2026-12-17",
    },
    2: {
        start: "2027-01-05",
        end: "2027-05-20",
    },
} as const;

// JavaScript weekday order:
// Sunday, Monday, Tuesday, Wednesday,
// Thursday, Friday, Saturday.
//
// R means Thursday because T means Tuesday.
const DAY_CODES = [
    "",
    "M",
    "T",
    "W",
    "R",
    "F",
    "",
] as const;

function minutes(time: string): number {
    const match = time.trim().match(
        /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i
    );

    if (!match) return 9999;

    let hour = Number(match[1]);
    const minute = Number(match[2] ?? 0);
    const suffix = match[3]?.toUpperCase();

    if (hour > 23 || minute > 59) return 9999;

    if (suffix) {
        if (hour < 1 || hour > 12) return 9999;
        if (suffix === "PM" && hour < 12) hour += 12;
        if (suffix === "AM" && hour === 12) hour = 0;
    }

    return hour * 60 + minute;
}

function periodNumber(period: string): number {
    const match = period.match(/period\s*(\d+)/i);
    return match ? Number(match[1]) : 0;
}

// Sort by actual time if available.
// Otherwise, sort by numbered school period.
function blockStart(course: ClassItem): number {
    if (course.startTime?.trim()) {
        return minutes(course.startTime);
    }

    const number = periodNumber(course.period);
    return number > 0 ? 10000 + number : 19999;
}

// Never invent school bell times.
function blockTime(course: ClassItem): string {
    if (
        course.startTime?.trim() &&
        course.endTime?.trim()
    ) {
        return `${course.startTime} – ${course.endTime}`;
    }

    return "Time not set";
}

function dateKey(date: Date): string {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

function readableDate(value: string): string {
    const parts = value.split("-").map(Number);

    if (
        parts.length !== 3 ||
        parts.some((part) => !Number.isFinite(part))
    ) {
        return value || "Not specified";
    }

    const [year, month, day] = parts;
    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return value;
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

// Check BOTH the semester and the weekday.
// A class must pass both checks to appear.
function classMeetsOnDate(
    course: ClassItem,
    date: Date
): boolean {
    const day = date.getDay();

    // No regular school classes on weekends.
    if (day === 0 || day === 6) {
        return false;
    }

    const semester = course.semester ?? 1;
    const dates = SEMESTER_DATES[semester];
    const selected = dateKey(date);

    // Don't show Semester 1 during Semester 2,
    // or either semester during breaks.
    if (
        selected < dates.start ||
        selected > dates.end
    ) {
        return false;
    }

    const meetingDays = course.meetingDays ?? [];

    // Unknown meeting days are NOT assumed
    // to mean Monday through Friday.
    if (meetingDays.length === 0) {
        return false;
    }

    const dayCode = DAY_CODES[day];

    if (!dayCode) {
        return false;
    }

    return meetingDays.includes(dayCode);
}

// Recognize common commitment day formats:
// Monday, Mon, M, Thursday, Thu, Th, R, etc.
function commitmentMeetsOnDate(
    commitment: Commitment,
    date: Date
): boolean {
    const day = date.getDay();

    const aliases: string[][] = [
        ["sunday", "sun", "su"],
        ["monday", "mon", "m"],
        ["tuesday", "tue", "tues", "tu", "t"],
        ["wednesday", "wed", "w"],
        ["thursday", "thu", "thur", "thurs", "th", "r"],
        ["friday", "fri", "f"],
        ["saturday", "sat", "sa"],
    ];

    return commitment.days.some((value) => {
        const normalized = value.trim().toLowerCase();
        return aliases[day].includes(normalized);
    });
}

export default function PlannerScreen({
    classes = [],
    commitments = [],
    plannerItems = [],
    onOpenClass,
    onOpenAssignment,
    onOpenTest,
    onOpenMonth,
    onOpenTasks,
    onAddItem,
    onToggleItem,
    onOpenMore,
    onOpenAI,
}: Props) {
    const [selectedDate, setSelectedDate] = useState(
        new Date()
    );
    const [viewMode, setViewMode] = useState<
        "Day" | "Week"
    >("Day");

    const selectedKey = dateKey(selectedDate);
    const todayKey = dateKey(new Date());

    const weekStart = new Date(selectedDate);
    weekStart.setDate(
        weekStart.getDate() -
        ((weekStart.getDay() + 6) % 7)
    );

    const weekDays = Array.from(
        { length: 7 },
        (_, index) => {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + index);
            return date;
        }
    );

    // Only show classes belonging to the selected
    // semester AND meeting on the selected weekday.
    const classBlocks: ScheduleBlock[] = classes
        .filter((course) =>
            classMeetsOnDate(course, selectedDate)
        )
        .map((course) => {
            const kind = course.kind ?? "class";

            return {
                id: `class-${course.id}`,
                classId: course.id,
                title: course.name,
                subtitle: course.period,
                time: blockTime(course),
                color: course.color,
                startMinutes: blockStart(course),
                kind,
            };
        });

    // Extracurricular commitments are separate
    // from school semesters.
    const commitmentBlocks: ScheduleBlock[] =
        commitments
            .filter((commitment) =>
                commitmentMeetsOnDate(
                    commitment,
                    selectedDate
                )
            )
            .map((commitment) => ({
                id: `commitment-${commitment.id}`,
                title: commitment.name,
                subtitle: commitment.weekly
                    ? "Extracurricular · Weekly"
                    : "Extracurricular",
                time:
                    commitment.startTime &&
                        commitment.endTime
                        ? `${commitment.startTime} – ${commitment.endTime}`
                        : "Time not set",
                color: colors.blocks.green,
                startMinutes: minutes(
                    commitment.startTime
                ),
                kind: "commitment" as const,
            }));

    const blocks = [
        ...classBlocks,
        ...commitmentBlocks,
    ].sort(
        (a, b) =>
            a.startMinutes - b.startMinutes ||
            a.title.localeCompare(b.title)
    );

    const eventsToday = plannerItems.filter(
        (item) =>
            item.type === "event" &&
            item.dueDate === selectedKey
    );

    const completedCount = plannerItems.filter(
        (item) => item.completed
    ).length;

    function openItem(
        item: NewPlannerItem,
        className: string
    ) {
        if (item.type === "test") {
            onOpenTest?.(className);
        } else if (item.type === "assignment") {
            onOpenAssignment?.(
                item.title,
                className
            );
        }
    }

    return (
        <View style={styles.screen}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.logo}>Flux</Text>

                    <TouchableOpacity
                        style={styles.avatar}
                        onPress={onOpenMore}
                        accessibilityRole="button"
                        accessibilityLabel="Open profile and settings"
                    >
                        <Text style={styles.avatarText}>T</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.eyebrow}>
                    {selectedDate
                        .toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })
                        .toUpperCase()}
                </Text>

                <Text style={styles.title}>
                    Your day, in flow.
                </Text>

                <Text style={styles.subtitle}>
                    A little progress goes a long way.
                </Text>

                <View style={styles.switcher}>
                    {(
                        ["Day", "Week", "Month"] as const
                    ).map((mode) => (
                        <TouchableOpacity
                            key={mode}
                            style={[
                                styles.switchButton,
                                viewMode === mode &&
                                styles.switchActive,
                            ]}
                            onPress={() => {
                                if (mode === "Month") {
                                    onOpenMonth?.();
                                } else {
                                    setViewMode(mode);
                                }
                            }}
                        >
                            <Text
                                style={[
                                    styles.switchText,
                                    viewMode === mode &&
                                    styles.switchTextActive,
                                ]}
                            >
                                {mode}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.weekRow}>
                    {weekDays.map((date) => {
                        const selected =
                            dateKey(date) === selectedKey;

                        return (
                            <TouchableOpacity
                                key={dateKey(date)}
                                onPress={() =>
                                    setSelectedDate(date)
                                }
                                style={[
                                    styles.dayButton,
                                    selected &&
                                    styles.daySelected,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.dayText,
                                        selected &&
                                        styles.selectedText,
                                    ]}
                                >
                                    {date
                                        .toLocaleDateString(
                                            "en-US",
                                            { weekday: "short" }
                                        )
                                        .slice(0, 1)}
                                </Text>

                                <Text
                                    style={[
                                        styles.dayNumber,
                                        selected &&
                                        styles.selectedText,
                                    ]}
                                >
                                    {date.getDate()}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.summary}>
                    <View>
                        <Text style={styles.summaryLabel}>
                            YOUR SCHEDULE
                        </Text>
                        <Text style={styles.summaryTitle}>
                            {blocks.length} planned blocks
                        </Text>
                    </View>

                    <View style={styles.donePill}>
                        <Text style={styles.doneText}>
                            {completedCount} done
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.aiCard}
                    onPress={onOpenAI}
                    accessibilityRole="button"
                    accessibilityLabel="Open Flux AI"
                >
                    <View style={styles.aiCardIcon}>
                        <Text style={styles.aiCardIconText}>
                            ✦
                        </Text>
                    </View>

                    <View style={styles.aiCardCopy}>
                        <Text style={styles.aiCardTitle}>
                            Need a little help planning?
                        </Text>

                        <Text style={styles.aiCardDescription}>
                            Ask Flux AI about priorities,
                            assignments, and your schedule.
                        </Text>
                    </View>

                    <Text style={styles.aiCardArrow}>
                        ›
                    </Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>
                    {selectedKey === todayKey
                        ? "Today's schedule"
                        : `Schedule for ${selectedDate.toLocaleDateString(
                            "en-US",
                            {
                                month: "short",
                                day: "numeric",
                            }
                        )}`}
                </Text>

                {blocks.map((block) => {
                    const isClass =
                        block.kind === "class";

                    const isBreak =
                        block.kind === "free" ||
                        block.kind === "lunch";

                    const addedItems = isClass
                        ? plannerItems.filter(
                            (item) =>
                                item.classId ===
                                block.classId &&
                                item.type !== "event"
                        )
                        : [];

                    return (
                        <View
                            key={block.id}
                            style={styles.timelineRow}
                        >
                            <View style={styles.timeColumn}>
                                <Text style={styles.timeText}>
                                    {block.time ===
                                        "Time not set"
                                        ? "—"
                                        : block.time
                                            .split("–")[0]
                                            .trim()}
                                </Text>

                                <View
                                    style={styles.timelineLine}
                                />
                            </View>

                            <View
                                style={[
                                    styles.classCard,
                                    {
                                        backgroundColor:
                                            block.color,
                                    },
                                    isBreak &&
                                    styles.breakCard,
                                ]}
                            >
                                <TouchableOpacity
                                    disabled={!isClass}
                                    onPress={() =>
                                        onOpenClass?.(
                                            block.title
                                        )
                                    }
                                    style={styles.cardHeader}
                                >
                                    <View
                                        style={{ flex: 1 }}
                                    >
                                        <Text
                                            style={styles.className}
                                        >
                                            {block.title}
                                        </Text>

                                        <Text
                                            style={
                                                styles.classSubtitle
                                            }
                                        >
                                            {block.subtitle}
                                        </Text>

                                        <Text
                                            style={
                                                styles.classSubtitle
                                            }
                                        >
                                            {block.time}
                                        </Text>
                                    </View>

                                    {isClass && (
                                        <Text
                                            style={styles.arrow}
                                        >
                                            ›
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                {isBreak && (
                                    <Text
                                        style={
                                            styles.breakDescription
                                        }
                                    >
                                        {block.kind === "lunch"
                                            ? "Time to eat and recharge."
                                            : "A flexible block in your school day."}
                                    </Text>
                                )}

                                {addedItems.map(
                                    (item) => (
                                        <View
                                            key={item.id}
                                            style={styles.taskRow}
                                        >
                                            <TouchableOpacity
                                                style={[
                                                    styles.checkbox,
                                                    item.completed &&
                                                    styles.checkedBox,
                                                ]}
                                                onPress={() =>
                                                    onToggleItem?.(
                                                        item.id
                                                    )
                                                }
                                                accessibilityRole="checkbox"
                                                accessibilityState={{
                                                    checked:
                                                        item.completed,
                                                }}
                                            >
                                                {item.completed && (
                                                    <Text
                                                        style={
                                                            styles.check
                                                        }
                                                    >
                                                        ✓
                                                    </Text>
                                                )}
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={{
                                                    flex: 1,
                                                }}
                                                onPress={() =>
                                                    openItem(
                                                        item,
                                                        block.title
                                                    )
                                                }
                                            >
                                                <Text
                                                    style={[
                                                        styles.taskTitle,
                                                        item.completed &&
                                                        styles.struck,
                                                    ]}
                                                >
                                                    {item.title}
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.taskMeta
                                                    }
                                                >
                                                    {item.type ===
                                                        "test"
                                                        ? "Test"
                                                        : "Assignment"}
                                                    {" · Due "}
                                                    {readableDate(
                                                        item.dueDate
                                                    )}
                                                    {" · "}
                                                    {item.priority}
                                                </Text>
                                            </TouchableOpacity>

                                            <Text
                                                style={styles.arrow}
                                            >
                                                ›
                                            </Text>
                                        </View>
                                    )
                                )}

                                {isClass &&
                                    addedItems.length ===
                                    0 && (
                                        <Text
                                            style={
                                                styles.emptyTask
                                            }
                                        >
                                            No assignments or
                                            tests yet
                                        </Text>
                                    )}
                            </View>
                        </View>
                    );
                })}

                {blocks.length === 0 && (
                    <View
                        style={styles.emptyCard}
                    >
                        <Text
                            style={styles.className}
                        >
                            Nothing scheduled
                            for this day
                        </Text>

                        <Text
                            style={
                                styles.classSubtitle
                            }
                        >
                            Classes only appear
                            during their semester
                            on their selected
                            meeting days.
                        </Text>
                    </View>
                )}

                {eventsToday.length > 0 && (
                    <>
                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Events for this day
                        </Text>

                        {eventsToday.map(
                            (event) => (
                                <View
                                    key={event.id}
                                    style={
                                        styles.eventCard
                                    }
                                >
                                    <Text
                                        style={
                                            styles.className
                                        }
                                    >
                                        {event.title}
                                    </Text>

                                    <Text
                                        style={
                                            styles.classSubtitle
                                        }
                                    >
                                        {event.notes ||
                                            "Personal event"}
                                    </Text>
                                </View>
                            )
                        )}
                    </>
                )}

                <View
                    style={styles.focusCard}
                >
                    <Text
                        style={
                            styles.focusSymbol
                        }
                    >
                        ✦
                    </Text>

                    <View
                        style={{ flex: 1 }}
                    >
                        <Text
                            style={
                                styles.focusTitle
                            }
                        >
                            A little focus time?
                        </Text>

                        <Text
                            style={
                                styles.focusDescription
                            }
                        >
                            Use an available
                            study block to make
                            progress on your
                            next deadline.
                        </Text>
                    </View>
                </View>

                <Text
                    style={styles.footer}
                >
                    Your plan can change.
                    Flux can help you adjust
                    as you go.
                </Text>
            </ScrollView>

            <TouchableOpacity
                style={styles.aiButton}
                onPress={onOpenAI}
                accessibilityRole="button"
                accessibilityLabel="Ask Flux AI"
            >
                <Text
                    style={
                        styles.aiButtonText
                    }
                >
                    ✦ Ask Flux AI
                </Text>
            </TouchableOpacity>

            <View
                style={styles.bottomNav}
            >
                <TouchableOpacity
                    style={styles.navItem}
                >
                    <Text
                        style={
                            styles.navActive
                        }
                    >
                        ▦
                    </Text>
                    <Text
                        style={
                            styles.navLabelActive
                        }
                    >
                        Planner
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={onOpenTasks}
                >
                    <Text
                        style={styles.navIcon}
                    >
                        ✓
                    </Text>
                    <Text
                        style={styles.navLabel}
                    >
                        Tasks
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={onAddItem}
                >
                    <Text
                        style={styles.navIcon}
                    >
                        ＋
                    </Text>
                    <Text
                        style={styles.navLabel}
                    >
                        Add
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    disabled
                >
                    <Text
                        style={styles.navIcon}
                    >
                        ◷
                    </Text>
                    <Text
                        style={styles.navLabel}
                    >
                        Focus
                    </Text>
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
    scroll: {
        flex: 1,
    },
    content: {
        width: "100%",
        maxWidth: 760,
        alignSelf: "center",
        paddingHorizontal: 24,
        paddingTop: 26,
        paddingBottom: 110,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
    },
    logo: {
        fontSize: 30,
        fontWeight: "800",
        color: colors.brand.primary,
        letterSpacing: -1.3,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: colors.brand.light,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        color: colors.brand.dark,
        fontSize: 16,
        fontWeight: "800",
    },
    eyebrow: {
        color: colors.text.secondary,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.3,
        marginBottom: 9,
    },
    title: {
        fontSize: 31,
        fontWeight: "800",
        color: colors.text.primary,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 14,
        color: colors.text.secondary,
        marginTop: 8,
        marginBottom: 24,
    },
    switcher: {
        flexDirection: "row",
        padding: 4,
        backgroundColor: "#F0F3EF",
        borderRadius: 14,
        marginBottom: 20,
    },
    switchButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 11,
        borderRadius: 11,
    },
    switchActive: {
        backgroundColor: colors.surface,
    },
    switchText: {
        color: colors.text.secondary,
        fontSize: 13,
        fontWeight: "600",
    },
    switchTextActive: {
        color: colors.brand.dark,
        fontWeight: "800",
    },
    weekRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 23,
    },
    dayButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 14,
        alignItems: "center",
        gap: 8,
    },
    daySelected: {
        backgroundColor: colors.brand.primary,
    },
    dayText: {
        color: colors.text.secondary,
        fontSize: 11,
    },
    dayNumber: {
        color: colors.text.primary,
        fontSize: 15,
        fontWeight: "800",
    },
    selectedText: {
        color: "#FFFFFF",
    },
    summary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 18,
        padding: 19,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    summaryLabel: {
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.2,
        color: colors.text.secondary,
    },
    summaryTitle: {
        fontSize: 19,
        fontWeight: "800",
        color: colors.text.primary,
        marginTop: 6,
    },
    donePill: {
        backgroundColor: colors.brand.light,
        borderRadius: 12,
        padding: 11,
    },
    doneText: {
        color: colors.brand.dark,
        fontSize: 12,
        fontWeight: "800",
    },
    aiCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EAF5EE",
        borderRadius: 17,
        padding: 15,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: "#D3E9DC",
    },
    aiCardIcon: {
        width: 43,
        height: 43,
        borderRadius: 14,
        backgroundColor: "#D1EBD8",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    aiCardIconText: {
        color: colors.brand.primary,
        fontSize: 24,
    },
    aiCardCopy: {
        flex: 1,
    },
    aiCardTitle: {
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: "800",
        marginBottom: 5,
    },
    aiCardDescription: {
        color: colors.text.secondary,
        fontSize: 11,
        lineHeight: 17,
    },
    aiCardArrow: {
        color: colors.brand.primary,
        fontSize: 24,
        marginLeft: 7,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: "800",
        color: colors.text.primary,
        marginBottom: 17,
    },
    timelineRow: {
        flexDirection: "row",
        marginBottom: 12,
    },
    timeColumn: {
        width: 76,
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
        minHeight: 50,
        backgroundColor: colors.border,
        marginTop: 10,
    },
    classCard: {
        flex: 1,
        borderRadius: 17,
        padding: 16,
    },
    breakCard: {
        borderWidth: 1,
        borderColor: "#C8DDD1",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    className: {
        color: colors.text.primary,
        fontSize: 15,
        fontWeight: "800",
    },
    classSubtitle: {
        color: "#53645E",
        fontSize: 11,
        marginTop: 5,
    },
    breakDescription: {
        color: "#53645E",
        fontSize: 11,
        marginTop: 12,
    },
    arrow: {
        color: colors.brand.dark,
        fontSize: 20,
        marginLeft: 8,
    },
    taskRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        backgroundColor: "rgba(255,255,255,0.65)",
        borderRadius: 11,
        padding: 11,
        marginTop: 10,
    },
    checkbox: {
        width: 19,
        height: 19,
        borderWidth: 1.4,
        borderColor: "#71827A",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    checkedBox: {
        backgroundColor: colors.brand.primary,
        borderColor: colors.brand.primary,
    },
    check: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "800",
    },
    taskTitle: {
        color: colors.text.primary,
        fontSize: 12,
        fontWeight: "700",
    },
    taskMeta: {
        color: colors.text.secondary,
        fontSize: 10,
        marginTop: 4,
    },
    struck: {
        textDecorationLine: "line-through",
        color: colors.text.muted,
    },
    emptyTask: {
        color: "#53645E",
        fontSize: 11,
        marginTop: 13,
    },
    emptyCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 18,
        marginBottom: 15,
    },
    eventCard: {
        backgroundColor: colors.blocks.yellow,
        borderRadius: 15,
        padding: 17,
        marginBottom: 12,
    },
    focusCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E3F3E8",
        borderRadius: 18,
        padding: 18,
        marginTop: 18,
        gap: 13,
    },
    focusSymbol: {
        fontSize: 26,
        color: colors.brand.dark,
    },
    focusTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: colors.text.primary,
    },
    focusDescription: {
        fontSize: 12,
        color: colors.text.secondary,
        lineHeight: 18,
        marginTop: 4,
    },
    footer: {
        color: colors.text.muted,
        textAlign: "center",
        fontSize: 11,
        lineHeight: 18,
        marginTop: 23,
    },
    aiButton: {
        position: "absolute",
        right: 20,
        bottom: 85,
        backgroundColor: colors.brand.primary,
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 15,
        elevation: 5,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        zIndex: 10,
    },
    aiButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "800",
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
        minWidth: 55,
        gap: 4,
    },
    navIcon: {
        color: colors.text.muted,
        fontSize: 21,
    },
    navActive: {
        color: colors.brand.primary,
        fontSize: 21,
    },
    navLabel: {
        color: colors.text.muted,
        fontSize: 10,
    },
    navLabelActive: {
        color: colors.brand.primary,
        fontSize: 10,
        fontWeight: "800",
    },
});
