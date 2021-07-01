import { Niveau } from 'app/entities/enumerations/niveau.model';

export interface IClasse {
  id?: number;
  code?: string;
  niveau?: Niveau | null;
  specialite?: string | null;
  libelle?: string;
}

export class Classe implements IClasse {
  constructor(
    public id?: number,
    public code?: string,
    public niveau?: Niveau | null,
    public specialite?: string | null,
    public libelle?: string
  ) {}
}

export function getClasseIdentifier(classe: IClasse): number | undefined {
  return classe.id;
}
