const users =  {
    "U577038969" : {
      "score" : 130,
      "username" : "steinhauzz"
    },
    "U577038961" : {
      "score" : 2120,
      "username" : "dnzg"
    }
  };
      const rating = Object.keys(users).map((key) => [users[key].username, users[key].score]);
      rating.sort(function(a, b) {
        if (a[1] > b[1]) {
          return -1;
        }
        if (a[1] < b[1]) {
          return 1;
        }
        return 0;
      });
      const rate = rating.slice(0, 10);
      console.log(rate);