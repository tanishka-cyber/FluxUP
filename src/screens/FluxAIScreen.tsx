
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Linking,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { colors } from "../constants/colors";
import type { ClassItem } from "./ConfirmClassesScreen";
import type { Commitment } from "./PlannerScreen";
import type { NewPlannerItem } from "./AddNewItemScreen";

import {
    getFluxResources,
    streamFluxAI,
    type FluxAIMessage,
    type FluxResource,
} from "../services/fluxAI";

type Props = {
    classes: ClassItem[];
    commitments: Commitment[];
    plannerItems: NewPlannerItem[];
    onBack: () => void;
    onOpenPlanner: () => void;
    onOpenTasks: () => void;
    onOpenAIPreview: () => void;
};

type ChatMessage = {
    id: string;
    role: "assistant" | "user";
    text: string;
    resources?: FluxResource[];
    isError?: boolean;
};

const INITIAL_MESSAGE: ChatMessage = {
    id: "welcome",
    role: "assistant",
    text:
        "Hi! I'm Flux AI.\n\n" +
        "I can help you understand school subjects, " +
        "plan assignments, explore colleges and careers, " +
        "and find educational resources.\n\n" +
        "What would you like to work on?",
};

const QUICK_PROMPTS = [
    "Explain eigenvectors with a real-world example",
    "Help me explore colleges for computer science",
    "What should I prioritize this week?",
    "How can I find scholarships?",
];

export default function FluxAIScreen({
    classes,
    commitments,
    plannerItems,
    onBack,
    onOpenPlanner,
    onOpenTasks,
    onOpenAIPreview,
}: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        INITIAL_MESSAGE,
    ]);

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showLatest, setShowLatest] = useState(false);

    const scrollRef = useRef<ScrollView>(null);
    const messagesRef = useRef<ChatMessage[]>([INITIAL_MESSAGE]);

    const requestRef = useRef<AbortController | null>(null);
    const sessionRef = useRef(0);
    const idRef = useRef(0);
    const loadingRef = useRef(false);

    // Smart scrolling state.
    const shouldAutoScrollRef = useRef(true);
    const userScrollingRef = useRef(false);
    const scrollMetricsRef = useRef({
        contentHeight: 0,
        viewportHeight: 0,
        offsetY: 0,
    });

    const hasStartedChat = messages.some(
        (message) => message.role === "user"
    );

    useEffect(() => {
        return () => {
            sessionRef.current += 1;
            requestRef.current?.abort();
        };
    }, []);

    function nextId(prefix: string): string {
        idRef.current += 1;
        return `${prefix}-${idRef.current}`;
    }

    function updateMessages(next: ChatMessage[]) {
        messagesRef.current = next;
        setMessages(next);
    }

    function updateAssistantText(
        id: string,
        text: string
    ) {
        updateMessages(
            messagesRef.current.map((message) =>
                message.id === id
                    ? { ...message, text }
                    : message
            )
        );
    }

    function getContext() {
        return {
            classes: classes.map((item) => ({
                name: item.name,
                period: item.period,
                teacher: item.teacher,
                startTime: item.startTime,
                endTime: item.endTime,
                meetingDays: item.meetingDays,
            })),
            commitments: commitments.map((item) => ({
                name: item.name,
                days: item.days,
                startTime: item.startTime,
                endTime: item.endTime,
            })),
            plannerItems: plannerItems.map((item) => ({
                title: item.title,
                type: item.type,
                dueDate: item.dueDate,
                completed: item.completed,
                priority:
                    "priority" in item
                        ? item.priority
                        : undefined,
            })),
        };
    }

    // --------------------------------------------------
    // SMART SCROLLING
    // --------------------------------------------------

    function scrollToLatest(animated = true) {
        shouldAutoScrollRef.current = true;
        userScrollingRef.current = false;
        setShowLatest(false);

        scrollRef.current?.scrollToEnd({ animated });
    }

    function handleScroll(
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) {
        const {
            contentOffset,
            contentSize,
            layoutMeasurement,
        } = event.nativeEvent;

        const contentHeight = contentSize.height;
        const viewportHeight = layoutMeasurement.height;
        const offsetY = contentOffset.y;

        scrollMetricsRef.current = {
            contentHeight,
            viewportHeight,
            offsetY,
        };

        const distanceFromBottom = Math.max(
            0,
            contentHeight - viewportHeight - offsetY
        );

        const nearBottom = distanceFromBottom < 80;

        // Do not let programmatic scroll events override a
        // user's decision to read earlier messages.
        if (userScrollingRef.current) {
            if (nearBottom) {
                shouldAutoScrollRef.current = true;
                setShowLatest(false);
            } else {
                shouldAutoScrollRef.current = false;
                setShowLatest(true);
            }
        }
    }

    function handleUserScrollStart() {
        userScrollingRef.current = true;
        shouldAutoScrollRef.current = false;
    }

    function handleUserScrollEnd() {
        const {
            contentHeight,
            viewportHeight,
            offsetY,
        } = scrollMetricsRef.current;

        const distanceFromBottom = Math.max(
            0,
            contentHeight - viewportHeight - offsetY
        );

        const nearBottom = distanceFromBottom < 80;

        shouldAutoScrollRef.current = nearBottom;
        setShowLatest(!nearBottom);
        userScrollingRef.current = false;
    }

    function handleContentSizeChange(
        _width: number,
        height: number
    ) {
        scrollMetricsRef.current.contentHeight = height;

        if (
            shouldAutoScrollRef.current &&
            !userScrollingRef.current
        ) {
            // No animation while streaming.
            // This prevents repeated animated jumps.
            scrollRef.current?.scrollToEnd({
                animated: false,
            });
        }
    }

    // --------------------------------------------------
    // AI CHAT
    // --------------------------------------------------

    async function sendMessage(value?: string) {
        const question = (value ?? input).trim();

        if (!question || loadingRef.current) return;

        loadingRef.current = true;
        setIsLoading(true);

        const session = sessionRef.current;
        const controller = new AbortController();

        requestRef.current = controller;

        const userMessage: ChatMessage = {
            id: nextId("user"),
            role: "user",
            text: question,
        };

        const assistantId = nextId("assistant");
        const resources = getFluxResources(question);

        const history: FluxAIMessage[] = [
            ...messagesRef.current
                .filter(
                    (message) =>
                        message.id !== "welcome" &&
                        !message.isError &&
                        message.text.trim().length > 0
                )
                .map((message) => ({
                    role: message.role,
                    content: message.text,
                })),
            {
                role: "user",
                content: question,
            },
        ];

        // New questions should initially be visible.
        shouldAutoScrollRef.current = true;
        userScrollingRef.current = false;
        setShowLatest(false);

        updateMessages([
            ...messagesRef.current,
            userMessage,
            {
                id: assistantId,
                role: "assistant",
                text: "",
                resources,
            },
        ]);

        setInput("");

        try {
            const answer = await streamFluxAI(
                history,
                getContext(),
                (partialAnswer) => {
                    if (session !== sessionRef.current) return;

                    updateAssistantText(
                        assistantId,
                        partialAnswer
                    );
                },
                controller.signal
            );

            if (session !== sessionRef.current) return;

            updateAssistantText(assistantId, answer);
        } catch (error) {
            if (
                session !== sessionRef.current ||
                controller.signal.aborted
            ) {
                return;
            }

            const errorText =
                error instanceof Error
                    ? error.message
                    : "Something unexpected happened.";

            console.error("Flux AI error:", error);

            updateMessages(
                messagesRef.current.map((message) =>
                    message.id === assistantId
                        ? {
                            ...message,
                            text:
                                message.text.trim() ||
                                `I couldn't generate a response.\n\n${errorText}`,
                            isError: !message.text.trim(),
                        }
                        : message
                )
            );
        } finally {
            if (session === sessionRef.current) {
                loadingRef.current = false;
                setIsLoading(false);
                requestRef.current = null;
            }
        }
    }

    function stopGenerating() {
        if (!loadingRef.current) return;

        sessionRef.current += 1;
        requestRef.current?.abort();
        requestRef.current = null;

        loadingRef.current = false;
        setIsLoading(false);

        updateMessages(
            messagesRef.current.map((message) =>
                message.role === "assistant" &&
                    !message.text.trim()
                    ? {
                        ...message,
                        text: "Response stopped.",
                        isError: true,
                    }
                    : message
            )
        );
    }

    function startNewChat() {
        sessionRef.current += 1;

        requestRef.current?.abort();
        requestRef.current = null;

        loadingRef.current = false;
        setIsLoading(false);

        shouldAutoScrollRef.current = true;
        userScrollingRef.current = false;
        setShowLatest(false);

        updateMessages([INITIAL_MESSAGE]);
        setInput("");

        scrollRef.current?.scrollTo({
            y: 0,
            animated: false,
        });
    }

    async function openResource(url: string) {
        try {
            await Linking.openURL(url);
        } catch {
            console.error("Could not open resource:", url);
        }
    }

    function renderResources(resources: FluxResource[]) {
        if (resources.length === 0) return null;

        return (
            <View style={styles.resources}>
                <Text style={styles.resourcesTitle}>
                    EXPLORE RESOURCES
                </Text>

                {resources.map((resource) => (
                    <TouchableOpacity
                        key={resource.url}
                        style={styles.resourceCard}
                        onPress={() => openResource(resource.url)}
                        accessibilityRole="link"
                    >
                        <View style={styles.resourceText}>
                            <Text style={styles.resourceTitle}>
                                {resource.title}
                            </Text>

                            <Text style={styles.resourceDescription}>
                                {resource.description}
                            </Text>
                        </View>

                        <Text style={styles.resourceArrow}>↗</Text>
                    </TouchableOpacity>
                ))}

                <Text style={styles.resourceDisclaimer}>
                    These are trusted starting points, not live
                    search results. Verify current information.
                </Text>
            </View>
        );
    }

    // --------------------------------------------------
    // SCREEN
    // --------------------------------------------------

    return (
        <KeyboardAvoidingView
            style={styles.page}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.container}>
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.backButton}
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                    >
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>
                            ✦ Flux AI
                        </Text>

                        <Text style={styles.headerSubtitle}>
                            Learn · Plan · Explore
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={startNewChat}
                        style={styles.newChatButton}
                    >
                        <Text style={styles.newChatText}>
                            New chat
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* CHAT AREA */}
                <ScrollView
                    ref={scrollRef}
                    style={styles.chatScroll}
                    contentContainerStyle={styles.chatContent}
                    keyboardShouldPersistTaps="handled"
                    scrollEventThrottle={16}
                    onScroll={handleScroll}
                    onScrollBeginDrag={handleUserScrollStart}
                    onScrollEndDrag={handleUserScrollEnd}
                    onMomentumScrollEnd={handleUserScrollEnd}
                    onContentSizeChange={handleContentSizeChange}
                >
                    {!hasStartedChat && (
                        <View style={styles.intro}>
                            <View style={styles.aiIcon}>
                                <Text style={styles.aiIconText}>✦</Text>
                            </View>

                            <Text style={styles.introTitle}>
                                Your next step starts here.
                            </Text>

                            <Text style={styles.introSubtitle}>
                                Get help with school, explore colleges,
                                discover resources, and make smarter plans.
                            </Text>
                        </View>
                    )}

                    {/* MESSAGES */}
                    {messages.map((message) => {
                        const isUser = message.role === "user";

                        return (
                            <View key={message.id}>
                                <View
                                    style={[
                                        styles.messageRow,
                                        isUser && styles.userMessageRow,
                                    ]}
                                >
                                    {!isUser && (
                                        <View style={styles.messageAvatar}>
                                            <Text style={styles.avatarText}>
                                                ✦
                                            </Text>
                                        </View>
                                    )}

                                    <View
                                        style={[
                                            styles.messageBubble,
                                            isUser
                                                ? styles.userBubble
                                                : styles.assistantBubble,
                                        ]}
                                    >
                                        {message.text ? (
                                            <Text
                                                style={[
                                                    styles.messageText,
                                                    isUser && styles.userMessageText,
                                                ]}
                                                selectable
                                            >
                                                {message.text}
                                            </Text>
                                        ) : (
                                            <View style={styles.loadingBubble}>
                                                <ActivityIndicator
                                                    size="small"
                                                    color={colors.brand.primary}
                                                />

                                                <Text style={styles.loadingText}>
                                                    Flux AI is thinking...
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {!isUser &&
                                    message.resources &&
                                    renderResources(message.resources)}
                            </View>
                        );
                    })}

                    {/* WELCOME ACTIONS */}
                    {!hasStartedChat && (
                        <>
                            <Text style={styles.quickTitle}>
                                SUGGESTED QUESTIONS
                            </Text>

                            <View style={styles.quickPromptContainer}>
                                {QUICK_PROMPTS.map((prompt) => (
                                    <TouchableOpacity
                                        key={prompt}
                                        style={styles.quickPrompt}
                                        onPress={() => sendMessage(prompt)}
                                    >
                                        <Text style={styles.quickPromptText}>
                                            {prompt} ↗
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* SCHEDULE ASSISTANT */}
                            <View style={styles.previewCard}>
                                <View style={styles.previewTop}>
                                    <View style={styles.previewIcon}>
                                        <Text style={styles.previewIconText}>
                                            ✦
                                        </Text>
                                    </View>

                                    <View style={styles.previewCopy}>
                                        <Text style={styles.previewEyebrow}>
                                            SCHEDULE ASSISTANT
                                        </Text>

                                        <Text style={styles.previewTitle}>
                                            A better plan for your day.
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.previewDescription}>
                                    Explore example scheduling adjustments,
                                    compare before-and-after times, and
                                    decide which suggestions to approve.
                                </Text>

                                <View style={styles.demoBadge}>
                                    <Text style={styles.demoBadgeText}>
                                        Demo suggestions
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.previewButton}
                                    onPress={onOpenAIPreview}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.previewButtonText}>
                                        Preview Schedule Changes →
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* NAVIGATION */}
                            <View style={styles.shortcuts}>
                                <TouchableOpacity
                                    style={styles.shortcutButton}
                                    onPress={onOpenPlanner}
                                >
                                    <Text style={styles.shortcutText}>
                                        ◫ Planner
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.shortcutButton}
                                    onPress={onOpenTasks}
                                >
                                    <Text style={styles.shortcutText}>
                                        ✓ Tasks
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </ScrollView>

                {/* RETURN TO BOTTOM BUTTON */}
                {showLatest && (
                    <TouchableOpacity
                        style={styles.latestButton}
                        onPress={() => scrollToLatest()}
                        accessibilityRole="button"
                        accessibilityLabel="Scroll to latest message"
                    >
                        <Text style={styles.latestButtonText}>
                            ↓ Latest
                        </Text>
                    </TouchableOpacity>
                )}

                {/* MESSAGE INPUT */}
                <View style={styles.composer}>
                    <TextInput
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Ask Flux anything..."
                        placeholderTextColor={colors.text.muted}
                        multiline
                        maxLength={2000}
                        editable={!isLoading}
                    />

                    {isLoading ? (
                        <TouchableOpacity
                            style={styles.stopButton}
                            onPress={stopGenerating}
                            accessibilityRole="button"
                            accessibilityLabel="Stop generating"
                        >
                            <Text style={styles.stopText}>■</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                !input.trim() && styles.sendDisabled,
                            ]}
                            onPress={() => sendMessage()}
                            disabled={!input.trim()}
                            accessibilityRole="button"
                            accessibilityLabel="Send message"
                        >
                            <Text style={styles.sendText}>↑</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.disclaimer}>
                    Local AI · Verify important information
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#F3F3EF",
    },
    container: {
        flex: 1,
        width: "100%",
        maxWidth: 430,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 19,
        paddingVertical: 18,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: 5,
        marginRight: 12,
    },
    backArrow: {
        fontSize: 24,
        color: colors.text.primary,
    },
    headerCenter: {
        flex: 1,
    },
    headerTitle: {
        color: colors.brand.primary,
        fontSize: 20,
        fontWeight: "800",
    },
    headerSubtitle: {
        color: colors.text.secondary,
        fontSize: 11,
        marginTop: 3,
    },
    newChatButton: {
        backgroundColor: "#EDF5F0",
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 10,
    },
    newChatText: {
        color: colors.brand.dark,
        fontSize: 12,
        fontWeight: "700",
    },
    chatScroll: {
        flex: 1,
    },
    chatContent: {
        paddingHorizontal: 19,
        paddingTop: 24,
        paddingBottom: 25,
    },
    intro: {
        alignItems: "center",
        marginBottom: 27,
    },
    aiIcon: {
        width: 58,
        height: 58,
        borderRadius: 19,
        backgroundColor: "#E6F2E9",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },
    aiIconText: {
        fontSize: 29,
        color: colors.brand.primary,
    },
    introTitle: {
        fontSize: 23,
        fontWeight: "800",
        color: colors.text.primary,
        letterSpacing: -0.6,
        textAlign: "center",
        marginBottom: 9,
    },
    introSubtitle: {
        fontSize: 13,
        lineHeight: 20,
        textAlign: "center",
        color: colors.text.secondary,
    },
    messageRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 17,
    },
    userMessageRow: {
        justifyContent: "flex-end",
    },
    messageAvatar: {
        width: 29,
        height: 29,
        borderRadius: 11,
        backgroundColor: "#E5F2E8",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    avatarText: {
        fontSize: 16,
        color: colors.brand.primary,
    },
    messageBubble: {
        maxWidth: "84%",
        paddingHorizontal: 15,
        paddingVertical: 13,
        borderRadius: 17,
    },
    assistantBubble: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: colors.border,
        borderBottomLeftRadius: 5,
    },
    userBubble: {
        backgroundColor: colors.brand.primary,
        borderBottomRightRadius: 5,
    },
    messageText: {
        color: colors.text.primary,
        fontSize: 13,
        lineHeight: 21,
    },
    userMessageText: {
        color: "#FFFFFF",
    },
    loadingBubble: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    loadingText: {
        color: colors.text.secondary,
        fontSize: 12,
        fontWeight: "600",
    },
    quickTitle: {
        color: colors.text.secondary,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1,
        marginTop: 12,
        marginBottom: 12,
    },
    quickPromptContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 9,
        marginBottom: 27,
    },
    quickPrompt: {
        borderWidth: 1,
        borderColor: "#D5E5DA",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    quickPromptText: {
        color: colors.brand.dark,
        fontSize: 12,
        fontWeight: "600",
    },
    previewCard: {
        backgroundColor: "#EAF5EE",
        borderRadius: 19,
        padding: 19,
        marginBottom: 22,
        borderWidth: 1,
        borderColor: "#D2E7D8",
    },
    previewTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    previewIcon: {
        width: 43,
        height: 43,
        borderRadius: 14,
        backgroundColor: "#D4EBDC",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    previewIconText: {
        fontSize: 23,
        color: colors.brand.primary,
    },
    previewCopy: {
        flex: 1,
    },
    previewEyebrow: {
        fontSize: 10,
        color: colors.brand.primary,
        fontWeight: "800",
        letterSpacing: 0.7,
        marginBottom: 5,
    },
    previewTitle: {
        fontSize: 16,
        color: colors.text.primary,
        fontWeight: "800",
    },
    previewDescription: {
        fontSize: 12,
        lineHeight: 20,
        color: colors.text.secondary,
        marginBottom: 12,
    },
    demoBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginBottom: 15,
    },
    demoBadgeText: {
        fontSize: 10,
        color: colors.brand.dark,
        fontWeight: "700",
    },
    previewButton: {
        backgroundColor: colors.brand.primary,
        borderRadius: 13,
        paddingVertical: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    previewButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "800",
    },
    shortcuts: {
        flexDirection: "row",
        gap: 11,
    },
    shortcutButton: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 15,
        borderRadius: 13,
        alignItems: "center",
    },
    shortcutText: {
        color: colors.brand.dark,
        fontSize: 13,
        fontWeight: "700",
    },
    resources: {
        marginLeft: 37,
        marginBottom: 19,
        gap: 8,
    },
    resourcesTitle: {
        color: colors.text.secondary,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1,
        marginBottom: 2,
    },
    resourceCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D5E5DA",
        borderRadius: 12,
        padding: 12,
    },
    resourceText: {
        flex: 1,
    },
    resourceTitle: {
        color: colors.brand.dark,
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 4,
    },
    resourceDescription: {
        color: colors.text.secondary,
        fontSize: 11,
        lineHeight: 16,
    },
    resourceArrow: {
        color: colors.brand.primary,
        fontSize: 19,
        marginLeft: 9,
    },
    resourceDisclaimer: {
        color: colors.text.muted,
        fontSize: 10,
        lineHeight: 15,
    },
    latestButton: {
        position: "absolute",
        bottom: 100,
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D5E5DA",
        borderRadius: 22,
        paddingHorizontal: 18,
        paddingVertical: 11,
        elevation: 4,
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        zIndex: 10,
    },
    latestButtonText: {
        color: colors.brand.primary,
        fontSize: 12,
        fontWeight: "700",
    },
    composer: {
        flexDirection: "row",
        alignItems: "flex-end",
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingHorizontal: 15,
        paddingTop: 12,
        paddingBottom: 8,
        gap: 10,
    },
    input: {
        flex: 1,
        minHeight: 44,
        maxHeight: 115,
        backgroundColor: "#F5F7F4",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 15,
        paddingHorizontal: 14,
        paddingVertical: 11,
        color: colors.text.primary,
        fontSize: 13,
        textAlignVertical: "top",
    },
    sendButton: {
        width: 43,
        height: 43,
        borderRadius: 14,
        backgroundColor: colors.brand.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    sendDisabled: {
        backgroundColor: "#B8CEC0",
    },
    sendText: {
        color: "#FFFFFF",
        fontSize: 23,
        fontWeight: "800",
    },
    stopButton: {
        width: 43,
        height: 43,
        borderRadius: 14,
        backgroundColor: "#B56B58",
        alignItems: "center",
        justifyContent: "center",
    },
    stopText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "800",
    },
    disclaimer: {
        backgroundColor: "#FFFFFF",
        color: colors.text.muted,
        fontSize: 10,
        textAlign: "center",
        paddingBottom: 11,
        paddingTop: 3,
    },
});
