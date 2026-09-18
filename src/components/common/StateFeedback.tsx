import React from "react";

export function SkeletonLoader({ text = "Loading intelligence fixture..." }: { text?: string }) {
  return (
    <div style={{
      padding: "24px",
      borderRadius: "14px",
      background: "var(--elev-2)",
      border: "1px solid var(--line)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      color: "var(--text-3)",
      fontSize: "13.5px"
    }}>
      <div style={{
        width: "18px",
        height: "18px",
        border: "2px solid var(--line-strong)",
        borderTopColor: "var(--accent-2)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <span>{text}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function ErrorNotice({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div style={{
      padding: "18px 20px",
      borderRadius: "14px",
      background: "rgba(224, 82, 82, 0.1)",
      border: "1px solid rgba(224, 82, 82, 0.35)",
      color: "#FF9B9B",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "14px",
      fontSize: "13.5px"
    }}>
      <div>
        <strong style={{ display: "block", marginBottom: "3px", color: "var(--red)" }}>Service Error</strong>
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: "6px 14px",
            borderRadius: "999px",
            background: "rgba(224, 82, 82, 0.2)",
            border: "1px solid var(--red)",
            color: "#FFF",
            fontSize: "12px",
            fontWeight: 600
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = "No records found", description = "No entries match the current filter or fixture state." }: { title?: string; description?: string }) {
  return (
    <div style={{
      padding: "36px 20px",
      borderRadius: "14px",
      background: "var(--elev-1)",
      border: "1px dashed var(--line-strong)",
      textAlign: "center",
      color: "var(--text-3)"
    }}>
      <h3 style={{ margin: "0 0 6px", color: "var(--text)", fontSize: "16px" }}>{title}</h3>
      <p style={{ margin: 0, fontSize: "13.5px" }}>{description}</p>
    </div>
  );
}
