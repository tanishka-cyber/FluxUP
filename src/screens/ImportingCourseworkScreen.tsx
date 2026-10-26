import React, { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Flux colors for this screen.
const palette = {
  background: "#FFFDF8",
  white: "#FFFFFF",
  text: "#172C27",
  secondary: "#64736E",
  muted: "#96A39E",
  teal: "#087F70",
  lightTeal: "#DDF4EA",
  border: "#E3EAE6",
  blue: "#CDE5F5",
  green: "#BFE3CB",
  pink: "#F5D0E1",
  yellow: "#F7E6A8",
};

type Props = {
  onComplete: () => void;
};

export default function ImportingCourseworkScreen({
  onComplete,
}: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const percentage = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    }).start();

    Animated.timing(percentage, {
      toValue: 100,
      duration: 4000,
      useNativeDriver: false,
    }).start();

    const timeout = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => clearTimeout(timeout);
  }, [onComplete, percentage, progress]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Flux wordmark: no boxed F */}
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>FluxUP</Text>
        </View>

        {/* Main heading */}
        <View style={styles.headingSection}>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>IMPORT IN PROGRESS</Text>
          </View>

          <Text style={styles.heading}>
            Bringing your{"\n"}schoolwork together.
          </Text>

          <Text style={styles.subtitle}>
            Flux is organizing your coursework so you can focus on what
            matters next.
          </Text>
        </View>

        {/* Coursework illustration */}
        <View style={styles.illustration}>
          <View style={[styles.decorCircle, styles.circleOne]} />
          <View style={[styles.decorCircle, styles.circleTwo]} />

          <View style={styles.documentBack}>
            <View style={styles.documentBackLine} />
            <View style={styles.documentBackLineShort} />
            <View style={styles.documentBackLine} />
          </View>

          <View style={styles.document}>
            <View style={styles.documentHeader}>
              <View style={styles.documentIcon}>
                <Text style={styles.documentIconText}>✓</Text>
              </View>

              <View style={styles.documentHeaderText}>
                <View style={styles.documentTitleLine} />
                <View style={styles.documentSubtitleLine} />
              </View>
            </View>

            <View style={styles.documentDivider} />

            <AssignmentRow
              color={palette.blue}
              label="Linear Algebra"
              detail="Problem Set"
            />

            <AssignmentRow
              color={palette.pink}
              label="AP Physics"
              detail="Forces and Motion"
            />

            <AssignmentRow
              color={palette.yellow}
              label="AP Business"
              detail="Market Analysis"
            />
          </View>

          <View style={styles.floatingCheck}>
            <Text style={styles.floatingCheckText}>✓</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeading}>
            <Text style={styles.progressTitle}>
              Organizing coursework
            </Text>

            <AnimatedPercentage value={percentage} />
          </View>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressWidth },
              ]}
            />
          </View>

          <View style={styles.steps}>
            <View style={styles.stepRow}>
              <View style={styles.stepComplete}>
                <Text style={styles.stepCheck}>✓</Text>
              </View>
              <Text style={styles.stepDone}>
                Connecting your classes
              </Text>
            </View>

            <View style={styles.stepRow}>
              <View style={styles.stepActive}>
                <View style={styles.stepActiveDot} />
              </View>
              <Text style={styles.stepCurrent}>
                Finding assignments and tests
              </Text>
            </View>

            <View style={styles.stepRow}>
              <View style={styles.stepPending} />
              <Text style={styles.stepUpcoming}>
                Preparing your planner
              </Text>
            </View>
          </View>
        </View>

        {/* Footer note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerIcon}>✦</Text>
          <Text style={styles.footerText}>
            Your schoolwork, ready for a smarter plan.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// One assignment row in the illustration.
function AssignmentRow({
  color,
  label,
  detail,
}: {
  color: string;
  label: string;
  detail: string;
}) {
  return (
    <View style={styles.assignmentRow}>
      <View
        style={[
          styles.assignmentColor,
          { backgroundColor: color },
        ]}
      />

      <View style={styles.assignmentText}>
        <Text style={styles.assignmentLabel}>{label}</Text>
        <Text style={styles.assignmentDetail}>{detail}</Text>
      </View>

      <View style={styles.assignmentCheck}>
        <Text style={styles.assignmentCheckText}>✓</Text>
      </View>
    </View>
  );
}

// Animated percentage counter.
function AnimatedPercentage({
  value,
}: {
  value: Animated.Value;
}) {
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    const listenerId = value.addListener(
      ({ value: currentValue }) => {
        setDisplayValue(Math.round(currentValue));
      }
    );

    return () => {
      value.removeListener(listenerId);
    };
  }, [value]);

  return (
    <Text style={styles.progressPercentage}>
      {displayValue}%
    </Text>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
  },

  // Plain teal wordmark, without a logo box.
  logoRow: {
    alignSelf: "flex-start",
  },

  logoText: {
    fontSize: 30,
    fontWeight: "800",
    color: palette.teal,
    letterSpacing: -1.2,
  },

  headingSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 44,
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: palette.lightTeal,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: palette.teal,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    color: palette.teal,
  },

  heading: {
    marginTop: 18,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -1.3,
    textAlign: "center",
    color: palette.text,
  },

  subtitle: {
    maxWidth: 330,
    marginTop: 12,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    color: palette.secondary,
  },

  illustration: {
    width: "100%",
    maxWidth: 350,
    height: 270,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  decorCircle: {
    position: "absolute",
    borderRadius: 999,
  },

  circleOne: {
    width: 210,
    height: 210,
    backgroundColor: "#EAF5EC",
    top: 30,
    left: 20,
  },

  circleTwo: {
    width: 75,
    height: 75,
    backgroundColor: "#F8EBD0",
    bottom: 22,
    right: 15,
  },

  documentBack: {
    position: "absolute",
    width: 225,
    height: 195,
    borderRadius: 18,
    backgroundColor: "#E4EEE8",
    borderWidth: 1,
    borderColor: palette.border,
    transform: [{ rotate: "8deg" }, { translateX: 12 }],
    padding: 20,
    gap: 12,
  },

  documentBackLine: {
    height: 7,
    width: "80%",
    borderRadius: 5,
    backgroundColor: "#CCDCD2",
  },

  documentBackLineShort: {
    height: 7,
    width: "55%",
    borderRadius: 5,
    backgroundColor: "#CCDCD2",
  },

  document: {
    width: 245,
    borderRadius: 18,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 17,
    shadowColor: "#263E32",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 5,
    transform: [{ rotate: "-3deg" }],
  },

  documentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  documentIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: palette.lightTeal,
    alignItems: "center",
    justifyContent: "center",
  },

  documentIconText: {
    color: palette.teal,
    fontSize: 20,
    fontWeight: "800",
  },

  documentHeaderText: {
    flex: 1,
    gap: 6,
  },

  documentTitleLine: {
    height: 9,
    width: "75%",
    borderRadius: 5,
    backgroundColor: palette.text,
  },

  documentSubtitleLine: {
    height: 6,
    width: "50%",
    borderRadius: 5,
    backgroundColor: "#D9E3DE",
  },

  documentDivider: {
    height: 1,
    backgroundColor: palette.border,
    marginVertical: 13,
  },

  assignmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
    gap: 9,
  },

  assignmentColor: {
    width: 9,
    height: 31,
    borderRadius: 5,
  },

  assignmentText: {
    flex: 1,
    gap: 3,
  },

  assignmentLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: palette.text,
  },

  assignmentDetail: {
    fontSize: 10,
    color: palette.secondary,
  },

  assignmentCheck: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D6E2DB",
    alignItems: "center",
    justifyContent: "center",
  },

  assignmentCheckText: {
    fontSize: 11,
    color: palette.teal,
  },

  floatingCheck: {
    position: "absolute",
    right: 25,
    top: 30,
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: palette.teal,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: palette.background,
  },

  floatingCheckText: {
    color: palette.white,
    fontSize: 19,
    fontWeight: "800",
  },

  progressSection: {
    width: "100%",
    maxWidth: 350,
    marginTop: 16,
  },

  progressHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
  },

  progressTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.text,
  },

  progressPercentage: {
    fontSize: 14,
    fontWeight: "800",
    color: palette.teal,
  },

  progressTrack: {
    height: 8,
    width: "100%",
    borderRadius: 999,
    backgroundColor: "#E7EEEA",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: palette.teal,
  },

  steps: {
    marginTop: 21,
    gap: 15,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  stepComplete: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: palette.lightTeal,
    alignItems: "center",
    justifyContent: "center",
  },

  stepCheck: {
    fontSize: 13,
    fontWeight: "800",
    color: palette.teal,
  },

  stepDone: {
    fontSize: 13,
    color: palette.secondary,
  },

  stepActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: palette.teal,
    alignItems: "center",
    justifyContent: "center",
  },

  stepActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.teal,
  },

  stepCurrent: {
    fontSize: 13,
    fontWeight: "700",
    color: palette.text,
  },

  stepPending: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#D9E2DD",
  },

  stepUpcoming: {
    fontSize: 13,
    color: palette.muted,
  },

  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 30,
  },

  footerIcon: {
    color: palette.teal,
    fontSize: 16,
  },

  footerText: {
    fontSize: 12,
    color: palette.secondary,
  },
});