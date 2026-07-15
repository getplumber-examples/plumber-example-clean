# plumber-example-clean — target Plumber score: **A** 🟢

[![Plumber Score](https://score.getplumber.io/github.com/getplumber-examples/plumber-example-clean.svg)](https://score.getplumber.io/github.com/getplumber-examples/plumber-example-clean)

A deliberately *clean* GitHub Actions setup for the [Plumber](https://github.com/getplumber/plumber)
CI/CD compliance scanner. Every GitHub control that Plumber **v0.4.3** ships (23 of them) is
enabled in [`.plumber.yaml`](./.plumber.yaml), and this repository is built so that **none of
them fire** — the expected result is an **A** (100 final points).

This is one of three sibling repositories that share the *same* `.plumber.yaml` policy:

| Repo | Target score |
| --- | --- |
| `plumber-example-clean` | **A** — no findings |
| `plumber-example-moderate` | **C** — a realistic spread of medium/low issues |
| `plumber-example-critical` | **E** — most critical controls triggered |

## What makes it clean

- **Actions pinned by 40-char commit SHA** with `# vX.Y.Z` comments — real, current SHAs that
  exist upstream (clears impostor-commit ISSUE-707) and are pinned, not ambiguous `v3`-style
  tag/branch refs (clears ref-confusion ISSUE-402).
- **Least-privilege `permissions:`** declared on every workflow (`contents: read` by default).
- **`concurrency:`** on every workflow.
- **`persist-credentials: false`** on every `actions/checkout`.
- **Lockfile installs only** (`npm ci`) — no unpinned `npm install <pkg>`.
- **No injection surface** — no `${{ github.event.* }}` in `run:`, no `toJson(github)`, no
  `toJson(secrets)`, no writes to `$GITHUB_ENV` from user input.
- **Safe triggers** — `push` / `pull_request` only; no `pull_request_target`, `workflow_run`, etc.
- **Release hardening** — OIDC trusted publishing (`npm publish --provenance`, no static token),
  `environment: production` gate, cosign signature, and **no shared cache in the publish job**
  (setup-node's npm cache is cross-branch and can't be ref-scoped, so restoring it in a release
  build is cache-poisoning, ISSUE-705 — caching stays in `ci.yml`).
- **Dockerfile base pinned by digest.**
- **Required SAST** — a CodeQL workflow satisfies `workflowMustIncludeRequiredActions`. (The repo
  also ships a `dependabot.yml` with cooldowns and a `SECURITY.md` as good hygiene; the controls
  for those are still on Plumber's dev-side bench in v0.4.3, so they don't affect the score yet.)

## Run it

```bash
plumber analyze
```

## One-time setup to keep it clean with an API token

A few controls are API-backed and read repository settings via `gh`. To get a perfect A even
when `gh auth login` is active, protect the default branch (the `branchMustBeProtected` control
checks this):

```bash
gh api -X PUT repos/{owner}/plumber-example-clean/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f "required_status_checks[strict]=true" \
  -f "required_pull_request_reviews[require_code_owner_reviews]=true" \
  -F "required_pull_request_reviews[required_approving_review_count]=1" \
  -F "enforce_admins=true" \
  -F "restrictions=null"
```

Without a token, the API-backed controls abstain (no false positives) and the score is still A.
