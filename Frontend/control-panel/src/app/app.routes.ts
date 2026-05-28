import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { MapScreenDisplay } from './overlays/map-screen-display/map-screen-display';
import { ScoreBox } from './overlays/score-box/score-box';
import { CommentatorBox } from './overlays/commentator-box/commentator-box';
import { InfoboxDisplay } from './overlays/infobox-display/infobox-display';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Dashboard
      }
    ]
  },
  {
    path: 'overlay/map-screen',
    component: MapScreenDisplay
  },
  {
    path: 'overlay/score-box',
    component: ScoreBox
  },
  {
    path: 'overlay/commentator-box',
    component: CommentatorBox
  },
  {
    path: 'overlay/info-box',
    component: InfoboxDisplay
  }
];
