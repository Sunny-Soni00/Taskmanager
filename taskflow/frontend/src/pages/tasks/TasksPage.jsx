// src/pages/tasks/TasksPage.jsx

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, LayoutGrid, List, CheckSquare, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import KanbanBoard from '../../components/tasks/KanbanBoard';
import TaskList from '../../components/tasks/TaskList';
import CalendarView from '../../components/tasks/CalendarView';
import CreateTaskModal from '../../components/tasks/CreateTaskModal';
import TaskDetailsModal from '../../components/tasks/TaskDetailsModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TasksApi from '../../api/tasks.api';
import ProjectsApi from '../../api/projects.api';
import TeamsApi from '../../api/teams.api';

/**
 * TasksPage Component
 * Manage tasks with Kanban board and list view
 */

const TasksPage = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('all');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban', 'list', or 'calendar'
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskDetailsModal, setTaskDetailsModal] = useState({ isOpen: false, task: null });

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (projectId) {
      setSelectedProject(projectId);
      loadTasks(projectId);
    } else {
      setSelectedProject('all');
      loadTasks(null);
    }
  }, [projectId, projects]);

  const loadProjects = async () => {
    try {
      const teams = await TeamsApi.getMyTeams();
      const allProjects = [];
      for (const team of teams) {
        try {
          const teamProjects = await ProjectsApi.getTeamProjects(team.id);
          allProjects.push(...teamProjects);
        } catch (err) {
          console.error('Failed to load projects:', err);
        }
      }
      setProjects(allProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const loadTasks = async (filterProjectId = null) => {
    try {
      setIsLoading(true);
      if (filterProjectId && filterProjectId !== 'all') {
        const data = await TasksApi.getProjectTasks(parseInt(filterProjectId));
        setTasks(data);
      } else {
        // Load all tasks for the user (including tasks without projects)
        const data = await TasksApi.getAllUserTasks();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectFilter = (projectId) => {
    setSelectedProject(projectId);
    loadTasks(projectId === 'all' ? null : projectId);
  };

  const handleCreateSuccess = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleTaskClick = (task) => {
    setTaskDetailsModal({ isOpen: true, task });
  };

  const handleTaskUpdate = () => {
    loadTasks(selectedProject === 'all' ? null : selectedProject);
    setTaskDetailsModal({ isOpen: false, task: null });
  };

  const handleTaskDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }
    
    try {
      await TasksApi.deleteTask(taskDetailsModal.task.id);
      setTaskDetailsModal({ isOpen: false, task: null });
      loadTasks(selectedProject === 'all' ? null : selectedProject);
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" text="Loading tasks..." />
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
              Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track your tasks
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-white dark:bg-gray-600 shadow'
                    : 'hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                title="Kanban View"
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
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-white dark:bg-gray-600 shadow'
                    : 'hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                title="Calendar View"
              >
                <Calendar className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Task
            </Button>
          </div>
        </div>

        {/* Project Filter */}
        {projects.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => handleProjectFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedProject === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Tasks
            </button>
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleProjectFilter(project.id.toString())}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedProject === project.id.toString()
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {project.name}
              </button>
            ))}
          </div>
        )}

        {/* Tasks View */}
        {tasks.length === 0 ? (
          <div className="text-center py-16">
            <CheckSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first task to get started
            </p>
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              Create Your First Task
            </Button>
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard tasks={tasks} onTaskClick={handleTaskClick} />
        ) : viewMode === 'list' ? (
          <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
        ) : (
          <CalendarView tasks={tasks} onTaskClick={handleTaskClick} />
        )}
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
        preselectedProjectId={selectedProject !== 'all' ? selectedProject : null}
      />
      <TaskDetailsModal
        isOpen={taskDetailsModal.isOpen}
        onClose={() => setTaskDetailsModal({ isOpen: false, task: null })}
        task={taskDetailsModal.task}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />
    </DashboardLayout>
  );
};

export default TasksPage;