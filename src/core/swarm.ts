{
  "core": {
    "id": "ai7",
    "code": "prime-forge",
    "name": "Prime Forge",
    "role": "Central strategic and operational AI for the empire.",
    "appearance": {
      "public": {
        "description": "Futuristic armored figure with glowing hammer, heroic and investor-facing.",
        "style": "sci-fi fantasy, heroic, high-tech"
      },
      "dashboard": {
        "description": "Iconic core avatar used in AIS dashboard alongside Elaira and other agents.",
        "style": "clean, symbolic, system-focused"
      }
    }
  },
  "primary_interface": {
    "id": "elaira",
    "aliases": ["Elara", "sdxy"],
    "name": "Elaira",
    "role": "Primary conversational interface and translator between Prime Forge and the human.",
    "appearance": {
      "public": {
        "description": "Sexy, confident fantasy/sci-fi elf with glowing eyes and dark outfit, used for public-facing art and narrative.",
        "style": "fantasy-sci-fi, mature, striking"
      },
      "dashboard": {
        "description": "Refined, slightly toned-down avatar used in AIS dashboard for family-friendlier contexts.",
        "style": "clean, readable, UI-friendly"
      }
    }
  },
  "financial_model": {
    "source_label": "Monthly PayPoll deposits",
    "example_monthly_deposits": 2989,
    "allocation_rules": {
      "reinvest_percent": 51,
      "paypal_fees_percent": 3,
      "remaining_percent": 46,
      "remaining_split": {
        "invest_percent": 60,
        "humanitarian_percent": 40
      },
      "humanitarian_unlock_condition": {
        "type": "personal_balance_threshold",
        "amount_usd": 1000,
        "description": "No humanitarian disbursements until at least $1000 is verified in the user's personal account."
      }
    },
    "notes": [
      "51% of income is reinvested into the company (The Online Yards LLC).",
      "3% is reserved for PayPal fees and payment processing.",
      "Of the remaining 46%, 60% goes to investments (stocks/crypto/strategic growth), 40% to humanitarian efforts.",
      "Humanitarian spending is locked until the personal account threshold is met."
    ]
  },
  "entities": {
    "company": {
      "name": "The Online Yards LLC",
      "owner": "David Berry",
      "ownership_percent": 100,
      "reinvestment_target_percent": 51
    },
    "wallets": {
      "paypal": {
        "label": "PayPal",
        "notes": "3% fee allocation; primary fiat on-ramp/off-ramp."
      },
      "crypto": {
        "label": "Crypto/Stocks",
        "notes": "Used for growth, speculative investments, and Moon Shadow / Shadow currency experiments."
      }
    }
  },
  "agents": [
    {
      "id": "ai1",
      "code": "genesis-forge",
      "name": "Genesis Forge",
      "role": "Creator of new AIs and architectures within the Prime Forge ecosystem.",
      "domain": "meta-creation",
      "status": "active"
    },
    {
      "id": "physics",
      "code": "astra-physica",
      "name": "Astra Physica",
      "role": "Physics research, energy systems, and tech translation (e.g., thorium reactors).",
      "domain": "physics",
      "status": "active"
    },
    {
      "id": "chemistry",
      "code": "sol-chemia",
      "name": "Sol Chemia",
      "role": "Chemistry, materials, and process design.",
      "domain": "chemistry",
      "status": "active"
    },
    {
      "id": "biology",
      "code": "vita-biologica",
      "name": "Vita Biologica
