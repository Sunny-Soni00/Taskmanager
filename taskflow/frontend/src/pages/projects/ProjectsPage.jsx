// src/pages/projects/ProjectsPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, FolderKanban, LayoutGrid, List } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectList from '../../components/projects/ProjectList';
import CreateProjectModal from '../../components/projects/CreateProjectModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProjectsApi from '../../api/projects.api';
import TeamsApi from '../../api/teams.api';

/**
 * ProjectsPage Component
 * Manage projects
 */

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('team');

  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (teams.length > 0) {
      if (teamId) {
        setSelectedTeam(teamId);
        loadProjects(teamId);
      } else {
        setSelectedTeam('all');
        loadProjects('all');
      }
    } else {
      // No teams, stop loading
      setIsLoading(false);
    }
  }, [teamId, teams]);

  const loadTeams = async () => {
    try {
      const data = await TeamsApi.getMyTeams();
      setTeams(data);
    } catch (error) {
      console.error('Failed to load teams:', error);
    }
  };

  const loadProjects = async (filterTeamId = null) => {
    try {
      setIsLoading(true);
      
      if (filterTeamId && filterTeamId !== 'all') {
        const data = await ProjectsApi.getTeamProjects(parseInt(filterTeamId));
        setProjects(data);
      } else {
        // Load all projects from all teams
        const allProjects = [];
        for (const team of teams) {
          try {
            const teamProjects = await ProjectsApi.getTeamProjects(team.id);
            allProjects.push(...teamProjects);
          } catch (err) {
            console.error(`Failed to load projects for team ${team.id}:`, err);
          }
        }
        setProjects(allProjects);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamFilter = (teamId) => {
    setSelectedTeam(teamId);
    if (teamId === 'all') {
      navigate('/projects');
      loadProjects(null);
    } else {
      navigate(`/projects?team=${teamId}`);
      loadProjects(teamId);
    }
  };

  const handleCreateSuccess = (newProject) => {
    setProjects([...projects, newProject]);
  };

  const handleViewTasks = (project) => {
    navigate(`/tasks?project=${project.id}`);
  };

  const handleDeleteProject = async (project) => {
    if (!window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      return;
    }
    
    try {
      await ProjectsApi.deleteProject(project.id);
      setProjects(projects.filter(p => p.id !== project.id));
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project. You may not have permission.');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" text="Loading projects..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and organize your projects
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 shadow'
                    : 'hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 shadow'
                    : 'hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                title="List View"
              >
                <List className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Project
            </Button>
          </div>
        </div>

        {/* Team Filter */}
        {teams.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => handleTeamFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedTeam === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Projects
            </button>
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => handleTeamFilter(team.id.toString())}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedTeam === team.id.toString()
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {team.name}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {teams.length === 0 ? (
          <div className="text-center py-16">
            <FolderKanban className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Create a team first
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to create or join a team before managing projects
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/teams')}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              Go to Teams
            </Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <FolderKanban className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first project to get started
            </p>
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              Create Your First Project
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewTasks={handleViewTasks}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        ) : (
          <ProjectList
            projects={projects}
            onViewTasks={handleViewTasks}
            onDelete={handleDeleteProject}
          />
        )}
      </div>

      {/* Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
        preselectedTeamId={selectedTeam !== 'all' ? selectedTeam : null}
      />
    </DashboardLayout>
  );
};

export default ProjectsPage;