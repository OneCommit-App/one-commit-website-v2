import Link from "next/link"

export const metadata = {
  title: "Terms of Service | OneCommit",
  description: "OneCommit terms of service governing your use of the platform.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0f1a14]">
      <nav className="flex justify-center px-4 pt-6 pb-8">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/logo.ico" alt="OneCommit logo" className="w-6 h-6 rounded-full" />
          <span className="text-white text-sm font-semibold">OneCommit</span>
        </Link>
      </nav>
      <main className="px-4 pb-16 flex justify-center">
        <article className="w-full max-w-2xl prose-sm">
          <h1 className="text-white text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-white/40 text-sm mb-8">Effective Date: September 3, 2025 &middot; Last Updated: September 3, 2025</p>

          {[
            { title: "1. Agreement to Terms", content: "These Terms of Service (\"Terms\") govern your access to and use of the OneCommit website, mobile application, and related services (collectively, the \"Service\") operated by OneCommit LLC (\"OneCommit,\" \"we,\" \"us,\" or \"our\"). By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy." },
            { title: "2. Eligibility; Accounts", content: "You must be at least 13 years old to use the Service. If you are 13-17, you represent that you have permission from a parent or legal guardian, who also agrees to these Terms on your behalf.\n\nYou agree to provide accurate, current, and complete information during registration and to keep it updated. You are responsible for safeguarding your login credentials and for all activity under your account." },
            { title: "3. Description of Service", content: "OneCommit is an athlete-first recruiting copilot. Features may include: (a) school matching based on athletic/academic/profile inputs; (b) email drafting and sending through your connected email account (Gmail/Outlook); (c) engagement analytics (opens, replies); (d) organizing recruiting tasks and timelines; (e) dashboards and recommendations.\n\nWe may add, change, or remove features at any time, including during beta. We may throttle or limit usage (e.g., email volume) to protect deliverability and platform integrity." },
            { title: "4. Connecting Email Accounts", content: "When you connect Gmail/Outlook, you authorize OneCommit to send recruiting emails on your behalf and to process limited metadata (send, open, reply) for analytics and follow-ups.\n\nWe do not store the full contents of your emails; see the Privacy Policy for details. You can disconnect at any time in settings or via your provider's security dashboard." },
            { title: "5. Student-Athlete Compliance", content: "You are solely responsible for understanding and complying with all applicable recruiting rules (e.g., NCAA/NAIA/NJCAA, high-school association rules, and institutional policies).\n\nOneCommit is not a legal advisor or compliance authority. We provide tools; we do not guarantee eligibility or outcomes." },
            { title: "6. Acceptable Use", content: "No unlawful, deceptive, harassing, hateful, or abusive content or conduct.\nNo spam or unsolicited mass outreach beyond reasonable recruiting purposes. Respect coach communication rules and quiet periods.\nNo attempts to breach security, probe systems, or disrupt the Service.\nNo scraping or reverse-engineering except as permitted by law.\nNo use that infringes third-party rights (IP, privacy, publicity, contract)." },
            { title: "7. Subscriptions, Trials, and Billing", content: "Certain features may require a paid subscription. Prices, features, and tiers may change with notice.\n\nTrials/promotions may be offered; unless canceled before trial end, your plan may convert to a paid subscription.\n\nTaxes may apply. You authorize us and our payment processors to charge your payment method for fees due. Unless a separate refund policy applies, fees are non-refundable except where required by law." },
            { title: "8. Coach Communications & Deliverability", content: "You understand email deliverability is influenced by many factors (sender reputation, content, recipient filters). We cannot guarantee delivery, opens, or replies.\n\nYou are responsible for the content of outreach and for honoring opt-out/\"do not contact\" requests." },
            { title: "9. Content; License to OneCommit", content: "You retain ownership of content you submit (metrics, profile, emails, preferences). You grant OneCommit a worldwide, non-exclusive, royalty-free license to use, reproduce, and display your content solely to provide and improve the Service.\n\nYou represent that you have all necessary rights to your content and that it does not violate law or third-party rights." },
            { title: "10. Intellectual Property", content: "The Service, including all software, designs, text, graphics, logos, and trademarks (excluding your content), are owned by or licensed to OneCommit and are protected by intellectual-property laws. No rights are granted except as expressly stated in these Terms." },
            { title: "11. Feedback", content: "You may submit ideas or suggestions. By doing so, you grant OneCommit a perpetual, irrevocable, worldwide, royalty-free license to use them without restriction or compensation." },
            { title: "12. Third-Party Services", content: "The Service may integrate third-party services (e.g., Gmail/Outlook, payment providers, cloud hosting, AI services). Your use of such services is subject to their terms and policies. We are not responsible for third-party actions or outages." },
            { title: "13. Beta Features; Disclaimers", content: "Beta or experimental features may be offered \"as is\" with reduced or different reliability and support.\n\nAI-assisted features generate drafts and recommendations; you must review for accuracy, appropriateness, and compliance before sending." },
            { title: "14. Disclaimers", content: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE,\" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR MEET YOUR REQUIREMENTS, NOR DO WE GUARANTEE ANY RECRUITING OUTCOMES." },
            { title: "15. Limitation of Liability", content: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL ONECOMMIT LLC BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES (INCLUDING LOSS OF DATA, PROFITS, OR GOODWILL), OR FOR DAMAGES EXCEEDING THE AMOUNTS YOU PAID TO ONECOMMIT IN THE 12 MONTHS PRECEDING THE CLAIM." },
            { title: "16. Indemnification", content: "You agree to defend, indemnify, and hold harmless OneCommit LLC and its affiliates, officers, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising out of or in any way connected with your use of the Service, your content, or your violation of these Terms or applicable law." },
            { title: "17. Termination", content: "We may suspend or terminate your access to the Service at any time, with or without notice, for conduct that we believe violates these Terms, harms other users, or risks the integrity of the platform. You may stop using the Service at any time. Certain provisions survive termination." },
            { title: "18. Governing Law; Venue", content: "These Terms are governed by the laws of the State of Ohio, without regard to conflict-of-laws principles. Subject to Section 19 (Arbitration), the exclusive venue for any action shall be the state or federal courts located in Ohio." },
            { title: "19. Dispute Resolution; Binding Arbitration", content: "Any dispute arising out of or relating to these Terms or the Service shall be resolved by binding arbitration administered by the American Arbitration Association under its applicable rules. YOU WAIVE THE RIGHT TO A JURY TRIAL OR TO PARTICIPATE IN A CLASS ACTION." },
            { title: "20. Changes to Terms", content: "We may modify the Service or these Terms at any time. When we make material changes, we will provide reasonable notice (e.g., in-app notice or email). Continued use after changes become effective constitutes acceptance of the updated Terms." },
            { title: "21. Severability; Assignment; Entire Agreement", content: "If any provision is held unenforceable, the remainder will remain in effect. You may not assign or transfer these Terms without our consent; we may assign them as part of a merger, acquisition, or sale of assets. These Terms, together with policies referenced herein, are the entire agreement between you and OneCommit regarding the Service." },
            { title: "22. Contact", content: "Questions about these Terms? Email admin@onecommit.us." },
          ].map((section, i) => (
            <div key={i} className="mb-6">
              <h2 className="text-white text-lg font-semibold mb-2">{section.title}</h2>
              <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}

          <div className="mt-10 pt-6 border-t border-white/[0.06]">
            <Link href="/" className="text-[#4ade80] text-sm font-medium hover:underline">&larr; Back to home</Link>
          </div>
        </article>
      </main>
    </div>
  )
}
