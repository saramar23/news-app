import React from "react";

export const HIGHLIGHT_PREVIEW_MAX_LENGTH = 120;

export type HighlightSearchArgs = {
    text: string;
    query: string;
    maxLength?: number;
};

export type HighlightSegment = {
    text: string;
    highlight: boolean;
};

export function highlightSearch(args: HighlightSearchArgs): HighlightSegment[] {
    const { text, query, maxLength = HIGHLIGHT_PREVIEW_MAX_LENGTH } = args;
    const truncated =
        text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    if (!query.trim()) {
        return [{ text: truncated, highlight: false }];
    }
    const escapedHighlight = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedHighlight})`, "gi");
    const parts = truncated.split(regex);
    return parts.map((part, i) => ({
        text: part,
        highlight: i % 2 === 1,
    }));
}

export function HighlightedText({
    segments,
    className,
}: {
    segments: HighlightSegment[];
    className?: string;
}): React.ReactElement {
    return (
        <span className={className}>
            {segments.map((segment, index) =>
                segment.highlight ? (
                    <mark key={index} className="bg-yellow-200">
                        {segment.text}
                    </mark>
                ) : (
                    <React.Fragment key={index}>{segment.text}</React.Fragment>
                )
            )}
        </span>
    );
}
