
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { colors } from "../constants/colors";

export type SelectedScheduleFile = {
  name: string;
  uri: string;
  mimeType: string;
  size: number;
  file?: File;
};

type UploadScheduleScreenProps = {
  onBack: () => void;
  onContinue: (file: SelectedScheduleFile | null) => void;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getMimeType(name: string): string {
  const extension = name.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "pdf":
      return "application/pdf";
    default:
      return "";
  }
}

export default function UploadScheduleScreen({
  onBack,
  onContinue,
}: UploadScheduleScreenProps) {
  const [selectedFile, setSelectedFile] =
    useState<SelectedScheduleFile | null>(null);

  const [error, setError] = useState("");
  const [isPicking, setIsPicking] = useState(false);

  async function chooseFile() {
    if (isPicking) return;

    setError("");
    setIsPicking(true);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "image/png",
          "image/jpeg",
          "image/webp",
          "application/pdf",
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets.length) {
        return;
      }

      const asset = result.assets[0];

      const mimeType =
        asset.mimeType || getMimeType(asset.name);

      if (!ALLOWED_TYPES.includes(mimeType)) {
        setError(
          "Unsupported file type. Please choose a PNG, JPG, WEBP, or PDF."
        );
        return;
      }

      const size = asset.size ?? 0;

      if (size > MAX_FILE_SIZE) {
        setError(
          "This file is too large. Please choose a file smaller than 10 MB."
        );
        return;
      }

      setSelectedFile({
        name: asset.name,
        uri: asset.uri,
        mimeType,
        size,
        file: asset.file,
      });
    } catch (err) {
      console.error("Schedule file selection failed:", err);

      setError(
        "We couldn't open your file. Please try again."
      );
    } finally {
      setIsPicking(false);
    }
  }

  function removeFile() {
    setSelectedFile(null);
    setError("");
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
          <View style={styles.progressActive} />
          <View style={styles.progressInactive} />
          <View style={styles.progressInactive} />
        </View>

        <Text style={styles.stepLabel}>STEP 1 OF 4</Text>

        <Text style={styles.title}>
          Let's build your schedule.
        </Text>

        <Text style={styles.subtitle}>
          Upload your school schedule. Flux will use it to
          identify your classes, teachers, periods, and times.
        </Text>

        <View style={styles.uploadCard}>
          <View style={styles.uploadIconCircle}>
            <Text style={styles.uploadIcon}>
              {selectedFile ? "✓" : "↑"}
            </Text>
          </View>

          <Text style={styles.uploadTitle}>
            {selectedFile
              ? "Schedule selected"
              : "Upload your school schedule"}
          </Text>

          <Text style={styles.uploadDescription}>
            {selectedFile
              ? "Your file is ready for the next step."
              : "Choose a screenshot, photo, or PDF of your school schedule."}
          </Text>

          {selectedFile ? (
            <View style={styles.fileCard}>
              <View style={styles.fileIcon}>
                <Text style={styles.fileIconText}>
                  {selectedFile.mimeType === "application/pdf"
                    ? "PDF"
                    : "IMG"}
                </Text>
              </View>

              <View style={styles.fileInfo}>
                <Text
                  style={styles.fileName}
                  numberOfLines={2}
                >
                  {selectedFile.name}
                </Text>

                <Text style={styles.fileSize}>
                  {formatFileSize(selectedFile.size)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={removeFile}
                accessibilityRole="button"
                accessibilityLabel="Remove selected file"
              >
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <TouchableOpacity
            style={[
              styles.uploadButton,
              isPicking && styles.disabledButton,
            ]}
            activeOpacity={0.8}
            disabled={isPicking}
            onPress={chooseFile}
          >
            {isPicking ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.uploadButtonText}>
                {selectedFile
                  ? "Choose a different file"
                  : "Choose a file"}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.fileTypes}>
            PNG · JPG · WEBP · PDF · Max 10 MB
          </Text>

          {error !== "" && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>

        <View style={styles.alternativeCard}>
          <View style={styles.alternativeIcon}>
            <Text style={styles.alternativeIconText}>
              ✎
            </Text>
          </View>

          <View style={styles.alternativeCopy}>
            <Text style={styles.alternativeTitle}>
              Don't have a file?
            </Text>

            <Text style={styles.alternativeDescription}>
              Continue without uploading to enter your
              classes manually.
            </Text>
          </View>
        </View>

        <View style={styles.privacyRow}>
          <Text style={styles.privacyIcon}>✓</Text>

          <Text style={styles.privacyText}>
            Your file stays on your device during this step.
            Nothing is uploaded to a server yet.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => onContinue(selectedFile)}
          activeOpacity={0.85}
        >
          <Text style={styles.continueText}>
            {selectedFile
              ? "Continue with schedule →"
              : "Enter classes manually →"}
          </Text>
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
  disabledButton: {
    opacity: 0.6,
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
    textAlign: "center",
  },
  fileCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F8F4",
    borderRadius: 13,
    padding: 12,
    marginBottom: 18,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#DCEDE3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  fileIconText: {
    color: colors.brand.dark,
    fontSize: 11,
    fontWeight: "800",
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  fileSize: {
    color: colors.text.secondary,
    fontSize: 11,
    marginTop: 4,
  },
  removeButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    fontSize: 23,
    color: colors.text.secondary,
  },
  errorText: {
    color: "#B44B4B",
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
