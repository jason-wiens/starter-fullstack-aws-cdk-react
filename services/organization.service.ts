import { OrganizationEntity } from "models";
import { createOrderedUid } from "utils";

interface IOrganizationService {
  getOrganizationById: (
    organizationId: string
  ) => Promise<Organization | undefined>;
  getAllOrganizations: () => Promise<Organization[]>;
  createOrganization: (
    organizationAttrs: CreateOrganizationInput
  ) => Promise<Organization>;
  updateOrganization: (
    organizationId: string,
    organizationAttrs: UpdateOrganizationInput
  ) => Promise<Organization>;
  deleteOrganization: (organizationId: string) => Promise<void>;
}

export class OrganizationService implements IOrganizationService {
  constructor() {}

  public async getOrganizationById(organizationId: string) {
    const organizationCompositeKey: OrganizationCompositeKey = {
      organizationId,
    };
    const { Item: organization } = await OrganizationEntity.get(
      organizationCompositeKey
    );
    return organization;
  }

  public async getAllOrganizations() {
    const GSI1PK = "TYPE#ORGANIZATION";
    const { Items: organizations } = await OrganizationEntity.query(GSI1PK, {
      index: "GSI1PK",
      beginsWith: "ORG#",
    });
    return organizations ? organizations : [];
  }

  public async createOrganization(organizationAttrs: CreateOrganizationInput) {
    const organizationId = createOrderedUid();
    const newOrganization = {
      ...organizationAttrs,
      organizationId,
    };
    await OrganizationEntity.put(newOrganization);
    return newOrganization;
  }

  public async updateOrganization(
    organizationId: string,
    organizationAttrs: UpdateOrganizationInput
  ) {
    const organization = await this.getOrganizationById(organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }
    const updatedOrganization = {
      ...organization,
      ...organizationAttrs,
    };
    await OrganizationEntity.put(updatedOrganization);
    return updatedOrganization;
  }

  public async deleteOrganization(organizationId: string) {
    const organization = await this.getOrganizationById(organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }
    await OrganizationEntity.delete({ organizationId });
  }
}
