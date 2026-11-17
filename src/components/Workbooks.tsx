/**
 * Workbooks — restyled 17 Nov 2026 to the BS-BRAND-001 design language (bs-* classes in
 * styles/brand.css). It renders INSIDE a .bs-card in BrandDashboard, so it outputs content only:
 * no page background or max-width wrapper of its own. Download logic unchanged.
 */

import { FileText, Download, BookOpen } from 'lucide-react';

interface WorkbooksProps {
  onViewChange?: (view: string) => void;
  coreType?: 'architect' | 'alchemist' | 'blurred' | 'mixed';
}

export function Workbooks({ coreType = 'architect' }: WorkbooksProps) {
  // The dashboard passes 'mixed' (the v2 record's wording); the historical key here is 'blurred'.
  const key = coreType === 'mixed' ? 'blurred' : coreType;

  const allWorkbooks = {
    architect: {
      title: 'E-DNA Decision Mastery for Architect',
      category: 'Architect',
      icon: FileText,
      energy: false,
      filePath: '/assets/EDNA_WORKBOOK_ARCHITECT101.docx',
      fileName: 'EDNA_Decision_Mastery_Architect.docx',
    },
    alchemist: {
      title: 'E-DNA Decision Mastery for Alchemist',
      category: 'Alchemist',
      icon: BookOpen,
      energy: true,
      filePath: '/assets/ALCHEMISTWORKBOOK.docx',
      fileName: 'EDNA_Decision_Mastery_Alchemist.docx',
    },
    blurred: {
      title: 'E-DNA Decision Mastery for Mixed',
      category: 'Mixed',
      icon: FileText,
      energy: false,
      filePath: '/assets/E-DNA_DECISION_mastery_WORKBOOK mixed111.docx',
      fileName: 'EDNA_Decision_Mastery_Mixed.docx',
    },
  } as const;

  const workbook = allWorkbooks[key] || allWorkbooks.architect;
  const Icon = workbook.icon;

  const handleDownload = async () => {
    try {
      const response = await fetch(workbook.filePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = workbook.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading workbook:', error);
      alert('Failed to download workbook. Please try again.');
    }
  };

  return (
    <div>
      <div className="bs-card-head">
        <h2>Workbooks &amp; resources</h2>
        <span className={`bs-pill ${workbook.energy ? 'bs-pill-energy' : 'bs-pill-done'}`}>
          {workbook.category}
        </span>
      </div>
      <p className="bs-empty-copy">
        Your workbook is matched to your E-DNA: templates, frameworks and guides for how you
        naturally make decisions.
      </p>

      <div className="bs-wb">
        <span className={`bs-wb-icon ${workbook.energy ? 'bs-wb-icon-energy' : ''}`} aria-hidden="true">
          <Icon size={22} />
        </span>
        <div className="bs-wb-body">
          <h3>{workbook.title}</h3>
          <p>Word document · downloads to your device</p>
        </div>
        <button
          className={`bs-btn ${workbook.energy ? 'bs-btn-energy' : 'bs-btn-action'}`}
          onClick={handleDownload}
        >
          <Download size={16} /> Download
        </button>
      </div>
    </div>
  );
}
