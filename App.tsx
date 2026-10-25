
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import SignInScreen from "./src/screens/SignInScreen";
import CreateAccountScreen from "./src/screens/CreateAccountScreen";

import UploadScheduleScreen, {
  type SelectedScheduleFile,
} from "./src/screens/UploadScheduleScreen";

import ConfirmClassesScreen, {
  DEFAULT_CLASSES,
  type ClassItem,
} from "./src/screens/ConfirmClassesScreen";

import type { ScheduleExtractionResult } from "./src/types/schedule";
import { parseScheduleText } from "./src/services/parseSchedule";

import ConnectClassroomScreen from "./src/screens/ConnectClassroomScreen";
import ImportingCourseworkScreen from "./src/screens/ImportingCourseworkScreen";
import CourseworkFoundScreen from "./src/screens/CourseworkFoundScreen";
import AddCommitmentsScreen from "./src/screens/AddCommitmentsScreen";

import PlannerScreen, {
  type Commitment,
} from "./src/screens/PlannerScreen";

import ClassDetailsScreen from "./src/screens/ClassDetailsScreen";
import AssignmentDetailsScreen from "./src/screens/AssignmentDetailsScreen";
import TestDetailsScreen from "./src/screens/TestDetailsScreen";
import MonthlyCalendarScreen from "./src/screens/MonthlyCalendarScreen";

import TasksScreen, {
  type TaskItem,
} from "./src/screens/TasksScreen";

import TaskDetailsScreen from "./src/screens/TaskDetailsScreen";

import AddNewItemScreen, {
  type NewPlannerItem,
} from "./src/screens/AddNewItemScreen";

import MoreScreen from "./src/screens/MoreScreen";

import ProfileScreen, {
  type StudentProfile,
} from "./src/screens/ProfileScreen";

import UpdateScheduleScreen from "./src/screens/UpdateScheduleScreen";
import UpdateScheduleMenuScreen from "./src/screens/UpdateScheduleMenuScreen";
import FluxAIScreen from "./src/screens/FluxAIScreen";

import AIPreviewChangesScreen, {
  DEMO_AI_CHANGES,
  type AIChange,
} from "./src/screens/AIPreviewChangesScreen";

import NotificationsScreen from "./src/screens/NotificationsScreen";

import NotificationSettingsScreen, {
  DEFAULT_NOTIFICATION_PREFERENCES,
  type NotificationPreferences,
} from "./src/screens/NotificationSettingsScreen";

type Screen =
  | "welcome"
  | "signin"
  | "create-account"
  | "upload-schedule"
  | "reading-schedule"
  | "confirm-classes"
  | "connect-classroom"
  | "importing-coursework"
  | "coursework-found"
  | "add-commitments"
  | "planner"
  | "class-details"
  | "assignment-details"
  | "test-details"
  | "monthly-calendar"
  | "tasks"
  | "task-details"
  | "add-new-item"
  | "more"
  | "profile"
  | "update-schedule"
  | "update-schedule-menu"
  | "flux-ai"
  | "ai-preview-changes"
  | "notifications"
  | "notification-settings";

type DetailsReturnScreen =
  | "planner"
  | "monthly-calendar"
  | "class-details"
  | "tasks";

type AIReturnScreen = "planner" | "more";

type ScheduleEditTab = "classes" | "commitments";

type SelectedAssignment = {
  title: string;
  className: string;
  dueDate: string;
};

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    Alert.alert(title, message);
  }
}

const loadingStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F7F9F6",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#244F3A",
    marginTop: 24,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64756B",
    lineHeight: 23,
    textAlign: "center",
    marginTop: 12,
    maxWidth: 300,
  },
});

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");

  const [aiReturnScreen, setAiReturnScreen] =
    useState<AIReturnScreen>("planner");

  // Stores the selected file.
  const [scheduleFile, setScheduleFile] =
    useState<SelectedScheduleFile | null>(null);

  // Stores parsed classes and semester information.
  const [scheduleExtraction, setScheduleExtraction] =
    useState<ScheduleExtractionResult | null>(null);

  // Forces Confirm Classes to initialize with new data
  // whenever a different schedule is uploaded.
  const [confirmationVersion, setConfirmationVersion] =
    useState(0);

  const [classes, setClasses] = useState<ClassItem[]>(
    () => DEFAULT_CLASSES.map((item) => ({ ...item }))
  );

  const [commitments, setCommitments] =
    useState<Commitment[]>([]);

  const [plannerItems, setPlannerItems] =
    useState<NewPlannerItem[]>([]);

  const [profile, setProfile] = useState<StudentProfile>({
    name: "",
    email: "",
    school: "",
    grade: "11th Grade",
  });

  const [aiChanges, setAiChanges] = useState<AIChange[]>(
    () => DEMO_AI_CHANGES.map((item) => ({ ...item }))
  );

  const [
    notificationPreferences,
    setNotificationPreferences,
  ] = useState<NotificationPreferences>({
    ...DEFAULT_NOTIFICATION_PREFERENCES,
  });

  const [scheduleEditTab, setScheduleEditTab] =
    useState<ScheduleEditTab>("classes");

  const [selectedClass, setSelectedClass] =
    useState("AP Physics");

  const [selectedAssignment, setSelectedAssignment] =
    useState<SelectedAssignment>({
      title: "Forces & Motion review",
      className: "AP Physics",
      dueDate: "Not specified",
    });

  const [selectedTask, setSelectedTask] =
    useState<TaskItem | null>(null);

  const [detailsReturnScreen, setDetailsReturnScreen] =
    useState<DetailsReturnScreen>("planner");

  /**
   * Reads a schedule uploaded by the student.
   *
   * PDF:
   *   pdfjs-dist extracts selectable text.
   *
   * PNG / JPG / WEBP:
   *   Tesseract.js performs OCR.
   *
   * Both formats use the same schedule parser.
   */
  async function handleScheduleUpload(
    selectedFile: SelectedScheduleFile | null
  ) {
    setScheduleFile(selectedFile);
    setScheduleExtraction(null);

    // Manual entry bypasses extraction.
    if (!selectedFile) {
      setConfirmationVersion((current) => current + 1);
      setScreen("confirm-classes");
      return;
    }

    // The current extraction services are web-only.
    if (Platform.OS !== "web") {
      showMessage(
        "Web version required",
        "Automatic schedule reading currently works in the web version of FluxUP."
      );
      return;
    }

    setScreen("reading-schedule");

    try {
      const isPDF =
        selectedFile.mimeType === "application/pdf" ||
        selectedFile.name.toLowerCase().endsWith(".pdf");

      // The document picker may supply a File or URI.
      let browserFile = selectedFile.file;

      if (!browserFile) {
        const response = await fetch(selectedFile.uri);

        if (!response.ok) {
          throw new Error(
            "Could not open the selected schedule."
          );
        }

        const blob = await response.blob();

        browserFile = new File(
          [blob],
          selectedFile.name,
          {
            type:
              selectedFile.mimeType ||
              blob.type ||
              (isPDF
                ? "application/pdf"
                : "image/png"),
          }
        );
      }

      let extractedText = "";

      if (isPDF) {
        // Import PDF processing only when needed.
        const { extractSchedulePDF } = await import(
          "./src/services/schedulePDF.web"
        );

        const result = await extractSchedulePDF(
          browserFile
        );

        extractedText = result.text;

        console.log(
          "[FluxUP] PDF pages processed:",
          result.pageCount
        );
      } else {
        // Import image OCR only when needed.
        const { extractScheduleText } = await import(
          "./src/services/scheduleOCR.web"
        );

        const result = await extractScheduleText(
          browserFile
        );

        extractedText = result.text;

        console.log(
          "[FluxUP] OCR confidence:",
          result.confidence
        );
      }

      if (!extractedText.trim()) {
        throw new Error(
          "No readable text was found in this schedule."
        );
      }

      console.log("[FluxUP] RAW SCHEDULE TEXT:\n" + extractedText);

      // Turn extracted text into semester/class records.
      const parsed = parseScheduleText(extractedText);

      console.log(
        "[FluxUP] Parsed schedule summary:",
        parsed.semesters.map((semester) => ({
          semester: semester.semester,
          classes: semester.classes.map((item) => ({
            name: item.name,
            period: item.period,
            teacher: item.teacher,
            kind: item.kind,
          })),
        }))
      );

      setScheduleExtraction(parsed);

      setConfirmationVersion(
        (current) => current + 1
      );

      setScreen("confirm-classes");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      console.error(
        "[FluxUP] Schedule extraction failed:",
        message
      );

      showMessage(
        "Could not read schedule",
        `${message}\n\nTry another file or enter your schedule manually.`
      );

      setScheduleExtraction(null);
      setScreen("upload-schedule");
    }
  }

  function openAI(from: AIReturnScreen) {
    setAiReturnScreen(from);
    setScreen("flux-ai");
  }

  function openAIPreview() {
    setAiChanges(
      DEMO_AI_CHANGES.map((item) => ({ ...item }))
    );
    setScreen("ai-preview-changes");
  }

  function openAssignment(
    title: string,
    className: string,
    returnScreen: DetailsReturnScreen,
    dueDate = "Not specified"
  ) {
    setSelectedAssignment({
      title,
      className,
      dueDate,
    });

    setDetailsReturnScreen(returnScreen);
    setScreen("assignment-details");
  }

  function openTest(
    className: string,
    returnScreen: DetailsReturnScreen
  ) {
    setSelectedClass(className);
    setDetailsReturnScreen(returnScreen);
    setScreen("test-details");
  }

  function togglePlannerItem(id: string) {
    setPlannerItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  }

  function saveNewItem(item: NewPlannerItem) {
    setPlannerItems((current) => [
      ...current,
      item,
    ]);

    setScreen("planner");
  }

  function saveProfile(updatedProfile: StudentProfile) {
    setProfile(updatedProfile);
    setScreen("more");
  }

  function saveSchedule(
    updatedClasses: ClassItem[],
    updatedCommitments: Commitment[]
  ) {
    setClasses(updatedClasses);
    setCommitments(updatedCommitments);
    setScreen("update-schedule-menu");
  }

  function openScheduleEditor(tab: ScheduleEditTab) {
    setScheduleEditTab(tab);
    setScreen("update-schedule");
  }

  // READING SCHEDULE

  if (screen === "reading-schedule") {
    return (
      <View style={loadingStyles.page}>
        <ActivityIndicator
          size="large"
          color="#367A55"
        />

        <Text style={loadingStyles.title}>
          Reading your schedule...
        </Text>

        <Text style={loadingStyles.subtitle}>
          FluxUP is identifying classes, semesters,
          periods, and available schedule details.
          This may take a moment.
        </Text>
      </View>
    );
  }

  // NOTIFICATION SETTINGS

  if (screen === "notification-settings") {
    return (
      <NotificationSettingsScreen
        preferences={notificationPreferences}
        onBack={() =>
          setScreen("notifications")
        }
        onSave={(updatedPreferences) => {
          setNotificationPreferences(
            updatedPreferences
          );

          setScreen("notifications");
        }}
      />
    );
  }

  // NOTIFICATIONS

  if (screen === "notifications") {
    return (
      <NotificationsScreen
        onBack={() => setScreen("more")}
        onOpenPlanner={() =>
          setScreen("planner")
        }
        onOpenTasks={() => setScreen("tasks")}
        onOpenSettings={() =>
          setScreen("notification-settings")
        }
      />
    );
  }

  // AI PREVIEW

  if (screen === "ai-preview-changes") {
    return (
      <AIPreviewChangesScreen
        changes={aiChanges}
        onBack={() =>
          setScreen("flux-ai")
        }
        onKeepOriginal={() =>
          setScreen("planner")
        }
        onApplyChanges={(approvedChanges) => {
          showMessage(
            "Suggestions reviewed",
            `You approved ${approvedChanges.length} suggestion${approvedChanges.length === 1
              ? ""
              : "s"
            }.\n\nThis is a demo. Your actual schedule has not changed.`
          );

          setScreen("planner");
        }}
      />
    );
  }

  // FLUX AI

  if (screen === "flux-ai") {
    return (
      <FluxAIScreen
        classes={classes}
        commitments={commitments}
        plannerItems={plannerItems}
        onBack={() =>
          setScreen(aiReturnScreen)
        }
        onOpenPlanner={() =>
          setScreen("planner")
        }
        onOpenTasks={() =>
          setScreen("tasks")
        }
        onOpenAIPreview={openAIPreview}
      />
    );
  }

  // UPDATE SCHEDULE MENU

  if (screen === "update-schedule-menu") {
    return (
      <UpdateScheduleMenuScreen
        classCount={classes.length}
        commitmentCount={commitments.length}
        onBack={() =>
          setScreen("more")
        }
        onEditClasses={() =>
          openScheduleEditor("classes")
        }
        onEditCommitments={() =>
          openScheduleEditor("commitments")
        }
        onOpenPlanner={() =>
          setScreen("planner")
        }
      />
    );
  }

  // UPDATE SCHEDULE EDITOR

  if (screen === "update-schedule") {
    return (
      <UpdateScheduleScreen
        key={scheduleEditTab}
        initialTab={scheduleEditTab}
        classes={classes}
        commitments={commitments}
        onBack={() =>
          setScreen("update-schedule-menu")
        }
        onSave={saveSchedule}
      />
    );
  }

  // PROFILE

  if (screen === "profile") {
    return (
      <ProfileScreen
        profile={profile}
        onBack={() =>
          setScreen("more")
        }
        onSave={saveProfile}
      />
    );
  }

  // MORE MENU

  if (screen === "more") {
    return (
      <MoreScreen
        onBack={() =>
          setScreen("planner")
        }
        onOpenProfile={() =>
          setScreen("profile")
        }
        onUpdateSchedule={() =>
          setScreen("update-schedule-menu")
        }
        onOpenAI={() =>
          openAI("more")
        }
        onOpenNotifications={() =>
          setScreen("notifications")
        }
        onOpenConnectedAccounts={() =>
          showMessage(
            "Connected Accounts",
            "Google Classroom account settings are coming soon."
          )
        }
        onLogout={() =>
          setScreen("welcome")
        }
      />
    );
  }

  // ADD NEW ITEM

  if (screen === "add-new-item") {
    return (
      <AddNewItemScreen
        classes={classes}
        onBack={() =>
          setScreen("planner")
        }
        onSave={saveNewItem}
      />
    );
  }

  // TASK DETAILS

  if (screen === "task-details" && selectedTask) {
    return (
      <TaskDetailsScreen
        task={selectedTask}
        onBack={() =>
          setScreen("tasks")
        }
        onStatusChange={(taskId, completed) => {
          setSelectedTask((current) =>
            current?.id === taskId
              ? {
                ...current,
                status: completed
                  ? "completed"
                  : "pending",
              }
              : current
          );

          setPlannerItems((current) =>
            current.map((item) =>
              item.id === taskId
                ? {
                  ...item,
                  completed,
                }
                : item
            )
          );
        }}
      />
    );
  }

  // TASKS

  if (screen === "tasks") {
    return (
      <TasksScreen
        onBack={() =>
          setScreen("planner")
        }
        onOpenPlanner={() =>
          setScreen("planner")
        }
        onOpenTask={(task) => {
          setSelectedTask(task);
          setScreen("task-details");
        }}
        onOpenAssignment={(title, className) =>
          openAssignment(
            title,
            className,
            "tasks"
          )
        }
        onOpenTest={(className) =>
          openTest(className, "tasks")
        }
      />
    );
  }

  // MONTHLY CALENDAR

  if (screen === "monthly-calendar") {
    return (
      <MonthlyCalendarScreen
        onBack={() =>
          setScreen("planner")
        }
        onOpenPlanner={() =>
          setScreen("planner")
        }
        onOpenTasks={() =>
          setScreen("tasks")
        }
        onOpenAssignment={(title, className) =>
          openAssignment(
            title,
            className,
            "monthly-calendar"
          )
        }
        onOpenTest={(className) =>
          openTest(
            className,
            "monthly-calendar"
          )
        }
      />
    );
  }

  // TEST DETAILS

  if (screen === "test-details") {
    return (
      <TestDetailsScreen
        className={selectedClass}
        onBack={() =>
          setScreen(detailsReturnScreen)
        }
      />
    );
  }

  // ASSIGNMENT DETAILS

  if (screen === "assignment-details") {
    return (
      <AssignmentDetailsScreen
        assignmentTitle={
          selectedAssignment.title
        }
        className={
          selectedAssignment.className
        }
        dueDate={
          selectedAssignment.dueDate
        }
        onBack={() =>
          setScreen(detailsReturnScreen)
        }
      />
    );
  }

  // CLASS DETAILS

  if (screen === "class-details") {
    return (
      <ClassDetailsScreen
        className={selectedClass}
        onBack={() =>
          setScreen("planner")
        }
        onOpenAssignment={(title, className) =>
          openAssignment(
            title,
            className,
            "class-details"
          )
        }
      />
    );
  }

  // PLANNER

  if (screen === "planner") {
    return (
      <PlannerScreen
        classes={classes}
        commitments={commitments}
        plannerItems={plannerItems}
        onToggleItem={togglePlannerItem}
        onOpenClass={(className) => {
          setSelectedClass(className);
          setScreen("class-details");
        }}
        onOpenAssignment={(title, className) => {
          const matchingItem = plannerItems.find(
            (item) =>
              item.type === "assignment" &&
              item.title === title &&
              classes.find(
                (course) =>
                  course.id === item.classId
              )?.name === className
          );

          openAssignment(
            title,
            className,
            "planner",
            matchingItem?.dueDate ??
            "Not specified"
          );
        }}
        onOpenTest={(className) =>
          openTest(className, "planner")
        }
        onOpenMonth={() =>
          setScreen("monthly-calendar")
        }
        onOpenTasks={() =>
          setScreen("tasks")
        }
        onAddItem={() =>
          setScreen("add-new-item")
        }
        onOpenMore={() =>
          setScreen("more")
        }
        onOpenAI={() =>
          openAI("planner")
        }
      />
    );
  }

  // ADD COMMITMENTS

  if (screen === "add-commitments") {
    return (
      <AddCommitmentsScreen
        onBack={() =>
          setScreen("coursework-found")
        }
        onContinue={(savedCommitments) => {
          setCommitments(
            savedCommitments
          );

          setScreen("planner");
        }}
      />
    );
  }

  // COURSEWORK FOUND

  if (screen === "coursework-found") {
    return (
      <CourseworkFoundScreen
        onBack={() =>
          setScreen("connect-classroom")
        }
        onContinue={() =>
          setScreen("add-commitments")
        }
      />
    );
  }

  // IMPORTING COURSEWORK

  if (screen === "importing-coursework") {
    return (
      <ImportingCourseworkScreen
        onComplete={() =>
          setScreen("coursework-found")
        }
      />
    );
  }

  // CONNECT CLASSROOM

  if (screen === "connect-classroom") {
    return (
      <ConnectClassroomScreen
        onBack={() =>
          setScreen("confirm-classes")
        }
        onConnect={() =>
          setScreen("importing-coursework")
        }
        onSkip={() =>
          setScreen("add-commitments")
        }
      />
    );
  }

  // CONFIRM CLASSES

  if (screen === "confirm-classes") {
    return (
      <ConfirmClassesScreen
        key={confirmationVersion}
        initialClasses={classes}
        extraction={scheduleExtraction}
        onBack={() =>
          setScreen("upload-schedule")
        }
        onContinue={(confirmedClasses) => {
          setClasses(
            confirmedClasses
          );

          setScreen("connect-classroom");
        }}
      />
    );
  }

  // UPLOAD SCHEDULE

  if (screen === "upload-schedule") {
    return (
      <UploadScheduleScreen
        onBack={() =>
          setScreen("welcome")
        }
        onContinue={handleScheduleUpload}
      />
    );
  }

  // CREATE ACCOUNT

  if (screen === "create-account") {
    return (
      <CreateAccountScreen
        onBack={() =>
          setScreen("signin")
        }
        onAccountCreated={() =>
          setScreen("signin")
        }
        onSignIn={() =>
          setScreen("signin")
        }
      />
    );
  }

  // SIGN IN

  if (screen === "signin") {
    return (
      <SignInScreen
        onBack={() =>
          setScreen("welcome")
        }
        onCreateAccount={() =>
          setScreen("create-account")
        }
      />
    );
  }

  // WELCOME

  return (
    <WelcomeScreen
      onCreateSchedule={() =>
        setScreen("upload-schedule")
      }
      onSignIn={() =>
        setScreen("signin")
      }
    />
  );
}
