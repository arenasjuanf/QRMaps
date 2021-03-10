import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private barcodeScanner: BarcodeScanner,
    private dataLocal: DataLocalService
  ) {
    
  }

  ionViewDidEnter(){
  }
  
  scan(){
    this.barcodeScanner.scan({
      showTorchButton: true,
      showFlipCameraButton: true
    }).then(barcodeData => {
      if(!barcodeData.cancelled){
        const { format, text } = barcodeData;
        this.dataLocal.guardarRegistro(format, text);
      }
    }).catch(err => {
      console.log('Error', err);
    });

  }

}
