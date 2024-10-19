import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.scss'
})
export class EditServiceComponent implements OnInit{

  action: string = '';
  service: any = {
    name: '',
    price: null,
    duration: '',
    description: '',
    people_reaches: null,
    location: '',
    image: null
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.action = params['action'];
      
      if (this.action === 'edit') {
        this.loadService(params['id']);
      }
    });
  }

  onSubmit() {
    console.log('Servicio creado:', this.service);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Para mandar la imagen
      this.service.image = file;
    }
  }

  loadService(id: string) {
    // Cargar el servicio :v
  }

  saveService() {

  }

  updateService() {

  }

  deleteService() {
    
  }


}
