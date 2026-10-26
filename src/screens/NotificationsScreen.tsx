
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { colors } from "../constants/colors";

type Category =
    | "assignment"
    | "test"
    | "schedule"
    | "commitment"
    | "system";

type Destination = "planner" | "tasks" | "none";

export type FluxNotification = {
    id: string;
    title: string;
    description: string;
    time: string;
    category: Category;
    read: boolean;
    destination: Destination;
};

type Props = {
    onBack: () => void;
    onOpenPlanner: () => void;
    onOpenTasks: () => void;
    onOpenSettings: () => void;
};

const DEMO_NOTIFICATIONS: FluxNotification[] = [
    {
        id: "1",
        title: "Assignment deadline approaching",
        description:
            "Your Linear Algebra problem set is due tomorrow. Review your progress.",
        time: "10 minutes ago",
        category: "assignment",
        read: false,
        destination: "tasks",
    },
    {
        id: "2",
        title: "Upcoming Physics test",
        description:
            "You have a Physics unit review test coming up. Check your study tasks.",
        time: "1 hour ago",
        category: "test",
        read: false,
        destination: "tasks",
    },
    {
        id: "3",
        title: "Your schedule is ready",
        description:
            "Review your classes and extracurricular commitments in your Planner.",
        time: "Earlier today",
        category: "schedule",
        read: false,
        destination: "planner",
    },
    {
        id: "4",
        title: "Extracurricular reminder",
        description:
            "Review your upcoming club meetings and commitments.",
        time: "Yesterday",
        category: "commitment",
        read: true,
        destination: "planner",
    },
    {
        id: "5",
        title: "Welcome to FluxUP",
        description:
            "Your space for classes, assignments, and everything in between is ready.",
        time: "Earlier",
        category: "system",
        read: true,
        destination: "none",
    },
];

const CATEGORY_INFO: Record<
    Category,
    { icon: string; background: string; color: string; label: string }
> = {
    assignment: {
        icon: "✎",
        background: "#E4EDFF",
        color: "#4868A8",
        label: "Assignment",
    },
    test: {
        icon: "◇",
        background: "#F0E6FF",
        color: "#8057B0",
        label: "Test",
    },
    schedule: {
        icon: "▦",
        background: "#E0F2E6",
        color: "#397A55",
        label: "Schedule",
    },
    commitment: {
        icon: "☆",
        background: "#FFF0D6",
        color: "#A27635",
        label: "Commitment",
    },
    system: {
        icon: "✦",
        background: "#EDF0EC",
        color: "#64746A",
        label: "Flux",
    },
};

export default function NotificationsScreen({
    onBack,
    onOpenPlanner,
    onOpenTasks,
    onOpenSettings,
}: Props) {
    const [notifications, setNotifications] =
        useState<FluxNotification[]>(
            DEMO_NOTIFICATIONS.map((item) => ({ ...item }))
        );

    const [filter, setFilter] =
        useState<"All" | "Unread">("All");

    const unreadCount = notifications.filter(
        (item) => !item.read
    ).length;

    const visible = notifications.filter(
        (item) => filter === "All" || !item.read
    );

    function markRead(id: string) {
        setNotifications((current) =>
            current.map((item) =>
                item.id === id ? { ...item, read: true } : item
            )
        );
    }

    function openNotification(item: FluxNotification) {
        markRead(item.id);
        if (item.destination === "planner") onOpenPlanner();
        if (item.destination === "tasks") onOpenTasks();
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
                        style={styles.headerButton}
                        onPress={onBack}
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                    >
                        <Text style={styles.backArrow}>‹</Text>
                    </TouchableOpacity>

                    <Text style={styles.logo}>FluxUP</Text>

                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={onOpenSettings}
                        accessibilityRole="button"
                        accessibilityLabel="Notification settings"
                    >
                        <Text style={styles.settingsIcon}>⚙</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.eyebrow}>STAY IN THE LOOP</Text>
                <Text style={styles.title}>Notifications</Text>
                <Text style={styles.subtitle}>
                    The important things, all in one place.
                </Text>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryIcon}>
                        <Text style={styles.summarySymbol}>✦</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.summaryTitle}>
                            {unreadCount === 0
                                ? "You're all caught up!"
                                : `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"
                                }`}
                        </Text>
                        <Text style={styles.summaryDescription}>
                            {unreadCount === 0
                                ? "Everything is looking good."
                                : "A quick check can help you stay ahead."}
                        </Text>
                    </View>
                </View>

                <View style={styles.demoBanner}>
                    <Text style={styles.demoText}>
                        ✦ Demo notifications. Real reminders will be
                        connected to your assignments and schedule later.
                    </Text>
                </View>

                <View style={styles.controls}>
                    <View style={styles.filters}>
                        {(["All", "Unread"] as const).map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.filterButton,
                                    filter === option && styles.activeFilter,
                                ]}
                                onPress={() => setFilter(option)}
                            >
                                <Text
                                    style={[
                                        styles.filterText,
                                        filter === option && styles.activeFilterText,
                                    ]}
                                >
                                    {option}
                                    {option === "Unread" && unreadCount > 0
                                        ? ` (${unreadCount})`
                                        : ""}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {unreadCount > 0 && (
                        <TouchableOpacity
                            onPress={() =>
                                setNotifications((current) =>
                                    current.map((item) => ({
                                        ...item,
                                        read: true,
                                    }))
                                )
                            }
                        >
                            <Text style={styles.markAll}>Mark all read</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.sectionTitle}>
                    {filter === "All" ? "Your updates" : "Unread updates"}
                </Text>

                {visible.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyIcon}>✓</Text>
                        <Text style={styles.emptyTitle}>
                            Nothing new right now
                        </Text>
                        <Text style={styles.emptyDescription}>
                            You're caught up on your notifications.
                        </Text>
                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() => setFilter("All")}
                        >
                            <Text style={styles.emptyButtonText}>
                                View all notifications
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    visible.map((item) => {
                        const info = CATEGORY_INFO[item.category];

                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.notificationCard,
                                    !item.read && styles.unreadCard,
                                ]}
                                onPress={() => openNotification(item)}
                                activeOpacity={0.8}
                                accessibilityRole="button"
                            >
                                <View
                                    style={[
                                        styles.categoryIcon,
                                        { backgroundColor: info.background },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.categorySymbol,
                                            { color: info.color },
                                        ]}
                                    >
                                        {info.icon}
                                    </Text>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={styles.notificationTop}>
                                        <Text style={styles.categoryLabel}>
                                            {info.label.toUpperCase()}
                                        </Text>
                                        {!item.read && (
                                            <View style={styles.unreadDot} />
                                        )}
                                    </View>

                                    <Text style={styles.notificationTitle}>
                                        {item.title}
                                    </Text>

                                    <Text style={styles.notificationDescription}>
                                        {item.description}
                                    </Text>

                                    <View style={styles.notificationFooter}>
                                        <Text style={styles.notificationTime}>
                                            {item.time}
                                        </Text>

                                        {item.destination !== "none" && (
                                            <Text style={styles.viewLink}>
                                                {item.destination === "tasks"
                                                    ? "View tasks ›"
                                                    : "Open Planner ›"}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}

                <TouchableOpacity
                    style={styles.preferencesCard}
                    onPress={onOpenSettings}
                >
                    <View style={styles.preferencesIcon}>
                        <Text style={styles.preferencesSymbol}>⚙</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.preferencesTitle}>
                            Make notifications yours
                        </Text>
                        <Text style={styles.preferencesDescription}>
                            Choose reminders, timing, and quiet hours.
                        </Text>
                    </View>

                    <Text style={styles.preferencesArrow}>›</Text>
                </TouchableOpacity>

                <Text style={styles.footer}>
                    A little reminder can make a big difference.
                </Text>
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
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 35,
    },
    headerButton: {
        width: 40,
        height: 40,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
    },
    backArrow: {
        color: colors.text.primary,
        fontSize: 29,
        marginTop: -4,
    },
    settingsIcon: {
        fontSize: 22,
        color: colors.brand.dark,
    },
    logo: {
        color: colors.brand.primary,
        fontSize: 25,
        fontWeight: "800",
        letterSpacing: -1,
    },
    eyebrow: {
        color: colors.brand.primary,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.3,
        marginBottom: 10,
    },
    title: {
        color: colors.text.primary,
        fontSize: 31,
        fontWeight: "800",
        letterSpacing: -1,
    },
    subtitle: {
        color: colors.text.secondary,
        fontSize: 13,
        marginTop: 9,
        marginBottom: 23,
    },
    summaryCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EAF5EE",
        borderRadius: 18,
        padding: 17,
        marginBottom: 14,
        gap: 12,
    },
    summaryIcon: {
        width: 43,
        height: 43,
        borderRadius: 14,
        backgroundColor: "#D1EBD8",
        alignItems: "center",
        justifyContent: "center",
    },
    summarySymbol: {
        color: colors.brand.primary,
        fontSize: 23,
    },
    summaryTitle: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 5,
    },
    summaryDescription: {
        color: colors.text.secondary,
        fontSize: 11,
        lineHeight: 17,
    },
    demoBanner: {
        backgroundColor: "#FFF5DF",
        borderRadius: 11,
        padding: 12,
        marginBottom: 27,
    },
    demoText: {
        color: "#866A3C",
        fontSize: 11,
        lineHeight: 17,
    },
    controls: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        marginBottom: 24,
    },
    filters: {
        flexDirection: "row",
        backgroundColor: "#EBEFEB",
        padding: 4,
        borderRadius: 12,
    },
    filterButton: {
        paddingHorizontal: 13,
        paddingVertical: 9,
        borderRadius: 9,
    },
    activeFilter: {
        backgroundColor: "#FFFFFF",
    },
    filterText: {
        fontSize: 12,
        color: colors.text.secondary,
        fontWeight: "700",
    },
    activeFilterText: {
        color: colors.brand.dark,
        fontWeight: "800",
    },
    markAll: {
        color: colors.brand.primary,
        fontSize: 11,
        fontWeight: "800",
    },
    sectionTitle: {
        color: colors.text.primary,
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 15,
    },
    notificationCard: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 15,
        marginBottom: 11,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 12,
    },
    unreadCard: {
        backgroundColor: "#FBFEFC",
        borderColor: "#BEDBC9",
    },
    categoryIcon: {
        width: 39,
        height: 39,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    categorySymbol: {
        fontSize: 22,
        fontWeight: "700",
    },
    notificationTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 7,
    },
    categoryLabel: {
        color: colors.text.secondary,
        fontSize: 9,
        fontWeight: "800",
        letterSpacing: 0.8,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.brand.primary,
    },
    notificationTitle: {
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: "800",
        marginBottom: 6,
    },
    notificationDescription: {
        color: colors.text.secondary,
        fontSize: 11,
        lineHeight: 18,
    },
    notificationFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
    },
    notificationTime: {
        color: colors.text.muted,
        fontSize: 10,
    },
    viewLink: {
        color: colors.brand.primary,
        fontSize: 10,
        fontWeight: "800",
    },
    emptyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 30,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
    },
    emptyIcon: {
        color: colors.brand.primary,
        fontSize: 31,
        marginBottom: 12,
    },
    emptyTitle: {
        color: colors.text.primary,
        fontSize: 16,
        fontWeight: "800",
    },
    emptyDescription: {
        color: colors.text.secondary,
        fontSize: 12,
        textAlign: "center",
        marginTop: 8,
    },
    emptyButton: {
        backgroundColor: "#EAF5EE",
        borderRadius: 12,
        padding: 12,
        marginTop: 18,
    },
    emptyButtonText: {
        color: colors.brand.primary,
        fontSize: 12,
        fontWeight: "800",
    },
    preferencesCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EAF5EE",
        borderRadius: 16,
        padding: 17,
        gap: 12,
        marginTop: 22,
    },
    preferencesIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#D1EBD8",
        alignItems: "center",
        justifyContent: "center",
    },
    preferencesSymbol: {
        fontSize: 21,
        color: colors.brand.dark,
    },
    preferencesTitle: {
        fontSize: 13,
        fontWeight: "800",
        color: colors.text.primary,
        marginBottom: 5,
    },
    preferencesDescription: {
        fontSize: 11,
        lineHeight: 17,
        color: colors.text.secondary,
    },
    preferencesArrow: {
        fontSize: 23,
        color: colors.brand.primary,
    },
    footer: {
        color: colors.text.muted,
        textAlign: "center",
        fontSize: 11,
        marginTop: 27,
    },
});
