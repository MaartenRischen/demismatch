"use client";

import { useState } from "react";
import Link from "next/link";
import { BASICS_TILES, FAQ_ANSWERS, type BasicsTile } from "@/lib/faq-data";

// Filter out framework link paragraphs from answers
function getCleanAnswerParagraphs(paragraphs: string[]): string[] {
  return paragraphs.filter(p => !p.trim().startsWith('→ ['));
}

// Single expandable tile component
function ExpandableTile({ tile }: { tile: BasicsTile }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = tile.questions[currentIndex];
  const answer = FAQ_ANSWERS[currentQuestion.num];
  const totalQuestions = tile.questions.length;
  const nextQuestion = currentIndex < totalQuestions - 1 ? tile.questions[currentIndex + 1] : null;

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setCurrentIndex(0);
  };

  const handleTileClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  if (!isExpanded) {
    // Collapsed state - only show question
    return (
      <button
        onClick={handleTileClick}
        className="w-full text-left bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-6 hover:shadow-md hover:border-[#C75B39]/30 transition-all cursor-pointer group"
      >
        <h3
          className="text-xl font-semibold text-[#1A1A1A] group-hover:text-[#C75B39] transition-colors"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {tile.leadQuestion}
        </h3>
      </button>
    );
  }

  // Get clean answer paragraphs (without framework links)
  const cleanParagraphs = answer ? getCleanAnswerParagraphs(answer.answerParagraphs) : [];

  // Expanded state
  return (
    <div className="bg-white border border-[#C75B39]/30 rounded-xl shadow-lg overflow-hidden">
      {/* Header with close button */}
      <div className="flex items-center justify-end p-4 border-b border-[#E5E0D8] bg-[#FAF9F6]">
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E5E0D8] transition-colors text-[#6b6b6b] hover:text-[#1A1A1A]"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Question (no number) */}
      <div className="p-6">
        <h3
          className="text-xl font-semibold text-[#1A1A1A] mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {currentQuestion.text}
        </h3>

        {/* Answer (without framework links) */}
        {cleanParagraphs.length > 0 ? (
          <div className="text-[#4A4A4A] space-y-3">
            {cleanParagraphs.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-[#6b6b6b] italic">Answer not found.</p>
        )}
      </div>

      {/* Navigation - Previous button and Next Question preview */}
      <div className="p-4 border-t border-[#E5E0D8] bg-[#FAF9F6]">
        {/* Previous button */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="flex items-center gap-1 text-sm font-medium text-[#C75B39] hover:text-[#a04a2e] transition-colors mb-3"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
        )}

        {/* Next question preview */}
        {nextQuestion && (
          <button
            onClick={handleNext}
            className="w-full text-left p-3 bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg hover:border-[#C75B39]/30 hover:bg-white transition-all group"
          >
            <p className="text-xs text-[#6b6b6b] mb-1">Next:</p>
            <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#C75B39] transition-colors">
              {nextQuestion.text}
            </p>
          </button>
        )}

        {/* End of questions message */}
        {!nextQuestion && (
          <p className="text-sm text-[#6b6b6b] text-center italic">
            End of this topic
          </p>
        )}
      </div>
    </div>
  );
}

// Main component with all 8 tiles
export default function ExpandableFAQTiles() {
  return (
    <section className="px-8 py-16 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
          The Basics
        </h2>
      </div>

      {/* Grid of tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {BASICS_TILES.map((tile) => (
          <ExpandableTile key={tile.id} tile={tile} />
        ))}
      </div>

      {/* Link to full FAQ */}
      <div className="text-center mt-10">
        <Link
          href="/faq"
          className="text-[#c75b3a] hover:underline font-medium"
        >
          Want all 162 questions? Read the full FAQ →
        </Link>
      </div>
    </section>
  );
}
