// src/pages/dashboard/DashboardPage.jsx

import { useState, useEffect } from 'react';
import { Users, FolderKanban, CheckSquare, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import QuickActions from '../../components/dashboard/QuickActions';
import RecentTasks from '../../components/dashboard/RecentTasks';
import TeamsApi from '../../api/teams.api';
import TasksApi from '../../api/tasks.api';

/**
 * DashboardPage Component
 * Main dashboard overview
 */

const DashboardPage = () => {
  const [stats, setStats] = useState({
    teams: 0,
    projects: 0,
    tasks: 0,
    completed: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load teams
      const teams = await TeamsApi.getMyTeams();
      
      // Load all tasks to get stats
      let allTasks = [];
      let allProjects = [];
      
      try {
        allTasks = await TasksApi.getAllUserTasks();
      } catch (err) {
        console.error('Failed to load tasks:', err);
      }
      
      // Load projects from all teams
      for (const team of teams) {
        try {
          const { default: ProjectsApi } = await import('../../api/projects.api');
          const teamProjects = await ProjectsApi.getTeamProjects(team.id);
          allProjects.push(...teamProjects);
        } catch (err) {
          console.error('Failed to load projects:', err);
        }
      }
      
      // Calculate stats
      const completedTasks = allTasks.filter(task => task.status === 'done').length;
      
      setStats({
        teams: teams.length,
        projects: allProjects.length,
        tasks: allTasks.length,
        completed: completedTasks,
      });
      
      // Set recent tasks (last 5 tasks)
      setRecentTasks(allTasks.slice(0, 5));
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your projects today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Teams"
            value={stats.teams}
            icon={Users}
            color="primary"
          />
          <StatsCard
            title="Active Projects"
            value={stats.projects}
            icon={FolderKanban}
            color="success"
          />
          <StatsCard
            title="Total Tasks"
            value={stats.tasks}
            icon={CheckSquare}
            color="warning"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={Clock}
            color="danger"
          />
        </div>

        {/* Quick Actions */}
        <QuickActions
          onCreateTeam={() => window.location.href = '/teams'}
          onCreateProject={() => window.location.href = '/projects'}
          onCreateTask={() => window.location.href = '/tasks'}
        />

        {/* Recent Tasks */}
        <RecentTasks tasks={recentTasks} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;