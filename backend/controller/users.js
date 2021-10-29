const User = require("../models/user");
const bcrypt = require('bcrypt');

function createUserList(users) {
  const userList = [];
  for (let user of users) {
    userList.push({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      gender: user.gender,
      email: user.email,
      contact: user.contact,
      dob: user.date_of_birth,
      address: user.address
    });
  }
  return userList;
}

exports.getUsers = (req, res) => {
  User.find({}).exec((error, users) => {
    if (error) return res.status(400).json({ error });
    if (users) {
      const userList = createUserList(users);
      return res.status(200).json({ userList });
    }
  });
};

exports.updateUser = async (req, res) => {
  let update_user = await User.findOneAndUpdate(
    { email: req.body.email },
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      contact: req.body.contact,
      gender: req.body.gender,
      address: req.body.address,
      date_of_birth: req.body.dob
    }
  );
  update_user.save((error, data) => {
    if (error) {
      return res.status(400).json({
        message: "Something Went Wrong"
      });
    }
    if (data) {
      return res.status(200).json({
        message: "User Updated Successfully"
      });
    }
  });
};

exports.addUser = (req, res) => {
  try{
    User.findOne({email: req.body.email })
    .exec( async (error,user) => {
        if(error) return res.status(400).json({error});
        if(user) return res.status(400).json({
            message: 'User already registered'
        });
        const { password } = req.body;
        const hash_password = await bcrypt.hash(password,10);
        const new_user = new User(
        {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          gender: req.body.gender,
          email: req.body.email,
          contact: req.body.contact,
          hash_password: hash_password,
          date_of_birth: req.body.dob,
          address: req.body.address
        });
        new_user.save((error, data) => {
          if (error) {
            console.log(error);
            return res.status(400).json({
              message: "Something Went Wrong"
            });
          }
          if (data) {
            return res.status(200).json({
              message: "User Registered Successfully"
            });
          }
          });
        });
  }catch(e){
    console.log(e);
    return res.status(500).json({
      message: "Error Creating User"
    });
  }
};

exports.deleteUsers = (req, res) => {
  // console.log(req.query.users)
  let _ids = req.query.users;
  User.deleteMany({ _id: { $in: _ids } }).then(function(){
    console.log("Data deleted"); // Success
    return res.status(200).json({
      message: "User Deleted Successfully"
    });
  }).catch(function(error){
      console.log(error); // Failure
      return res.status(400).json({
        message: "Something Went Wrong"
      });
  });
  // _ids.forEach(async (_id) => {
  //   await User.deleteOne({ _id });
  // });
};

exports.updateUser = async (req, res) => {
  let update_user = await User.findOneAndUpdate(
    { email: req.body.email },
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      contact: req.body.contact,
      gender: req.body.gender,
      address: req.body.address,
      date_of_birth: req.body.dob
    }
  );
  update_user.save((error, data) => {
    if (error) {
      return res.status(400).json({
        message: "Something Went Wrong"
      });
    }
    if (data) {
      return res.status(200).json({
        message: "User Updated Successfully"
      });
    }
  });
};
