
import React from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { colors } from "../constants/colors";

type MoreScreenProps = {
    onBack: () => void;
    onOpenProfile: () => void;
    onUpdateSchedule: () => void;
    onOpenAI: () => void;
    onOpenNotifications: () => void;
    onOpenConnectedAccounts: () => void;
    onLogout: () => void;
};

type MenuItemProps = {
    icon: string;
    title: string;
    subtitle: string;
    color: string;
    onPress: () => void;
    last?: boolean;
};

function MenuItem({
    icon,
    title,
    subtitle,
    color,
    onPress,
    last = false,
}: MenuItemProps) {
    return (
        <TouchableOpacity
            style={[
                styles.menuItem,
                !last && styles.menuItemBorder,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View
                style={[
                    styles.menuIconBox,
                    { backgroundColor: color },
                ]}
            >
                <Text style={styles.menuIcon}>{icon}</Text>
            </View>

            <View style={styles.menuCopy}>
                <Text style={styles.menuTitle}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>

            <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
    );
}

export default function MoreScreen({
    onBack,
    onOpenProfile,
    onUpdateSchedule,
    onOpenAI,
    onOpenNotifications,
    onOpenConnectedAccounts,
    onLogout,
}: MoreScreenProps) {
    return (
        <View style={styles.screen}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}

                <View style={styles.topRow}>
                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.backButton}
                    >
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>

                    <Text style={styles.logo}>Flux</Text>
                </View>

                <Text style={styles.eyebrow}>YOUR SPACE</Text>

                <Text style={styles.heading}>
                    Make Flux yours.
                </Text>

                <Text style={styles.subtitle}>
                    Your schedule, your preferences, your way.
                    Everything you need to personalize Flux
                    lives here.
                </Text>

                {/* PROFILE CARD */}

                <TouchableOpacity
                    style={styles.profileCard}
                    onPress={onOpenProfile}
                    activeOpacity={0.8}
                >
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>T</Text>
                    </View>

                    <View style={styles.profileCopy}>
                        <Text style={styles.profileName}>
                            My profile
                        </Text>

                        <Text style={styles.profileDescription}>
                            View and edit your student information
                        </Text>
                    </View>

                    <Text style={styles.profileArrow}>›</Text>
                </TouchableOpacity>

                {/* PLANNING */}

                <Text style={styles.sectionLabel}>
                    PLANNING & ORGANIZATION
                </Text>

                <View style={styles.menuCard}>
                    <MenuItem
                        icon="▦"
                        title="Update my schedule"
                        subtitle="Classes, periods, and commitments"
                        color={colors.blocks.blue}
                        onPress={onUpdateSchedule}
                    />

                    <MenuItem
                        icon="✦"
                        title="Flux AI assistant"
                        subtitle="Get help organizing your day"
                        color={colors.blocks.purple}
                        onPress={onOpenAI}
                        last
                    />
                </View>

                {/* PREFERENCES */}

                <Text style={styles.sectionLabel}>
                    PREFERENCES
                </Text>

                <View style={styles.menuCard}>
                    <MenuItem
                        icon="♧"
                        title="Notifications"
                        subtitle="Reminders and deadline alerts"
                        color={colors.blocks.yellow}
                        onPress={onOpenNotifications}
                    />

                    <MenuItem
                        icon="↗"
                        title="Connected accounts"
                        subtitle="Manage Google Classroom"
                        color={colors.blocks.green}
                        onPress={onOpenConnectedAccounts}
                        last
                    />
                </View>

                {/* SUPPORT */}

                <Text style={styles.sectionLabel}>
                    SUPPORT
                </Text>

                <View style={styles.menuCard}>
                    <MenuItem
                        icon="?"
                        title="Help & support"
                        subtitle="Questions, feedback, and guidance"
                        color={colors.blocks.pink}
                        onPress={() =>
                            Alert.alert(
                                "Help & support",
                                "Help and support will be available soon."
                            )
                        }
                        last
                    />
                </View>

                {/* LOG OUT */}

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={onLogout}
                    activeOpacity={0.75}
                >
                    <Text style={styles.logoutText}>
                        Log out
                    </Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerLogo}>Flux</Text>

                    <Text style={styles.footerText}>
                        A little more flow, every day.
                    </Text>

                    <Text style={styles.version}>
                        Version 1.0 · Prototype
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F3F3EF",
        alignItems: "center",
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
    backButton: {
        paddingVertical: 8,
        paddingRight: 15,
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
        lineHeight: 37,
        marginBottom: 12,
    },
    subtitle: {
        color: colors.text.secondary,
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 27,
    },
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E4F3EB",
        borderRadius: 19,
        padding: 18,
        marginBottom: 30,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.brand.primary,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
    },
    avatarText: {
        color: "#FFFFFF",
        fontSize: 21,
        fontWeight: "800",
    },
    profileCopy: {
        flex: 1,
    },
    profileName: {
        color: colors.text.primary,
        fontSize: 16,
        fontWeight: "800",
        marginBottom: 5,
    },
    profileDescription: {
        color: colors.text.secondary,
        fontSize: 11,
        lineHeight: 17,
    },
    profileArrow: {
        color: colors.brand.dark,
        fontSize: 26,
        marginLeft: 8,
    },
    sectionLabel: {
        color: colors.text.secondary,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.2,
        marginBottom: 12,
    },
    menuCard: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 17,
        paddingHorizontal: 15,
        marginBottom: 28,
        overflow: "hidden",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    menuIconBox: {
        width: 42,
        height: 42,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
    },
    menuIcon: {
        color: colors.text.primary,
        fontSize: 20,
        fontWeight: "700",
    },
    menuCopy: {
        flex: 1,
    },
    menuTitle: {
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: "800",
        marginBottom: 5,
    },
    menuSubtitle: {
        color: colors.text.secondary,
        fontSize: 11,
        lineHeight: 16,
    },
    chevron: {
        color: colors.text.muted,
        fontSize: 23,
        marginLeft: 8,
    },
    logoutButton: {
        borderWidth: 1,
        borderColor: "#F0CFCB",
        backgroundColor: "#FFF4F2",
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 51,
        marginTop: 2,
    },
    logoutText: {
        color: "#BD6059",
        fontSize: 14,
        fontWeight: "800",
    },
    footer: {
        alignItems: "center",
        marginTop: 36,
    },
    footerLogo: {
        color: colors.brand.primary,
        fontSize: 20,
        fontWeight: "800",
        letterSpacing: -1,
        marginBottom: 7,
    },
    footerText: {
        color: colors.text.secondary,
        fontSize: 11,
    },
    version: {
        color: colors.text.muted,
        fontSize: 10,
        marginTop: 12,
    },
});
