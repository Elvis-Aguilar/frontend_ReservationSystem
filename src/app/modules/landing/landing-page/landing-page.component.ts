import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {


  onSubmit(event: Event) {
    event.preventDefault();
    Swal.fire({
      title: "Completado",
      text: "El Formulario se envio correctamente",
      icon: "success"
    }).then(()=> {
      location.reload();
    });

  }
  

  //Nav
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
