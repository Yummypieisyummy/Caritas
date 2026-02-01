-- Needed for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUM TYPES
 
CREATE TYPE post_type AS ENUM (
    'volunteer_request',
    'volunteer_offer',
    'item_request',
    'item_offer'
);

CREATE TYPE post_status AS ENUM (
    'active',
    'closed'
);

CREATE TYPE verification_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);

CREATE TYPE org_user_role AS ENUM (
    'owner',
    'admin'
);
 
-- ORGANIZATIONS
 
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    verified BOOLEAN DEFAULT false,
    pfp_url TEXT,
    banner_url TEXT,
    contact_info JSONB,
    about TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- USERS

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    email TEXT UNIQUE NOT NULL,
    email_verified_at TIMESTAMP WITHOUT TIME ZONE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- ORG_USERS (Many-to-Many)

CREATE TABLE org_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role org_user_role NOT NULL,
    UNIQUE (org_id, user_id)
);
 
-- ORGANIZATION VERIFICATIONS
 
CREATE TABLE organization_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    submitted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    reviewed_at TIMESTAMP WITHOUT TIME ZONE,
    status verification_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    documents JSONB
);

-- POSTS

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type post_type NOT NULL,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    long_description TEXT,
    location TEXT,
    date_start DATE,
    date_end DATE,
    status post_status NOT NULL DEFAULT 'active',
    interested INT DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- TAGS
 
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    color TEXT,
    display BOOLEAN DEFAULT false
);
 
-- TAG_MAP (Post ↔ Tags)
 
CREATE TABLE tag_map (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- INDEXES

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orgs_email ON organizations(email);
CREATE INDEX idx_posts_org_id ON posts(org_id);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_tag_map_tag_id ON tag_map(tag_id);
