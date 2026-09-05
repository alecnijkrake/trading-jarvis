import React, { useState } from 'react';

export default function TradingJarvis() {
  const [coinInput, setCoinInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!coinInput.trim()) {
      setError('Plz enter a coin name or CA');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coinInput: coinInput.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message || 'Error fetching analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🐸 Trading Jarvis
          </h1>
          <p className="text-gray-400 text-lg">
            Real-time memecoin narrative analysis powered by X + Claude
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Enter Coin Name or Contract Address
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={coinInput}
              onChange={(e) => setCoinInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="e.g., PEPE, SHIB, or 0x..."
              className="flex-1 bg-gray-900 text-white px-4 py-3 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded font-medium transition"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-6">
            {/* Biggest Account */}
            <div>
              <h3 className="text-lg font-bold text-white mb-2">🔝 Biggest Account</h3>
              <div className="bg-gray-900 p-4 rounded border border-gray-700">
                <p className="text-white font-semibold">{analysis.biggest_account?.name || 'N/A'}</p>
                <p className="text-gray-400 text-sm">{analysis.biggest_account?.followers || 'Unknown'} followers</p>
                <p className="text-gray-400 text-sm">{analysis.biggest_account?.engagement || 'N/A'}</p>
              </div>
            </div>

            {/* Post Volume */}
            <div>
              <h3 className="text-lg font-bold text-white mb-2">📊 Post Volume</h3>
              <div className="bg-gray-900 p-4 rounded border border-gray-700">
                <p className="text-blue-400 text-2xl font-bold">{analysis.post_volume?.count || 'N/A'}</p>
                <p className="text-gray-400">{analysis.post_volume?.timeframe || 'Last 2 hours'}</p>
                <p className="text-gray-400 text-sm">{analysis.post_volume?.trend || 'Monitoring...'}</p>
              </div>
            </div>

            {/* Narrative */}
            <div>
              <h3 className="text-lg font-bold text-white mb-2">📖 Narrative</h3>
              <div className="bg-gray-900 p-4 rounded border border-gray-700">
                <p className="text-white leading-relaxed">{analysis.narrative || 'Analyzing...'}</p>
              </div>
            </div>

            {/* Details */}
            <div>
              <h3 className="text-lg font-bold text-white mb-2">🎯 What Makes It Special</h3>
              <div className="bg-gray-900 p-4 rounded border border-gray-700">
                <p className="text-white leading-relaxed">{analysis.details || 'Analyzing...'}</p>
              </div>
            </div>

            {/* What's Behind It */}
            <div>
              <h3 className="text-lg font-bold text-white mb-2">🔍 What's Behind It</h3>
              <div className={`p-4 rounded border-2 ${
                analysis.legitimacy?.is_legit 
                  ? 'bg-green-900 border-green-700' 
                  : 'bg-red-900 border-red-700'
              }`}>
                <p className={analysis.legitimacy?.is_legit ? 'text-green-200' : 'text-red-200'}>
                  {analysis.legitimacy?.assessment || 'Analyzing legitimacy...'}
                </p>
                {analysis.legitimacy?.red_flags && (
                  <div className="mt-2 text-sm">
                    <p className="text-yellow-300 font-semibold">⚠️ Red Flags:</p>
                    <p className="text-gray-200">{analysis.legitimacy.red_flags}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Overall Score */}
            {analysis.score && (
              <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded border border-purple-700">
                <p className="text-gray-300 text-sm mb-1">Overall Runner Potential</p>
                <p className="text-5xl font-bold text-white">{analysis.score}/10</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Made for memecoin traders. X API powered. Claude analyzed.</p>
        </div>
      </div>
    </div>
  );
}
