"use client";

import { useState } from "react";

const FetchPageContent = () => {
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");

  const fetchContent = async () => {
    try {
      setContent("Fetching...");
      const result =
        (await window.electron.playwright.fetchPageContent(url)) ||
        "Fetching...";
      setContent(result);
    } catch (error: any) {
      setContent(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Fetch Page Content
      </h1>

      {/* URL Input */}
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchContent}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Fetch
        </button>
      </div>

      {/* Display Content */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
          {content}
        </pre>
      </div>
    </div>
  );
};

export default FetchPageContent;
