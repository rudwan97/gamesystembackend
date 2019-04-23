const mongoose = require('mongoose');

//Run tests local
beforeEach(function(done) {
  this.timeout(10000);
  mongoose.connect("mongodb://localhost:27017/GameSystemTest", function(){
      mongoose.connection.db.dropDatabase(() => {
          console.log('Cleaning - test database dropped');
          done();
      });
  });
});
