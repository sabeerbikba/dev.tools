import { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Send, Plus, Trash2, Clock, FileText, Globe, ShieldAlert, History, Code, Save, ChevronRight, ChevronDown, Check, Copy, X, Database } from "lucide-react";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import { toast } from "react-toastify";
import cn from "@/utils/cn";
import PropTypes from "prop-types";

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
const authTypes = ["None", "Bearer Token", "Basic Auth", "API Key"];
const bodyTypes = ["None", "Raw (JSON)", "x-www-form-urlencoded", "multipart/form-data", "Binary File"];

export default function ApiTester() {
  const [url, setUrl] = useLocalStorageState("ApiTester_Url", "https://jsonplaceholder.typicode.com/todos/1");
  const [method, setMethod] = useLocalStorageState("ApiTester_Method", "GET");

  // Request Config
  const [activeTab, setActiveTab] = useState("params");
  const [params, setParams] = useLocalStorageState("ApiTester_Params", [{ key: "", value: "" }]);
  const [headers, setHeaders] = useLocalStorageState("ApiTester_Headers", [{ key: "", value: "" }]);

  // Auth
  const [authType, setAuthType] = useLocalStorageState("ApiTester_AuthType", "None");
  const [authToken, setAuthToken] = useLocalStorageState("ApiTester_AuthToken", "");
  const [authUsername, setAuthUsername] = useLocalStorageState("ApiTester_AuthUsername", "");
  const [authPassword, setAuthPassword] = useLocalStorageState("ApiTester_AuthPassword", "");
  const [apiKeyKey, setApiKeyKey] = useLocalStorageState("ApiTester_ApiKeyKey", "");
  const [apiKeyValue, setApiKeyValue] = useLocalStorageState("ApiTester_ApiKeyValue", "");
  const [apiKeyPlacement, setApiKeyPlacement] = useLocalStorageState("ApiTester_ApiKeyPlacement", "Header");

  // Body
  const [bodyType, setBodyType] = useLocalStorageState("ApiTester_BodyType", "Raw (JSON)");
  const [rawBody, setRawBody] = useLocalStorageState("ApiTester_RawBody", "{\n  \n}");
  const [formData, setFormData] = useLocalStorageState("ApiTester_FormData", [{ key: "", value: "", type: "text", file: null }]); // Added file support (not persisted in local storage properly but kept in state for session)
  const [urlEncodedData, setUrlEncodedData] = useLocalStorageState("ApiTester_UrlEncodedData", [{ key: "", value: "" }]);
  const [binaryFile, setBinaryFile] = useState(null); // Not persisted

  const [useProxy, setUseProxy] = useLocalStorageState("ApiTester_UseProxy", false);
  const [response, setResponse] = useState(null);
  const [activeResponseTab, setActiveResponseTab] = useState("body");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // History & Sidebar
  const [history, setHistory] = useLocalStorageState("ApiTester_History", []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCodeModal, setShowCodeModal] = useState(false);

  // Environment Variables
  const [showEnvModal, setShowEnvModal] = useState(false);
  const [envVars, setEnvVars] = useLocalStorageState("ApiTester_EnvVars", [{ key: "baseUrl", value: "https://jsonplaceholder.typicode.com" }]);

  // Close modal on ESC
  useEffect(() => {
    const handleEsc = (e) => {
        if (e.key === "Escape") {
            setShowCodeModal(false);
            setShowEnvModal(false);
        }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Substitute variables
  const substituteVars = (text) => {
      if (typeof text !== "string") return text;
      let result = text;
      envVars.forEach(v => {
          if (v.key) {
              const regex = new RegExp(`\\{\\{${v.key}\\}\\}`, 'g');
              result = result.replace(regex, v.value);
          }
      });
      return result;
  };

  // Helper to load request safely
  const loadRequest = (item) => {
      const confirmLoad = window.confirm("Load this request? Current unsaved changes will be lost.");
      if (!confirmLoad) return;

      setUrl(item.url);
      setMethod(item.method);
      setParams(item.params || []);
      setHeaders(item.headers || []);
      setAuthType(item.authType || "None");
      setAuthToken(item.authToken || "");
      setAuthUsername(item.authUsername || "");
      setAuthPassword(item.authPassword || "");
      setApiKeyKey(item.apiKeyKey || "");
      setApiKeyValue(item.apiKeyValue || "");
      setApiKeyPlacement(item.apiKeyPlacement || "Header");
      setBodyType(item.bodyType || "None");
      setRawBody(item.rawBody || "");
      // Reset files as they can't be stored in localStorage history easily
      setFormData((item.formData || []).map(f => ({ ...f, file: null })));
      setBinaryFile(null);
      setUrlEncodedData(item.urlEncodedData || []);
      setUseProxy(item.useProxy || false);
      toast.info("Request loaded from history (Files reset)");
  };

  const addToHistory = (req) => {
    const newHistory = [req, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
  };

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);
    const startTime = performance.now();

    try {
      // Substitute vars in URL, Params, Headers, Body
      const subUrl = substituteVars(url);
      const subParams = params.map(p => ({ ...p, value: substituteVars(p.value) }));
      const subHeaders = headers.map(h => ({ ...h, value: substituteVars(h.value) }));
      const subRawBody = substituteVars(rawBody);
      const subFormData = formData.map(f => ({ ...f, value: f.type === 'text' ? substituteVars(f.value) : f.value }));
      const subUrlEncodedData = urlEncodedData.map(p => ({ ...p, value: substituteVars(p.value) }));

      const subAuthToken = substituteVars(authToken);
      const subAuthUsername = substituteVars(authUsername);
      const subAuthPassword = substituteVars(authPassword);
      const subApiKeyValue = substituteVars(apiKeyValue);

      // Construct URL with params
      let finalUrl = subUrl.trim();
      if (!/^https?:\/\//i.test(finalUrl) && !finalUrl.startsWith("http")) { // Basic check, assuming http/https
          finalUrl = `https://${finalUrl}`;
      }

      const urlObj = new URL(finalUrl);
      subParams.forEach((p) => {
        if (p.key) urlObj.searchParams.append(p.key, p.value);
      });

      // Construct headers
      const headersObj = {};
      subHeaders.forEach((h) => {
        if (h.key) headersObj[h.key] = h.value;
      });

      // Handle Auth
      if (authType === "Bearer Token" && subAuthToken) {
        headersObj["Authorization"] = `Bearer ${subAuthToken}`;
      } else if (authType === "Basic Auth" && (subAuthUsername || subAuthPassword)) {
        const token = btoa(`${subAuthUsername}:${subAuthPassword}`);
        headersObj["Authorization"] = `Basic ${token}`;
      } else if (authType === "API Key" && apiKeyKey && subApiKeyValue) {
          if (apiKeyPlacement === "Header") {
              headersObj[apiKeyKey] = subApiKeyValue;
          } else {
              urlObj.searchParams.append(apiKeyKey, subApiKeyValue);
          }
      }

      const options = {
        method,
        headers: headersObj,
      };

      // Handle Body
      if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        if (bodyType === "Raw (JSON)") {
           if (subRawBody) {
             try {
                // Validate JSON but send raw string
                JSON.parse(subRawBody);
                headersObj["Content-Type"] = "application/json";
                options.body = subRawBody;
             } catch (e) {
                // Allow sending invalid JSON if user insists, but warn?
                // For now, let's assume valid JSON or just send text
                headersObj["Content-Type"] = "application/json";
                options.body = subRawBody;
             }
           }
        } else if (bodyType === "x-www-form-urlencoded") {
           const formBody = new URLSearchParams();
           subUrlEncodedData.forEach(p => {
             if (p.key) formBody.append(p.key, p.value);
           });
           headersObj["Content-Type"] = "application/x-www-form-urlencoded";
           options.body = formBody;
        } else if (bodyType === "multipart/form-data") {
           const formBody = new FormData();
           subFormData.forEach(f => {
             if (f.key) {
                 if (f.type === "file" && f.file) {
                     formBody.append(f.key, f.file);
                 } else {
                     formBody.append(f.key, f.value);
                 }
             }
           });
           // Fetch automatically sets Content-Type for FormData with boundary
           delete headersObj["Content-Type"];
           options.body = formBody;
        } else if (bodyType === "Binary File" && binaryFile) {
            options.body = binaryFile;
            // Content-Type should be set manually or guessed, user can set header
            if (!headersObj["Content-Type"]) {
                headersObj["Content-Type"] = binaryFile.type || "application/octet-stream";
            }
        }
      }

      let fetchUrl = urlObj.toString();
      if (useProxy) {
        fetchUrl = `https://corsproxy.io/?${encodeURIComponent(fetchUrl)}`;
      }

      const res = await fetch(fetchUrl, options);
      const endTime = performance.now();
      const time = (endTime - startTime).toFixed(0);

      const size = res.headers.get("content-length");
      const contentType = res.headers.get("content-type");

      let data;
      let textData = "";
      let isImage = false;
      let isHtml = false;

      if (contentType) {
          if (contentType.includes("application/json")) {
            try {
                data = await res.json();
                textData = JSON.stringify(data, null, 2);
            } catch (e) {
                textData = await res.text();
            }
          } else if (contentType.includes("image")) {
             isImage = true;
             const blob = await res.blob();
             textData = URL.createObjectURL(blob);
          } else if (contentType.includes("text/html")) {
             isHtml = true;
             textData = await res.text();
          } else {
             textData = await res.text();
          }
      } else {
          textData = await res.text();
      }

      const resHeaders = {};
      res.headers.forEach((value, key) => {
        resHeaders[key] = value;
      });

      const responseObj = {
        status: res.status,
        statusText: res.statusText || getStatusText(res.status),
        time,
        size: size ? `${(size / 1024).toFixed(2)} KB` : "Unknown",
        data: textData,
        headers: resHeaders,
        isImage,
        isHtml,
        contentType
      };

      setResponse(responseObj);
      // Default to preview if image or html, else body
      setActiveResponseTab(isImage || isHtml ? "preview" : "body");

      // Save to history
      addToHistory({
          url,
          method,
          params,
          headers,
          authType,
          authToken,
          authUsername,
          authPassword,
          apiKeyKey,
          apiKeyValue,
          apiKeyPlacement,
          bodyType,
          rawBody,
          formData,
          urlEncodedData,
          useProxy,
          timestamp: new Date().toISOString(),
          status: res.status,
          time
      });

    } catch (err) {
      setError(err.message);
      toast.error(`Request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for Key-Value editors
  const createUpdateHandler = (setter, list) => (index, field, value) => {
    const newList = [...list];
    newList[index][field] = value;
    setter(newList);
  };
  const createAddHandler = (setter, list) => () => setter([...list, { key: "", value: "" }]);
  const createRemoveHandler = (setter, list) => (index) => setter(list.filter((_, i) => i !== index));

  const getStatusText = (status) => {
      switch (status) {
          case 200: return "OK";
          case 201: return "Created";
          case 204: return "No Content";
          case 400: return "Bad Request";
          case 401: return "Unauthorized";
          case 403: return "Forbidden";
          case 404: return "Not Found";
          case 418: return "I'm a teapot";
          case 500: return "Internal Server Error";
          case 502: return "Bad Gateway";
          case 503: return "Service Unavailable";
          default: return "Unknown";
      }
  };

  const getStatusTooltip = (status) => {
      if (status >= 200 && status < 300) return "Success: The request was successfully received, understood, and accepted.";
      if (status >= 300 && status < 400) return "Redirection: Further action needs to be taken in order to complete the request.";
      if (status >= 400 && status < 500) {
          if (status === 418) return "418 I'm a teapot: The server refuses the attempt to brew coffee with a teapot.";
          return "Client Error: The request contains bad syntax or cannot be fulfilled.";
      }
      if (status >= 500) return "Server Error: The server failed to fulfill an apparently valid request.";
      return "";
  };

  const generateSnippets = () => {
      // Headers
      const headersObj = {};
      headers.forEach((h) => { if (h.key) headersObj[h.key] = h.value; });
      if (authType === "Bearer Token" && authToken) headersObj["Authorization"] = `Bearer ${authToken}`;
      else if (authType === "Basic Auth" && (authUsername || authPassword)) headersObj["Authorization"] = `Basic ${btoa(`${authUsername}:${authPassword}`)}`;
      else if (authType === "API Key" && apiKeyKey && apiKeyValue && apiKeyPlacement === "Header") headersObj[apiKeyKey] = apiKeyValue;

      let finalUrl = url;
      if (authType === "API Key" && apiKeyKey && apiKeyValue && apiKeyPlacement === "Query Params") {
          const u = new URL(url);
          u.searchParams.append(apiKeyKey, apiKeyValue);
          finalUrl = u.toString();
      }

      let bodyStr = "";
      if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
         if (bodyType === "Raw (JSON)") {
            headersObj["Content-Type"] = "application/json";
            bodyStr = rawBody;
         } else if (bodyType === "x-www-form-urlencoded") {
            headersObj["Content-Type"] = "application/x-www-form-urlencoded";
            const params = new URLSearchParams();
            urlEncodedData.forEach(p => { if (p.key) params.append(p.key, p.value); });
            bodyStr = params.toString();
         }
      }

      // cURL
      let curl = `curl -X ${method} "${finalUrl}"`;
      Object.entries(headersObj).forEach(([k, v]) => {
          curl += ` \\\n  -H "${k}: ${v}"`;
      });
      if (bodyStr) {
          curl += ` \\\n  -d '${bodyStr.replace(/'/g, "'\\''")}'`;
      }

      // Fetch
      let fetchCode = `fetch("${finalUrl}", {\n  method: "${method}",\n  headers: ${JSON.stringify(headersObj, null, 4).replace(/\n/g, "\n  ")}`;
      if (bodyStr) {
          fetchCode += `,\n  body: ${JSON.stringify(bodyStr)}`;
      }
      fetchCode += "\n});";

      // Python Requests
      let pythonCode = `import requests\n\nurl = "${finalUrl}"\n\nheaders = ${JSON.stringify(headersObj, null, 4)}\n\n`;
      if (bodyStr) {
          pythonCode += `payload = ${JSON.stringify(bodyStr)}\n\nresponse = requests.request("${method}", url, headers=headers, data=payload)`;
      } else {
          pythonCode += `response = requests.request("${method}", url, headers=headers)`;
      }
      pythonCode += `\n\nprint(response.text)`;

      // Node Axios
      let nodeAxios = `const axios = require('axios');\n\nlet config = {\n  method: '${method.toLowerCase()}',\n  maxBodyLength: Infinity,\n  url: '${finalUrl}',\n  headers: ${JSON.stringify(headersObj, null, 4).replace(/\n/g, "\n  ")}`;
      if (bodyStr) {
          nodeAxios += `,\n  data: ${JSON.stringify(bodyStr)}`;
      }
      nodeAxios += "\n};\n\naxios.request(config)\n.then((response) => {\n  console.log(JSON.stringify(response.data));\n})\n.catch((error) => {\n  console.log(error);\n});";

      return { curl, fetch: fetchCode, python: pythonCode, node: nodeAxios };
  };

  const snippets = showCodeModal ? generateSnippets() : { curl: "", fetch: "", python: "", node: "" };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-900 text-white overflow-hidden relative">
      {showCodeModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowCodeModal(false)}>
              <div className="bg-gray-800 border border-gray-700 rounded-lg w-[600px] max-h-[80vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900 rounded-t-lg">
                      <h3 className="font-bold flex items-center gap-2"><Code size={20} /> Code Snippets</h3>
                      <button onClick={() => setShowCodeModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                  </div>
                  <div className="p-4 overflow-auto custom-scrollbar flex flex-col gap-6">
                      {[
                          { label: "cURL", code: snippets.curl },
                          { label: "Fetch (JS)", code: snippets.fetch },
                          { label: "Python (Requests)", code: snippets.python },
                          { label: "Node.js (Axios)", code: snippets.node }
                      ].map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-400 uppercase">{item.label}</span>
                                <button onClick={() => { navigator.clipboard.writeText(item.code); toast.success(`Copied ${item.label}!`); }} className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300"><Copy size={12} /> Copy</button>
                            </div>
                            <pre className="bg-gray-900 p-3 rounded text-xs overflow-auto font-mono text-gray-300 border border-gray-700 whitespace-pre-wrap max-h-40 custom-scrollbar">{item.code}</pre>
                        </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* Sidebar */}
      <div className={cn("bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300", isSidebarOpen ? "w-64" : "w-12")}>
        <div className="p-3 border-b border-gray-700 flex items-center justify-between">
           {isSidebarOpen && <span className="font-semibold text-gray-200 flex items-center gap-2"><History size={16} /> History</span>}
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-700 rounded text-gray-400">
             {isSidebarOpen ? <ChevronRight size={16} className="rotate-180" /> : <ChevronRight size={16} />}
           </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isSidebarOpen ? (
                <div className="flex flex-col">
                    {history.map((item, idx) => (
                        <button key={idx} onClick={() => loadRequest(item)} className="p-3 border-b border-gray-700 hover:bg-gray-700 text-left group transition-colors">
                            <div className="flex items-center justify-between mb-1">
                                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded",
                                    item.method === "GET" ? "bg-green-900/50 text-green-300 border border-green-800" :
                                    item.method === "POST" ? "bg-blue-900/50 text-blue-300 border border-blue-800" :
                                    item.method === "DELETE" ? "bg-red-900/50 text-red-300 border border-red-800" :
                                    item.method === "PUT" ? "bg-yellow-900/50 text-yellow-300 border border-yellow-800" :
                                    "bg-gray-700 text-gray-300 border border-gray-600"
                                )}>{item.method}</span>
                                <span className={cn("text-[10px] font-mono", item.status >= 200 && item.status < 300 ? "text-green-400" : "text-red-400")}>{item.status}</span>
                            </div>
                            <div className="text-xs text-gray-300 truncate font-mono mb-1" title={item.url}>{item.url}</div>
                            <div className="text-[10px] text-gray-500 flex justify-between items-center">
                                <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                                <span className="flex items-center gap-1"><Clock size={10} />{item.time}ms</span>
                            </div>
                        </button>
                    ))}
                    {history.length === 0 && <div className="p-8 text-center text-gray-500 text-xs italic">No history yet.<br/>Send a request to start tracking.</div>}
                </div>
            ) : (
                <div className="flex flex-col items-center py-2 gap-2">
                    {history.map((item, idx) => (
                        <div key={idx} className={cn("w-2 h-2 rounded-full hover:scale-150 transition-transform cursor-pointer", item.status >= 200 && item.status < 300 ? "bg-green-500" : "bg-red-500")} title={`${item.method} ${item.url}`} />
                    ))}
                </div>
            )}
        </div>
        {isSidebarOpen && history.length > 0 && (
            <div className="p-2 border-t border-gray-700">
                <button onClick={() => setHistory([])} className="w-full flex items-center justify-center gap-2 text-xs text-red-400 hover:bg-gray-700 p-2 rounded transition-colors">
                    <Trash2 size={14} /> Clear History
                </button>
            </div>
        )}
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <div className="p-4 border-b border-gray-700 bg-gray-900 flex flex-col gap-3">
            <div className="flex gap-2 items-center">
                <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-l px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 font-bold w-28 h-10"
                >
                {methods.map((m) => (
                    <option key={m} value={m}>{m}</option>
                ))}
                </select>
                <div className="flex-1 relative h-10">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter request URL"
                    className="w-full h-full bg-gray-800 border border-gray-700 rounded-r pl-10 pr-8 text-sm focus:outline-none focus:border-indigo-500"
                    />
                    {url && (
                        <button
                            onClick={() => setUrl("")}
                            className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 hover:text-white"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                <button
                onClick={handleSend}
                disabled={loading}
                className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20"
                >
                {loading ? "Sending..." : <><Send size={16} /> Send</>}
                </button>

                <button
                onClick={() => setShowCodeModal(true)}
                className="h-10 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 px-3 rounded flex items-center gap-2 font-medium transition-colors"
                title="Generate Code Snippets"
                >
                <Code size={18} />
                </button>

                <button
                onClick={() => setShowEnvModal(true)}
                className="h-10 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 px-3 rounded flex items-center gap-2 font-medium transition-colors"
                title="Manage Environment Variables"
                >
                <Database size={18} />
                </button>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                     {/* Proxy Toggle */}
                    <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none hover:text-gray-300 group" title="Use a CORS proxy to bypass browser restrictions">
                        <input
                            type="checkbox"
                            checked={useProxy}
                            onChange={(e) => setUseProxy(e.target.checked)}
                            className="rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                            <ShieldAlert size={14} />
                            <span>Browser Mode (CORS Proxy)</span>
                        </div>
                    </label>
                </div>
            </div>
        </div>

        {/* Main Content Split */}
        <div className="flex-1 flex overflow-hidden max-md:flex-col">
            {/* Request Panel */}
            <div className="w-1/2 max-md:w-full max-md:h-1/2 flex flex-col border-r max-md:border-r-0 max-md:border-b border-gray-700 bg-gray-800/50">
                <div className="flex border-b border-gray-700 bg-gray-800">
                    {["params", "auth", "headers", "body"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                        "px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors hover:text-white border-b-2",
                        activeTab === tab
                            ? "text-indigo-400 border-indigo-500 bg-gray-700/50"
                            : "text-gray-400 border-transparent hover:bg-gray-700/30"
                        )}
                    >
                        {tab}
                        {tab === "params" && params.some(p => p.key) && <span className="ml-1 text-[10px] text-indigo-400">●</span>}
                        {tab === "headers" && headers.some(h => h.key) && <span className="ml-1 text-[10px] text-indigo-400">●</span>}
                        {tab === "body" && bodyType !== "None" && <span className="ml-1 text-[10px] text-indigo-400">●</span>}
                        {tab === "auth" && authType !== "None" && <span className="ml-1 text-[10px] text-indigo-400">●</span>}
                    </button>
                    ))}
                </div>

                <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                    {activeTab === "params" && (
                        <KeyValueEditor
                            items={params}
                            onAdd={createAddHandler(setParams, params)}
                            onRemove={createRemoveHandler(setParams, params)}
                            onUpdate={createUpdateHandler(setParams, params)}
                            keyName="Query Param"
                        />
                    )}

                    {activeTab === "auth" && (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-400 font-medium">Authorization Type</label>
                                <select
                                    value={authType}
                                    onChange={(e) => setAuthType(e.target.value)}
                                    className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                >
                                    {authTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            {authType === "Bearer Token" && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-400 font-medium">Token</label>
                                    <input
                                        type="text"
                                        value={authToken}
                                        onChange={(e) => setAuthToken(e.target.value)}
                                        placeholder="Bearer Token"
                                        className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            )}

                            {authType === "Basic Auth" && (
                                <div className="flex gap-4">
                                    <div className="flex-1 flex flex-col gap-1">
                                        <label className="text-xs text-gray-400 font-medium">Username</label>
                                        <input
                                            type="text"
                                            value={authUsername}
                                            onChange={(e) => setAuthUsername(e.target.value)}
                                            placeholder="Username"
                                            className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <label className="text-xs text-gray-400 font-medium">Password</label>
                                        <input
                                            type="password"
                                            value={authPassword}
                                            onChange={(e) => setAuthPassword(e.target.value)}
                                            placeholder="Password"
                                            className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            )}

      {showEnvModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowEnvModal(false)}>
              <div className="bg-gray-800 border border-gray-700 rounded-lg w-[500px] max-h-[80vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900 rounded-t-lg">
                      <h3 className="font-bold flex items-center gap-2"><Database size={20} /> Environment Variables</h3>
                      <button onClick={() => setShowEnvModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                  </div>
                  <div className="p-4 overflow-auto custom-scrollbar">
                      <div className="text-xs text-gray-400 mb-4">
                          Define variables to reuse in URL, Headers, and Body using <span className="font-mono text-indigo-300">{"{{variable}}"}</span> syntax.
                      </div>
                      <KeyValueEditor
                          items={envVars}
                          onAdd={createAddHandler(setEnvVars, envVars)}
                          onRemove={createRemoveHandler(setEnvVars, envVars)}
                          onUpdate={createUpdateHandler(setEnvVars, envVars)}
                          keyName="Variable"
                      />
                  </div>
              </div>
          </div>
      )}

                            {authType === "API Key" && (
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1 flex flex-col gap-1">
                                        <label className="text-xs text-gray-400 font-medium">Key</label>
                                        <input
                                            type="text"
                                            value={apiKeyKey}
                                            onChange={(e) => setApiKeyKey(e.target.value)}
                                            placeholder="x-api-key"
                                            className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <label className="text-xs text-gray-400 font-medium">Value</label>
                                        <input
                                            type="text"
                                            value={apiKeyValue}
                                            onChange={(e) => setApiKeyValue(e.target.value)}
                                            placeholder="Value"
                                            className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                         <label className="text-xs text-gray-400 font-medium">Add to</label>
                                         <select
                                            value={apiKeyPlacement}
                                            onChange={(e) => setApiKeyPlacement(e.target.value)}
                                            className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                         >
                                             <option value="Header">Header</option>
                                             <option value="Query Params">Query Params</option>
                                         </select>
                                    </div>
                                </div>
                            )}

                            {authType === "None" && (
                                <div className="text-sm text-gray-500 text-center py-8">
                                    This request does not use any authorization.
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "headers" && (
                        <KeyValueEditor
                            items={headers}
                            onAdd={createAddHandler(setHeaders, headers)}
                            onRemove={createRemoveHandler(setHeaders, headers)}
                            onUpdate={createUpdateHandler(setHeaders, headers)}
                            keyName="Header"
                        />
                    )}

                    {activeTab === "body" && (
                        <div className="flex flex-col h-full gap-3">
                             <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="bodyType"
                                        id="bodyNone"
                                        checked={bodyType === "None"}
                                        onChange={() => setBodyType("None")}
                                        className="text-indigo-600 focus:ring-indigo-500 bg-gray-900 border-gray-700"
                                    />
                                    <label htmlFor="bodyNone" className="text-sm text-gray-300">None</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="bodyType"
                                        id="bodyRaw"
                                        checked={bodyType === "Raw (JSON)"}
                                        onChange={() => setBodyType("Raw (JSON)")}
                                        className="text-indigo-600 focus:ring-indigo-500 bg-gray-900 border-gray-700"
                                    />
                                    <label htmlFor="bodyRaw" className="text-sm text-gray-300">Raw (JSON)</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="bodyType"
                                        id="bodyForm"
                                        checked={bodyType === "x-www-form-urlencoded"}
                                        onChange={() => setBodyType("x-www-form-urlencoded")}
                                        className="text-indigo-600 focus:ring-indigo-500 bg-gray-900 border-gray-700"
                                    />
                                    <label htmlFor="bodyForm" className="text-sm text-gray-300">x-www-form-urlencoded</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="bodyType"
                                        id="bodyMultipart"
                                        checked={bodyType === "multipart/form-data"}
                                        onChange={() => setBodyType("multipart/form-data")}
                                        className="text-indigo-600 focus:ring-indigo-500 bg-gray-900 border-gray-700"
                                    />
                                    <label htmlFor="bodyMultipart" className="text-sm text-gray-300">multipart</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="bodyType"
                                        id="bodyBinary"
                                        checked={bodyType === "Binary File"}
                                        onChange={() => setBodyType("Binary File")}
                                        className="text-indigo-600 focus:ring-indigo-500 bg-gray-900 border-gray-700"
                                    />
                                    <label htmlFor="bodyBinary" className="text-sm text-gray-300">Binary</label>
                                </div>
                             </div>

                             <div className="flex-1 overflow-hidden rounded border border-gray-700 bg-gray-900">
                                {bodyType === "Raw (JSON)" && (
                                    <MonacoEditor
                                        language="json"
                                        theme="vs-dark"
                                        value={rawBody}
                                        onChange={(value) => setRawBody(value || "")}
                                        options={{ minimap: { enabled: false }, lineNumbers: "on", scrollBeyondLastLine: false, wordWrap: "on" }}
                                    />
                                )}
                                {bodyType === "x-www-form-urlencoded" && (
                                    <div className="p-4 overflow-auto h-full">
                                        <KeyValueEditor
                                            items={urlEncodedData}
                                            onAdd={createAddHandler(setUrlEncodedData, urlEncodedData)}
                                            onRemove={createRemoveHandler(setUrlEncodedData, urlEncodedData)}
                                            onUpdate={createUpdateHandler(setUrlEncodedData, urlEncodedData)}
                                            keyName="Field"
                                        />
                                    </div>
                                )}
                                {bodyType === "multipart/form-data" && (
                                    <div className="p-4 overflow-auto h-full">
                                        <FormDataEditor
                                            items={formData}
                                            onAdd={createAddHandler(setFormData, formData)}
                                            onRemove={createRemoveHandler(setFormData, formData)}
                                            onUpdate={(index, field, value) => {
                                                const newFormData = [...formData];
                                                newFormData[index][field] = value;
                                                setFormData(newFormData);
                                            }}
                                        />
                                    </div>
                                )}
                                {bodyType === "Binary File" && (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                                        <input
                                            type="file"
                                            onChange={(e) => setBinaryFile(e.target.files[0])}
                                            className="block w-full text-sm text-gray-400
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-indigo-600 file:text-white
                                                hover:file:bg-indigo-700
                                                cursor-pointer"
                                        />
                                        {binaryFile && <div className="mt-4 text-xs">Selected: {binaryFile.name} ({binaryFile.size} bytes)</div>}
                                    </div>
                                )}
                                {bodyType === "None" && (
                                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                                        This request does not have a body.
                                    </div>
                                )}
                             </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Response Panel */}
            <div className="w-1/2 max-md:w-full max-md:h-1/2 flex flex-col bg-gray-900 border-l max-md:border-l-0 border-gray-700">
                <div className="flex border-b border-gray-700 bg-gray-800 justify-between items-center h-[45px]">
                    <div className="flex overflow-x-auto hide-scrollbar">
                        {["body", "headers", "preview"].map((tab) => {
                             if (tab === "preview" && !response?.isHtml && !response?.isImage) return null;
                             return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveResponseTab(tab)}
                                    className={cn(
                                    "px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors hover:text-white border-b-2",
                                    activeResponseTab === tab
                                        ? "text-indigo-400 border-indigo-500 bg-gray-700/50"
                                        : "text-gray-400 border-transparent hover:bg-gray-700/30"
                                    )}
                                >
                                    {tab}
                                </button>
                             );
                        })}
                    </div>
                    {response && (
                    <div className="flex gap-3 text-xs font-mono px-4">
                        <span
                            className={cn("font-bold px-1.5 py-0.5 rounded bg-opacity-20 cursor-help",
                                response.status >= 200 && response.status < 300 ? "bg-green-500 text-green-400" :
                                response.status >= 300 && response.status < 400 ? "bg-blue-500 text-blue-400" :
                                response.status >= 400 && response.status < 500 ? "bg-yellow-500 text-yellow-400" : "bg-red-500 text-red-400"
                            )}
                            title={getStatusTooltip(response.status)}
                        >
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
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-20 backdrop-blur-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                    )}

                    {error && !loading && (
                        <div className="p-6 flex flex-col gap-4 text-sm max-w-lg mx-auto mt-10">
                            <div className="text-red-400 font-mono bg-red-900/20 p-4 rounded border border-red-900/50 flex gap-3 items-start">
                                <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-bold mb-1">Request Failed</div>
                                    <div>{error}</div>
                                </div>
                            </div>

                            <div className="bg-gray-800/50 p-4 rounded border border-gray-700 text-gray-300">
                                <div className="font-semibold text-yellow-500 mb-2 text-xs uppercase tracking-wide">Troubleshooting Guide</div>
                                <ul className="list-disc list-inside space-y-2 text-xs text-gray-400">
                                    <li>
                                        <span className="text-indigo-400 font-semibold">CORS Error?</span> Enable <span className="font-mono bg-gray-700 px-1 rounded">Browser Mode</span> (proxy) above if the API is public.
                                    </li>
                                    <li>
                                        <span className="text-indigo-400 font-semibold">Localhost?</span> The proxy cannot reach localhost. Ensure your local server allows CORS.
                                    </li>
                                    <li>
                                        <span className="text-indigo-400 font-semibold">Network?</span> Check your internet connection or the API URL.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {!response && !loading && !error && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600">
                        <Send size={48} className="mb-4 opacity-20" />
                        <p>Enter a URL and send request</p>
                    </div>
                    )}

                    {response && (
                        <div className="h-full flex flex-col">
                            {activeResponseTab === "preview" && (
                                <>
                                    {response.isImage ? (
                                        <div className="flex-1 flex items-center justify-center bg-gray-900 p-4 overflow-auto">
                                            <img src={response.data} alt="Response" className="max-w-full max-h-full object-contain border border-gray-700 shadow-lg rounded" />
                                        </div>
                                    ) : response.isHtml ? (
                                        <div className="flex-1 bg-white">
                                            <iframe
                                                srcDoc={response.data}
                                                title="HTML Preview"
                                                className="w-full h-full border-none"
                                                sandbox="allow-scripts"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-500">
                                            No preview available for this content type.
                                        </div>
                                    )}
                                </>
                            )}

                            {activeResponseTab === "body" && (
                                <MonacoEditor
                                    height="100%"
                                    language={response.isHtml ? "html" : "json"}
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
                                />
                            )}

                            {activeResponseTab === "headers" && (
                                <div className="p-4 overflow-auto h-full">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead>
                                            <tr>
                                                <th className="border-b border-gray-700 pb-2 text-gray-400 font-medium w-1/3">Key</th>
                                                <th className="border-b border-gray-700 pb-2 text-gray-400 font-medium">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(response.headers).map(([key, value]) => (
                                                <tr key={key} className="border-b border-gray-800 hover:bg-gray-800/50">
                                                    <td className="py-2 pr-4 text-indigo-300 font-mono text-xs">{key}</td>
                                                    <td className="py-2 text-gray-300 font-mono text-xs break-all">{value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
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
        <div key={index} className="flex gap-2 group">
          <input
            type="text"
            placeholder={keyName}
            value={item.key}
            onChange={(e) => onUpdate(index, "key", e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Value"
            value={item.value}
            onChange={(e) => onUpdate(index, "value", e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={() => onRemove(index)}
            className="w-8 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors opacity-50 group-hover:opacity-100"
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

function FormDataEditor({ items, onAdd, onRemove, onUpdate }) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 text-xs font-semibold text-gray-400 mb-1 px-1">
          <div className="flex-1">Key</div>
          <div className="w-20">Type</div>
          <div className="flex-1">Value</div>
          <div className="w-8"></div>
        </div>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 group items-center">
            <input
              type="text"
              placeholder="Key"
              value={item.key}
              onChange={(e) => onUpdate(index, "key", e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <select
                value={item.type}
                onChange={(e) => onUpdate(index, "type", e.target.value)}
                className="w-20 bg-gray-900 border border-gray-700 rounded px-1 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
            >
                <option value="text">Text</option>
                <option value="file">File</option>
            </select>
            {item.type === "text" ? (
                 <input
                 type="text"
                 placeholder="Value"
                 value={item.value}
                 onChange={(e) => onUpdate(index, "value", e.target.value)}
                 className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
               />
            ) : (
                <input
                    type="file"
                    onChange={(e) => onUpdate(index, "file", e.target.files[0])}
                    className="flex-1 text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-700 file:text-white hover:file:bg-gray-600"
                />
            )}

            <button
              onClick={() => onRemove(index)}
              className="w-8 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors opacity-50 group-hover:opacity-100"
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
          <Plus size={14} /> Add Field
        </button>
      </div>
    );
  }

  FormDataEditor.propTypes = {
    items: PropTypes.array.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  };
