import { Outlet, NavLink } from 'react-router-dom';

/**
 * Main application layout with navigation tabs.
 * Provides consistent header with "Shop Admin" title and tab navigation.
 * Active tab is highlighted with orange brand color.
 * Responsive design works on mobile and desktop.
 */
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Shop Admin
            </h1>
            <nav className="flex space-x-1" aria-label="Main navigation">
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                Orders
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                Products
              </NavLink>
            </nav>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

