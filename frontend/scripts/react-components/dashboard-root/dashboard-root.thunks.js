import { dashboardRootActions } from 'react-components/dashboard-root/dashboard-root.register';

export const loadDashboardTemplates = dispatch =>
  dispatch(dashboardRootActions.getDashboardTemplates());
