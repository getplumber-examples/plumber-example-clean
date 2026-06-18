# plumber-example-clean — target Plumber score: **A** 🟢

[![Plumber Score](https://img.shields.io/badge/Plumber%20Score-A-3fb950?style=for-the-badge&labelColor=2b2d42)](https://github.com/getplumber-examples/plumber-example-clean/actions/workflows/plumber.yml?query=branch%3Amain)

A deliberately *clean* GitHub Actions setup for the [Plumber](https://github.com/getplumber/plumber)
CI/CD compliance scanner. Every control in [`.plumber.yaml`](./.plumber.yaml) is enabled,
and this repository is built so that **none of them fire** — the expected result is an
**A** (final points 100).

This is one of three sibling repositories that share the *same* `.plumber.yaml` policy:

| Repo | Target score |
| --- | --- |
| `plumber-example-clean` | **A** — no findings |
| `plumber-example-moderate` | **C** — a realistic spread of medium/low issues |
| `plumber-example-critical` | **E** — most critical controls triggered |

## What makes it clean

- **Actions pinned by 40-char commit SHA** with `# vX.Y.Z` comments (real, current SHAs).
- **Least-privilege `permissions:`** declared on every workflow (`contents: read` by default).
- **`concurrency:`** on every workflow.
- **`persist-credentials: false`** on every `actions/checkout`.
- **Lockfile installs only** (`npm ci`) — no unpinned `npm install <pkg>`.
- **No injection surface** — no `${{ github.event.* }}` in `run:`, no `toJson(github)`, no
  `toJson(secrets)`, no writes to `$GITHUB_ENV` from user input.
- **Safe triggers** — `push` / `pull_request` only; no `pull_request_target`, `workflow_run`, etc.
- **Release hardening** — OIDC trusted publishing (`npm publish --provenance`, no static token),
  `environment: production` gate, cosign signature, no cross-branch cache.
- **Dockerfile base pinned by digest.**
- **Repo governance** — CodeQL SAST workflow, `dependabot.yml` with cooldowns and no insecure
  external code execution, and a `SECURITY.md`.

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
