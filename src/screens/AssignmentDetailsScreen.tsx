import React from 'react';
import CourseworkDetails, { type DetailedItem } from './CourseworkDetails';
type Props = { onBack: () => void; assignmentTitle?: string; className?: string; dueDate?: string; item?: DetailedItem; onToggleStep?: (id: string, step: string) => void; onToggleComplete?: (id: string) => void };
export default function AssignmentDetailsScreen({ onBack, assignmentTitle, className, dueDate, item, onToggleStep, onToggleComplete }: Props) { return <CourseworkDetails kind="assignment" onBack={onBack} title={assignmentTitle} className={className} dueDate={dueDate} item={item} onToggleStep={onToggleStep} onToggleComplete={onToggleComplete} />; }
