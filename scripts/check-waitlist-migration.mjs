#!/usr/bin/env node

import fs from "node:fs"

const migrationPath = "supabase/migrations/20260629000000_create_waitlist.sql"
const expectedGradYears = ["2027", "2028", "2029", "2030"]

function fail(message, details = {}) {
  const error = new Error(message)
  error.details = details
  throw error
}

function assertMatch(sql, pattern, message) {
  if (!pattern.test(sql)) {
    fail(message)
  }
}

function assertNoMatch(sql, pattern, message) {
  if (pattern.test(sql)) {
    fail(message)
  }
}

function readMigration() {
  if (!fs.existsSync(migrationPath)) {
    fail("Waitlist migration file is missing", { migrationPath })
  }

  return fs.readFileSync(migrationPath, "utf8")
}

function checkTableContract(sql) {
  assertMatch(sql, /create\s+table\s+if\s+not\s+exists\s+public\.waitlist\s*\(/i, "Missing public.waitlist table creation")
  assertMatch(sql, /id\s+bigint\s+generated\s+always\s+as\s+identity\s+primary\s+key/i, "Missing identity primary key")
  assertMatch(sql, /created_at\s+timestamptz\s+not\s+null\s+default\s+now\(\)/i, "Missing created_at default")
  assertMatch(sql, /first_name\s+text\s+not\s+null/i, "Missing required first_name column")
  assertMatch(sql, /last_name\s+text\s+not\s+null/i, "Missing required last_name column")
  assertMatch(sql, /email\s+text\s+not\s+null/i, "Missing required email column")
  assertMatch(sql, /sport\s+text\s+not\s+null\s+default\s+'Track\s*&\s*Field'/i, "Missing Track & Field sport default")
  assertMatch(sql, /grad_year\s+text\s+not\s+null/i, "Missing required grad_year column")
  assertMatch(sql, /phone\s+text/i, "Missing phone column")
  assertMatch(sql, /source\s+text\s+not\s+null\s+default\s+'website'/i, "Missing website source default")
  console.log("ok waitlist table contract")
}

function checkDuplicateProtection(sql) {
  assertMatch(
    sql,
    /create\s+unique\s+index\s+if\s+not\s+exists\s+waitlist_email_unique_idx\s+on\s+public\.waitlist\s*\(\s*lower\s*\(\s*email\s*\)\s*\)/is,
    "Missing duplicate-email unique index on lower(email)",
  )
  console.log("ok waitlist duplicate-email protection")
}

function checkRlsAndGrants(sql) {
  assertMatch(sql, /alter\s+table\s+public\.waitlist\s+enable\s+row\s+level\s+security/i, "RLS is not enabled on public.waitlist")
  assertMatch(sql, /revoke\s+all\s+on\s+table\s+public\.waitlist\s+from\s+anon\s*,\s*authenticated/i, "Missing baseline revoke for anon/authenticated")
  assertMatch(sql, /grant\s+insert\s+on\s+table\s+public\.waitlist\s+to\s+anon\s*,\s*authenticated/i, "Missing insert grant for public waitlist submissions")
  assertMatch(sql, /grant\s+usage\s+on\s+sequence\s+public\.waitlist_id_seq\s+to\s+anon\s*,\s*authenticated/i, "Missing identity sequence usage grant")
  assertNoMatch(sql, /grant\s+(select|update|delete|all)\s+on\s+table\s+public\.waitlist\s+to\s+(anon|authenticated)/i, "Waitlist migration grants broader client table access than intended")
  console.log("ok waitlist RLS and client grants")
}

function checkInsertPolicy(sql) {
  assertMatch(sql, /drop\s+policy\s+if\s+exists\s+"Public can join waitlist"\s+on\s+public\.waitlist/i, "Missing idempotent policy drop")
  assertMatch(sql, /create\s+policy\s+"Public can join waitlist"\s+on\s+public\.waitlist\s+for\s+insert\s+to\s+anon\s*,\s*authenticated\s+with\s+check\s*\(/is, "Missing public insert policy")
  assertMatch(sql, /char_length\s*\(\s*btrim\s*\(\s*first_name\s*\)\s*\)\s+between\s+1\s+and\s+80/i, "Insert policy does not bound first_name")
  assertMatch(sql, /char_length\s*\(\s*btrim\s*\(\s*last_name\s*\)\s*\)\s+between\s+1\s+and\s+80/i, "Insert policy does not bound last_name")
  assertMatch(sql, /email\s*=\s*lower\s*\(\s*btrim\s*\(\s*email\s*\)\s*\)/i, "Insert policy does not require normalized lowercase email")
  assertMatch(sql, /char_length\s*\(\s*email\s*\)\s+between\s+5\s+and\s+254/i, "Insert policy does not bound email length")
  assertMatch(sql, /email\s+~\*\s+'[^']+@[^']+'/i, "Insert policy does not validate email shape")
  assertMatch(sql, /sport\s*=\s*'Track\s*&\s*Field'/i, "Insert policy does not restrict sport to Track & Field")
  for (const year of expectedGradYears) {
    assertMatch(sql, new RegExp(`grad_year\\s+in\\s*\\([^)]*'${year}'`, "is"), `Insert policy does not allow grad year ${year}`)
  }
  assertMatch(sql, /phone\s+is\s+null\s+or\s+char_length\s*\(\s*btrim\s*\(\s*phone\s*\)\s*\)\s*<=\s*40/i, "Insert policy does not bound optional phone")
  assertMatch(sql, /source\s*=\s*'website'/i, "Insert policy does not restrict source to website")
  console.log("ok waitlist insert policy contract")
}

try {
  const sql = readMigration()
  checkTableContract(sql)
  checkDuplicateProtection(sql)
  checkRlsAndGrants(sql)
  checkInsertPolicy(sql)
} catch (error) {
  console.error(`waitlist migration check failed: ${error.message}`)
  if (error.details && Object.keys(error.details).length > 0) {
    console.error(JSON.stringify(error.details, null, 2))
  }
  process.exitCode = 1
}
