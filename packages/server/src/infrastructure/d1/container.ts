import { D1Client } from "@/infrastructure/d1/connection";
import { AdminRepository } from "@/repositories/admin";
import { AgentRepository } from "@/repositories/agent";
import { MemoryEpisodeRepository } from "@/repositories/memory";
import { OrganizationRepository } from "@/repositories/organization";
import { AccessService } from "@/services/access";
import { AdminService } from "@/services/admin";
import { AgentService } from "@/services/agent";
import AuthService from "@/services/auth";
import { MemoryEpisodeService } from "@/services/memory";
import { OrganizationService } from "@/services/organization";
import { PasswordService } from "@/services/password";

export const createContainer = (db: D1Client) => {
  // Private cached instances
  let _organizationRepository: OrganizationRepository | null = null;
  let _adminRepository: AdminRepository | null = null;
  let _agentRepository: AgentRepository | null = null;
  let _memoryEpisodeRepository: MemoryEpisodeRepository | null = null;

  let _organizationService: OrganizationService | null = null;
  let _adminService: AdminService | null = null;
  let _agentService: AgentService | null = null;
  let _memoryEpisodeService: MemoryEpisodeService | null = null;

  // auth
  let _passwordService: PasswordService | null = null;
  let _accessService: AccessService | null = null;
  let _auth_service: AuthService | null = null;

  return {
    // Repository getters with lazy initialization
    get organizationRepository(): OrganizationRepository {
      if (!_organizationRepository) {
        _organizationRepository = new OrganizationRepository(db);
      }
      return _organizationRepository;
    },

    get adminRepository(): AdminRepository {
      if (!_adminRepository) {
        _adminRepository = new AdminRepository(db);
      }
      return _adminRepository;
    },

    get agentRepository(): AgentRepository {
      if (!_agentRepository) {
        _agentRepository = new AgentRepository(db);
      }
      return _agentRepository;
    },

    get memoryEpisodeRepository(): MemoryEpisodeRepository {
      if (!_memoryEpisodeRepository) {
        _memoryEpisodeRepository = new MemoryEpisodeRepository(db);
      }
      return _memoryEpisodeRepository;
    },

    // Service getters with lazy initialization
    get organizationService(): OrganizationService {
      if (!_organizationService) {
        _organizationService = new OrganizationService(
          this.organizationRepository
        );
      }
      return _organizationService;
    },

    get adminService(): AdminService {
      if (!_adminService) {
        _adminService = new AdminService(this.adminRepository);
      }
      return _adminService;
    },

    get agentService(): AgentService {
      if (!_agentService) {
        _agentService = new AgentService(this.agentRepository);
      }
      return _agentService;
    },

    get memoryEpisodeService(): MemoryEpisodeService {
      if (!_memoryEpisodeService) {
        _memoryEpisodeService = new MemoryEpisodeService(
          this.memoryEpisodeRepository
        );
      }
      return _memoryEpisodeService;
    },
    get passwordService(): PasswordService {
      if (!_passwordService) {
        _passwordService = new PasswordService();
      }
      return _passwordService;
    },
    get accessService(): AccessService {
      if (!_accessService) {
        _accessService = new AccessService();
      }
      return _accessService;
    },

    get authService(): AuthService {
      if (!_auth_service) {
        _auth_service = new AuthService(
          this.adminService,
          this.accessService,
          this.passwordService,
          this.organizationService
        );
      }
      return _auth_service;
    },

    // Optional: Add a cleanup method for serverless environments
    cleanup(): void {
      _organizationRepository = null;
      _adminRepository = null;
      _agentRepository = null;
      _memoryEpisodeRepository = null;
      _organizationService = null;
      _adminService = null;
      _agentService = null;
      _memoryEpisodeService = null;
    },
  };
};

// Usage example:
// const container = createContainer(db);
// const orgService = container.organizationService; // Only creates when first accessed
