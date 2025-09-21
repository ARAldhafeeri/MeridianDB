import { Organization } from "../../domain/organization";
import { BaseRepository } from "./base";

/**
 * Oranization repository used in admin, federated and other repistories
 * as well intial web session recording in memory store for authentication and authorization
 * for each admin there is one parent as the parent of the admin
 * e.g. admin a as configured in env vars, will get created with org a
 * which it's name and details can be edited
 * then the admin can create more organizations.
 */
export interface IOrganizationRepository extends BaseRepository<Organization> {}
