import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { eyebrow } from "@/components/home/tokens"
import { textLink } from "@/components/routes/tokens"

export type LegalSection = {
  title: string
  content: ReactNode
}

type LegalArticleProps = {
  title: string
  /** Effective and last-updated line, rendered verbatim under the title. */
  meta: string
  idPrefix: string
  sections: LegalSection[]
  /** Optional note after the sections, such as a link to a related page. */
  children?: ReactNode
}

/**
 * Reading layout for the policies: one h1, one h2 per section, a ~68ch measure,
 * and the policy text rendered exactly as it is stored (pre-line keeps its breaks).
 */
export default function LegalArticle({ title, meta, idPrefix, sections, children }: LegalArticleProps) {
  return (
    <article className="mx-auto w-full max-w-[68ch]">
      <div className="border-b border-line pb-8">
        <p className={eyebrow}>Legal</p>
        <h1 className="mt-4 text-balance text-[2.25rem] font-bold leading-[1.06] tracking-[-0.03em] text-ink sm:text-[2.75rem]">
          {title}
        </h1>
        <p className="mt-4 text-[15px] text-ink-soft">{meta}</p>
      </div>

      {sections.map((section, i) => (
        <section key={section.title} aria-labelledby={`${idPrefix}-section-${i}`} className="mt-10 scroll-mt-24">
          <h2 id={`${idPrefix}-section-${i}`} className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
            {section.title}
          </h2>
          {typeof section.content === "string" ? (
            <p className="mt-3 whitespace-pre-line text-[17px] leading-[1.7] text-ink-soft">{section.content}</p>
          ) : (
            <div className="mt-3 whitespace-pre-line text-[17px] leading-[1.7] text-ink-soft">{section.content}</div>
          )}
        </section>
      ))}

      {children ? <div className="mt-10 text-[17px] leading-[1.7] text-ink-soft">{children}</div> : null}

      <div className="mt-14 border-t border-line pt-6">
        <Link href="/" className={textLink}>
          <ArrowLeft size={15} aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </article>
  )
}
