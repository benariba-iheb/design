#!/usr/bin/env bash
# Start / stop / inspect the template servers in the background.
#   bash themes/themes.sh start [--only a,b] [--lan] [--no-original]
#   bash themes/themes.sh stop | restart | status | logs
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN="$ROOT/themes/.run"
PIDF="$RUN/pid"
LOG="$RUN/themes.log"
export PATH="$HOME/.local/bin:$PATH"

is_ours() { # pid exists AND is our launcher (guards against a recycled PID)
  [ -n "${1:-}" ] && [ -r "/proc/$1/cmdline" ] && tr '\0' ' ' < "/proc/$1/cmdline" | grep -q "themes/serve.mjs"
}
cur_pid() { [ -f "$PIDF" ] && cat "$PIDF" 2>/dev/null; }

ports() { # ports of all templates, taken from the launcher itself
  node "$ROOT/themes/serve.mjs" --list | awk '{print $1}'
}

cmd_start() {
  mkdir -p "$RUN"
  local pid; pid="$(cur_pid)"
  if is_ours "$pid"; then echo "Already running (pid $pid). Use: stop | restart | status"; return 0; fi
  rm -f "$PIDF"
  : > "$LOG"
  # Redirect the WHOLE group and exec, so no intermediate shell keeps the caller's stdout pipe open.
  ( cd "$ROOT" && exec setsid nohup node themes/serve.mjs "$@" ) >> "$LOG" 2>&1 < /dev/null &
  # wait for the launcher to write its pid (it does so once the servers are listening)
  for _ in $(seq 1 120); do
    [ -f "$PIDF" ] && break
    if ! pgrep -f "themes/serve.mjs" > /dev/null; then break; fi
    sleep 0.5
  done
  if [ -f "$PIDF" ] && is_ours "$(cur_pid)"; then
    cat "$LOG"; echo "Started (pid $(cur_pid)). Log: $LOG"
  else
    echo "Failed to start. Log:"; cat "$LOG"; return 1
  fi
}

cmd_stop() {
  local pid; pid="$(cur_pid)"
  if ! is_ours "$pid"; then echo "Not running."; rm -f "$PIDF"; return 0; fi
  kill -TERM "$pid"
  for _ in $(seq 1 40); do is_ours "$pid" || break; sleep 0.25; done
  if is_ours "$pid"; then echo "Did not exit in 10s, sending SIGKILL"; kill -KILL "$pid"; fi
  rm -f "$PIDF"
  echo "Stopped."
}

cmd_status() {
  local pid; pid="$(cur_pid)"
  if is_ours "$pid"; then echo "Running (pid $pid)"; else echo "Not running"; return 1; fi
  for p in $(ports); do
    code="$(curl -s -o /dev/null -m 3 -w '%{http_code}' "http://127.0.0.1:$p/" || true)"
    tmpl="$(curl -s -o /dev/null -m 3 -D - "http://127.0.0.1:$p/" | tr -d '\r' | awk -F': ' 'tolower($1)=="x-gasra-template"{print $2}')"
    echo "  :$p  HTTP ${code:-000}  ${tmpl:-?}"
  done
}

case "${1:-}" in
  start)   shift; cmd_start "$@" ;;
  stop)    cmd_stop ;;
  restart) shift; cmd_stop; cmd_start "$@" ;;
  status)  cmd_status ;;
  logs)    tail -n 80 "$LOG" ;;
  *) echo "usage: bash themes/themes.sh {start [--only a,b] [--lan] [--no-original] | stop | restart | status | logs}"; exit 2 ;;
esac
