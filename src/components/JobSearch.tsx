
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { ResumeData } from '@/context/ResumeContext';
import { searchJobs } from '@/services/jobSearchService';
import { Label } from '@/components/ui/label';

type JobListingType = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
};

interface JobSearchProps {
  resumeData: ResumeData;
}

const JobSearch: React.FC<JobSearchProps> = ({ resumeData }) => {
  const [location, setLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(resumeData.course || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jobListings, setJobListings] = useState<JobListingType[]>([]);

  useEffect(() => {
    // Pre-populate search with course and interests from resume data
    if (resumeData.course || resumeData.interests) {
      setSearchQuery(`${resumeData.course} ${resumeData.interests}`);
    }
  }, [resumeData]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const results = await searchJobs(searchQuery, location);
      setJobListings(results);
    } catch (error) {
      console.error('Error searching for jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-resume-primary mb-4">Find Relevant Job Opportunities</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
          <Label htmlFor="location" className="block mb-2">Location</Label>
          <Input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, state, or country"
            className="w-full"
          />
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
              <Card key={job.id} className="p-4">
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
                </div>
                <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                <div className="text-right">
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-resume-primary hover:underline font-medium"
                  >
                    View Job
                  </a>
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
