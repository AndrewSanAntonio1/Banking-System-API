# Implementation Plan: Banking System Frontend

## Overview

This implementation plan breaks down the Banking System Frontend into discrete, manageable coding tasks. The application is a React-based web application built with Vite, React Router 6, Bootstrap 5, Axios, React Hook Form, and Context API. All tasks build incrementally, starting with core infrastructure, then authentication, followed by user features, admin features, and finally integration and polish.

The implementation follows a mobile-first responsive design approach and integrates exclusively with a Spring Boot REST API backend for all data operations.

## Tasks

- [ ] 1. Set up project foundation and core infrastructure
  - [x] 1.1 Configure project structure and directories
    - Create directory structure: `src/components/{common,layout,auth}`, `src/contexts`, `src/services/{api}`, `src/pages/{auth,user,admin}`, `src/routes`, `src/config`, `src/hooks`, `src/utils`
    - Configure Vite with environment variable support for API base URL
    - Install and configure dependencies: `react-router-dom`, `bootstrap`, `bootstrap-icons`, `axios`, `react-hook-form`
    - Set up `.env` files for development and production with `VITE_API_BASE_URL`
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6, 23.3_

  - [x] 1.2 Create API client infrastructure with Axios
    - Implement `src/services/api/apiClient.js` with base Axios instance configuration
    - Configure base URL, timeout (10 seconds), and default headers
    - Implement `src/services/api/interceptors.js` with request interceptor to attach authentication tokens
    - Implement response interceptor for standardized error handling (401, 403, 404, 500, network errors)
    - Create `src/config/endpoints.js` with centralized API endpoint constants
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 23.1, 23.2, 23.4, 23.5_

  - [x] 1.3 Implement Context providers for global state management
    - Create `src/contexts/AuthContext.jsx` with authentication state (user, token, isAuthenticated, isLoading)
    - Implement login, logout, register, checkSession, and updateUser methods in AuthContext
    - Create custom `useAuth` hook for accessing AuthContext
    - Create `src/contexts/NotificationContext.jsx` with notification state management
    - Implement showSuccess, showError, showWarning, showInfo, and removeNotification methods
    - Create custom `useNotification` hook for accessing NotificationContext
    - Implement token persistence in localStorage
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7_

  - [x] 1.4 Set up routing configuration with React Router 6
    - Create `src/routes/index.jsx` with createBrowserRouter configuration
    - Define public routes: `/login`, `/register`, `/forgot-password`, `/reset-password`
    - Define protected user routes structure: `/user` with nested routes (dashboard, banking operations, profile, beneficiaries)
    - Define protected admin routes structure: `/admin` with nested routes (dashboard, customers, accounts, transactions, audit, fraud, reports)
    - Implement lazy loading for all route components using React.lazy
    - Configure root redirect from `/` to `/login`
    - _Requirements: 15.4_

  - [x] 1.5 Implement route protection and role-based authorization
    - Create `src/components/auth/ProtectedRoute.jsx` component
    - Implement authentication check: redirect to login if not authenticated
    - Implement role-based authorization: redirect USER attempting ADMIN routes to user dashboard
    - Implement role-based authorization: redirect ADMIN attempting USER routes to admin dashboard
    - Display loading spinner during authentication state check
    - Use Outlet pattern for nested routes
    - _Requirements: 15.1, 15.2, 15.3, 15.5_

- [ ] 2. Build reusable UI component library
  - [x] 2.1 Create common loading and state components
    - Implement `src/components/common/LoadingSpinner.jsx` with size, color, and fullScreen props
    - Implement `src/components/common/SkeletonLoader.jsx` with count, height, width, and variant props
    - Implement `src/components/common/EmptyState.jsx` with icon, title, message, actionLabel, and onAction props
    - Configure Bootstrap import in `src/main.jsx` for global styling
    - _Requirements: 14.5, 14.6, 14.7, 19.1, 19.2, 19.3, 19.6_

  - [ ] 2.2 Create notification and feedback components
    - Implement `src/components/common/Toast.jsx` component with success, error, warning, info variants
    - Implement `ToastContainer` component to display multiple toasts with stacking
    - Implement auto-dismiss functionality with configurable duration (default 5 seconds)
    - Implement manual dismiss on click
    - Style with Bootstrap alert classes and positioning
    - _Requirements: 14.8, 19.4_

  - [ ] 2.3 Create form components with validation support
    - Implement `src/components/common/FormField.jsx` with React Hook Form integration
    - Support label, name, type, validation rules, error display, and placeholder props
    - Apply Bootstrap form-control and validation classes (is-invalid, invalid-feedback)
    - Implement `src/components/common/SearchBar.jsx` with debounced input (300ms default)
    - Include search icon and clear button functionality
    - _Requirements: 14.2, 14.11, 17.2, 17.9_

  - [x] 2.4 Create dialog and modal components
    - Implement `src/components/common/Modal.jsx` with customizable header, body, footer, and size props
    - Add backdrop click and ESC key to close functionality
    - Implement size variants: small, medium, large, full-screen
    - Implement `src/components/common/ConfirmDialog.jsx` with yes/no actions
    - Add variant support for default and danger (red confirm button) styles
    - _Requirements: 14.3, 14.4_

  - [ ] 2.5 Create data display components
    - Implement `src/components/common/StatusBadge.jsx` with color-coded status variants
    - Support statuses: Active (green), Inactive (gray), Pending (yellow), Frozen (blue), Closed (red), Completed (green), Failed (red)
    - Implement `src/components/common/Pagination.jsx` with page navigation controls
    - Include currentPage, totalPages, pageSize, onPageChange, onPageSizeChange props
    - Add page size selector dropdown with options (10, 25, 50, 100)
    - Display page number input and Previous/Next buttons
    - _Requirements: 14.9, 14.10_

  - [ ] 2.6 Create data table component with advanced features
    - Implement `src/components/common/DataTable.jsx` with columns, data, pagination, onPageChange, onSort, isLoading props
    - Support sortable columns with sort indicators (up/down arrows)
    - Support custom cell rendering via column render functions
    - Implement responsive horizontal scroll on small screens using Bootstrap table-responsive
    - Display loading spinner overlay when isLoading is true
    - Display empty state when data array is empty
    - _Requirements: 14.1, 18.5_

- [ ] 3. Implement layout components with responsive design
  - [ ] 3.1 Create navigation components
    - Implement `src/components/layout/TopNav.jsx` with user profile dropdown and logout button
    - Display user name and role badge in dropdown
    - Implement hamburger menu toggle button for mobile (visible below 992px breakpoint)
    - Implement `src/components/layout/Sidebar.jsx` with collapsible navigation menu
    - Create mobile overlay backdrop that closes sidebar on click
    - Implement active menu item highlighting based on current route using useLocation
    - Apply responsive behavior: fixed expanded sidebar on desktop (≥992px), collapsible on mobile (<992px)
    - _Requirements: 13.1, 13.4, 13.7, 13.8, 18.3, 18.4_

  - [ ] 3.2 Create additional layout components
    - Implement `src/components/layout/Breadcrumb.jsx` showing current page hierarchy
    - Generate breadcrumbs dynamically from route path
    - Implement `src/components/layout/Footer.jsx` with copyright and system information
    - _Requirements: 13.5, 13.6_

  - [ ] 3.3 Create layout wrapper components for user and admin interfaces
    - Implement `src/layouts/UserLayout.jsx` with TopNav, Sidebar, Breadcrumb, main content area (Outlet), and Footer
    - Configure user-specific navigation menu items: Dashboard, Deposit, Withdraw, Transfer, Transactions, Beneficiaries, Profile
    - Implement `src/layouts/AdminLayout.jsx` with TopNav, Sidebar, Breadcrumb, main content area (Outlet), and Footer
    - Configure admin-specific navigation menu items: Dashboard, Customers, Accounts, Transactions, Audit Logs, Fraud Monitoring, Reports
    - Apply responsive grid layout: sidebar width 250px on desktop, collapsible on mobile
    - Ensure main content area has proper margin-left on desktop (250px) and full width on mobile
    - _Requirements: 13.2, 13.3, 18.2_

  - [ ] 3.4 Implement global CSS for responsive layout and accessibility
    - Create `src/App.css` with sidebar positioning, transitions, and responsive breakpoints
    - Implement mobile overlay styles with backdrop (rgba black 50% opacity, z-index 1030)
    - Ensure minimum touch target sizes (44x44px) for mobile interactive elements
    - Configure responsive spacing utilities and typography scale
    - Ensure sufficient color contrast ratios for accessibility (WCAG AA compliance)
    - Apply consistent color palette with primary, secondary, success, danger, warning, info colors
    - _Requirements: 18.1, 18.7, 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7, 21.8_

- [ ] 4. Checkpoint - Verify infrastructure setup
  - Run development server and verify no console errors
  - Verify routing works: accessing `/login` loads without errors
  - Verify protected routes redirect unauthenticated users to login
  - Verify responsive layout on mobile (< 768px), tablet (768-991px), and desktop (≥ 992px) viewports
  - Ask the user if questions arise

- [ ] 5. Implement authentication features
  - [ ] 5.1 Create authentication service layer
    - Implement `src/services/authService.js` with login, register, forgotPassword, resetPassword, validateToken, and logout functions
    - Each function makes appropriate HTTP request to REST API using apiClient
    - Structure request payloads to match backend DTO expectations
    - _Requirements: 1.2, 1.5, 1.7, 1.9, 23.4, 23.5_

  - [ ] 5.2 Build login page with form validation
    - Create `src/pages/auth/LoginPage.jsx` with email and password fields
    - Integrate React Hook Form with validation: email required and valid format, password required
    - Implement form submission: call authService.login() → AuthContext.login()
    - Display loading state during authentication (disable button, show spinner)
    - On success: show success toast and redirect to role-appropriate dashboard (/user for USER, /admin for ADMIN)
    - On error: display error toast with message from API
    - Include links to registration and forgot password pages
    - Apply Bootstrap form styling and responsive layout
    - _Requirements: 1.1, 1.2, 1.3, 1.10, 17.1, 17.2, 17.3, 17.4, 17.7, 17.8_

  - [ ] 5.3 Build registration page with comprehensive validation
    - Create `src/pages/auth/RegisterPage.jsx` with fields: name, email, phone, password, confirm password
    - Implement validation: name required (min 2 chars), email required and valid format, phone required and valid format (10+ digits), password required (min 8 chars, must contain uppercase, lowercase, number, special character), confirm password matches password
    - Implement form submission: call authService.register() → AuthContext.register()
    - On success: show success toast and redirect to login page with message to check email
    - On error: display error toast with validation messages from API (handle field-specific errors)
    - Display real-time validation feedback with Bootstrap is-invalid class and invalid-feedback text
    - _Requirements: 1.4, 1.5, 1.10, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9_

  - [ ] 5.4 Build password recovery pages
    - Create `src/pages/auth/ForgotPasswordPage.jsx` with email field
    - Implement email validation and form submission to authService.forgotPassword()
    - Display success message instructing user to check email
    - Create `src/pages/auth/ResetPasswordPage.jsx` with new password and confirm password fields
    - Extract reset token from URL query parameters using useSearchParams
    - Implement password validation (strength requirements) and confirmation matching
    - Submit to authService.resetPassword(token, newPassword)
    - On success: redirect to login with success message
    - _Requirements: 1.6, 1.7, 1.8, 1.9, 5.6, 5.7, 17.2, 17.3_

  - [ ]* 5.5 Write unit tests for authentication components
    - Test LoginPage form validation: empty fields show errors, invalid email format rejected, valid submission calls login
    - Test RegisterPage validation: password strength requirements, password confirmation matching
    - Test ProtectedRoute: unauthenticated redirects to login, wrong role redirects to appropriate dashboard
    - Test AuthContext: login updates state correctly, logout clears state, token persistence in localStorage
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 15.1, 15.2, 15.3, 20.3, 20.4_

- [ ] 6. Implement user dashboard and core services
  - [ ] 6.1 Create banking and profile service layers
    - Implement `src/services/bankingService.js` with getAccountBalance, deposit, withdraw, transfer, getTransactions, getTransactionDetail functions
    - Implement `src/services/beneficiaryService.js` with getBeneficiaries, createBeneficiary, updateBeneficiary, deleteBeneficiary functions
    - Implement `src/services/profileService.js` with getProfile, updateProfile, changePassword functions
    - All functions use apiClient and return promises with standardized response/error handling
    - _Requirements: 3.2, 3.4, 3.6, 3.8, 3.10, 4.3, 4.5, 4.7, 5.3, 5.5_

  - [ ] 6.2 Build user dashboard with data fetching
    - Create `src/pages/user/Dashboard.jsx` (UserDashboard component)
    - Fetch account balance, recent transactions (last 5), and notifications on component mount
    - Display welcome card with user name from AuthContext
    - Create AccountBalanceCard component showing formatted balance, account number, and copy-to-clipboard button
    - Create RecentTransactionsCard component with table of last 5 transactions (date, type, amount, status)
    - Include "View All" link to transaction history page
    - Create QuickActionCard components for Deposit, Withdraw, Transfer with icons and navigation links
    - Display loading skeletons while data is being fetched
    - Display error state with retry button if data fetch fails
    - Display empty state for transactions if none exist
    - Apply responsive grid layout: cards stack on mobile, 2 columns on tablet, 3 columns on desktop
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 19.1, 19.2, 19.3, 19.5_

  - [ ] 6.3 Implement banking operation pages
    - Create `src/pages/user/DepositPage.jsx` with amount and description fields
    - Create `src/pages/user/WithdrawPage.jsx` with amount and description fields
    - Create `src/pages/user/TransferPage.jsx` with beneficiary dropdown, amount, and description fields
    - Implement amount validation: required, positive number, max 2 decimal places, numeric format (regex: ^\d+(\.\d{1,2})?$)
    - Populate beneficiary dropdown from bankingService.getBeneficiaries() in TransferPage
    - Include "Add Beneficiary" link in TransferPage that opens beneficiary modal
    - On submit: call respective service function (deposit, withdraw, transfer)
    - Display loading state during submission (disable button, show spinner)
    - On success: show success toast and navigate back to dashboard
    - On error: show error toast with API error message
    - Apply responsive form layout: full width on mobile, centered card on desktop
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.11, 3.12, 3.13, 17.5, 18.6_

  - [ ] 6.4 Build transaction history and detail pages
    - Create `src/pages/user/TransactionHistoryPage.jsx` with paginated table
    - Fetch transactions with pagination parameters (page, size) from bankingService.getTransactions()
    - Display table columns: Date, Type, Amount, Status, Description, Actions (View button)
    - Implement pagination controls: page size selector (10, 25, 50, 100), previous/next buttons, page number input
    - On page change: fetch new data with updated parameters
    - Display loading spinner during data fetch
    - Display empty state if no transactions exist
    - Create `src/pages/user/TransactionDetailPage.jsx` displaying complete transaction information
    - Extract transaction ID from URL params using useParams
    - Fetch transaction details from bankingService.getTransactionDetail(id)
    - Display fields: ID, Date/Time, Type, Amount, Status, From/To Account, Description, Reference Number
    - Include "Back to History" navigation button
    - Apply responsive table: horizontal scroll on mobile
    - _Requirements: 3.7, 3.8, 3.9, 3.10, 18.5, 19.1, 19.2, 19.3_

  - [ ]* 6.5 Write unit tests for user dashboard features
    - Test Dashboard data fetching: loading states, successful data display, error handling with retry
    - Test banking operation forms: amount validation (positive, max 2 decimals), successful submission, error display
    - Test transaction history pagination: page changes fetch new data, page size selector updates results
    - Test beneficiary dropdown in transfer: populated from API, displays correctly
    - _Requirements: 2.7, 3.2, 3.4, 3.6, 3.8, 3.11_

- [ ] 7. Implement beneficiary and profile management features
  - [ ] 7.1 Build beneficiary management interface
    - Create `src/pages/user/BeneficiaryListPage.jsx` with card/grid layout of beneficiaries
    - Fetch beneficiaries from beneficiaryService.getBeneficiaries() on mount
    - Display each beneficiary as card showing: name, account number, bank name, edit/delete action buttons
    - Include "Add Beneficiary" button that opens BeneficiaryFormModal in create mode
    - Implement delete with confirmation dialog: on confirm, call beneficiaryService.deleteBeneficiary(id)
    - On successful delete: refresh beneficiary list and show success toast
    - Display empty state when no beneficiaries exist with call-to-action to add first beneficiary
    - Create `src/components/user/BeneficiaryFormModal.jsx` with mode prop ('create' | 'edit')
    - Include fields: name (required), account number (required, 10-16 digits), bank name (required), branch code (optional)
    - Pre-populate fields in edit mode with existing beneficiary data
    - On create submit: call beneficiaryService.createBeneficiary(data)
    - On edit submit: call beneficiaryService.updateBeneficiary(id, data)
    - On success: close modal, refresh list, show success toast
    - Apply responsive grid: 1 column on mobile, 2 columns on tablet, 3 columns on desktop
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 17.2, 18.1_

  - [ ] 7.2 Build profile management pages
    - Create `src/pages/user/ViewProfilePage.jsx` displaying user information (name, email, phone, account number, registration date, status)
    - Fetch profile data from profileService.getProfile() on mount
    - Include "Edit Profile" button navigating to edit page
    - Include "Change Password" button navigating to password change page
    - Display fields in read-only format with labels and values
    - Create `src/pages/user/EditProfilePage.jsx` with editable form (name, email, phone)
    - Pre-populate form with current user data from AuthContext or API
    - Implement validation: name required (min 2 chars), email required and valid format, phone required and valid format
    - On submit: call profileService.updateProfile(data)
    - On success: update user data in AuthContext, show success toast, navigate back to view profile
    - Create `src/pages/user/ChangePasswordPage.jsx` with current password, new password, confirm new password fields
    - Implement validation: current password required, new password meets strength requirements, confirm password matches new password
    - On submit: call profileService.changePassword(data)
    - On success: show success toast and navigate back to view profile
    - Apply responsive layout: full width on mobile, centered form card on desktop
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 17.2, 17.3, 17.4, 17.5, 17.6_

  - [ ]* 7.3 Write unit tests for beneficiary and profile features
    - Test beneficiary list: displays beneficiaries, empty state shown when none exist, delete shows confirmation
    - Test beneficiary form: create mode validation, edit mode pre-population, account number format validation
    - Test profile edit: form pre-population, validation rules, successful update updates AuthContext
    - Test password change: validation rules (strength, confirmation match), successful submission
    - _Requirements: 4.1, 4.3, 4.5, 4.9, 5.3, 5.5, 5.6_

- [ ] 8. Checkpoint - Verify user features complete
  - Test login as USER role
  - Verify user dashboard displays balance, recent transactions, quick actions
  - Verify banking operations: deposit, withdraw, transfer work and show success toasts
  - Verify transaction history pagination works correctly
  - Verify beneficiary management: add, edit, delete with confirmation
  - Verify profile viewing, editing, and password change
  - Test responsive behavior on mobile, tablet, and desktop screen sizes
  - Ask the user if questions arise

- [ ] 9. Implement admin dashboard and statistics
  - [ ] 9.1 Create admin service layer
    - Implement `src/services/adminService.js` with comprehensive admin functions
    - Include functions: getStatistics, getCustomers, getCustomerDetail, createCustomer, updateCustomer, updateCustomerStatus, searchCustomers
    - Include functions: getAccounts, getAccountDetail, freezeAccount, unfreezeAccount, closeAccount
    - Include functions: getTransactions (admin view), getTransactionDetail, searchTransactions
    - Include functions: getAuditLogs, getLoginHistory, getTransactionLogs
    - Include functions: getFraudMonitoring, getSuspiciousTransactions
    - Include functions: getDailyReports, getMonthlyReports, exportReport
    - All functions use apiClient with appropriate HTTP methods (GET, POST, PUT)
    - _Requirements: 7.3, 7.5, 7.7, 7.9, 7.10, 7.12, 8.3, 8.5, 8.7, 8.9, 9.3, 9.5, 9.7, 10.4, 11.4, 12.5_

  - [ ] 9.2 Build admin dashboard with system statistics
    - Create `src/pages/admin/Dashboard.jsx` (AdminDashboard component)
    - Fetch system statistics from adminService.getStatistics() on mount
    - Create StatisticCard component with title, value, icon, trend, and isLoading props
    - Display statistics cards: Total Customers, Total Accounts, Total Deposits, Total Withdrawals, Total Transfers
    - Display optional trend indicators (percentage change) if provided by API
    - Display customer growth chart (simple bar/line chart using minimal chart library or CSS-based visualization)
    - Display recent transactions table (last 10 system-wide transactions)
    - Include quick links to customer management, account management, transaction management sections
    - Display loading skeletons while statistics are being fetched
    - Apply responsive grid: cards stack on mobile, 2-3 columns on tablet/desktop
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

  - [ ]* 9.3 Write unit tests for admin dashboard
    - Test statistics fetching: loading states, data display, error handling
    - Test StatisticCard component: displays value and icon, shows trend indicator when provided
    - Test responsive layout: cards stack properly on mobile
    - _Requirements: 6.1, 6.7_

- [ ] 10. Implement customer management features
  - [ ] 10.1 Build customer list and search interface
    - Create `src/pages/admin/CustomerListPage.jsx` with paginated table
    - Fetch customers from adminService.getCustomers() with pagination parameters
    - Display table columns: ID, Name, Email, Phone, Status, Account Number, Actions (View, Edit, Enable/Disable buttons)
    - Implement search bar with debounced input (300ms delay) searching by name or account number
    - On search input: call adminService.searchCustomers(query)
    - Implement filter dropdown by status: All, Active, Disabled
    - On filter change: fetch customers with status filter parameter
    - Include "Create Customer" button navigating to customer form in create mode
    - Enable/Disable actions show confirmation dialog before calling adminService.updateCustomerStatus(id, status)
    - On status change success: refresh customer list and show success toast
    - Implement pagination with DataTable component
    - _Requirements: 7.1, 7.11, 7.12_

  - [ ] 10.2 Build customer detail and form pages
    - Create `src/pages/admin/CustomerDetailPage.jsx` displaying complete customer information
    - Extract customer ID from URL params using useParams
    - Fetch customer details from adminService.getCustomerDetail(id)
    - Display sections: Customer Information (name, email, phone, address, DOB, ID number, status), Account Details (associated accounts), Transaction Summary
    - Include action buttons: Edit, Enable/Disable Account with confirmation
    - Create `src/pages/admin/CustomerFormPage.jsx` accepting mode prop ('create' | 'edit')
    - Include form fields: Name (required, min 2 chars), Email (required, valid format), Phone (required, valid format), Address (required), Date of Birth (required, valid date), ID Number (required)
    - Pre-populate fields in edit mode by fetching customer data
    - Implement comprehensive validation for all fields
    - On create submit: call adminService.createCustomer(data) and navigate to customer list on success
    - On edit submit: call adminService.updateCustomer(id, data) and navigate to customer detail on success
    - Display loading state during submission
    - Display validation errors inline with Bootstrap invalid-feedback
    - Apply responsive layout: full width on mobile, centered card on desktop
    - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 17.2, 17.3, 17.4, 17.5, 17.6_

  - [ ]* 10.3 Write unit tests for customer management
    - Test customer list: displays customers, search filters results, status filter updates list
    - Test customer form: create mode validation, edit mode pre-population, successful submission
    - Test customer detail: displays complete information, edit button navigates correctly
    - Test enable/disable actions: confirmation dialog shown, status updated on confirm
    - _Requirements: 7.1, 7.3, 7.5, 7.7, 7.8, 7.9, 7.12_

- [ ] 11. Implement account management features
  - [ ] 11.1 Build account list and detail pages
    - Create `src/pages/admin/AccountListPage.jsx` with paginated table
    - Fetch accounts from adminService.getAccounts() with pagination parameters
    - Display table columns: Account Number, Customer Name, Balance, Status, Type, Actions (View Details, Freeze/Unfreeze, Close buttons)
    - Implement search bar searching by account number or customer name
    - Implement filter dropdown by status: All, Active, Frozen, Closed
    - On filter/search: fetch accounts with updated parameters
    - Freeze/Unfreeze/Close actions show confirmation dialog with appropriate warning message
    - On action confirm: call respective adminService function (freezeAccount, unfreezeAccount, closeAccount)
    - On success: refresh account list and show success toast
    - Create `src/pages/admin/AccountDetailPage.jsx` displaying complete account information
    - Extract account number from URL params using useParams
    - Fetch account details from adminService.getAccountDetail(accountNumber)
    - Display sections: Account Information (number, type, balance, status, opening date), Associated Customer Information, Recent Transactions for This Account
    - Include action buttons: Freeze/Unfreeze, Close with confirmation dialogs
    - Apply responsive table with horizontal scroll on mobile
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10_

  - [ ]* 11.2 Write unit tests for account management
    - Test account list: displays accounts, search/filter updates results, pagination works
    - Test account actions: freeze/unfreeze/close show confirmation, successful action updates list
    - Test account detail: displays complete information, action buttons work correctly
    - _Requirements: 8.1, 8.3, 8.5, 8.7, 8.9_

- [ ] 12. Implement transaction management and audit logging
  - [ ] 12.1 Build admin transaction list and detail pages
    - Create `src/pages/admin/TransactionListPage.jsx` with advanced filtering and pagination
    - Fetch transactions from adminService.getTransactions() with filter and pagination parameters
    - Display table columns: Transaction ID, Date, Type, Amount, From Account, To Account, Status, Actions (View button)
    - Implement search bar by transaction ID or account number
    - Implement filter controls: Date range picker (from date, to date), Transaction type dropdown (All, Deposit, Withdrawal, Transfer), Status dropdown (All, Pending, Completed, Failed)
    - On filter/search change: fetch transactions with updated query parameters
    - Include "Export Transactions" button that calls adminService.exportReport() to download CSV/Excel
    - Create `src/pages/admin/TransactionDetailPage.jsx` (admin view with additional context)
    - Fetch transaction details from adminService.getTransactionDetail(id)
    - Display complete transaction details including associated customer information
    - Include status history/audit trail if provided by API
    - Apply responsive layout with horizontal scroll for tables on mobile
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_

  - [ ] 12.2 Build audit log interface with tabs
    - Create `src/pages/admin/AuditLogPage.jsx` with tabbed interface
    - Implement three tabs: User Activity, Login History, Transaction Logs
    - Fetch data for active tab from adminService.getAuditLogs(), getLoginHistory(), or getTransactionLogs()
    - Implement date range filter applicable to all tabs (from date, to date inputs)
    - User Activity tab columns: User, Action, Resource, Timestamp, IP Address
    - Login History tab columns: User, Login Time, Logout Time, IP Address, Status
    - Transaction Logs tab columns: Transaction ID, User, Action, Timestamp, Details
    - Implement pagination for each tab independently
    - On tab switch: fetch data for newly active tab
    - On date filter change: refetch data with date range parameters
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ]* 12.3 Write unit tests for transaction management and audit logs
    - Test transaction list: displays transactions, filters update results, export button works
    - Test transaction detail: displays complete information with customer context
    - Test audit logs: tab switching fetches correct data, date filter applies to all tabs
    - _Requirements: 9.1, 9.3, 9.5, 10.1, 10.2, 10.3, 10.4_

- [ ] 13. Implement fraud monitoring and reports
  - [ ] 13.1 Build fraud monitoring interface
    - Create `src/pages/admin/FraudMonitoringPage.jsx` displaying risk indicators and suspicious transactions
    - Fetch fraud data from adminService.getFraudMonitoring() and getSuspiciousTransactions()
    - Display risk indicator cards: High-Risk Transactions Count, Suspicious Activity Count, Total Flagged Amount
    - Display suspicious transactions table with warning badges (Bootstrap badge-warning or badge-danger)
    - Table columns: Transaction ID, Account, Amount, Risk Score, Reason, Actions (Investigate button)
    - Implement filter controls: Risk level dropdown (All, High, Medium, Low), Date range picker, Amount threshold input
    - On filter change: fetch suspicious transactions with updated parameters
    - "Investigate" button navigates to transaction detail page with admin context
    - Display visual indicators for high-risk items (red/orange badges, warning icons)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ] 13.2 Build reports interface with export functionality
    - Create `src/pages/admin/ReportsPage.jsx` with tabbed interface (Daily Reports, Monthly Reports)
    - Implement date selector for report period (date picker for daily, month/year picker for monthly)
    - Fetch report data from adminService.getDailyReports(date) or getMonthlyReports(month, year)
    - Display summary cards: Total Transactions, Total Deposits, Total Withdrawals, Net Change
    - Display transactions table for selected period with all relevant columns
    - Implement export buttons: PDF, Excel, CSV
    - On export click: call adminService.exportReport(format, period) which triggers browser download
    - Display loading state during report generation
    - Apply responsive layout for summary cards and tables
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ]* 13.3 Write unit tests for fraud monitoring and reports
    - Test fraud monitoring: displays risk indicators, filters update suspicious transactions
    - Test reports: date selector changes fetched data, export buttons trigger downloads
    - Test summary cards: display correct calculated values
    - _Requirements: 11.1, 11.4, 12.1, 12.2, 12.5_

- [ ] 14. Checkpoint - Verify admin features complete
  - Test login as ADMIN role
  - Verify admin dashboard displays system statistics correctly
  - Verify customer management: list, search, filter, create, edit, view, enable/disable
  - Verify account management: list, search, filter, view, freeze, unfreeze, close
  - Verify transaction management: list, search, filter by date range and type, view details
  - Verify audit logs: all three tabs display data, date range filter works
  - Verify fraud monitoring: risk indicators, suspicious transactions, filters
  - Verify reports: daily and monthly reports, export functionality
  - Test responsive behavior on mobile, tablet, and desktop
  - Ask the user if questions arise

- [ ] 15. Implement performance optimizations
  - [ ] 15.1 Add code splitting and lazy loading
    - Verify all route components use React.lazy() for code splitting (already implemented in routing setup)
    - Wrap lazy-loaded components with Suspense and LoadingSpinner fallback
    - Verify Vite build produces separate chunks for each route
    - _Requirements: 24.1_

  - [ ] 15.2 Implement React optimization hooks
    - Apply React.memo to StatisticCard, StatusBadge, and other frequently rendered components that receive stable props
    - Implement useMemo for expensive computations in TransactionList (sorting, filtering)
    - Implement useCallback for event handlers passed to child components (search handlers, pagination handlers)
    - Create custom useDebounce hook in `src/hooks/useDebounce.js` (300ms default delay)
    - Apply useDebounce to all search bar inputs to reduce API calls
    - _Requirements: 24.2, 24.3_

  - [ ] 15.3 Optimize data fetching and caching
    - Implement pagination for all large data lists (customers, accounts, transactions) to limit initial fetch size
    - Verify page size defaults to 10 items with options for 25, 50, 100
    - Cache authentication state and user data in AuthContext to avoid redundant API calls
    - Verify frequently accessed data (beneficiaries, profile) is cached in component state during session
    - _Requirements: 24.4, 24.5_

  - [ ] 15.4 Optimize asset loading
    - Implement lazy loading for images using loading="lazy" attribute
    - Use appropriate image formats and sizes for hero images and icons
    - Verify Bootstrap CSS is imported once in main.jsx, not in individual components
    - Verify icon library (Bootstrap Icons) is imported once globally
    - _Requirements: 24.6, 24.7_

- [ ] 16. Implement error handling and edge cases
  - [ ] 16.1 Create error boundary and error pages
    - Implement `src/components/common/ErrorBoundary.jsx` class component catching unhandled React errors
    - Display user-friendly error message with option to reload or go to home
    - Log errors to console for debugging
    - Wrap App component with ErrorBoundary in main.jsx
    - Create `src/pages/NotFoundPage.jsx` for 404 routes
    - Display "Page Not Found" message with navigation back to dashboard
    - Add NotFoundPage as catch-all route (`path: '*'`) in router configuration
    - _Requirements: 19.4_

  - [ ] 16.2 Enhance error feedback across the application
    - Verify all API calls have try-catch blocks with error toast notifications
    - Ensure error messages are user-friendly (avoid exposing technical details)
    - Implement retry functionality for failed data fetches (add "Retry" button in error states)
    - Verify network errors display specific message: "Network error. Please check your connection."
    - Verify 401 errors trigger automatic logout and redirect to login (already in interceptor)
    - Verify 403 errors display: "You do not have permission to perform this action"
    - Verify 500 errors display: "Server error. Please try again later."
    - Implement loading state indicators for all async operations (disable buttons, show spinners)
    - _Requirements: 16.3, 16.4, 16.5, 16.8, 19.4, 19.5, 19.6_

  - [ ]* 16.3 Write integration tests for error scenarios
    - Test error boundary: catches component errors and displays fallback UI
    - Test 401 handling: clears auth state and redirects to login
    - Test network error: displays appropriate message with retry option
    - Test form validation errors: displays inline errors, disables submit button
    - _Requirements: 16.3, 16.4, 16.5, 16.8, 17.7_

- [ ] 17. Final integration and polish
  - [ ] 17.1 Wire all components together and verify navigation flows
    - Verify complete user flow: login → dashboard → banking operations → transactions → beneficiaries → profile → logout
    - Verify complete admin flow: login → dashboard → customers → accounts → transactions → audit logs → fraud → reports → logout
    - Verify all navigation links work correctly in sidebar, breadcrumbs, and action buttons
    - Verify role-based redirects: USER accessing /admin redirects to /user, ADMIN accessing /user redirects to /admin
    - Verify logout clears AuthContext state and redirects to login page
    - Verify session persistence: refresh page maintains authentication state
    - Verify deep linking works: direct URL navigation to protected routes redirects to login if not authenticated
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 20.2, 20.3, 20.4, 20.5_

  - [ ] 17.2 Implement App.jsx root component
    - Create or update `src/App.jsx` to wrap application with AuthProvider and NotificationProvider
    - Call setupInterceptors from interceptors.js in useEffect, passing logout function from AuthContext
    - Render RouterProvider with configured router
    - Wrap entire app with ErrorBoundary component
    - _Requirements: 20.7_

  - [ ] 17.3 Verify responsive design across all pages
    - Test all pages on mobile viewport (< 768px): sidebar collapses, cards stack, tables scroll horizontally, forms are full width
    - Test all pages on tablet viewport (768px - 991px): sidebar collapsible, 2-column card layouts, responsive tables
    - Test all pages on desktop viewport (≥ 992px): fixed sidebar, 3-column card layouts, full-width tables
    - Verify touch targets meet 44x44px minimum on mobile
    - Verify all interactive elements are accessible via keyboard navigation
    - Test hamburger menu functionality on mobile: opens sidebar, overlay closes sidebar
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7_

  - [ ] 17.4 Apply final styling and UI polish
    - Verify consistent color palette applied throughout application (primary, secondary, success, danger, warning, info)
    - Verify consistent spacing using Bootstrap utility classes (mb-3, p-4, etc.)
    - Verify all cards have shadows for depth (Bootstrap card class)
    - Verify hover effects on buttons and interactive elements
    - Verify form validation styling (is-valid, is-invalid classes) applied consistently
    - Verify loading states use spinners or skeleton loaders appropriately
    - Verify empty states display helpful messages and call-to-action buttons
    - Verify toast notifications appear in consistent position (top-right corner)
    - Verify status badges use consistent colors across all pages
    - Verify icons from Bootstrap Icons library are used consistently
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7_

  - [ ]* 17.5 Write end-to-end integration tests
    - Test complete user journey: registration → login → dashboard → perform banking operation → logout
    - Test complete admin journey: login → view statistics → manage customer → manage account → logout
    - Test authentication flows: successful login, failed login, logout, session persistence
    - Test authorization: role-based route protection, redirects work correctly
    - Test form validations: all forms validate correctly, show appropriate errors
    - _Requirements: 1.2, 1.3, 15.1, 15.2, 15.3, 20.3, 20.4_

- [ ] 18. Final checkpoint and production readiness
  - Run production build with `npm run build` and verify no errors
  - Check bundle size and ensure code splitting produced multiple chunks
  - Test production build locally with `npm run preview`
  - Verify all environment variables are configured correctly for production
  - Test with API backend (if available) or mock API endpoints
  - Verify all console errors are resolved
  - Verify all features work end-to-end in production build
  - Verify responsive design works across different browsers (Chrome, Firefox, Safari, Edge)
  - Test accessibility: keyboard navigation, screen reader compatibility (basic ARIA attributes)
  - Ask the user if questions arise or if deployment is needed

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability back to the requirements document
- All tasks build incrementally with regular checkpoints for validation
- The implementation uses JavaScript/JSX with React 19, following modern React patterns (hooks, functional components)
- All API integration points are clearly defined and ready for backend connection
- Responsive design is built-in using Bootstrap 5 grid system and utilities
- Performance optimizations are included (code splitting, memoization, debouncing, pagination)
- All form validation follows React Hook Form best practices with real-time feedback
- Security considerations are built-in: token management, XSS prevention, HTTPS enforcement
- The project structure follows React best practices with clear separation of concerns

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1.1", "1.2"]
    },
    {
      "id": 1,
      "tasks": ["1.3", "1.4"]
    },
    {
      "id": 2,
      "tasks": ["1.5", "2.1", "2.2"]
    },
    {
      "id": 3,
      "tasks": ["2.3", "2.4", "2.5"]
    },
    {
      "id": 4,
      "tasks": ["2.6", "3.1", "3.2"]
    },
    {
      "id": 5,
      "tasks": ["3.3", "3.4"]
    },
    {
      "id": 6,
      "tasks": ["5.1"]
    },
    {
      "id": 7,
      "tasks": ["5.2", "5.3"]
    },
    {
      "id": 8,
      "tasks": ["5.4", "5.5"]
    },
    {
      "id": 9,
      "tasks": ["6.1"]
    },
    {
      "id": 10,
      "tasks": ["6.2"]
    },
    {
      "id": 11,
      "tasks": ["6.3", "6.4"]
    },
    {
      "id": 12,
      "tasks": ["6.5", "7.1"]
    },
    {
      "id": 13,
      "tasks": ["7.2", "7.3"]
    },
    {
      "id": 14,
      "tasks": ["9.1"]
    },
    {
      "id": 15,
      "tasks": ["9.2", "9.3"]
    },
    {
      "id": 16,
      "tasks": ["10.1"]
    },
    {
      "id": 17,
      "tasks": ["10.2", "10.3"]
    },
    {
      "id": 18,
      "tasks": ["11.1", "11.2"]
    },
    {
      "id": 19,
      "tasks": ["12.1"]
    },
    {
      "id": 20,
      "tasks": ["12.2", "12.3"]
    },
    {
      "id": 21,
      "tasks": ["13.1", "13.2"]
    },
    {
      "id": 22,
      "tasks": ["13.3"]
    },
    {
      "id": 23,
      "tasks": ["15.1", "15.2"]
    },
    {
      "id": 24,
      "tasks": ["15.3", "15.4"]
    },
    {
      "id": 25,
      "tasks": ["16.1"]
    },
    {
      "id": 26,
      "tasks": ["16.2", "16.3"]
    },
    {
      "id": 27,
      "tasks": ["17.1", "17.2"]
    },
    {
      "id": 28,
      "tasks": ["17.3", "17.4"]
    },
    {
      "id": 29,
      "tasks": ["17.5"]
    }
  ]
}
```
