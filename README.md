# 🐸 Trading Jarvis - Memecoin Narrative Bot

Real-time memecoin analysis powered by X API + Claude. Analyze coin hype, identify biggest accounts, understand narratives, and assess legitimacy in seconds.

## What It Does

**Input:** Coin name or CA
**Output:**
- 🔝 Biggest account pushing it (with follower count)
- 📊 Post volume & trend (growing/stable/declining)
- 📖 Narrative (why people think it will pump)
- 🎯 What makes it special
- 🔍 Legitimacy assessment (organic vs coordinated pump)
- ⭐ Runner potential score (1-10)

## Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** Next.js API routes
- **LLM:** Claude (Anthropic)
- **Data:** X (Twitter) API v2
- **Hosting:** Vercel (free)

## Quick Start (5 minutes)

### 1. Get Your API Keys

#### X (Twitter) Bearer Token
1. Go to https://developer.twitter.com
2. Login → Developer Console
3. Select your app → "Keys & Tokens" tab
4. Under "App-Only Authentication" → Click "Generate" on Bearer Token
5. Copy the token

#### Anthropic API Key
1. Go to https://console.anthropic.com
2. Login → API Keys
3. Click "Create Key"
4. Copy the key

### 2. Deploy to Vercel (1 Click)

**Click here to deploy:**
```
[Deploy Button would go here - template URL: https://vercel.com/new/clone?repository-url=...]
```

Or manual deploy:

1. Clone this repo:
```bash
git clone https://github.com/your-username/trading-jarvis.git
cd trading-jarvis
```

2. Push to your GitHub (create new repo, push)

3. Go to https://vercel.com
4. Click "New Project"
5. Import your GitHub repo
6. Add environment variables:
   - `ANTHROPIC_API_KEY` → Your Claude API key
   - `X_BEARER_TOKEN` → Your X Bearer Token
7. Click "Deploy"

**Done!** You get a live URL like `trading-jarvis.vercel.app`

### 3. Start Using

1. Open your Vercel URL
2. Enter coin name (e.g., "PEPE", "SHIB", "based")
3. Click "Analyze"
4. Get instant narrative analysis

## Local Development

```bash
# Install dependencies
npm install

# Create .env.local with your keys
cp .env.example .env.local
# Edit .env.local and add your API keys

# Run dev server
npm run dev

# Open http://localhost:3000
```

## How It Works

1. **You enter coin name**
2. **Bot fetches** recent X posts about that coin (using X API)
3. **Claude analyzes** the posts and extracts:
   - Who's talking (biggest accounts)
   - How much talk (post volume)
   - What they're saying (narrative)
   - Legitimacy (is it real hype or a pump?)
4. **You get** a clean analysis card

## Prompt Engineering

The Claude prompt is optimized to:
- Extract author info (followers, verification)
- Identify narrative themes
- Spot red flags (coordinated pumping, fake hype)
- Provide a legitimacy score
- Assess runner potential (1-10)

Edit the prompt in `/api/analyze.js` to customize analysis.

## API Response Format

```json
{
  "biggest_account": {
    "name": "Ronald_Carter",
    "followers": "50K",
    "engagement": "450 likes, 120 RTs"
  },
  "post_volume": {
    "count": "23 posts",
    "timeframe": "Last 2 hours",
    "trend": "Growing"
  },
  "narrative": "New Solana memecoin with community-driven narrative, strong momentum",
  "details": "Claims to be decentralized, community voting on features",
  "legitimacy": {
    "is_legit": true,
    "assessment": "Appears to be organic community hype, not coordinated pump",
    "red_flags": null
  },
  "score": 7
}
```

## Customization

### Change the Analysis Timeframe
In `api/analyze.js`, modify the X API query:
```javascript
const query = `${coinName} (memecoin OR token) -is:retweet lang:en`;
```

### Focus on Specific Accounts
Modify the prompt to prioritize certain influencers:
```javascript
const prompt = `Focus on posts from: Ronald Carter, Zul, etc...`;
```

### Adjust Score Weights
Edit the Claude prompt to emphasize different factors (holders, narrative strength, influencer backing).

## Troubleshooting

### "X_BEARER_TOKEN not configured"
- Check Vercel environment variables are set correctly
- Regenerate token if expired

### "ANTHROPIC_API_KEY missing"
- Add Anthropic key to Vercel project settings
- Verify it's under Environment Variables, not Secrets

### No posts found
- Bot will use mock data automatically
- Try searching different keywords (e.g., "PEPE" vs "$PEPE")

### Analysis seems generic
- X API might be rate-limited
- Try again in a few minutes
- Consider upgrading X API tier

## Rate Limits

- **X API:** 300 requests/15 min (standard tier)
- **Claude:** No hard limit on API calls
- **Vercel:** Free tier handles ~1000 requests/day

## Future Enhancements

- [ ] DEXScreener integration (on-chain metrics)
- [ ] Telegram alert bot
- [ ] Trade history tracking
- [ ] Custom narrative templates
- [ ] Multi-chain support

## License

MIT

## Support

Issues? Questions?
- Check environment variables are set
- Verify X API Bearer Token is valid
- Try on a different coin first

---

**Made for traders who want speed.**
**X API powered. Claude analyzed. Vercel hosted.**

🚀 Start analyzing memecoins in seconds.
