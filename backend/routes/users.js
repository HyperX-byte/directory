const express = require("express");
const router = express.Router();
const { addUser, getUsers, updateUser, deleteUsers } = require("../controller/users");
const { validateAddUserRequest } = require("../validators/users");

router.post("/user", validateAddUserRequest, addUser);
router.put("/user", validateAddUserRequest, updateUser);
router.delete("/users", deleteUsers)
router.get("/users", getUsers);

module.exports = router;
