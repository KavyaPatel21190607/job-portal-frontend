import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Users, Loader2 } from 'lucide-react';
import jobService, { type Job } from '@/services/jobService';
import { CreateJobDialog } from './CreateJobDialog';

export function JobPostings() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getMyJobs();
      setJobs(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    
    try {
      setDeletingId(jobId);
      await jobService.deleteJob(jobId);
      setJobs(jobs.filter(job => job._id !== jobId));
      alert('Job deleted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setDialogOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setDialogOpen(true);
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/employer/applicants?job=${jobId}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-gray-900">Job Postings</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your job listings</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto" onClick={handleCreateJob}>
          <Plus className="w-4 h-4 mr-2" />
          <span className="text-sm sm:text-base">Create New Job</span>
        </Button>
      </div>

      <CreateJobDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchJobs}
        editJob={editingJob}
      />

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500 py-8">
                  No job postings yet. Create your first job posting!
                </p>
              </CardContent>
            </Card>
          ) : (
            jobs.filter(job => job != null).map((job) => (
              <Card key={job._id}>
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg sm:text-xl mb-1 sm:mb-2 truncate">{job.title}</CardTitle>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <span className="truncate">{job.location}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{job.jobType}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-xs">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge className={`${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} text-xs whitespace-nowrap self-start sm:self-auto`}>
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 line-clamp-2">{job.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{job.applicants?.length || 0} applications</span>
                    </div>
                    <div className="flex flex-wrap flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewJob(job._id)} className="text-xs sm:text-sm flex-1 sm:flex-initial">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditJob(job)} className="text-xs sm:text-sm flex-1 sm:flex-initial">
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(job._id)}
                        disabled={deletingId === job._id}
                        className="text-xs sm:text-sm w-full sm:w-auto"
                      >
                        {deletingId === job._id ? (
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        )}
                        Delete
                      </Button>
                    </div>
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
