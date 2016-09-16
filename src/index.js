import liner from './liner';
import dots from './dots';


var data1 = {
    '2016-08-30': {
        'dau': 50,
        'nau': 7
    },
    '2016-08-31': {
        'dau': 51,
        'nau': 20
    },
    '2016-09-01': {
        'dau': 60,
        'nau': 15
    },
    '2016-09-02': {
        'dau': 71,
        'nau': 19
    },
    '2016-09-03': {
        'dau': 57,
        'nau': 16
    },
    '2016-09-04': {
        'dau': 22,
        'nau': 16
    }
};


(new liner(data1)).render("#liner");


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
