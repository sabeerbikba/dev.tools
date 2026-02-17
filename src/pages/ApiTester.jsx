import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Send, Plus, Trash2, Clock, FileText, Globe, ShieldAlert } from "lucide-react";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import { toast } from "react-toastify";
import cn from "@/utils/cn";
import PropTypes from "prop-types";

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

export default function ApiTester() {
  const [url, setUrl] = useLocalStorageState("ApiTester_Url", "https://jsonplaceholder.typicode.com/todos/1");
  const [method, setMethod] = useLocalStorageState("ApiTester_Method", "GET");
  const [activeTab, setActiveTab] = useState("params");
  const [params, setParams] = useLocalStorageState("ApiTester_Params", [{ key: "", value: "" }]);
  const [headers, setHeaders] = useLocalStorageState("ApiTester_Headers", [{ key: "", value: "" }]);
  const [body, setBody] = useLocalStorageState("ApiTester_Body", "{\n  \n}");
  const [useProxy, setUseProxy] = useLocalStorageState("ApiTester_UseProxy", false);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);
    const startTime = performance.now();

    try {
      // Construct URL with params
      const urlObj = new URL(url);
      params.forEach((p) => {
        if (p.key) urlObj.searchParams.append(p.key, p.value);
      });

      // Construct headers
      const headersObj = {};
      headers.forEach((h) => {
        if (h.key) headersObj[h.key] = h.value;
      });

      const options = {
        method,
        headers: headersObj,
      };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        options.body = body;
      }

      let fetchUrl = urlObj.toString();
      if (useProxy) {
        // Using corsproxy.io as a public proxy
        fetchUrl = `https://corsproxy.io/?${encodeURIComponent(fetchUrl)}`;
      }

      const res = await fetch(fetchUrl, options);
      const endTime = performance.now();
      const time = (endTime - startTime).toFixed(0);

      const size = res.headers.get("content-length");
      const contentType = res.headers.get("content-type");

      let data;
      let textData = "";
      if (contentType && contentType.includes("application/json")) {
        try {
            data = await res.json();
            textData = JSON.stringify(data, null, 2);
        } catch (e) {
            textData = await res.text();
        }
      } else {
        textData = await res.text();
      }

      const resHeaders = {};
      res.headers.forEach((value, key) => {
        resHeaders[key] = value;
      });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        time,
        size: size ? `${(size / 1024).toFixed(2)} KB` : "Unknown",
        data: textData,
        headers: resHeaders,
      });
    } catch (err) {
      setError(err.message);
      toast.error(`Request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addParam = () => setParams([...params, { key: "", value: "" }]);
  const removeParam = (index) => setParams(params.filter((_, i) => i !== index));
  const updateParam = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  const addHeader = () => setHeaders([...headers, { key: "", value: "" }]);
  const removeHeader = (index) => setHeaders(headers.filter((_, i) => i !== index));
  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return "text-green-500";
    if (status >= 300 && status < 400) return "text-blue-500";
    if (status >= 400 && status < 500) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-900 text-white p-4 gap-4 overflow-hidden">
      {/* Top Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
            <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 font-semibold w-24"
            >
            {methods.map((m) => (
                <option key={m} value={m}>
                {m}
                </option>
            ))}
            </select>
            <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-4 w-4 text-gray-400" />
                </div>
                <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
                className="w-full bg-gray-800 border border-gray-700 rounded pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
            </div>

            <button
            onClick={handleSend}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {loading ? "Sending..." : <><Send size={16} /> Send</>}
            </button>
        </div>

        {/* Proxy Option */}
        <div className="flex items-center gap-2 px-1">
             <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none hover:text-gray-300">
                <input
                    type="checkbox"
                    checked={useProxy}
                    onChange={(e) => setUseProxy(e.target.checked)}
                    className="rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                />
                <ShieldAlert size={14} />
                <span>Use Proxy (Bypass CORS)</span>
             </label>
             <span className="text-[10px] text-gray-500 ml-2 border-l border-gray-700 pl-2">
                Enable this if you encounter "Failed to fetch" errors on public APIs. Note: Does not work for localhost.
             </span>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden max-md:flex-col">
        {/* Left Panel: Request Details */}
        <div className="w-1/2 flex flex-col bg-gray-800 rounded-lg overflow-hidden border border-gray-700 max-md:w-full max-md:h-1/2">
          <div className="flex border-b border-gray-700">
            {["params", "headers", "body"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium capitalize transition-colors hover:text-white",
                  activeTab === tab
                    ? "text-indigo-400 border-b-2 border-indigo-500 bg-gray-700/50"
                    : "text-gray-400"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-4">
            {activeTab === "params" && (
              <KeyValueEditor
                items={params}
                onAdd={addParam}
                onRemove={removeParam}
                onUpdate={updateParam}
                keyName="Query Params"
              />
            )}
            {activeTab === "headers" && (
              <KeyValueEditor
                items={headers}
                onAdd={addHeader}
                onRemove={removeHeader}
                onUpdate={updateHeader}
                keyName="Headers"
              />
            )}
            {activeTab === "body" && (
              <div className="h-full flex flex-col">
                 <div className="text-xs text-gray-400 mb-2 flex justify-between">
                    <span>JSON Body</span>
                 </div>
                 <div className="flex-1 border border-gray-700 rounded overflow-hidden">
                    <MonacoEditor
                        language="json"
                        theme="vs-dark"
                        value={body}
                        onChange={(value) => setBody(value || "")}
                        options={{ minimap: { enabled: false }, lineNumbers: "on", scrollBeyondLastLine: false }}
                    />
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Response */}
        <div className="w-1/2 flex flex-col bg-gray-800 rounded-lg overflow-hidden border border-gray-700 max-md:w-full max-md:h-1/2">
          <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center bg-gray-700/30">
            <h3 className="font-semibold text-gray-200">Response</h3>
            {response && (
              <div className="flex gap-4 text-xs font-mono">
                <span className={cn("font-bold", getStatusColor(response.status))}>
                  {response.status} {response.statusText}
                </span>
                <span className="text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> {response.time}ms
                </span>
                <span className="text-gray-400 flex items-center gap-1">
                   <FileText size={12} /> {response.size}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            )}

            {error && !loading && (
                 <div className="p-4 flex flex-col gap-4 text-sm">
                    <div className="text-red-400 font-mono bg-red-900/20 p-3 rounded border border-red-900/50">
                        Error: {error}
                    </div>

                    <div className="bg-gray-700/50 p-3 rounded border border-gray-600 text-gray-300">
                        <div className="flex items-center gap-2 font-semibold text-yellow-500 mb-2">
                            <ShieldAlert size={16} />
                            <span>Troubleshooting</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-xs text-gray-400">
                            <li>
                                <strong>CORS Error?</strong> If you are testing a public API, try enabling the <span className="text-indigo-400">"Use Proxy"</span> checkbox above.
                            </li>
                            <li>
                                <strong>Localhost?</strong> The proxy cannot reach localhost. Ensure your local server has CORS enabled (e.g., using `cors` middleware in Express).
                            </li>
                            <li>
                                <strong>Network?</strong> Check your internet connection or the API URL.
                            </li>
                        </ul>
                    </div>
                 </div>
            )}

            {!response && !loading && !error && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Send size={48} className="mb-4 opacity-20" />
                <p>Send a request to see the response</p>
              </div>
            )}

            {response && (
                 <div className="h-full flex flex-col">
                    <MonacoEditor
                        height="100%"
                        language="json"
                        theme="vs-dark"
                        value={response.data}
                        options={{
                            minimap: { enabled: false },
                            lineNumbers: "on",
                            readOnly: true,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            wordWrap: "on"
                        }}
                        loading="Loading response..."
                    />
                 </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KeyValueEditor({ items, onAdd, onRemove, onUpdate, keyName }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 text-xs font-semibold text-gray-400 mb-1 px-1">
        <div className="flex-1">Key</div>
        <div className="flex-1">Value</div>
        <div className="w-8"></div>
      </div>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            placeholder="Key"
            value={item.key}
            onChange={(e) => onUpdate(index, "key", e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Value"
            value={item.value}
            onChange={(e) => onUpdate(index, "value", e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => onRemove(index)}
            className="w-8 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors"
            title="Remove"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="self-start mt-2 flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors px-2 py-1 rounded hover:bg-indigo-400/10"
      >
        <Plus size={14} /> Add {keyName}
      </button>
    </div>
  );
}

KeyValueEditor.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  keyName: PropTypes.string.isRequired,
};
