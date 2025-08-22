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
};

export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'agent' | 'user';
  createdAt: string; 
}

export type Article = {
  _id: string;
  title: string;
  body: string;
  tags: string[];
  status: 'draft' | 'published';
};