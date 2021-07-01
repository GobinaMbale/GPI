import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReserverMateriel, getReserverMaterielIdentifier } from '../reserver-materiel.model';

export type EntityResponseType = HttpResponse<IReserverMateriel>;
export type EntityArrayResponseType = HttpResponse<IReserverMateriel[]>;

@Injectable({ providedIn: 'root' })
export class ReserverMaterielService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reserver-materiels');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(reserverMateriel: IReserverMateriel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reserverMateriel);
    return this.http
      .post<IReserverMateriel>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(reserverMateriel: IReserverMateriel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reserverMateriel);
    return this.http
      .put<IReserverMateriel>(`${this.resourceUrl}/${getReserverMaterielIdentifier(reserverMateriel) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(reserverMateriel: IReserverMateriel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reserverMateriel);
    return this.http
      .patch<IReserverMateriel>(`${this.resourceUrl}/${getReserverMaterielIdentifier(reserverMateriel) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IReserverMateriel>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IReserverMateriel[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addReserverMaterielToCollectionIfMissing(
    reserverMaterielCollection: IReserverMateriel[],
    ...reserverMaterielsToCheck: (IReserverMateriel | null | undefined)[]
  ): IReserverMateriel[] {
    const reserverMateriels: IReserverMateriel[] = reserverMaterielsToCheck.filter(isPresent);
    if (reserverMateriels.length > 0) {
      const reserverMaterielCollectionIdentifiers = reserverMaterielCollection.map(
        reserverMaterielItem => getReserverMaterielIdentifier(reserverMaterielItem)!
      );
      const reserverMaterielsToAdd = reserverMateriels.filter(reserverMaterielItem => {
        const reserverMaterielIdentifier = getReserverMaterielIdentifier(reserverMaterielItem);
        if (reserverMaterielIdentifier == null || reserverMaterielCollectionIdentifiers.includes(reserverMaterielIdentifier)) {
          return false;
        }
        reserverMaterielCollectionIdentifiers.push(reserverMaterielIdentifier);
        return true;
      });
      return [...reserverMaterielsToAdd, ...reserverMaterielCollection];
    }
    return reserverMaterielCollection;
  }

  protected convertDateFromClient(reserverMateriel: IReserverMateriel): IReserverMateriel {
    return Object.assign({}, reserverMateriel, {
      dateReservation: reserverMateriel.dateReservation?.isValid() ? reserverMateriel.dateReservation.toJSON() : undefined,
      dateRetour: reserverMateriel.dateRetour?.isValid() ? reserverMateriel.dateRetour.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateReservation = res.body.dateReservation ? dayjs(res.body.dateReservation) : undefined;
      res.body.dateRetour = res.body.dateRetour ? dayjs(res.body.dateRetour) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((reserverMateriel: IReserverMateriel) => {
        reserverMateriel.dateReservation = reserverMateriel.dateReservation ? dayjs(reserverMateriel.dateReservation) : undefined;
        reserverMateriel.dateRetour = reserverMateriel.dateRetour ? dayjs(reserverMateriel.dateRetour) : undefined;
      });
    }
    return res;
  }
}
