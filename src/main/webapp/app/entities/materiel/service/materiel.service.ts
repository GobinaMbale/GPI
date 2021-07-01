import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMateriel, getMaterielIdentifier } from '../materiel.model';

export type EntityResponseType = HttpResponse<IMateriel>;
export type EntityArrayResponseType = HttpResponse<IMateriel[]>;

@Injectable({ providedIn: 'root' })
export class MaterielService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/materiels');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(materiel: IMateriel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(materiel);
    return this.http
      .post<IMateriel>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(materiel: IMateriel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(materiel);
    return this.http
      .put<IMateriel>(`${this.resourceUrl}/${getMaterielIdentifier(materiel) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(materiel: IMateriel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(materiel);
    return this.http
      .patch<IMateriel>(`${this.resourceUrl}/${getMaterielIdentifier(materiel) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMateriel>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMateriel[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMaterielToCollectionIfMissing(materielCollection: IMateriel[], ...materielsToCheck: (IMateriel | null | undefined)[]): IMateriel[] {
    const materiels: IMateriel[] = materielsToCheck.filter(isPresent);
    if (materiels.length > 0) {
      const materielCollectionIdentifiers = materielCollection.map(materielItem => getMaterielIdentifier(materielItem)!);
      const materielsToAdd = materiels.filter(materielItem => {
        const materielIdentifier = getMaterielIdentifier(materielItem);
        if (materielIdentifier == null || materielCollectionIdentifiers.includes(materielIdentifier)) {
          return false;
        }
        materielCollectionIdentifiers.push(materielIdentifier);
        return true;
      });
      return [...materielsToAdd, ...materielCollection];
    }
    return materielCollection;
  }

  protected convertDateFromClient(materiel: IMateriel): IMateriel {
    return Object.assign({}, materiel, {
      dateCreation: materiel.dateCreation?.isValid() ? materiel.dateCreation.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateCreation = res.body.dateCreation ? dayjs(res.body.dateCreation) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((materiel: IMateriel) => {
        materiel.dateCreation = materiel.dateCreation ? dayjs(materiel.dateCreation) : undefined;
      });
    }
    return res;
  }
}
