import * as dayjs from 'dayjs';
import { IClasse } from 'app/entities/classe/classe.model';
import { ISalle } from 'app/entities/salle/salle.model';

export interface IReserverSalle {
  id?: number;
  dateReservation?: dayjs.Dayjs;
  motif?: string;
  classe?: IClasse | null;
  salle?: ISalle | null;
}

export class ReserverSalle implements IReserverSalle {
  constructor(
    public id?: number,
    public dateReservation?: dayjs.Dayjs,
    public motif?: string,
    public classe?: IClasse | null,
    public salle?: ISalle | null
  ) {}
}

export function getReserverSalleIdentifier(reserverSalle: IReserverSalle): number | undefined {
  return reserverSalle.id;
}
