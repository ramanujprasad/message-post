import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from './../post.model';
import { PostsService } from './../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postSubs: Subscription;
  private authStatusSubs: Subscription;
  isLoading = false;
  userId: string;
  totalPosts = 0;
  postsPerSize = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  userIsAuthenticated = false;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerSize, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSubs = this.postsService.getPostUpdatedListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSubs = this.authService.getAuthStatusListner().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerSize, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerSize = pageData.pageSize;
    this.postsService.getPosts(this.postsPerSize, this.currentPage);
  }

  ngOnDestroy() {
    this.postSubs.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }

}
