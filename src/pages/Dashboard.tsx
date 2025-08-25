import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "@/components/TaskCard";
import { useTasks } from "@/hooks/useTasks";
import { TrendingUp, Clock, AlertCircle, CheckCircle2, CheckSquare2 } from "lucide-react";
import heroImage from "@/assets/hero-banner.jpg";

export default function Dashboard() {
  const { tasks, toggleTaskComplete, getTaskStats, getTodaysTasks, getOverdueTasks } = useTasks();
  const stats = getTaskStats();
  const todaysTasks = getTodaysTasks();
  const overdueTasks = getOverdueTasks();
  const recentTasks = tasks.slice(0, 5);

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: CheckSquare2,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-priority-medium",
      bgColor: "bg-priority-medium/10"
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: AlertCircle,
      color: "text-priority-high",
      bgColor: "bg-priority-high/10"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary-light p-8 text-white">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-primary-foreground/90 text-lg">
            Let's make today productive. You have {stats.pending} tasks pending.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Tasks
              <Badge variant="secondary">{todaysTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaysTasks.length > 0 ? (
              todaysTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleTaskComplete}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No tasks scheduled for today 🎉
              </p>
            )}
          </CardContent>
        </Card>

        {/* Overdue Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Overdue Tasks
              <Badge variant="destructive">{overdueTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {overdueTasks.length > 0 ? (
              overdueTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleTaskComplete}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Great! No overdue tasks ✨
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Recent Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskComplete}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}