export interface IDepartement {
  id?: number;
  code?: string;
  libelle?: string;
}

export class Departement implements IDepartement {
  constructor(public id?: number, public code?: string, public libelle?: string) {}
}

export function getDepartementIdentifier(departement: IDepartement): number | undefined {
  return departement.id;
}
