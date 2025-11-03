"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import type { WebhookResponseType } from "@/types/webhook";

interface Step2ConfigurationProps {
  type: WebhookResponseType;
  onSubmit: (config: any) => Promise<void>;
  isLoading: boolean;
}

export function Step2Configuration({ type, onSubmit, isLoading }: Step2ConfigurationProps) {
  const [statusCode, setStatusCode] = useState<number>(200);
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([
    { key: "Content-Type", value: "application/json" },
  ]);
  const [body, setBody] = useState<string>('{"message": "Success"}');
  const [proxyUrl, setProxyUrl] = useState<string>("");

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "static") {
      const headersObj: Record<string, string> = {};
      headers.forEach((header) => {
        if (header.key.trim() && header.value.trim()) {
          headersObj[header.key.trim()] = header.value.trim();
        }
      });

      await onSubmit({
        status_code: statusCode,
        headers: Object.keys(headersObj).length > 0 ? headersObj : null,
        body: body.trim() || null,
      });
    } else {
      await onSubmit({
        proxy_url: proxyUrl.trim(),
      });
    }
  };

  const isValidProxy = proxyUrl.trim().length > 0 && proxyUrl.startsWith("http");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-discord-text-normal mb-2">
          Configure Response
        </h2>
        <p className="text-discord-text-muted">
          {type === "static"
            ? "Define the response your webhook will return"
            : "Specify the URL to forward requests to"}
        </p>
      </div>

      {type === "static" ? (
        <>
          {/* Status Code */}
          <div>
            <label className="block text-sm font-medium text-discord-text-muted mb-2">
              Status Code *
            </label>
            <input
              type="number"
              min="100"
              max="599"
              value={statusCode}
              onChange={(e) => setStatusCode(parseInt(e.target.value) || 200)}
              className="w-full px-4 py-2 bg-discord-input border border-discord-dark rounded-md text-discord-text-normal focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-discord-text-muted mt-1">
              HTTP status code (100-599)
            </p>
          </div>

          {/* Headers */}
          <div>
            <label className="block text-sm font-medium text-discord-text-muted mb-2">
              Headers (optional)
            </label>
            <div className="space-y-2">
              {headers.map((header, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Key"
                    value={header.key}
                    onChange={(e) => updateHeader(index, "key", e.target.value)}
                    className="flex-1 px-4 py-2 bg-discord-input border border-discord-dark rounded-md text-discord-text-normal focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={header.value}
                    onChange={(e) => updateHeader(index, "value", e.target.value)}
                    className="flex-1 px-4 py-2 bg-discord-input border border-discord-dark rounded-md text-discord-text-normal focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeHeader(index)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addHeader}
                className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors group"
              >
                <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                Add Header
              </button>
            </div>
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-discord-text-muted mb-2">
              Body (optional)
            </label>
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder='{"message": "Success"}'
              className="w-full px-4 py-2 bg-discord-input border border-discord-dark rounded-md text-discord-text-normal font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
            <p className="text-xs text-discord-text-muted mt-1">
              Response body content (JSON, XML, plain text, etc.)
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Proxy URL */}
          <div>
            <label className="block text-sm font-medium text-discord-text-muted mb-2">
              Proxy URL *
            </label>
            <input
              type="url"
              value={proxyUrl}
              onChange={(e) => setProxyUrl(e.target.value)}
              placeholder="https://api.example.com/webhook"
              className="w-full px-4 py-2 bg-discord-input border border-discord-dark rounded-md text-discord-text-normal focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-discord-text-muted mt-1">
              Requests will be forwarded to this URL
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>Note:</strong> The proxy will forward all request headers and body to the specified URL and return its response.
            </p>
          </div>
        </>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || (type === "proxy" && !isValidProxy)}
        className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-purple-600 transition-all active:scale-[0.98] shadow-lg hover:shadow-xl"
      >
        {isLoading ? "Creating..." : "Create Response"}
      </button>
    </form>
  );
}
