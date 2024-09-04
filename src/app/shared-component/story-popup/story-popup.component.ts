import { Component, Input, OnInit,Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-story-popup',
  standalone: true,
  imports: [CommonModule,MatDialogModule,MatButtonModule],
  templateUrl: './story-popup.component.html',
  styleUrl: './story-popup.component.scss'
})
export class StoryPopupComponent {

  currentPartIndex: number = 0; // Track current part
  parts: any[] = []; // Array to hold story parts
  title: string = '';
  constructor(
    public dialogRef: MatDialogRef<StoryPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  {
    this.title = data.title;
    this.parts = data.parts;
  }

  nextPart() {
    if (this.currentPartIndex < this.parts.length - 1) {
      this.currentPartIndex++;
    }
  }

  previousPart() {
    if (this.currentPartIndex > 0) {
      this.currentPartIndex--;
    }
  }

  // Close dialog
  closePopup() {
    this.dialogRef.close();
  }

  get currentPart() {
    return this.parts[this.currentPartIndex];
  }
}