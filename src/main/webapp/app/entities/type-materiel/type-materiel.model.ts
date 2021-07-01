export interface ITypeMateriel {
  id?: number;
  libelle?: string;
}

export class TypeMateriel implements ITypeMateriel {
  constructor(public id?: number, public libelle?: string) {}
}

export function getTypeMaterielIdentifier(typeMateriel: ITypeMateriel): number | undefined {
  return typeMateriel.id;
}
