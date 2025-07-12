import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, CalendarDays, Clock, ExternalLink, Link2, MapPin, Loader2, Plus, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from 'sonner';

interface JobApplication {
  id: string;
  title: string;
  company: string;
  location: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  url?: string;
  notes?: string;
  dateApplied: string;
  lastUpdated: string;
}

const statusColors = {
  applied: 'bg-blue-500',
  interview: 'bg-yellow-500',
  offer: 'bg-green-500',
  rejected: 'bg-red-500'
};

const statusLabels = {
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected'
};

export const JobApplicationTracker = () => {
  const [applications, setApplications] = useLocalStorage<JobApplication[]>('jobApplications', []);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filter, setFilter] = useState<'all' | JobApplication['status']>('all');
  const [newApplication, setNewApplication] = useState<Partial<JobApplication>>({
    status: 'applied',
    dateApplied: new Date().toISOString().split('T')[0]
  });
  const [isSaving, setIsSaving] = useState(false);
  const isMobile = useIsMobile();

  const handleAddApplication = () => {
    if (!newApplication.title || !newApplication.company) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      const application: JobApplication = {
        id: Date.now().toString(),
        title: newApplication.title!,
        company: newApplication.company!,
        location: newApplication.location || '',
        status: newApplication.status as JobApplication['status'],
        url: newApplication.url,
        notes: newApplication.notes,
        dateApplied: newApplication.dateApplied!,
        lastUpdated: new Date().toISOString()
      };

      setApplications(prev => [application, ...prev]);
      setNewApplication({
        status: 'applied',
        dateApplied: new Date().toISOString().split('T')[0]
      });
      setShowAddDialog(false);
      setIsSaving(false);
      toast.success('Application added successfully');
    }, 1000);
  };

  const handleUpdateStatus = (id: string, newStatus: JobApplication['status']) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { 
        ...app, 
        status: newStatus,
        lastUpdated: new Date().toISOString()
      } : app
    ));
    toast.success(`Application status updated to ${statusLabels[newStatus]}`);
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    toast.success('Application removed');
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' ? true : app.status === filter
  );
  
  const totalApplications = applications.length;
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4 animate-in fade-in-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Job Applications</h2>
          <p className="text-muted-foreground">
            Track and manage your job applications
          </p>
        </div>
        <TouchRipple className="rounded-md shrink-0">
          <Button
            onClick={() => setShowAddDialog(true)}
            className={cn(
              "bg-resume-primary hover:bg-resume-secondary w-full sm:w-auto",
              isMobile && "h-12"
            )}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Application
          </Button>
        </TouchRipple>
      </div>

      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-2" : "grid-cols-4"
      )}>
        <TouchRipple className="rounded-lg">
          <Card 
            className={cn(
              "p-4 cursor-pointer transition-all",
              filter === 'all' ? "ring-2 ring-resume-primary" : "hover:shadow-md"
            )}
            onClick={() => setFilter('all')}
          >
            <div className="font-medium">All</div>
            <div className="text-2xl font-bold">{totalApplications}</div>
          </Card>
        </TouchRipple>
        {Object.entries(statusLabels).map(([status, label]) => (
          <TouchRipple key={status} className="rounded-lg">
            <Card 
              className={cn(
                "p-4 cursor-pointer transition-all",
                filter === status ? "ring-2 ring-resume-primary" : "hover:shadow-md"
              )}
              onClick={() => setFilter(status as JobApplication['status'])}
            >
              <div className="font-medium">{label}</div>
              <div className="text-2xl font-bold">{statusCounts[status] || 0}</div>
            </Card>
          </TouchRipple>
        ))}
      </div>

      <Card>
        <ScrollArea className={cn(
          "rounded-lg",
          isMobile ? "h-[calc(100vh-360px)]" : "h-[500px]"
        )}>
          <div className="p-4 space-y-4">
            {filteredApplications.length > 0 ? (
              filteredApplications.map(application => (
                <TouchRipple key={application.id} className="rounded-lg">
                  <Card className={cn(
                    "p-4 hover:shadow-md transition-all",
                    isMobile && "active:scale-[0.99]"
                  )}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium leading-none">{application.title}</h3>
                          {application.url && (
                            <a
                              href={application.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                "text-resume-primary hover:text-resume-secondary transition-colors",
                                isMobile && "p-2 -m-2"
                              )}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>{application.company}</span>
                          </div>
                          {application.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{application.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span>Applied: {new Date(application.dateApplied).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Updated: {new Date(application.lastUpdated).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {application.notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {application.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Badge 
                          variant="secondary"
                          className={cn(
                            statusColors[application.status],
                            "text-white"
                          )}
                        >
                          {statusLabels[application.status]}
                        </Badge>
                        <TouchRipple className="rounded-full">
                          <button
                            onClick={() => handleDeleteApplication(application.id)}
                            className={cn(
                              "text-destructive hover:text-destructive/90 rounded-full",
                              isMobile && "p-2 -m-2"
                            )}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </TouchRipple>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                      {(['applied', 'interview', 'offer', 'rejected'] as const).map(status => (
                        <TouchRipple key={status} className="rounded-full shrink-0">
                          <Button
                            variant={application.status === status ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              application.status === status && statusColors[status],
                              "transition-colors",
                              isMobile && "h-9"
                            )}
                            onClick={() => handleUpdateStatus(application.id, status)}
                          >
                            {statusLabels[status]}
                          </Button>
                        </TouchRipple>
                      ))}
                    </div>
                  </Card>
                </TouchRipple>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <p>No applications found.</p>
                <TouchRipple className="rounded-md mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(true)}
                    className={cn(isMobile && "h-12")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Application
                  </Button>
                </TouchRipple>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className={cn(
          "sm:max-w-[500px]",
          isMobile && "h-[90vh] mt-[5vh]"
        )}>
          <DialogHeader>
            <DialogTitle>Add New Application</DialogTitle>
          </DialogHeader>
          <ScrollArea className={cn(isMobile && "flex-1")}>
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={newApplication.title || ''}
                  onChange={e => setNewApplication(prev => ({ ...prev, title: e.target.value }))}
                  className={cn(isMobile && "h-12")}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  value={newApplication.company || ''}
                  onChange={e => setNewApplication(prev => ({ ...prev, company: e.target.value }))}
                  className={cn(isMobile && "h-12")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newApplication.location || ''}
                  onChange={e => setNewApplication(prev => ({ ...prev, location: e.target.value }))}
                  className={cn(isMobile && "h-12")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Job Post URL</Label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="url"
                    type="url"
                    value={newApplication.url || ''}
                    onChange={e => setNewApplication(prev => ({ ...prev, url: e.target.value }))}
                    className={cn("pl-9", isMobile && "h-12")}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateApplied">Date Applied</Label>
                <Input
                  id="dateApplied"
                  type="date"
                  value={newApplication.dateApplied || ''}
                  onChange={e => setNewApplication(prev => ({ ...prev, dateApplied: e.target.value }))}
                  className={cn(isMobile && "h-12")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newApplication.notes || ''}
                  onChange={e => setNewApplication(prev => ({ ...prev, notes: e.target.value }))}
                  className="min-h-[100px]"
                  placeholder="Add any relevant notes about the application..."
                />
              </div>
            </div>
          </ScrollArea>

          <div className={cn(
            "flex gap-2 mt-6",
            isMobile && "sticky bottom-0 pt-4 pb-2 bg-background/80 backdrop-blur-sm border-t"
          )}>
            <Button
              variant="outline"
              className={cn(
                "flex-1",
                isMobile && "h-12"
              )}
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </Button>
            <TouchRipple className="rounded-md flex-1">
              <Button
                className={cn(
                  "w-full bg-resume-primary hover:bg-resume-secondary",
                  isMobile && "h-12"
                )}
                onClick={handleAddApplication}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Application
                  </>
                )}
              </Button>
            </TouchRipple>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
