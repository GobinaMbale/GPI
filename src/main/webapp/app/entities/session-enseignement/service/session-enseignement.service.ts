import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISessionEnseignement, getSessionEnseignementIdentifier } from '../session-enseignement.model';

export type EntityResponseType = HttpResponse<ISessionEnseignement>;
export type EntityArrayResponseType = HttpResponse<ISessionEnseignement[]>;

@Injectable({ providedIn: 'root' })
export class SessionEnseignementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/session-enseignements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(sessionEnseignement: ISessionEnseignement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sessionEnseignement);
    return this.http
      .post<ISessionEnseignement>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(sessionEnseignement: ISessionEnseignement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sessionEnseignement);
    return this.http
      .put<ISessionEnseignement>(`${this.resourceUrl}/${getSessionEnseignementIdentifier(sessionEnseignement) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(sessionEnseignement: ISessionEnseignement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sessionEnseignement);
    return this.http
      .patch<ISessionEnseignement>(`${this.resourceUrl}/${getSessionEnseignementIdentifier(sessionEnseignement) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISessionEnseignement>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISessionEnseignement[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSessionEnseignementToCollectionIfMissing(
    sessionEnseignementCollection: ISessionEnseignement[],
    ...sessionEnseignementsToCheck: (ISessionEnseignement | null | undefined)[]
  ): ISessionEnseignement[] {
    const sessionEnseignements: ISessionEnseignement[] = sessionEnseignementsToCheck.filter(isPresent);
    if (sessionEnseignements.length > 0) {
      const sessionEnseignementCollectionIdentifiers = sessionEnseignementCollection.map(
        sessionEnseignementItem => getSessionEnseignementIdentifier(sessionEnseignementItem)!
      );
      const sessionEnseignementsToAdd = sessionEnseignements.filter(sessionEnseignementItem => {
        const sessionEnseignementIdentifier = getSessionEnseignementIdentifier(sessionEnseignementItem);
        if (sessionEnseignementIdentifier == null || sessionEnseignementCollectionIdentifiers.includes(sessionEnseignementIdentifier)) {
          return false;
        }
        sessionEnseignementCollectionIdentifiers.push(sessionEnseignementIdentifier);
        return true;
      });
      return [...sessionEnseignementsToAdd, ...sessionEnseignementCollection];
    }
    return sessionEnseignementCollection;
  }

  protected convertDateFromClient(sessionEnseignement: ISessionEnseignement): ISessionEnseignement {
    return Object.assign({}, sessionEnseignement, {
      dateDebut: sessionEnseignement.dateDebut?.isValid() ? sessionEnseignement.dateDebut.toJSON() : undefined,
      dateFin: sessionEnseignement.dateFin?.isValid() ? sessionEnseignement.dateFin.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateDebut = res.body.dateDebut ? dayjs(res.body.dateDebut) : undefined;
      res.body.dateFin = res.body.dateFin ? dayjs(res.body.dateFin) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((sessionEnseignement: ISessionEnseignement) => {
        sessionEnseignement.dateDebut = sessionEnseignement.dateDebut ? dayjs(sessionEnseignement.dateDebut) : undefined;
        sessionEnseignement.dateFin = sessionEnseignement.dateFin ? dayjs(sessionEnseignement.dateFin) : undefined;
      });
    }
    return res;
  }
}
