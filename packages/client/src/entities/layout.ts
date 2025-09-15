import { BaseComponentProps } from "./base";

export interface DashboardLayoutProps extends BaseComponentProps {
  readonly sidebar: React.ReactNode;
  readonly header: React.ReactNode;
  readonly children: React.ReactNode;
}

export interface PageHeaderProps extends BaseComponentProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly actions?: React.ReactNode;
  readonly breadcrumbs?: Array<{
    readonly label: string;
    readonly href?: string;
  }>;
}

export interface TabsProps extends BaseComponentProps {
  readonly tabs: Array<{
    readonly key: string;
    readonly label: string;
    readonly content: React.ReactNode;
    readonly badge?: number;
  }>;
  readonly activeTab: string;
  readonly onTabChange: (key: string) => void;
}
