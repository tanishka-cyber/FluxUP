
import React, { useRef, useState } from "react";
import {
    KeyboardAvoidingView,
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
};

const INITIAL_MESSAGE: ChatMessage = {
    id: "welcome",
    role: "assistant",
    text:
        "Hey! I'm Flux AI, your personal planning assistant.\n\n" +
        "I can help you organize assignments, review your " +
        "commitments, and decide what to work on next.\n\n" +
        "What's on your mind?",
};

const QUICK_PROMPTS = [
    "What should I prioritize?",
    "What assignments do I have?",
    "Help me plan my week",
    "Review my schedule",
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
    const scrollRef = useRef<ScrollView>(null);
    const messageIdRef = useRef(0);

    function generateResponse(question: string): string {
        const query = question.toLowerCase();

        const unfinished = plannerItems.filter(
            (item) => !item.completed
        );

        // Safely check priority without assuming it exists
        // on every NewPlannerItem.
        const highPriority = unfinished.filter((item) => {
            if ("priority" in item) {
                return item.priority === "High";
            }
            return false;
        });

        if (
            query.includes("priorit") ||
            query.includes("what should i do") ||
            query.includes("focus")
        ) {
            if (highPriority.length > 0) {
                return (
                    "Here's where I'd start:\n\n" +
                    highPriority
                        .slice(0, 5)
                        .map(
                            (item, index) =>
                                `${index + 1}. ${item.title}`
                        )
                        .join("\n") +
                    "\n\nThese are marked high priority. " +
                    "Check their deadlines before deciding the order."
                );
            }

            if (unfinished.length > 0) {
                return (
                    `You have ${unfinished.length} unfinished item(s).\n\n` +
                    unfinished
                        .slice(0, 5)
                        .map(
                            (item, index) =>
                                `${index + 1}. ${item.title}`
                        )
                        .join("\n") +
                    "\n\nStart with the most urgent deadline, " +
                    "then work on the task requiring the most focus."
                );
            }

            return (
                "You don't have any unfinished manually added " +
                "tasks recorded in Flux yet.\n\n" +
                "Try adding your assignments to the Planner " +
                "so I can help you prioritize them."
            );
        }

        if (
            query.includes("assignment") ||
            query.includes("homework") ||
            query.includes("deadline") ||
            query.includes("due")
        ) {
            const assignments = unfinished.filter(
                (item) => item.type === "assignment"
            );

            if (assignments.length === 0) {
                return (
                    "I don't see any unfinished manually added " +
                    "assignments in your current Flux data.\n\n" +
                    "You can add assignments from your Planner."
                );
            }

            return (
                "Here are your unfinished assignments:\n\n" +
                assignments
                    .slice(0, 8)
                    .map(
                        (item, index) =>
                            `${index + 1}. ${item.title}\n` +
                            `Due: ${item.dueDate || "Not specified"}`
                    )
                    .join("\n\n")
            );
        }

        if (
            query.includes("week") ||
            query.includes("plan my day") ||
            query.includes("organize")
        ) {
            return (
                "Here's a simple planning strategy:\n\n" +
                "1. Check your upcoming deadlines.\n" +
                "2. Identify your fixed commitments.\n" +
                "3. Choose your most important task.\n" +
                "4. Reserve a realistic study block.\n" +
                "5. Leave room for breaks and unexpected work.\n\n" +
                `You currently have ${unfinished.length} unfinished ` +
                `manually added task(s) and ${commitments.length} ` +
                "saved commitment(s).\n\n" +
                "You can also preview example schedule changes below."
            );
        }

        if (
            query.includes("schedule") ||
            query.includes("commitment") ||
            query.includes("busy")
        ) {
            if (commitments.length === 0) {
                return (
                    "I don't see any extracurricular commitments " +
                    "saved yet.\n\n" +
                    "Add your regular activities to Flux so your " +
                    "Planner can account for them."
                );
            }

            return (
                "Here are your saved commitments:\n\n" +
                commitments
                    .slice(0, 8)
                    .map(
                        (item, index) =>
                            `${index + 1}. ${item.name}\n` +
                            `${item.days.join(", ")}\n` +
                            `${item.startTime} - ${item.endTime}`
                    )
                    .join("\n\n") +
                "\n\nUse the schedule preview to explore " +
                "example adjustments."
            );
        }

        if (
            query.includes("class") ||
            query.includes("course") ||
            query.includes("subject")
        ) {
            return (
                "Your saved classes are:\n\n" +
                (classes.length
                    ? classes
                        .map(
                            (item, index) =>
                                `${index + 1}. ${item.name}`
                        )
                        .join("\n")
                    : "No classes saved yet.") +
                "\n\nI can help you think through which " +
                "class needs attention first."
            );
        }

        if (
            query.includes("hello") ||
            query.includes("hey") ||
            query === "hi"
        ) {
            return (
                "Hey! What would you like help with today?\n\n" +
                "We can review your tasks, plan your week, " +
                "or look at schedule suggestions."
            );
        }

        return (
            "I can currently help with your saved classes, " +
            "commitments, assignments, and planning priorities.\n\n" +
            "This version uses local responses rather than " +
            "a connected AI model. Once we integrate the " +
            "backend, Flux AI will support broader questions " +
            "about academics, college, technology, and more."
        );
    }

    function sendMessage(value?: string) {
        const question = (value ?? input).trim();
        if (!question) return;

        messageIdRef.current += 1;
        const userId = `user-${messageIdRef.current}`;

        messageIdRef.current += 1;
        const assistantId = `assistant-${messageIdRef.current}`;

        const response = generateResponse(question);

        setMessages((current) => [
            ...current,
            { id: userId, role: "user", text: question },
            { id: assistantId, role: "assistant", text: response },
        ]);

        setInput("");
    }

    function startNewChat() {
        setMessages([INITIAL_MESSAGE]);
        setInput("");
    }

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
                        <Text style={styles.headerTitle}>✦ Flux AI</Text>
                        <Text style={styles.headerSubtitle}>
                            Your planning assistant
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={startNewChat}
                        style={styles.newChatButton}
                    >
                        <Text style={styles.newChatText}>New chat</Text>
                    </TouchableOpacity>
                </View>

                {/* CHAT */}
                <ScrollView
                    ref={scrollRef}
                    style={styles.chatScroll}
                    contentContainerStyle={styles.chatContent}
                    keyboardShouldPersistTaps="handled"
                    onContentSizeChange={() =>
                        scrollRef.current?.scrollToEnd({ animated: true })
                    }
                >
                    <View style={styles.intro}>
                        <View style={styles.aiIcon}>
                            <Text style={styles.aiIconText}>✦</Text>
                        </View>
                        <Text style={styles.introTitle}>
                            Make room for what matters.
                        </Text>
                        <Text style={styles.introSubtitle}>
                            Ask questions, organize your work,
                            and explore smarter ways to plan.
                        </Text>
                    </View>

                    {messages.map((message) => {
                        const isUser = message.role === "user";

                        return (
                            <View
                                key={message.id}
                                style={[
                                    styles.messageRow,
                                    isUser && styles.userMessageRow,
                                ]}
                            >
                                {!isUser && (
                                    <View style={styles.messageAvatar}>
                                        <Text style={styles.avatarText}>✦</Text>
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
                                    <Text
                                        style={[
                                            styles.messageText,
                                            isUser && styles.userMessageText,
                                        ]}
                                    >
                                        {message.text}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}

                    {/* QUICK PROMPTS */}
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

                    {/* SCREEN 24 ENTRY */}
                    <View style={styles.previewCard}>
                        <View style={styles.previewTop}>
                            <View style={styles.previewIcon}>
                                <Text style={styles.previewIconText}>✦</Text>
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

                    {/* NAVIGATION SHORTCUTS */}
                    <View style={styles.shortcuts}>
                        <TouchableOpacity
                            style={styles.shortcutButton}
                            onPress={onOpenPlanner}
                        >
                            <Text style={styles.shortcutText}>◫ Planner</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.shortcutButton}
                            onPress={onOpenTasks}
                        >
                            <Text style={styles.shortcutText}>✓ Tasks</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* MESSAGE COMPOSER */}
                <View style={styles.composer}>
                    <TextInput
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Ask Flux anything..."
                        placeholderTextColor={colors.text.muted}
                        multiline
                        maxLength={2000}
                    />

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
                </View>

                <Text style={styles.disclaimer}>
                    Prototype assistant · AI backend coming later
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
    disclaimer: {
        backgroundColor: "#FFFFFF",
        color: colors.text.muted,
        fontSize: 10,
        textAlign: "center",
        paddingBottom: 11,
        paddingTop: 3,
    },
});
