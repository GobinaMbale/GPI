import * as dayjs from 'dayjs';
import { IEnseigner } from 'app/entities/enseigner/enseigner.model';
import { IReserverSalle } from 'app/entities/reserver-salle/reserver-salle.model';

export interface ISessionEnseignement {
  id?: number;
  dateDebut?: dayjs.Dayjs;
  dateFin?: dayjs.Dayjs;
  cours?: IEnseigner | null;
  salleReserver?: IReserverSalle | null;
}

export class SessionEnseignement implements ISessionEnseignement {
  constructor(
    public id?: number,
    public dateDebut?: dayjs.Dayjs,
    public dateFin?: dayjs.Dayjs,
    public cours?: IEnseigner | null,
    public salleReserver?: IReserverSalle | null
  ) {}
}

export function getSessionEnseignementIdentifier(sessionEnseignement: ISessionEnseignement): number | undefined {
  return sessionEnseignement.id;
}
