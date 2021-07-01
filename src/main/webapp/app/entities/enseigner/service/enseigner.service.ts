import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEnseigner, getEnseignerIdentifier } from '../enseigner.model';

export type EntityResponseType = HttpResponse<IEnseigner>;
export type EntityArrayResponseType = HttpResponse<IEnseigner[]>;

@Injectable({ providedIn: 'root' })
export class EnseignerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/enseigners');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(enseigner: IEnseigner): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enseigner);
    return this.http
      .post<IEnseigner>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(enseigner: IEnseigner): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enseigner);
    return this.http
      .put<IEnseigner>(`${this.resourceUrl}/${getEnseignerIdentifier(enseigner) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(enseigner: IEnseigner): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enseigner);
    return this.http
      .patch<IEnseigner>(`${this.resourceUrl}/${getEnseignerIdentifier(enseigner) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEnseigner>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEnseigner[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEnseignerToCollectionIfMissing(
    enseignerCollection: IEnseigner[],
    ...enseignersToCheck: (IEnseigner | null | undefined)[]
  ): IEnseigner[] {
    const enseigners: IEnseigner[] = enseignersToCheck.filter(isPresent);
    if (enseigners.length > 0) {
      const enseignerCollectionIdentifiers = enseignerCollection.map(enseignerItem => getEnseignerIdentifier(enseignerItem)!);
      const enseignersToAdd = enseigners.filter(enseignerItem => {
        const enseignerIdentifier = getEnseignerIdentifier(enseignerItem);
        if (enseignerIdentifier == null || enseignerCollectionIdentifiers.includes(enseignerIdentifier)) {
          return false;
        }
        enseignerCollectionIdentifiers.push(enseignerIdentifier);
        return true;
      });
      return [...enseignersToAdd, ...enseignerCollection];
    }
    return enseignerCollection;
  }

  protected convertDateFromClient(enseigner: IEnseigner): IEnseigner {
    return Object.assign({}, enseigner, {
      dateDebut: enseigner.dateDebut?.isValid() ? enseigner.dateDebut.toJSON() : undefined,
      dateFin: enseigner.dateFin?.isValid() ? enseigner.dateFin.toJSON() : undefined,
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
      res.body.forEach((enseigner: IEnseigner) => {
        enseigner.dateDebut = enseigner.dateDebut ? dayjs(enseigner.dateDebut) : undefined;
        enseigner.dateFin = enseigner.dateFin ? dayjs(enseigner.dateFin) : undefined;
      });
    }
    return res;
  }
}
