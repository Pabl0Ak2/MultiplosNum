import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { orderBy, query } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  //Guardo mi peticion y el resultado
  guardarPeticion(peticion: { numeroIngresado: number, numeros: any[] }) {
    const coleccionRef = collection(this.firestore, 'peticiones');
    //agrego la peticion a la coleccion 'peticiones
    return addDoc(coleccionRef, {
      ...peticion,
      fecha:new Date()
    });
  }

  //Aqqui obtengo todas las peticiones
  obtenerPeticiones(): Observable<any[]> {
    const coleccionRef = collection(this.firestore, 'peticiones');
    //aqui hago una consulta ordenada del campo 'fecha' en orden desc
    const q = query(coleccionRef, orderBy('fecha', 'desc'));
    //regreso toda la coleccion de Firestore en tiempo real
    return collectionData(coleccionRef, 
    { 
      idField: 'id' 
    });
  }
}