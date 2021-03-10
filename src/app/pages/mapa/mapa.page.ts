import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as mapboxgl  from 'mapbox-gl'

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

  mapbox = (mapboxgl as typeof mapboxgl);
  lat: number;
  lng: number;


  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    
  }

  ngOnInit() {
    let geo: any = this.activatedRoute.snapshot.paramMap.get('geo');
    geo = geo.substr(4);
    geo = geo.split(',');
    this.lat = Number(geo[0]);
    this.lng = Number(geo[1]);
  }

  ngAfterViewInit(){
    this.loadMap();
  }

  loadMap(){

    this.mapbox.accessToken = 'pk.eyJ1IjoiYXJlbmFzLWp1YW5mIiwiYSI6ImNrbHpieXcwcjBoMzkyd3A0NXRhanI2OHcifQ.767OFls9-XQ_DQ23DN_G6w'

    let map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.lng, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    map.on('load',() => {
      // Insert the layer beneath any symbol layer.
      let layers = map.getStyle().layers;
      map.resize();

      // marker
      new mapboxgl.Marker({
      color: "#101E66",
      draggable: false
      }).setLngLat([this.lng, this.lat])
      .addTo(map);


      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }
       
      map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#aaa',
          
          // use an 'interpolate' expression to add a smooth transition effect to the
          // buildings as the user zooms in
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
        );
      }
    );
  }
  

}
