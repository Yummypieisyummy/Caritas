import { Request, Response } from 'express';
import * as orgsService from '../services/org.service';
import { asyncHandler } from '../utils/async_handler';

export const createOrg = async (req: Request, res: Response) => {
  const org = await orgsService.createOrg(req.body);
  res.status(201).json(org);
};

export const getOrgById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const org = await orgsService.getOrgById(id);
  res.json(org);
};

export const listOrgs = async (_req: Request, res: Response) => {
  const orgs = await orgsService.listOrgs();
  res.json(orgs);
};

export const submitVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { documents } = req.body;
    const verification = await orgsService.submitForVerification(
      id,
      documents,
    );

    res.status(201).json(verification);
  },
);

export const deleteOrganization = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await orgsService.deleteOrg(id);
    res.status(200).json({ message: 'Organization deleted successfully' });
  },
);

export const exportOrganizationData = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const data = await orgsService.exportOrgData(id);

    // Set response headers to trigger a JSON file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="organization_${id}_export.json"`,
    );

    // Send the JSON stringified data
    res.status(200).send(JSON.stringify(data, null, 2));
  },
);
