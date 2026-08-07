/**
 * src/features/resume-builder/components/Preview/A4Sheet.jsx
 * Dynamic A4 Sheet selector rendering any of the 6 enterprise ATS template layouts with page break rules.
 */

import React from "react";
import ProfessionalTemplate from "../Templates/ProfessionalTemplate";
import ModernTemplate from "../Templates/ModernTemplate";
import MinimalTemplate from "../Templates/MinimalTemplate";
import SoftwareEngineerTemplate from "../Templates/SoftwareEngineerTemplate";
import CorporateTemplate from "../Templates/CorporateTemplate";
import CreativeTemplate from "../Templates/CreativeTemplate";

export default function A4Sheet({ resume }) {
  if (!resume) return null;

  const templateId = resume.templateId || "professional";

  const renderTemplate = () => {
    switch (templateId) {
      case "modern":
        return <ModernTemplate resume={resume} />;
      case "minimal":
        return <MinimalTemplate resume={resume} />;
      case "software_engineer":
        return <SoftwareEngineerTemplate resume={resume} />;
      case "corporate":
        return <CorporateTemplate resume={resume} />;
      case "creative":
        return <CreativeTemplate resume={resume} />;
      case "professional":
      default:
        return <ProfessionalTemplate resume={resume} />;
    }
  };

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-resume-sheet, #printable-resume-sheet * {
            visibility: visible;
          }
          #printable-resume-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
            transform: none !important;
          }
          .break-inside-avoid-page {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
      {renderTemplate()}
    </>
  );
}
