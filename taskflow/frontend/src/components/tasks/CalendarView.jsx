// src/components/tasks/CalendarView.jsx

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

/**
 * CalendarView Component
 * Display tasks in calendar format by due date
 */

const CalendarView = ({ tasks, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month or week

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getWeekDays = (date) => {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay();
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(curr.setDate(first + i));
      days.push(day);
    }
    return days;
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300';
    }
  };

  const renderMonthView = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[120px] bg-gray-50 dark:bg-gray-800/50" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayTasks = getTasksForDate(date);
      const isToday = 
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className={`min-h-[120px] border border-gray-200 dark:border-gray-700 p-2 ${
            isToday ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-white dark:bg-gray-800'
          }`}
        >
          <div className={`text-sm font-semibold mb-2 ${
            isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
          }`}>
            {day}
            {isToday && <span className="ml-1 text-xs">(Today)</span>}
          </div>
          <div className="space-y-1">
            {dayTasks.slice(0, 3).map(task => (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={`text-xs p-1 rounded border cursor-pointer hover:opacity-80 transition-opacity ${getPriorityColor(task.priority)}`}
              >
                <div className="truncate font-medium">{task.title}</div>
              </div>
            ))}
            {dayTasks.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 pl-1">
                +{dayTasks.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    
    return weekDays.map((date, index) => {
      const dayTasks = getTasksForDate(date);
      const isToday = 
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();

      return (
        <div
          key={index}
          className={`border border-gray-200 dark:border-gray-700 p-4 ${
            isToday ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-white dark:bg-gray-800'
          }`}
        >
          <div className={`text-sm font-semibold mb-3 ${
            isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
          }`}>
            <div>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}</div>
            <div className="text-2xl">{date.getDate()}</div>
            {isToday && <span className="text-xs">(Today)</span>}
          </div>
          <div className="space-y-2">
            {dayTasks.map(task => (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={`p-2 rounded border cursor-pointer hover:opacity-80 transition-opacity ${getPriorityColor(task.priority)}`}
              >
                <div className="font-medium text-sm mb-1">{task.title}</div>
                <Badge variant={task.status === 'done' ? 'success' : task.status === 'in-progress' ? 'warning' : 'default'}>
                  {task.status}
                </Badge>
              </div>
            ))}
            {dayTasks.length === 0 && (
              <div className="text-xs text-gray-400 dark:text-gray-600 text-center py-4">
                No tasks
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={view === 'month' ? 'primary' : 'outline'}
              onClick={() => setView('month')}
            >
              Month
            </Button>
            <Button
              size="sm"
              variant={view === 'week' ? 'primary' : 'outline'}
              onClick={() => setView('week')}
            >
              Week
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => view === 'month' ? navigateMonth(-1) : navigateWeek(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => view === 'month' ? navigateMonth(1) : navigateWeek(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      {view === 'month' ? (
        <>
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>
          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-0">
            {renderMonthView()}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-7 gap-4">
          {renderWeekView()}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 text-xs">
          <span className="font-medium text-gray-700 dark:text-gray-300">Priority:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span className="text-gray-600 dark:text-gray-400">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
