export interface IGrade {
  id?: number;
  code?: string;
  intitule?: string;
  description?: string | null;
}

export class Grade implements IGrade {
  constructor(public id?: number, public code?: string, public intitule?: string, public description?: string | null) {}
}

export function getGradeIdentifier(grade: IGrade): number | undefined {
  return grade.id;
}
