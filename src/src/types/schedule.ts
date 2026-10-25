
export type SemesterNumber = 1 | 2;

export type ExtractedClass = {
    id: string;
    name: string;
    teacher: string | null;
    period: string | null;
    startTime: string | null;
    endTime: string | null;
    semester: SemesterNumber | null;
    kind: "class" | "lunch" | "free";
};

export type ExtractedSemester = {
    semester: SemesterNumber;
    startDate: string | null;
    endDate: string | null;
    classes: ExtractedClass[];
};

export type ScheduleExtractionResult = {
    semesters: ExtractedSemester[];
    warnings: string[];
};
