import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonList, 
  IonListHeader, 
  IonButton, 
  IonInput } from '@ionic/angular/standalone';
import { FirestoreService } from '../services/firestore.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    FormsModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonItem, 
    IonLabel, 
    IonList, 
    IonListHeader, 
    IonButton, 
    IonInput,
    CommonModule
  ],
})
export class HomePage {    
  //Variables
  numeroIngresado: number = 0;
  numeros: { valor: number, multiplos: string[], color: string }[] = [];
  peticionesGuardadas: any[] = [];

  private  firestoreService = inject(FirestoreService);

  generarNumeros() {
    //reinicio la lista
    this.numeros = [];

    //Awui genero la lista de num y encuentro los múltiplos
    for (let i = 0; i <= this.numeroIngresado; i++) {
      const multiplos: string[] = [];
      let color = 'black'; //establezco por defecto, el color negro

      if (i % 3 === 0) multiplos.push('3');//if si i es / a 3, entonces agregp 3 al arreglo multiplos
      if (i % 5 === 0) multiplos.push('5');
      if (i % 7 === 0) multiplos.push('7');

      //verifico el color basado en el menor multiplo
      if (multiplos.length > 0) {
        if (multiplos.includes('3')) {
          color = 'green';
        } else if (multiplos.includes('5')) {
          color = 'red';
        } else if (multiplos.includes('7')) {
          color = 'blue';
        }
      }
      //agrego el num y sus multiplos a la lista
      this.numeros.push({ valor: i, multiplos, color });
    }

    //guardo la peticion y el resultado en Firestore
    this.firestoreService.guardarPeticion({
      numeroIngresado: this.numeroIngresado,
      numeros: this.numeros
    }).then(() => {
      console.log('Peticion guardada');
      //si pasa un error al guardar la petico se muestra un mensaje
    }).catch(error => {
      console.error('Error al guardar la peticion:', error);
    });
  }

  //Aqui cargo todas las peticiones guardadas
  cargarPeticiones() {
    this.firestoreService.obtenerPeticiones().subscribe((peticiones) => {
      //guardo las peticiones obtenidas en peticionesGuardadas.
      this.peticionesGuardadas = peticiones;
      console.log('Peticiones guardadas:', peticiones);
    });
  }

  ngOnInit() {
    //llamo mi metodo automaticamente
    this.cargarPeticiones();
  }
      
}
