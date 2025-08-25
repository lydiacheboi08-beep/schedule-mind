import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TaskCard } from "@/components/TaskCard";
import { useTasks } from "@/hooks/useTasks";
import { CalendarDays, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CalendarPage() {
  const { tasks, toggleTaskComplete } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Get tasks for selected date
  const tasksForSelectedDate = tasks.filter(task => 
    task.deadline && isSameDay(new Date(task.deadline), selectedDate)
  );

  // Get all tasks with deadlines for calendar highlighting
  const tasksWithDeadlines = tasks.filter(task => task.deadline);

  // Function to get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasksWithDeadlines.filter(task => 
      task.deadline && isSameDay(new Date(task.deadline), date)
    );
  };

  // Custom day content for calendar
  const customDayContent = (day: Date) => {
    const dayTasks = getTasksForDate(day);
    const hasHighPriority = dayTasks.some(task => task.priority === 'high');
    const hasOverdue = dayTasks.some(task => 
      new Date(task.deadline!) < new Date() && task.status !== 'completed'
    );
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span>{day.getDate()}</span>
        {dayTasks.length > 0 && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
            {dayTasks.slice(0, 3).map((task, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full ${
                  task.status === 'completed' 
                    ? 'bg-success' 
                    : hasOverdue 
                    ? 'bg-destructive' 
                    : hasHighPriority 
                    ? 'bg-priority-high' 
                    : 'bg-primary'
                }`}
              />
            ))}
            {dayTasks.length > 3 && (
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            )}
          </div>
        )}
      </div>
    );
  };

  const priorityStats = {
    high: tasksForSelectedDate.filter(t => t.priority === 'high').length,
    medium: tasksForSelectedDate.filter(t => t.priority === 'medium').length,
    low: tasksForSelectedDate.filter(t => t.priority === 'low').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Calendar View
          </h1>
          <p className="text-muted-foreground">
            Visualize your tasks across time
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={viewMode} onValueChange={(value: 'month' | 'week' | 'day') => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{format(selectedDate, 'MMMM yyyy')}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full p-3 pointer-events-auto"
                components={{
                  Day: ({ date }) => customDayContent(date)
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Tasks */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {format(selectedDate, 'MMM d, yyyy')}
                </span>
                <Badge variant="secondary">
                  {tasksForSelectedDate.length} tasks
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Priority Stats */}
              {tasksForSelectedDate.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-priority-high">
                      {priorityStats.high}
                    </div>
                    <div className="text-xs text-muted-foreground">High</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-priority-medium">
                      {priorityStats.medium}
                    </div>
                    <div className="text-xs text-muted-foreground">Medium</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-priority-low">
                      {priorityStats.low}
                    </div>
                    <div className="text-xs text-muted-foreground">Low</div>
                  </div>
                </div>
              )}

              {/* Task List */}
              <div className="space-y-3">
                {tasksForSelectedDate.length > 0 ? (
                  tasksForSelectedDate.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                      className="hover:shadow-sm"
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No tasks scheduled for this date</p>
                    <Button variant="ghost" size="sm" className="mt-2">
                      Add Task
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Month Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Month Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-primary">
                {tasks.filter(t => t.deadline && 
                  new Date(t.deadline).getMonth() === selectedDate.getMonth() &&
                  new Date(t.deadline).getFullYear() === selectedDate.getFullYear()
                ).length}
              </div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-success/10">
              <div className="text-2xl font-bold text-success">
                {tasks.filter(t => t.deadline && 
                  new Date(t.deadline).getMonth() === selectedDate.getMonth() &&
                  new Date(t.deadline).getFullYear() === selectedDate.getFullYear() &&
                  t.status === 'completed'
                ).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-priority-high/10">
              <div className="text-2xl font-bold text-priority-high">
                {tasks.filter(t => t.deadline && 
                  new Date(t.deadline).getMonth() === selectedDate.getMonth() &&
                  new Date(t.deadline).getFullYear() === selectedDate.getFullYear() &&
                  t.priority === 'high'
                ).length}
              </div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-destructive/10">
              <div className="text-2xl font-bold text-destructive">
                {tasks.filter(t => t.deadline && 
                  new Date(t.deadline) < new Date() &&
                  t.status !== 'completed'
                ).length}
              </div>
              <div className="text-sm text-muted-foreground">Overdue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}