var User = require('./../models/User.js');

module.exports.new = function(request, response){
    response.render('login.ejs');
}

module.exports.create =  function(request, response){
  var new_user = new User(request.body);
  new_user.save(function(err,data){
    if(err){
      console.log(err)
      return response.status(400).json({error: "Please add a name"});
      console.log(data);
    }
    console.log(data);
    return response.status(200).json({message: "User successfully created"});
  })
  
  console.log(request.body);
}

module.exports.list = function(request, response) {
  User.find(function(err, data){
    if(err){
      response.status(400)
        .json({
          error: "Database query error"
        });
    }
  
    response.status(200).json({
      user: data
    });
  });
}

// module.exports.userID = function(request, response) {
//   User.findOne({_id:request.params.userID},
//     function(err, data){
//       if(err){
//         response.status(400)
//           .json({
//             error: "Database query error"
//           });
//       }else{
//         response.render('chathistory.ejs', {
//           user: data
//         })
//     }
//   });
// }