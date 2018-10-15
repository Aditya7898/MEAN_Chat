import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {} from '@angular/router';
import { StreamComponent } from '../components/stream/stream.component';
import { AuthGuard } from '../services/auth.guard';
import { CommentsComponent } from '../components/comments/comments.component';

const routes: Routes = [
  {
    path: 'streams',
    component: StreamComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'post/:id',
    component: CommentsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  declarations: []
})
export class StreamsRoutingModule {}
