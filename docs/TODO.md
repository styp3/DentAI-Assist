# Project TODO

## GitHub Auth (Deferred)
- Finish dedicated SSH setup for `styp3` account.
- Remaining step: register `~/.ssh/id_ed25519_styp3.pub` in GitHub > Settings > SSH and GPG keys.
- After registration, optionally switch repo remote back to SSH alias:
  - `git remote set-url origin git@github-styp3:styp3/DentAI-Assist.git`
- Until then, keep HTTPS remote/auth workflow.
