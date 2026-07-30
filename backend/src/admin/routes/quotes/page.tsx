import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Table, Badge, Text, StatusBadge } from "@medusajs/ui"
import { DocumentText } from "@medusajs/icons"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/sdk"
import { useState } from "react"

type QuoteItem = {
  product_id: string
  product_name?: string
  product_thumbnail?: string | null
  product_sku?: string | null
  product_description?: string | null
  quantity: number
  notes?: string
}

type Quote = {
  id: string
  customer_name: string
  customer_email: string
  company_name?: string | null
  phone?: string | null
  items: QuoteItem[]
  message?: string | null
  status: string
  admin_notes?: string | null
  created_at: string
}

const STATUS_COLOR: Record<string, "green" | "red" | "blue" | "orange" | "grey"> = {
  pending: "orange",
  reviewed: "blue",
  approved: "green",
  rejected: "red",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const QuotesPage = () => {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)

  const { data, isLoading } = useQuery({
    queryFn: () =>
      sdk.client.fetch<{ quotes: Quote[] }>("/admin/quotes", { method: "GET" }),
    queryKey: ["quotes"],
  })

  const quotes = data?.quotes ?? []

  const statusCounts = quotes.reduce(
    (acc, q) => {
      acc[q.status] = (acc[q.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <Heading level="h1">Quote Requests</Heading>
          <Text size="small" style={{ color: "var(--fg-subtle)", marginTop: "4px" }}>
            Manage B2B quote requests from customers
          </Text>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {(["pending", "reviewed", "approved", "rejected"] as const).map((s) => (
            <Badge key={s} color={STATUS_COLOR[s]} size="small" rounded="full">
              {s}: {statusCounts[s] ?? 0}
            </Badge>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Text>Loading quotes...</Text>
      ) : quotes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Text size="large" style={{ color: "var(--fg-subtle)" }}>No quote requests yet</Text>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Customer</Table.HeaderCell>
              <Table.HeaderCell>Company</Table.HeaderCell>
              <Table.HeaderCell>Items</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {quotes.map((quote) => (
              <Table.Row
                key={quote.id}
                onClick={() => setSelectedQuote(quote)}
                style={{ cursor: "pointer" }}
              >
                <Table.Cell>
                  <div>
                    <Text size="small" weight="plus">{quote.customer_name}</Text>
                    <Text size="xsmall" style={{ color: "var(--fg-subtle)" }}>{quote.customer_email}</Text>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small">{quote.company_name || "—"}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small">{Array.isArray(quote.items) ? quote.items.length : 0} products</Text>
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge color={STATUS_COLOR[quote.status] ?? "grey"}>
                    {quote.status}
                  </StatusBadge>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small" style={{ color: "var(--fg-subtle)" }}>{formatDate(quote.created_at)}</Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Detail overlay */}
      {selectedQuote && (
        <div
          onClick={() => setSelectedQuote(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 999,
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg-base)", borderRadius: "12px",
              width: "100%", maxWidth: "520px", maxHeight: "80vh",
              overflow: "auto", padding: "24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <Heading level="h2">Quote Details</Heading>
                <Text size="xsmall" style={{ color: "var(--fg-subtle)", marginTop: "2px" }}>{selectedQuote.id}</Text>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "20px", color: "var(--fg-subtle)", padding: "4px",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <Text size="xsmall" weight="plus" style={{ color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Customer</Text>
                <Text size="small" weight="plus">{selectedQuote.customer_name}</Text>
                <Text size="xsmall" style={{ color: "var(--fg-subtle)" }}>{selectedQuote.customer_email}</Text>
              </div>
              <div>
                <Text size="xsmall" weight="plus" style={{ color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Company</Text>
                <Text size="small">{selectedQuote.company_name || "—"}</Text>
              </div>
              <div>
                <Text size="xsmall" weight="plus" style={{ color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Phone</Text>
                <Text size="small">{selectedQuote.phone || "—"}</Text>
              </div>
              <div>
                <Text size="xsmall" weight="plus" style={{ color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</Text>
                <StatusBadge color={STATUS_COLOR[selectedQuote.status] ?? "grey"}>
                  {selectedQuote.status}
                </StatusBadge>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <Text size="xsmall" weight="plus" style={{ color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", display: "block" }}>
                Products ({selectedQuote.items?.length ?? 0})
              </Text>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {(selectedQuote.items ?? []).map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "12px", padding: "12px", background: "var(--bg-subtle)", borderRadius: "10px" }}>
                    <div style={{
                      width: "56px", height: "56px", borderRadius: "8px", overflow: "hidden",
                      background: "var(--bg-base)", border: "1px solid var(--border-base)",
                      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {item.product_thumbnail ? (
                        <img src={item.product_thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--fg-muted)" strokeWidth="1.5">
                          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Text size="small" weight="plus" style={{ lineHeight: "1.3" }}>
                          {item.product_name || item.product_id}
                        </Text>
                        <Badge color="grey" size="xsmall" style={{ flexShrink: 0, marginLeft: "8px" }}>x{item.quantity}</Badge>
                      </div>
                      {item.product_sku && (
                        <Text size="xsmall" style={{ color: "var(--fg-muted)", marginTop: "2px" }}>
                          SKU: {item.product_sku}
                        </Text>
                      )}
                      {item.notes && (
                        <Text size="xsmall" style={{ color: "var(--fg-subtle)", marginTop: "4px", fontStyle: "italic" }}>
                          Note: {item.notes}
                        </Text>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedQuote.message && (
              <div style={{ marginBottom: "20px" }}>
                <Text size="xsmall" weight="plus" style={{ color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px", display: "block" }}>Message</Text>
                <div style={{ padding: "10px 12px", background: "var(--bg-subtle)", borderRadius: "8px" }}>
                  <Text size="small">{selectedQuote.message}</Text>
                </div>
              </div>
            )}

            {selectedQuote.admin_notes && (
              <div style={{ marginBottom: "20px" }}>
                <Text size="xsmall" weight="plus" style={{ color: "var(--fg-subtle)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px", display: "block" }}>Admin Notes</Text>
                <div style={{ padding: "10px 12px", background: "var(--bg-subtle)", borderRadius: "8px" }}>
                  <Text size="small">{selectedQuote.admin_notes}</Text>
                </div>
              </div>
            )}

            <Text size="xsmall" style={{ color: "var(--fg-subtle)", textAlign: "right", display: "block" }}>
              Submitted {formatDate(selectedQuote.created_at)}
            </Text>
          </div>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Quotes",
  icon: DocumentText,
})

export default QuotesPage
