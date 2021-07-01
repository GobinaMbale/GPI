import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReserverSalle, getReserverSalleIdentifier } from '../reserver-salle.model';

export type EntityResponseType = HttpResponse<IReserverSalle>;
export type EntityArrayResponseType = HttpResponse<IReserverSalle[]>;

@Injectable({ providedIn: 'root' })
export class ReserverSalleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reserver-salles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(reserverSalle: IReserverSalle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reserverSalle);
    return this.http
      .post<IReserverSalle>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(reserverSalle: IReserverSalle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reserverSalle);
    return this.http
      .put<IReserverSalle>(`${this.resourceUrl}/${getReserverSalleIdentifier(reserverSalle) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(reserverSalle: IReserverSalle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reserverSalle);
    return this.http
      .patch<IReserverSalle>(`${this.resourceUrl}/${getReserverSalleIdentifier(reserverSalle) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IReserverSalle>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IReserverSalle[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addReserverSalleToCollectionIfMissing(
    reserverSalleCollection: IReserverSalle[],
    ...reserverSallesToCheck: (IReserverSalle | null | undefined)[]
  ): IReserverSalle[] {
    const reserverSalles: IReserverSalle[] = reserverSallesToCheck.filter(isPresent);
    if (reserverSalles.length > 0) {
      const reserverSalleCollectionIdentifiers = reserverSalleCollection.map(
        reserverSalleItem => getReserverSalleIdentifier(reserverSalleItem)!
      );
      const reserverSallesToAdd = reserverSalles.filter(reserverSalleItem => {
        const reserverSalleIdentifier = getReserverSalleIdentifier(reserverSalleItem);
        if (reserverSalleIdentifier == null || reserverSalleCollectionIdentifiers.includes(reserverSalleIdentifier)) {
          return false;
        }
        reserverSalleCollectionIdentifiers.push(reserverSalleIdentifier);
        return true;
      });
      return [...reserverSallesToAdd, ...reserverSalleCollection];
    }
    return reserverSalleCollection;
  }

  protected convertDateFromClient(reserverSalle: IReserverSalle): IReserverSalle {
    return Object.assign({}, reserverSalle, {
      dateReservation: reserverSalle.dateReservation?.isValid() ? reserverSalle.dateReservation.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateReservation = res.body.dateReservation ? dayjs(res.body.dateReservation) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((reserverSalle: IReserverSalle) => {
        reserverSalle.dateReservation = reserverSalle.dateReservation ? dayjs(reserverSalle.dateReservation) : undefined;
      });
    }
    return res;
  }
}
