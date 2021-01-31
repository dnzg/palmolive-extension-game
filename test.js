var arr = {
  "users" : {
    "dnzg1": 200000,
    "dnzg2": 3233,
    "dnzg4": 10000,
    "dnzg5": 432,
    "dnzg6": 1200,
    "dnzg7": 500,
    "dnzg8": 534,
    "dnzg9": 300,
    "dnzg10": 3645,
    "dnz11": 21,
    "dnzg233": 20,
    "dnzg22": 10,
    "dnzg21": 0,
    "dnzg20": 323,
  }
};

var result = Object.keys(arr.users).map((key) => [key, arr.users[key]]);
result.sort(function (a, b) {
    if (a[1] > b[1]) {
      return -1;
    }
    if (a[1] < b[1]) {
      return 1;
    }
    return 0;
  });
console.log(result.slice(0, 10));