
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Brain, 
  Play, 
  Pause, 
  TrendingUp, 
  Target, 
  Briefcase, 
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { AgentOrchestrator, AgentInsight, AgentTask } from '../services/agents/AgentOrchestrator';
import { useToast } from './ui/use-toast';
import { useResumeContext } from '../context/ResumeContext';

export const AgenticDashboard = () => {
  const [orchestrator] = useState(() => new AgentOrchestrator());
  const [isRunning, setIsRunning] = useState(false);
  const [insights, setInsights] = useState<AgentInsight[]>([]);
  const [taskStatus, setTaskStatus] = useState({ total: 0, completed: 0, pending: 0, failed: 0 });
  const { resumeData } = useResumeContext();
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setInsights(orchestrator.getRecentInsights());
      setTaskStatus(orchestrator.getTaskStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, [orchestrator]);

  const handleStartAutonomous = async () => {
    setIsRunning(true);
    toast({
      title: "🤖 Autonomous Mode Started",
      description: "AI agents are now working on your career advancement!",
    });
    
    await orchestrator.startAutonomousMode({
      personalInfo: resumeData.personalInfo,
      skills: resumeData.skills,
      experience: resumeData.workExperience,
      education: resumeData.education
    });
  };

  const handleStopAutonomous = () => {
    setIsRunning(false);
    orchestrator.stop();
    toast({
      title: "Autonomous Mode Stopped",
      description: "AI agents have been paused.",
    });
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Briefcase className="h-4 w-4 text-green-600" />;
      case 'recommendation': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'alert': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'milestone': return <Target className="h-4 w-4 text-purple-600" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Agentic Career Assistant
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={isRunning ? "default" : "secondary"}>
                {isRunning ? "Active" : "Idle"}
              </Badge>
              {isRunning ? (
                <Button onClick={handleStopAutonomous} variant="outline" size="sm">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button onClick={handleStartAutonomous} size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Start Autonomous Mode
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{taskStatus.total}</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{taskStatus.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{taskStatus.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{taskStatus.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
          {taskStatus.total > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{Math.round((taskStatus.completed / taskStatus.total) * 100)}%</span>
              </div>
              <Progress value={(taskStatus.completed / taskStatus.total) * 100} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights Dashboard */}
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Live Insights</TabsTrigger>
          <TabsTrigger value="agents">Agent Status</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Real-time Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {insights.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start autonomous mode to see AI-generated insights</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {insights.map((insight) => (
                      <div key={insight.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getInsightIcon(insight.type)}
                            <div className="flex-1">
                              <h4 className="font-medium">{insight.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {insight.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant={getPriorityColor(insight.priority)}>
                                  {insight.priority}
                                </Badge>
                                {insight.actionRequired && (
                                  <Badge variant="outline">Action Required</Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {insight.createdAt.toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Resume Optimizer', icon: <TrendingUp className="h-4 w-4" />, status: 'active' },
              { name: 'Job Matcher', icon: <Briefcase className="h-4 w-4" />, status: 'active' },
              { name: 'Skills Analyzer', icon: <Target className="h-4 w-4" />, status: 'active' },
              { name: 'Network Builder', icon: <Users className="h-4 w-4" />, status: 'active' },
              { name: 'Career Planner', icon: <Brain className="h-4 w-4" />, status: 'active' }
            ].map((agent) => (
              <Card key={agent.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {agent.icon}
                    {agent.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">
                      {isRunning ? 'Running' : 'Idle'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Career Progress Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Resume Optimization Score</span>
                    <span>87%</span>
                  </div>
                  <Progress value={87} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Job Match Rate</span>
                    <span>73%</span>
                  </div>
                  <Progress value={73} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Skills Completeness</span>
                    <span>64%</span>
                  </div>
                  <Progress value={64} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Network Growth</span>
                    <span>91%</span>
                  </div>
                  <Progress value={91} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
