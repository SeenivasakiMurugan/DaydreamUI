import { Component, Inject, OnInit } from '@angular/core';
import { StoryService } from '../../Service/story.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterOutlet],
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'], 
  providers: [StoryService]
})

export class StoryComponent implements OnInit {
  storyId: number | null = null;
  storyName: string = "";
  storyImage: string = "";
  chapters: any[] = [];
  currentChapterIndex: number = 0;
  currentPartIndex: number = 0;

  constructor(
    private _storyService: StoryService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.storyId = id ? +id : null;
      if (this.storyId) {
        this.loadStoryData(this.storyId);
      }
    });
  }

  loadStoryData(storyId: number) {
    this._storyService.GetStoryDetails(`Story/GetStoryById?storyId=` + storyId)
      .subscribe((response: any) => {
        if (response) {
          this.storyName = response.storyName;
          this.storyImage = response.image;
          this.chapters = response.chapters; 

          if (this.storyImage) {
            this.document.body.style.backgroundImage = `url(${this.storyImage})`;
            this.document.body.style.backgroundSize = 'cover';
            this.document.body.style.backgroundPosition = 'center';
            this.document.body.style.backgroundRepeat = 'no-repeat';
          }
        }
      });
  }

  get currentChapter() {
    return this.chapters[this.currentChapterIndex];
  }

  get currentPart() {
    return this.currentChapter?.parts[this.currentPartIndex];
  }

  onNextPart() {
    if (this.currentPartIndex < this.currentChapter.parts.length - 1) {
      this.currentPartIndex++;
    } else if (this.currentChapterIndex < this.chapters.length - 1) {
      this.currentChapterIndex++;
      this.currentPartIndex = 0;
    }
  }

  onPreviousPart() {
    if (this.currentPartIndex > 0) {
      this.currentPartIndex--;
    } else if (this.currentChapterIndex > 0) {
      this.currentChapterIndex--;
      this.currentPartIndex = this.chapters[this.currentChapterIndex].parts.length - 1;
    }
  }

  loadNextChapter() {
    if (this.currentChapterIndex < this.chapters.length - 1) {
      this.currentChapterIndex++;
      this.currentPartIndex = 0;
    }
  }

  loadPreviousChapter() {
    if (this.currentChapterIndex > 0) {
      this.currentChapterIndex--;
      this.currentPartIndex = 0;
    }
  }


  isFirstPart() {
    return this.currentChapterIndex === 0 && this.currentPartIndex === 0;
  }

  isLastPart() {
    return (
      this.currentChapterIndex === this.chapters.length - 1 &&
      this.currentPartIndex === this.currentChapter.parts.length - 1
    );
  }

  isFirstChapter() {
    return this.currentChapterIndex === 0;
  }

  isLastChapter() {
    return this.currentChapterIndex === this.chapters.length - 1;
  }
}
