type TokenPayloadUser = { id: string };
type TokenPayloadOrg = { id: string; verified: boolean };
type TokenPayloadActiveOrg = { role: 'admin' | 'member' };

export function createTokenPayload(
  user: TokenPayloadUser,
  org: TokenPayloadOrg,
  activeOrg: TokenPayloadActiveOrg,
) {
  return {
    user_id: user.id,
    org_id: org.id,
    role: activeOrg.role,
    orgVerified: org.verified,
  };
}
