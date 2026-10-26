
export type GoogleClassroomCourse = {
    id: string;
    name: string;
    section?: string;
};

export type GoogleClassroomAssignment = {
    id: string;
    courseId: string;
    title: string;
    description?: string;
    dueDate?: string;
    dueTime?: string;
    workType?: string;
    alternateLink?: string;
};

const API_BASE = "https://classroom.googleapis.com/v1";

async function classroomRequest<T>(
    path: string,
    accessToken: string
): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const body = await response.text();

        throw new Error(
            `Google Classroom request failed (${response.status}): ${body}`
        );
    }

    return response.json() as Promise<T>;
}

export async function getClassroomCourses(
    accessToken: string
): Promise<GoogleClassroomCourse[]> {
    const courses: GoogleClassroomCourse[] = [];
    let pageToken: string | undefined;

    do {
        const params = new URLSearchParams({
            courseStates: "ACTIVE",
            pageSize: "100",
        });

        if (pageToken) {
            params.set("pageToken", pageToken);
        }

        const result = await classroomRequest<{
            courses?: GoogleClassroomCourse[];
            nextPageToken?: string;
        }>(`/courses?${params.toString()}`, accessToken);

        courses.push(...(result.courses ?? []));
        pageToken = result.nextPageToken;
    } while (pageToken);

    return courses;
}

export async function getClassroomAssignments(
    accessToken: string,
    courseId: string
): Promise<GoogleClassroomAssignment[]> {
    const assignments: GoogleClassroomAssignment[] = [];
    let pageToken: string | undefined;

    do {
        const params = new URLSearchParams({
            pageSize: "100",
        });

        if (pageToken) {
            params.set("pageToken", pageToken);
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
            `/courses/${encodeURIComponent(courseId)}/courseWork?${params.toString()}`,
            accessToken
        );

        for (const work of result.courseWork ?? []) {
            const dueDate = work.dueDate
                ? [
                    work.dueDate.year,
                    String(work.dueDate.month).padStart(2, "0"),
                    String(work.dueDate.day).padStart(2, "0"),
                ].join("-")
                : undefined;

            const dueTime = work.dueTime
                ? `${String(work.dueTime.hours ?? 0).padStart(2, "0")}:${String(
                    work.dueTime.minutes ?? 0
                ).padStart(2, "0")}`
                : undefined;

            assignments.push({
                id: work.id,
                courseId: work.courseId,
                title: work.title,
                description: work.description,
                dueDate,
                dueTime,
                workType: work.workType,
                alternateLink: work.alternateLink,
            });
        }

        pageToken = result.nextPageToken;
    } while (pageToken);

    return assignments;
}

export async function importGoogleClassroom(
    accessToken: string
) {
    const courses = await getClassroomCourses(accessToken);

    const assignmentsByCourse = await Promise.all(
        courses.map(async (course) => ({
            course,
            assignments: await getClassroomAssignments(
                accessToken,
                course.id
            ),
        }))
    );

    return {
        courses,
        assignments: assignmentsByCourse.flatMap(
            ({ assignments }) => assignments
        ),
    };
}
