export interface IMatiere {
  id?: number;
  code?: string;
  libelle?: string;
  credit?: number;
  description?: string | null;
}

export class Matiere implements IMatiere {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public credit?: number,
    public description?: string | null
  ) {}
}

export function getMatiereIdentifier(matiere: IMatiere): number | undefined {
  return matiere.id;
}
