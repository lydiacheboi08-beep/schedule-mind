import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTasks } from "@/hooks/useTasks";
import { GitBranch, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { PriorityBadge } from "@/components/ui/priority-badge";

export default function Dependencies() {
  const { tasks } = useTasks();

  // Create dependency relationships
  const taskMap = new Map(tasks.map(task => [task.id, task]));
  
  const dependencyChains = tasks
    .filter(task => task.dependencies.length > 0)
    .map(task => ({
      task,
      prerequisites: task.dependencies.map(depId => taskMap.get(depId)).filter(Boolean)
    }));

  const independentTasks = tasks.filter(task => 
    task.dependencies.length === 0 && 
    !tasks.some(t => t.dependencies.includes(task.id))
  );

  const TaskNode = ({ task, isPrerequisite = false }) => (
    <div className={`
      p-4 rounded-lg border-2 transition-all duration-200
      ${task.status === 'completed' 
        ? 'bg-success/10 border-success/30' 
        : 'bg-card border-border hover:border-primary/50'
      }
      ${isPrerequisite ? 'scale-95 opacity-90' : ''}
    `}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className={`font-medium text-sm ${
          task.status === 'completed' ? 'line-through text-muted-foreground' : ''
        }`}>
          {task.title}
        </h4>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={task.priority} />
          {task.status === 'completed' && (
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Done
            </Badge>
          )}
        </div>
      </div>
      
      {task.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {task.deadline && `Due: ${new Date(task.deadline).toLocaleDateString()}`}
        </span>
        <span className={`flex items-center gap-1 ${
          task.status === 'completed' ? 'text-success' : 'text-muted-foreground'
        }`}>
          {task.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GitBranch className="h-6 w-6 text-primary" />
          Task Dependencies
        </h1>
        <p className="text-muted-foreground mt-2">
          Visualize how your tasks depend on each other
        </p>
      </div>

      {/* Dependency Chains */}
      {dependencyChains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dependency Chains</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {dependencyChains.map(({ task, prerequisites }, index) => (
              <div key={task.id} className="space-y-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Chain {index + 1}
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-4">
                  {/* Prerequisites */}
                  <div className="flex flex-col gap-2 flex-1">
                    {prerequisites.map((prereq, idx) => (
                      <div key={prereq.id} className="flex items-center gap-2">
                        <TaskNode task={prereq} isPrerequisite />
                        {idx < prerequisites.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Arrow to dependent task */}
                  {prerequisites.length > 0 && (
                    <ArrowRight className="h-6 w-6 text-primary mx-4 rotate-0 lg:rotate-0" />
                  )}
                  
                  {/* Dependent Task */}
                  <div className="flex-1">
                    <TaskNode task={task} />
                  </div>
                </div>
                
                {/* Progress indicator */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-success transition-all duration-300"
                      style={{
                        width: `${(prerequisites.filter(p => p.status === 'completed').length / prerequisites.length) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-muted-foreground whitespace-nowrap">
                    {prerequisites.filter(p => p.status === 'completed').length} / {prerequisites.length} prerequisites completed
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Independent Tasks */}
      {independentTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Independent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {independentTasks.map(task => (
                <TaskNode key={task.id} task={task} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {dependencyChains.length === 0 && independentTasks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Tasks Found</h3>
            <p className="text-muted-foreground">
              Create some tasks to see their dependency relationships here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}