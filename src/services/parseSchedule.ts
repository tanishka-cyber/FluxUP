
import type {
    ExtractedClass,
    ExtractedSemester,
    ScheduleExtractionResult,
    SemesterNumber,
    Weekday,
} from "../types/schedule";

type Kind = "class" | "free" | "lunch";

type ParsedRecord = {
    code: string;
    name: string;
    teacher: string | null;
    period: string;
    semester: SemesterNumber;
    kind: Kind;
    meetingDays: Weekday[];
};

const COURSE_CODE = /(?:\d{4,6}-\d+|OFFHR[12]-\d+)/i;
const DAYS: Weekday[] = ["M", "T", "W", "R", "F"];

function splitColumns(line: string): string[] {
    return line.split(/\s{3,}/).map(x => x.trim()).filter(Boolean);
}

function isCode(value: string): boolean {
    return COURSE_CODE.test(value);
}

function isHomeroom(name: string): boolean {
    return /\bhome\s*room\b|\badvisory\b/i.test(name);
}

function kindOf(name: string): Kind {
    if (/off\s*hour|free\s*period|study\s*hall/i.test(name)) {
        return "free";
    }
    if (/\blunch\b/i.test(name)) {
        return "lunch";
    }
    return "class";
}

function getDays(value: string): Weekday[] {
    const match = value.match(/\(([MTWRF,\s]+)\)/i);
    if (!match) return [];

    const found = match[1].toUpperCase().split(/[,\s]+/);
    return DAYS.filter(day => found.includes(day));
}

function toISO(value: string): string | null {
    const match = value.match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/
    );

    if (!match) return null;

    const year = match[3].length === 2
        ? 2000 + Number(match[3])
        : Number(match[3]);

    const month = Number(match[1]);
    const day = Number(match[2]);
    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) return null;

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function semesterDates(text: string, semester: SemesterNumber) {
    const label = semester === 1
        ? /(?:Term\s*S1|Semester\s*1)/i
        : /(?:Term\s*S2|Semester\s*2)/i;

    const start = text.search(label);
    const section = start < 0 ? "" : text.slice(start, start + 160);

    const range = section.match(
        /(\d{1,2}\/\d{1,2}\/\d{2,4})\s*[-–]\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/
    );

    return {
        startDate: range ? toISO(range[1]) : null,
        endDate: range ? toISO(range[2]) : null,
    };
}

function cleanName(value: string): string {
    return value
        .replace(/\s+/g, " ")
        .trim();
}

function extractPairedRows(lines: string[]): ParsedRecord[] {
    const records: ParsedRecord[] = [];
    let nextPeriod = 1;

    for (let i = 0; i < lines.length; i++) {
        const codes = splitColumns(lines[i]);

        if (
            codes.length < 2 ||
            !isCode(codes[0]) ||
            !isCode(codes[1])
        ) {
            continue;
        }

        let names: string[] | null = null;
        let teachers: string[] | null = null;

        for (let offset = 1; offset <= 6; offset++) {
            const following = lines[i + offset];
            if (!following) break;

            const parts = splitColumns(following);

            if (parts.length >= 2 && parts.every(isCode)) break;

            if (parts.length < 2) continue;

            if (/^(?:Rm:|Room:|Team:|Term\b)/i.test(parts[0])) {
                continue;
            }

            if (!names) {
                names = parts.slice(0, 2);
            } else {
                teachers = parts.slice(0, 2);
                break;
            }
        }

        if (!names || names.length < 2) continue;

        const homeroom = names.some(isHomeroom);
        const period = homeroom
            ? "Homeroom"
            : `Period ${nextPeriod}`;

        ([1, 2] as const).forEach((semester) => {
            const index = semester - 1;

            records.push({
                code: codes[index],
                name: cleanName(names![index]),
                teacher: teachers?.[index] ?? null,
                period,
                semester,
                kind: kindOf(names![index]),
                meetingDays: getDays(codes[index]),
            });
        });

        if (!homeroom) nextPeriod++;
    }

    return records;
}

function extractSingleColumn(lines: string[]): ParsedRecord[] {
    const records: ParsedRecord[] = [];
    let period = 1;
    let semester: SemesterNumber = 1;

    for (const line of lines) {
        if (/^(?:Term\s*S2|Semester\s*2)\b/i.test(line)) {
            semester = 2;
            period = 1;
            continue;
        }

        if (/^(?:Term\s*S1|Semester\s*1)\b/i.test(line)) {
            semester = 1;
            period = 1;
            continue;
        }

        const match = line.match(
            /^(?:(?:Period|P)\s*([1-8])\s*[:.\-]?\s*)?(.+)$/i
        );

        if (!match) continue;

        const name = cleanName(match[2]);

        const recognized =
            isHomeroom(name) ||
            /\boff\s*hour\b|\blunch\b/i.test(name) ||
            (match[1] !== undefined && name.length > 2);

        if (!recognized) continue;

        const homeroom = isHomeroom(name);

        const number = match[1] ? Number(match[1]) : period;

        records.push({
            code: "",
            name,
            teacher: null,
            period: homeroom ? "Homeroom" : `Period ${number}`,
            semester,
            kind: kindOf(name),
            meetingDays: [],
        });

        if (!homeroom) period = number + 1;
    }

    return records;
}

export function parseScheduleText(
    text: string
): ScheduleExtractionResult {
    const lines = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);

    // Choose ONE parsing strategy.
    // Never combine paired and single-column records.
    const paired = extractPairedRows(lines);

    const records = paired.length > 0
        ? paired
        : extractSingleColumn(lines);

    const unique = records.filter(
        (record, index) =>
            records.findIndex(other =>
                other.semester === record.semester &&
                other.period === record.period &&
                other.name.toLowerCase() === record.name.toLowerCase()
            ) === index
    );

    const semesters: ExtractedSemester[] = (
        [1, 2] as const
    ).map(semester => ({
        semester,
        ...semesterDates(text, semester),
        classes: unique
            .filter(record => record.semester === semester)
            .map((record, index): ExtractedClass => ({
                id: `schedule-${semester}-${index}`,
                name: record.name,
                teacher: record.teacher,
                period: record.period,
                startTime: null,
                endTime: null,
                semester,
                kind: record.kind,
                meetingDays: record.meetingDays,
            })),
    }));

    const warnings: string[] = [];

    if (records.length === 0) {
        warnings.push(
            "We couldn't identify classes automatically. You can add them manually."
        );
    }

    return { semesters, warnings };
}
