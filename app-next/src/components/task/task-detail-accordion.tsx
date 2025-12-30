"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
// Removed detail sections from accordion, now in header
import { TaskRunsList } from "./task-runs-list";
import { TaskAnalysisSection } from "./task-analysis-section";
import type { Task } from "@/types/task";

interface TaskDetailAccordionProps {
  task: Task;
  runCount: number;
}

export function TaskDetailAccordion({
  task,
  runCount,
}: TaskDetailAccordionProps) {
  return (
    <Accordion type="multiple" className="w-full space-y-4">
      <AccordionItem value="analysis">
        <AccordionTrigger className="rounded-t-md bg-orange-50 px-4 py-2 text-lg font-semibold text-orange-600">
          Analysis
        </AccordionTrigger>
        <AccordionContent className="bg-white px-4 pb-4">
          <TaskAnalysisSection task={task} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="runs">
        <AccordionTrigger className="rounded-t-md bg-orange-50 px-4 py-2 text-lg font-semibold text-orange-600">
          Runs
        </AccordionTrigger>
        <AccordionContent className="bg-white px-4 pb-4">
          <TaskRunsList task={task} runCount={runCount} />
        </AccordionContent>
      </AccordionItem>
      {/* Details section removed: now in header for deduplication */}
    </Accordion>
  );
}
