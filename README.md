# GitHub Commit REST API.

Make `POST` request to `/api/commit` with body below

Body

```json
{
  "username": "your-github-username",
  "reponame": "your-repo-name",
  "filePath": "path-to-file-to-edit.txt",
  "content": "file content here",
  "message": "commit message here"
}
```

Response

```json
{
  "status": "success",
  "url": "https://github.com/<your-github-username>/<your-repo-name>/commit/<commit-sha>"
}
```

### How to make GitHub commit programatically.

What's hapening under the hood.

Reference: https://blog.apihero.run/how-to-programmatically-create-a-commit-on-github

**1. Fetch latest commit to get reference** [[Learn more](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#get-a-reference)]

```
GET /repos/{{owner}}/{{repo}}/git/ref/heads/{{branch}}
```

> Save `body.object.sha` from response as `reference_sha`.

**2. Create a tree** [[Learn more](https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28#create-a-tree)]

```
POST /repos/{{owner}}/{{repo}}/git/trees
```

Body

```json
{
  "base_tree": "{{reference_sha}}",
  "tree": [
    {
      "path": "{{filename}}",
      "mode": "100644",
      "type": "blob",
      "content": "hello world"
    }
  ]
}
```

> Save `body.sha` from response as `tree_sha`.

**3. Create a commit** [[Learn more](https://docs.github.com/en/rest/git/commits?apiVersion=2022-11-28#create-a-commit)]

```
POST /repos/{{owner}}/{{repo}}/git/commits
```

Body

```json
{
  "message": "commit message",
  "parents": ["{{reference_sha}}"],
  "tree": "{{tree_sha}}"
}
```

> Save `body.sha` from response as `commit_sha`.

**4. Update the reference** [[Learn more](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#update-a-reference)]

```
PATCH /repos/{{owner}}/{{repo}}/git/refs/heads/{{branch}}
```

Body

```json
{
  "sha": "{{commit_sha}}"
}
```

**DONE!** 🥳
