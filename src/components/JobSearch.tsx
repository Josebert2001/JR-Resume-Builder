import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Building2, ArrowUpRight, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import type { ResumeData } from '@/context/ResumeContext';

interface JobSearchProps {
  resumeData: ResumeData;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  skills: string[];
  url: string;
}

export const JobSearch = ({ resumeData }: JobSearchProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [query, setQuery] = useState('');
  const isMobile = useIsMobile();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    // Simulated API call
    setTimeout(() => {
      setJobs([
        {
          id: '1',
          title: 'Senior Software Engineer',
          company: 'TechCorp',
          location: 'San Francisco, CA',
          salary: '$150,000 - $200,000',
          skills: ['React', 'TypeScript', 'Node.js'],
          url: 'https://example.com/job1'
        },
        {
          id: '2',
          title: 'Full Stack Developer',
          company: 'StartupInc',
          location: 'Remote',
          salary: '$120,000 - $160,000',
          skills: ['JavaScript', 'Python', 'AWS'],
          url: 'https://example.com/job2'
        },
        // Add more mock jobs...
      ]);
      setIsSearching(false);
    }, 1500);
  };

  const getMatchingSkills = (jobSkills: string[]) => {
    const userSkills = new Set(resumeData.skills?.map(s => s.name.toLowerCase()) || []);
    return jobSkills.filter(skill => userSkills.has(skill.toLowerCase()));
  };

  return (
    <div className="space-y-4 animate-in fade-in-50">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "pl-9 pr-4",
            isMobile && "h-12"
          )}
          placeholder="Search jobs matching your skills..."
        />
      </form>

      <ScrollArea className={cn(
        "border rounded-lg",
        isMobile ? "h-[calc(100vh-320px)]" : "h-[500px]"
      )}>
        <div className="p-4 space-y-4">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Searching for matching jobs...</p>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map(job => (
              <TouchRipple key={job.id} className="rounded-lg">
                <Card className={cn(
                  "p-4 hover:shadow-md transition-all duration-200",
                  isMobile && "active:scale-[0.99]"
                )}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium leading-none">{job.title}</h3>
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "text-resume-primary hover:text-resume-secondary transition-colors",
                            isMobile && "p-2 -m-2"
                          )}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{job.location}</span>
                        </div>
                      </div>

                      {job.salary && (
                        <p className="text-sm text-resume-primary font-medium">
                          {job.salary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.map((skill, index) => {
                        const isMatch = getMatchingSkills([skill]).length > 0;
                        return (
                          <Badge
                            key={index}
                            variant={isMatch ? "default" : "secondary"}
                            className={cn(
                              isMatch && "bg-resume-primary hover:bg-resume-secondary",
                              "transition-colors",
                              isMobile && "text-sm py-1"
                            )}
                          >
                            {skill}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </TouchRipple>
            ))
          ) : query ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p>No jobs found matching your search.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p>Enter a search term to find matching jobs.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
