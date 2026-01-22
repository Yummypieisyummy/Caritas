import * as usersService from "../services/users.service";

export const createUser = async (req, res) => {
  const user = await usersService.createUser(req.body);
  res.status(201).json(user);
};

export const getUserById = async (req, res) => {
  const user = await usersService.getUserById(req.params.id);
  res.json(user);
};

export const listUsers = async (req, res) => {
  const users = await usersService.listUsers();
  res.json(users);
};
