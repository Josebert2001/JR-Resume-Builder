import { CareerAgent } from './CareerAgent';
import { ResumeOptimizationAgent } from './ResumeOptimizationAgent';
import { JobMatchingAgent } from './JobMatchingAgent';
import { SkillsGapAgent } from './SkillsGapAgent';
import { NetworkingAgent } from './NetworkingAgent';

export interface AgentTask {
  id: string;
  type: 'resume_optimization' | 'job_matching' | 'skills_analysis' | 'networking' | 'career_planning';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  scheduledFor: Date;
  data: any;
  result?: any;
  error?: string;
}

export interface AgentInsight {
  id: string;
  type: 'opportunity' | 'recommendation' | 'alert' | 'milestone';
  title: string;
  description: string;
  actionRequired: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  data?: any;
}

export class AgentOrchestrator {
  private agents: Map<string, any> = new Map();
  private tasks: AgentTask[] = [];
  private insights: AgentInsight[] = [];
  private isRunning = false;

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    this.agents.set('career', new CareerAgent());
    this.agents.set('resume', new ResumeOptimizationAgent());
    this.agents.set('jobs', new JobMatchingAgent());
    this.agents.set('skills', new SkillsGapAgent());
    this.agents.set('networking', new NetworkingAgent());
  }

  async startAutonomousMode(userProfile: any) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🤖 Starting autonomous career assistance...');
    
    // Schedule initial tasks
    await this.scheduleInitialTasks(userProfile);
    
    // Start the main loop
    this.runMainLoop();
  }

  private async scheduleInitialTasks(userProfile: any) {
    const now = new Date();
    
    // Schedule daily resume analysis
    this.addTask({
      id: `resume_analysis_${Date.now()}`,
      type: 'resume_optimization',
      priority: 'medium',
      status: 'pending',
      scheduledFor: now,
      data: { userProfile, type: 'daily_analysis' }
    });

    // Schedule job market scan
    this.addTask({
      id: `job_scan_${Date.now()}`,
      type: 'job_matching',
      priority: 'high',
      status: 'pending',
      scheduledFor: new Date(now.getTime() + 5000), // 5 seconds later
      data: { userProfile, type: 'market_scan' }
    });

    // Schedule skills gap analysis
    this.addTask({
      id: `skills_analysis_${Date.now()}`,
      type: 'skills_analysis',
      priority: 'medium',
      status: 'pending',
      scheduledFor: new Date(now.getTime() + 10000), // 10 seconds later
      data: { userProfile, type: 'gap_analysis' }
    });
  }

  private async runMainLoop() {
    while (this.isRunning) {
      await this.processPendingTasks();
      await this.generateInsights();
      
      // Wait 30 seconds before next cycle
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }

  private async processPendingTasks() {
    const now = new Date();
    const dueTasks = this.tasks.filter(
      task => task.status === 'pending' && task.scheduledFor <= now
    );

    for (const task of dueTasks) {
      try {
        task.status = 'in_progress';
        const agent = this.agents.get(this.getAgentKey(task.type));
        
        if (agent) {
          console.log(`🔄 Processing task: ${task.type}`);
          const result = await agent.executeTask(task.data);
          task.result = result;
          task.status = 'completed';
          
          // Generate insights from results
          this.processTaskResult(task);
        }
      } catch (error) {
        console.error(`❌ Task failed: ${task.type}`, error);
        task.status = 'failed';
        task.error = error instanceof Error ? error.message : 'Unknown error';
      }
    }
  }

  private getAgentKey(taskType: string): string {
    switch (taskType) {
      case 'resume_optimization': return 'resume';
      case 'job_matching': return 'jobs';
      case 'skills_analysis': return 'skills';
      case 'networking': return 'networking';
      case 'career_planning': return 'career';
      default: return 'career';
    }
  }

  private processTaskResult(task: AgentTask) {
    if (!task.result) return;

    // Generate insights based on task results
    if (task.type === 'job_matching' && task.result.opportunities) {
      task.result.opportunities.forEach((job: any) => {
        this.addInsight({
          id: `job_opportunity_${Date.now()}_${Math.random()}`,
          type: 'opportunity',
          title: `New Job Match: ${job.title}`,
          description: `Found a ${job.match}% match at ${job.company}. ${job.reason}`,
          actionRequired: job.match > 80,
          priority: job.match > 90 ? 'high' : job.match > 75 ? 'medium' : 'low',
          createdAt: new Date(),
          data: job
        });
      });
    }

    if (task.type === 'resume_optimization' && task.result.suggestions) {
      task.result.suggestions.forEach((suggestion: any) => {
        this.addInsight({
          id: `resume_suggestion_${Date.now()}_${Math.random()}`,
          type: 'recommendation',
          title: suggestion.title,
          description: suggestion.description,
          actionRequired: suggestion.priority === 'high',
          priority: suggestion.priority,
          createdAt: new Date(),
          data: suggestion
        });
      });
    }
  }

  private async generateInsights() {
    // Generate periodic insights based on current state
    const completedTasks = this.tasks.filter(t => t.status === 'completed');
    const recentTasks = completedTasks.filter(
      t => t.result && Date.now() - new Date(t.scheduledFor).getTime() < 300000 // Last 5 minutes
    );

    if (recentTasks.length === 0) return;

    // Generate summary insight
    this.addInsight({
      id: `summary_${Date.now()}`,
      type: 'milestone',
      title: 'Progress Update',
      description: `Completed ${recentTasks.length} tasks in the last 5 minutes. Your career profile is being continuously optimized.`,
      actionRequired: false,
      priority: 'low',
      createdAt: new Date()
    });
  }

  addTask(task: AgentTask) {
    this.tasks.push(task);
  }

  addInsight(insight: AgentInsight) {
    this.insights.unshift(insight); // Add to beginning
    // Keep only latest 50 insights
    if (this.insights.length > 50) {
      this.insights = this.insights.slice(0, 50);
    }
  }

  getRecentInsights(limit = 10): AgentInsight[] {
    return this.insights.slice(0, limit);
  }

  getTaskStatus(): { total: number; completed: number; pending: number; failed: number } {
    return {
      total: this.tasks.length,
      completed: this.tasks.filter(t => t.status === 'completed').length,
      pending: this.tasks.filter(t => t.status === 'pending').length,
      failed: this.tasks.filter(t => t.status === 'failed').length
    };
  }

  stop() {
    this.isRunning = false;
    console.log('🛑 Autonomous mode stopped');
  }
}
