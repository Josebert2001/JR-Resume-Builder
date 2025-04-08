
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, MapPin, Briefcase, Calendar, DollarSign, BuildingIcon } from 'lucide-react';
import { ResumeData } from '@/context/ResumeContext';
import { searchJobs, getAvailableLocations, getAvailableCategories, JobListing } from '@/services/jobSearchService';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { JobApplication } from './JobApplicationTracker';

interface JobSearchProps {
  resumeData: ResumeData;
}

const JobSearch: React.FC<JobSearchProps> = ({ resumeData }) => {
  const [location, setLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(resumeData.course || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [applications, setApplications] = useLocalStorage<JobApplication[]>('job-applications', []);
  const { toast } = useToast();

  useEffect(() => {
    // Pre-populate search with course and interests from resume data
    if (resumeData.course || resumeData.interests) {
      setSearchQuery(`${resumeData.course} ${resumeData.interests}`);
    }
    
    // Get available locations and categories
    setAvailableLocations(getAvailableLocations());
    setAvailableCategories(getAvailableCategories());
  }, [resumeData]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // Update search query with selected category if available
      const finalQuery = selectedCategory ? 
        `${searchQuery} ${selectedCategory}` : 
        searchQuery;
        
      const results = await searchJobs(finalQuery, location);
      setJobListings(results);
    } catch (error) {
      console.error('Error searching for jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyNow = (job: JobListing) => {
    // Check if already applied
    const alreadyApplied = applications.some(app => app.jobId === job.id);
    
    if (alreadyApplied) {
      toast({
        title: "Already Applied",
        description: `You've already applied for the ${job.title} position at ${job.company}.`,
        variant: "default",
      });
      return;
    }
    
    // Add to applications
    const newApplication: JobApplication = {
      id: crypto.randomUUID(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      dateApplied: new Date().toISOString(),
      status: 'applied',
      notes: `Applied for ${job.title} at ${job.company}`,
    };
    
    setApplications([...applications, newApplication]);
    
    toast({
      title: "Application Submitted",
      description: `Your application for ${job.title} at ${job.company} has been saved.`,
      variant: "default",
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-resume-primary mb-4">Find Relevant Job Opportunities</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="keywords" className="block mb-2">Keywords / Skills</Label>
          <Input
            id="keywords"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Job title, skills, or keywords"
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="category" className="block mb-2">Job Category</Label>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {availableCategories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="location" className="block mb-2">Location</Label>
          <Select
            value={location}
            onValueChange={setLocation}
          >
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {availableLocations.map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end">
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-resume-primary hover:bg-resume-secondary text-white w-full flex items-center justify-center gap-2"
          >
            {isLoading ? 'Searching...' : (
              <>
                <Search size={16} /> Search Jobs
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="mt-6">
        {jobListings.length > 0 ? (
          <div className="space-y-4">
            {jobListings.map((job) => (
              <Card key={job.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-resume-primary">{job.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 mb-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Briefcase size={14} />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{job.location}</span>
                      </div>
                      {job.jobType && (
                        <div className="flex items-center gap-1">
                          <BuildingIcon size={14} />
                          <span>{job.jobType}</span>
                        </div>
                      )}
                      {job.datePosted && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Posted: {formatDate(job.datePosted)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{job.description}</p>
                    {job.salary && (
                      <div className="flex items-center gap-1 text-sm text-green-600 font-medium mb-3">
                        <DollarSign size={14} />
                        <span>{job.salary}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 md:mt-0 md:ml-4 flex md:flex-col gap-2 md:items-end">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {job.industry || 'General'}
                    </span>
                    <div className="flex gap-2">
                      <a 
                        href={job.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition-colors"
                      >
                        View Details
                      </a>
                      <Button
                        onClick={() => handleApplyNow(job)}
                        className="px-4 py-2 bg-resume-primary text-white text-sm rounded hover:bg-resume-secondary transition-colors"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {isLoading ? 
              'Searching for jobs...' : 
              jobListings.length === 0 && searchQuery ? 
              'No job listings found. Try different keywords or location.' : 
              'Search for jobs by entering keywords and location above.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
