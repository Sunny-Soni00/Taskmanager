// src/components/projects/ProjectCard.jsx

import { FolderKanban, ExternalLink, Trash2 } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * ProjectCard Component
 * Display project information card
 */

const ProjectCard = ({ project, onViewTasks, onDelete }) => {
  return (
    <Card hover className="animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <FolderKanban className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Project ID: {project.id}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onViewTasks(project)}
            className="flex items-center gap-2"
          >
            View Tasks
            <ExternalLink className="h-4 w-4" />
          </Button>
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(project)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;