import * as dayjs from 'dayjs';
import { IMatiere } from 'app/entities/matiere/matiere.model';
import { IUserMgr } from 'app/entities/user-mgr/user-mgr.model';

export interface IEnseigner {
  id?: number;
  dateDebut?: dayjs.Dayjs;
  dateFin?: dayjs.Dayjs;
  matiere?: IMatiere | null;
  enseignant?: IUserMgr | null;
}

export class Enseigner implements IEnseigner {
  constructor(
    public id?: number,
    public dateDebut?: dayjs.Dayjs,
    public dateFin?: dayjs.Dayjs,
    public matiere?: IMatiere | null,
    public enseignant?: IUserMgr | null
  ) {}
}

export function getEnseignerIdentifier(enseigner: IEnseigner): number | undefined {
  return enseigner.id;
}
