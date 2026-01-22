import * as orgsService from "../services/org.service";

export const createOrg = async (req, res) => {
  const org = await orgsService.createOrg(req.body);
  res.status(201).json(org);
};

export const getOrgById = async (req, res) => {
  const org = await orgsService.getOrgById(req.params.id);
  res.json(org);
};

export const listOrgs = async (req, res) => {
  const orgs = await orgsService.listOrgs();
  res.json(orgs);
};
