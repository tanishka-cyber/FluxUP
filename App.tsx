
import React, { useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  GoogleOAuthProvider,
  useGoogleLogin,
} from '@react-oauth/google';

import { supabase } from './src/services/supabase';

import WelcomeScreen from './src/screens/WelcomeScreen';
import SignInScreen from './src/screens/SignInScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import UploadScheduleScreen, {
  type SelectedScheduleFile,
} from './src/screens/UploadScheduleScreen';
import ConfirmClassesScreen, {
  type ClassItem,
} from './src/screens/ConfirmClassesScreen';
import type { ScheduleExtractionResult } from './src/types/schedule';
import { parseScheduleText } from './src/services/parseSchedule';
import ConnectClassroomScreen from './src/screens/ConnectClassroomScreen';
import ImportingCourseworkScreen from './src/screens/ImportingCourseworkScreen';
import CourseworkFoundScreen from './src/screens/CourseworkFoundScreen';
import AddCommitmentsScreen from './src/screens/AddCommitmentsScreen';
import PlannerScreen, {
  type Commitment,
} from './src/screens/PlannerScreen';
import FocusTimerScreen from './src/screens/FocusTimerScreen';
import ClassDetailsScreen from './src/screens/ClassDetailsScreen';
import AssignmentDetailsScreen from './src/screens/AssignmentDetailsScreen';
import TestDetailsScreen from './src/screens/TestDetailsScreen';
import MonthlyCalendarScreen from './src/screens/MonthlyCalendarScreen';
import TasksScreen, {
  type TaskItem,
} from './src/screens/TasksScreen';
import TaskDetailsScreen from './src/screens/TaskDetailsScreen';
import AddNewItemScreen, {
  type NewPlannerItem,
} from './src/screens/AddNewItemScreen';
import MoreScreen from './src/screens/MoreScreen';
import ProfileScreen, {
  type StudentProfile,
} from './src/screens/ProfileScreen';
import UpdateScheduleScreen from './src/screens/UpdateScheduleScreen';
import UpdateScheduleMenuScreen from './src/screens/UpdateScheduleMenuScreen';
import FluxAIScreen from './src/screens/FluxAIScreen';
import AIPreviewChangesScreen, {
  DEMO_AI_CHANGES,
  type AIChange,
} from './src/screens/AIPreviewChangesScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import NotificationSettingsScreen, {
  DEFAULT_NOTIFICATION_PREFERENCES,
  type NotificationPreferences,
} from './src/screens/NotificationSettingsScreen';

type Screen =
  | 'welcome'
  | 'signin'
  | 'create-account'
  | 'upload-schedule'
  | 'reading-schedule'
  | 'confirm-classes'
  | 'connect-classroom'
  | 'importing-coursework'
  | 'coursework-found'
  | 'add-commitments'
  | 'planner'
  | 'focus-timer'
  | 'class-details'
  | 'assignment-details'
  | 'test-details'
  | 'monthly-calendar'
  | 'tasks'
  | 'task-details'
  | 'add-new-item'
  | 'more'
  | 'profile'
  | 'update-schedule'
  | 'update-schedule-menu'
  | 'flux-ai'
  | 'ai-preview-changes'
  | 'notifications'
  | 'notification-settings';

type DetailsReturnScreen =
  | 'planner'
  | 'monthly-calendar'
  | 'class-details'
  | 'tasks';

type AIReturnScreen = 'planner' | 'more';

type ScheduleEditTab = 'classes' | 'commitments';

type ClassroomReturnScreen = 'add-commitments' | 'more';

// Additional coursework fields saved in Supabase.
type RichItem = NewPlannerItem & {
  description?: string;
  checklist?: string[];
  checkedSteps?: string[];
  estimatedMinutes?: number;
};

type PlannerData = {
  classes: ClassItem[];
  commitments: Commitment[];
  plannerItems: NewPlannerItem[];
};

type GoogleClassroomCourse = {
  id: string;
  name: string;
  section?: string;
};

type GoogleClassroomAssignment = {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  workType?: string;
  alternateLink?: string;
};

type GoogleImportResult = {
  courses: GoogleClassroomCourse[];
  assignments: GoogleClassroomAssignment[];
};

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
].join(' ');

const GOOGLE_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '';

const emptyProfile: StudentProfile = {
  name: '',
  email: '',
  school: '',
  grade: '11th Grade',
};

function showMessage(title: string, message: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    Alert.alert(title, message);
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'An unexpected error occurred.';
}

function startingScreen(session: Session): Screen {
  return session.user.user_metadata?.onboarding_completed === true
    ? 'planner'
    : 'upload-schedule';
}

function emptyPlanner(): PlannerData {
  return {
    classes: [],
    commitments: [],
    plannerItems: [],
  };
}

// ==========================================
// DEMO COURSEWORK
// ==========================================

const DEMO_PREFIX = 'fluxup-demo-';

const DEMO_STEPS = [
  'Review class notes and instructions',
  'Complete the first practice section',
  'Check answers and revise mistakes',
  'Finish and submit the work',
];

const TEST_STEPS = [
  'Review key concepts and vocabulary',
  'Make a study guide',
  'Complete practice questions',
  'Review missed questions',
  'Prepare for test day',
];

type DemoTemplate = {
  id: string;
  course: string;
  title: string;
  type: 'assignment' | 'test';
  days: number;
  priority: 'High' | 'Medium' | 'Low';
  notes: string;
  description: string;
  checklist: string[];
  estimatedMinutes: number;
};

const DEMO_TEMPLATES: DemoTemplate[] = [
  {
    id: 'physics-forces',
    course: 'AP Physics',
    title: 'Forces and Motion Problem Set',
    type: 'assignment',
    days: 2,
    priority: 'High',
    estimatedMinutes: 45,
    notes: "Practice Newton's laws and free-body diagrams.",
    description:
      "Complete a practice problem set covering Newton's laws, " +
      'free-body diagrams, net force, acceleration, and motion. ' +
      'Show your calculations and check your units.',
    checklist: [
      "Review Newton's three laws",
      'Draw free-body diagrams',
      'Solve net force and acceleration problems',
      'Check calculations and units',
      'Submit the completed problem set',
    ],
  },
  {
    id: 'algebra-matrices',
    course: 'Linear Algebra',
    title: 'Matrix Transformations Homework',
    type: 'assignment',
    days: 3,
    priority: 'Medium',
    estimatedMinutes: 60,
    notes: 'Review matrix operations and linear transformations.',
    description:
      'Practice matrix multiplication and linear transformations. ' +
      'Work through examples, show intermediate steps, and ' +
      'explain how matrices transform vectors.',
    checklist: [
      'Review matrix multiplication',
      'Practice transformation matrices',
      'Solve the assigned problems',
      'Check dimensions and calculations',
      'Submit the homework',
    ],
  },
  {
    id: 'business-market',
    course: 'AP Business',
    title: 'Market Analysis Presentation',
    type: 'assignment',
    days: 5,
    priority: 'High',
    estimatedMinutes: 90,
    notes: 'Prepare slides analyzing a target market.',
    description:
      'Create a presentation analyzing a target market. ' +
      'Identify customer segments, competitors, market trends, ' +
      'and opportunities. Support your recommendations with evidence.',
    checklist: [
      'Choose a target market',
      'Research customer needs and competitors',
      'Identify trends and opportunities',
      'Create presentation slides',
      'Review and rehearse the presentation',
    ],
  },
  {
    id: 'english-essay',
    course: 'English',
    title: 'Literary Analysis Essay',
    type: 'assignment',
    days: 8,
    priority: 'Medium',
    estimatedMinutes: 75,
    notes: 'Complete essay draft and check citations.',
    description:
      'Write a literary analysis essay with a clear thesis, ' +
      'supporting evidence, and commentary. Revise the organization, ' +
      'grammar, and citations before submission.',
    checklist: [
      'Develop a thesis statement',
      'Choose supporting textual evidence',
      'Write the introduction and body paragraphs',
      'Revise analysis and transitions',
      'Proofread citations and submit',
    ],
  },
  {
    id: 'physics-test',
    course: 'AP Physics',
    title: 'Unit 3 Physics Test',
    type: 'test',
    days: 10,
    priority: 'High',
    estimatedMinutes: 60,
    notes: "Review forces, motion, and Newton's laws.",
    description:
      'Prepare for the physics unit test covering forces, ' +
      "Newton's laws, motion, and free-body diagrams. " +
      'Use class notes and practice problems to identify topics ' +
      'that need additional review.',
    checklist: [
      "Review Newton's laws and key formulas",
      'Practice free-body diagrams',
      'Solve force and motion questions',
      'Review incorrect practice answers',
      'Prepare materials for test day',
    ],
  },
];

function normalizeCourse(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function demoDate(days: number) {
  const d = new Date();

  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);

  return (
    `${d.getFullYear()}-` +
    `${String(d.getMonth() + 1).padStart(2, '0')}-` +
    `${String(d.getDate()).padStart(2, '0')}`
  );
}

function createDemoItems(
  classes: ClassItem[],
  existing: NewPlannerItem[]
): NewPlannerItem[] {
  const ids = new Set(existing.map(item => item.id));

  const available = classes.filter(
    course => course.id && course.name?.trim()
  );

  const result: NewPlannerItem[] = [];

  if (!available.length) {
    return result;
  }

  for (let index = 0; index < DEMO_TEMPLATES.length; index++) {
    const template = DEMO_TEMPLATES[index];
    const expected = normalizeCourse(template.course);

    const matched = available.find(course => {
      const name = normalizeCourse(course.name);

      return (
        name === expected ||
        name.includes(expected) ||
        expected.includes(name)
      );
    });

    // Always use an existing class period.
    // Never create additional periods for demo coursework.
    const course = matched ?? available[index % available.length];

    const id = DEMO_PREFIX + template.id;

    if (ids.has(id)) {
      continue;
    }

    ids.add(id);

    const title = matched
      ? template.title
      : template.type === 'test'
        ? `${course.name} Unit Review Test`
        : `${course.name} Practice Assignment`;

    const item: RichItem = {
      id,
      type: template.type,
      title,
      classId: course.id,
      dueDate: demoDate(template.days),
      priority: template.priority,
      notes:
        `${template.notes}\n\n` +
        'SAMPLE coursework for the FluxUP demo.',
      completed: false,

      // Description and checklist are saved with the item.
      description: matched
        ? template.description
        : `Practice the current topics in ${course.name}. ` +
        'Review class materials, complete the work, ' +
        'and check your understanding.',

      checklist: matched
        ? [...template.checklist]
        : template.type === 'test'
          ? [...TEST_STEPS]
          : [...DEMO_STEPS],

      checkedSteps: [],

      // Estimated time is in minutes.
      estimatedMinutes: template.estimatedMinutes,
    };

    result.push(item);
  }

  return result;
}

// Refresh demo information without losing completed steps.
function refreshDemoItems(
  classes: ClassItem[],
  currentItems: NewPlannerItem[]
): NewPlannerItem[] {
  const personalItems = currentItems.filter(
    item => !item.id.startsWith(DEMO_PREFIX)
  );

  const oldDemoItems = currentItems.filter(
    item => item.id.startsWith(DEMO_PREFIX)
  ) as RichItem[];

  const freshDemoItems = createDemoItems(
    classes,
    personalItems
  ) as RichItem[];

  const previousById = new Map(
    oldDemoItems.map(item => [item.id, item])
  );

  const mergedDemoItems = freshDemoItems.map(fresh => {
    const previous = previousById.get(fresh.id);

    if (!previous) {
      return fresh;
    }

    return {
      ...fresh,
      completed: previous.completed,
      checkedSteps: previous.checkedSteps ?? [],
      // Keep a user's existing due date if they changed it.
      dueDate: previous.dueDate || fresh.dueDate,
    };
  });

  return [...personalItems, ...mergedDemoItems];
}

// ==========================================
// GOOGLE CLASSROOM
// ==========================================

const CLASSROOM_API =
  'https://classroom.googleapis.com/v1';

async function classroomRequest<T>(
  path: string,
  token: string
): Promise<T> {
  const response = await fetch(`${CLASSROOM_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        'Your Google authorization expired. Please connect again.'
      );
    }

    if (response.status === 403) {
      throw new Error(
        'Google Classroom access was denied. Your school may ' +
        'restrict third-party apps.'
      );
    }

    throw new Error(
      `Google Classroom API error (${response.status}): ` +
      `${(await response.text()).slice(0, 500)}`
    );
  }

  return (await response.json()) as T;
}

async function fetchGoogleCourses(
  token: string
): Promise<GoogleClassroomCourse[]> {
  const courses: GoogleClassroomCourse[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      courseStates: 'ACTIVE',
      pageSize: '100',
    });

    if (pageToken) {
      params.set('pageToken', pageToken);
    }

    const result = await classroomRequest<{
      courses?: GoogleClassroomCourse[];
      nextPageToken?: string;
    }>(`/courses?${params}`, token);

    courses.push(...(result.courses ?? []));
    pageToken = result.nextPageToken;
  } while (pageToken);

  return courses;
}

async function fetchCourseAssignments(
  token: string,
  courseId: string
): Promise<GoogleClassroomAssignment[]> {
  const assignments: GoogleClassroomAssignment[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      pageSize: '100',
    });

    if (pageToken) {
      params.set('pageToken', pageToken);
    }

    const result = await classroomRequest<{
      courseWork?: Array<{
        id: string;
        courseId: string;
        title: string;
        description?: string;
        dueDate?: {
          year: number;
          month: number;
          day: number;
        };
        dueTime?: {
          hours?: number;
          minutes?: number;
        };
        workType?: string;
        alternateLink?: string;
      }>;
      nextPageToken?: string;
    }>(
      `/courses/${encodeURIComponent(courseId)}/courseWork?${params}`,
      token
    );

    for (const work of result.courseWork ?? []) {
      assignments.push({
        id: work.id,
        courseId: work.courseId,
        title: work.title,
        description: work.description,
        dueDate: work.dueDate
          ? `${work.dueDate.year}-` +
          `${String(work.dueDate.month).padStart(2, '0')}-` +
          `${String(work.dueDate.day).padStart(2, '0')}`
          : undefined,
        dueTime: work.dueTime
          ? `${String(work.dueTime.hours ?? 0).padStart(2, '0')}:` +
          `${String(work.dueTime.minutes ?? 0).padStart(2, '0')}`
          : undefined,
        workType: work.workType,
        alternateLink: work.alternateLink,
      });
    }

    pageToken = result.nextPageToken;
  } while (pageToken);

  return assignments;
}

async function importGoogleClassroom(
  token: string
): Promise<GoogleImportResult> {
  const courses = await fetchGoogleCourses(token);
  const assignments: GoogleClassroomAssignment[] = [];

  for (const course of courses) {
    assignments.push(
      ...(await fetchCourseAssignments(token, course.id))
    );
  }

  return {
    courses,
    assignments,
  };
}

function GoogleConnection({
  onBack,
  onSkip,
  onImported,
}: {
  onBack: () => void;
  onSkip: () => void;
  onImported: (result: GoogleImportResult) => void;
}) {
  const [connecting, setConnecting] = useState(false);

  const login = useGoogleLogin({
    flow: 'implicit',
    scope: GOOGLE_SCOPES,

    onSuccess: async response => {
      try {
        onImported(
          await importGoogleClassroom(response.access_token)
        );
      } catch (error) {
        showMessage(
          'Google Classroom import failed',
          errorMessage(error)
        );
      } finally {
        setConnecting(false);
      }
    },

    onError: () => {
      setConnecting(false);
      showMessage(
        'Google connection failed',
        'Google could not authorize FluxUP.'
      );
    },

    onNonOAuthError: error => {
      setConnecting(false);

      if (error.type !== 'popup_closed') {
        showMessage(
          'Google connection failed',
          error.type === 'popup_failed_to_open'
            ? 'Allow popups for FluxUP.'
            : 'Could not open Google sign-in.'
        );
      }
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <ConnectClassroomScreen
        onBack={onBack}
        onSkip={onSkip}
        onConnect={() => {
          if (!connecting) {
            setConnecting(true);
            login();
          }
        }}
      />

      {connecting && (
        <View style={styles.overlay}>
          <ActivityIndicator
            size="large"
            color="#087F70"
          />

          <Text style={styles.loadingTitle}>
            Connecting Google Classroom
          </Text>

          <Text style={styles.loadingSubtitle}>
            Authorize access in Google's popup.
          </Text>
        </View>
      )}
    </View>
  );
}

function LoadingScreen({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator
        size="large"
        color="#367A55"
      />

      <Text style={styles.loadingTitle}>
        {title}
      </Text>

      <Text style={styles.loadingSubtitle}>
        {subtitle}
      </Text>
    </View>
  );
}

// ==========================================
// MAIN APP
// ==========================================

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');

  const [session, setSession] =
    useState<Session | null>(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [demoBusy, setDemoBusy] = useState(false);

  const [aiReturnScreen, setAiReturnScreen] =
    useState<AIReturnScreen>('planner');

  const [scheduleFile, setScheduleFile] =
    useState<SelectedScheduleFile | null>(null);

  const [scheduleExtraction, setScheduleExtraction] =
    useState<ScheduleExtractionResult | null>(null);

  const [confirmationVersion, setConfirmationVersion] =
    useState(0);

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [commitments, setCommitments] =
    useState<Commitment[]>([]);

  const [plannerItems, setPlannerItems] =
    useState<NewPlannerItem[]>([]);

  const [profile, setProfile] =
    useState<StudentProfile>(emptyProfile);

  const [aiChanges, setAiChanges] = useState<AIChange[]>(
    DEMO_AI_CHANGES.map(change => ({ ...change }))
  );

  const [
    notificationPreferences,
    setNotificationPreferences,
  ] = useState<NotificationPreferences>({
    ...DEFAULT_NOTIFICATION_PREFERENCES,
  });

  const [scheduleEditTab, setScheduleEditTab] =
    useState<ScheduleEditTab>('classes');

  const [selectedClass, setSelectedClass] =
    useState('AP Physics');

  const [selectedAssignment, setSelectedAssignment] =
    useState({
      title: 'Forces & Motion review',
      className: 'AP Physics',
      dueDate: 'Not specified',
    });

  const [selectedItemId, setSelectedItemId] =
    useState<string | null>(null);

  const [selectedTask, setSelectedTask] =
    useState<TaskItem | null>(null);

  const [detailsReturnScreen, setDetailsReturnScreen] =
    useState<DetailsReturnScreen>('planner');

  const [importedCourses, setImportedCourses] =
    useState<GoogleClassroomCourse[]>([]);

  const [importedAssignments, setImportedAssignments] =
    useState<GoogleClassroomAssignment[]>([]);

  const [classroomReturnScreen, setClassroomReturnScreen] =
    useState<ClassroomReturnScreen>('add-commitments');

  const plannerRef = useRef<PlannerData>(emptyPlanner());

  const accountVersionRef = useRef(0);

  const activeUserRef = useRef<string | null>(null);

  const saveQueueRef =
    useRef<Promise<void>>(Promise.resolve());

  // ==========================================
  // PLANNER DATA AND SUPABASE
  // ==========================================

  function applyPlannerData(data: PlannerData) {
    plannerRef.current = data;
    setClasses(data.classes);
    setCommitments(data.commitments);
    setPlannerItems(data.plannerItems);
  }

  function resetAccountData() {
    applyPlannerData(emptyPlanner());
    setProfile({ ...emptyProfile });
    setScheduleFile(null);
    setScheduleExtraction(null);
    setImportedCourses([]);
    setImportedAssignments([]);
  }

  async function loadPlanner(userId: string) {
    const version = accountVersionRef.current;

    const { data, error } = await supabase
      .from('student_planners')
      .select('classes, commitments, planner_items')
      .eq('user_id', userId)
      .maybeSingle();

    if (
      version !== accountVersionRef.current ||
      activeUserRef.current !== userId
    ) {
      return;
    }

    if (error) {
      throw new Error(error.message);
    }

    applyPlannerData(
      data
        ? {
          classes: Array.isArray(data.classes)
            ? (data.classes as ClassItem[])
            : [],
          commitments: Array.isArray(data.commitments)
            ? (data.commitments as Commitment[])
            : [],
          plannerItems: Array.isArray(data.planner_items)
            ? (data.planner_items as NewPlannerItem[])
            : [],
        }
        : emptyPlanner()
    );
  }

  function savePlanner(data: PlannerData): Promise<void> {
    const userId = activeUserRef.current;
    const version = accountVersionRef.current;

    if (!userId) {
      return Promise.reject(
        new Error('Please sign in to save your planner.')
      );
    }

    const snapshot = {
      classes: [...data.classes],
      commitments: [...data.commitments],
      plannerItems: [...data.plannerItems],
    };

    const operation = saveQueueRef.current
      .catch(() => { })
      .then(async () => {
        if (
          activeUserRef.current !== userId ||
          accountVersionRef.current !== version
        ) {
          throw new Error(
            'Your account changed before saving.'
          );
        }

        const { error } = await supabase
          .from('student_planners')
          .upsert(
            {
              user_id: userId,
              classes: snapshot.classes,
              commitments: snapshot.commitments,
              planner_items: snapshot.plannerItems,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'user_id',
            }
          );

        if (error) {
          throw new Error(error.message);
        }
      });

    saveQueueRef.current = operation;

    return operation;
  }

  async function saveChanges(data: PlannerData) {
    const previous = plannerRef.current;

    applyPlannerData(data);

    try {
      await savePlanner(data);
    } catch (error) {
      if (plannerRef.current === data) {
        applyPlannerData(previous);
      }

      showMessage(
        'Could not save changes',
        errorMessage(error)
      );

      throw error;
    }
  }

  // ==========================================
  // DEMO DATA ACTIONS
  // ==========================================

  async function loadDemoData() {
    if (demoBusy) {
      return;
    }

    setDemoBusy(true);

    try {
      const current = plannerRef.current;
      const existingClasses = current.classes;

      if (!existingClasses.length) {
        showMessage(
          'No existing classes',
          'Add or restore your real classes first. ' +
          'Demo mode never creates class periods.'
        );
        return;
      }

      const updatedItems = refreshDemoItems(
        existingClasses,
        current.plannerItems
      );

      const demoCount = updatedItems.filter(
        item => item.id.startsWith(DEMO_PREFIX)
      ).length;

      if (!demoCount) {
        showMessage(
          'No usable classes',
          'Your saved class periods need names before ' +
          'sample coursework can be attached.'
        );
        return;
      }

      await saveChanges({
        ...current,
        classes: current.classes,
        plannerItems: updatedItems,
      });

      showMessage(
        'Demo ready',
        `${demoCount} SAMPLE coursework items were placed ` +
        'inside your existing class periods. ' +
        'Estimated completion times have been added. ' +
        'No class periods were created.'
      );

      setScreen('planner');
    } catch {
      // saveChanges displays save errors.
    } finally {
      setDemoBusy(false);
    }
  }

  async function removeDemoData() {
    if (demoBusy) {
      return;
    }

    const current = plannerRef.current;

    const removed = current.plannerItems.filter(
      item => item.id.startsWith(DEMO_PREFIX)
    ).length;

    const demoClasses = current.classes.filter(
      course => course.id.startsWith(DEMO_PREFIX)
    );

    if (!removed && !demoClasses.length) {
      showMessage(
        'No sample data',
        'There is no sample data to remove.'
      );
      return;
    }

    setDemoBusy(true);

    try {
      await saveChanges({
        ...current,
        plannerItems: current.plannerItems.filter(
          item => !item.id.startsWith(DEMO_PREFIX)
        ),
        classes: current.classes,
      });

      showMessage(
        'Sample data removed',
        `Removed ${removed} sample assignments. ` +
        'All class periods were kept.'
      );
    } catch {
      // saveChanges displays save errors.
    } finally {
      setDemoBusy(false);
    }
  }

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  useEffect(() => {
    let active = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        if (!active) {
          return;
        }

        setSession(nextSession);

        if (event === 'SIGNED_OUT') {
          accountVersionRef.current++;
          activeUserRef.current = null;
          saveQueueRef.current = Promise.resolve();

          resetAccountData();
          setAuthLoading(false);
          setScreen('welcome');
        }
      }
    );

    async function restore() {
      try {
        const { data, error } =
          await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!active) {
          return;
        }

        setSession(data.session);

        if (data.session) {
          const id = data.session.user.id;

          if (activeUserRef.current !== id) {
            accountVersionRef.current++;
            activeUserRef.current = id;
            saveQueueRef.current = Promise.resolve();
            resetAccountData();
          }

          await loadPlanner(id);

          if (active) {
            setScreen(startingScreen(data.session));
          }
        }
      } catch (error) {
        console.error(
          '[FluxUP] Restore failed:',
          error
        );

        if (active) {
          showMessage(
            'Could not load your account',
            'Check your connection and refresh. ' +
            'Your saved data has not been deleted.'
          );
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    }

    void restore();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function finishAuthentication() {
    setAuthLoading(true);

    try {
      const { data, error } =
        await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (!data.session) {
        throw new Error(
          'No active session was found.'
        );
      }

      const id = data.session.user.id;

      if (activeUserRef.current !== id) {
        accountVersionRef.current++;
        activeUserRef.current = id;
        saveQueueRef.current = Promise.resolve();
        resetAccountData();
      }

      setSession(data.session);
      await loadPlanner(id);

      setScreen(startingScreen(data.session));
    } catch (error) {
      showMessage(
        'Sign in problem',
        errorMessage(error)
      );
    } finally {
      setAuthLoading(false);
    }
  }

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    const user = session.user;

    setProfile(current => ({
      ...current,
      name:
        current.name ||
        (typeof user.user_metadata?.full_name === 'string'
          ? user.user_metadata.full_name
          : ''),
      email: user.email ?? current.email,
    }));
  }, [session?.user.id, session?.user.email]);

  async function handleLogout() {
    setAuthLoading(true);

    try {
      await saveQueueRef.current;

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      accountVersionRef.current++;
      activeUserRef.current = null;

      resetAccountData();
      setSession(null);
      setScreen('welcome');
    } catch (error) {
      showMessage(
        'Sign out failed',
        errorMessage(error)
      );
    } finally {
      setAuthLoading(false);
    }
  }

  // ==========================================
  // SCHEDULE IMPORT
  // ==========================================

  async function handleScheduleUpload(
    file: SelectedScheduleFile | null
  ) {
    setScheduleFile(file);
    setScheduleExtraction(null);

    if (!file) {
      setConfirmationVersion(version => version + 1);
      setScreen('confirm-classes');
      return;
    }

    if (Platform.OS !== 'web') {
      showMessage(
        'Web version required',
        'Automatic schedule reading currently works ' +
        'in FluxUP Web.'
      );
      return;
    }

    setScreen('reading-schedule');

    try {
      const pdf =
        file.mimeType === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf');

      let browserFile = file.file;

      if (!browserFile) {
        const response = await fetch(file.uri);

        if (!response.ok) {
          throw new Error(
            'Could not open the selected schedule.'
          );
        }

        const blob = await response.blob();

        browserFile = new File(
          [blob],
          file.name,
          {
            type:
              file.mimeType ||
              blob.type ||
              (pdf ? 'application/pdf' : 'image/png'),
          }
        );
      }

      let extracted = '';

      if (pdf) {
        const { extractSchedulePDF } = await import(
          './src/services/schedulePDF.web'
        );

        extracted = (
          await extractSchedulePDF(browserFile)
        ).text;
      } else {
        const { extractScheduleText } = await import(
          './src/services/scheduleOCR.web'
        );

        extracted = (
          await extractScheduleText(browserFile)
        ).text;
      }

      if (!extracted.trim()) {
        throw new Error(
          'No readable text was found in this schedule.'
        );
      }

      setScheduleExtraction(
        parseScheduleText(extracted)
      );

      setConfirmationVersion(version => version + 1);
      setScreen('confirm-classes');
    } catch (error) {
      showMessage(
        'Could not read schedule',
        errorMessage(error)
      );

      setScheduleExtraction(null);
      setScreen('upload-schedule');
    }
  }

  function openGoogleClassroom(
    from: ClassroomReturnScreen
  ) {
    setClassroomReturnScreen(from);
    setImportedCourses([]);
    setImportedAssignments([]);
    setScreen('connect-classroom');
  }

  function openAI(from: AIReturnScreen) {
    setAiReturnScreen(from);
    setScreen('flux-ai');
  }

  // ==========================================
  // COURSEWORK DETAILS
  // ==========================================

  function openAssignment(
    title: string,
    className: string,
    from: DetailsReturnScreen,
    dueDate = 'Not specified'
  ) {
    const found = plannerRef.current.plannerItems.find(
      item =>
        item.title === title &&
        classes.find(course => course.id === item.classId)
          ?.name === className
    );

    setSelectedItemId(found?.id ?? null);

    setSelectedAssignment({
      title,
      className,
      dueDate,
    });

    setDetailsReturnScreen(from);
    setScreen('assignment-details');
  }

  function openTest(
    className: string,
    from: DetailsReturnScreen,
    title?: string
  ) {
    const found = plannerRef.current.plannerItems.find(
      item =>
        item.type === 'test' &&
        classes.find(course => course.id === item.classId)
          ?.name === className &&
        (!title || item.title === title)
    );

    setSelectedItemId(found?.id ?? null);
    setSelectedClass(className);
    setDetailsReturnScreen(from);
    setScreen('test-details');
  }

  async function updateChecklist(
    id: string,
    step: string
  ) {
    const current = plannerRef.current;

    const next = current.plannerItems.map(item => {
      if (item.id !== id) {
        return item;
      }

      const rich = item as RichItem;
      const checked = rich.checkedSteps ?? [];

      return {
        ...item,
        checkedSteps: checked.includes(step)
          ? checked.filter(value => value !== step)
          : [...checked, step],
      };
    });

    try {
      await saveChanges({
        ...current,
        plannerItems: next,
      });
    } catch {
      // saveChanges displays save errors.
    }
  }

  async function togglePlannerItem(id: string) {
    const current = plannerRef.current;

    try {
      await saveChanges({
        ...current,
        plannerItems: current.plannerItems.map(item =>
          item.id === id
            ? {
              ...item,
              completed: !item.completed,
            }
            : item
        ),
      });
    } catch {
      // saveChanges displays save errors.
    }
  }

  async function saveNewItem(item: NewPlannerItem) {
    const current = plannerRef.current;

    try {
      await saveChanges({
        ...current,
        plannerItems: [
          ...current.plannerItems,
          item,
        ],
      });

      setScreen('planner');
    } catch {
      // saveChanges displays save errors.
    }
  }

  async function saveSchedule(
    updatedClasses: ClassItem[],
    updatedCommitments: Commitment[]
  ) {
    try {
      await saveChanges({
        ...plannerRef.current,
        classes: updatedClasses,
        commitments: updatedCommitments,
      });

      setScreen('update-schedule-menu');
    } catch {
      // saveChanges displays save errors.
    }
  }

  async function finishOnboarding(
    saved: Commitment[]
  ) {
    if (!session) {
      showMessage(
        'Sign in required',
        'Please sign in before saving your schedule.'
      );

      setScreen('create-account');
      return;
    }

    try {
      await saveChanges({
        ...plannerRef.current,
        commitments: saved,
      });

      const { error } =
        await supabase.auth.updateUser({
          data: {
            onboarding_completed: true,
          },
        });

      if (error) {
        throw error;
      }

      setScreen('planner');
    } catch (error) {
      showMessage(
        'Setup not completed',
        errorMessage(error)
      );
    }
  }

  // ==========================================
  // LOADING SCREENS
  // ==========================================

  if (authLoading) {
    return (
      <LoadingScreen
        title="Opening FluxUP..."
        subtitle="Loading your saved schedule."
      />
    );
  }

  if (screen === 'reading-schedule') {
    return (
      <LoadingScreen
        title="Reading your schedule..."
        subtitle="FluxUP is identifying your classes, semesters, and periods."
      />
    );
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  if (screen === 'notification-settings') {
    return (
      <NotificationSettingsScreen
        preferences={notificationPreferences}
        onBack={() => setScreen('notifications')}
        onSave={preferences => {
          setNotificationPreferences(preferences);
          setScreen('notifications');
        }}
      />
    );
  }

  if (screen === 'notifications') {
    return (
      <NotificationsScreen
        onBack={() => setScreen('more')}
        onOpenPlanner={() => setScreen('planner')}
        onOpenTasks={() => setScreen('tasks')}
        onOpenSettings={() =>
          setScreen('notification-settings')
        }
      />
    );
  }

  // ==========================================
  // FLUX AI
  // ==========================================

  if (screen === 'ai-preview-changes') {
    return (
      <AIPreviewChangesScreen
        changes={aiChanges}
        onBack={() => setScreen('flux-ai')}
        onKeepOriginal={() => setScreen('planner')}
        onApplyChanges={approved => {
          showMessage(
            'Suggestions reviewed',
            `You approved ${approved.length} suggestions. ` +
            'This is a demo; your actual schedule has not changed.'
          );

          setScreen('planner');
        }}
      />
    );
  }

  if (screen === 'flux-ai') {
    return (
      <FluxAIScreen
        classes={classes}
        commitments={commitments}
        plannerItems={plannerItems}
        onBack={() => setScreen(aiReturnScreen)}
        onOpenPlanner={() => setScreen('planner')}
        onOpenTasks={() => setScreen('tasks')}
        onOpenAIPreview={() => {
          setAiChanges(
            DEMO_AI_CHANGES.map(change => ({ ...change }))
          );

          setScreen('ai-preview-changes');
        }}
      />
    );
  }

  // ==========================================
  // SCHEDULE MANAGEMENT
  // ==========================================

  if (screen === 'update-schedule-menu') {
    return (
      <UpdateScheduleMenuScreen
        classCount={classes.length}
        commitmentCount={commitments.length}
        onBack={() => setScreen('more')}
        onEditClasses={() => {
          setScheduleEditTab('classes');
          setScreen('update-schedule');
        }}
        onEditCommitments={() => {
          setScheduleEditTab('commitments');
          setScreen('update-schedule');
        }}
        onOpenPlanner={() => setScreen('planner')}
      />
    );
  }

  if (screen === 'update-schedule') {
    return (
      <UpdateScheduleScreen
        key={scheduleEditTab}
        initialTab={scheduleEditTab}
        classes={classes}
        commitments={commitments}
        onBack={() =>
          setScreen('update-schedule-menu')
        }
        onSave={saveSchedule}
      />
    );
  }

  if (screen === 'profile') {
    return (
      <ProfileScreen
        profile={profile}
        onBack={() => setScreen('more')}
        onSave={updatedProfile => {
          setProfile(updatedProfile);
          setScreen('more');
        }}
      />
    );
  }

  // ==========================================
  // MORE SCREEN
  // ==========================================

  if (screen === 'more') {
    return (
      <MoreScreen
        onBack={() => setScreen('planner')}
        onOpenProfile={() => setScreen('profile')}
        onUpdateSchedule={() =>
          setScreen('update-schedule-menu')
        }
        onOpenAI={() => openAI('more')}
        onOpenNotifications={() =>
          setScreen('notifications')
        }
        onOpenConnectedAccounts={() =>
          openGoogleClassroom('more')
        }
        onLogout={handleLogout}
        onLoadDemoData={() => {
          void loadDemoData();
        }}
        onClearDemoData={() => {
          void removeDemoData();
        }}
      />
    );
  }

  // ==========================================
  // ADD COURSEWORK
  // ==========================================

  if (screen === 'add-new-item') {
    return (
      <AddNewItemScreen
        classes={classes}
        onBack={() => setScreen('planner')}
        onSave={saveNewItem}
      />
    );
  }

  // ==========================================
  // TASKS
  // ==========================================

  if (screen === 'task-details' && selectedTask) {
    return (
      <TaskDetailsScreen
        task={selectedTask}
        onBack={() => setScreen('tasks')}
        onStatusChange={async (id, completed) => {
          const current = plannerRef.current;

          try {
            await saveChanges({
              ...current,
              plannerItems: current.plannerItems.map(
                item =>
                  item.id === id
                    ? { ...item, completed }
                    : item
              ),
            });

            setSelectedTask(previous =>
              previous?.id === id
                ? {
                  ...previous,
                  status: completed
                    ? 'completed'
                    : 'pending',
                }
                : previous
            );
          } catch {
            // saveChanges displays save errors.
          }
        }}
      />
    );
  }

  if (screen === 'tasks') {
    return (
      <TasksScreen
        onBack={() => setScreen('planner')}
        onOpenPlanner={() => setScreen('planner')}
        onOpenTask={task => {
          setSelectedTask(task);
          setScreen('task-details');
        }}
        onOpenAssignment={(title, name) =>
          openAssignment(title, name, 'tasks')
        }
        onOpenTest={name =>
          openTest(name, 'tasks')
        }
      />
    );
  }

  // ==========================================
  // MONTHLY CALENDAR
  // ==========================================

  if (screen === 'monthly-calendar') {
    return (
      <MonthlyCalendarScreen
        onBack={() => setScreen('planner')}
        onOpenPlanner={() => setScreen('planner')}
        onOpenTasks={() => setScreen('tasks')}
        onOpenAssignment={(title, name) =>
          openAssignment(
            title,
            name,
            'monthly-calendar'
          )
        }
        onOpenTest={name =>
          openTest(name, 'monthly-calendar')
        }
      />
    );
  }

  // ==========================================
  // TEST DETAILS
  // ==========================================

  if (screen === 'test-details') {
    return (
      <TestDetailsScreen
        item={
          plannerItems.find(
            item => item.id === selectedItemId
          ) as RichItem | undefined
        }
        onToggleStep={updateChecklist}
        className={selectedClass}
        onBack={() =>
          setScreen(detailsReturnScreen)
        }
      />
    );
  }

  // ==========================================
  // ASSIGNMENT DETAILS
  // ==========================================

  if (screen === 'assignment-details') {
    return (
      <AssignmentDetailsScreen
        item={
          plannerItems.find(
            item => item.id === selectedItemId
          ) as RichItem | undefined
        }
        onToggleStep={updateChecklist}
        onToggleComplete={togglePlannerItem}
        assignmentTitle={selectedAssignment.title}
        className={selectedAssignment.className}
        dueDate={selectedAssignment.dueDate}
        onBack={() =>
          setScreen(detailsReturnScreen)
        }
      />
    );
  }

  // ==========================================
  // CLASS DETAILS
  // ==========================================

  if (screen === 'class-details') {
    return (
      <ClassDetailsScreen
        className={selectedClass}
        onBack={() => setScreen('planner')}
        onOpenAssignment={(title, name) =>
          openAssignment(
            title,
            name,
            'class-details'
          )
        }
      />
    );
  }

  // ==========================================
  // FOCUS TIMER
  // ==========================================

  if (screen === 'focus-timer') {
    return (
      <FocusTimerScreen
        onBack={() => setScreen('planner')}
        plannerItems={plannerItems}
        classes={classes}
      />
    );
  }

  // ==========================================
  // MAIN PLANNER
  // ==========================================

  if (screen === 'planner') {
    return (
      <PlannerScreen
        classes={classes}
        commitments={commitments}
        plannerItems={plannerItems}
        onToggleItem={togglePlannerItem}
        onOpenClass={name => {
          setSelectedClass(name);
          setScreen('class-details');
        }}
        onOpenAssignment={(title, name) => {
          const item = plannerItems.find(
            item =>
              item.type === 'assignment' &&
              item.title === title &&
              classes.find(
                course => course.id === item.classId
              )?.name === name
          );

          openAssignment(
            title,
            name,
            'planner',
            item?.dueDate ?? 'Not specified'
          );
        }}
        onOpenTest={(name, title) =>
          openTest(name, 'planner', title)
        }
        onOpenMonth={() =>
          setScreen('monthly-calendar')
        }
        onOpenTasks={() =>
          setScreen('tasks')
        }
        onOpenFocus={() =>
          setScreen('focus-timer')
        }
        onAddItem={() =>
          setScreen('add-new-item')
        }
        onOpenMore={() =>
          setScreen('more')
        }
        onOpenAI={() =>
          openAI('planner')
        }
        onEditClasses={() => {
          setScheduleEditTab('classes');
          setScreen('update-schedule');
        }}
        onEditCommitments={() => {
          setScheduleEditTab('commitments');
          setScreen('update-schedule');
        }}
      />
    );
  }

  // ==========================================
  // ONBOARDING
  // ==========================================

  if (screen === 'add-commitments') {
    return (
      <AddCommitmentsScreen
        onBack={() =>
          setScreen('coursework-found')
        }
        onContinue={finishOnboarding}
      />
    );
  }

  if (screen === 'coursework-found') {
    return (
      <View style={{ flex: 1 }}>
        <CourseworkFoundScreen
          onBack={() =>
            setScreen('connect-classroom')
          }
          onContinue={() =>
            setScreen(
              classroomReturnScreen === 'more'
                ? 'more'
                : 'add-commitments'
            )
          }
        />

        {(
          importedCourses.length > 0 ||
          importedAssignments.length > 0
        ) && (
            <View style={styles.importNotice}>
              <Text style={styles.importNoticeText}>
                Google returned {importedCourses.length} courses
                and {importedAssignments.length} coursework
                items. The cards above are sample previews.
                No imported items have been saved yet.
              </Text>
            </View>
          )}
      </View>
    );
  }

  if (screen === 'importing-coursework') {
    return (
      <ImportingCourseworkScreen
        onComplete={() =>
          setScreen('coursework-found')
        }
      />
    );
  }

  if (screen === 'connect-classroom') {
    const back = () =>
      setScreen(
        classroomReturnScreen === 'more'
          ? 'more'
          : 'confirm-classes'
      );

    const skip = () =>
      setScreen(
        classroomReturnScreen === 'more'
          ? 'more'
          : 'add-commitments'
      );

    if (Platform.OS !== 'web') {
      return (
        <ConnectClassroomScreen
          onBack={back}
          onSkip={skip}
          onConnect={() =>
            showMessage(
              'Web version only',
              'Google Classroom connection is currently ' +
              'available in FluxUP Web.'
            )
          }
        />
      );
    }

    if (!GOOGLE_CLIENT_ID) {
      return (
        <ConnectClassroomScreen
          onBack={back}
          onSkip={skip}
          onConnect={() =>
            showMessage(
              'Google setup missing',
              'Add EXPO_PUBLIC_GOOGLE_CLIENT_ID to .env ' +
              'and restart Expo.'
            )
          }
        />
      );
    }

    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <GoogleConnection
          onBack={back}
          onSkip={skip}
          onImported={result => {
            setImportedCourses(result.courses);
            setImportedAssignments(result.assignments);
            setScreen('coursework-found');
          }}
        />
      </GoogleOAuthProvider>
    );
  }

  if (screen === 'confirm-classes') {
    return (
      <ConfirmClassesScreen
        key={confirmationVersion}
        initialClasses={classes}
        extraction={scheduleExtraction}
        onBack={() =>
          setScreen('upload-schedule')
        }
        onContinue={async confirmed => {
          try {
            await saveChanges({
              ...plannerRef.current,
              classes: confirmed,
            });

            setClassroomReturnScreen(
              'add-commitments'
            );

            setScreen('connect-classroom');
          } catch {
            // saveChanges displays save errors.
          }
        }}
      />
    );
  }

  if (screen === 'upload-schedule') {
    return (
      <UploadScheduleScreen
        onBack={() =>
          setScreen(
            session ? 'create-account' : 'welcome'
          )
        }
        onContinue={handleScheduleUpload}
      />
    );
  }

  if (screen === 'create-account') {
    return (
      <CreateAccountScreen
        onBack={() => setScreen('signin')}
        onAccountCreated={finishAuthentication}
        onSignIn={() => setScreen('signin')}
      />
    );
  }

  if (screen === 'signin') {
    return (
      <SignInScreen
        onBack={() => setScreen('welcome')}
        onCreateAccount={() =>
          setScreen('create-account')
        }
        onSignedIn={finishAuthentication}
      />
    );
  }

  return (
    <WelcomeScreen
      onCreateSchedule={() =>
        setScreen('create-account')
      }
      onSignIn={() => setScreen('signin')}
    />
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#F7F9F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  loadingTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#244F3A',
    marginTop: 24,
    textAlign: 'center',
  },

  loadingSubtitle: {
    fontSize: 14,
    color: '#64756B',
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 300,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  importNotice: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#FFF4D9',
    borderTopWidth: 1,
    borderTopColor: '#E7D5A7',
  },

  importNoticeText: {
    color: '#65501F',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
