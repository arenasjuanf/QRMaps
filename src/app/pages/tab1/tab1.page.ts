import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private barcodeScanner: BarcodeScanner) {
    
  }

  ionViewDidEnter(){
    console.log('hola');
  }

  ionViewDidLeave(){
    console.log('chao');
  }

  scan(){

    this.barcodeScanner.scan({
      showTorchButton: true,
      showFlipCameraButton: true
    }).then(barcodeData => {
      console.log('Barcode data', barcodeData);
    }).catch(err => {
      console.log('Error', err);
    });

  }

}
