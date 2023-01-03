type Organization = {
  organizationId: string;
  legalName: string;
  displayName: string;
  logoUrl?: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
};

type OrganizationCompositeKey = {
  organizationId: string;
};

type OrganizationCompositeKeyGSI1 = {
  organizationId: string;
};

type CreateOrganizationInput = Omit<Organization, "organizationId">;

type UpdateOrganizationInput = Partial<Omit<Organization, "organizationId">>;
