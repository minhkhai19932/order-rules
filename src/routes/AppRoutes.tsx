import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import OrdersPage from '../pages/OrdersPage';
import ProductsPage from '../pages/ProductsPage';

/**
 * Defines all application routes.
 * - / redirects to /orders
 * - All routes are wrapped in AppLayout for consistent navigation
 * - /orders renders OrdersPage
 * - /products renders ProductsPage
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/orders" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Route>
    </Routes>
  );
}

