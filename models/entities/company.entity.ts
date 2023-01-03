export interface Company {
  id: string;
  fullName: string;
  shortName: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyInput {
  fullName: string;
  shortName: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  logoUrl: string;
}
