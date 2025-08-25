import { useState, useCallback } from 'react';
import { Task, TaskStatus, Priority } from '@/types/task';

// Mock data for initial development
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Clean the house',
    description: 'Deep clean all rooms including kitchen and bathrooms',
    priority: 'high',
    status: 'pending',
    deadline: '2024-12-30',
    createdAt: '2024-12-25',
    dependencies: []
  },
  {
    id: '2',
    title: 'Arrange the house',
    description: 'Organize furniture and decorations after cleaning',
    priority: 'medium',
    status: 'pending',
    deadline: '2024-12-31',
    createdAt: '2024-12-25',
    dependencies: ['1']
  },
  {
    id: '3',
    title: 'Shopping for groceries',
    description: 'Buy ingredients for dinner preparation',
    priority: 'high',
    status: 'completed',
    deadline: '2024-12-26',
    createdAt: '2024-12-24',
    completedAt: '2024-12-26',
    dependencies: []
  },
  {
    id: '4',
    title: 'Cooking dinner',
    description: 'Prepare a nice dinner with fresh ingredients',
    priority: 'medium',
    status: 'pending',
    deadline: '2024-12-26',
    createdAt: '2024-12-25',
    dependencies: ['3']
  },
  {
    id: '5',
    title: 'Write proposal',
    description: 'Draft the project proposal document',
    priority: 'high',
    status: 'in-progress',
    deadline: '2024-12-28',
    createdAt: '2024-12-24',
    dependencies: []
  },
  {
    id: '6',
    title: 'Review proposal',
    description: 'Review and edit the drafted proposal',
    priority: 'medium',
    status: 'pending',
    deadline: '2024-12-29',
    createdAt: '2024-12-25',
    dependencies: ['5']
  }
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const toggleTaskComplete = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const isCompleting = task.status !== 'completed';
        return {
          ...task,
          status: isCompleting ? 'completed' : 'pending' as TaskStatus,
          completedAt: isCompleting ? new Date().toISOString() : undefined
        };
      }
      return task;
    }));
  }, []);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const getTaskStats = useCallback(() => {
    const now = new Date();
    const today = now.toDateString();
    
    const stats = tasks.reduce((acc, task) => {
      acc.total++;
      
      if (task.status === 'completed') {
        acc.completed++;
      } else {
        acc.pending++;
        
        if (task.deadline && new Date(task.deadline) < now) {
          acc.overdue++;
        }
        
        if (task.deadline && new Date(task.deadline).toDateString() === today) {
          acc.today++;
        }
      }
      
      return acc;
    }, {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0,
      today: 0
    });
    
    return stats;
  }, [tasks]);

  const getTodaysTasks = useCallback(() => {
    const today = new Date().toDateString();
    return tasks.filter(task => 
      task.deadline && new Date(task.deadline).toDateString() === today
    );
  }, [tasks]);

  const getOverdueTasks = useCallback(() => {
    const now = new Date();
    return tasks.filter(task => 
      task.deadline && 
      new Date(task.deadline) < now && 
      task.status !== 'completed'
    );
  }, [tasks]);

  return {
    tasks,
    toggleTaskComplete,
    addTask,
    updateTask,
    deleteTask,
    getTaskStats,
    getTodaysTasks,
    getOverdueTasks
  };
}