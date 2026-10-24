import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { colors } from "../constants/colors";

type ClassItem = {
  id: string;
  name: string;
  teacher: string;
  period: string;
  color: string;
};

type ConfirmClassesScreenProps = {
  onBack: () => void;
  onContinue: () => void;
};

const initialClasses: ClassItem[] = [
  {
    id: "1",
    name: "AP Physics",
    teacher: "",
    period: "Period 1",
    color: colors.blocks.blue,
  },
  {
    id: "2",
    name: "Linear Algebra",
    teacher: "",
    period: "Period 2",
    color: colors.blocks.purple,
  },
  {
    id: "3",
    name: "AP Business",
    teacher: "",
    period: "Period 3",
    color: colors.blocks.green,
  },
  {
    id: "4",
    name: "English",
    teacher: "",
    period: "Period 4",
    color: colors.blocks.pink,
  },
];

export default function ConfirmClassesScreen({
  onBack,
  onContinue,
}: ConfirmClassesScreenProps) {
  const [classes, setClasses] = useState(initialClasses);
  const [editingId, setEditingId] = useState<string | null>(null);

  function updateClass(id: string, name: string) {
    setClasses((current) =>
      current.map((item) =>
        item.id === id ? { ...item, name } : item
      )
    );
  }

  function addClass() {
    const newClass: ClassItem = {
      id: String(Date.now()),
      name: "",
      teacher: "",
      period: `Period ${ classes.length + 1 } `,
      color: colors.blocks.yellow,
    };

    setClasses((current) => [...current, newClass]);
    setEditingId(newClass.id);
  }

  function removeClass(id: string) {
    setClasses((current) => current.filter((item) => item.id !== id));
  }

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>Flux</Text>

        <View style={styles.progressRow}>
          <View style={styles.progressComplete} />
          <View style={styles.progressComplete} />
          <View style={styles.progressInactive} />
          <View style={styles.progressInactive} />
        </View>

        <Text style={styles.stepLabel}>STEP 2 OF 4</Text>

        <Text style={styles.title}>Your classes, at a glance.</Text>

        <Text style={styles.subtitle}>
          Check that everything looks right. You can rename classes or add
          anything that's missing.
        </Text>

        <View style={styles.successBanner}>
          <View style={styles.successIcon}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          <View style={styles.successCopy}>
            <Text style={styles.successTitle}>Schedule ready to review</Text>
            <Text style={styles.successDescription}>
              Confirm your classes before we continue.
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your classes</Text>
          <Text style={styles.classCount}>{classes.length} classes</Text>
        </View>

        {classes.map((item, index) => (
          <View
            key={item.id}
            style={styles.classCard}
          >
            <View
              style={[
                styles.colorStrip,
                { backgroundColor: item.color },
              ]}
            />

            <View style={styles.classContent}>
              <Text style={styles.periodLabel}>
                {item.period.toUpperCase()}
              </Text>

              {editingId === item.id ? (
                <TextInput
                  style={styles.classInput}
                  value={item.name}
                  onChangeText={(value) => updateClass(item.id, value)}
                  placeholder="Enter class name"
                  placeholderTextColor={colors.text.muted}
                  autoFocus
                />
              ) : (
                <Text style={styles.className}>
                  {item.name || "Unnamed class"}
                </Text>
              )}

              <Text style={styles.teacherLabel}>
                Teacher details can be added later
              </Text>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity
                onPress={() =>
                  setEditingId(editingId === item.id ? null : item.id)
                }
                style={styles.editButton}
                activeOpacity={0.7}
              >
                <Text style={styles.editButtonText}>
                  {editingId === item.id ? "Done" : "Edit"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => removeClass(item.id)}
                style={styles.removeButton}
                activeOpacity={0.7}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={addClass}
          activeOpacity={0.75}
        >
          <Text style={styles.addButtonText}>＋  Add another class</Text>
        </TouchableOpacity>

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>✦</Text>
          <View style={styles.tipCopy}>
            <Text style={styles.tipTitle}>Your schedule can change.</Text>
            <Text style={styles.tipDescription}>
              You can update classes and school details later in Flux.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={onContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueText}>Confirm classes →</Text>
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
    paddingBottom: 36,
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
    marginBottom: 24,
  },
  title: {
    color: colors.text.primary,
    fontSize: 31,
    fontWeight: "700",
    letterSpacing: -1.1,
    lineHeight: 37,
    marginBottom: 12,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 23,
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF5EC",
    borderRadius: 16,
    padding: 15,
    marginBottom: 28,
  },
  successIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D1EBD8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkmark: {
    color: "#367A55",
    fontSize: 19,
    fontWeight: "700",
  },
  successCopy: {
    flex: 1,
  },
  successTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  successDescription: {
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 19,
    fontWeight: "700",
  },
  classCount: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "600",
  },
  classCard: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 11,
    minHeight: 98,
    overflow: "hidden",
  },
  colorStrip: {
    width: 7,
  },
  classContent: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 13,
  },
  periodLabel: {
    color: colors.text.secondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 5,
  },
  className: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },
  classInput: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "600",
    borderBottomWidth: 1,
    borderBottomColor: colors.brand.primary,
    paddingVertical: 4,
    marginBottom: 5,
  },
  teacherLabel: {
    color: colors.text.muted,
    fontSize: 11,
  },
  cardActions: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
    gap: 8,
  },
  editButton: {
    backgroundColor: "#EDF5F0",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  editButtonText: {
    color: colors.brand.dark,
    fontSize: 12,
    fontWeight: "700",
  },
  removeButton: {
    width: 28,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: colors.text.muted,
    fontSize: 22,
  },
  addButton: {
    minHeight: 49,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BDD7CC",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
    marginBottom: 21,
  },
  addButtonText: {
    color: colors.brand.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#FFF4D9",
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },
  tipIcon: {
    color: "#A47C2C",
    fontSize: 20,
    marginRight: 11,
  },
  tipCopy: {
    flex: 1,
  },
  tipTitle: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  tipDescription: {
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 18,
  },
  continueButton: {
    minHeight: 54,
    borderRadius: 15,
    backgroundColor: colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
  },
  backText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
});
