import {Port} from './port.model';
import {Ship} from './ship.model';

export class Voyage {
  voyagePK: number;
  voyageDate : Date;
  arrivalPortPK: number;
  arrivalPort : Port;
  departurePortPK : number;
  departurePort : Port;
  voyageStartDate : Date;
  voyageEndDate : Date;
  shipPK : number;
  ship: Ship;

  constructor() {
    this.voyagePK = 0;
    this.voyageDate = new Date();
    this.arrivalPortPK = 0;
    this.arrivalPort  = new Port();
    this.departurePortPK = 0;
    this.departurePort   = new Port();
    this.voyageStartDate = new Date();
    this.voyageEndDate = new Date();
    this.shipPK = 0;
    this.ship = new Ship();
  }
}
