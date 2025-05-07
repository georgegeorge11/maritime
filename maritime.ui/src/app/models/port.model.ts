import {Country} from './country.model';

export class Port {
  portPK: number;
  name: string;
  countryPK: number;
  country: Country;

  constructor() {
    this.portPK = 0;
    this.name = "";
    this.countryPK = 0;
    this.country = new Country();
  }
}
