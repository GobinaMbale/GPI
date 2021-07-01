import { IDepartement } from 'app/entities/departement/departement.model';
import { IGrade } from 'app/entities/grade/grade.model';
import { TypeEnseignant } from 'app/entities/enumerations/type-enseignant.model';

export interface IUserMgr {
  id?: number;
  type?: TypeEnseignant | null;
  quotaHoraire?: number | null;
  departement?: IDepartement | null;
  grade?: IGrade | null;
}

export class UserMgr implements IUserMgr {
  constructor(
    public id?: number,
    public type?: TypeEnseignant | null,
    public quotaHoraire?: number | null,
    public departement?: IDepartement | null,
    public grade?: IGrade | null
  ) {}
}

export function getUserMgrIdentifier(userMgr: IUserMgr): number | undefined {
  return userMgr.id;
}
