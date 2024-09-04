import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Inject , ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { StoryPopupComponent } from '../../shared-component/story-popup/story-popup.component';
import { StoryService } from '../../Service/story.service'; 
import { DOCUMENT } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AuthService } from '../../Service/auth.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { validationPatterns } from '../../../constants/app.constants';
import { UserService } from '../../Service/user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-storylist',
  standalone: true,
  imports: [
    HttpClientModule
    , CommonModule
    , StoryPopupComponent
    , MatAutocompleteModule
    , MatInputModule
    , MatFormFieldModule
    , ReactiveFormsModule
    , RouterOutlet
    , DialogModule
    , ButtonModule
    , InputTextModule
    , MatProgressSpinnerModule
  ], 
  templateUrl: './storylist.component.html',
  styleUrls: ['./storylist.component.scss'],
  providers: [StoryService , UserService],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class StoryListComponent implements OnInit, AfterViewInit {
  storyId : number = 0;
  storyName: string = '';
  storyChapters: any[] = [];
  stories: any[] = [];
  filterdStories: any[] = [];
  storyTypes: any[] = [];
  currentStoryIndex = 0;
  selectedStory: any = { title: '', parts: [] };
  visible: boolean = false;
  form!: FormGroup;
  clickedIcon: string = '';
  isLoading: boolean = false;
  @ViewChild('storyPdfContainer', { static: false }) storyPdfContainer!: ElementRef;

  constructor(
    private router: Router
    , private _storyService: StoryService
    , private _authService: AuthService
    , private _userService: UserService
    , private cdr: ChangeDetectorRef
    , @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.fetchStories();
    this.loadStoryTypes();
    this.formValidation();
    this.document.body.style.backgroundImage = '';
  };

  /* For validate the user details form */
  formValidation() {
    this.form = new FormGroup({
      mobilenumber: new FormControl('',
        [
          Validators.required,
          //Validators.pattern(validationPatterns.numeric),
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ),
      firstname: new FormControl('',
        [
          Validators.required,
          Validators.pattern(validationPatterns.alpha)
        ]
      )
    });
  };

  ngAfterViewInit(): void {}

  /* Get all the stories from API for show all the story as a list */
  fetchStories() {
    this._storyService.GetStoryList("Story/GetStoryList").subscribe(
      (data: any[]) => {
        this.stories = data.map(story => ({
          id: story.StoryId,
          title: story.StoryName,
          image: story.Image,
          storyTypeId: story.StoryTypeId
        }));
        this.filterdStories = this.stories;
      },
      error => {
        console.error('Error fetching stories:', error);
      }
    );
  };

  /* Filter the stories by storyTypeId on change of StoryTypeId dropdown */
  getStoryByTypeId(event: Event) {
    const storyTypeId = Number((event.target as HTMLSelectElement).value);
    if (storyTypeId !== 0) {
      this.filterdStories = this.stories.filter(e => e.storyTypeId === storyTypeId);
    } else {
      this.filterdStories = this.stories;
    }
  };

  /* Get story type for show the story types as a dropdown */
  loadStoryTypes() {
    this._storyService.GetStoryTypes("Story/GetStoryTypes").subscribe(
      (data: any[]) => {
        this.storyTypes = data.map(storyType => ({
          id: storyType.StoryTypeId,
          name: storyType.StoryTypeName
        }));
      }
    );
  };

  /* On click of edit icon redirect into storyupload page */
  editStory(storyId: number) {
    this.storyId=storyId;
    this.router.navigate(['storyupload', storyId]);
  };

  /* On click of read icon redirect into the story page */
  readStory(storyId: number) {
    this.storyId = storyId;
    this.clickedIcon = "read";
    if(sessionStorage.getItem("username")){
      this.router.navigate(['story', storyId])
    }
    else{
      this.visible = true;
    }
  };

  /* On click of download icon get the story details by the story id 
     and download that story page as pdf */
  downloadStory(storyId: number) {
    this.isLoading = true;
    this.storyId = storyId;
    this.clickedIcon = "download";
    if(sessionStorage.getItem("username")){
      this._storyService.GetStoryDetails(`Story/GetStoryById?storyId=${storyId}`)
      .subscribe((response: any) => {
        if (response !=null) {
          this.storyName = response.storyName;
          this.storyChapters = response.chapters;
          this.cdr.detectChanges();
          this.generatePdf();
        }
      });
    }
    else{
      this.visible = true;
    }
  };

  /* For save the user details */
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    var data = this.form.value;
    console.log(data);

    const userData = this.form.value;
    this._userService.AddUpdateUser(userData, "User/AddUpdateUser").subscribe({
      next: (res: any) => {
        if(res.status=="S"){
          this.visible = false;
          sessionStorage.setItem("username",this.form.value.firstname);
          if(this.storyId!=0)
          {
            if(this.clickedIcon == 'read')
              this.router.navigate(['story',this.storyId]);
            else
              this.downloadStory(this.storyId);
          }
        }
      },
      error: (error: any) => {
        console.error('Error fetching user list:', error);
      },
      complete: () => {
        console.log('User list fetch complete');
      }
    });
  };

  private handleAuthNavigation(targetUrl: string): void {
    if (this._authService.checkLogin()) {
      this.router.navigate([targetUrl]); 
    } else {
      this._authService.setRedirectUrl(targetUrl);
      this.router.navigate(['/login']);
    }
  };

  /* Generate the story page as pdf */
  generatePdf() {
    const pdfContainer = this.storyPdfContainer.nativeElement;
  
    // Temporarily show the content for capturing
    pdfContainer.style.display = 'block';
  
    // Initialize jsPDF
    const pdf = new jsPDF('p', 'mm', 'a4');
  
    // Define A4 dimensions
    const pageWidth = 210; // mm
    const pageHeight = 297; // mm
  
    // Load and add background image
    const backgroundImage = new Image();
    backgroundImage.src = this.storyChapters[0].parts[0].image; // Path to your image
  
    backgroundImage.onload = () => {
      // Add background image to the PDF
      pdf.addImage(backgroundImage, 'JPEG', 0, 0, pageWidth, pageHeight);
  
      // Set content styles
      const applyStyles = () => {
        pdfContainer.style.fontFamily = 'Arial, sans-serif';
        pdfContainer.style.fontSize = '12px';
        pdfContainer.style.lineHeight = '1.5';
        pdfContainer.style.wordWrap = 'break-word';
        pdfContainer.style.overflow = 'hidden';
        pdfContainer.style.maxWidth = '190mm'; 
        pdfContainer.style.margin = '0 auto'; 
        pdfContainer.style.padding = '0 10mm';
        pdfContainer.style.boxSizing = 'border-box'; 
      };
  
      applyStyles();
  
      // Function to capture each section and add to the PDF
      const captureSection = async (section: HTMLElement, yOffset: number) => {
        const images = Array.from(section.querySelectorAll('img')) as HTMLImageElement[];
        await Promise.all(images.map(img => {
          return new Promise<void>((resolve) => {
            if (img.complete && img.naturalHeight !== 0) {
              resolve();
            } else {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }
          });
        }));
  
        const canvas = await html2canvas(section, { scale: 2 });
        const imgWidth = 190; 
        const imgHeight = canvas.height * imgWidth / canvas.width;
  
        if (yOffset + imgHeight > 280) {
          pdf.addPage();
          pdf.addImage(backgroundImage, 'JPEG', 0, 0, pageWidth, pageHeight); // Add background to new page
          yOffset = 10;
        }
  
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, imgHeight);
        yOffset += imgHeight + 10;
  
        return yOffset;
      };
  
      const sections = Array.from(pdfContainer.querySelectorAll('.story-pdf-card')) as HTMLElement[];
      const generateSections = async () => {
        let currentYOffset = 10;
        
        // Capture the title and initial content
        const titleElement = pdfContainer.querySelector('.story-pdf-title') as HTMLElement;
        if (titleElement) {
          const canvas = await html2canvas(titleElement, { scale: 2 });
          const imgWidth = 190;
          const imgHeight = canvas.height * imgWidth / canvas.width;
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, currentYOffset, imgWidth, imgHeight);
          currentYOffset += imgHeight + 10;
        }
  
        for (const section of sections) {
          currentYOffset = await captureSection(section, currentYOffset);
        }
  
        // Save the PDF
        pdf.save(`${this.storyName}.pdf`);
        // Hide the content again after the PDF is generated
        pdfContainer.style.display = 'none'; 
        this.isLoading=false;
      };
  
      generateSections();
    };
  }


  addNew(){
    this.router.navigate(['storyupload']);
  };
}
