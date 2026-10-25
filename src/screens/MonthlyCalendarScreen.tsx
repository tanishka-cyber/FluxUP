
import React, { useMemo, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { colors } from "../constants/colors";

type EventType =
    | "class"
    | "assignment"
    | "test"
    | "commitment";

type CalendarEvent = {
    id: string;
    title: string;
    date: string;
    time?: string;
    type: EventType;
};

type Props = {
    onBack: () => void;
    onAddEvent?: () => void;
    onOpenAssignment?: (
        title: string,
        className: string
    ) => void;
    onOpenTest?: (className: string) => void;
    onOpenPlanner?: () => void;
    onOpenTasks?: () => void;
    onOpenFocus?: () => void;
};

const INITIAL_EVENTS: CalendarEvent[] = [
    {
        id: "1",
        title: "AP Physics 1",
        date: "2026-10-14",
        time: "8:00 AM",
        type: "class",
    },
    {
        id: "2",
        title: "Physics worksheet",
        date: "2026-10-14",
        type: "assignment",
    },
    {
        id: "3",
        title: "Linear Algebra test",
        date: "2026-10-16",
        type: "test",
    },
    {
        id: "4",
        title: "Robotics practice",
        date: "2026-10-19",
        time: "4:00 PM",
        type: "commitment",
    },
    {
        id: "5",
        title: "English essay",
        date: "2026-10-21",
        type: "assignment",
    },
    {
        id: "6",
        title: "CyberPatriot meeting",
        date: "2026-10-23",
        time: "4:00 PM",
        type: "commitment",
    },
    {
        id: "7",
        title: "AP Business test",
        date: "2026-10-27",
        type: "test",
    },
];

const EVENT_COLORS: Record<EventType, string> = {
    class: "#6599F2",
    assignment: "#39AD7B",
    test: "#F27B70",
    commitment: "#E5A23D",
};

const WEEKDAYS = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
];

const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function dateKey(
    year: number,
    month: number,
    day: number
) {
    return (
        `${year}-${String(month + 1).padStart(2, "0")}-` +
        String(day).padStart(2, "0")
    );
}

function getCalendarDays(
    year: number,
    month: number
): (number | null)[] {
    const firstDay = new Date(year, month, 1).getDay();
    const mondayOffset = (firstDay + 6) % 7;
    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    const days: (number | null)[] = [];

    for (let i = 0; i < mondayOffset; i++) {
        days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
    }

    while (days.length % 7 !== 0) {
        days.push(null);
    }

    return days;
}

export default function MonthlyCalendarScreen({
    onBack,
    onAddEvent,
    onOpenAssignment,
    onOpenTest,
    onOpenPlanner,
    onOpenTasks,
    onOpenFocus,
}: Props) {
    // Start with October 2026 to match the storyboard.
    const [visibleMonth, setVisibleMonth] = useState(
        new Date(2026, 9, 1)
    );

    const [selectedDate, setSelectedDate] = useState(
        "2026-10-14"
    );

    const [events] = useState(INITIAL_EVENTS);

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();

    const calendarDays = useMemo(
        () => getCalendarDays(year, month),
        [year, month]
    );

    const selectedEvents = events.filter(
        (event) => event.date === selectedDate
    );

    const selectedDayNumber = Number(
        selectedDate.split("-")[2]
    );

    const selectedMonthNumber =
        Number(selectedDate.split("-")[1]) - 1;

    function changeMonth(direction: number) {
        const next = new Date(
            year,
            month + direction,
            1
        );

        setVisibleMonth(next);
        setSelectedDate(
            dateKey(
                next.getFullYear(),
                next.getMonth(),
                1
            )
        );
    }

    function openEvent(event: CalendarEvent) {
        if (event.type === "assignment") {
            const className =
                event.title.toLowerCase().includes("physics")
                    ? "AP Physics"
                    : event.title.toLowerCase().includes("english")
                        ? "English"
                        : "Linear Algebra";

            onOpenAssignment?.(event.title, className);
        }

        if (event.type === "test") {
            const className =
                event.title.toLowerCase().includes("algebra")
                    ? "Linear Algebra"
                    : event.title.toLowerCase().includes("business")
                        ? "AP Business"
                        : "AP Physics";

            onOpenTest?.(className);
        }
    }

    return (
        <View style={styles.screen}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Top navigation */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.backButton}
                        accessibilityRole="button"
                    >
                        <Text style={styles.backArrow}>‹</Text>
                    </TouchableOpacity>

                    <Text style={styles.monthTitle}>
                        {MONTH_NAMES[month]} {year}
                    </Text>

                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.closeButton}
                        accessibilityRole="button"
                    >
                        <Text style={styles.closeText}>×</Text>
                    </TouchableOpacity>
                </View>

                {/* Month navigation */}
                <View style={styles.monthControls}>
                    <TouchableOpacity
                        onPress={() => changeMonth(-1)}
                        style={styles.monthArrowButton}
                    >
                        <Text style={styles.monthArrow}>‹</Text>
                    </TouchableOpacity>

                    <Text style={styles.monthDescription}>
                        Your month at a glance
                    </Text>

                    <TouchableOpacity
                        onPress={() => changeMonth(1)}
                        style={styles.monthArrowButton}
                    >
                        <Text style={styles.monthArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* Calendar */}
                <View style={styles.calendarCard}>
                    <View style={styles.calendarGrid}>
                        {WEEKDAYS.map((day) => (
                            <View
                                key={day}
                                style={styles.dayCell}
                            >
                                <Text style={styles.weekdayText}>
                                    {day}
                                </Text>
                            </View>
                        ))}

                        {calendarDays.map((day, index) => {
                            if (day === null) {
                                return (
                                    <View
                                        key={`empty-${index}`}
                                        style={styles.calendarCell}
                                    />
                                );
                            }

                            const key = dateKey(year, month, day);
                            const dayEvents = events.filter(
                                (event) => event.date === key
                            );
                            const selected = selectedDate === key;

                            return (
                                <TouchableOpacity
                                    key={key}
                                    style={styles.calendarCell}
                                    onPress={() => setSelectedDate(key)}
                                    activeOpacity={0.7}
                                    accessibilityRole="button"
                                    accessibilityLabel={`${MONTH_NAMES[month]} ${day}, ${year}`}
                                >
                                    <View
                                        style={[
                                            styles.dayNumberCircle,
                                            selected &&
                                            styles.selectedDayCircle,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.dayNumber,
                                                selected &&
                                                styles.selectedDayText,
                                            ]}
                                        >
                                            {day}
                                        </Text>
                                    </View>

                                    <View style={styles.eventDots}>
                                        {Array.from(
                                            new Set(
                                                dayEvents.map(
                                                    (event) => event.type
                                                )
                                            )
                                        )
                                            .slice(0, 3)
                                            .map((type) => (
                                                <View
                                                    key={type}
                                                    style={[
                                                        styles.eventDot,
                                                        {
                                                            backgroundColor:
                                                                EVENT_COLORS[type],
                                                        },
                                                    ]}
                                                />
                                            ))}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Selected date details */}
                <View style={styles.selectedDateHeader}>
                    <View>
                        <Text style={styles.sectionEyebrow}>
                            SELECTED DATE
                        </Text>

                        <Text style={styles.sectionTitle}>
                            {MONTH_NAMES[selectedMonthNumber]}{" "}
                            {selectedDayNumber}
                        </Text>
                    </View>

                    <Text style={styles.eventCount}>
                        {selectedEvents.length} events
                    </Text>
                </View>

                {selectedEvents.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>
                            A little breathing room.
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            Nothing planned for this day yet.
                        </Text>
                    </View>
                ) : (
                    selectedEvents.map((event) => (
                        <TouchableOpacity
                            key={event.id}
                            style={styles.eventCard}
                            onPress={() => openEvent(event)}
                            disabled={
                                event.type !== "assignment" &&
                                event.type !== "test"
                            }
                            activeOpacity={0.7}
                        >
                            <View
                                style={[
                                    styles.eventIcon,
                                    {
                                        backgroundColor:
                                            EVENT_COLORS[event.type] + "20",
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.eventIconDot,
                                        {
                                            backgroundColor:
                                                EVENT_COLORS[event.type],
                                        },
                                    ]}
                                />
                            </View>

                            <View style={styles.eventCopy}>
                                <Text style={styles.eventTitle}>
                                    {event.title}
                                </Text>

                                <Text style={styles.eventSubtitle}>
                                    {event.type.charAt(0).toUpperCase() +
                                        event.type.slice(1)}
                                    {event.time
                                        ? ` · ${event.time}`
                                        : ""}
                                </Text>
                            </View>

                            {(event.type === "assignment" ||
                                event.type === "test") && (
                                    <Text style={styles.eventArrow}>
                                        ›
                                    </Text>
                                )}
                        </TouchableOpacity>
                    ))
                )}

                {/* Legend */}
                <View style={styles.legend}>
                    {(
                        [
                            ["class", "Classes"],
                            ["assignment", "Assignments"],
                            ["test", "Tests"],
                            ["commitment", "Commitments"],
                        ] as [EventType, string][]
                    ).map(([type, label]) => (
                        <View key={type} style={styles.legendItem}>
                            <View
                                style={[
                                    styles.legendDot,
                                    {
                                        backgroundColor:
                                            EVENT_COLORS[type],
                                    },
                                ]}
                            />
                            <Text style={styles.legendText}>
                                {label}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Add event */}
                {onAddEvent ? (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={onAddEvent}
                        activeOpacity={0.75}
                    >
                        <Text style={styles.addButtonText}>
                            ＋ Add event
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.disabledAddButton}>
                        <Text style={styles.disabledAddText}>
                            ＋ Add event · Coming soon
                        </Text>
                    </View>
                )}

                <Text style={styles.footerNote}>
                    Your calendar will sync with your real
                    schedule after setup is connected.
                </Text>
            </ScrollView>

            {/* Bottom navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={onOpenPlanner ?? onBack}
                >
                    <Text style={styles.navIconActive}>▦</Text>
                    <Text style={styles.navLabelActive}>
                        Planner
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    disabled={!onOpenTasks}
                    onPress={onOpenTasks}
                >
                    <Text style={styles.navIcon}>☑</Text>
                    <Text style={styles.navLabel}>Tasks</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    disabled={!onAddEvent}
                    onPress={onAddEvent}
                >
                    <Text style={styles.navIcon}>⊕</Text>
                    <Text style={styles.navLabel}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    disabled={!onOpenFocus}
                    onPress={onOpenFocus}
                >
                    <Text style={styles.navIcon}>◷</Text>
                    <Text style={styles.navLabel}>Focus</Text>
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
    content: {
        width: "100%",
        maxWidth: 430,
        alignSelf: "center",
        paddingHorizontal: 23,
        paddingTop: 30,
        paddingBottom: 35,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 22,
    },
    backButton: {
        width: 30,
        height: 32,
        justifyContent: "center",
    },
    backArrow: {
        fontSize: 29,
        color: colors.brand.primary,
    },
    monthTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: colors.brand.dark,
    },
    closeButton: {
        width: 30,
        height: 32,
        alignItems: "flex-end",
        justifyContent: "center",
    },
    closeText: {
        fontSize: 25,
        color: colors.brand.primary,
    },
    monthControls: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
    },
    monthArrowButton: {
        width: 36,
        height: 36,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surface,
    },
    monthArrow: {
        color: colors.brand.primary,
        fontSize: 23,
        fontWeight: "700",
    },
    monthDescription: {
        color: colors.text.secondary,
        fontSize: 12,
    },
    calendarCard: {
        backgroundColor: colors.surface,
        borderRadius: 19,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 17,
        paddingHorizontal: 8,
        marginBottom: 26,
    },
    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    dayCell: {
        width: "14.2857%",
        alignItems: "center",
        paddingBottom: 15,
    },
    weekdayText: {
        fontSize: 10,
        fontWeight: "700",
        color: colors.text.secondary,
    },
    calendarCell: {
        width: "14.2857%",
        height: 58,
        alignItems: "center",
        paddingTop: 5,
    },
    dayNumberCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    selectedDayCircle: {
        backgroundColor: colors.brand.primary,
    },
    dayNumber: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.text.primary,
    },
    selectedDayText: {
        color: "#FFFFFF",
        fontWeight: "800",
    },
    eventDots: {
        flexDirection: "row",
        gap: 3,
        marginTop: 4,
    },
    eventDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    selectedDateHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 13,
    },
    sectionEyebrow: {
        color: colors.text.muted,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.2,
        marginBottom: 5,
    },
    sectionTitle: {
        color: colors.text.primary,
        fontSize: 21,
        fontWeight: "800",
    },
    eventCount: {
        color: colors.text.secondary,
        fontSize: 12,
    },
    emptyCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 15,
        padding: 22,
        marginBottom: 16,
    },
    emptyTitle: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "800",
    },
    emptySubtitle: {
        color: colors.text.secondary,
        fontSize: 12,
        marginTop: 7,
    },
    eventCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        padding: 13,
        marginBottom: 9,
    },
    eventIcon: {
        width: 37,
        height: 37,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    eventIconDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    eventCopy: {
        flex: 1,
    },
    eventTitle: {
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: "800",
    },
    eventSubtitle: {
        color: colors.text.secondary,
        fontSize: 11,
        marginTop: 4,
    },
    eventArrow: {
        color: colors.text.muted,
        fontSize: 23,
    },
    legend: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 15,
        marginTop: 12,
        marginBottom: 23,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    legendDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },
    legendText: {
        color: colors.text.secondary,
        fontSize: 11,
    },
    addButton: {
        height: 50,
        borderWidth: 1,
        borderColor: "#B9DCD1",
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    addButtonText: {
        color: colors.brand.primary,
        fontSize: 14,
        fontWeight: "800",
    },
    disabledAddButton: {
        height: 50,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    disabledAddText: {
        color: colors.text.muted,
        fontSize: 13,
        fontWeight: "700",
    },
    footerNote: {
        color: colors.text.muted,
        fontSize: 11,
        lineHeight: 17,
        textAlign: "center",
        marginTop: 20,
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
        minWidth: 55,
        gap: 4,
    },
    navIconActive: {
        color: colors.brand.primary,
        fontSize: 20,
    },
    navIcon: {
        color: colors.text.muted,
        fontSize: 20,
    },
    navLabelActive: {
        color: colors.brand.primary,
        fontSize: 10,
        fontWeight: "800",
    },
    navLabel: {
        color: colors.text.secondary,
        fontSize: 10,
    },
});
