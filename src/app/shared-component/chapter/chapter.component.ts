import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

// Define interfaces
interface Part {
  partId: 0;
  description: string;
  image: string;
}

interface Chapter {
  chapterId: 0 ;
  name: string;
  chapterParts: Part[];
}

@Component({
  selector: 'app-chapter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChapterComponent),
      multi: true
    }
  ]
})
export class ChapterComponent implements OnInit, ControlValueAccessor {
  @Input() chapterIndex!: number;
  @Input() chapte: Chapter = {
    chapterId: 0,
    name: '',
    chapterParts: []
  };
  chapterId:number = 0;
  uploadedImages: string[] = []; 

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    this.uploadedImages = this.chapte.chapterParts.map((part: Part) => part.image || '');
  }

  addChapterPart() {
    this.chapte.chapterParts.push({
      partId: 0,
      description: '',
      image: ''
    });
    this.uploadedImages.push('');
    this.onChange(this.chapte);
  }

  onImageUpload(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImages[index] = reader.result as string;
        this.chapte.chapterParts[index].image = reader.result as string;
        this.onChange(this.chapte);
      };
      reader.readAsDataURL(file);
    }
  }

  writeValue(value: any): void {
    if (value) {
      this.chapte = value;
      this.uploadedImages = this.chapte.chapterParts.map((part: Part) => part.image || '');
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if necessary
  }
}
