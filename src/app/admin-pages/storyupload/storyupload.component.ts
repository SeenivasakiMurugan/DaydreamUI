import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChapterComponent } from '../../shared-component/chapter/chapter.component';
import { RouterLink , RouterOutlet , Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { StoryService } from '../../Service/story.service';

@Component({
  selector: 'app-storyupload',
  standalone: true,
  imports: [ 
    ChapterComponent 
    , RouterLink 
    , RouterOutlet 
    , CommonModule 
    , FormsModule 
    , HttpClientModule
  ],
  templateUrl: './storyupload.component.html',
  styleUrl: './storyupload.component.scss',
  providers:[StoryService]
})

export class StoryuploadComponent implements OnInit{
  storyId: number | null = 0;
  storyName = '';
  storyTypeId : number = 0;
  chapters = [
    {
      chapterId :0 ,
      name: '',
      chapterParts: [{ description: '', image: '' , partId:0}]
    }
  ];
  storyTypes : any[] = [];

  constructor
  (
     private route:ActivatedRoute
    , private _storyService : StoryService
    , private router : Router
  ){}

   ngOnInit() {
    this.loadStoryTypes();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.storyId = id ? +id : null;
      if (this.storyId) {
        this.loadStoryData(this.storyId);
      }
    });
   }

   loadStoryTypes(){
    this._storyService.GetStoryTypes("Story/GetStoryTypes").subscribe(
      (response:any[])=>{
        this.storyTypes = response.map(storyType =>
        ({
          id : storyType.StoryTypeId,
          name : storyType.StoryTypeName
        })
        );
        console.log(this.storyTypes);
      }
    );
   };

   loadStoryData(storyId: number) {
    this._storyService.GetStoryDetails(`Story/GetStoryByStoryId?storyId=`+ storyId).subscribe(
      (response: any) => {
        if (response && response.StoryList && response.StoryList.length > 0) {
          const story = response.StoryList[0];
          this.storyName = story.StoryName;
          this.storyTypeId = story.StoryTypeId;
          this.storyId = story.StoryId;
          
          this.chapters = response.ChapterList
            .filter((chapter: any) => chapter.StoryId === story.StoryId)
            .map((chapter: any) => ({
              name: chapter.ChapterName,
              chapterId : chapter.ChapterId,
              chapterParts: response.PartList
                .filter((part: any) => part.ChapterId === chapter.ChapterId)
                .map((part: any) => ({
                  description: part.Description,
                  image: part.Image,
                  partId:part.PartId
                }))
            }));
        } else {
          console.warn('No stories found.');
        }
      },
      error => {
        console.error('Error loading story data:', error); // Log any errors
      }
    );
  };

  addChapter() {
    this.chapters.push({
      chapterId : 0 ,
      name: '',
      chapterParts: [{ description: '', image: '' , partId : 0}]
    });
  };

  saveStory() {
    const storyData = {
      StoryName: this.storyName,
      storyTypeId: this.storyTypeId,
      StoryId: this.storyId ?? 0,
      Chapters: this.chapters.map((chap : any) => ({
        ChapterId: chap.chapterId,
        ChapterName: chap.name,
        Parts: chap.chapterParts.map((part : any) => ({
          PartId: part.partId,
          Description: part.description,
          Image: part.image
        }))
      }))
    };

    this._storyService.AddUpdateStory(storyData , "Story/StoryUpdate").subscribe({
      next: (res: any) => {
        console.log(res);
        this.router.navigate(['storylist']);
      },
      error: (error: any) => {
        console.error('Error fetching user list:', error); 
      },
      complete: () => {
        console.log('User list fetch complete'); 
      }
    });
  };
}
