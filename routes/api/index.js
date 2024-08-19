const router = require("express").Router();
const usersRoute = require("./usersRoutes");
const { Thought, User } = require("../../models");

router.use("/users", usersRoute);


module.exports = router;