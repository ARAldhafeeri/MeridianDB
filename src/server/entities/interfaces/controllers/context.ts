export interface ControllerContext {
  readonly request: Request;
  readonly organizationId: string;
  readonly agentId?: string;
  readonly userId?: string;
  readonly permissions: string[];
  readonly requestId: string;
  readonly timestamp: Date;
  readonly userAgent?: string;
  readonly ipAddress?: string;
}
