"use client"
import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, Upload, Download, FileText, CheckCircle2, AlertCircle,
  ArrowRight, Loader2, ChevronDown, RefreshCw, Trash2
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "upload" | "mapping" | "preview" | "importing" | "results"

interface ParsedRow {
  [key: string]: string
}

interface ImportResult {
  total: number
  imported: number
  duplicates: number
  failed: number
  duration: number
  errors: string[]
}

interface CSVImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImportComplete: () => void
}

// ─── Expected fields ──────────────────────────────────────────────────────────
const TARGET_FIELDS = [
  { key: "name",      label: "Business Name",  required: true  },
  { key: "contactName", label: "Contact Name", required: false },
  { key: "email",     label: "Email",          required: false },
  { key: "phone",     label: "Phone",          required: false },
  { key: "website",   label: "Website",        required: false },
  { key: "category",  label: "Industry",       required: false },
  { key: "location",  label: "Location",       required: false },
  { key: "notes",     label: "Notes",          required: false },
  { key: "status",    label: "Lead Status",    required: false },
]

// ─── Template CSV ─────────────────────────────────────────────────────────────
const TEMPLATE_CSV = `Business Name,Contact Name,Email,Phone,Website,Industry,Location,Notes,Status
ABC Dental Clinic,Dr. Sharma,info@abcclinic.com,+919876543210,abcclinic.com,Healthcare,Delhi,No website found,New
City Roofing Co,Raj Kumar,raj@cityroofing.com,+919812345678,cityroofing.in,Construction,Mumbai,Poor SEO score,Qualified
Green Leaf Restaurant,,info@greenleaf.com,+919934567890,,Food & Beverage,Bangalore,,New
Metro Law Firm,Adv. Priya,priya@metrolaw.com,+911234567890,metrolaw.co.in,Legal,Chennai,High opportunity,Interested`

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "leadflow-import-template.csv"
  a.click()
  URL.revokeObjectURL(url)
}

// ─── CSV Parser ───────────────────────────────────────────────────────────────
function parseCSV(text: string): { headers: string[]; rows: ParsedRow[]; errors: string[] } {
  const errors: string[] = []
  const lines = text.split(/\r?\n/).filter(l => l.trim())
  if (lines.length < 2) return { headers: [], rows: [], errors: ["CSV must have at least a header row and one data row."] }

  const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, "").trim())
  const rows: ParsedRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(v => v.replace(/^"|"$/g, "").trim())
    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: column count mismatch (expected ${headers.length}, got ${values.length})`)
      continue
    }
    const row: ParsedRow = {}
    headers.forEach((h, j) => { row[h] = values[j] || "" })
    rows.push(row)
  }

  return { headers, rows, errors }
}

// ─── Auto-detect field mapping ────────────────────────────────────────────────
function autoDetect(csvHeaders: string[]): Record<string, string> {
  const mapping: Record<string, string> = {}
  const aliases: Record<string, string[]> = {
    name:        ["business name", "business", "company", "name", "company name", "organization"],
    contactName: ["contact name", "contact", "person", "full name", "owner"],
    email:       ["email", "email address", "e-mail", "mail"],
    phone:       ["phone", "phone number", "mobile", "telephone", "cell", "contact number"],
    website:     ["website", "url", "web", "site", "domain", "webpage"],
    category:    ["industry", "category", "sector", "type", "business type", "niche"],
    location:    ["location", "city", "address", "area", "region", "state", "country"],
    notes:       ["notes", "note", "remarks", "comments", "description"],
    status:      ["status", "lead status", "stage", "pipeline stage"],
  }
  csvHeaders.forEach(h => {
    const hl = h.toLowerCase()
    for (const [field, keys] of Object.entries(aliases)) {
      if (keys.includes(hl)) { mapping[h] = field; break }
    }
  })
  return mapping
}

// ─── Validate rows ─────────────────────────────────────────────────────────────
function validateRow(row: ParsedRow, mapping: Record<string, string>): string | null {
  const mapped: Record<string, string> = {}
  Object.entries(mapping).forEach(([csv, target]) => { if (target) mapped[target] = row[csv] || "" })
  if (!mapped.name?.trim()) return "Missing Business Name"
  if (mapped.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mapped.email)) return "Invalid email format"
  return null
}

// ─── Progress Step ────────────────────────────────────────────────────────────
function ProgressStep({ label, status }: { label: string; status: "pending" | "active" | "done" | "error" }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
        status === "done"    ? "bg-emerald-500" :
        status === "active"  ? "bg-indigo-600 animate-pulse" :
        status === "error"   ? "bg-red-500" :
                               "bg-gray-200"
      }`}>
        {status === "done"   && <CheckCircle2 className="h-4 w-4 text-white" />}
        {status === "active" && <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />}
        {status === "error"  && <AlertCircle className="h-4 w-4 text-white" />}
        {status === "pending" && <div className="w-2 h-2 rounded-full bg-gray-400" />}
      </div>
      <span className={`text-[13px] font-medium ${
        status === "done"   ? "text-emerald-700" :
        status === "active" ? "text-indigo-700 font-semibold" :
        status === "error"  ? "text-red-700" : "text-gray-400"
      }`}>{label}</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CSVImportModal({ isOpen, onClose, onImportComplete }: CSVImportModalProps) {
  const [step, setStep] = useState<Step>("upload")
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvRows, setCsvRows] = useState<ParsedRow[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [duplicateAction, setDuplicateAction] = useState<"skip" | "update" | "import">("skip")
  const [importSteps, setImportSteps] = useState<Record<string, "pending" | "active" | "done" | "error">>({
    parse: "pending", validate: "pending", duplicates: "pending", insert: "pending", enrich: "pending"
  })
  const [importProgress, setImportProgress] = useState(0)
  const [result, setResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Reset ──────────────────────────────────────────────────────────────────
  const reset = () => {
    setStep("upload"); setFile(null); setParseError(null); setCsvHeaders([])
    setCsvRows([]); setMapping({}); setResult(null); setImportProgress(0)
    setImportSteps({ parse: "pending", validate: "pending", duplicates: "pending", insert: "pending", enrich: "pending" })
  }

  const handleClose = () => { reset(); onClose() }

  // ── File Processing ────────────────────────────────────────────────────────
  const processFile = (f: File) => {
    setParseError(null)
    if (!f.name.match(/\.(csv|txt)$/i)) { setParseError("Only .csv files are supported."); return }
    if (f.size > 25 * 1024 * 1024) { setParseError("File exceeds 25 MB limit."); return }
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const { headers, rows, errors } = parseCSV(text)
      if (errors.length && rows.length === 0) { setParseError(errors[0]); return }
      setCsvHeaders(headers)
      setCsvRows(rows)
      setMapping(autoDetect(headers))
      setStep("mapping")
    }
    reader.readAsText(f)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) processFile(f)
  }, [])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) processFile(f)
    e.target.value = ""
  }

  // ── Validation summary ─────────────────────────────────────────────────────
  const validRows = csvRows.filter(r => !validateRow(r, mapping))
  const invalidRows = csvRows.length - validRows.length
  const mappedRequired = TARGET_FIELDS.filter(f => f.required).every(f =>
    Object.values(mapping).includes(f.key)
  )

  // ── Import ─────────────────────────────────────────────────────────────────
  const handleImport = async () => {
    setStep("importing")
    const start = Date.now()

    const stepOrder = ["parse", "validate", "duplicates", "insert", "enrich"]
    const advance = async (s: string, next?: string) => {
      setImportSteps(p => ({ ...p, [s]: "done", ...(next ? { [next]: "active" } : {}) }))
      setImportProgress(prev => Math.min(prev + 20, 95))
      await new Promise(r => setTimeout(r, 600))
    }

    setImportSteps(p => ({ ...p, parse: "active" }))
    await new Promise(r => setTimeout(r, 500))
    await advance("parse", "validate")
    await new Promise(r => setTimeout(r, 500))
    await advance("validate", "duplicates")
    await new Promise(r => setTimeout(r, 500))
    await advance("duplicates", "insert")

    // Build leads payload
    const leads = validRows.map(row => {
      const m: Record<string, string> = {}
      Object.entries(mapping).forEach(([csv, target]) => { if (target) m[target] = row[csv] || "" })
      return {
        name:     m.name || "Unknown",
        email:    m.email || "",
        phone:    m.phone || "",
        location: m.location || "",
        website:  m.website || "",
        category: m.category || "",
        notes:    m.notes || "",
        status:   m.status || "New",
        jobTitle: m.contactName ? "Contact" : "Owner / Manager",
      }
    })

    let imported = 0, duplicates = 0, failed = 0, errors: string[] = []
    const BATCH = 100

    for (let i = 0; i < leads.length; i += BATCH) {
      const batch = leads.slice(i, i + BATCH)
      try {
        const res = await fetch("/api/prospects/bulk/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leads: batch, duplicateAction }),
        })
        const json = await res.json()
        if (res.ok) {
          imported += json.saved ?? 0
          duplicates += json.duplicates ?? 0
          failed += json.failed ?? 0
          if (json.errors?.length) errors.push(...json.errors)
        } else {
          failed += batch.length
          errors.push(json.error || `Batch ${Math.ceil(i / BATCH) + 1} failed`)
        }
      } catch (e: any) {
        failed += batch.length
        errors.push(e.message || "Network error")
      }
      setImportProgress(Math.round(60 + (i / leads.length) * 35))
    }

    await advance("insert", "enrich")
    await new Promise(r => setTimeout(r, 800))
    setImportSteps(p => ({ ...p, enrich: "done" }))
    setImportProgress(100)

    const duration = Math.round((Date.now() - start) / 1000)
    setResult({ total: csvRows.length, imported, duplicates, failed, duration, errors })
    setStep("results")
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 className="text-[18px] font-bold text-gray-900">Import Prospects</h2>
              <p className="text-[13px] text-gray-500 mt-0.5">Upload a CSV file to add prospects to your CRM.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={downloadTemplate}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4" /> Template
              </button>
              <button onClick={handleClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* ── Step Indicator ── */}
          {step !== "importing" && step !== "results" && (
            <div className="flex items-center gap-2 px-7 py-3 border-b border-gray-50 bg-gray-50/40 flex-shrink-0">
              {[["upload","1","Upload"],["mapping","2","Map Fields"],["preview","3","Preview"]].map(([s, n, l], i, arr) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step === s ? 'bg-indigo-600 text-white' : ['upload','mapping','preview'].indexOf(step) > i ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {['upload','mapping','preview'].indexOf(step) > i ? '✓' : n}
                  </div>
                  <span className={`text-[12px] font-medium ${step === s ? 'text-indigo-700' : 'text-gray-400'}`}>{l}</span>
                  {i < arr.length - 1 && <div className="w-8 h-px bg-gray-200 mx-1" />}
                </div>
              ))}
            </div>
          )}

          {/* ── Body ── */}
          <div className="flex-1 overflow-y-auto">

            {/* STEP 1: UPLOAD */}
            {step === "upload" && (
              <div className="p-7 space-y-5">
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                    isDragging ? "border-indigo-400 bg-indigo-50 scale-[1.01]" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50/50"
                  }`}
                >
                  <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={onFileChange} />
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className={`h-7 w-7 ${isDragging ? "text-indigo-600" : "text-indigo-400"}`} />
                  </div>
                  <p className="text-[16px] font-semibold text-gray-800 mb-1">Drag & Drop your CSV here</p>
                  <p className="text-[13px] text-gray-500">or <span className="text-indigo-600 font-semibold">browse files</span></p>
                  <p className="text-[12px] text-gray-400 mt-3">Supports .csv · Max 25 MB</p>
                </div>

                {parseError && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-[13px] text-red-700 font-medium">{parseError}</p>
                  </div>
                )}

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-[12px] font-semibold text-blue-700 mb-2">Expected columns (download template above):</p>
                  <div className="flex flex-wrap gap-1.5">
                    {TARGET_FIELDS.map(f => (
                      <span key={f.key} className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${f.required ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-600 border border-gray-200'}`}>
                        {f.label}{f.required ? ' *' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: FIELD MAPPING */}
            {step === "mapping" && (
              <div className="p-7 space-y-5">
                <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <FileText className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-emerald-800">{file?.name}</p>
                    <p className="text-[12px] text-emerald-600">{csvRows.length} rows · {csvHeaders.length} columns detected</p>
                  </div>
                  <button onClick={reset} className="p-1.5 hover:bg-emerald-100 rounded-lg"><Trash2 className="h-4 w-4 text-emerald-600" /></button>
                </div>

                <div>
                  <p className="text-[13px] font-semibold text-gray-700 mb-3">Map CSV columns to CRM fields</p>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {csvHeaders.map(h => (
                      <div key={h} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <div className="px-3 py-2 bg-gray-100 rounded-lg text-[13px] font-medium text-gray-700 truncate">{h}</div>
                        <ArrowRight className="h-4 w-4 text-gray-300 flex-shrink-0" />
                        <div className="relative">
                          <select
                            value={mapping[h] || ""}
                            onChange={e => setMapping(p => ({ ...p, [h]: e.target.value }))}
                            className="w-full appearance-none px-3 py-2 pr-8 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 cursor-pointer"
                          >
                            <option value="">— Skip this column —</option>
                            {TARGET_FIELDS.map(f => (
                              <option key={f.key} value={f.key}>{f.label}{f.required ? ' *' : ''}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {!mappedRequired && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <p className="text-[12px] text-amber-700 font-medium">Map "Business Name" (required) to continue.</p>
                  </div>
                )}

                <div>
                  <p className="text-[13px] font-semibold text-gray-700 mb-2">Duplicate handling</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { v: "skip",   l: "Skip Duplicates",   d: "Don't import existing records" },
                      { v: "update", l: "Update Existing",   d: "Overwrite matching records" },
                      { v: "import", l: "Import Anyway",     d: "Allow duplicates" },
                    ].map(o => (
                      <button key={o.v} onClick={() => setDuplicateAction(o.v as any)}
                        className={`p-3 border rounded-xl text-left transition-all ${duplicateAction === o.v ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <p className={`text-[12px] font-semibold ${duplicateAction === o.v ? 'text-indigo-700' : 'text-gray-700'}`}>{o.l}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{o.d}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PREVIEW */}
            {step === "preview" && (
              <div className="p-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-gray-800">Data Preview</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">Showing first {Math.min(20, csvRows.length)} of {csvRows.length} rows · {invalidRows} invalid rows will be skipped</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[12px] font-semibold rounded-full border border-emerald-100">{validRows.length} Valid</span>
                    {invalidRows > 0 && <span className="px-3 py-1 bg-red-50 text-red-600 text-[12px] font-semibold rounded-full border border-red-100">{invalidRows} Invalid</span>}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto max-h-80">
                    <table className="w-full text-left text-[12px]">
                      <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                        <tr>
                          <th className="px-3 py-2.5 font-semibold text-gray-500 whitespace-nowrap">#</th>
                          {Object.entries(mapping).filter(([, v]) => v).map(([csv, target]) => {
                            const field = TARGET_FIELDS.find(f => f.key === target)
                            return <th key={csv} className="px-3 py-2.5 font-semibold text-gray-500 whitespace-nowrap">{field?.label || target}</th>
                          })}
                          <th className="px-3 py-2.5 font-semibold text-gray-500">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {csvRows.slice(0, 20).map((row, idx) => {
                          const err = validateRow(row, mapping)
                          return (
                            <tr key={idx} className={err ? "bg-red-50/50" : "bg-white hover:bg-gray-50/50"}>
                              <td className="px-3 py-2 text-gray-400">{idx + 1}</td>
                              {Object.entries(mapping).filter(([, v]) => v).map(([csv]) => (
                                <td key={csv} className="px-3 py-2 text-gray-700 truncate max-w-[140px]">{row[csv] || <span className="text-gray-300">—</span>}</td>
                              ))}
                              <td className="px-3 py-2">
                                {err
                                  ? <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-semibold" title={err}>Invalid</span>
                                  : <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-semibold">Ready</span>}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: IMPORTING */}
            {step === "importing" && (
              <div className="p-10 flex flex-col items-center">
                <div className="w-full max-w-sm">
                  <div className="mb-6 text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                    </div>
                    <p className="text-[16px] font-bold text-gray-900">Importing Prospects</p>
                    <p className="text-[13px] text-gray-500 mt-1">{validRows.length} records being processed…</p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      animate={{ width: `${importProgress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: "parse",      label: "Parsing CSV File" },
                      { key: "validate",   label: "Validating Records" },
                      { key: "duplicates", label: "Checking Duplicates" },
                      { key: "insert",     label: "Saving to Database" },
                      { key: "enrich",     label: "Running Enrichment" },
                    ].map(s => <ProgressStep key={s.key} label={s.label} status={importSteps[s.key] as any} />)}
                  </div>

                  <p className="text-[12px] text-gray-400 text-center mt-6">{importProgress}% complete</p>
                </div>
              </div>
            )}

            {/* STEP 5: RESULTS */}
            {step === "results" && result && (
              <div className="p-7 space-y-5">
                <div className={`p-5 rounded-2xl border ${result.failed === 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${result.failed === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                      {result.failed === 0 ? <CheckCircle2 className="h-5 w-5 text-white" /> : <AlertCircle className="h-5 w-5 text-white" />}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-gray-900">Import {result.failed === 0 ? 'Completed!' : 'Completed with Warnings'}</p>
                      <p className="text-[12px] text-gray-500">Finished in {result.duration}s</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "Total Rows",      value: result.total,      color: "text-gray-900", bg: "bg-white" },
                      { label: "Imported",        value: result.imported,   color: "text-emerald-700", bg: "bg-emerald-100" },
                      { label: "Duplicates",      value: result.duplicates, color: "text-amber-700", bg: "bg-amber-100" },
                      { label: "Failed",          value: result.failed,     color: "text-red-700", bg: "bg-red-100" },
                    ].map(stat => (
                      <div key={stat.label} className={`${stat.bg} rounded-xl p-3 text-center`}>
                        <p className={`text-[22px] font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {result.errors.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-[12px] font-semibold text-red-700 mb-2">Errors:</p>
                    <ul className="space-y-1">
                      {result.errors.slice(0, 5).map((e, i) => (
                        <li key={i} className="text-[12px] text-red-600">• {e}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.imported > 0 && (
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3">
                    <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                    <p className="text-[13px] text-indigo-700 font-medium">SEO analysis running in background for {result.imported} prospects…</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50/30">
            <div>
              {step !== "upload" && step !== "importing" && step !== "results" && (
                <button onClick={() => setStep(step === "mapping" ? "upload" : "mapping")}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-white transition-colors">
                  ← Back
                </button>
              )}
              {step === "results" && (
                <button onClick={reset} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-white transition-colors">
                  <RefreshCw className="h-4 w-4" /> Import Another
                </button>
              )}
            </div>
            <div className="flex gap-3">
              {step !== "importing" && step !== "results" && (
                <button onClick={handleClose} className="px-4 py-2.5 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
              )}
              {step === "mapping" && (
                <button onClick={() => setStep("preview")} disabled={!mappedRequired}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-50">
                  Preview Data <ArrowRight className="h-4 w-4" />
                </button>
              )}
              {step === "preview" && (
                <button onClick={handleImport} disabled={validRows.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[13px] font-bold transition-colors shadow-md shadow-indigo-500/25 disabled:opacity-50">
                  <Upload className="h-4 w-4" /> Import {validRows.length} Prospects
                </button>
              )}
              {step === "results" && (
                <button onClick={() => { onImportComplete(); handleClose() }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-[13px] font-bold transition-colors">
                  <CheckCircle2 className="h-4 w-4" /> View Prospects
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
