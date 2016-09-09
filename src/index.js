import app from './app';
import dots from './dots';
(new app()).render("#liner");


var data = [
  {
    rateAmount: 4000,
    days: 11
  }, {
    rateAmount: 5000,
    days: 33
  }, {
    rateAmount: 5000,
    days: 33
  }, {
    rateAmount: 1000,
    days: 13
  }, {
    rateAmount: 5430,
    days: 44
  }, {
    rateAmount: 6100,
    days: 23
  }, {
    rateAmount: 3400,
    days: 43
  }
];

(new dots(data)).render("#dots");
