import { AccessLevel } from ".";
import { NodeFilter } from "./dto";

interface FederationPolicySource {
  type: "organization" | "agent";
  id: string;
}

interface FederationPolicy {
  from: FederationPolicySource;
  to: FederationPolicySource;
}

/**
 * Simple access control between agents for memory sharing
 */
export interface FederationSettings {
  readonly allowIncoming: FederationPolicy;
  readonly allowOutgoing: FederationPolicy;
  readonly defaultAccessLevel: AccessLevel;
  readonly trustedOrganizations: string[];
}

/**
 * Payload to modify federation between
 * two organizations
 */
export interface PartnershipRequest {
  readonly partnerOrganizationId: string;
  readonly partnershipType: "bidirectional" | "unidirectional";
  readonly accessLevel: AccessLevel;
  readonly knowledgeDomains: string[];
  readonly trustLevel: number; // 0-1
  readonly expiresAt?: Date;
}

/**
 * parternship settings.
 */
export interface Partnership {
  readonly id: string;
  readonly organizationId: string;
  readonly partnerOrganizationId: string;
  readonly partnershipType: "bidirectional" | "unidirectional";
  readonly status: "pending" | "active" | "suspended" | "revoked";
  readonly accessLevel: AccessLevel;
  readonly knowledgeDomains: string[];
  readonly trustLevel: number;
  readonly createdAt: Date;
  readonly expiresAt?: Date;
}

/**
 * knowledge sharing request
 */
export interface KnowledgeShareRequest {
  readonly partnershipId: string;
  readonly nodeIds?: string[];
  readonly knowledgeDomain?: string;
  readonly anonymize: boolean;
  readonly shareMetadata: boolean;
  readonly expiresAt?: Date;
}

/**
 * Signle share request
 */
export interface ShareResult {
  readonly sharedCount: number;
  readonly anonymizedCount: number;
  readonly shareId: string;
  readonly accessTokens: string[];
}

/**
 * Get knowledge request
 */
export interface KnowledgeRequest {
  readonly partnershipId: string;
  readonly query: string;
  readonly knowledgeDomain?: string;
  readonly maxResults: number;
  readonly requiredTrustLevel: number;
}

/**
 * Result of requesting knowledge
 */
export interface RequestResult {
  readonly results: FederatedKnowledgeItem[];
  readonly totalAvailable: number;
  readonly trustScore: number;
  readonly sourceAttribution: string[];
}

/**
 * a single federated knowledge item
 */
export interface FederatedKnowledgeItem {
  readonly id: string;
  readonly sourceOrganization: string;
  readonly content: unknown;
  readonly trustScore: number;
  readonly domain: string;
  readonly timestamp: Date;
  readonly accessLevel: AccessLevel;
}

/**
 * policies to control federation
 */
export interface FederationPolicies {
  readonly allowIncoming: FederationPolicy;
  readonly allowOutgoing: FederationPolicy;
  readonly defaultAccessLevel: AccessLevel;
  readonly autoApproveThreshold: number;
  readonly knowledgeDomains: string[];
  readonly trustedPartners: string[];
  readonly blockedPartners: string[];
  readonly dataRetentionDays: number;
}

/**
 * federation anlaytics
 */
export interface FederationAnalytics {
  readonly organizationId: string;
  readonly activePartnerships: number;
  readonly totalShares: number;
  readonly totalRequests: number;
  readonly avgTrustScore: number;
  readonly topDomains: Array<{ domain: string; shareCount: number }>;
  readonly partnerActivity: Record<string, PartnerActivity>;
}

/**
 * Federation partern activity
 */
export interface PartnerActivity {
  readonly partnerOrganizationId: string;
  readonly sharesReceived: number;
  readonly sharesProvided: number;
  readonly trustTrend: number;
  readonly lastActivity: Date;
}

/**
 * Federation audit request
 */
export interface FederationAuditRequest {
  readonly organizationId: string;
  readonly partnershipId?: string;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly eventTypes: string[];
}
/**
 * Fedeartion audit results
 */
export interface FederationAuditResult {
  readonly events: FederationAuditEvent[];
  readonly totalEvents: number;
  readonly securityAlerts: SecurityAlert[];
}

/**
 * federation event for anlaytics
 */
export interface FederationAuditEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly organizationId: string;
  readonly partnerOrganizationId?: string;
  readonly timestamp: Date;
  readonly details: Record<string, unknown>;
  readonly ipAddress: string;
  readonly userAgent?: string;
}

/**
 * Security alert for violation of federation or access policies
 */
export interface SecurityAlert {
  readonly alertId: string;
  readonly severity: "low" | "medium" | "high" | "critical";
  readonly type: string;
  readonly description: string;
  readonly timestamp: Date;
  readonly resolved: boolean;
}

/**
 * Graph sync between two federated parterners
 */
export interface GraphSyncRequest {
  readonly partnershipId: string;
  readonly syncType: "full" | "incremental" | "selective";
  readonly nodeFilter?: NodeFilter;
  readonly preserveIds: boolean;
  readonly conflictResolution: "merge" | "replace" | "skip";
}

/**
 * Result of graph sync between two federated parterns
 */
export interface GraphSyncResult {
  readonly syncedNodes: number;
  readonly syncedEdges: number;
  readonly conflicts: number;
  readonly errors: string[];
  readonly duration: number;
  readonly checksum: string;
}
