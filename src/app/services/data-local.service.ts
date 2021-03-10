import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';


@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados : Registro[] = [];
  guardadosSubject: BehaviorSubject<Registro[]> = new BehaviorSubject([]);


  constructor(
    private storage: Storage,
    private nav: NavController,
    private iab: InAppBrowser,
    private file: File,
    private emailComposer: EmailComposer
  ) {
    this.traerRegistros();
  }

  async guardarRegistro(format: string, text: string){
    await this.traerRegistros();
    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);

    this.storage.set('registros', this.guardados).then(() => {
      this.setRegistros(this.guardados);
      this.abrirRegistro(nuevoRegistro);
    })
  }

  async traerRegistros(){
    this.guardados = ( await this.storage.get('registros') ) || [];
    this.setRegistros(this.guardados);
  }

  setRegistros(registros: Registro[]){
    this.guardadosSubject.next(this.guardados);
  }

  abrirRegistro( registro: Registro ){
    this.nav.navigateForward('/tabs/tab2');
    
    switch(registro.type){
      
      case 'url':
        this.iab.create(registro.text, '_self' , { fullscreen: 'yes', toolbar: 'yes' });
      break;
      case 'text':
        console.log(registro)
      break;
      case 'geo':
        this.nav.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
      break;
      default:
      break;
    }    
  }

  enviarCorreo(){
    const titulos = "Tipo, Formato, Creación, Texto \n";
    const tmp = [];
    tmp.push(titulos);
    this.guardados.forEach(r => {
      const linea = `${r.type}, ${r.format}, ${r.created}, ${r.text.replace(',', ' ') } \n`;
      tmp.push(linea);
    })

    this.crearCsv(tmp.join(''));
  }

  crearCsv(texto: string){
    this.file.checkFile(this.file.dataDirectory, 'registros.csv').then(result => {
      console.log(result)
      return this.escribir(texto);
    })
    .catch(error => {
      return this.file.createFile(this.file.dataDirectory, 'registros.csv', false).then(
        creado => this.escribir(texto)
      );
    })
  }

  async escribir(text: string){
    await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text);
    const archivo = `${this.file.dataDirectory}registros.csv'`; 
    const email = {
      to: 'juanfa107@gmail.com',
/*       cc: 'erika@mustermann.de',
      bcc: ['john@doe.com', 'jane@doe.com'] */
      attachments: [
        archivo
      ],
      subject: 'scans',
      body: `${text}`,
      isHtml: true
    }

    this.emailComposer.open(email);


  }




}
