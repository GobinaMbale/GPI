import * as dayjs from 'dayjs';
import { IUserMgr } from 'app/entities/user-mgr/user-mgr.model';
import { IMateriel } from 'app/entities/materiel/materiel.model';

export interface IReserverMateriel {
  id?: number;
  dateReservation?: dayjs.Dayjs | null;
  dateRetour?: dayjs.Dayjs | null;
  auteur?: IUserMgr | null;
  materiel?: IMateriel | null;
}

export class ReserverMateriel implements IReserverMateriel {
  constructor(
    public id?: number,
    public dateReservation?: dayjs.Dayjs | null,
    public dateRetour?: dayjs.Dayjs | null,
    public auteur?: IUserMgr | null,
    public materiel?: IMateriel | null
  ) {}
}

export function getReserverMaterielIdentifier(reserverMateriel: IReserverMateriel): number | undefined {
  return reserverMateriel.id;
}
