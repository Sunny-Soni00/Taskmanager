// src/constants/index.js

/**
 * Application Constants
 * Centralized configuration following Single Responsibility Principle
 */

// ============================================
// API CONFIGURATION
// ============================================
export const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  
  // Teams
  TEAMS: '/teams',
  MY_TEAMS: '/teams/my',
  ADD_MEMBER: (teamId) => `/teams/${teamId}/add-member`,
  
  // Projects
  PROJECTS: '/projects',
  TEAM_PROJECTS: (teamId) => `/projects/team/${teamId}`,
  
  // Tasks
  TASKS: '/tasks',
  PROJECT_TASKS: (projectId) => `/tasks/project/${projectId}`,
  UPDATE_TASK: (taskId) => `/tasks/${taskId}`,
  CHANGE_TASK_STATUS: (taskId) => `/tasks/${taskId}/status`,
  DELETE_TASK: (taskId) => `/tasks/${taskId}`,
  ALL_USER_TASKS: '/tasks/user/all',
};

// ============================================
// LOCAL STORAGE KEYS
// ============================================
export const STORAGE_KEYS = {
  TOKEN: 'taskmanager_token',
  USER: 'taskmanager_user',
  THEME: 'taskmanager_theme',
};

// ============================================
// TASK CONFIGURATION
// ============================================
export const TASK_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
  { value: 'high', label: 'High', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
];

export const TASK_STATUSES = [
  { 
    value: 'todo', 
    label: 'To Do', 
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    icon: 'Circle'
  },
  { 
    value: 'in-progress', 
    label: 'In Progress', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    icon: 'Clock'
  },
  { 
    value: 'done', 
    label: 'Done', 
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    icon: 'CheckCircle2'
  },
];

// ============================================
// APP CONFIGURATION
// ============================================
export const APP_NAME = 'Task Manager';
export const APP_TAGLINE = 'Collaborative Task Management for Teams';
export const APP_DESCRIPTION = 'Streamline your workflow with powerful task management, team collaboration, and project tracking - all in one place.';

// ============================================
// FEATURES FOR HOME PAGE
// ============================================
export const FEATURES = [
  {
    icon: 'Users',
    title: 'Team Collaboration',
    description: 'Work together seamlessly with your team members in real-time. Share tasks, projects, and stay in sync.',
  },
  {
    icon: 'FolderKanban',
    title: 'Project Management',
    description: 'Organize your work into projects and track progress with intuitive kanban boards and list views.',
  },
  {
    icon: 'CheckSquare',
    title: 'Task Tracking',
    description: 'Create, assign, and track tasks with priorities, due dates, and status updates to stay on top of deadlines.',
  },
  {
    icon: 'Zap',
    title: 'Lightning Fast',
    description: 'Built with modern technologies for blazing fast performance and smooth user experience.',
  },
  {
    icon: 'Shield',
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure. We take privacy seriously and never share your information.',
  },
  {
    icon: 'Moon',
    title: 'Dark Mode',
    description: 'Easy on the eyes with built-in dark mode support. Switch themes instantly based on your preference.',
  },
];

// ============================================
// PRICING PLANS
// ============================================
export const PRICING_PLANS = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    description: 'Perfect for individuals and small teams getting started',
    features: [
      'Up to 3 team members',
      'Unlimited tasks',
      'Basic project management',
      'Email support',
      'Mobile app access',
    ],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '12',
    period: 'month',
    description: 'For growing teams that need more power and flexibility',
    features: [
      'Unlimited team members',
      'Unlimited tasks & projects',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'Advanced security',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with specific needs',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom SLA',
      'On-premise deployment',
      'Advanced admin controls',
      '24/7 phone support',
    ],
    highlighted: false,
  },
];

// ============================================
// TESTIMONIALS
// ============================================
export const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Product Manager at Tech Startup',
    avatar: 'PS',
    content: 'Task Manager transformed how our team collaborates. The interface is intuitive and the features are exactly what we needed.',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Freelance Developer',
    avatar: 'RV',
    content: 'As a freelancer managing multiple projects, Task Manager helps me stay organized and meet all my deadlines effortlessly.',
    rating: 5,
  },
  {
    name: 'Anjali Patel',
    role: 'Marketing Lead',
    avatar: 'AP',
    content: 'The best task management tool I have used. Clean design, powerful features, and great customer support!',
    rating: 5,
  },
];

// ============================================
// NAVIGATION
// ============================================
export const NAV_LINKS = {
  PUBLIC: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
  ],
  AUTHENTICATED: [
    { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Teams', href: '/teams', icon: 'Users' },
    { name: 'Projects', href: '/projects', icon: 'FolderKanban' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
  ],
};