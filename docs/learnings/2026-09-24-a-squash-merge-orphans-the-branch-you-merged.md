# A squash merge orphans the branch it came from, and the follow-up PR cannot merge

## Problem
`fable/website-beauty-pass` was squash-merged to `main` as PR #36. One commit was then added to that same branch and opened as PR #37. GitHub refused it: *"the merge commit cannot be cleanly created."* The branch was one commit ahead of a `main` that already contained all of its work — there was nothing to conflict about, and it would not merge.

## Context that mattered
- A squash merge writes a **single new commit** onto `main` with no parent link to any of the 32 commits it represents. Git therefore sees two histories that share only the old base, not the merge.
- The follow-up commit sits on top of 32 commits whose content is already in `main` under a different identity. Re-merging replays all of them against a tree that already has their effects, which is what "cannot be cleanly created" is describing.
- This is invisible until the second PR. The first merge succeeds and looks completely normal.
- `git merge origin/main` into the branch does not rescue it — that produces a merge whose diff re-applies the squashed work.

## Approach
1. Do not try to repair the squashed branch. Close the PR with a reason.
2. `git worktree add <path> -b <new-branch> origin/main` — branch fresh from the post-merge `main`.
3. Re-apply the single change on top of it. For one small edit that is a re-edit, not a cherry-pick: cherry-picking the commit drags its parent context back in.
4. Reinstall, re-run the gate, push, PR. It merges cleanly because the history has one root.

## Dead ends
- `gh pr merge --auto`: the suggestion in GitHub's own error message. It only defers the same failure.
- Rebasing the branch onto the new `main`: replays 32 already-landed commits, producing a conflict per file for no benefit.
- Reverting and redoing the squash as a merge commit: rewrites published history on `main` for a cosmetic gain.

## Reusable rule
After a squash merge, treat the source branch as **spent**. Anything further branches from the updated `main`, never from the branch that was squashed. Budget one fresh worktree per follow-up fix; it costs two commands and avoids a class of conflict that has no clean resolution. If a branch will need several follow-ups, merge it with a real merge commit instead of a squash, and take the noisier history knowingly.

## Verification
PR #37 refused on `fable/website-beauty-pass` after #36 squash-merged. Closed it, branched `fable/website-audience-backlink` from `origin/main` (`ce74934`), re-applied the one edit, all ten gates green, merged as #38 without a conflict, deployed in ~75s. Related: [[2026-09-22-a-purged-tmp-worktree-is-recoverable-because-the-commits-never-lived-there]].
