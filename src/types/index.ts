export interface RefResponse {
  ref: string;
  node_id: string;
  url: string;
  object: Object;
}

interface Object {
  sha: string;
  type: string;
  url: string;
}

export interface TreeResponse {
  sha: string;
  url: string;
  tree: Tree[];
  truncated: boolean;
}

interface Tree {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
}

export interface CommitResponse {
  sha: string;
  node_id: string;
  url: string;
  html_url: string;
  author: Author;
  committer: Committer;
  tree: CommitTree;
  message: string;
  parents: Parent[];
  verification: Verification;
}

interface Author {
  name: string;
  email: string;
  date: string;
}

interface Committer {
  name: string;
  email: string;
  date: string;
}

interface CommitTree {
  sha: string;
  url: string;
}

interface Parent {
  sha: string;
  url: string;
  html_url: string;
}

interface Verification {
  verified: boolean;
  reason: string;
  signature: any;
  payload: any;
}
