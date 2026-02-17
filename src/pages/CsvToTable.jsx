import { useState, useMemo } from "react";
import MonacoEditor from "@monaco-editor/react";
import EditorSplitViewLayout from "@/components/EditorSplitViewLayout";
import CopyBtn from "@/common/CopyBtn";
import useLocalStorageState from "@/hooks/useLocalStorageState";

const defaultCSV = `Name,Age,Country
John Doe,30,USA
Jane Smith,25,Canada
"Bob, the builder",40,UK
`;

const CsvToTable = () => {
  const [csv, setCsv] = useLocalStorageState("CsvToTable_Input", defaultCSV);
  const [outputFormat, setOutputFormat] = useLocalStorageState(
    "CsvToTable_Format",
    "markdown"
  );
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeader, setHasHeader] = useState(true);

  const parsedData = useMemo(() => {
    return parseCSV(csv, delimiter);
  }, [csv, delimiter]);

  const output = useMemo(() => {
    if (!parsedData || parsedData.length === 0) return "";
    switch (outputFormat) {
      case "ascii":
        return csvToAscii(parsedData, hasHeader);
      case "markdown":
        return csvToMarkdown(parsedData, hasHeader);
      case "html":
        return csvToHtml(parsedData, hasHeader);
      case "json":
        return csvToJson(parsedData, hasHeader);
      case "sql":
        return csvToSql(parsedData, hasHeader);
      default:
        return "";
    }
  }, [parsedData, outputFormat, hasHeader]);

  const styles = {
    btnsClass:
      "rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
    selectClass:
      "rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 w-32",
    checkboxLabel: "text-white text-sm flex items-center gap-2",
  };

  return (
    <EditorSplitViewLayout
      editorBtns={
        <div className="flex items-center gap-4 w-full px-2">
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className={styles.selectClass}
          >
            <option value="markdown">Markdown</option>
            <option value="ascii">ASCII</option>
            <option value="html">HTML</option>
            <option value="json">JSON</option>
            <option value="sql">SQL</option>
          </select>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={hasHeader}
              onChange={(e) => setHasHeader(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            Header
          </label>

           <div className="flex-grow"></div>

          <button
            className={styles.btnsClass}
            onClick={() => setCsv("")}
            disabled={csv === ""}
          >
            Clear
          </button>
           <CopyBtn
            copyText={output}
            className={styles.btnsClass + " !h-full"}
            disabled={output === ""}
          />
        </div>
      }
      editor={
        <MonacoEditor
          language="csv"
          theme="vs-dark"
          options={{ minimap: { enabled: false }, lineNumbers: true }}
          onChange={(value) => setCsv(value || "")}
          value={csv}
        />
      }
      preview={
        <MonacoEditor
          language={getLanguage(outputFormat)}
          theme="vs-dark"
          options={{ minimap: { enabled: false }, lineNumbers: true, readOnly: true }}
          value={output}
        />
      }
    />
  );
};

// Utils

function getLanguage(format) {
    switch (format) {
        case "markdown": return "markdown";
        case "html": return "html";
        case "json": return "json";
        case "sql": return "sql";
        default: return "plaintext";
    }
}

function parseCSV(text, delimiter = ",") {
  const rows = [];
  let row = [];
  let col = "";
  let insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        col += '"';
        i++;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === delimiter && !insideQuote) {
      row.push(col);
      col = "";
    } else if ((char === "\n" || char === "\r") && !insideQuote) {
      if (char === "\r" && nextChar === "\n") i++;
      row.push(col);
      rows.push(row);
      row = [];
      col = "";
    } else {
      col += char;
    }
  }
  if (col || row.length > 0) {
      row.push(col);
      rows.push(row);
  }
  // Remove empty last row if it exists (common with trailing newline)
  if (rows.length > 0 && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === "") {
      rows.pop();
  }

  return rows;
}

function csvToMarkdown(data, hasHeader) {
  if (data.length === 0) return "";
  const header = hasHeader ? data[0] : data[0].map((_, i) => `Col ${i + 1}`);
  const rows = hasHeader ? data.slice(1) : data;

  const lengths = header.map((h, i) => {
      let max = h.length;
      rows.forEach(row => {
          if (row[i] && row[i].length > max) max = row[i].length;
      });
      return max;
  });

  const pad = (str, len) => (str || "").padEnd(len);

  const headerRow = `| ${header.map((h, i) => pad(h, lengths[i])).join(" | ")} |`;
  const separatorRow = `| ${lengths.map(l => "-".repeat(l)).join(" | ")} |`;
  const bodyRows = rows.map(row => `| ${row.map((c, i) => pad(c, lengths[i])).join(" | ")} |`).join("\n");

  return `${headerRow}\n${separatorRow}\n${bodyRows}`;
}

function csvToAscii(data, hasHeader) {
    if (data.length === 0) return "";
    const header = hasHeader ? data[0] : data[0].map((_, i) => `Col ${i + 1}`);
    const rows = hasHeader ? data.slice(1) : data;

    const lengths = header.map((h, i) => {
        let max = h.length;
        rows.forEach(row => {
            if (row[i] && row[i].length > max) max = row[i].length;
        });
        return max;
    });

    const pad = (str, len) => (str || "").padEnd(len);

    const separator = `+${lengths.map(l => "-".repeat(l + 2)).join("+")}+`;
    const headerRow = `| ${header.map((h, i) => pad(h, lengths[i])).join(" | ")} |`;
    const bodyRows = rows.map(row => `| ${row.map((c, i) => pad(c, lengths[i])).join(" | ")} |`).join(`\n${separator}\n`);

    // Simple ASCII grid
    // +-------+-----+
    // | Name  | Age |
    // +-------+-----+
    // | Alice | 20  |
    // +-------+-----+

    let result = separator + "\n" + headerRow + "\n" + separator + "\n";
    rows.forEach(row => {
         result += `| ${row.map((c, i) => pad(c, lengths[i])).join(" | ")} |\n`;
         result += separator + "\n";
    });
    return result;
}

function csvToHtml(data, hasHeader) {
    if (data.length === 0) return "";
    let html = "<table>\n";

    if (hasHeader) {
        html += "  <thead>\n    <tr>\n";
        data[0].forEach(cell => {
            html += `      <th>${escapeHtml(cell)}</th>\n`;
        });
        html += "    </tr>\n  </thead>\n";
    }

    html += "  <tbody>\n";
    const rows = hasHeader ? data.slice(1) : data;
    rows.forEach(row => {
        html += "    <tr>\n";
        row.forEach(cell => {
            html += `      <td>${escapeHtml(cell)}</td>\n`;
        });
        html += "    </tr>\n";
    });
    html += "  </tbody>\n</table>";
    return html;
}

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function csvToJson(data, hasHeader) {
    if (data.length === 0) return "[]";
    if (!hasHeader) {
        return JSON.stringify(data, null, 2);
    }

    const header = data[0];
    const rows = data.slice(1);
    const result = rows.map(row => {
        const obj = {};
        header.forEach((h, i) => {
            obj[h] = row[i];
        });
        return obj;
    });
    return JSON.stringify(result, null, 2);
}

function csvToSql(data, hasHeader) {
    if (data.length === 0) return "";
    const tableName = "TABLE_NAME";
    const header = hasHeader ? data[0] : data[0].map((_, i) => `col_${i + 1}`);
    const rows = hasHeader ? data.slice(1) : data;

    let sql = `CREATE TABLE ${tableName} (\n`;
    sql += header.map(h => `  ${h.replace(/[^a-zA-Z0-9_]/g, "_")} VARCHAR(255)`).join(",\n");
    sql += "\n);\n\n";

    sql += `INSERT INTO ${tableName} (${header.map(h => h.replace(/[^a-zA-Z0-9_]/g, "_")).join(", ")}) VALUES\n`;
    const values = rows.map(row => {
        return `(${row.map(cell => `'${(cell || "").replace(/'/g, "''")}'`).join(", ")})`;
    });
    sql += values.join(",\n") + ";";

    return sql;
}

export default CsvToTable;
