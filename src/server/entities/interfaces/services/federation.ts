import {
  FederationAnalytics,
  FederationAuditRequest,
  FederationAuditResult,
  FederationPolicies,
  GraphSyncRequest,
  GraphSyncResult,
  KnowledgeRequest,
  KnowledgeShareRequest,
  Partnership,
  PartnershipRequest,
  RequestResult,
  ShareResult,
} from "../../domain/federation";
import { ServiceContext, ServiceResult } from "./base";

/**
 * Service for multi-organization knowledge federation
 * Handles cross-tenant knowledge sharing with privacy and access control
 */
export interface FederationService {
  /**
   * Register federation partnership
   */
  registerPartnership(
    request: PartnershipRequest,
    context: ServiceContext
  ): Promise<ServiceResult<Partnership>>;

  /**
   * Share knowledge with federated partners
   */
  shareKnowledge(
    request: KnowledgeShareRequest,
    context: ServiceContext
  ): Promise<ServiceResult<ShareResult>>;

  /**
   * Request knowledge from federated partners
   */
  requestKnowledge(
    request: KnowledgeRequest,
    context: ServiceContext
  ): Promise<ServiceResult<RequestResult>>;

  /**
   * Manage federation policies and permissions
   */
  updateFederationPolicies(
    organizationId: string,
    policies: FederationPolicies,
    context: ServiceContext
  ): Promise<ServiceResult<FederationPolicies>>;

  /**
   * Get federation analytics and trust metrics
   */
  getFederationAnalytics(
    organizationId: string,
    context: ServiceContext
  ): Promise<ServiceResult<FederationAnalytics>>;

  /**
   * Audit federation activities
   */
  auditFederationActivity(
    request: FederationAuditRequest,
    context: ServiceContext
  ): Promise<ServiceResult<FederationAuditResult>>;

  /**
   * Revoke federation access
   */
  revokeAccess(
    partnershipId: string,
    reason: string,
    context: ServiceContext
  ): Promise<ServiceResult<boolean>>;

  /**
   * Synchronize federated knowledge graphs
   */
  synchronizeGraph(
    request: GraphSyncRequest,
    context: ServiceContext
  ): Promise<ServiceResult<GraphSyncResult>>;
}
