
import type { ClassItem } from "../screens/ConfirmClassesScreen";
import type { NewPlannerItem } from "../screens/AddNewItemScreen";

type DemoTemplate = {
    id: string;
    className: string;
    title: string;
    type: "assignment" | "test";
    daysFromToday: number;
    priority: "Low" | "Medium" | "High";
    notes: string;
};

const DEMO_TEMPLATES: DemoTemplate[] = [
    {
        id: "physics-forces",
        className: "AP Physics",
        title: "Forces and Motion Problem Set",
        type: "assignment",
        daysFromToday: 2,
        priority: "High",
        notes: "Complete practice problems on Newton's laws.",
    },
    {
        id: "linear-algebra-matrices",
        className: "Linear Algebra",
        title: "Matrix Transformations Homework",
        type: "assignment",
        daysFromToday: 3,
        priority: "Medium",
        notes: "Review linear transformations and matrix operations.",
    },
    {
        id: "business-presentation",
        className: "AP Business",
        title: "Market Analysis Presentation",
        type: "assignment",
        daysFromToday: 5,
        priority: "High",
        notes: "Prepare slides and analyze the target market.",
    },
    {
        id: "english-essay",
        className: "English",
        title: "Literary Analysis Essay",
        type: "assignment",
        daysFromToday: 8,
        priority: "Medium",
        notes: "Finish the essay draft and review citations.",
    },
    {
        id: "physics-test",
        className: "AP Physics",
        title: "Unit 3 Physics Test",
        type: "test",
        daysFromToday: 10,
        priority: "High",
        notes: "Study force diagrams, motion, and Newton's laws.",
    },
];

function normalize(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function dateAfterDays(days: number): string {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + days);

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

export function createDemoPlannerItems(
    classes: ClassItem[],
    existingItems: NewPlannerItem[]
): {
    items: NewPlannerItem[];
    skippedClasses: string[];
} {
    const existingIds = new Set(
        existingItems.map((item) => item.id)
    );

    const items: NewPlannerItem[] = [];
    const skippedClasses = new Set<string>();

    for (const template of DEMO_TEMPLATES) {
        const matchingClass = classes.find(
            (item) =>
                normalize(item.name) === normalize(template.className)
        );

        if (!matchingClass) {
            skippedClasses.add(template.className);
            continue;
        }

        const id = `fluxup-demo-${template.id}`;

        if (existingIds.has(id)) {
            continue;
        }

        existingIds.add(id);

        items.push({
            id,
            type: template.type,
            title: template.title,
            classId: matchingClass.id,
            dueDate: dateAfterDays(template.daysFromToday),
            priority: template.priority,
            notes: template.notes + "\n\nDemo assignment.",
            completed: false,
        });
    }

    return {
        items,
        skippedClasses: [...skippedClasses],
    };
}
