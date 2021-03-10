import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Registro } from 'src/app/models/registro.model';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  dataSubscription: Subscription;
  registros: Registro[] = [];

  constructor(
    private dataService: DataLocalService
  ) {
    
  }

  ionViewWillLeave(){
    this.dataSubscription.unsubscribe();
  }

  ionViewDidEnter(){
    this.dataSubscription = this.dataService.guardadosSubject.subscribe(
      (result) => {
        console.log(result);
        this.registros = result
      }
    );
  } 

  share(){
    this.dataService.enviarCorreo();
  }

  abrir(registro: Registro){
    this.dataService.abrirRegistro(registro);
  }

}
