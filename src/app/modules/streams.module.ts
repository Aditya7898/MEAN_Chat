import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamComponent } from '../components/stream/stream.component';
import { TokenService } from '../services/token.service';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SideComponent } from '../components/side/side.component';
import { PostFormComponent } from '../components/post-form/post-form.component';
import { PostsComponent } from '../components/posts/posts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../services/post.service';
import { HttpClientModule } from '@angular/common/http';
import { CommentsComponent } from '../components/comments/comments.component';
import { RouterModule } from '@angular/router';
import { PeopleComponent } from '../components/people/people.component';
import { UsersService } from '../services/users.service';
import { FollowingComponent } from '../components/following/following.component';
import { FollowersComponent } from '../components/followers/followers.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    StreamComponent,
    ToolbarComponent,
    SideComponent,
    PostFormComponent,
    PostsComponent,
    CommentsComponent,
    PeopleComponent,
    FollowingComponent,
    FollowersComponent
  ],
  exports: [
    StreamComponent,
    PostFormComponent,
    ToolbarComponent,
    SideComponent,
    CommentsComponent,
    PeopleComponent,
    FollowingComponent,
    FollowersComponent
  ],
  providers: [TokenService, PostService, UsersService]
})
export class StreamsModule {}
