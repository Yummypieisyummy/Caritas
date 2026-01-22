export interface Organization {
    id: string;
    name: string;
    email: string;
    verified: boolean;
  }
  
  export interface User {
    id: string;
    org_id?: string;
    email: string;
  }
  
  export interface Post {
    id: string;
    org_id: string;
    type: string;
    title: string;
    status: string;
  }
  

// Possibly swapping this system with Zod library