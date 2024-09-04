export interface IStory {
    
}

export class story
{
    StoryId : number = 0;
    StoryName : string = "";
    storyTypeId : number = 0;
    Chapters : any;
}

export class chapter
{
    ChapterId : number = 0;
    ChapterName : string = "";
    StoryId : number = 0;
    Parts : any;
}

export class part
{
    PartId : number = 0;
    ChapterId : number = 0;
    Description : string = "";
    Image : string = "";
}

export class storyType
{
    StoryTypeId : number = 0;
    StoryName : string = "";
}