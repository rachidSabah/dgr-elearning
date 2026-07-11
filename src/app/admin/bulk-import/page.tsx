"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  UploadCloud,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Users,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { initializeAuth, createUser, type AuthUser } from "@/lib/client-auth";

interface ParsedUser {
  row: number;
  name: string;
  email: string;
  password: string;
  role: AuthUser["role"];
  department: string;
  status: "pending" | "success" | "error";
  error?: string;
}

const TEMPLATE_CSV = `name,email,password,role,department
John Doe,john.doe@example.com,Password@123,STUDENT,Cabin Crew
Jane Smith,jane.smith@example.com,Password@123,INSTRUCTOR,Safety Training
Ahmed Hassan,ahmed@example.com,Password@123,STUDENT,Ground Operations`;

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") {
        cells.push(cur);
        cur = "";
      } else cur += ch;
    }
  }
  cells.push(cur);
  return cells.map((c) => c.trim());
}

function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  // Strip BOM if present
  const clean = text.replace(/^\uFEFF/, "");
  const lines = clean.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());
  const rows = lines.slice(1).map((l) => parseCsvLine(l));
  return { headers, rows };
}

const VALID_ROLES: AuthUser["role"][] = ["SUPER_ADMIN", "ACADEMY_ADMIN", "INSTRUCTOR", "STUDENT", "CONTENT_EDITOR"];

export default function BulkImportPage() {
  const [parsed, setParsed] = useState<ParsedUser[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setImported(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = String(e.target?.result || "");
        const { headers, rows } = parseCsv(text);
        if (headers.length < 5) {
          toast.error("Invalid CSV format", {
            description: "Expected headers: name,email,password,role,department",
          });
          setParsed([]);
          return;
        }
        const nameIdx = headers.indexOf("name");
        const emailIdx = headers.indexOf("email");
        const passwordIdx = headers.indexOf("password");
        const roleIdx = headers.indexOf("role");
        const departmentIdx = headers.indexOf("department");
        if (nameIdx < 0 || emailIdx < 0 || passwordIdx < 0 || roleIdx < 0) {
          toast.error("Missing required columns", {
            description: "Required: name, email, password, role",
          });
          setParsed([]);
          return;
        }
        const users: ParsedUser[] = rows.map((cells, i) => {
          const name = cells[nameIdx] || "";
          const email = cells[emailIdx] || "";
          const password = cells[passwordIdx] || "";
          const roleRaw = (cells[roleIdx] || "STUDENT").toUpperCase();
          const role = (VALID_ROLES.includes(roleRaw as AuthUser["role"]) ? roleRaw : "STUDENT") as AuthUser["role"];
          const department = departmentIdx >= 0 ? cells[departmentIdx] || "" : "";
          return {
            row: i + 2,
            name,
            email,
            password,
            role,
            department,
            status: "pending" as const,
          };
        });
        // Validate
        const seenEmails = new Set<string>();
        for (const u of users) {
          if (!u.name) u.error = "Name is required";
          else if (!u.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email)) u.error = "Invalid email";
          else if (seenEmails.has(u.email.toLowerCase())) u.error = "Duplicate email in file";
          else if (u.password.length < 4) u.error = "Password too short (min 4 chars)";
          else u.error = undefined;
          if (u.error) u.status = "error";
          seenEmails.add(u.email.toLowerCase());
        }
        setParsed(users);
        const errorCount = users.filter((u) => u.status === "error").length;
        if (errorCount > 0) {
          toast.warning(`Parsed ${users.length} rows`, { description: `${errorCount} row(s) have validation errors` });
        } else {
          toast.success(`Parsed ${users.length} rows successfully`);
        }
      } catch (err) {
        toast.error("Failed to parse CSV", { description: err instanceof Error ? err.message : "" });
        setParsed([]);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    const validUsers = parsed.filter((u) => u.status !== "error");
    if (validUsers.length === 0) {
      toast.error("No valid users to import");
      return;
    }
    setImporting(true);
    let successCount = 0;
    let errorCount = 0;
    const updated = [...parsed];

    for (let i = 0; i < validUsers.length; i++) {
      const u = validUsers[i];
      const idx = updated.findIndex((p) => p.row === u.row);
      const result = createUser({
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
        department: u.department || undefined,
      });
      if (result.success) {
        updated[idx] = { ...u, status: "success" };
        successCount++;
      } else {
        updated[idx] = { ...u, status: "error", error: result.error || "Failed" };
        errorCount++;
      }
      setParsed([...updated]);
      // Small delay so UI can update
      await new Promise((r) => setTimeout(r, 10));
    }
    setImporting(false);
    setImported(true);
    if (errorCount === 0) {
      toast.success(`Imported ${successCount} users successfully`);
    } else {
      toast.warning(`Imported ${successCount} users`, { description: `${errorCount} failed (see table)` });
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dgr-academy-bulk-import-template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Template downloaded");
  };

  const handleReset = () => {
    setParsed([]);
    setFileName("");
    setImported(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const successCount = parsed.filter((u) => u.status === "success").length;
  const errorCount = parsed.filter((u) => u.status === "error").length;
  const pendingCount = parsed.filter((u) => u.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Bulk User Import</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload a CSV file to create multiple student or instructor accounts at once.
        </p>
      </div>

      {/* CSV format info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            CSV Format
          </CardTitle>
          <CardDescription>Required columns (in any order, header row required)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="outline">name</Badge>
            <Badge variant="outline">email</Badge>
            <Badge variant="outline">password</Badge>
            <Badge variant="outline">role</Badge>
            <Badge variant="outline" className="opacity-70">department (optional)</Badge>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p>
              <strong>role</strong> must be one of: <code>SUPER_ADMIN</code>, <code>ACADEMY_ADMIN</code>,{" "}
              <code>INSTRUCTOR</code>, <code>STUDENT</code>, <code>CONTENT_EDITOR</code>.
            </p>
            <p>Wrap fields containing commas in double quotes. Download the template for an example.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="mt-3 gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Download Template
          </Button>
        </CardContent>
      </Card>

      {/* Upload */}
      <Card>
        <CardContent className="pt-6">
          <div
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:border-sky-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-sky-500", "bg-sky-50", "dark:bg-sky-950/20");
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove("border-sky-500", "bg-sky-50", "dark:bg-sky-950/20");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-sky-500", "bg-sky-50", "dark:bg-sky-950/20");
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <UploadCloud className="h-12 w-12 mx-auto mb-3 text-slate-400" />
            <p className="text-sm font-medium">
              {fileName ? (
                <>Selected: <span className="text-sky-600 dark:text-sky-400">{fileName}</span></>
              ) : (
                "Click to select a CSV file or drag and drop"
              )}
            </p>
            <p className="text-xs text-slate-500 mt-1">CSV files only. Max ~1000 rows.</p>
          </div>
        </CardContent>
      </Card>

      {/* Parsed preview */}
      {parsed.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  Preview ({parsed.length} rows)
                </CardTitle>
                <CardDescription className="mt-1">
                  Review the parsed users before importing.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {successCount > 0 && <Badge className="bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30">{successCount} imported</Badge>}
                {errorCount > 0 && <Badge className="bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30">{errorCount} errors</Badge>}
                {pendingCount > 0 && <Badge variant="outline">{pendingCount} pending</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-[28rem] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-card">
                  <TableRow>
                    <TableHead className="w-12">Row</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="w-32">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsed.map((u) => (
                    <TableRow key={u.row}>
                      <TableCell className="text-xs text-slate-400">{u.row}</TableCell>
                      <TableCell className="font-medium text-sm">{u.name || <span className="text-red-500 italic">missing</span>}</TableCell>
                      <TableCell className="text-sm">{u.email || <span className="text-red-500 italic">missing</span>}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{u.role}</Badge></TableCell>
                      <TableCell className="text-sm">{u.department || <span className="text-slate-400">—</span>}</TableCell>
                      <TableCell>
                        {u.status === "success" && (
                          <Badge className="bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30 gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Created
                          </Badge>
                        )}
                        {u.status === "error" && (
                          <Badge className="bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30 gap-1" title={u.error}>
                            <XCircle className="h-3 w-3" />
                            Error
                          </Badge>
                        )}
                        {u.status === "pending" && (
                          <Badge variant="outline" className="gap-1">
                            <Loader2 className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Error details */}
            {errorCount > 0 && (
              <div className="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-xs">
                <div className="flex items-center gap-1.5 text-red-700 dark:text-red-300 font-medium mb-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Errors
                </div>
                <ul className="space-y-0.5 text-slate-600 dark:text-slate-400">
                  {parsed.filter((u) => u.status === "error").slice(0, 5).map((u) => (
                    <li key={u.row}>Row {u.row} ({u.email || "no email"}): {u.error}</li>
                  ))}
                  {errorCount > 5 && <li className="italic">...and {errorCount - 5} more</li>}
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <Button
                onClick={handleImport}
                disabled={importing || pendingCount === 0}
                className="gap-1.5"
              >
                {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {importing ? "Importing..." : `Import ${pendingCount} User${pendingCount === 1 ? "" : "s"}`}
              </Button>
              <Button variant="outline" onClick={handleReset} className="gap-1.5">
                <Trash2 className="h-3.5 w-3.5" />
                Reset
              </Button>
              {imported && pendingCount === 0 && (
                <Badge className="bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Import complete
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
