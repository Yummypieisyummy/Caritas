export function createTokenPayload(user: any, org: any, orgUser: any) {
  return {
    user_id: user.id,
    org_id: org.id,
    role: orgUser.role,
    orgVerified: org.verified,
  };
}
