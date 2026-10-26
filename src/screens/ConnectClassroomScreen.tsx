import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { colors } from "../constants/colors";

type ConnectClassroomScreenProps = {
    onBack: () => void;
    onConnect: () => void;
    onSkip: () => void;
};

export default function ConnectClassroomScreen({
    onBack,
    onConnect,
    onSkip,
}: ConnectClassroomScreenProps) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <View style={styles.page}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.logo}>FluxUP</Text>

                <View style={styles.progressRow}>
                    <View style={styles.progressComplete} />
                    <View style={styles.progressComplete} />
                    <View style={styles.progressActive} />
                    <View style={styles.progressInactive} />
                </View>

                <Text style={styles.stepLabel}>STEP 3 OF 4</Text>

                <View style={styles.illustration}>
                    <View style={styles.decorCircle} />
                    <View style={styles.googleCard}>
                        <View style={styles.googleIcon}>
                            <Text style={styles.googleIconText}>G</Text>
                        </View>
                        <Text style={styles.googleLabel}>CLASSROOM</Text>
                    </View>

                    <View style={styles.connectorLine}>
                        <View style={styles.connectorDot} />
                        <View style={styles.connectorDot} />
                        <View style={styles.connectorDot} />
                    </View>

                    <View style={styles.fluxCard}>
                        <Text style={styles.fluxCardText}>FluxUP</Text>
                    </View>
                </View>

                <Text style={styles.title}>Your coursework, all in one place.</Text>

                <Text style={styles.subtitle}>
                    Connect Google Classroom to bring your classes and assignments into
                    Flux. We'll use your coursework to help build a more realistic study
                    schedule.
                </Text>

                <View style={styles.benefits}>
                    <View style={styles.benefitRow}>
                        <View style={[styles.benefitIcon, { backgroundColor: "#DDF4EA" }]}>
                            <Text style={styles.benefitEmoji}>✓</Text>
                        </View>
                        <View style={styles.benefitCopy}>
                            <Text style={styles.benefitTitle}>Import assignments</Text>
                            <Text style={styles.benefitDescription}>
                                Bring in available coursework and due dates.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.benefitRow}>
                        <View style={[styles.benefitIcon, { backgroundColor: "#DDEBFA" }]}>
                            <Text style={styles.benefitEmoji}>◷</Text>
                        </View>
                        <View style={styles.benefitCopy}>
                            <Text style={styles.benefitTitle}>Plan around deadlines</Text>
                            <Text style={styles.benefitDescription}>
                                Make room for upcoming assignments and tests.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.benefitRow}>
                        <View style={[styles.benefitIcon, { backgroundColor: "#F7E6C9" }]}>
                            <Text style={styles.benefitEmoji}>✦</Text>
                        </View>
                        <View style={styles.benefitCopy}>
                            <Text style={styles.benefitTitle}>Adapt as work changes</Text>
                            <Text style={styles.benefitDescription}>
                                Update your plan when new coursework appears.
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.privacyCard}>
                    <Text style={styles.privacyIcon}>⌑</Text>
                    <View style={styles.privacyCopy}>
                        <Text style={styles.privacyTitle}>Your account, your choice</Text>
                        <Text style={styles.privacyDescription}>
                            You choose whether to connect. You can manage connected apps
                            later in settings.
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowDetails(!showDetails)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.learnMore}>
                                {showDetails ? "Show less" : "Learn more"}
                            </Text>
                        </TouchableOpacity>

                        {showDetails && (
                            <Text style={styles.detailsText}>
                                Google account authorization and permission settings will be
                                implemented before this connection is enabled. Flux should
                                only request the access it needs.
                            </Text>
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.connectButton}
                    onPress={onConnect}
                    activeOpacity={0.85}
                >
                    <Text style={styles.connectButtonText}>
                        Connect Google Classroom →
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={onSkip}
                    activeOpacity={0.7}
                >
                    <Text style={styles.skipText}>I'll do this later</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBack}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

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
        paddingHorizontal: 28,
        paddingTop: 38,
        paddingBottom: 35,
    },
    logo: {
        color: colors.brand.primary,
        fontSize: 27,
        fontWeight: "800",
        letterSpacing: -1.2,
        marginBottom: 30,
    },
    progressRow: {
        flexDirection: "row",
        gap: 7,
        marginBottom: 12,
    },
    progressComplete: {
        flex: 1,
        height: 5,
        borderRadius: 10,
        backgroundColor: colors.brand.primary,
    },
    progressActive: {
        flex: 1,
        height: 5,
        borderRadius: 10,
        backgroundColor: colors.brand.light,
        borderWidth: 1,
        borderColor: colors.brand.primary,
    },
    progressInactive: {
        flex: 1,
        height: 5,
        borderRadius: 10,
        backgroundColor: "#E7EBE7",
    },
    stepLabel: {
        color: colors.text.secondary,
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1.3,
        marginBottom: 17,
    },
    illustration: {
        height: 155,
        borderRadius: 22,
        backgroundColor: "#F1F7F0",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 25,
        overflow: "hidden",
    },
    decorCircle: {
        position: "absolute",
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: "#E1EFE2",
        top: -90,
        right: -25,
    },
    googleCard: {
        width: 95,
        height: 94,
        borderRadius: 17,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#E4EBE4",
    },
    googleIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: "#E8F0FE",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    googleIconText: {
        color: "#4285F4",
        fontSize: 24,
        fontWeight: "800",
    },
    googleLabel: {
        color: colors.text.secondary,
        fontSize: 8,
        fontWeight: "800",
        letterSpacing: 0.7,
    },
    connectorLine: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        width: 48,
        borderTopWidth: 2,
        borderColor: "#9CCAB4",
    },
    connectorDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: colors.brand.primary,
        marginTop: -3,
    },
    fluxCard: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
    },
    fluxCardText: {
        color: "#087F70",
        fontSize: 25,
        fontWeight: "800",
        letterSpacing: -1,
    },
    sparkle: {
        color: "#DDF4EA",
        fontSize: 16,
        position: "absolute",
        top: 9,
        right: 10,
    },
    title: {
        color: colors.text.primary,
        fontSize: 30,
        fontWeight: "700",
        letterSpacing: -1,
        lineHeight: 37,
        marginBottom: 12,
    },
    subtitle: {
        color: colors.text.secondary,
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 25,
    },
    benefits: {
        gap: 18,
        marginBottom: 24,
    },
    benefitRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    benefitIcon: {
        width: 43,
        height: 43,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
    },
    benefitEmoji: {
        color: colors.text.primary,
        fontSize: 19,
        fontWeight: "700",
    },
    benefitCopy: {
        flex: 1,
    },
    benefitTitle: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 4,
    },
    benefitDescription: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 18,
    },
    privacyCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#FFF4D9",
        borderRadius: 16,
        padding: 15,
        marginBottom: 22,
    },
    privacyIcon: {
        color: "#94712B",
        fontSize: 22,
        marginRight: 12,
    },
    privacyCopy: {
        flex: 1,
    },
    privacyTitle: {
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 5,
    },
    privacyDescription: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 18,
    },
    learnMore: {
        color: colors.brand.dark,
        fontSize: 12,
        fontWeight: "700",
        marginTop: 8,
    },
    detailsText: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 8,
    },
    connectButton: {
        minHeight: 54,
        borderRadius: 15,
        backgroundColor: colors.brand.primary,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 12,
    },
    connectButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
    skipButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
    },
    skipText: {
        color: colors.brand.dark,
        fontSize: 14,
        fontWeight: "600",
    },
    backButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 7,
    },
    backText: {
        color: colors.text.secondary,
        fontSize: 13,
        fontWeight: "600",
    },
});