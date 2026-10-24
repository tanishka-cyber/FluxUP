import React, { useState } from "react";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import SignInScreen from "./src/screens/SignInScreen";
import CreateAccountScreen from "./src/screens/CreateAccountScreen";
import UploadScheduleScreen from "./src/screens/UploadScheduleScreen";
import ConfirmClassesScreen from "./src/screens/ConfirmClassesScreen";
import ConnectClassroomScreen from "./src/screens/ConnectClassroomScreen";
import ImportingCourseworkScreen from "./src/screens/ImportingCourseworkScreen";
import CourseworkFoundScreen from "./src/screens/CourseworkFoundScreen";
import AddCommitmentsScreen from "./src/screens/AddCommitmentsScreen";
import PlannerScreen, {
  type Commitment,
} from "./src/screens/PlannerScreen";

type Screen =
  | "welcome"
  | "signin"
  | "create-account"
  | "upload-schedule"
  | "confirm-classes"
  | "connect-classroom"
  | "importing-coursework"
  | "coursework-found"
  | "add-commitments"
  | "planner";

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");

  // Keep the activities in app state while the app is running.
  const [commitments, setCommitments] = useState<Commitment[]>([]);

  if (screen === "planner") {
    return <PlannerScreen commitments={commitments} />;
  }

  if (screen === "add-commitments") {
    return (
      <AddCommitmentsScreen
        onBack={() => setScreen("coursework-found")}
        onContinue={(savedCommitments) => {
          setCommitments(savedCommitments);
          setScreen("planner");
        }}
      />
    );
  }

  if (screen === "importing-coursework") {
    return (
      <ImportingCourseworkScreen
        onComplete={() => setScreen("coursework-found")}
      />
    );
  }

  if (screen === "coursework-found") {
    return (
      <CourseworkFoundScreen
        onBack={() => setScreen("connect-classroom")}
        onContinue={() => setScreen("add-commitments")}
      />
    );
  }

  if (screen === "connect-classroom") {
    return (
      <ConnectClassroomScreen
        onBack={() => setScreen("confirm-classes")}
        onConnect={() => setScreen("importing-coursework")}
        onSkip={() => setScreen("add-commitments")}
      />
    );
  }

  if (screen === "confirm-classes") {
    return (
      <ConfirmClassesScreen
        onBack={() => setScreen("upload-schedule")}
        onContinue={() => setScreen("connect-classroom")}
      />
    );
  }

  if (screen === "upload-schedule") {
    return (
      <UploadScheduleScreen
        onBack={() => setScreen("welcome")}
        onContinue={() => setScreen("confirm-classes")}
      />
    );
  }

  if (screen === "create-account") {
    return (
      <CreateAccountScreen
        onBack={() => setScreen("signin")}
        onAccountCreated={() => setScreen("signin")}
        onSignIn={() => setScreen("signin")}
      />
    );
  }

  if (screen === "signin") {
    return (
      <SignInScreen
        onBack={() => setScreen("welcome")}
        onCreateAccount={() => setScreen("create-account")}
      />
    );
  }

  return (
    <WelcomeScreen
      onCreateSchedule={() => setScreen("upload-schedule")}
      onSignIn={() => setScreen("signin")}
    />
  );
}