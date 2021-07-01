import * as dayjs from 'dayjs';
import { ITypeMateriel } from 'app/entities/type-materiel/type-materiel.model';

export interface IMateriel {
  id?: number;
  nom?: string;
  dateCreation?: dayjs.Dayjs;
  etat?: boolean | null;
  type?: ITypeMateriel | null;
}

export class Materiel implements IMateriel {
  constructor(
    public id?: number,
    public nom?: string,
    public dateCreation?: dayjs.Dayjs,
    public etat?: boolean | null,
    public type?: ITypeMateriel | null
  ) {
    this.etat = this.etat ?? false;
  }
}

export function getMaterielIdentifier(materiel: IMateriel): number | undefined {
  return materiel.id;
}
