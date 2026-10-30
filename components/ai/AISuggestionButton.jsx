import React, { useState } from 'react';
import { FaLightbulb, FaSpinner } from 'react-icons/fa';
import { loadAISettings, toRequestFields } from './settingsStorage';

const AISuggestionButton = ({ section, content }) => {
  const [suggestions, setSuggestions] = useState('');
  const [source, setSource] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetSuggestions = async () => {
    setLoading(true);
    setError('');
    setSuggestions('');
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, content, ...toRequestFields(loadAISettings()) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.message || `Request failed (HTTP ${response.status})`);
      } else {
        setSuggestions(data.suggestions || '');
        setSource(`${data.provider} · ${data.model}`);
      }
    } catch (err) {
      setError(err && err.message ? err.message : 'Network error');
    }
    setLoading(false);
  };

  const dismiss = () => {
    setSuggestions('');
    setError('');
  };

  return (
    <div className="flex-col-gap-2 mb-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleGetSuggestions}
          title="Get AI suggestions"
          className="bg-zinc-800 text-white p-2 rounded hover:bg-zinc-700 transition-colors"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaLightbulb />}
        </button>
      </div>

      {(suggestions || error) && (
        <div className="bg-zinc-100 p-4 rounded mt-2 -ml-20 shadow-md">
          {error ? (
            <>
              <h3 className="text-red-700 font-semibold mb-2 text-left">AI error</h3>
              <div className="text-red-700 whitespace-pre-line">{error}</div>
            </>
          ) : (
            <>
              <h3 className="text-zinc-800 font-semibold mb-2 text-left">
                AI Suggestions <span className="font-normal text-zinc-500">({source})</span>
              </h3>
              <div className="text-zinc-700 whitespace-pre-line">{suggestions}</div>
            </>
          )}
          <button
            type="button"
            onClick={dismiss}
            className="mt-2 bg-zinc-800 text-white px-3 py-1 rounded hover:bg-zinc-700"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default AISuggestionButton;
