import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CountryService } from '../../services/country';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-personal-info',
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './personal-info.html',
  styleUrl: './personal-info.scss',
})
export class PersonalInfo implements OnInit {
  formGroup: any;
  countries: any[] = [];
  filteredCountries: any[] = [];
  states: any[] = [];
  @Output() setPageForParent = new EventEmitter<number>();
  constructor(private countryService: CountryService, private resumeService: ResumeService) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      fullName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/), // exactly 10 digits
      ]),
      city: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      linkedin: new FormControl('', [
        Validators.pattern(/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/),
      ]),
      github: new FormControl('', [Validators.pattern(/^(https?:\/\/)?(www\.)?github\.com\/.*$/)]),
      summary: new FormControl('', [Validators.required]),
    });

    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
    });
    this.handleCountryChange();
  }
  handleCountryChange() {
    this.formGroup.get('country')!.valueChanges.subscribe((countryCode: any) => {
      // Reset state always
      this.formGroup.get('state')!.reset();
      this.formGroup.get('state')!.disable();
      this.states = [];

      if (!countryCode) return;

      // Find selected country
      const selectedCountry = this.countries.find((c) => c.iso2 === countryCode);

      // Enable + load states
      if (selectedCountry?.states?.length) {
        this.states = selectedCountry.states;
        this.formGroup.get('state')!.enable();
      }
    });
  }

  filterCountries(event: any) {
    const value = event.target.value.toLowerCase();
    this.filteredCountries = this.countries.filter((c) => c.name.toLowerCase().includes(value));
  }

  nextPage() {
    this.resumeService.gotoNextPage();
    this.setPageForParent.emit(this.resumeService.getPage())
  }

  prevPage() {
    this.resumeService.gotoPrevPage();
    this.setPageForParent.emit(this.resumeService.getPage())

  }
}
