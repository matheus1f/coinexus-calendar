import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Star, Flag, TrendingUp, AlertCircle, Search, Moon, Sun } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EconomicCalendar = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sample data
  const initialEvents = [
    {
      id: 1,
      time: "09:30",
      country: "🇺🇸 USD",
      event: "Non-Farm Payrolls",
      actual: "263K",
      forecast: "200K",
      previous: "315K",
      impact: "high",
      importance: 3,
      date: "2025-01-20"
    },
    {
      id: 2,
      time: "11:00",
      country: "🇪🇺 EUR",
      event: "CPI y/y",
      actual: "10.1%",
      forecast: "10.0%",
      previous: "9.9%",
      impact: "high",
      importance: 3,
      date: "2025-01-20"
    },
    {
      id: 3,
      time: "14:00",
      country: "🇬🇧 GBP",
      event: "BOE Interest Rate Decision",
      actual: "3.00%",
      forecast: "3.00%",
      previous: "2.25%",
      impact: "medium",
      importance: 2,
      date: "2025-01-21"
    },
  ];

  const [events, setEvents] = useState(initialEvents);
  const [filteredEvents, setFilteredEvents] = useState(initialEvents);
  const [filters, setFilters] = useState({
    date: '',
    time: '',
    country: '',
    event: '',
    importance: 'all' // Changed from empty string to 'all'
  });

  const countries = [...new Set(events.map(event => event.country))];
  const importanceLevels = [1, 2, 3];

  useEffect(() => {
    let result = [...events];

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(event => {
          if (key === 'importance') {
            return event[key] === parseInt(value);
          }
          const eventValue = event[key]?.toString().toLowerCase();
          const filterValue = value.toLowerCase();
          return eventValue?.includes(filterValue);
        });
      }
    });

    setFilteredEvents(result);
  }, [filters, events]);

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'text-red-500 dark:text-red-400';
      case 'medium':
        return 'text-orange-500 dark:text-orange-400';
      case 'low':
        return 'text-green-500 dark:text-green-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const getImportanceStars = (importance) => {
    return '⭐'.repeat(importance);
  };

  // Header Filter Component
  const HeaderFilter = ({ column, icon }) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-sm font-medium">
        {icon && React.createElement(icon, { className: "h-4 w-4" })}
        {column.charAt(0).toUpperCase() + column.slice(1)}
      </div>
      <input
        type={column === 'date' ? 'date' : 'text'}
        placeholder={`Filter ${column}...`}
        value={filters[column]}
        onChange={(e) => setFilters({ ...filters, [column]: e.target.value })}
        className="px-2 py-1 text-sm rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
    </div>
  );

  return (
    <Card className="w-full max-w-5xl dark:bg-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Calendar className="h-6 w-6" />
              Economic Calendar
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              Real-time economic events and indicators
            </CardDescription>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? 
              <Sun className="h-5 w-5 text-yellow-500" /> : 
              <Moon className="h-5 w-5 text-gray-500" />
            }
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Header with Filters */}
          <div className="grid grid-cols-8 gap-4 px-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <HeaderFilter column="time" icon={Clock} />
            <HeaderFilter column="country" icon={Flag} />
            <div className="col-span-2">
              <HeaderFilter column="event" icon={Star} />
            </div>
            <HeaderFilter column="actual" icon={TrendingUp} />
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">Forecast</div>
              <div className="h-8"></div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">Previous</div>
              <div className="h-8"></div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm font-medium">
                <AlertCircle className="h-4 w-4" />
                Import.
              </div>
              <Select
                value={filters.importance}
                onValueChange={(value) => setFilters({...filters, importance: value})}
              >
                <SelectTrigger className="h-8 dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="All Importance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Importance</SelectItem>
                  {importanceLevels.map(level => (
                    <SelectItem key={level} value={level.toString()}>
                      {getImportanceStars(level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Event Rows */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No events found matching your filters
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="grid grid-cols-8 gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors dark:text-gray-200"
              >
                <div className="text-gray-600 dark:text-gray-400">{event.time}</div>
                <div className="font-medium">{event.country}</div>
                <div className="col-span-2 font-medium">
                  <span className={`mr-2 inline-block w-2 h-2 rounded-full ${getImpactColor(event.impact)}`}></span>
                  {event.event}
                </div>
                <div className="font-medium text-blue-600 dark:text-blue-400">{event.actual}</div>
                <div className="text-gray-600 dark:text-gray-400">{event.forecast}</div>
                <div className="text-gray-600 dark:text-gray-400">{event.previous}</div>
                <div className="text-yellow-500" title={`Importance: ${event.importance}`}>
                  {getImportanceStars(event.importance)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EconomicCalendar;