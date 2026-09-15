# `kill $!` after `pnpm exec next start` kills the wrapper, not the server — so every restart silently no-ops

## Problem
Three consecutive rounds of "edit CSS → rebuild → restart → screenshot" produced identical, unchanged screenshots. The conclusion drawn each time was that the CSS change had not worked, and two rounds of real debugging were spent on a non-existent styling bug. The change had been correct the whole time; the browser was being served a build from before any of it.

## Context that mattered
- `nohup pnpm exec next start -p 3462 & echo $!` reports the PID of the **pnpm wrapper**. pnpm then spawns `pnpm.cjs`, which spawns the actual `node .../next start` — three processes, and only the third holds the listening socket.
- `kill <wrapper-pid>` reaps the wrapper and leaves the grandchild bound to the port.
- The subsequent `next start` therefore fails with `EADDRINUSE`, but it was backgrounded with output redirected to a log nobody read, so it failed **silently** and the old server kept answering on :3462 with a 200.
- Compounding it: `pnpm build | grep ... | head -5` had earlier SIGPIPE'd the build partway through, leaving `.next` half-written — so even the served bytes were from a truncated build.

## Approach
1. Trust the served bytes over the source. Ask the page what it actually loaded: `document.styleSheets.map(s => s.href)`, then compare against `ls .next/static/css/`. A stylesheet hash the build directory does not contain proves the server is stale.
2. `lsof -nP -iTCP:3462 -sTCP:LISTEN` names the process that really owns the port. Its PID was not any PID `$!` had reported.
3. Restart **by port**, not by remembered PID, and assert afterwards: kill every PID from `lsof -t`, relaunch, then re-run `lsof` and `curl -w "%{http_code}"` and print both.
4. Never pipe a build into `head`; redirect to a log file and check the exit code.

## Dead ends
- Rebuilding again and re-screenshotting — reproduces the same stale result, and each clean round makes the phantom bug look more real.
- Raising CSS specificity to force the change through: there was nothing to force, the browser had never seen the file.

## Reusable rule
A backgrounded server restart is not done until you have re-read the port. Restart by port (`lsof -t`), not by the PID `$!` gave you, and print `lsof` + the HTTP status after every restart — a silent `EADDRINUSE` is indistinguishable from success until it costs you three debugging rounds. Same signature, different symptom, as [[2026-09-13-dev-server-500-after-a-production-build-shares-next]]: there a fresh build broke a running dev server; here a running `next start` outlived the build and served its predecessor.

## Verification
`lsof` showed PID 45872 still bound while `$!` had reported 45824/48228/48436/49015 across four "restarts". Killing by port and relaunching produced `{"bg":"#06100c"}` immediately. A `scratchpad/serve.sh` that restarts by port and asserts the listener afterwards replaced the ad-hoc command. Related: [[2026-09-15-unlayered-root-outranks-every-cascade-layer]].
