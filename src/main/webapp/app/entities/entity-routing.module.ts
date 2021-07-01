import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'departement',
        data: { pageTitle: 'gpiApp.departement.home.title' },
        loadChildren: () => import('./departement/departement.module').then(m => m.DepartementModule),
      },
      {
        path: 'user-mgr',
        data: { pageTitle: 'gpiApp.userMgr.home.title' },
        loadChildren: () => import('./user-mgr/user-mgr.module').then(m => m.UserMgrModule),
      },
      {
        path: 'matiere',
        data: { pageTitle: 'gpiApp.matiere.home.title' },
        loadChildren: () => import('./matiere/matiere.module').then(m => m.MatiereModule),
      },
      {
        path: 'salle',
        data: { pageTitle: 'gpiApp.salle.home.title' },
        loadChildren: () => import('./salle/salle.module').then(m => m.SalleModule),
      },
      {
        path: 'classe',
        data: { pageTitle: 'gpiApp.classe.home.title' },
        loadChildren: () => import('./classe/classe.module').then(m => m.ClasseModule),
      },
      {
        path: 'type-materiel',
        data: { pageTitle: 'gpiApp.typeMateriel.home.title' },
        loadChildren: () => import('./type-materiel/type-materiel.module').then(m => m.TypeMaterielModule),
      },
      {
        path: 'materiel',
        data: { pageTitle: 'gpiApp.materiel.home.title' },
        loadChildren: () => import('./materiel/materiel.module').then(m => m.MaterielModule),
      },
      {
        path: 'reserver-materiel',
        data: { pageTitle: 'gpiApp.reserverMateriel.home.title' },
        loadChildren: () => import('./reserver-materiel/reserver-materiel.module').then(m => m.ReserverMaterielModule),
      },
      {
        path: 'reserver-salle',
        data: { pageTitle: 'gpiApp.reserverSalle.home.title' },
        loadChildren: () => import('./reserver-salle/reserver-salle.module').then(m => m.ReserverSalleModule),
      },
      {
        path: 'enseigner',
        data: { pageTitle: 'gpiApp.enseigner.home.title' },
        loadChildren: () => import('./enseigner/enseigner.module').then(m => m.EnseignerModule),
      },
      {
        path: 'session-enseignement',
        data: { pageTitle: 'gpiApp.sessionEnseignement.home.title' },
        loadChildren: () => import('./session-enseignement/session-enseignement.module').then(m => m.SessionEnseignementModule),
      },
      {
        path: 'grade',
        data: { pageTitle: 'gpiApp.grade.home.title' },
        loadChildren: () => import('./grade/grade.module').then(m => m.GradeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
