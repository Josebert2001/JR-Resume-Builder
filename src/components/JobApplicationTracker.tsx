
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, XCircle, BarChart } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';

export type JobApplication = {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  dateApplied: string;
  status: 'applied' | 'interview' | 'rejected' | 'accepted';
  notes?: string;
};

const JobApplicationTracker = () => {
  const [applications, setApplications] = useLocalStorage<JobApplication[]>('job-applications', []);
  const [activeTab, setActiveTab] = useState('all');

  // Filter applications based on active tab
  const filteredApplications = applications.filter((app) => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  // Stats for the dashboard
  const stats = {
    total: applications.length,
    applied: applications.filter((app) => app.status === 'applied').length,
    interview: applications.filter((app) => app.status === 'interview').length,
    rejected: applications.filter((app) => app.status === 'rejected').length,
    accepted: applications.filter((app) => app.status === 'accepted').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <Badge className="bg-blue-500">Applied</Badge>;
      case 'interview':
        return <Badge className="bg-amber-500">Interview</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500">Accepted</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-resume-primary mb-4">Application Tracker</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 flex flex-col items-center">
          <BarChart className="h-8 w-8 mb-2 text-resume-primary" />
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center">
          <Clock className="h-8 w-8 mb-2 text-blue-500" />
          <p className="text-sm text-gray-500">Applied</p>
          <p className="text-2xl font-bold">{stats.applied}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center">
          <CheckCircle className="h-8 w-8 mb-2 text-green-500" />
          <p className="text-sm text-gray-500">Interviews</p>
          <p className="text-2xl font-bold">{stats.interview}</p>
        </Card>
        <Card className="p-4 flex flex-col items-center">
          <XCircle className="h-8 w-8 mb-2 text-red-500" />
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-bold">{stats.rejected}</p>
        </Card>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="applied">Applied</TabsTrigger>
          <TabsTrigger value="interview">Interviews</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h3 className="text-lg font-medium text-resume-primary">{application.jobTitle}</h3>
                      <p className="text-gray-600">{application.company} - {application.location}</p>
                      <p className="text-sm text-gray-500">Applied on: {new Date(application.dateApplied).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center gap-2">
                      {getStatusBadge(application.status)}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Update status to next stage
                          const newApplications = applications.map(app => {
                            if (app.id === application.id) {
                              let newStatus: 'applied' | 'interview' | 'rejected' | 'accepted' = app.status;
                              if (app.status === 'applied') newStatus = 'interview';
                              else if (app.status === 'interview') newStatus = 'accepted';
                              return { ...app, status: newStatus };
                            }
                            return app;
                          });
                          setApplications(newApplications);
                        }}
                      >
                        Update Status
                      </Button>
                    </div>
                  </div>
                  {application.notes && (
                    <div className="mt-3 text-sm border-t pt-2">
                      <p className="text-gray-700">{application.notes}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No applications found in this category.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobApplicationTracker;
