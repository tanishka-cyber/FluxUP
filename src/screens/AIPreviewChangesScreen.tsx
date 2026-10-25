
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { colors } from "../constants/colors";

// ==========================================
// TYPES
// ==========================================

export type AIChange = {
    id: string;
    title: string;
    category: string;
    originalTime: string;
    suggestedTime: string;
    reason: string;
    color: string;
};

type Props = {
    changes?: AIChange[];
    onBack: () => void;
    onApplyChanges: (changes: AIChange[]) => void;
    onKeepOriginal: () => void;
};

// ==========================================
// DEMO DATA
// ==========================================

// These suggestions are examples.
// The backend will eventually generate them
// using real schedule information.

export const DEMO_AI_CHANGES: AIChange[] = [
    {
        id: "1",
        title: "Physics Review",
        category: "AP Physics",
        originalTime: "4:00 PM",
        suggestedTime: "5:30 PM",
        reason:
            "Moving this study session later creates more space " +
            "after your school commitments.",
        color: "#DDEBFF",
    },
    {
        id: "2",
        title: "Linear Algebra Problem Set",
        category: "Linear Algebra",
        originalTime: "7:00 PM",
        suggestedTime: "4:00 PM",
        reason:
            "Completing a challenging assignment earlier " +
            "may help you stay focused before the evening.",
        color: "#EAE1FF",
    },
    {
        id: "3",
        title: "Business Assignment",
        category: "AP Business",
        originalTime: "8:30 PM",
        suggestedTime: "7:00 PM",
        reason:
            "This gives you a more comfortable window " +
            "to finish your work before the end of the day.",
        color: "#E0F3E6",
    },
];

// ==========================================
// MAIN SCREEN
// ==========================================

export default function AIPreviewChangesScreen({
    changes = DEMO_AI_CHANGES,
    onBack,
    onApplyChanges,
    onKeepOriginal,
}: Props) {
    const [selectedIds, setSelectedIds] = useState<string[]>(
        () => changes.map((change) => change.id)
    );

    const [expandedIds, setExpandedIds] = useState<string[]>(
        () => changes.map((change) => change.id)
    );

    // ========================================
    // SELECT / DESELECT CHANGES
    // ========================================

    function toggleSelection(id: string) {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    }

    // ========================================
    // EXPAND / COLLAPSE EXPLANATIONS
    // ========================================

    function toggleExpanded(id: string) {
        setExpandedIds((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    }

    // ========================================
    // APPLY SELECTED CHANGES
    // ========================================

    function applyChanges() {
        const selectedChanges = changes.filter((change) =>
            selectedIds.includes(change.id)
        );

        if (selectedChanges.length === 0) {
            return;
        }

        onApplyChanges(selectedChanges);
    }

    const selectedCount = changes.filter((change) =>
        selectedIds.includes(change.id)
    ).length;

    // ========================================
    // RENDER
    // ========================================

    return (
        <View style={styles.page}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}

                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.backButton}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                    >
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>

                    <Text style={styles.logo}>Flux</Text>

                    <View style={styles.headerBadge}>
                        <Text style={styles.headerBadgeText}>
                            ✦ AI PREVIEW
                        </Text>
                    </View>
                </View>

                {/* HERO */}

                <View style={styles.hero}>
                    <View style={styles.heroIcon}>
                        <Text style={styles.heroIconText}>✦</Text>
                    </View>

                    <Text style={styles.eyebrow}>
                        YOUR SCHEDULE, REIMAGINED
                    </Text>

                    <Text style={styles.title}>
                        A better plan for your day.
                    </Text>

                    <Text style={styles.subtitle}>
                        Flux found a few ways to reorganize your
                        schedule. Review each suggestion and
                        decide what works for you.
                    </Text>
                </View>

                {/* SUMMARY */}

                <View style={styles.summaryCard}>
                    <View style={styles.summaryIcon}>
                        <Text style={styles.summaryIconText}>✓</Text>
                    </View>

                    <View style={styles.summaryCopy}>
                        <Text style={styles.summaryTitle}>
                            {changes.length} suggested changes
                        </Text>

                        <Text style={styles.summaryDescription}>
                            {selectedCount} selected for approval
                        </Text>
                    </View>
                </View>

                {/* SECTION HEADER */}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Review suggestions
                    </Text>

                    <TouchableOpacity
                        onPress={() => {
                            if (selectedCount === changes.length) {
                                setSelectedIds([]);
                            } else {
                                setSelectedIds(
                                    changes.map((change) => change.id)
                                );
                            }
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.selectAllText}>
                            {selectedCount === changes.length
                                ? "Deselect all"
                                : "Select all"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* SUGGESTED CHANGES */}

                {changes.map((change, index) => {
                    const selected = selectedIds.includes(change.id);
                    const expanded = expandedIds.includes(change.id);

                    return (
                        <View
                            key={change.id}
                            style={[
                                styles.changeCard,
                                selected && styles.changeCardSelected,
                            ]}
                        >
                            {/* CARD HEADER */}

                            <View style={styles.changeHeader}>
                                <View
                                    style={[
                                        styles.changeNumber,
                                        {
                                            backgroundColor: change.color,
                                        },
                                    ]}
                                >
                                    <Text style={styles.changeNumberText}>
                                        {index + 1}
                                    </Text>
                                </View>

                                <View style={styles.changeTitleGroup}>
                                    <Text style={styles.changeCategory}>
                                        {change.category.toUpperCase()}
                                    </Text>

                                    <Text style={styles.changeTitle}>
                                        {change.title}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.checkbox,
                                        selected && styles.checkboxSelected,
                                    ]}
                                    onPress={() =>
                                        toggleSelection(change.id)
                                    }
                                    accessibilityRole="checkbox"
                                    accessibilityState={{ checked: selected }}
                                    accessibilityLabel={`Select ${change.title}`}
                                >
                                    {selected && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* BEFORE / AFTER */}

                            <View style={styles.comparison}>
                                <View style={styles.timeColumn}>
                                    <Text style={styles.timeLabel}>
                                        BEFORE
                                    </Text>

                                    <Text style={styles.originalTime}>
                                        {change.originalTime}
                                    </Text>

                                    <Text style={styles.timeCaption}>
                                        Original time
                                    </Text>
                                </View>

                                <View style={styles.arrowCircle}>
                                    <Text style={styles.arrowText}>→</Text>
                                </View>

                                <View style={styles.timeColumn}>
                                    <Text style={styles.timeLabel}>
                                        AFTER
                                    </Text>

                                    <Text style={styles.suggestedTime}>
                                        {change.suggestedTime}
                                    </Text>

                                    <Text style={styles.timeCaption}>
                                        Suggested time
                                    </Text>
                                </View>
                            </View>

                            {/* REASON */}

                            <TouchableOpacity
                                style={styles.reasonToggle}
                                onPress={() =>
                                    toggleExpanded(change.id)
                                }
                                activeOpacity={0.7}
                            >
                                <Text style={styles.reasonToggleText}>
                                    ✦ Why this change?
                                </Text>

                                <Text style={styles.expandIcon}>
                                    {expanded ? "−" : "+"}
                                </Text>
                            </TouchableOpacity>

                            {expanded && (
                                <View style={styles.reasonBox}>
                                    <Text style={styles.reasonText}>
                                        {change.reason}
                                    </Text>
                                </View>
                            )}

                            {/* SELECTION STATUS */}

                            <View style={styles.selectionFooter}>
                                <Text
                                    style={[
                                        styles.selectionText,
                                        selected && styles.selectionTextActive,
                                    ]}
                                >
                                    {selected
                                        ? "✓ Selected for approval"
                                        : "Not selected"}
                                </Text>
                            </View>
                        </View>
                    );
                })}

                {/* NO SUGGESTIONS */}

                {changes.length === 0 && (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>
                            No changes to review
                        </Text>

                        <Text style={styles.emptyDescription}>
                            When Flux suggests schedule changes,
                            they'll appear here.
                        </Text>
                    </View>
                )}

                {/* PRIVACY / CONTROL NOTICE */}

                <View style={styles.noticeCard}>
                    <Text style={styles.noticeIcon}>✦</Text>

                    <View style={styles.noticeCopy}>
                        <Text style={styles.noticeTitle}>
                            You're always in control.
                        </Text>

                        <Text style={styles.noticeDescription}>
                            Flux won't change your schedule without
                            your approval. You can accept some
                            suggestions, all of them, or none.
                        </Text>
                    </View>
                </View>

                {/* APPLY BUTTON */}

                <TouchableOpacity
                    style={[
                        styles.applyButton,
                        selectedCount === 0 &&
                        styles.applyButtonDisabled,
                    ]}
                    onPress={applyChanges}
                    disabled={selectedCount === 0}
                    activeOpacity={0.85}
                >
                    <Text style={styles.applyButtonText}>
                        Apply {selectedCount}{" "}
                        {selectedCount === 1 ? "change" : "changes"} →
                    </Text>
                </TouchableOpacity>

                {/* KEEP ORIGINAL */}

                <TouchableOpacity
                    style={styles.keepButton}
                    onPress={onKeepOriginal}
                    activeOpacity={0.75}
                >
                    <Text style={styles.keepButtonText}>
                        Keep original schedule
                    </Text>
                </TouchableOpacity>

                <Text style={styles.footer}>
                    Built around your schedule, your priorities,
                    and your decisions.
                </Text>
            </ScrollView>
        </View>
    );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
    page: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        backgroundColor: "#F3F3EF",
    },

    scroll: {
        width: "100%",
        maxWidth: 430,
        backgroundColor: colors.background,
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 25,
        paddingBottom: 38,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
    },

    backButton: {
        marginRight: 13,
        padding: 5,
    },

    backArrow: {
        color: colors.text.primary,
        fontSize: 25,
    },

    logo: {
        color: colors.brand.primary,
        fontSize: 25,
        fontWeight: "800",
        letterSpacing: -1,
        flex: 1,
    },

    headerBadge: {
        backgroundColor: "#EAF5EE",
        paddingHorizontal: 11,
        paddingVertical: 7,
        borderRadius: 20,
    },

    headerBadgeText: {
        color: colors.brand.primary,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 0.6,
    },

    hero: {
        alignItems: "center",
        marginBottom: 25,
    },

    heroIcon: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: "#EAF5EE",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },

    heroIconText: {
        color: colors.brand.primary,
        fontSize: 31,
    },

    eyebrow: {
        color: colors.brand.primary,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.1,
        marginBottom: 10,
    },

    title: {
        color: colors.text.primary,
        fontSize: 29,
        fontWeight: "800",
        letterSpacing: -1,
        lineHeight: 35,
        textAlign: "center",
        marginBottom: 12,
    },

    subtitle: {
        color: colors.text.secondary,
        fontSize: 13,
        lineHeight: 21,
        textAlign: "center",
    },

    summaryCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EAF5EE",
        borderRadius: 17,
        padding: 16,
        marginBottom: 27,
    },

    summaryIcon: {
        width: 39,
        height: 39,
        borderRadius: 13,
        backgroundColor: "#D1EBD8",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    summaryIconText: {
        color: "#367A55",
        fontSize: 20,
        fontWeight: "800",
    },

    summaryCopy: {
        flex: 1,
    },

    summaryTitle: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 4,
    },

    summaryDescription: {
        color: colors.text.secondary,
        fontSize: 12,
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },

    sectionTitle: {
        color: colors.text.primary,
        fontSize: 18,
        fontWeight: "800",
    },

    selectAllText: {
        color: colors.brand.primary,
        fontSize: 12,
        fontWeight: "700",
    },

    changeCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 19,
        padding: 17,
        marginBottom: 15,
    },

    changeCardSelected: {
        borderColor: "#A9D4BB",
    },

    changeHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    changeNumber: {
        width: 37,
        height: 37,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 11,
    },

    changeNumberText: {
        color: colors.text.primary,
        fontSize: 15,
        fontWeight: "800",
    },

    changeTitleGroup: {
        flex: 1,
    },

    changeCategory: {
        color: colors.text.secondary,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 0.6,
        marginBottom: 5,
    },

    changeTitle: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "800",
    },

    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: "#A9B8AE",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
    },

    checkboxSelected: {
        backgroundColor: colors.brand.primary,
        borderColor: colors.brand.primary,
    },

    checkmark: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "800",
    },

    comparison: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F6F8F5",
        borderRadius: 14,
        padding: 13,
        marginBottom: 15,
    },

    timeColumn: {
        flex: 1,
        alignItems: "center",
    },

    timeLabel: {
        color: colors.text.secondary,
        fontSize: 9,
        fontWeight: "800",
        letterSpacing: 1,
        marginBottom: 9,
    },

    originalTime: {
        color: colors.text.primary,
        fontSize: 17,
        fontWeight: "800",
    },

    suggestedTime: {
        color: colors.brand.primary,
        fontSize: 17,
        fontWeight: "800",
    },

    timeCaption: {
        color: colors.text.muted,
        fontSize: 10,
        marginTop: 6,
    },

    arrowCircle: {
        width: 31,
        height: 31,
        borderRadius: 16,
        backgroundColor: "#E3EEE7",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 5,
    },

    arrowText: {
        color: colors.brand.primary,
        fontSize: 18,
        fontWeight: "800",
    },

    reasonToggle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 6,
    },

    reasonToggleText: {
        color: colors.brand.dark,
        fontSize: 12,
        fontWeight: "800",
    },

    expandIcon: {
        color: colors.brand.primary,
        fontSize: 19,
    },

    reasonBox: {
        backgroundColor: "#F4F8F4",
        borderRadius: 11,
        padding: 12,
        marginTop: 8,
    },

    reasonText: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 19,
    },

    selectionFooter: {
        borderTopWidth: 1,
        borderTopColor: "#EDF0ED",
        marginTop: 15,
        paddingTop: 12,
    },

    selectionText: {
        color: colors.text.muted,
        fontSize: 11,
        fontWeight: "700",
    },

    selectionTextActive: {
        color: colors.brand.primary,
    },

    emptyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },

    emptyTitle: {
        color: colors.text.primary,
        fontSize: 15,
        fontWeight: "800",
        marginBottom: 7,
    },

    emptyDescription: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 19,
    },

    noticeCard: {
        flexDirection: "row",
        backgroundColor: "#FFF4D9",
        borderRadius: 16,
        padding: 16,
        marginTop: 10,
        marginBottom: 25,
    },

    noticeIcon: {
        color: "#A47C2C",
        fontSize: 23,
        marginRight: 12,
    },

    noticeCopy: {
        flex: 1,
    },

    noticeTitle: {
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: "800",
        marginBottom: 5,
    },

    noticeDescription: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 19,
    },

    applyButton: {
        minHeight: 55,
        borderRadius: 15,
        backgroundColor: colors.brand.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    applyButtonDisabled: {
        backgroundColor: "#BDD7CC",
    },

    applyButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
    },

    keepButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18,
    },

    keepButtonText: {
        color: colors.text.secondary,
        fontSize: 13,
        fontWeight: "700",
    },

    footer: {
        color: colors.text.muted,
        fontSize: 11,
        textAlign: "center",
        lineHeight: 18,
        marginTop: 6,
    },
});
