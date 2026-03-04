export default function JsonLd() {
  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "OneCommit",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description:
      "Self-service recruiting copilot for high school Track & Field athletes. Match to colleges, generate outreach emails, and track coach replies.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free during beta",
    },
  }

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is OneCommit and who is it for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "OneCommit is a self-service recruiting copilot built for high school Track & Field athletes. It helps you find matched colleges, generate personalized outreach emails, and track coach replies — all in one place.",
        },
      },
      {
        "@type": "Question",
        name: "How does the school matching work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "When you create your profile, you enter your times/marks, GPA, SAT scores, and what you care about in a college. OneCommit analyzes this against hundreds of programs and generates a match percentage for each school, labeled as Reach, Target, or Foundational.",
        },
      },
      {
        "@type": "Question",
        name: "Do the emails come from my own inbox?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. OneCommit integrates with your Gmail or Outlook account. Emails go out from your real email address, so coaches see a genuine person reaching out — not a third-party platform.",
        },
      },
      {
        "@type": "Question",
        name: "Will coaches know the email was AI-generated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. OneCommit generates emails in your voice based on your profile — your times, your story, your school preferences. The email comes from your inbox and reads like you wrote it.",
        },
      },
      {
        "@type": "Question",
        name: "How much does OneCommit cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "OneCommit is free during the beta period. After the beta, pricing will be significantly more affordable than traditional recruiting services.",
        },
      },
      {
        "@type": "Question",
        name: "How is this different from NCSA or CaptainU?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Traditional services create a profile and wait for coaches to find you. OneCommit flips the script — you're the one reaching out, from your own email, with personalized messages. You control the timeline, strategy, and conversation.",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  )
}
