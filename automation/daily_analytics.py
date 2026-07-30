"""Send Dillon a daily GA4 brief for ironicineptocracy.com.

The script reads COMPOSIO_KEY from the process environment. It never prints,
logs, or stores the key. Windows Task Scheduler launches it through Codex's
console free scheduled task wrapper.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timedelta
from html import escape
from pathlib import Path


ENDPOINT = "https://connect.composio.dev/mcp"
PROPERTY = "properties/532537300"
GA_ACCOUNT = "google_analytics_carlin-enlife"
GMAIL_ACCOUNT = "gmail_agag-heugh"
SEARCH_CONSOLE_ACCOUNT = "google_search_console_mooner-urban"
SEARCH_CONSOLE_SITE = "https://ironicineptocracy.com/"
RECIPIENT = "dillonmohr8777@gmail.com"
LOG_PATH = Path(__file__).resolve().parent / "logs" / "last-run.json"


def post(payload: dict, api_key: str, session_id: str | None = None) -> tuple[dict, str | None]:
    request = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(payload).encode("utf-8"),
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
            "X-CONSUMER-API-KEY": api_key,
        },
    )
    if session_id:
        request.add_header("Mcp-Session-Id", session_id)
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            body = response.read().decode("utf-8")
            next_session = response.headers.get("Mcp-Session-Id") or session_id
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Composio HTTP {error.code}: {detail[:500]}") from error

    for line in body.splitlines():
        if line.strip().startswith("data:"):
            return json.loads(line.split(":", 1)[1].strip()), next_session
    return (json.loads(body) if body.strip() else {}), next_session


def initialize(api_key: str) -> str:
    result, session_id = post(
        {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {"name": "ironic-ineptocracy-daily-analytics", "version": "1.0"},
            },
        },
        api_key,
    )
    if "error" in result or not session_id:
        raise RuntimeError(f"Composio initialization failed: {result.get('error', 'missing session')}")
    post({"jsonrpc": "2.0", "method": "notifications/initialized", "params": {}}, api_key, session_id)
    return session_id


def execute(api_key: str, session_id: str, tools: list[dict], step: str) -> list[dict]:
    response, _ = post(
        {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/call",
            "params": {
                "name": "COMPOSIO_MULTI_EXECUTE_TOOL",
                "arguments": {
                    "tools": tools,
                    "sync_response_to_workbench": False,
                    "current_step": step,
                    "current_step_metric": f"{len(tools)}/{len(tools)} calls",
                },
            },
        },
        api_key,
        session_id,
    )
    if "error" in response:
        raise RuntimeError(f"Composio call failed: {response['error']}")
    content = response.get("result", {}).get("content", [])
    text = next((item.get("text") for item in content if item.get("type") == "text"), None)
    if not text:
        raise RuntimeError("Composio returned no structured text result")
    envelope = json.loads(text)
    if not envelope.get("successful"):
        raise RuntimeError(f"Composio execution failed: {envelope.get('error')}")
    return envelope.get("data", {}).get("results", [])


def report_call(start: str, end: str, *, dimensions: list[str] | None = None, metrics: list[str] | None = None, limit: int = 10) -> dict:
    args: dict = {
        "property": PROPERTY,
        "dateRanges": [{"startDate": start, "endDate": end}],
        "metrics": [{"name": name} for name in (metrics or ["activeUsers", "sessions", "screenPageViews", "engagedSessions"])],
        "limit": limit,
    }
    if dimensions:
        args["dimensions"] = [{"name": name} for name in dimensions]
        args["orderBys"] = [{"desc": True, "metric": {"metricName": (metrics or ["screenPageViews"])[0]}}]
    else:
        args["metricAggregations"] = ["TOTAL"]
    return {"tool_slug": "GOOGLE_ANALYTICS_RUN_REPORT", "account": GA_ACCOUNT, "arguments": args}


def search_call(start: str, end: str, dimensions: list[str]) -> dict:
    return {
        "tool_slug": "GOOGLE_SEARCH_CONSOLE_SEARCH_ANALYTICS_QUERY",
        "account": SEARCH_CONSOLE_ACCOUNT,
        "arguments": {
            "site_url": SEARCH_CONSOLE_SITE,
            "start_date": start,
            "end_date": end,
            "dimensions": dimensions,
            "search_type": "web",
            "data_state": "final",
            "row_limit": 10,
        },
    }


def result_data(result: dict) -> dict:
    response = result.get("response", {})
    if not response.get("successful"):
        raise RuntimeError(f"Analytics report failed: {response.get('error', response)}")
    return response.get("data", {})


def totals(data: dict) -> dict[str, int]:
    headers = [item.get("name", "") for item in data.get("metricHeaders", [])]
    rows = data.get("rows", [])
    if not rows:
        return {name: 0 for name in headers}
    values = rows[0].get("metricValues", [])
    return {name: int(float(values[index].get("value", "0") or 0)) for index, name in enumerate(headers)}


def breakdown(data: dict, max_rows: int = 5) -> list[tuple[str, int]]:
    output: list[tuple[str, int]] = []
    for row in data.get("rows", [])[:max_rows]:
        label = row.get("dimensionValues", [{}])[0].get("value", "(not set)")
        value = int(float(row.get("metricValues", [{}])[0].get("value", "0") or 0))
        output.append((label, value))
    return output


def search_totals(data: dict) -> dict[str, float]:
    rows = data.get("rows", [])
    if not rows:
        return {"clicks": 0, "impressions": 0, "ctr": 0.0, "position": 0.0}
    row = rows[0]
    return {
        "clicks": int(row.get("clicks", 0) or 0),
        "impressions": int(row.get("impressions", 0) or 0),
        "ctr": float(row.get("ctr", 0) or 0),
        "position": float(row.get("position", 0) or 0),
    }


def search_pages(data: dict, max_rows: int = 5) -> list[tuple[str, int]]:
    output: list[tuple[str, int]] = []
    for row in data.get("rows", [])[:max_rows]:
        label = (row.get("keys") or ["(not set)"])[0]
        output.append((label, int(row.get("impressions", 0) or 0)))
    return output


def change(current: int, previous: int) -> str:
    if previous == 0:
        return "New data" if current else "No collected data yet"
    percentage = round(((current - previous) / previous) * 100)
    direction = "up" if percentage > 0 else "down" if percentage < 0 else "steady"
    return f"{direction} {abs(percentage)} percent"


def list_html(items: list[tuple[str, int]], unit: str) -> str:
    if not items:
        return "<p style='margin:0;color:#6b7280'>No collected rows yet.</p>"
    return "<ol style='margin:8px 0 0;padding-left:22px'>" + "".join(
        f"<li style='margin:6px 0'><strong>{escape(label)}</strong>: {value:,} {unit}</li>" for label, value in items
    ) + "</ol>"


def build_email(
    report_date: datetime,
    current: dict[str, int],
    previous: dict[str, int],
    pages: list[tuple[str, int]],
    sources: list[tuple[str, int]],
    search: dict[str, float],
    search_page_rows: list[tuple[str, int]],
    search_start: str,
    search_end: str,
) -> tuple[str, str]:
    date_label = report_date.strftime("%B %d, %Y")
    subject = f"Ironic Ineptocracy Analytics | {date_label}"
    tracking_note = ""
    if not any(current.values()):
        tracking_note = "<p style='margin:14px 0 0;color:#92400e'><strong>Tracking note:</strong> The site has not collected report rows for this date yet. The production tag was activated on July 30, 2026, so the first meaningful brief will follow after traffic is recorded.</p>"
    metrics = [
        ("Active users", current.get("activeUsers", 0), change(current.get("activeUsers", 0), previous.get("activeUsers", 0))),
        ("Sessions", current.get("sessions", 0), change(current.get("sessions", 0), previous.get("sessions", 0))),
        ("Page views", current.get("screenPageViews", 0), change(current.get("screenPageViews", 0), previous.get("screenPageViews", 0))),
        ("Engaged sessions", current.get("engagedSessions", 0), change(current.get("engagedSessions", 0), previous.get("engagedSessions", 0))),
    ]
    cards = "".join(
        f"<td style='width:25%;padding:12px;border:1px solid #dedbd3'><div style='font-size:12px;color:#6b7280'>{escape(label)}</div><div style='font-size:26px;font-weight:700;color:#111'>{value:,}</div><div style='font-size:12px;color:#6b7280'>{escape(delta)}</div></td>"
        for label, value, delta in metrics
    )
    search_summary = (
        f"<table role='presentation' style='width:100%;border-collapse:collapse'>"
        f"<tr><td style='padding:10px;border:1px solid #dedbd3'><strong>{int(search['clicks']):,}</strong><br><span style='font-size:12px;color:#6b7280'>Search clicks</span></td>"
        f"<td style='padding:10px;border:1px solid #dedbd3'><strong>{int(search['impressions']):,}</strong><br><span style='font-size:12px;color:#6b7280'>Impressions</span></td>"
        f"<td style='padding:10px;border:1px solid #dedbd3'><strong>{search['ctr'] * 100:.1f} percent</strong><br><span style='font-size:12px;color:#6b7280'>Click rate</span></td>"
        f"<td style='padding:10px;border:1px solid #dedbd3'><strong>{search['position']:.1f}</strong><br><span style='font-size:12px;color:#6b7280'>Average position</span></td></tr></table>"
    )
    body = f"""<html><body style="margin:0;background:#f3f1eb;font-family:Arial,sans-serif;color:#171717">
<div style="max-width:720px;margin:0 auto;padding:28px">
  <div style="background:#111;color:#fff;padding:24px">
    <div style="font-size:12px;letter-spacing:1.5px;color:#d8b45b">THE IRONIC INEPTOCRACY</div>
    <h1 style="margin:8px 0 4px;font-size:28px">Daily Analytics Brief</h1>
    <p style="margin:0;color:#d1d5db">{date_label}</p>
  </div>
  <div style="background:#fff;padding:24px">
    <table role="presentation" style="width:100%;border-collapse:collapse"><tr>{cards}</tr></table>
    {tracking_note}
    <h2 style="margin:28px 0 8px;font-size:19px">Top pages, trailing seven days</h2>
    {list_html(pages, "views")}
    <h2 style="margin:28px 0 8px;font-size:19px">Top traffic sources, trailing seven days</h2>
    {list_html(sources, "sessions")}
    <h2 style="margin:28px 0 8px;font-size:19px">Google Search visibility</h2>
    <p style="margin:0 0 10px;color:#6b7280;font-size:12px">Final Search Console data from {search_start} through {search_end}. Search data normally arrives after a short delay.</p>
    {search_summary}
    <h2 style="margin:24px 0 8px;font-size:17px">Pages appearing in Google Search</h2>
    {list_html(search_page_rows, "impressions")}
    <p style="margin:28px 0 0;color:#6b7280;font-size:12px">Source: GA4 property ironicineptocracy.com. Report dates follow America New York time.</p>
  </div>
</div></body></html>"""
    return subject, body


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--send", action="store_true", help="Send the finished report to Dillon")
    parser.add_argument("--dry-run", action="store_true", help="Fetch data and render status without sending")
    args = parser.parse_args()
    if args.send == args.dry_run:
        parser.error("choose exactly one of --send or --dry-run")

    api_key = os.getenv("COMPOSIO_KEY")
    if not api_key:
        raise RuntimeError("COMPOSIO_KEY is not available in this process")

    now = datetime.now().astimezone()
    report_date = now - timedelta(days=1)
    previous_date = report_date - timedelta(days=1)
    seven_days_ago = report_date - timedelta(days=6)
    search_end_date = report_date - timedelta(days=3)
    search_start_date = search_end_date - timedelta(days=27)
    session_id = initialize(api_key)
    calls = [
        report_call(report_date.strftime("%Y-%m-%d"), report_date.strftime("%Y-%m-%d")),
        report_call(previous_date.strftime("%Y-%m-%d"), previous_date.strftime("%Y-%m-%d")),
        report_call(seven_days_ago.strftime("%Y-%m-%d"), report_date.strftime("%Y-%m-%d"), dimensions=["pagePath"], metrics=["screenPageViews"]),
        report_call(seven_days_ago.strftime("%Y-%m-%d"), report_date.strftime("%Y-%m-%d"), dimensions=["sessionSource"], metrics=["sessions"]),
        search_call(search_start_date.strftime("%Y-%m-%d"), search_end_date.strftime("%Y-%m-%d"), []),
        search_call(search_start_date.strftime("%Y-%m-%d"), search_end_date.strftime("%Y-%m-%d"), ["page"]),
    ]
    results = execute(api_key, session_id, calls, "FETCHING_DAILY_ANALYTICS")
    if len(results) != 6:
        raise RuntimeError(f"Expected six analytics reports, received {len(results)}")

    current = totals(result_data(results[0]))
    previous = totals(result_data(results[1]))
    pages = breakdown(result_data(results[2]))
    sources = breakdown(result_data(results[3]))
    search = search_totals(result_data(results[4]))
    search_page_rows = search_pages(result_data(results[5]))
    subject, body = build_email(
        report_date,
        current,
        previous,
        pages,
        sources,
        search,
        search_page_rows,
        search_start_date.strftime("%B %d, %Y"),
        search_end_date.strftime("%B %d, %Y"),
    )

    sent = False
    message_id = None
    if args.send:
        send_results = execute(
            api_key,
            session_id,
            [{
                "tool_slug": "GMAIL_SEND_EMAIL",
                "account": GMAIL_ACCOUNT,
                "arguments": {
                    "recipient_email": RECIPIENT,
                    "subject": subject,
                    "body": body,
                    "is_html": True,
                },
            }],
            "SENDING_DAILY_ANALYTICS",
        )
        send_response = send_results[0].get("response", {}) if send_results else {}
        if not send_response.get("successful"):
            raise RuntimeError(f"Gmail send failed: {send_response.get('error', send_response)}")
        sent = True
        message_id = send_response.get("data", {}).get("id")

    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    LOG_PATH.write_text(
        json.dumps(
            {
                "completed_at": now.isoformat(),
                "report_date": report_date.strftime("%Y-%m-%d"),
                "recipient": RECIPIENT,
                "subject": subject,
                "sent": sent,
                "message_id": message_id,
                "metrics": current,
                "top_pages": pages,
                "top_sources": sources,
                "search_console": search,
                "search_pages": search_page_rows,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(json.dumps({"ok": True, "sent": sent, "report_date": report_date.strftime("%Y-%m-%d"), "recipient": RECIPIENT}))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        LOG_PATH.write_text(
            json.dumps({"completed_at": datetime.now().astimezone().isoformat(), "ok": False, "error": str(error)[:1000]}, indent=2),
            encoding="utf-8",
        )
        print(f"Daily analytics failed: {error}", file=sys.stderr)
        raise
