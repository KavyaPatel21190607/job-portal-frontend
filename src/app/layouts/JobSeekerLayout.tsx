import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import authService from '@/services/authService';
import { Button } from '@/app/components/ui/button';
import { Briefcase, Search, FileText, MessageSquare, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

export function JobSeekerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getStoredUser();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Closed by default on mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/job-seeker/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/job-seeker/jobs', label: 'Find Jobs', icon: Search },
    { path: '/job-seeker/applications', label: 'My Applications', icon: Briefcase },
    { path: '/job-seeker/resume', label: 'Resume Builder', icon: FileText },
    { path: '/job-seeker/messages', label: 'Messages', icon: MessageSquare },
    { path: '/job-seeker/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-base sm:text-xl text-gray-900">JobSeeker Portal</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Find your dream job</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right hidden md:block">
                <p className="text-xs sm:text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">{user?.name}</p>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm" className="text-xs sm:text-sm">
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        <div className="flex gap-4 lg:gap-6 relative">
          {/* Sidebar Navigation */}
          <aside
            className={`
              fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
              transition-transform duration-300 ease-in-out
              ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              ${sidebarOpen ? 'w-64' : 'w-16 hidden lg:block'}
              lg:flex-shrink-0
            `}
          >
            <div className="bg-white rounded-none lg:rounded-xl shadow-lg lg:shadow-sm border-r lg:border border-gray-100 h-full min-h-screen lg:min-h-0">
              {/* Toggle Button - Desktop Only */}
              <div className="p-4 border-b border-gray-100 hidden lg:block">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="w-full justify-start"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  {sidebarOpen && <span className="ml-2">Collapse</span>}
                </Button>
              </div>
              
              {/* Mobile Header */}
              <div className="p-4 border-b border-gray-100 lg:hidden">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Menu</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="p-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 ${
                        isActive
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-blue-50'
                      } ${!sidebarOpen && 'justify-center'}`}
                      title={!sidebarOpen ? item.label : ''}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && <span className="font-medium">{item.label}</span>}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 w-full lg:w-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
