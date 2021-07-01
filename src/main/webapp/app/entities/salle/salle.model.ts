export interface ISalle {
  id?: number;
  code?: string;
  nom?: string | null;
  campus?: string | null;
  capacite?: number;
  batiment?: string | null;
}

export class Salle implements ISalle {
  constructor(
    public id?: number,
    public code?: string,
    public nom?: string | null,
    public campus?: string | null,
    public capacite?: number,
    public batiment?: string | null
  ) {}
}

export function getSalleIdentifier(salle: ISalle): number | undefined {
  return salle.id;
}
