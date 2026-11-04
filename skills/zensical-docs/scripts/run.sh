#!/bin/sh
set -eu

script_dir=$(CDPATH= cd "$(dirname "$0")" && pwd)
project_root=$(CDPATH= cd "$script_dir/../.." && pwd)
cd "$project_root"

selected_venv=
if [ -f .venv/bin/activate ]; then
  . .venv/bin/activate
  selected_venv="$project_root/.venv"
elif [ -f venv/bin/activate ]; then
  . venv/bin/activate
  selected_venv="$project_root/venv"
elif [ -n "${VIRTUAL_ENV:-}" ]; then
  selected_venv=$VIRTUAL_ENV
fi

if [ -n "$selected_venv" ]; then
  zensical="$selected_venv/bin/zensical"
  if [ ! -x "$zensical" ]; then
    printf '%s\n' "Zensical is not installed in the selected environment: $selected_venv" >&2
    printf '%s\n' "Install this project's documentation dependencies, then run this script again." >&2
    exit 127
  fi
else
  zensical=$(command -v zensical || true)
  if [ -z "$zensical" ]; then
    printf '%s\n' 'Zensical was not found in a project virtual environment or on PATH.' >&2
    printf '%s\n' "Follow this project's documentation setup instructions, then run this script again." >&2
    exit 127
  fi
fi

if [ "${1:-}" = "clean-serve" ]; then
  shift
  if ! build_help=$("$zensical" build --help 2>&1); then
    printf '%s\n' 'Could not inspect Zensical build options; clean preview was not started.' >&2
    exit 2
  fi
  case "$build_help" in
    *--clean*) ;;
    *)
      printf '%s\n' 'This Zensical version does not advertise build --clean; clean preview was not started.' >&2
      exit 2
      ;;
  esac
  "$zensical" build --clean
  exec "$zensical" serve "$@"
fi

if [ "$#" -eq 0 ]; then
  set -- serve
fi

exec "$zensical" "$@"
