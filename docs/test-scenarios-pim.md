# OrangeHRM PIM Module — QA Test Scenarios

Site under test: https://opensource-demo.orangehrmlive.com (demo credentials: `Admin` / `admin123`)

Generated from live exploration of PIM > Add Employee, PIM > Employee List, and an employee's detail record. 60 scenarios total: 20 Add Employee, 21 Search Employee, 19 View/Edit Employee.

---

## 1. Add Employee (PIM > Add Employee)

| ID | Title | Type | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|
| ADD-01 | Add employee with only required fields | Positive | Logged in as Admin | 1. Go to PIM > Add Employee 2. Enter First Name + Last Name only 3. Click Save | Employee is created; app redirects to the new employee's Personal Details tab; system-generated Employee Id is retained |
| ADD-02 | Add employee with full name and custom Employee ID | Positive | Logged in as Admin | 1. Fill First/Middle/Last Name 2. Overwrite auto-filled Employee Id with a custom unique value 3. Save | Employee created with the custom Employee Id shown on Personal Details |
| ADD-03 | Add employee with a valid photo | Positive | Have a .jpg < 1MB ready | 1. Click the "+" on the photo placeholder 2. Upload valid jpg 3. Fill required name fields 4. Save | Photo is uploaded and displayed on Personal Details and in the Employee List thumbnail |
| ADD-04 | Add employee with login details (Enabled) | Positive | — | 1. Fill required fields 2. Toggle "Create Login Details" ON 3. Enter Username, Password, Confirm Password (matching, meeting hint guidance) 4. Leave Status = Enabled 5. Save | Employee + login account created; login with the new credentials at the login page succeeds |
| ADD-05 | Add employee with login details (Disabled) | Positive | — | Same as ADD-04 but set Status = Disabled | Employee saved with account created but disabled; attempting to log in with those credentials fails with an inactive-account message |
| ADD-06 | Submit with both name fields empty | Negative (verified) | — | 1. Open Add Employee 2. Click Save without entering anything | Inline red "Required" text appears under both First Name and Last Name; form does not submit; still on Add Employee page |
| ADD-07 | Submit with only First Name filled | Negative | — | 1. Fill First Name only 2. Save | "Required" error shown only under Last Name; save blocked |
| ADD-08 | Submit with only Last Name filled | Negative | — | 1. Fill Last Name only 2. Save | "Required" error shown only under First Name; save blocked |
| ADD-10 | Create Login Details ON, Username left blank | Negative | — | 1. Toggle Create Login Details ON 2. Leave Username blank, fill Password/Confirm Password 3. Save | "Required" error under Username; save blocked |
| ADD-11 | Passwords do not match | Negative | — | 1. Toggle Create Login Details ON 2. Enter Username 3. Enter different values in Password and Confirm Password 4. Save | Validation error indicating passwords must match; save blocked |
| ADD-13 | Invalid photo type or oversized photo | Negative | Have a non-image file (e.g. .pdf) and/or an image > 1MB | 1. Attempt upload of the invalid file 2. Observe behavior | Upload is rejected with an error consistent with the stated constraint ("Accepts jpg, .png, .gif up to 1MB, 200x200 recommended") |
| ADD-14 | Special characters in name fields | Edge (evidence-based) | — | 1. Enter special characters (e.g. `@#$%`, `*`) as First/Last Name 2. Save | Save succeeds — the system currently permits this (an existing employee named `@#$%` was observed in the live list) |
| ADD-15 | Leading/trailing whitespace in name | Edge | — | 1. Enter "  John  " as First Name 2. Save | Verify whether whitespace is trimmed or preserved as-is on Personal Details |
| ADD-16 | Very long name value | Edge | — | 1. Enter a 200+ character string as First Name 2. Save | Verify max-length enforcement/truncation and that the UI does not break |
| ADD-17 | Keep auto-generated Employee ID unchanged | Edge | — | 1. Fill required fields, leave Employee Id as auto-populated 2. Save | Saves successfully using the system-suggested ID |
| ADD-18 | Rapid double-click on Save | Edge | — | 1. Fill valid required fields 2. Double-click Save quickly | Only one employee record is created (no duplicate submission) |
| ADD-19 | Cancel without saving | Edge | — | 1. Fill some fields 2. Click Cancel | Navigates to Employee List; no new employee record is created |
| ADD-20 | Browser back/forward after successful save | Edge | An employee was just added | 1. After save, click browser Back 2. Click Forward again | No duplicate submission occurs; page state is consistent (e.g., cached form doesn't resubmit) |

### To verify (Add Employee)

| ID | Title | Notes |
|---|---|---|
| ADD-09 | Duplicate Employee ID | Expect a validation error indicating the ID is already taken and save to be blocked when reusing an existing Employee Id; not yet confirmed live — verify exact error text before automating |
| ADD-12 | Weak/short password | Confirm whether the password-strength hint shown when "Create Login Details" is enabled is advisory only or actually enforced with a blocking error |

---

## 2. Search Employee (PIM > Employee List)

| ID | Title | Type | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|
| SEARCH-01 | Search by exact Employee Name | Positive | At least one known employee exists | 1. Enter full name in Employee Name 2. Click Search | Table shows only matching employee(s); record count updates accordingly |
| SEARCH-02 | Autocomplete suggestions for partial name | Positive | — | 1. Type a partial name in Employee Name 2. Observe dropdown 3. Select a suggestion 4. Search | Matching-name suggestions appear as you type; selecting one and searching returns that employee |
| SEARCH-03 | Search by Employee ID only | Positive | A known Employee Id exists | 1. Enter the ID in Employee Id field 2. Search | Exactly one matching record returned |
| SEARCH-04 | Filter by Employment Status | Positive | — | 1. Select a status (e.g. "Full-Time Permanent") from dropdown 2. Search | Only employees with that status are listed |
| SEARCH-05 | Filter by Include = "Current and Past Employees" | Positive | At least one terminated/past employee exists | 1. Change Include dropdown to that option 2. Search | Both current and terminated employees appear in results |
| SEARCH-07 | Filter by Supervisor Name | Positive | A supervisor with direct reports exists | 1. Enter/select Supervisor Name 2. Search | Only employees reporting to that supervisor are returned |
| SEARCH-08 | Filter by Job Title | Positive | — | 1. Select a Job Title from dropdown 2. Search | Only employees with that job title returned |
| SEARCH-09 | Filter by Sub Unit | Positive | — | 1. Select a Sub Unit from dropdown 2. Search | Only employees in that sub unit returned |
| SEARCH-10 | Combine multiple filters | Positive | — | 1. Set Employee Name/Status/Sub Unit together 2. Search | Results satisfy the AND of all selected filters simultaneously |
| SEARCH-11 | Reset button clears filters | Positive | Filters previously set | 1. Fill several filters 2. Click Reset | All fields return to default ("-- Select --" / "Current Employees Only" / empty text); result list reverts to the full unfiltered list |
| SEARCH-12 | Pagination navigation | Positive | Result set spans multiple pages (verified: default list has 116 records / 3 pages) | 1. Perform a broad search or view the default list 2. Click page 2, then page 3 | Different records shown per page; active page indicator updates; next-page arrow works and disables appropriately at the last page |
| SEARCH-13 | Search for a non-existent name | Negative (verified) | — | 1. Enter a name that matches no record (e.g. "zzzznotexist") 2. Search | "No Records Found" toast appears plus an inline "No Records Found" line; table shows column headers only, no rows |
| SEARCH-14 | Search by non-existent Employee ID | Negative | — | 1. Enter an ID not in the system 2. Search | "No Records Found" behavior identical to SEARCH-13 |
| SEARCH-15 | Injection-style input in Employee Name | Negative | — | 1. Enter a string like `' OR '1'='1` (choosing a string that does NOT collide with a real record, since e.g. `@#$%` legitimately matches an existing employee) 2. Search | No application error/crash; either zero results or safely-escaped literal-text matching only |
| SEARCH-16 | Whitespace-only search term | Edge | — | 1. Enter only spaces into Employee Name 2. Search | Verify whether this behaves as an empty search (returns full list) or as a literal (likely no results) |
| SEARCH-17 | Autocomplete with no matches | Edge | — | 1. Type a name fragment with zero matches | Typeahead shows no suggestions / appropriate empty state, without blocking manual full-text search |
| SEARCH-18 | Case-insensitive name search | Edge | Known employee name in mixed case | 1. Search using all-lowercase version of an existing name 2. Search again using all-uppercase | Both return the same matching record(s) |
| SEARCH-19 | Very long string in Employee Name field | Edge | — | 1. Paste a 500+ character string into Employee Name 2. Search | No UI break; input is handled or truncated gracefully, and search still completes (even if returning no results) |
| SEARCH-20 | Large result set with only status filter | Edge | — | 1. Select only an Employment Status, leave name blank 2. Search | Record count text and pagination update correctly for the larger filtered set |
| SEARCH-21 | Re-search with changed filters without clicking Reset | Edge | A prior search was already run | 1. Run a search 2. Change one filter value 3. Click Search again (no Reset in between) | Results reflect only the latest filter combination — no stale results from the previous search remain |

### To verify (Search Employee)

| ID | Title | Notes |
|---|---|---|
| SEARCH-06 | Filter by Include = past-only option | Only terminated/past employees expected once the past-employees-only option is selected; exact dropdown label was not confirmed live |

---

## 3. View & Edit Employee Details

| ID | Title | Type | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|
| VIEW-01 | Open employee record from Employee List | Positive (verified) | At least one employee exists | 1. From Employee List, click on an employee's row/name | Navigates to that employee's Personal Details tab; header photo/name and Employee Id match the selected row |
| VIEW-02 | All expected tabs are present and navigable | Positive (verified) | On an employee detail page | 1. Observe/click each left-nav tab | Personal Details, Contact Details, Emergency Contacts, Dependents, Immigration, Job, Salary, Report-to, Qualifications, Memberships are all present and each loads its own panel without error |
| VIEW-03 | Edit Personal Details fields and save | Positive | On Personal Details tab | 1. Update Nationality, Marital Status, Date of Birth, Gender 2. Click Save | Success confirmation shown; values persist after reloading the page |
| VIEW-04 | Edit Contact Details and save | Positive | On Contact Details tab | 1. Update Street 1/City/Country and a phone/email field 2. Click Save | Success confirmation; values persist on revisit |
| VIEW-05 | Add an attachment | Positive | On a tab with an Attachments section (e.g. Personal Details) | 1. Click "+ Add" under Attachments 2. Upload a valid file with description 3. Save | New row appears in the attachments table with correct File Name, Size, Type, Date Added, Added By |
| VIEW-06 | Add a Salary Component | Positive | On Salary tab | 1. Click "+ Add" 2. Select Salary Component, enter Amount, Currency, Pay Frequency 3. Save | New row appears under "Assigned Salary Components" with the entered values |
| VIEW-08 | Update employee full name from Personal Details | Positive | — | 1. Change First/Last Name on Personal Details 2. Save 3. Return to Employee List | Updated name reflects immediately in the left-panel header and in the Employee List table |
| VIEW-09 | Clear a required field and save | Negative | — | 1. On Personal Details, clear First Name (or Last Name) 2. Click Save | Inline "Required" validation error shown (same pattern as Add Employee); save blocked |
| VIEW-11 | Malformed date typed manually | Negative | — | 1. Manually type an invalid date string into a date field instead of using the picker (e.g. License Expiry Date) 2. Save | Expect a format validation error rather than silent acceptance |
| VIEW-12 | Invalid email format | Negative | On Contact Details tab | 1. Enter "notanemail" into Work Email or Other Email 2. Save | Validation error such as "Expecting an email address"; save blocked |
| VIEW-13 | Overlong text in address fields | Negative | — | 1. Enter an excessively long string into Street 1 or City 2. Save | Field enforces a max length (truncates or errors) rather than corrupting data |
| VIEW-14 | Oversized/invalid attachment | Edge | — | 1. Attempt to upload an oversized or disallowed file type as an attachment | Upload rejected with an appropriate error, consistent with the photo-upload constraints |
| VIEW-15 | Clear optional fields and save | Edge | — | 1. Clear an optional field (e.g. Other Id, Driver's License Number) 2. Save | Saves successfully with the field left blank; no validation error since it's optional |
| VIEW-17 | Concurrent edits by two sessions | Edge | Two logged-in admin sessions viewing the same employee | 1. Session A edits and saves a field 2. Session B (with stale data) edits a different/same field and saves | Verify there's no silent data loss and behavior is either last-write-wins or a conflict is surfaced |
| VIEW-18 | Direct URL access to a deleted employee | Edge | An employee has been deleted (or use an ID guaranteed not to exist) | 1. Navigate directly to the employee-detail URL for a non-existent Employee record | App shows a graceful error/empty state instead of crashing |
| VIEW-19 | Leave a tab with visible validation errors | Edge | Validation errors currently showing (per VIEW-09) | 1. With "Required" errors visible, switch to another tab, then switch back | No stale/incorrect data persists; errors clear appropriately without corrupting the record |

### To verify (View/Edit Employee)

| ID | Title | Notes |
|---|---|---|
| VIEW-07 | Switch tabs with unsaved changes | Confirm actual behavior: are changes silently discarded, or is a confirmation/warning shown, when navigating away from a tab with unsaved edits? |
| VIEW-10 | Invalid/implausible Date of Birth | Confirm whether the app validates date sanity (e.g. rejects future dates or implausible years like 1800) or accepts anything |
| VIEW-16 | Refresh while on a non-default tab | Determine whether reloading the browser while on a non-default tab (e.g. Job) returns to the default Personal Details tab or preserves the current tab via URL routing |

---

## Summary

- 20 scenarios for Add Employee (18 direct + 2 to-verify), 21 for Employee Search (20 direct + 1 to-verify), 19 for View/Edit (16 direct + 3 to-verify) — 60 total.
- "To verify" items were not directly confirmed via live exploration and should be spot-checked manually, or treated as an early discovery step during automation, before being hard-coded into assertions.
