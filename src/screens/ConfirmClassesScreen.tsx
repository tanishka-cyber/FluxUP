
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../constants/colors";

import type {
  ScheduleExtractionResult,
  ExtractedClass,
  Weekday,
} from "../types/schedule";

export type ClassItem = {
  id: string;
  name: string;
  teacher: string;
  period: string;
  color: string;
  startTime?: string;
  endTime?: string;
  kind?: "class" | "free" | "lunch";
  semester?: 1 | 2;
  meetingDays?: Weekday[];
};

const PALETTE = [
  colors.blocks.blue,
  colors.blocks.purple,
  colors.blocks.green,
  colors.blocks.pink,
  colors.blocks.yellow,
  colors.blocks.orange,
];

const WEEKDAYS: { value: Weekday; label: string }[] = [
  { value: "M", label: "M" },
  { value: "T", label: "T" },
  { value: "W", label: "W" },
  { value: "R", label: "Th" },
  { value: "F", label: "F" },
];

export const DEFAULT_CLASSES: ClassItem[] = [
  "AP Physics",
  "Linear Algebra",
  "AP Business",
  "English",
].map((name, index) => ({
  id: `demo-${index + 1}`,
  name,
  teacher: "",
  period: `Period ${index + 1}`,
  color: PALETTE[index % PALETTE.length],
  startTime: "",
  endTime: "",
  kind: "class",
  semester: 1,
  meetingDays: [],
}));

type Props = {
  onBack: () => void;
  onContinue: (classes: ClassItem[]) => void;
  initialClasses?: ClassItem[];
  extraction?: ScheduleExtractionResult | null;
};

function notify(message: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.alert(message);
    }
  } else {
    Alert.alert("Check your schedule", message);
  }
}

function displayTime(time: string | null): string {
  if (!time) return "";

  const match = time.match(/^(\d{2}):(\d{2})$/);

  if (!match) return time;

  const hour = Number(match[1]);
  const minute = match[2];
  const meridiem = hour >= 12 ? "PM" : "AM";

  return `${hour % 12 || 12}:${minute} ${meridiem}`;
}

function toMinutes(value: string): number | null {
  const match = value
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour < 1 || hour > 12 || minute > 59) {
    return null;
  }

  if (hour === 12) hour = 0;
  if (match[3].toUpperCase() === "PM") hour += 12;

  return hour * 60 + minute;
}

function convertExtractedClass(
  item: ExtractedClass,
  index: number
): ClassItem {
  return {
    id: item.id,
    name: item.name,
    teacher: item.teacher ?? "",
    period: item.period ?? "",
    startTime: displayTime(item.startTime),
    endTime: displayTime(item.endTime),
    color: PALETTE[index % PALETTE.length],
    kind: item.kind,
    semester: item.semester ?? 1,
    meetingDays: [...(item.meetingDays ?? [])],
  };
}

function periodSortValue(period: string): number {
  if (/home\s*room|homeroom/i.test(period)) {
    return 4.5;
  }

  const match = period.match(/period\s*(\d+)/i);

  return match ? Number(match[1]) : 99;
}

export default function ConfirmClassesScreen({
  onBack,
  onContinue,
  initialClasses = DEFAULT_CLASSES,
  extraction = null,
}: Props) {
  const [semester, setSemester] = useState<1 | 2>(1);

  const [classes, setClasses] = useState<ClassItem[]>(() => {
    if (extraction) {
      return extraction.semesters.flatMap((section) =>
        section.classes.map((item, index) =>
          convertExtractedClass(item, index)
        )
      );
    }

    if (
      initialClasses.length > 0 &&
      initialClasses.some(
        (item) => !item.id.startsWith("demo-")
      )
    ) {
      return initialClasses.map((item) => ({
        ...item,
        meetingDays: [...(item.meetingDays ?? [])],
      }));
    }

    return [
      {
        id: "manual-1",
        name: "",
        teacher: "",
        period: "Period 1",
        color: PALETTE[0],
        startTime: "",
        endTime: "",
        kind: "class",
        semester: 1,
        meetingDays: [],
      },
    ];
  });

  const visibleClasses = classes
    .filter((item) => (item.semester ?? 1) === semester)
    .sort(
      (a, b) =>
        periodSortValue(a.period) -
        periodSortValue(b.period)
    );

  function update(
    id: string,
    patch: Partial<ClassItem>
  ) {
    setClasses((current) =>
      current.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      )
    );
  }

  function toggleDay(id: string, day: Weekday) {
    setClasses((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        const selected = item.meetingDays ?? [];

        const meetingDays = selected.includes(day)
          ? selected.filter((value) => value !== day)
          : WEEKDAYS.map((entry) => entry.value).filter(
            (value) =>
              selected.includes(value) || value === day
          );

        return { ...item, meetingDays };
      })
    );
  }

  function addClass(
    kind: "class" | "free" | "lunch" = "class"
  ) {
    const existing = classes.filter(
      (item) => (item.semester ?? 1) === semester
    );

    const numbered = existing
      .map((item) => {
        const match = item.period.match(
          /^Period\s+(\d+)$/i
        );
        return match ? Number(match[1]) : 0;
      });

    const next = Math.max(0, ...numbered) + 1;

    const name =
      kind === "free"
        ? "Free Period"
        : kind === "lunch"
          ? "Lunch"
          : "";

    setClasses((current) => [
      ...current,
      {
        id: `manual-${Date.now()}-${Math.random()}`,
        name,
        teacher: "",
        period: `Period ${next}`,
        color:
          kind === "free"
            ? "#DCEDE7"
            : kind === "lunch"
              ? "#FFF0CE"
              : PALETTE[(next - 1) % PALETTE.length],
        startTime: "",
        endTime: "",
        kind,
        semester,
        meetingDays: [],
      },
    ]);
  }

  function removeClass(id: string) {
    setClasses((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function confirm() {
    const cleaned = classes.map((item) => ({
      ...item,
      name: item.name.trim(),
      teacher: item.teacher.trim(),
      period: item.period.trim(),
      startTime: item.startTime?.trim() ?? "",
      endTime: item.endTime?.trim() ?? "",
      meetingDays: [...(item.meetingDays ?? [])],
    }));

    if (cleaned.length === 0) {
      notify("Add at least one class before continuing.");
      return;
    }

    for (const item of cleaned) {
      if (!item.name || !item.period) {
        notify(
          "Every schedule block needs a name and period label."
        );
        return;
      }

      const start = item.startTime
        ? toMinutes(item.startTime)
        : null;

      const end = item.endTime
        ? toMinutes(item.endTime)
        : null;

      if (
        (item.startTime && start === null) ||
        (item.endTime && end === null)
      ) {
        notify(
          `Use times like 8:00 AM or 12:35 PM for ${item.name}.`
        );
        return;
      }

      if ((start === null) !== (end === null)) {
        notify(
          `Enter both start and end times for ${item.name}, or leave both blank.`
        );
        return;
      }

      if (
        start !== null &&
        end !== null &&
        end <= start
      ) {
        notify(
          `${item.name} must end after it starts.`
        );
        return;
      }
    }

    onContinue(cleaned);
  }

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>FluxUP</Text>

        <View style={styles.progress}>
          {[true, true, false, false].map(
            (done, index) => (
              <View
                key={index}
                style={[
                  styles.progressSegment,
                  {
                    backgroundColor: done
                      ? colors.brand.primary
                      : "#E3E9E4",
                  },
                ]}
              />
            )
          )}
        </View>

        <Text style={styles.step}>STEP 2 OF 4</Text>

        <Text style={styles.title}>
          Your classes, at a glance.
        </Text>

        <Text style={styles.subtitle}>
          Check your schedule and make any changes
          before continuing.
        </Text>

        <View style={styles.semesterRow}>
          {([1, 2] as const).map((value) => (
            <TouchableOpacity
              key={value}
              onPress={() => setSemester(value)}
              style={[
                styles.semesterButton,
                semester === value &&
                styles.semesterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.semesterText,
                  semester === value &&
                  styles.semesterTextActive,
                ]}
              >
                Semester {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>
            Semester {semester}
          </Text>

          <Text style={styles.count}>
            {visibleClasses.length} blocks
          </Text>
        </View>

        {visibleClasses.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No classes added for this semester yet.
            </Text>
          </View>
        )}

        {visibleClasses.map((item) => (
          <View key={item.id} style={styles.card}>
            <View
              style={[
                styles.strip,
                { backgroundColor: item.color },
              ]}
            />

            <View style={styles.cardContent}>
              <View style={styles.cardTop}>
                <Text style={styles.blockLabel}>
                  {(item.kind ?? "class").toUpperCase()}
                </Text>

                <TouchableOpacity
                  onPress={() => removeClass(item.id)}
                >
                  <Text style={styles.remove}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>
                Class / block name
              </Text>

              <TextInput
                style={styles.input}
                value={item.name}
                onChangeText={(name) =>
                  update(item.id, { name })
                }
                placeholder="Enter class name"
                placeholderTextColor={colors.text.muted}
              />

              <Text style={styles.label}>
                Teacher
              </Text>

              <TextInput
                style={styles.input}
                value={item.teacher}
                onChangeText={(teacher) =>
                  update(item.id, { teacher })
                }
                placeholder="Teacher name (optional)"
                placeholderTextColor={colors.text.muted}
              />

              <Text style={styles.label}>
                Period / label
              </Text>

              <TextInput
                style={styles.input}
                value={item.period}
                onChangeText={(period) =>
                  update(item.id, { period })
                }
                placeholder="Period 1 or Homeroom"
                placeholderTextColor={colors.text.muted}
              />

              <Text style={styles.label}>
                Meeting days
              </Text>

              <View style={styles.daysRow}>
                {WEEKDAYS.map((day) => {
                  const selected = (
                    item.meetingDays ?? []
                  ).includes(day.value);

                  return (
                    <TouchableOpacity
                      key={day.value}
                      onPress={() =>
                        toggleDay(item.id, day.value)
                      }
                      style={[
                        styles.dayButton,
                        selected &&
                        styles.dayButtonSelected,
                      ]}
                      accessibilityRole="checkbox"
                      accessibilityState={{
                        checked: selected,
                      }}
                      accessibilityLabel={`${day.label}, ${selected ? "selected" : "not selected"
                        }`}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          selected &&
                          styles.dayTextSelected,
                        ]}
                      >
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.timeRow}>
                <View style={styles.timeField}>
                  <Text style={styles.label}>
                    Starts
                  </Text>

                  <TextInput
                    style={styles.input}
                    value={item.startTime ?? ""}
                    onChangeText={(startTime) =>
                      update(item.id, { startTime })
                    }
                    placeholder="Optional"
                    placeholderTextColor={colors.text.muted}
                  />
                </View>

                <View style={styles.timeField}>
                  <Text style={styles.label}>
                    Ends
                  </Text>

                  <TextInput
                    style={styles.input}
                    value={item.endTime ?? ""}
                    onChangeText={(endTime) =>
                      update(item.id, { endTime })
                    }
                    placeholder="Optional"
                    placeholderTextColor={colors.text.muted}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addClass()}
        >
          <Text style={styles.addText}>
            + Add another class
          </Text>
        </TouchableOpacity>

        <View style={styles.extraRow}>
          <TouchableOpacity
            style={styles.extraButton}
            onPress={() => addClass("free")}
          >
            <Text style={styles.extraText}>
              + Free period
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.extraButton}
            onPress={() => addClass("lunch")}
          >
            <Text style={styles.extraText}>
              + Lunch
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={confirm}
        >
          <Text style={styles.continueText}>
            Confirm classes →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backText}>
            Back
          </Text>
        </TouchableOpacity>
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
    width: "100%",
    maxWidth: 430,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 25,
    paddingTop: 35,
    paddingBottom: 45,
  },
  logo: {
    color: colors.brand.primary,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 28,
  },
  progress: {
    flexDirection: "row",
    gap: 7,
    marginBottom: 12,
  },
  progressSegment: {
    flex: 1,
    height: 5,
    borderRadius: 10,
  },
  step: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text.secondary,
    marginBottom: 22,
  },
  semesterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  semesterButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "#E8EDE9",
  },
  semesterButtonActive: {
    backgroundColor: colors.brand.primary,
  },
  semesterText: {
    color: colors.text.secondary,
    fontWeight: "700",
    fontSize: 13,
  },
  semesterTextActive: {
    color: "#FFFFFF",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text.primary,
  },
  count: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  emptyCard: {
    padding: 22,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  strip: {
    width: 7,
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  blockLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.brand.dark,
    letterSpacing: 1,
  },
  remove: {
    color: "#A34E4E",
    fontSize: 12,
    fontWeight: "700",
  },
  label: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F9FAF8",
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.text.primary,
    marginBottom: 13,
  },
  daysRow: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 8,
  },
  dayButton: {
    flex: 1,
    minHeight: 43,
    borderRadius: 11,
    backgroundColor: "#F0F3F0",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  dayButtonSelected: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  dayText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: "800",
  },
  dayTextSelected: {
    color: "#FFFFFF",
  },
  timeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  timeField: {
    flex: 1,
  },
  addButton: {
    borderWidth: 1,
    borderColor: "#B7D6C4",
    borderStyle: "dashed",
    padding: 16,
    alignItems: "center",
    borderRadius: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  addText: {
    color: colors.brand.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  extraRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },
  extraButton: {
    flex: 1,
    padding: 13,
    backgroundColor: "#EAF3ED",
    borderRadius: 12,
    alignItems: "center",
  },
  extraText: {
    color: colors.brand.dark,
    fontWeight: "700",
    fontSize: 12,
  },
  continueButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 18,
  },
  backText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
});
