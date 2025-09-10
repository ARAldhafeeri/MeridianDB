import { BaseComponentProps } from "./base";

export interface MetricsChartProps extends BaseComponentProps {
  readonly data: Array<{
    readonly date: Date;
    readonly value: number;
    readonly label: string;
  }>;
  readonly type: "line" | "bar" | "area";
  readonly title: string;
}

export interface DistributionChartProps extends BaseComponentProps {
  readonly data: Record<string, number>;
  readonly title: string;
  readonly type: "pie" | "donut" | "bar";
}
