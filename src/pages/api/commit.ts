import { CommitResponse, RefResponse, TreeResponse } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    status: string;
    url: string;
  }>
) {
  const { content, message, filePath, username, reponame } = req.body;
  const baseUrl = `${process.env.GITHUB_API_URL}/repos/${username}/${reponame}/git`;
  const headers = {
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${token}`,
  };

  // Get latest commit ref
  const refResponse = await fetch(`${baseUrl}/ref/heads/main`, {
    method: "get",
    headers,
  });
  const refData = (await refResponse.json()) as RefResponse;

  // Create a tree
  const treeResponse = await fetch(`${baseUrl}/trees`, {
    method: "post",
    headers,
    body: JSON.stringify({
      base_tree: refData.object.sha,
      tree: [
        {
          path: filePath,
          mode: "100644",
          type: "blob",
          content,
        },
      ],
    }),
  });

  const treeData = (await treeResponse.json()) as TreeResponse;

  // Create a commit
  const commitResponse = await fetch(`${baseUrl}/commits`, {
    method: "post",
    headers,
    body: JSON.stringify({
      message,
      parents: [refData.object.sha],
      tree: treeData.sha,
    }),
  });

  const commitData = (await commitResponse.json()) as CommitResponse;

  // Update HEAD reference
  const updateRefResponse = await fetch(`${baseUrl}/refs/heads/main`, {
    method: "patch",
    headers,
    body: JSON.stringify({ sha: commitData.sha }),
  });

  const updateRefData = (await updateRefResponse.json()) as RefResponse;

  res.status(200).json({
    status: "success",
    url: `https://github.com/${username}/${reponame}/commit/${updateRefData.object.sha}`,
  });
}
