#!/usr/bin/env bash

set -e

# PostgreSQL management script for SpendLess API
# This script helps to initialize, start, stop, and check the status of your PostgreSQL server

# Variables should be set by the Nix shell, but let's make sure they're available
if [ -z "$PGDATA" ]; then
  export PGDATA="$PWD/.direnv/postgres"
fi

if [ -z "$PGHOST" ]; then
  export PGHOST="$PGDATA"
fi

if [ -z "$PGUSER" ]; then
  export PGUSER="postgres"
fi

if [ -z "$PGDATABASE" ]; then
  export PGDATABASE="spendless"
fi

if [ -z "$PGPORT" ]; then
  export PGPORT="5432"
fi

function show_help {
  echo "PostgreSQL management script for SpendLess API"
  echo ""
  echo "Usage: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  init        Initialize the PostgreSQL database cluster"
  echo "  start       Start the PostgreSQL server"
  echo "  stop        Stop the PostgreSQL server"
  echo "  status      Check if the PostgreSQL server is running"
  echo "  check-port  Verify which port PostgreSQL is using"
  echo "  create-db   Create the database if it doesn't exist"
  echo "  reset-db    Reset the entire database (WARNING: Destroys all data)"
  echo "  help        Show this help message"
  echo ""
}

function init_db {
  if [ -d "$PGDATA" ]; then
    echo "PostgreSQL data directory already exists at $PGDATA"
    echo "If you want to reinitialize, please delete this directory first"
    return 1
  fi

  echo "Initializing PostgreSQL database cluster at $PGDATA..."
  mkdir -p "$PGDATA"
  
  # Initialize with a specific username that matches PGUSER
  initdb --auth=trust --no-locale --encoding=UTF8 --username="$PGUSER"
  
  echo "PostgreSQL database cluster initialized successfully with user '$PGUSER'"
}

function start_db {
  if is_running; then
    echo "PostgreSQL server is already running"
    return 0
  fi

  if [ ! -d "$PGDATA" ]; then
    echo "PostgreSQL data directory does not exist at $PGDATA"
    echo "Please run '$0 init' first"
    return 1
  fi

  echo "Starting PostgreSQL server..."
  # Use the default PostgreSQL port (5432) unless specified otherwise
  local pg_port=${PGPORT:-5432}
  pg_ctl start -l "$PGDATA/logfile" -o "--unix_socket_directories='$PGHOST' --port=$pg_port"
  echo "PostgreSQL server started on port $pg_port"
}

function stop_db {
  if ! is_running; then
    echo "PostgreSQL server is not running"
    return 0
  fi

  echo "Stopping PostgreSQL server..."
  pg_ctl stop -m fast
}

function is_running {
  pg_ctl status > /dev/null 2>&1
  return $?
}

function status_db {
  if is_running; then
    echo "PostgreSQL server is running"
    
    # Get the port number PostgreSQL is using
    local pg_port
    if [ -f "$PGDATA/postmaster.pid" ]; then
      pg_port=$(head -n 4 "$PGDATA/postmaster.pid" | tail -n 1)
    else
      pg_port=5432 # Default PostgreSQL port
    fi
    
    echo "Connection info:"
    echo "  Host: $PGHOST"
    echo "  Port: $pg_port"
    echo "  User: $PGUSER"
    echo "  Database: $PGDATABASE"
    echo "  URL: postgresql://$PGUSER@localhost:$pg_port/$PGDATABASE"
  else
    echo "PostgreSQL server is not running"
  fi
}

function create_database {
  if ! is_running; then
    echo "PostgreSQL server is not running"
    echo "Please run '$0 start' first"
    return 1
  fi

  # Check if database exists
  if psql -lqt | cut -d \| -f 1 | grep -qw "$PGDATABASE"; then
    echo "Database '$PGDATABASE' already exists"
    return 0
  fi

  echo "Creating database '$PGDATABASE'..."
  createdb "$PGDATABASE"
  echo "Database created successfully"
}

function check_port {
  if ! is_running; then
    echo "PostgreSQL server is not running"
    return 1
  fi
  
  # Get the port from postmaster.pid
  local pg_port
  if [ -f "$PGDATA/postmaster.pid" ]; then
    pg_port=$(head -n 4 "$PGDATA/postmaster.pid" | tail -n 1)
    echo "PostgreSQL is running on port: $pg_port"
    
    # Verify if the port is actually in use
    if netstat -tuln | grep -q ":$pg_port.*LISTEN"; then
      echo "✅ Confirmed: Port $pg_port is in use and listening"
    else
      echo "❌ Warning: Port $pg_port is configured but not listening"
    fi
    
    # Try a test connection
    if psql -p "$pg_port" -U "$PGUSER" -d "$PGDATABASE" -c "SELECT 1" > /dev/null 2>&1; then
      echo "✅ Connection test: Successfully connected to PostgreSQL on port $pg_port"
    else
      echo "❌ Connection test: Failed to connect to PostgreSQL on port $pg_port"
    fi
  else
    echo "Could not determine PostgreSQL port: postmaster.pid not found"
    return 1
  fi
}

function reset_db {
  if is_running; then
    echo "Stopping PostgreSQL server first..."
    stop_db
  fi
  
  echo "Removing PostgreSQL data directory at $PGDATA..."
  rm -rf "$PGDATA"
  
  echo "Reinitializing database..."
  init_db
  start_db
  create_database
  
  echo "PostgreSQL database has been reset successfully"
}

# Main script
case "$1" in
  init)
    init_db
    ;;
  start)
    start_db
    ;;
  stop)
    stop_db
    ;;
  status)
    status_db
    ;;
  check-port)
    check_port
    ;;
  create-db)
    create_database
    ;;
  reset-db)
    read -p "WARNING: This will delete all data. Are you sure? (y/N) " confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
      reset_db
    else
      echo "Database reset cancelled."
    fi
    ;;
  help|--help|-h)
    show_help
    ;;
  *)
    echo "Unknown command: $1"
    show_help
    exit 1
    ;;
esac
