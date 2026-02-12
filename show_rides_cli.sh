#!/bin/bash

SERVER_URL="http://localhost:3000"

KEYWORD=""
PARK=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --search|-s)
      KEYWORD="$2"
      shift 2
      ;;
    --park|-p)
      PARK="$2"
      shift 2
      ;;
    *)
      echo "Usage: $0 [--search <keyword>] [--park <park name>]"
      exit 1
      ;;
  esac
done

RESPONSE=$(curl -s "$SERVER_URL")

FILTER_EXPR=".[]"
if [[ -n "$KEYWORD" ]]; then
  FILTER_EXPR="$FILTER_EXPR
    | select(
        (.name | test(\"$KEYWORD\"; \"i\")) or
        (.park | test(\"$KEYWORD\"; \"i\")) or
        (.type[] | test(\"$KEYWORD\"; \"i\"))
      )"
fi

if [[ -n "$PARK" ]]; then
  FILTER_EXPR="$FILTER_EXPR | select(.park == \"$PARK\")"
fi

FILTERED=$(echo "$RESPONSE" | jq -r "$FILTER_EXPR")

if [[ -z "$FILTERED" ]]; then
  echo "No rides found."
  exit 0
fi

# Header
printf "%-3s %-45s %-28s %-10s %s\n" "ID" "Name" "Park" "Status" "Type"
printf "%-3s %-45s %-28s %-10s %s\n" "--" "----" "----" "------" "----"

echo "$FILTERED" \
| jq -r '"\(.id)|\(.name)|\(.park)|\(.status)|\(.type | join(", "))"' \
| while IFS="|" read -r id name park status status2; do
    printf "%-3s %-45s %-28s %-10s %s\n" \
      "$id" "$name" "$park" "$status" "$status2"
  done
