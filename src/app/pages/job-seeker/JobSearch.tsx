import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Search, MapPin, DollarSign, Briefcase, Clock, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import jobService, { type Job } from '@/services/jobService';
import applicationService from '@/services/applicationService';
import { useNavigate } from 'react-router';

export function JobSearch() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [jobType, setJobType] = useState('all');
  const [workType, setWorkType] = useState('all');
  const [experienceLevel] = useState('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, jobType, workType, experienceLevel]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      
      if (searchTerm) filters.search = searchTerm;
      if (jobType !== 'all') filters.jobType = jobType;
      if (workType !== 'all') filters.workType = workType;
      if (experienceLevel !== 'all') filters.experienceLevel = experienceLevel;

      const response = await jobService.getAllJobs(filters);
      setJobs(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      setApplyingJobId(jobId);
      await applicationService.applyForJob(jobId);
      alert('Application submitted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to apply for job');
    } finally {
      setApplyingJobId(null);
    }
  };

  const formatSalary = (min: number, max: number) => {
    return `₹ ${(min / 100000).toFixed(1)} - ${(max / 100000).toFixed(1)} LPA`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const jobDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - jobDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Posted today';
    if (diffDays === 1) return 'Posted yesterday';
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    return `Posted on ${jobDate.toLocaleDateString()}`;
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <div className="text-center sm:text-left px-4 sm:px-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 text-gray-900">Find Jobs</h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600">Discover opportunities that match your skills</p>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm mx-3 sm:mx-0">
        <CardContent className="p-4 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-sm md:text-base h-11 sm:h-10"
              />
            </div>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="text-sm sm:text-sm md:text-base h-11 sm:h-10">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <Select value={workType} onValueChange={setWorkType}>
              <SelectTrigger className="text-sm sm:text-sm md:text-base h-11 sm:h-10">
                <SelectValue placeholder="Work Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="onsite">Onsite</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8 sm:py-12">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50 mx-3 sm:mx-0">
          <CardContent className="p-4 sm:p-6">
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Job Listings */}
      {!loading && !error && (
        <div className="space-y-3 sm:space-y-4">
          {jobs.length === 0 ? (
            <Card className="mx-3 sm:mx-0">
              <CardContent className="p-6">
                <p className="text-center text-sm md:text-base text-gray-500 py-8">
                  No jobs found. Try adjusting your search filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            jobs.filter(job => job != null).map((job) => (
              <Card key={job._id} className="hover:shadow-lg transition-all duration-200 mx-3 sm:mx-0 shadow-sm">
                <CardHeader className="p-4 sm:p-5 md:p-6 pb-3">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg md:text-xl mb-1.5 leading-tight">{job.title}</CardTitle>
                      <p className="text-gray-600 font-medium text-sm sm:text-sm md:text-base mb-2">{job.companyName}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs sm:text-sm px-2.5 py-1">
                        {job.jobType}
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs sm:text-sm px-2.5 py-1">
                        {job.workType}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
                  <div className="grid grid-cols-1 gap-2 mb-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">
                        {formatSalary(job.salaryRange.min, job.salaryRange.max)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 line-clamp-2 text-sm leading-relaxed">{job.description}</p>
                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.requiredSkills.slice(0, 5).map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs px-2 py-1">{skill}</Badge>
                    ))}
                    {job.requiredSkills.length > 5 && (
                      <Badge variant="outline" className="text-xs px-2 py-1">+{job.requiredSkills.length - 5} more</Badge>
                    )}
                  </div>
                  )}
                  <div className="flex flex-col gap-2.5">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 w-full text-sm font-medium h-11 touch-manipulation"
                      onClick={() => handleApply(job._id)}
                      disabled={applyingJobId === job._id}
                    >
                      {applyingJobId === job._id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span>Applying...</span>
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-4 h-4 mr-2" />
                          <span>Apply Now</span>
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/job-seeker/jobs/${job._id}`)}
                      className="w-full text-sm font-medium h-11 touch-manipulation hover:bg-gray-50 active:bg-gray-100"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
