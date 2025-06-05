import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Building2, ArrowUpRight, Loader2, Navigation } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import { JobSearchAgent, JobSearchParams, JobResult } from '../services/langchain/agents/JobSearchAgent';
import { LocationService, LocationData } from '../services/locationService';
import type { ResumeData } from '@/context/ResumeContext';

interface JobSearchProps {
  resumeData: ResumeData;
}

export const JobSearch = ({ resumeData }: JobSearchProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState<JobResult[]>([]);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [jobSearchAgent] = useState(() => new JobSearchAgent());
  const isMobile = useIsMobile();

  useEffect(() => {
    // Try to get location from resume first
    const resumeLocation = LocationService.extractLocationFromResume(resumeData);
    if (resumeLocation) {
      setLocation(resumeLocation);
    }
  }, [resumeData]);

  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const detectedLocation = await LocationService.getUserLocation();
      if (detectedLocation) {
        setUserLocation(detectedLocation);
        setLocation(LocationService.formatLocation(detectedLocation));
      }
    } catch (error) {
      console.error('Failed to detect location:', error);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsSearching(true);

    try {
      // Extract skills from resume
      const skills = resumeData.skills?.map(s => s.name) || [];
      
      const searchParams: JobSearchParams = {
        query: query.trim(),
        location: location || 'Remote',
        skills: skills,
        experienceLevel: getExperienceLevel(),
        jobType: 'Full-time'
      };

      console.log('Searching with LangChain agent:', searchParams);
      
      // Use LangChain agent for real job search
      const searchResults = await jobSearchAgent.searchJobs(searchParams);
      
      // Score jobs based on user's resume
      const scoredJobs = scoreJobsForUser(searchResults);
      
      setJobs(scoredJobs);
      
    } catch (error) {
      console.error('Job search failed:', error);
      // Fallback to mock data
      setJobs([
        {
          id: '1',
          title: 'Senior Software Engineer',
          company: 'TechCorp',
          location: location || 'San Francisco, CA',
          salary: '$150,000 - $200,000',
          description: 'Looking for an experienced software engineer...',
          skills: ['React', 'TypeScript', 'Node.js'],
          url: 'https://example.com/job1',
          postedDate: new Date().toISOString(),
          matchScore: 85
        }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const getExperienceLevel = (): string => {
    const experience = resumeData?.workExperience || [];
    if (experience.length === 0) return 'Entry Level';
    if (experience.length >= 3) return 'Senior Level';
    return 'Mid Level';
  };

  const scoreJobsForUser = (jobResults: JobResult[]): JobResult[] => {
    const userSkills = new Set(resumeData.skills?.map(s => s.name.toLowerCase()) || []);
    
    return jobResults.map(job => {
      const matchingSkills = job.skills.filter(skill => 
        userSkills.has(skill.toLowerCase())
      );
      
      const baseScore = job.matchScore || 50;
      const skillBonus = matchingSkills.length * 10;
      const finalScore = Math.min(baseScore + skillBonus, 100);
      
      return {
        ...job,
        matchScore: finalScore,
        matchingSkills: matchingSkills.length
      };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  };

  const getMatchingSkills = (jobSkills: string[]) => {
    const userSkills = new Set(resumeData.skills?.map(s => s.name.toLowerCase()) || []);
    return jobSkills.filter(skill => userSkills.has(skill.toLowerCase()));
  };

  return (
    <div className="space-y-4 animate-in fade-in-50">
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={cn("pl-9 pr-4", isMobile && "h-12")}
            placeholder="Search for jobs (e.g., Frontend Developer, Data Scientist)..."
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={cn("pl-9 pr-4", isMobile && "h-12")}
              placeholder="Location (e.g., San Francisco, CA or Remote)..."
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleDetectLocation}
            disabled={isDetectingLocation}
            className={cn(isMobile && "h-12 px-3")}
          >
            {isDetectingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <Button type="submit" disabled={isSearching || !query.trim()} className="w-full">
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching with AI...
            </>
          ) : (
            'Search Jobs with AI'
          )}
        </Button>
      </form>

      <ScrollArea className={cn(
        "border rounded-lg",
        isMobile ? "h-[calc(100vh-400px)]" : "h-[500px]"
      )}>
        <div className="p-4 space-y-4">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Using AI to find the best job matches for you...</p>
              <p className="text-sm mt-2">Analyzing skills, location, and market trends</p>
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
                        <div className="flex items-center gap-2">
                          {job.matchScore && (
                            <Badge variant={job.matchScore > 80 ? "default" : "secondary"}>
                              {job.matchScore}% match
                            </Badge>
                          )}
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
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>
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
              <p className="text-sm mt-1">Try different keywords or locations</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p>Enter a job title or keywords to start searching.</p>
              <p className="text-sm mt-1">AI will find personalized matches based on your skills</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
