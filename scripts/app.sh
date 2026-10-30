#!/bin/sh
# Manage the launchd user agent that serves the production build on http://127.0.0.1:3030.
# Usage: sh scripts/app.sh install|restart|status|logs|uninstall  (or the npm run app:* aliases)
set -eu

LABEL=local.free-resume-maker
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PLIST_SRC="$APP_DIR/scripts/launchd/$LABEL.plist"
PLIST_DST="$HOME/Library/LaunchAgents/$LABEL.plist"
LOG_DIR="$HOME/Library/Logs/free-resume-maker"
DOMAIN="gui/$(id -u)"

case "${1:-}" in
  install)
    if [ ! -f "$APP_DIR/.next-prod/BUILD_ID" ]; then
      echo "No production build found: run 'npm run build:prod' first" >&2
      exit 1
    fi
    NODE="$(command -v node || true)"
    if [ -z "$NODE" ]; then
      echo "node not found in PATH" >&2
      exit 1
    fi
    mkdir -p "$LOG_DIR" "$HOME/Library/LaunchAgents"
    if launchctl print "$DOMAIN/$LABEL" >/dev/null 2>&1; then
      launchctl bootout "$DOMAIN/$LABEL"
      sleep 1
    fi
    sed -e "s|__NODE_DIR__|$(dirname "$NODE")|g" -e "s|__NODE__|$NODE|g" -e "s|__APP_DIR__|$APP_DIR|g" -e "s|__LOG_DIR__|$LOG_DIR|g" "$PLIST_SRC" > "$PLIST_DST"
    launchctl bootstrap "$DOMAIN" "$PLIST_DST"
    echo "Installed $LABEL: http://127.0.0.1:3030/builder (logs in $LOG_DIR)"
    ;;
  restart)
    launchctl kickstart -k "$DOMAIN/$LABEL"
    echo "Restarted $LABEL"
    ;;
  status)
    launchctl print "$DOMAIN/$LABEL" | grep -E "state =|pid =|last exit code"
    ;;
  logs)
    tail -n 50 "$LOG_DIR/stdout.log" "$LOG_DIR/stderr.log"
    ;;
  uninstall)
    launchctl bootout "$DOMAIN/$LABEL" 2>/dev/null || true
    rm -f "$PLIST_DST"
    echo "Removed $LABEL (logs in $LOG_DIR are kept)"
    ;;
  *)
    echo "Usage: $0 install|restart|status|logs|uninstall" >&2
    exit 2
    ;;
esac
