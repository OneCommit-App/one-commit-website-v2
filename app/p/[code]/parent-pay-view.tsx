"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  CalendarCheck,
  CircleAlert,
  CircleCheck,
  Link2Off,
  LoaderCircle,
  Lock,
  MessageSquareReply,
  Receipt,
  RotateCw,
  Search,
  Sparkles,
  UserCheck,
} from "lucide-react"
import { eyebrow, focusRing, pillPrimary } from "@/components/home/tokens"
import {
  formatDay,
  lookupLink,
  monthsUntil,
  normalizeCode,
  startCheckout,
  type ParentPayApi,
  type PassPrice,
} from "@/lib/parent-pay"

type Props = {
  rawCode: string
  paid: boolean
  apiBaseUrl: string
  apiKey: string
}

type View =
  | { name: "loading" }
  | { name: "payable"; firstName: string | null; endsOn: string; price: PassPrice }
  | { name: "covered"; firstName: string | null; endsOn: string | null }
  | { name: "unavailable" }
  | { name: "rate_limited" }
  | { name: "error" }
  | { name: "paid"; status: "confirmed" | "pending" | "unknown"; firstName: string | null; endsOn: string | null }

type Notice = "attest" | "processing" | "rate_limited" | "checkout_failed"

/* After Stripe sends the parent back, the pass lands when Stripe's webhook
   does. Ask a few times (inside the API's 30-a-minute limiter), then stop. */
const PAID_POLLS = 8
const PAID_POLL_MS = 4_000

const h1 = "text-balance text-[2rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink focus:outline-none sm:text-[2.5rem]"
const lede = "mt-3 text-pretty text-[17px] leading-[1.5] text-ink-soft"
const card = "oc-raised rounded-card bg-card p-5 shadow-lift ring-1 ring-line sm:p-6"
const iconDot = "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-soft text-green"
const enter = "animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out-quint"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function named(firstName: string | null) {
  return {
    /** Sentence start: "Avery" / "Your athlete". */
    subject: firstName ?? "Your athlete",
    /** Mid-sentence possessive: "Avery’s" / "your athlete’s". */
    possessive: firstName ? `${firstName}’s` : "your athlete’s",
  }
}

export default function ParentPayView({ rawCode, paid, apiBaseUrl, apiKey }: Props) {
  const code = useMemo(() => normalizeCode(rawCode), [rawCode])
  const api = useMemo<ParentPayApi>(() => ({ baseUrl: apiBaseUrl, apiKey }), [apiBaseUrl, apiKey])
  const [view, setView] = useState<View>(() =>
    paid ? { name: "paid", status: "pending", firstName: null, endsOn: null } : { name: "loading" },
  )
  const [attempt, setAttempt] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const settled = useRef(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!paid) {
        const result = await lookupLink(api, code)
        if (cancelled) return
        switch (result.kind) {
          case "payable":
            setView({ name: "payable", firstName: result.firstName, endsOn: result.endsOn, price: result.price })
            return
          case "covered":
            setView({ name: "covered", firstName: result.firstName, endsOn: result.endsOn })
            return
          case "unavailable":
            setView({ name: "unavailable" })
            return
          case "rate_limited":
            setView({ name: "rate_limited" })
            return
          default:
            setView({ name: "error" })
            return
        }
      }

      let firstName: string | null = null
      for (let poll = 0; poll < PAID_POLLS; poll += 1) {
        const result = await lookupLink(api, code)
        if (cancelled) return
        if (result.kind === "covered") {
          setView({ name: "paid", status: "confirmed", firstName: result.firstName, endsOn: result.endsOn })
          return
        }
        if (result.kind !== "payable") break
        firstName = result.firstName
        setView({ name: "paid", status: "pending", firstName, endsOn: null })
        await sleep(PAID_POLL_MS)
        if (cancelled) return
      }
      setView({ name: "paid", status: "unknown", firstName, endsOn: null })
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [api, code, paid, attempt])

  // Move focus to the new heading once the page has an answer, so a screen
  // reader announces it. Not on the first paint.
  useEffect(() => {
    if (view.name === "loading" || (view.name === "paid" && view.status === "pending")) return
    if (!settled.current) {
      settled.current = true
      return
    }
    headingRef.current?.focus({ preventScroll: true })
  }, [view])

  const retry = () => {
    setView({ name: "loading" })
    setAttempt((value) => value + 1)
  }

  switch (view.name) {
    case "loading":
      return <Loading />
    case "payable":
      return <Payable view={view} api={api} code={code} headingRef={headingRef} onView={setView} />
    case "covered":
      return (
        <Message
          headingRef={headingRef}
          icon={<CircleCheck size={22} aria-hidden="true" />}
          tone="green"
          eyebrowText="Recruiting Pass"
          title="Already covered."
          body={`${named(view.firstName).subject} is covered${view.endsOn ? ` through ${formatDay(view.endsOn)}` : ""}. There’s nothing to pay.`}
        />
      )
    case "unavailable":
      return (
        <Message
          headingRef={headingRef}
          icon={<Link2Off size={22} aria-hidden="true" />}
          tone="neutral"
          title="This link isn’t active."
          body="Ask your athlete to send a new one from the OneCommit app."
        />
      )
    case "rate_limited":
      return (
        <Message
          headingRef={headingRef}
          icon={<CircleAlert size={22} aria-hidden="true" />}
          tone="amber"
          title="Too many tries."
          body="Wait a minute, then try again."
          action={<RetryButton onClick={retry} />}
        />
      )
    case "error":
      return (
        <Message
          headingRef={headingRef}
          icon={<CircleAlert size={22} aria-hidden="true" />}
          tone="amber"
          title="This page didn’t load."
          body="Nothing was charged. Try again in a moment."
          action={<RetryButton onClick={retry} />}
        />
      )
    case "paid":
      return <Paid view={view} rawCode={rawCode} headingRef={headingRef} />
  }
}

function Loading() {
  return (
    <div aria-busy="true">
      <p className="sr-only" role="status">
        Loading
      </p>
      <div aria-hidden="true" className="animate-pulse">
        <div className="h-3.5 w-32 rounded-full bg-ink/10" />
        <div className="mt-5 h-9 w-11/12 rounded-xl bg-ink/10" />
        <div className="mt-3 h-5 w-2/3 rounded-lg bg-ink/[0.07]" />
        <div className="mt-7 h-72 rounded-card bg-ink/[0.06]" />
        <div className="mt-6 h-14 rounded-2xl bg-ink/[0.06]" />
        <div className="mt-4 h-14 rounded-full bg-ink/10" />
      </div>
    </div>
  )
}

type PayableProps = {
  view: Extract<View, { name: "payable" }>
  api: ParentPayApi
  code: string | null
  headingRef: React.RefObject<HTMLHeadingElement | null>
  onView: (view: View) => void
}

function Payable({ view, api, code, headingRef, onView }: PayableProps) {
  const [attested, setAttested] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [grown, setGrown] = useState(false)
  const checkboxRef = useRef<HTMLInputElement>(null)
  const who = named(view.firstName)
  const months = monthsUntil(view.endsOn)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setGrown(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  // Back from Stripe through the back/forward cache: the button must work again.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setBusy(false)
    }
    window.addEventListener("pageshow", onPageShow)
    return () => window.removeEventListener("pageshow", onPageShow)
  }, [])

  async function pay(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    if (!attested) {
      setNotice("attest")
      checkboxRef.current?.focus()
      return
    }
    setBusy(true)
    setNotice(null)
    const result = await startCheckout(api, code, true)
    switch (result.kind) {
      case "redirect":
        window.location.assign(result.url)
        return
      case "covered":
        onView({ name: "covered", firstName: view.firstName, endsOn: result.endsOn })
        return
      case "unavailable":
        onView({ name: "unavailable" })
        return
      case "processing":
        setNotice("processing")
        break
      case "rate_limited":
        setNotice("rate_limited")
        break
      case "attestation_required":
        setNotice("attest")
        break
      default:
        setNotice("checkout_failed")
    }
    setBusy(false)
  }

  const noticeText: Record<Notice, string> = {
    attest: `Please confirm you’re ${who.possessive} parent or guardian.`,
    processing: "This payment is going through. Check back in a minute.",
    rate_limited: "Too many tries. Wait a minute, then try again.",
    checkout_failed: "Checkout didn’t open. Nothing was charged. Try again.",
  }

  const rows: { icon: React.ReactNode; text: string; badge?: string; sub?: string }[] = [
    { icon: <Search size={17} aria-hidden="true" />, text: "Finds schools that fit" },
    {
      icon: <Sparkles size={17} aria-hidden="true" />,
      text: "Riley drafts coach emails",
      badge: "AI coach",
      sub: `${who.subject} approves each one`,
    },
    { icon: <MessageSquareReply size={17} aria-hidden="true" />, text: "Tracks coach replies" },
  ]

  return (
    <div className={enter}>
      <p className={eyebrow}>Recruiting Pass</p>
      <h1 ref={headingRef} tabIndex={-1} className={`mt-4 ${h1}`}>
        Cover {who.possessive} recruiting app.
      </h1>
      <p className={lede}>One payment. Nothing renews.</p>

      <section aria-label="What the pass covers" className={`mt-7 ${card}`}>
        {/* Large text: the price shrinks to fit a narrow screen and "once"
            wraps under it, instead of running off the edge. */}
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-2">
          <span className="text-[length:min(2.75rem,16vw)] font-bold leading-none tracking-[-0.035em] text-ink tabular-nums">
            {view.price.display}
          </span>
          <span className="rounded-full bg-green-soft px-2.5 py-1 text-[13px] font-semibold text-green">once</span>
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-[13px] font-medium">
            <span className="text-ink-soft">Today</span>
            <span className="rounded-full bg-canvas-subtle px-2.5 py-0.5 font-semibold text-ink ring-1 ring-inset ring-line">
              {months} {months === 1 ? "month" : "months"}
            </span>
            <span className="text-ink">{formatDay(view.endsOn)}</span>
          </div>
          <div
            role="img"
            aria-label={`Covered from today through ${formatDay(view.endsOn)}`}
            className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-canvas-subtle ring-1 ring-inset ring-line"
          >
            <div
              className="h-full w-full origin-left rounded-full bg-gradient-to-r from-green to-green-mid transition-transform duration-1000 ease-out-quint"
              style={{ transform: grown ? "scaleX(1)" : "scaleX(0)" }}
            />
          </div>
        </div>

        <ul className="mt-6 space-y-3.5 border-t border-line pt-5">
          {rows.map((row) => (
            <li key={row.text} className="flex items-center gap-3">
              <span className={iconDot}>{row.icon}</span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] font-medium leading-snug text-ink">
                  {row.text}
                  {row.badge ? (
                    <span className="rounded-md bg-orange-soft px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-clay">
                      {row.badge}
                    </span>
                  ) : null}
                </span>
                {row.sub ? <span className="mt-0.5 block text-[14px] leading-snug text-ink-soft">{row.sub}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <form onSubmit={pay} noValidate className="mt-6">
        <label
          className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl bg-card px-4 py-3 ring-1 transition-colors ${
            notice === "attest" ? "ring-2 ring-amber" : "ring-line hover:ring-ink/20"
          }`}
        >
          <input
            ref={checkboxRef}
            type="checkbox"
            name="guardian"
            checked={attested}
            onChange={(event) => {
              setAttested(event.target.checked)
              if (event.target.checked && notice === "attest") setNotice(null)
            }}
            aria-invalid={notice === "attest" ? true : undefined}
            aria-describedby={notice ? "pay-notice" : undefined}
            className={`h-5 w-5 shrink-0 cursor-pointer accent-green ${focusRing}`}
          />
          <span className="text-[16px] font-medium leading-snug text-ink">
            I’m {who.possessive} parent or guardian.
          </span>
        </label>

        {notice ? (
          <p id="pay-notice" role="alert" className="mt-3 flex items-start gap-2 text-[15px] leading-snug text-amber-ink">
            <CircleAlert size={17} aria-hidden="true" className="mt-0.5 shrink-0" />
            {noticeText[notice]}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className={`${pillPrimary} mt-4 h-14 w-full text-[16px] disabled:cursor-progress disabled:opacity-80`}
        >
          {busy ? (
            <>
              <LoaderCircle size={18} aria-hidden="true" className="animate-spin" />
              Opening checkout
            </>
          ) : (
            <>Pay {view.price.display}</>
          )}
        </button>

        <div className="mt-4 space-y-1 text-center text-[13px] leading-relaxed text-ink-soft">
          <p className="flex items-center justify-center gap-1.5">
            <Lock size={13} aria-hidden="true" className="text-green" />
            Secure checkout by Stripe. We never see your card.
          </p>
          <p>No account needed · US only</p>
        </div>
      </form>
    </div>
  )
}

type MessageProps = {
  headingRef: React.RefObject<HTMLHeadingElement | null>
  icon: React.ReactNode
  tone: "green" | "amber" | "neutral"
  eyebrowText?: string
  title: string
  body: string
  action?: React.ReactNode
}

const toneClass: Record<MessageProps["tone"], string> = {
  green: "bg-green-soft text-green",
  amber: "bg-orange-soft text-clay",
  neutral: "bg-canvas-subtle text-ink-soft ring-1 ring-inset ring-line",
}

function Message({ headingRef, icon, tone, eyebrowText, title, body, action }: MessageProps) {
  return (
    <div className={`pt-6 sm:pt-10 ${enter}`}>
      <span className={`flex h-12 w-12 items-center justify-center rounded-full ${toneClass[tone]}`}>{icon}</span>
      {eyebrowText ? <p className={`mt-6 ${eyebrow}`}>{eyebrowText}</p> : null}
      <h1 ref={headingRef} tabIndex={-1} className={`${eyebrowText ? "mt-3" : "mt-6"} ${h1}`}>
        {title}
      </h1>
      <p className={lede}>{body}</p>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  )
}

function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`${pillPrimary} w-full sm:w-auto`}>
      <RotateCw size={16} aria-hidden="true" />
      Try again
    </button>
  )
}

type PaidProps = {
  view: Extract<View, { name: "paid" }>
  rawCode: string
  headingRef: React.RefObject<HTMLHeadingElement | null>
}

function Paid({ view, rawCode, headingRef }: PaidProps) {
  const who = named(view.firstName)
  const confirmed = view.status === "confirmed"
  // "unknown": the link stopped answering, or the pass hasn't landed after
  // ~30 seconds. That can be a refund (paid after the athlete committed) or a
  // bank payment still on its way, so say nothing that claims the pass landed.
  const unsure = view.status === "unknown"
  const steps = [
    { icon: <Receipt size={17} aria-hidden="true" />, text: "Stripe emails your receipt." },
    {
      icon: <UserCheck size={17} aria-hidden="true" />,
      text: unsure ? `The pass goes to ${who.possessive} account.` : `The pass goes straight to ${who.possessive} account.`,
    },
    {
      icon: <CalendarCheck size={17} aria-hidden="true" />,
      text: unsure ? "Nothing renews." : "Nothing renews. There’s nothing else to do.",
    },
  ]

  return (
    <div className={`pt-6 sm:pt-10 ${enter}`}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-soft text-green">
        <CircleCheck size={22} aria-hidden="true" />
      </span>
      <p className={`mt-6 ${eyebrow}`}>Recruiting Pass</p>
      <h1 ref={headingRef} tabIndex={-1} className={`mt-3 ${h1}`}>
        {confirmed ? "You’re all set." : "Thank you."}
      </h1>

      <div role="status" className="mt-4 min-h-8">
        {confirmed && view.endsOn ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-green-soft px-3.5 py-1.5 text-[15px] font-semibold text-green">
            <CalendarCheck size={16} aria-hidden="true" />
            {who.subject} is covered through {formatDay(view.endsOn)}
          </span>
        ) : view.status === "pending" ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-canvas-subtle px-3.5 py-1.5 text-[15px] font-medium text-ink-soft ring-1 ring-inset ring-line">
            <LoaderCircle size={16} aria-hidden="true" className="animate-spin" />
            Finishing up
          </span>
        ) : view.status === "unknown" ? (
          <p className="text-[17px] leading-[1.5] text-ink-soft">This can take a few minutes.</p>
        ) : null}
      </div>

      {unsure ? <p className="mt-6 text-[15px] font-medium text-ink-soft">If the payment went through:</p> : null}
      <ul className={`${unsure ? "mt-3" : "mt-6"} space-y-4 ${card}`}>
        {steps.map((step) => (
          <li key={step.text} className="flex items-center gap-3">
            <span className={iconDot}>{step.icon}</span>
            <span className="text-[15px] font-medium leading-snug text-ink">{step.text}</span>
          </li>
        ))}
      </ul>

      {confirmed ? null : (
        <p className="mt-6 text-center text-[14px] text-ink-soft">
          Didn’t finish paying?{" "}
          <a
            href={`/p/${encodeURIComponent(rawCode)}`}
            className={`inline-flex min-h-11 items-center rounded-md px-1 font-semibold text-green underline decoration-green/30 underline-offset-[3px] hover:text-green-mid ${focusRing}`}
          >
            Go back
          </a>
        </p>
      )}
    </div>
  )
}
