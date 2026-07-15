import { describe, it, expect } from 'vitest';
import router from './index';

describe('Router Configuration', () => {
  it('should have a router configuration', () => {
    expect(router).toBeDefined();
    expect(router.routes).toBeDefined();
  });

  it('should redirect root path to /login', () => {
    const rootRoute = router.routes.find(route => route.path === '/');
    expect(rootRoute).toBeDefined();
    expect(rootRoute.element.type.name).toBe('Navigate');
  });

  it('should have all public routes defined', () => {
    const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
    
    publicPaths.forEach(path => {
      const route = router.routes.find(route => route.path === path);
      expect(route).toBeDefined();
    });
  });

  it('should have user routes with nested structure', () => {
    const userRoute = router.routes.find(route => route.path === '/user');
    expect(userRoute).toBeDefined();
    expect(userRoute.children).toBeDefined();
    expect(userRoute.children.length).toBeGreaterThan(0);
  });

  it('should have admin routes with nested structure', () => {
    const adminRoute = router.routes.find(route => route.path === '/admin');
    expect(adminRoute).toBeDefined();
    expect(adminRoute.children).toBeDefined();
    expect(adminRoute.children.length).toBeGreaterThan(0);
  });

  it('should have user dashboard route', () => {
    const userRoute = router.routes.find(route => route.path === '/user');
    const dashboardRoute = userRoute.children.find(child => child.path === 'dashboard');
    expect(dashboardRoute).toBeDefined();
  });

  it('should have admin dashboard route', () => {
    const adminRoute = router.routes.find(route => route.path === '/admin');
    const dashboardRoute = adminRoute.children.find(child => child.path === 'dashboard');
    expect(dashboardRoute).toBeDefined();
  });

  it('should have banking operation routes', () => {
    const userRoute = router.routes.find(route => route.path === '/user');
    const bankingPaths = ['deposit', 'withdraw', 'transfer', 'transactions'];
    
    bankingPaths.forEach(path => {
      const route = userRoute.children.find(child => child.path === path);
      expect(route).toBeDefined();
    });
  });

  it('should have profile management routes', () => {
    const userRoute = router.routes.find(route => route.path === '/user');
    const profilePaths = ['profile', 'profile/edit', 'profile/change-password'];
    
    profilePaths.forEach(path => {
      const route = userRoute.children.find(child => child.path === path);
      expect(route).toBeDefined();
    });
  });

  it('should have beneficiary management route', () => {
    const userRoute = router.routes.find(route => route.path === '/user');
    const beneficiaryRoute = userRoute.children.find(child => child.path === 'beneficiaries');
    expect(beneficiaryRoute).toBeDefined();
  });

  it('should have customer management routes', () => {
    const adminRoute = router.routes.find(route => route.path === '/admin');
    const customerPaths = ['customers', 'customers/create'];
    
    customerPaths.forEach(path => {
      const route = adminRoute.children.find(child => child.path === path);
      expect(route).toBeDefined();
    });
  });

  it('should have account management routes', () => {
    const adminRoute = router.routes.find(route => route.path === '/admin');
    const accountRoute = adminRoute.children.find(child => child.path === 'accounts');
    expect(accountRoute).toBeDefined();
  });

  it('should have transaction management routes', () => {
    const adminRoute = router.routes.find(route => route.path === '/admin');
    const transactionRoute = adminRoute.children.find(child => child.path === 'transactions');
    expect(transactionRoute).toBeDefined();
  });

  it('should have audit log route', () => {
    const adminRoute = router.routes.find(route => route.path === '/admin');
    const auditRoute = adminRoute.children.find(child => child.path === 'audit');
    expect(auditRoute).toBeDefined();
  });

  it('should have fraud monitoring route', () => {
    const adminRoute = router.routes.find(route => route.path === '/admin');
    const fraudRoute = adminRoute.children.find(child => child.path === 'fraud');
    expect(fraudRoute).toBeDefined();
  });

  it('should have reports route', () => {
    const adminRoute = router.routes.find(route => route.path === '/admin');
    const reportsRoute = adminRoute.children.find(child => child.path === 'reports');
    expect(reportsRoute).toBeDefined();
  });
});
