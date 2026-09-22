# A `/private/tmp` worktree gets gutted leaf-first — and it costs nothing, because the commits were never in it

## Problem
Resuming a website lane after a three-day pause, `/private/tmp/oc-site-beauty` still existed and the preview on :3462 still answered 200 with the newest copy on the page. But `app/`, `components/` and `lib/` were empty directories, every source file was gone, and `.git` had been removed. The preview was a zombie: `next start` holding a surviving `.next` for a build whose source no longer existed.

## Context that mattered
- macOS purges `/private/tmp` **leaf-first**, so directory skeletons and large untouched trees (`node_modules`, `.next`) can survive while the small files inside `app/` and `components/` are taken. The tree looks present until you `ls` a leaf.
- A git worktree keeps a `.git` **file** (a pointer to `<main>/.git/worktrees/<name>`), not a directory. Purge that one small file and every git command in the tree fails with `fatal: not a git repository` — which reads like catastrophic loss and is not.
- **The commits were never stored in the worktree.** Branch refs and objects live in the primary repo. `git log --oneline <branch>` from the main checkout is the one command that settles whether anything was actually lost.
- A running `next start` keeps serving from an open `.next` regardless of what happens to the source, so "the site still works" is not evidence the lane survived.

## Approach
1. Ask the primary repo, not the worktree: `git log --oneline -1 <branch>` and `git log --oneline <base>..<branch> | wc -l`. Twenty commits, head unchanged — nothing lost.
2. Confirm specific files exist *in the commit* rather than on disk: `git cat-file -e <branch>:components/home/where-you-stand.tsx`.
3. `git worktree prune` (git already marks the dead one `prunable`), then re-create on a **durable** path — `~/Desktop/oc-wt-<lane>`, matching the convention the other surviving worktrees already use — never back into `/private/tmp`.
4. `pnpm install --frozen-lockfile`, then run the full gate before trusting the restored tree.
5. Re-create the scratchpad tooling the same purge took, and repoint every hard-coded worktree path inside it.

## Dead ends
- Trying to repair the gutted tree in place by restoring `.git`: the source files are gone too, so a working `.git` just gives you an enormous phantom deletion diff against HEAD.
- Trusting the live preview as a health check. It was serving correct, current HTML from a build whose inputs had ceased to exist, which is the most convincing possible false negative.

## Reusable rule
Never keep a lane's only copy of anything in `/private/tmp` — worktrees there are disposable caches, not storage. Commit early and often so the primary repo holds the work, put long-lived worktrees under `~/Desktop/oc-wt-*`, and when resuming after any pause verify the BRANCH from the main checkout before looking at the worktree at all. A worktree is re-creatable in two commands; an uncommitted change in a purged one is not.

## Verification
Branch `fable/website-beauty-pass` intact at `9c6dece`, 20 commits over base `78897bc7`, both new components present via `git cat-file -e`. Re-created at `~/Desktop/oc-wt-website-beauty`, deps reinstalled, all ten release gates green in ci order, preview restarted and confirmed serving the current copy with `/demo` 404ing as expected. Related: [[2026-09-15-a-killed-pnpm-wrapper-leaves-the-real-server-listening]].
