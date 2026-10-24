import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { colors } from "../constants/colors";

type UploadScheduleScreenProps = {
  onBack: () => void;
  onContinue: () => void;
};

export default function UploadScheduleScreen({
  onBack,
  onContinue,
}: UploadScheduleScreenProps) {
  const [selectedFile, setSelectedFile] = useState("");

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Branding */}
        <Text style={styles.logo}>Flux</Text>

        {/* Progress */}
        <View style={styles.progressRow}>
          <View style={styles.progressComplete} />
          <View style={styles.progressActive} />
          <View style={styles.progressInactive} />
          <View style={styles.progressInactive} />
        </View>
        <Text style={styles.stepLabel}>STEP 1 OF 4</Text>

        {/* Main heading */}
        <Text style={styles.title}>Let's build your schedule.</Text>
        <Text style={styles.subtitle}>
          Start with your school schedule. Flux will use it to understand your
          classes, periods, and available time.
        </Text>

        {/* Upload area */}
        <View style={styles.uploadCard}>
          <View style={styles.uploadIconCircle}>
            <Text style={styles.uploadIcon}>↑</Text>
          </View>

          <Text style={styles.uploadTitle}>
            Upload your school schedule
          </Text>
          <Text style={styles.uploadDescription}>
            Add a screenshot, photo, or PDF of your schedule.
          </Text>

          <TouchableOpacity
            style={styles.uploadButton}
            activeOpacity={0.8}
            onPress={() =>
              setSelectedFile("Schedule upload will be enabled next.")
            }
          >
            <Text style={styles.uploadButtonText}>Choose a file</Text>
          </TouchableOpacity>

          <Text style={styles.fileTypes}>PNG · JPG · PDF</Text>

          {selectedFile !== "" && (
            <Text style={styles.notice}>{selectedFile}</Text>
          )}
        </View>

        {/* Alternative */}
        <View style={styles.alternativeCard}>
          <View style={styles.alternativeIcon}>
            <Text style={styles.alternativeIconText}>✎</Text>
          </View>
          <View style={styles.alternativeCopy}>
            <Text style={styles.alternativeTitle}>
              Don't have a file?
            </Text>
            <Text style={styles.alternativeDescription}>
              You can enter your classes and times manually in a later step.
            </Text>
          </View>
        </View>

        {/* Privacy note */}
        <View style={styles.privacyRow}>
          <Text style={styles.privacyIcon}>✓</Text>
          <Text style={styles.privacyText}>
            Your schedule is used to personalize your Flux plan.
          </Text>
        </View>

        {/* Navigation */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={onContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueText}>Continue →</Text>
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
    marginBottom: 28,
  },
  uploadCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#C9DED5",
    borderStyle: "dashed",
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: "center",
  },
  uploadIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#DDF4EA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
  },
  uploadIcon: {
    color: colors.brand.primary,
    fontSize: 32,
    fontWeight: "500",
    marginTop: -4,
  },
  uploadTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  uploadDescription: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: 13,
    minHeight: 49,
    paddingHorizontal: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  fileTypes: {
    color: colors.text.muted,
    fontSize: 12,
    marginTop: 13,
  },
  notice: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
  },
  alternativeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F7F2",
    borderRadius: 17,
    padding: 16,
    marginTop: 19,
  },
  alternativeIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#DDEAD9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  alternativeIconText: {
    color: "#47765F",
    fontSize: 23,
  },
  alternativeCopy: {
    flex: 1,
  },
  alternativeTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  alternativeDescription: {
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 18,
  },
  privacyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 21,
    marginBottom: 24,
    gap: 9,
  },
  privacyIcon: {
    color: colors.brand.primary,
    fontSize: 15,
    fontWeight: "800",
  },
  privacyText: {
    flex: 1,
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

