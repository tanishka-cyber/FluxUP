import React from 'react';
import CourseworkDetails, { type DetailedItem } from './CourseworkDetails';
type Props = { onBack: () => void; onAddStudyBlock?: () => void; testTitle?: string; className?: string; testDate?: string; item?: DetailedItem; onToggleStep?: (id: string, step: string) => void };
export default function TestDetailsScreen({ onBack, testTitle, className, testDate, item, onToggleStep }: Props) { return <CourseworkDetails kind="test" onBack={onBack} title={testTitle} className={className} dueDate={testDate} item={item} onToggleStep={onToggleStep} />; }
