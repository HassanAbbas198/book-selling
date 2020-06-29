import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";

interface Governorate {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-educational-entity",
  templateUrl: "./educational-entity.component.html",
  styleUrls: ["./educational-entity.component.css"],
})
export class EducationalEntityComponent implements OnInit {
  BACKEND_URL = environment.apiUrl;

  isLoading = false;
  governorate: string;

  form: FormGroup;

  governorates: Governorate[] = [
    { value: "Akkar", viewValue: "Akkar" },
    { value: "Beirut", viewValue: "Beirut" },
    { value: "Tripoli", viewValue: "Tripoli" },
    { value: "Beqaa", viewValue: "Beqaa" },
    { value: "Nabatieh", viewValue: "Nabatieh" },
    { value: "South", viewValue: "South" },
    { value: "North", viewValue: "North" },
  ];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      city: new FormControl(null, {
        validators: [Validators.required],
      }),
      governorate: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  changeGov(value) {
    this.governorate = value;
  }

  addEntity() {
    this.isLoading = true;
    const entity = {
      name: this.form.value.name,
      city: this.form.value.city,
      governorate: this.governorate,
    };
    this.http.post(this.BACKEND_URL + "/entity", entity).subscribe(() => {
      this.router.navigate(["/create"]);
      this.isLoading = false;
    });
  }
}
