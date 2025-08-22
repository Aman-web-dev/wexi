export type Ticket = {
  _id: string;
  title: string;
  description: string;
  category: 'billing' | 'tech' | 'shipping' | 'other';
  status: 'open' | 'triaged' | 'waiting_human' | 'resolved' | 'closed';
  createdBy: string; 
  assignee?: string; 
  agentSuggestionId?: string; 
  createdAt: string;
  updatedAt: string;
  replies:any[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'user';
  token:string;
}

export type Article = {
  _id: string;
  title: string;
  body: string;
  tags: string[];
  status: 'draft' | 'published';
};