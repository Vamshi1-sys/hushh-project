import React, { useState } from 'react';
import { BookOpen, Star, Users as UsersIcon, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  name: string;
  instructor: string;
  description: string;
  rating: number;
  enrolled: number;
  duration: string;
  level: string;
  category: string;
  price?: number;
}

export default function StudentCourses() {
  const [activeTab, setActiveTab] = useState<'enrolled' | 'available'>('enrolled');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(['1', '2', '3', '4']);

  // Enrolled courses data
  const enrolledCourses: Course[] = [
    {
      id: '1',
      name: 'Introduction to Web Development',
      instructor: 'Sarah Johnson',
      description: 'Learn the fundamentals of HTML, CSS, and JavaScript',
      rating: 4.8,
      enrolled: 245,
      duration: '8 weeks',
      level: 'Beginner',
      category: 'Web Development'
    },
    {
      id: '2',
      name: 'Advanced React Patterns',
      instructor: 'Michael Chen',
      description: 'Master advanced React patterns and best practices',
      rating: 4.9,
      enrolled: 89,
      duration: '10 weeks',
      level: 'Advanced',
      category: 'Web Development'
    },
    {
      id: '3',
      name: 'Cloud Architecture Fundamentals',
      instructor: 'Emily Rodriguez',
      description: 'Build scalable cloud solutions on modern platforms',
      rating: 4.7,
      enrolled: 156,
      duration: '12 weeks',
      level: 'Intermediate',
      category: 'Cloud Computing'
    },
    {
      id: '4',
      name: 'Data Science Essentials',
      instructor: 'Prof. James Wilson',
      description: 'Fundamentals of data analysis and machine learning',
      rating: 4.6,
      enrolled: 312,
      duration: '10 weeks',
      level: 'Intermediate',
      category: 'Data Science'
    }
  ];

  // Available courses (different from enrolled)
  const availableCourses: Course[] = [
    {
      id: '5',
      name: 'Python Mastery: From Basics to Advanced',
      instructor: 'Alex Kumar',
      description: 'Complete Python programming course with real-world projects',
      rating: 4.9,
      enrolled: 523,
      duration: '12 weeks',
      level: 'Beginner',
      category: 'Programming'
    },
    {
      id: '6',
      name: 'UI/UX Design Principles',
      instructor: 'Jessica Martinez',
      description: 'Learn design principles, prototyping, and user research',
      rating: 4.8,
      enrolled: 198,
      duration: '8 weeks',
      level: 'Beginner',
      category: 'Design'
    },
    {
      id: '7',
      name: 'Database Design & SQL',
      instructor: 'David Lee',
      description: 'Master relational databases and advanced SQL queries',
      rating: 4.7,
      enrolled: 287,
      duration: '10 weeks',
      level: 'Intermediate',
      category: 'Database'
    },
    {
      id: '8',
      name: 'DevOps and CI/CD Pipeline',
      instructor: 'Robert Taylor',
      description: 'Deploy applications with modern DevOps practices',
      rating: 4.8,
      enrolled: 145,
      duration: '9 weeks',
      level: 'Advanced',
      category: 'DevOps'
    },
    {
      id: '9',
      name: 'Mobile App Development with Flutter',
      instructor: 'Nina Patel',
      description: 'Build beautiful cross-platform mobile applications',
      rating: 4.9,
      enrolled: 401,
      duration: '11 weeks',
      level: 'Intermediate',
      category: 'Mobile Development'
    },
    {
      id: '10',
      name: 'Cybersecurity Fundamentals',
      instructor: 'Mark Johnson',
      description: 'Protect systems and networks from cyber threats',
      rating: 4.7,
      enrolled: 267,
      duration: '10 weeks',
      level: 'Intermediate',
      category: 'Security'
    }
  ];

  const handleEnroll = (courseId: string, courseName: string) => {
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds([...enrolledCourseIds, courseId]);
      toast.success(`Successfully enrolled in "${courseName}"!`);
    }
  };

  const CourseCard = ({ course, isEnrolled, onEnroll }: { course: Course; isEnrolled: boolean; onEnroll?: (id: string, name: string) => void }) => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-lg">
      <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            course.level === 'Beginner'
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
              : course.level === 'Intermediate'
              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
              : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
          }`}>
            {course.level}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{course.name}</h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{course.description}</p>

        <div className="space-y-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Instructor</span>
            <span className="font-semibold text-slate-900 dark:text-white">{course.instructor}</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-amber-500" fill="currentColor" />
              <span className="font-semibold text-slate-900 dark:text-white">{course.rating}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <UsersIcon size={16} />
              {course.enrolled} students
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock size={16} />
              {course.duration}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
            {course.category}
          </span>
        </div>

        {isEnrolled && (
          <button className="w-full mt-4 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
            <CheckCircle size={18} />
            Enrolled
          </button>
        )}

        {!isEnrolled && onEnroll && (
          <button 
            onClick={() => onEnroll(course.id, course.name)}
            className="w-full mt-4 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <ArrowRight size={18} />
            Enroll Now
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex items-center gap-4 p-1 bg-slate-100 dark:bg-slate-800 w-fit rounded-2xl">
        <button
          onClick={() => setActiveTab('enrolled')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'enrolled'
              ? 'bg-white dark:bg-slate-900 shadow-sm text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <BookOpen className="inline mr-2" size={16} />
          Enrolled Courses
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'available'
              ? 'bg-white dark:bg-slate-900 shadow-sm text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Star className="inline mr-2" size={16} />
          Browse Courses
        </button>
      </div>

      {/* Enrolled Courses Tab */}
      {activeTab === 'enrolled' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your Enrolled Courses</h2>
            <p className="text-slate-600 dark:text-slate-400">Continue learning with {enrolledCourses.length} courses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard key={course.id} course={course} isEnrolled={true} />
            ))}
          </div>
        </div>
      )}

      {/* Available Courses Tab */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Explore More Courses</h2>
            <p className="text-slate-600 dark:text-slate-400">Discover {availableCourses.length} new courses to expand your skills</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                isEnrolled={enrolledCourseIds.includes(course.id)}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
