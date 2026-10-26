
import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../constants/colors';
import type { NewPlannerItem } from './AddNewItemScreen';
import type { ClassItem } from './ConfirmClassesScreen';

type Props = {
    onBack: () => void;
    plannerItems?: NewPlannerItem[];
    classes?: ClassItem[];
};

const PRESETS = [15, 25, 45, 60];

function clock(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

export default function FocusTimerScreen({
    onBack,
    plannerItems = [],
    classes = [],
}: Props) {
    const [duration, setDuration] = useState(25);
    const [secondsLeft, setSecondsLeft] = useState(25 * 60);
    const [running, setRunning] = useState(false);
    const [finished, setFinished] = useState(false);
    const [customMinutes, setCustomMinutes] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [showTasks, setShowTasks] = useState(false);

    const endTimeRef = useRef<number | null>(null);

    const tasks = plannerItems.filter(
        item => item.type !== 'event' && !item.completed
    );

    const selectedTask = tasks.find(
        item => item.id === selectedTaskId
    );

    const selectedClass = classes.find(
        item => item.id === selectedTask?.classId
    );

    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            if (endTimeRef.current === null) return;

            const remaining = Math.max(
                0,
                Math.ceil((endTimeRef.current - Date.now()) / 1000)
            );

            setSecondsLeft(remaining);

            if (remaining === 0) {
                setRunning(false);
                endTimeRef.current = null;
                setFinished(true);
            }
        }, 250);

        return () => clearInterval(interval);
    }, [running]);

    function chooseDuration(minutes: number) {
        setRunning(false);
        setFinished(false);
        endTimeRef.current = null;
        setDuration(minutes);
        setSecondsLeft(minutes * 60);
    }

    function startPause() {
        if (running) {
            if (endTimeRef.current !== null) {
                setSecondsLeft(
                    Math.max(
                        0,
                        Math.ceil((endTimeRef.current - Date.now()) / 1000)
                    )
                );
            }

            setRunning(false);
            endTimeRef.current = null;
            return;
        }

        if (secondsLeft === 0) {
            setSecondsLeft(duration * 60);
            endTimeRef.current = Date.now() + duration * 60 * 1000;
        } else {
            endTimeRef.current = Date.now() + secondsLeft * 1000;
        }

        setFinished(false);
        setRunning(true);
    }

    function reset() {
        chooseDuration(duration);
    }

    function applyCustomMinutes() {
        const value = Number(customMinutes);

        if (
            !Number.isInteger(value) ||
            value < 1 ||
            value > 240
        ) {
            return;
        }

        chooseDuration(value);
        setCustomMinutes('');
    }

    const progress =
        duration > 0
            ? (duration * 60 - secondsLeft) / (duration * 60)
            : 0;

    return (
        <View style={s.screen}>
            <ScrollView
                contentContainerStyle={s.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={s.header}>
                    <Text style={s.logo}>FluxUP</Text>

                    <TouchableOpacity onPress={onBack}>
                        <Text style={s.back}>← Planner</Text>
                    </TouchableOpacity>
                </View>

                <Text style={s.eyebrow}>FOCUS MODE</Text>
                <Text style={s.title}>Time to focus.</Text>
                <Text style={s.subtitle}>
                    One task, one session, one step closer.
                </Text>

                <View style={s.taskCard}>
                    <Text style={s.cardLabel}>WORKING ON</Text>

                    <TouchableOpacity
                        style={s.taskSelector}
                        onPress={() => setShowTasks(value => !value)}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={s.taskTitle}>
                                {selectedTask?.title || 'Choose an assignment'}
                            </Text>

                            <Text style={s.taskSubtitle}>
                                {selectedClass?.name ||
                                    'Or focus without selecting a task'}
                            </Text>
                        </View>

                        <Text style={s.chevron}>
                            {showTasks ? '⌃' : '⌄'}
                        </Text>
                    </TouchableOpacity>

                    {showTasks && (
                        <View style={s.taskList}>
                            <TouchableOpacity
                                style={s.taskOption}
                                onPress={() => {
                                    setSelectedTaskId(null);
                                    setShowTasks(false);
                                }}
                            >
                                <Text style={s.taskOptionText}>
                                    General focus session
                                </Text>
                            </TouchableOpacity>

                            {tasks.map(item => {
                                const course = classes.find(
                                    c => c.id === item.classId
                                );

                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={s.taskOption}
                                        onPress={() => {
                                            setSelectedTaskId(item.id);
                                            setShowTasks(false);
                                        }}
                                    >
                                        <Text style={s.taskOptionText}>
                                            {item.title}
                                        </Text>
                                        <Text style={s.taskOptionMeta}>
                                            {course?.name || 'Coursework'}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>

                <View style={s.timerCard}>
                    <View style={s.timerCircle}>
                        <Text style={s.timerText}>
                            {clock(secondsLeft)}
                        </Text>

                        <Text style={s.timerLabel}>
                            {finished
                                ? 'Session complete'
                                : running
                                    ? 'Stay focused'
                                    : secondsLeft < duration * 60
                                        ? 'Paused'
                                        : 'Ready when you are'}
                        </Text>
                    </View>

                    <View style={s.progressTrack}>
                        <View
                            style={[
                                s.progressFill,
                                { width: `${progress * 100}%` },
                            ]}
                        />
                    </View>

                    <Text style={s.progressText}>
                        {Math.round(progress * 100)}% of session completed
                    </Text>

                    <View style={s.timerActions}>
                        <TouchableOpacity
                            style={s.resetButton}
                            onPress={reset}
                        >
                            <Text style={s.resetText}>
                                Reset
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={s.startButton}
                            onPress={startPause}
                        >
                            <Text style={s.startText}>
                                {running
                                    ? 'Pause'
                                    : secondsLeft < duration * 60 && secondsLeft > 0
                                        ? 'Resume'
                                        : 'Start focus'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={s.sectionTitle}>
                    Focus duration
                </Text>

                <View style={s.presets}>
                    {PRESETS.map(value => (
                        <TouchableOpacity
                            key={value}
                            style={[
                                s.presetButton,
                                duration === value && s.presetSelected,
                            ]}
                            onPress={() => chooseDuration(value)}
                        >
                            <Text
                                style={[
                                    s.presetText,
                                    duration === value && s.presetTextSelected,
                                ]}
                            >
                                {value} min
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={s.customRow}>
                    <TextInput
                        style={s.customInput}
                        placeholder="Custom minutes (1–240)"
                        placeholderTextColor={colors.text.muted}
                        keyboardType="number-pad"
                        value={customMinutes}
                        onChangeText={setCustomMinutes}
                    />

                    <TouchableOpacity
                        style={s.customButton}
                        onPress={applyCustomMinutes}
                    >
                        <Text style={s.customButtonText}>
                            Set
                        </Text>
                    </TouchableOpacity>
                </View>

                {finished && (
                    <View style={s.successCard}>
                        <Text style={s.successTitle}>
                            ✓ Focus session complete!
                        </Text>

                        <Text style={s.successSubtitle}>
                            You completed {duration} minutes of focused time.
                            Take a break before your next session.
                        </Text>
                    </View>
                )}

                <View style={s.tipCard}>
                    <Text style={s.tipTitle}>
                        ✦ Small sessions, real progress.
                    </Text>

                    <Text style={s.tipText}>
                        Choose a realistic duration, focus on one task,
                        and take breaks when you need them.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        width: '100%',
        maxWidth: 620,
        alignSelf: 'center',
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 34,
    },
    logo: {
        color: colors.brand.primary,
        fontSize: 29,
        fontWeight: '800',
    },
    back: {
        color: colors.brand.primary,
        fontSize: 13,
        fontWeight: '700',
    },
    eyebrow: {
        fontSize: 11,
        fontWeight: '800',
        color: colors.brand.primary,
        letterSpacing: 1.3,
        marginBottom: 12,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.text.primary,
    },
    subtitle: {
        fontSize: 14,
        color: colors.text.secondary,
        marginTop: 10,
        marginBottom: 27,
        lineHeight: 22,
    },
    taskCard: {
        backgroundColor: colors.surface,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 17,
        marginBottom: 23,
    },
    cardLabel: {
        color: colors.text.secondary,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 11,
    },
    taskSelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskTitle: {
        color: colors.text.primary,
        fontSize: 15,
        fontWeight: '800',
    },
    taskSubtitle: {
        color: colors.text.secondary,
        fontSize: 12,
        marginTop: 5,
    },
    chevron: {
        color: colors.brand.primary,
        fontSize: 23,
    },
    taskList: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        marginTop: 15,
        paddingTop: 5,
    },
    taskOption: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    taskOptionText: {
        color: colors.text.primary,
        fontSize: 13,
        fontWeight: '700',
    },
    taskOptionMeta: {
        color: colors.text.secondary,
        fontSize: 11,
        marginTop: 4,
    },
    timerCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 23,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 29,
    },
    timerCircle: {
        width: 245,
        height: 245,
        borderRadius: 123,
        borderWidth: 12,
        borderColor: colors.brand.light,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
    },
    timerText: {
        fontSize: 49,
        fontWeight: '800',
        color: colors.text.primary,
        letterSpacing: -1.5,
    },
    timerLabel: {
        color: colors.text.secondary,
        fontSize: 12,
        marginTop: 9,
    },
    progressTrack: {
        height: 9,
        backgroundColor: '#E3EBE4',
        borderRadius: 20,
        width: '100%',
        overflow: 'hidden',
        marginTop: 18,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.brand.primary,
        borderRadius: 20,
    },
    progressText: {
        fontSize: 11,
        color: colors.text.secondary,
        marginTop: 11,
    },
    timerActions: {
        flexDirection: 'row',
        gap: 11,
        width: '100%',
        marginTop: 25,
    },
    resetButton: {
        flex: 1,
        backgroundColor: '#EAF0EA',
        borderRadius: 13,
        paddingVertical: 16,
        alignItems: 'center',
    },
    resetText: {
        color: colors.brand.dark,
        fontSize: 14,
        fontWeight: '800',
    },
    startButton: {
        flex: 2,
        backgroundColor: colors.brand.primary,
        borderRadius: 13,
        paddingVertical: 16,
        alignItems: 'center',
    },
    startText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
    },
    sectionTitle: {
        color: colors.text.primary,
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 14,
    },
    presets: {
        flexDirection: 'row',
        gap: 9,
        marginBottom: 15,
    },
    presetButton: {
        flex: 1,
        backgroundColor: '#EAF0EA',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    presetSelected: {
        backgroundColor: colors.brand.primary,
    },
    presetText: {
        color: colors.brand.dark,
        fontSize: 12,
        fontWeight: '800',
    },
    presetTextSelected: {
        color: '#FFFFFF',
    },
    customRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 25,
    },
    customInput: {
        flex: 1,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 13,
        color: colors.text.primary,
    },
    customButton: {
        backgroundColor: colors.brand.primary,
        borderRadius: 12,
        paddingHorizontal: 25,
        justifyContent: 'center',
    },
    customButtonText: {
        color: '#FFFFFF',
        fontWeight: '800',
    },
    successCard: {
        backgroundColor: '#E4F3E8',
        borderRadius: 15,
        padding: 18,
        marginBottom: 20,
    },
    successTitle: {
        color: colors.brand.dark,
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 8,
    },
    successSubtitle: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 19,
    },
    tipCard: {
        backgroundColor: '#FFF4D9',
        borderRadius: 15,
        padding: 18,
    },
    tipTitle: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: '800',
        marginBottom: 8,
    },
    tipText: {
        color: colors.text.secondary,
        fontSize: 12,
        lineHeight: 20,
    },
});
