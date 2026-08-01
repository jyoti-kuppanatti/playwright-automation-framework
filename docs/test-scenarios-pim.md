# OrangeHRM PIM Module — QA Test Scenarios

Site under test: https://opensource-demo.orangehrmlive.com (demo credentials: `Admin` / `admin123`)

Generated from live exploration of PIM > Add Employee, PIM > Employee List, and an employee's detail record. 67 scenarios total: 20 Add Employee, 28 Search Employee, 19 View/Edit Employee.

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

Confirmed live: search form fields are Employee Name (autocomplete), Employee Id, Employment Status, Include, Supervisor Name (autocomplete), Job Title, Sub Unit — no Nationality filter exists on this screen. Employment Status options: Freelance, Full-Time Contract, Full-Time Permanent, Full-Time Probation, Part-Time Contract, Part-Time Internship. Include options: Current Employees Only (default), Current and Past Employees, Past Employees Only. Sub Unit is a flattened hierarchical single-select dropdown, not a checkbox tree.

**Environment caveat**: this is a public, shared demo instance — other anonymous users continuously add/edit/delete employees. Automated assertions should avoid hardcoding exact total record counts, specific employee names, or exact page counts; prefer relative assertions (e.g. "count changes after filtering") or seed/verify test data via Add Employee immediately before searching for it.

### A. Employee Name search & autocomplete

| ID | Title | Type | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|
| ESRCH-01 | Search by exact full Employee Name, selected from autocomplete | Positive | At least one known employee exists | 1. Type a known employee's name in Employee Name until suggestions appear 2. Click the matching suggestion 3. Click Search | Employee Name field shows the full selected name; results table shows exactly that employee |
| ESRCH-02 | Search by partial name typed manually (no suggestion selected) | Positive (verified) | — | 1. Type a partial/substring of a known employee's last name 2. Press Escape to dismiss the dropdown without selecting anything 3. Click Search | Substring match still works server-side; the matching employee(s) are returned even though no autocomplete suggestion was clicked |
| ESRCH-03 | Autocomplete shows live suggestions while typing | Positive (verified) | — | 1. Type 2+ characters of a common name fragment (e.g. "am") | Dropdown shows a brief "Searching...." state, then up to 5 matching name suggestions |
| ESRCH-04 | Autocomplete with zero matches | Edge (verified) | — | 1. Type a fragment guaranteed not to match any employee | Dropdown itself displays a "No Records Found" option/state; typing is not blocked and manual Search still works |
| ESRCH-05 | Case-insensitive name search | Edge | Known employee name in mixed case | 1. Search using an all-lowercase version of a known employee's name 2. Repeat with all-uppercase | Both return the identical matching record(s) |
| ESRCH-06 | Search for a name with no matching employee | Negative | — | 1. Enter a clearly non-existent name (e.g. "zzzqqqnonexistentxyz999") 2. Click Search | "No Records Found" toast (bottom-left) appears; inline "No Records Found" text shown above the table; table shows only column headers, zero rows |
| ESRCH-07 | Whitespace-only Employee Name | Edge | — | 1. Enter only spaces into Employee Name 2. Click Search | Verify whether this is treated as an empty filter (returns the full/default list) or as literal whitespace (likely 0 results) — not yet confirmed live |
| ESRCH-08 | Very long string in Employee Name | Edge | — | 1. Paste a 500+ character string into Employee Name 2. Click Search | No client crash/UI break; search completes (likely 0 results); confirm whether input is truncated by a maxlength attribute |
| ESRCH-09 | Injection-style / special-character input in Employee Name | Negative | — | 1. Enter a string like `' OR '1'='1` or `<script>alert(1)</script>` (choose a string that won't coincidentally match a real record) 2. Click Search | No application error, no script execution/XSS; result is either 0 rows or a safe literal-text no-match |

### B. Employee Id search

| ID | Title | Type | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|
| ESRCH-10 | Search by exact Employee Id | Positive (verified) | A known Employee Id exists | 1. Note a real Employee Id from the table (e.g. the first row's Id) 2. Enter that exact value into Employee Id 3. Click Search | Exactly one row is returned, matching that Id |
| ESRCH-11 | Search by partial/substring Employee Id | Negative (verified) | — | 1. Enter only the first character/substring of a real Employee Id 2. Click Search | Zero results — Employee Id search requires an exact match; a substring does NOT return the full record (confirmed behaviorally different from Employee Name, which does substring-match) |
| ESRCH-12 | Search by non-existent Employee Id | Negative | — | 1. Enter an Id string not present in the system 2. Click Search | Same "No Records Found" behavior as ESRCH-06 |
| ESRCH-13 | Non-numeric / alphanumeric text in Employee Id | Edge (verified) | — | 1. Type letters (e.g. "abc") into Employee Id 2. Click Search | Field accepts the text with no client-side format validation; search executes (likely 0 results unless a record actually has that literal Id, which is possible here since custom Ids are free-text) |

### C. Employment Status filter

| ID | Title | Type | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|
| ESRCH-14 | Filter by each Employment Status option | Positive (verified options) | — | 1. Open Employment Status dropdown, confirm options: Freelance, Full-Time Contract, Full-Time Permanent, Full-Time Probation, Part-Time Contract, Part-Time Internship 2. Select one 3. Click Search | Only employees with that exact status are listed; record count updates |
| ESRCH-15 | Employment Status only, no other filters | Edge | — | 1. Select a status, leave all else blank/default 2. Click Search | Results and pagination correctly reflect the filtered subset (may still span multiple pages) |

### D. Include filter

| ID | Title | Type | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|
| ESRCH-16 | Default Include value | Positive (verified) | — | 1. Open Employee List fresh (no filters touched) | Include defaults to "Current Employees Only"; results exclude terminated employees |
| ESRCH-17 | Include = "Current and Past Employees" | Positive | At least one terminated/past employee exists | 1. Change Include to "Current and Past Employees" 2. Click Search | Both active and terminated employees appear in results |
| ESRCH-18 | Include = "Past Employees Only" | Positive (label verified) | At least one terminated employee exists | 1. Change Include to "Past Employees Only" 2. Click Search | Only terminated/past employees are returned; no currently active employees appear |

### E. Supervisor Name, Job Title, Sub Unit filters

| ID | Title | Type | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|
| ESRCH-19 | Filter by Supervisor Name (autocomplete) | Positive | A supervisor with direct reports exists | 1. Type into Supervisor Name, select a suggestion (same autocomplete pattern as Employee Name) 2. Click Search | Only employees reporting to that supervisor are returned |
| ESRCH-20 | Filter by Job Title | Positive (options verified) | — | 1. Select a Job Title from the dropdown 2. Click Search | Only employees with that exact job title are returned |
| ESRCH-21 | Filter by Sub Unit (top-level org unit) | Positive (verified structure) | — | 1. Select a top-level Sub Unit (e.g. "OrangeHRM") 2. Click Search | Employees under that unit and its child units are returned (verify live whether parent selection includes descendants or only direct members) |
| ESRCH-22 | Filter by Sub Unit (nested/child unit) | Positive | — | 1. Select a nested child unit (e.g. "Quality Assurance" under Engineering > Development) 2. Click Search | Only employees directly in that specific sub-unit are returned |

### F. Combined filters, Reset, pagination

| ID | Title | Type | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|
| ESRCH-23 | Combine Employee Name + Employment Status + Sub Unit | Positive | — | 1. Set all three filters together 2. Click Search | Results satisfy the AND of all three filters simultaneously |
| ESRCH-24 | Combined filters with no matching intersection | Negative | — | 1. Choose a combination guaranteed to have zero overlap (e.g. a name that exists only under one status, paired with a different status) 2. Click Search | "No Records Found" behavior, same as ESRCH-06, even though each filter individually would have matches |
| ESRCH-25 | Reset clears all filters to default | Positive (verified) | — | 1. Set Employee Name, Employee Id, Employment Status, Include all to non-default values 2. Click Reset | Employee Name/Id become empty; Employment Status/Job Title/Sub Unit return to "-- Select --"; Include returns to "Current Employees Only"; result list reverts to the default unfiltered view |
| ESRCH-26 | Re-search with a changed filter, without clicking Reset in between | Edge | A prior search was already run | 1. Run a search with Filter A 2. Change to Filter B (no Reset) 3. Click Search again | Results reflect only Filter B — no stale rows from the Filter A search remain |
| ESRCH-27 | Pagination navigates between pages | Positive (verified) | Result set spans multiple pages | 1. View default/unfiltered list 2. Click page "2", then page "3" | Each page shows a different set of rows; the active page indicator updates; the next-page chevron only appears when a further page exists (verify exact hide-vs-disable mechanic during automation) |
| ESRCH-28 | Record-count text reflects current filter/page state | Positive | — | 1. Perform any search | Text of the form "(N) Records Found" appears above the table and matches the actual number of matching rows across all pages |

### To verify (Search Employee)

| ID | Title | Notes |
|---|---|---|
| ESRCH-07 | Whitespace-only Employee Name | Confirm whether this is treated as an empty filter (returns full list) or as literal whitespace (likely 0 results) |
| ESRCH-08 | Very long string in Employee Name | Confirm whether the input is truncated by a maxlength attribute |
| ESRCH-21 | Sub Unit parent-selection scope | Confirm whether selecting a top-level Sub Unit includes descendant units' employees or only direct members |
| ESRCH-27 | Pagination chevron mechanic | Confirm whether the next/prev page controls are hidden or disabled at the first/last page |

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

- 20 scenarios for Add Employee (18 direct + 2 to-verify), 28 for Employee Search (24 direct + 4 to-verify), 19 for View/Edit (16 direct + 3 to-verify) — 67 total.
- "To verify" items were not directly confirmed via live exploration and should be spot-checked manually, or treated as an early discovery step during automation, before being hard-coded into assertions.
