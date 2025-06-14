
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Building2, ArrowUpRight, Loader2, Navigation, ExternalLink, AlertCircle, Zap, Target, TrendingUp, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TouchRipple } from './ui/touch-ripple';
import { RealJobSearchService, RealJobResult, JobSearchQuery } from '../services/realJobSearchService';
import { LocationService, LocationData } from '../services/locationService';
import { Alert, AlertDescription } from './ui/alert';
import type { ResumeData } from '@/context/ResumeContext';

interface JobSearchProps {
  resumeData: ResumeData;
}

export const JobSearch = ({ resumeData }: JobSearchProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState<RealJobResult[]>([]);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Try to get location from resume first
    const resumeLocation = LocationService.extractLocationFromResume(resumeData);
    if (resumeLocation) {
      setLocation(resumeLocation);
    }

    // Auto-populate query based on resume
    if (resumeData.workExperience?.[0]?.position) {
      setQuery(resumeData.workExperience[0].position);
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
    setSearchError(null);

    try {
      // Check if API key is configured
      const apiKey = localStorage.getItem('groq_api_key');
      if (!apiKey) {
        setSearchError('Please configure your API key in the API Setup tab first.');
        return;
      }

      // Extract skills from resume
      const skills = resumeData.skills?.map(s => s.name) || [];
      
      const searchQuery: JobSearchQuery = {
        query: query.trim(),
        location: location || 'Remote',
        skills: skills,
        experienceLevel: getExperienceLevel(),
        jobType: 'Full-time'
      };

      console.log('Searching with enhanced service:', searchQuery);
      
      // Use real job search service
      const searchResults = await RealJobSearchService.searchJobs(searchQuery);
      
      // Score jobs based on user's resume
      const scoredJobs = scoreJobsForUser(searchResults);
      
      setJobs(scoredJobs);
      
    } catch (error) {
      console.error('Job search failed:', error);
      setSearchError('Job search failed. Please try again or check your internet connection.');
      setJobs([]);
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

  const scoreJobsForUser = (jobResults: RealJobResult[]): RealJobResult[] => {
    const userSkills = new Set(resumeData.skills?.map(s => s.name.toLowerCase()) || []);
    
    return jobResults.map(job => {
      const matchingSkills = job.skills.filter(skill => 
        userSkills.has(skill.toLowerCase())
      );
      
      const baseScore = job.matchScore || 50;
      const skillBonus = matchingSkills.length * 5;
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

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'from-emerald-500 to-green-400';
    if (score >= 80) return 'from-cyan-500 to-blue-400';
    if (score >= 70) return 'from-yellow-500 to-amber-400';
    return 'from-gray-500 to-slate-400';
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-400" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn(
                "pl-12 pr-4 h-14 bg-white/5 border-white/20 rounded-2xl backdrop-blur-xl",
                "text-white placeholder:text-cyan-100/50",
                "focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20",
                "transition-all duration-300",
                isMobile && "h-12"
              )}
              placeholder="Search for jobs (e.g., Frontend Developer, Data Scientist)..."
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={cn(
                  "pl-12 pr-4 h-14 bg-white/5 border-white/20 rounded-2xl backdrop-blur-xl",
                  "text-white placeholder:text-cyan-100/50",
                  "focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20",
                  "transition-all duration-300",
                  isMobile && "h-12"
                )}
                placeholder="Location (e.g., San Francisco, CA or Remote)..."
              />
            </div>
          </div>
          <Button
            type="button"
            variant="cyber"
            onClick={handleDetectLocation}
            disabled={isDetectingLocation}
            className={cn("h-14 px-6 rounded-2xl", isMobile && "h-12 px-3")}
          >
            {isDetectingLocation ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Navigation className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <Button 
          type="submit" 
          disabled={isSearching || !query.trim()} 
          variant="cyber"
          size="lg"
          className="w-full h-14 rounded-2xl text-base font-semibold"
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              <span>Searching real job boards...</span>
              <div className="ml-3 flex items-center gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5" />
              <span>Search Jobs with AI</span>
            </>
          )}
        </Button>
      </form>

      {/* Error Alert */}
      {searchError && (
        <Alert variant="destructive" className="border-red-500/20 bg-red-500/10 backdrop-blur-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-100">{searchError}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent rounded-2xl" />
        <ScrollArea className={cn(
          "relative border border-white/10 rounded-2xl bg-white/5 backdrop-blur-xl",
          isMobile ? "h-[calc(100vh-500px)]" : "h-[600px]"
        )}>
          <div className="p-6 space-y-4">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-12 text-cyan-100/70">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
                  <Loader2 className="relative h-12 w-12 animate-spin text-cyan-400" />
                </div>
                <div className="text-center space-y-3">
                  <p className="text-lg font-medium">Searching real job boards for the best matches...</p>
                  <p className="text-sm opacity-70">Analyzing skills, location, and market trends</p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Target className="h-4 w-4 text-purple-400 animate-pulse" />
                    <TrendingUp className="h-4 w-4 text-cyan-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <Star className="h-4 w-4 text-yellow-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
                  </div>
                </div>
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-cyan-100/70">
                    Found <span className="text-cyan-400 font-semibold">{jobs.length}</span> jobs matching your criteria
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-emerald-400">Live Results</span>
                  </div>
                </div>
                {jobs.map((job, index) => (
                  <TouchRipple key={job.id} className="rounded-2xl">
                    <Card className={cn(
                      "group relative overflow-hidden transition-all duration-500 hover:scale-[1.02]",
                      "animate-slide-up",
                      isMobile && "active:scale-[0.99]"
                    )} style={{ animationDelay: `${index * 0.1}s` }}>
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      {/* Scan line effect */}
                      <div className="scan-line opacity-0 group-hover:opacity-100" />
                      
                      <div className="relative p-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold text-lg text-white leading-tight group-hover:text-cyan-100 transition-colors">
                                {job.title}
                              </h3>
                              <div className="flex items-center gap-3">
                                {job.matchScore && (
                                  <div className="relative">
                                    <Badge className={cn(
                                      "bg-gradient-to-r text-white border-0 px-3 py-1.5 font-medium",
                                      getMatchScoreColor(job.matchScore)
                                    )}>
                                      <Star className="h-3 w-3 mr-1" />
                                      {job.matchScore}% match
                                    </Badge>
                                    {job.matchScore >= 90 && (
                                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                                    )}
                                  </div>
                                )}
                                <Badge variant="outline" className="text-xs border-white/20 text-cyan-100/70">
                                  {job.source}
                                </Badge>
                                <a
                                  href={job.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={cn(
                                    "text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:scale-110",
                                    isMobile && "p-2 -m-2"
                                  )}
                                >
                                  <ExternalLink className="h-5 w-5" />
                                </a>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-cyan-100/70">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-purple-400" />
                                <span className="font-medium">{job.company}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-cyan-400" />
                                <span>{job.location}</span>
                              </div>
                            </div>

                            {job.salary && (
                              <p className="text-lg font-semibold gradient-text">
                                {job.salary}
                              </p>
                            )}
                            
                            <p className="text-sm text-cyan-100/80 line-clamp-2 leading-relaxed">
                              {job.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10">
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, skillIndex) => {
                              const isMatch = getMatchingSkills([skill]).length > 0;
                              return (
                                <Badge
                                  key={skillIndex}
                                  variant={isMatch ? "default" : "secondary"}
                                  className={cn(
                                    "transition-all duration-300 hover:scale-105",
                                    isMatch 
                                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 shadow-lg hover:shadow-cyan-500/25" 
                                      : "bg-white/10 text-cyan-100/70 border-white/20 hover:bg-white/20",
                                    isMobile && "text-sm py-1.5 px-3"
                                  )}
                                >
                                  {skill}
                                  {isMatch && <Zap className="h-3 w-3 ml-1" />}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </TouchRipple>
                ))}
              </>
            ) : query ? (
              <div className="flex flex-col items-center justify-center py-12 text-cyan-100/70">
                <div className="relative mb-4">
                  <Search className="h-12 w-12 text-cyan-400/50" />
                  <div className="absolute inset-0 bg-cyan-400/10 rounded-full blur-lg" />
                </div>
                <p className="text-lg font-medium">No jobs found matching your search.</p>
                <p className="text-sm opacity-70 mt-1">Try different keywords or locations</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-cyan-100/70">
                <div className="relative mb-4">
                  <div className="flex items-center gap-3">
                    <Search className="h-8 w-8 text-cyan-400" />
                    <Zap className="h-6 w-6 text-purple-400 animate-pulse" />
                    <Target className="h-7 w-7 text-cyan-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-400/10 to-cyan-400/10 rounded-full blur-xl animate-pulse" />
                </div>
                <p className="text-lg font-medium">Enter a job title or keywords to start searching.</p>
                <p className="text-sm opacity-70 mt-1">AI will find real job opportunities based on your skills</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
