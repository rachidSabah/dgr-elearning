"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { useAppStore } from "@/lib/store";
import { courseData } from "@/lib/course-data";
import { t } from "@/lib/i18n";
import { motion } from "framer-motion";
import {
  Award,
  Printer,
  Download,
  Plane,
  GraduationCap,
  Calendar,
  Hash,
  Trophy,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CertificateView() {
  const { progress, studentName, language, setView } = useAppStore();
  const lang = language || "en";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const examScore = progress.examScore;
  const scorePct = examScore ? Math.round((examScore.score / examScore.total) * 100) : 0;
  const completionDate = examScore ? new Date(examScore.date).toLocaleDateString(lang === "fr" ? "fr-FR" : lang === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" }) : new Date().toLocaleDateString();
  const certNumber = progress.certificateNumber || "DGR-PENDING";

  useEffect(() => {
    // Generate QR code
    const verifyData = JSON.stringify({
      cert: certNumber,
      name: studentName || "Learner",
      score: scorePct,
      date: completionDate,
      course: "DGR-2024",
    });
    QRCode.toDataURL(verifyData, { width: 200, margin: 1, color: { dark: "#0f172a", light: "#ffffff" } })
      .then((url) => setQrDataUrl(url))
      .catch(() => {});
  }, [certNumber, studentName, scorePct, completionDate]);

  // Not eligible view
  if (!progress.certificateEarned || !examScore) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="pt-12 pb-12">
              <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Award className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Certificate Not Available Yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Pass the final exam with at least 70% to earn your certificate of completion.
              </p>
              <Button onClick={() => setView("exam")} className="gap-2">
                <GraduationCap className="h-5 w-5" />
                {t(lang, "startFinalExam")}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create downloadable certificate as image
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1200, 850);

    // Border
    ctx.strokeStyle = "#0ea5e9";
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 1160, 810);

    // Inner border
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 1120, 770);

    // Header
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 48px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Certificate of Completion", 600, 130);

    // Subtitle
    ctx.fillStyle = "#64748b";
    ctx.font = "20px Inter, sans-serif";
    ctx.fillText("This certificate is proudly presented to", 600, 200);

    // Name
    ctx.fillStyle = "#0ea5e9";
    ctx.font = "bold 56px Inter, sans-serif";
    ctx.fillText(studentName || "Learner", 600, 280);

    // Divider
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(400, 320);
    ctx.lineTo(800, 320);
    ctx.stroke();

    // Body
    ctx.fillStyle = "#0f172a";
    ctx.font = "22px Inter, sans-serif";
    ctx.fillText("has successfully completed", 600, 380);

    ctx.font = "bold 28px Inter, sans-serif";
    ctx.fillText(courseData.title, 600, 420);
    ctx.font = "20px Inter, sans-serif";
    ctx.fillText(courseData.subtitle, 600, 455);

    // Stats
    ctx.font = "18px Inter, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`Final Score: ${scorePct}%`, 600, 530);
    ctx.fillText(`Completion Date: ${completionDate}`, 600, 565);
    ctx.fillText(`Certificate Number: ${certNumber}`, 600, 600);

    // Footer
    ctx.fillStyle = "#0f172a";
    ctx.font = "16px Inter, sans-serif";
    ctx.fillText(courseData.edition + " | Based on ICAO Technical Instructions & IATA DGR", 600, 720);

    // Download
    const link = document.createElement("a");
    link.download = `DGR-Certificate-${certNumber}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6 no-print">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Award className="h-6 w-6 text-yellow-500" />
          {t(lang, "certificateTitle")}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Certificate */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="print-area"
      >
        <Card className="overflow-hidden">
          <div className="relative bg-white p-8 md:p-12">
            {/* Decorative borders */}
            <div className="absolute inset-2 border-4 border-yellow-500/30 rounded-lg pointer-events-none" />
            <div className="absolute inset-4 border-2 border-primary/20 rounded-lg pointer-events-none" />

            {/* Corner decorations */}
            <div className="absolute top-6 left-6 w-16 h-16 border-t-4 border-l-4 border-yellow-500/50 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4 border-yellow-500/50 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-16 h-16 border-b-4 border-l-4 border-yellow-500/50 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-4 border-r-4 border-yellow-500/50 rounded-br-lg pointer-events-none" />

            <div className="relative text-center">
              {/* Logo and header */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <Plane className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">DGR eLearning Platform</div>
                  <div className="text-xs text-muted-foreground">Aviation Training Authority</div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-4">
                <ShieldCheck className="h-4 w-4 text-yellow-600" />
                <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">
                  Verified Certificate
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">
                {t(lang, "certificateTitle")}
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-primary to-chart-4 mx-auto mb-6" />

              {/* Presented to */}
              <p className="text-muted-foreground mb-2">{t(lang, "presentedTo")}</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                {studentName || "Learner"}
              </h2>
              <div className="w-48 h-0.5 bg-yellow-500/50 mx-auto mb-6" />

              {/* Course completion */}
              <p className="text-muted-foreground mb-2">{t(lang, "hasSuccessfullyCompleted")}</p>
              <h3 className="text-xl md:text-2xl font-semibold mb-1">{courseData.title}</h3>
              <p className="text-sm text-muted-foreground mb-8">{courseData.subtitle}</p>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold">{scorePct}%</div>
                  <div className="text-xs text-muted-foreground">{t(lang, "finalScore")}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm font-semibold">{completionDate}</div>
                  <div className="text-xs text-muted-foreground">{t(lang, "completionDate")}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Hash className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-xs font-mono font-bold">{certNumber}</div>
                  <div className="text-xs text-muted-foreground">{t(lang, "certificateNumber")}</div>
                </div>
              </div>

              {/* QR Code */}
              {qrDataUrl && (
                <div className="flex flex-col items-center mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt="Certificate verification QR"
                    className="w-32 h-32 border-2 border-muted rounded-lg p-1"
                  />
                  <p className="text-xs text-muted-foreground mt-2">{t(lang, "verifyCertificate")}</p>
                </div>
              )}

              {/* Signatures */}
              <div className="flex justify-around items-end mt-8 pt-6 border-t">
                <div className="text-center">
                  <div className="text-sm font-serif italic mb-1">Aviation Training Authority</div>
                  <div className="w-40 h-0.5 bg-foreground/30 mb-1" />
                  <div className="text-xs text-muted-foreground">Training Director</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-serif italic mb-1">{courseData.edition}</div>
                  <div className="w-40 h-0.5 bg-foreground/30 mb-1" />
                  <div className="text-xs text-muted-foreground">Edition</div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-6 max-w-xl mx-auto">
                This certificate verifies the successful completion of the Dangerous Goods Regulations
                training program based on ICAO Technical Instructions and IATA Dangerous Goods Regulations.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
