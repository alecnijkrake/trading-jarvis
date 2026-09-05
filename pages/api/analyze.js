import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function fetchTwitterPosts(coinName) {
  const bearerToken = process.env.X_BEARER_TOKEN;
  
  if (!bearerToken) {
    throw new Error('X_BEARER_TOKEN not configured');
  }

  const query = `${coinName} (memecoin OR token OR crypto) -is:retweet lang:en`;
  
  try {
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=50&tweet.fields=created_at,author_id,public_metrics&expansions=author_id&user.fields=username,public_metrics,verified`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'User-Agent': 'Trading-Jarvis-Bot/1.0',
      },
    });

    if (!response.ok) {
      console.error('Twitter API error:', response.status);
      return generateMockData(coinName);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return generateMockData(coinName);
  }
}
  const bearerToken = process.env.X_BEARER_TOKEN;
  
  if (!bearerToken) {
    throw new Error('X_BEARER_TOKEN not configured');
  }

  // Search for posts about the coin
  const query = `${coinName} (memecoin OR token OR crypto) -is:retweet lang:en`;
  
  try {
    const response = await fetch('https://api.twitter.com/2/tweets/search/recent', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'User-Agent': 'Trading-Jarvis-Bot/1.0',
      },
      params: new URLSearchParams({
        'query': query,
        'max_results': '50',
        'tweet.fields': 'created_at,author_id,public_metrics',
        'expansions': 'author_id',
        'user.fields': 'username,public_metrics,verified',
      }).toString(),
    });

    if (!response.ok) {
      console.error('Twitter API error:', response.status, response.statusText);
      // Return mock data for development
      return generateMockData(coinName);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return generateMockData(coinName);
  }
}

function generateMockData(coinName) {
  return {
    data: [
      {
        id: '1',
        text: `${coinName} is the next big memecoin runner. Community driven, strong tokenomics, team is based.`,
        public_metrics: { like_count: 450, retweet_count: 120 },
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        text: `Just loaded $${coinName}. This has serious potential. Small MC, huge upside.`,
        public_metrics: { like_count: 320, retweet_count: 85 },
        created_at: new Date().toISOString(),
      },
    ],
    includes: {
      users: [
        {
          id: '1',
          username: 'Ronald_Carter',
          public_metrics: { followers_count: 50000 },
          verified: true,
        },
      ],
    },
  };
}

async function analyzeWithClaude(coinName, tweetData) {
  const tweetsText = tweetData.data
    ?.map((t) => `"${t.text}" - ${t.public_metrics?.like_count || 0} likes`)
    .join('\n');

  const prompt = `You are a memecoin narrative analyst. Analyze X posts about the coin "${coinName}" and provide structured insights.

Posts found:
${tweetsText || 'No posts found - using mock data'}

Analyze and return ONLY valid JSON (no markdown, no extra text) with this exact structure:
{
  "biggest_account": {
    "name": "Account name or handle",
    "followers": "Follower count",
    "engagement": "Average engagement metric"
  },
  "post_volume": {
    "count": "Number of posts",
    "timeframe": "Time period analyzed",
    "trend": "Growing/Stable/Declining"
  },
  "narrative": "1-2 sentence summary of why people think this coin will pump",
  "details": "What features/story makes it special according to posters",
  "legitimacy": {
    "is_legit": true/false,
    "assessment": "Is it organic hype or coordinated pump? Any red flags?",
    "red_flags": "Specific concerns if any"
  },
  "score": 1-10 score for runner potential
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const responseText =
    message.content[0].type === 'text' ? message.content[0].text : '';

  // Parse JSON - handle both with/without markdown
  let jsonText = responseText.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
  }

  try {
    return JSON.parse(jsonText);
  } catch (parseError) {
    console.error('JSON parse error:', parseError, 'Text:', jsonText);
    return {
      error: 'Failed to parse analysis',
      raw_response: responseText,
    };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { coinInput } = req.body;

  if (!coinInput?.trim()) {
    return res.status(400).json({ error: 'Coin name required' });
  }

  try {
    console.log(`Analyzing: ${coinInput}`);

    // Fetch tweets
    const tweetData = await fetchTwitterPosts(coinInput);

    // Analyze with Claude
    const analysis = await analyzeWithClaude(coinInput, tweetData);

    return res.status(200).json(analysis);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      error: error.message || 'Analysis failed',
    });
  }
}
