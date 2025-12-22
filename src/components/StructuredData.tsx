export function WebsiteStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DEMISMATCH",
    "url": "https://demismatch.com",
    "description": "A framework explaining why modern humans suffer and what conditions would let them thrive. Evolutionary mismatch theory applied to mental health, technology, and social design.",
    "keywords": [
      "evolutionary mismatch",
      "evolutionary psychology",
      "mental health",
      "human thriving",
      "Dunbar's number",
      "tribe",
      "EEA",
      "Environment of Evolutionary Adaptedness",
      "demismatch",
      "proxy trap",
      "open loops",
      "parasocial relationships"
    ],
    "author": {
      "@type": "Organization",
      "name": "DEMISMATCH",
      "url": "https://demismatch.com"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://demismatch.com/faq",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function FrameworkStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "DEMISMATCH Framework: Evolutionary Mismatch Theory for Human Thriving",
    "description": "A comprehensive framework synthesizing evolutionary psychology, anthropology, and neuroscience to explain human suffering as environmental mismatch rather than individual pathology.",
    "author": {
      "@type": "Organization",
      "name": "DEMISMATCH"
    },
    "publisher": {
      "@type": "Organization",
      "name": "DEMISMATCH",
      "url": "https://demismatch.com"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://demismatch.com/framework"
    },
    "about": [
      {
        "@type": "Thing",
        "name": "Evolutionary Psychology"
      },
      {
        "@type": "Thing",
        "name": "Evolutionary Mismatch"
      },
      {
        "@type": "Thing",
        "name": "Mental Health"
      },
      {
        "@type": "Thing",
        "name": "Human Nature"
      }
    ],
    "keywords": "evolutionary mismatch, EEA, Dunbar's number, tribe, proxy, open loop, demismatch, fish on land, signal vs symptom"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function FAQStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is evolutionary mismatch?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your brain was built for conditions that no longer exist. 300,000 years of consistent environment, then everything changed. The hardware works perfectly. The environment doesn't match."
        }
      },
      {
        "@type": "Question",
        "name": "Why do I feel so bad?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You're a fish on land. Your suffering isn't malfunction—it's accurate biological response to an environment that violates every condition your species requires."
        }
      },
      {
        "@type": "Question",
        "name": "What is the EEA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Environment of Evolutionary Adaptedness. The conditions humans evolved in: small bands, known faces, daily closure, visible contribution, physical life. The spec sheet for human thriving."
        }
      },
      {
        "@type": "Question",
        "name": "What are Dunbar's numbers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hard cognitive limits on relationships: 5 intimate → 15 close → 50 friends → 150 meaningful. Beyond 150, people become categories."
        }
      },
      {
        "@type": "Question",
        "name": "What is a proxy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Substitute that hijacks biological drive without satisfying need. Momentary relief, increasing need. Salt water for thirst."
        }
      },
      {
        "@type": "Question",
        "name": "What is an open loop?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Problem that cannot be resolved through action. Chronic emotion without resolution. Modern life is an open loop factory."
        }
      },
      {
        "@type": "Question",
        "name": "What is demismatch?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Return to baseline human thriving. Conscious alignment of environment with biology. Not returning to past—building forward."
        }
      },
      {
        "@type": "Question",
        "name": "Why is my suffering profitable?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A fully satisfied human is a terrible customer. Every unmet need is a market. The exploitation economy requires your mismatch."
        }
      },
      {
        "@type": "Question",
        "name": "What are parasocial relationships?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "One-way emotional bonds with people who don't know you exist. Every influencer you follow takes a slot from your 150. They can't reciprocate."
        }
      },
      {
        "@type": "Question",
        "name": "What's the core claim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most suffering labeled 'mental illness' is accurate signal, not broken brain. Fix the environment, not the person."
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DEMISMATCH",
    "url": "https://demismatch.com",
    "logo": "https://demismatch.com/icon-512.png",
    "description": "Open-source framework for understanding human suffering through evolutionary mismatch theory.",
    "sameAs": [
      "https://github.com/MaartenRischen/demismatch"
    ],
    "foundingDate": "2024",
    "knowsAbout": [
      "Evolutionary Psychology",
      "Evolutionary Mismatch",
      "Dunbar's Number",
      "Mental Health",
      "Human Thriving",
      "Anthropology"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
