# FinVerse REST API Documentation Specifications

This document outlines the required backend REST API design for the **FinVerse Foundation & Banking MVP (Release 1)**. The specifications detailed below match the simulated data structures, payloads, and handlers implemented in the frontend mock service layers.

---

## 🔐 1. Authentication & Session APIs

### 1.1 Login User
Authenticate credentials and establish a secure session.

*   **API Endpoint**: `POST /api/auth/login`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Payload**:
    ```json
    {
      "email": "alex.mercer@finverse.com",
      "password": "password123"
    }
    ```
*   **Success Response** (Status Code: `200 OK`):
    ```json
    {
      "success": true,
      "message": "Login successful.",
      "data": {
        "name": "Alex Mercer",
        "email": "alex.mercer@finverse.com",
        "tier": "Standard",
        "avatarUrl": "https://api.dicebear.com/7.x/initials/svg?seed=AM&backgroundColor=06b6d4"
      }
    }
    ```
*   **Error Response** (Status Code: `401 Unauthorized` / `400 Bad Request`):
    ```json
    {
      "success": false,
      "message": "Invalid email address format or incorrect password credentials."
    }
    ```

---

### 1.2 Register User
Create a new user profile and allocate an active membership tier.

*   **API Endpoint**: `POST /api/auth/register`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Payload**:
    ```json
    {
      "name": "Bruce Wayne",
      "email": "wealth.wayne@finverse.com",
      "password": "securepassword99",
      "tier": "Wealth" 
    }
    ```
    *Note: `tier` must be one of: `"Standard"`, `"Premium"`, or `"Wealth"`.*
*   **Success Response** (Status Code: `201 Created`):
    ```json
    {
      "success": true,
      "message": "Registration successful.",
      "data": {
        "name": "Bruce Wayne",
        "email": "wealth.wayne@finverse.com",
        "tier": "Wealth",
        "avatarUrl": "https://api.dicebear.com/7.x/initials/svg?seed=BW&backgroundColor=8b5cf6"
      }
    }
    ```
*   **Error Response** (Status Code: `400 Bad Request` / `409 Conflict`):
    ```json
    {
      "success": false,
      "message": "Email address already registered in the ecosystem."
    }
    ```

---

### 1.3 Recover Password (Trigger OTP)
Verify email existence and trigger a simulated 4-digit code dispatch.

*   **API Endpoint**: `POST /api/auth/forgot-password`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Payload**:
    ```json
    {
      "email": "alex.mercer@finverse.com"
    }
    ```
*   **Success Response** (Status Code: `200 OK`):
    ```json
    {
      "success": true,
      "message": "A simulated 4-digit verification code has been dispatched.",
      "data": {
        "otpToken": "4209"
      }
    }
    ```
*   **Error Response** (Status Code: `404 Not Found`):
    ```json
    {
      "success": false,
      "message": "Email not found in database."
    }
    ```

---

### 1.4 Verify Recovery OTP
Validate the correctness of the verification code.

*   **API Endpoint**: `POST /api/auth/verify-otp`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Payload**:
    ```json
    {
      "email": "alex.mercer@finverse.com",
      "otpCode": "4209"
    }
    ```
*   **Success Response** (Status Code: `200 OK`):
    ```json
    {
      "success": true,
      "message": "OTP Code verified successfully."
    }
    ```
*   **Error Response** (Status Code: `400 Bad Request`):
    ```json
    {
      "success": false,
      "message": "Invalid OTP. Please enter the code 4209."
    }
    ```

---

### 1.5 Update Password (Reset)
Set the new password after successful OTP verification.

*   **API Endpoint**: `POST /api/auth/reset-password`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Payload**:
    ```json
    {
      "email": "alex.mercer@finverse.com",
      "password": "newsecurepassword123"
    }
    ```
*   **Success Response** (Status Code: `200 OK`):
    ```json
    {
      "success": true,
      "message": "Your password has been successfully reset."
    }
    ```

---

### 1.6 Fetch Device Sessions
Retrieve the list of active device/browser sessions authenticated for the user.

*   **API Endpoint**: `GET /api/auth/sessions`
*   **Success Response** (Status Code: `200 OK`):
    ```json
    {
      "success": true,
      "sessions": [
        {
          "id": "1",
          "device": "Chrome / Windows (Current)",
          "ip": "192.168.1.45",
          "location": "Hyderabad, IN",
          "lastActive": "Just Now"
        },
        {
          "id": "2",
          "device": "Safari / iPhone 15 Pro",
          "ip": "103.54.21.9",
          "location": "Mumbai, IN",
          "lastActive": "3 hours ago"
        }
      ]
    }
    ```

---

### 1.7 Terminate Session
Revoke access for a specific device.

*   **API Endpoint**: `DELETE /api/auth/sessions/{sessionId}`
*   **Success Response** (Status Code: `200 OK`):
    ```json
    {
      "success": true,
      "message": "The selected device session was terminated successfully."
    }
    ```

---

## 🏦 2. Banking & Portfolio APIs

### 2.1 Get Financial Accounts
Retrieve balances, account numbers, interest rates, and details for all checking, savings, investment, credit, and loan accounts.

*   **API Endpoint**: `GET /api/banking/accounts`
*   **Success Response** (Status Code: `200 OK`):
    ```json
    {
      "success": true,
      "accounts": [
        {
          "id": "acc-checking",
          "name": "Titanium Checking",
          "accountNumber": "•••• 8920",
          "balance": 24580.42,
          "type": "checking",
          "sparklineData": [23800, 24100, 24000, 24350, 24200, 24580.42]
        },
        {
          "id": "acc-savings",
          "name": "High-Yield Growth Savings",
          "accountNumber": "•••• 1104",
          "balance": 89120.50,
          "type": "savings",
          "sparklineData": [88000, 88300, 88600, 88800, 89000, 89120.50]
        },
        {
          "id": "acc-portfolio",
          "name": "Wealth Management Portfolio",
          "accountNumber": "•••• 7761",
          "balance": 154200.0,
          "type": "investment",
          "sparklineData": [148000, 151000, 149500, 153000, 152800, 154200.0]
        },
        {
          "id": "acc-credit",
          "name": "FinVerse Infinite Credit Card",
          "accountNumber": "•••• 3892",
          "balance": 3450.2,
          "limit": 15000.0,
          "type": "credit",
          "sparklineData": [2100, 2800, 3100, 3050, 3200, 3450.2]
        },
        {
          "id": "acc-loan",
          "name": "Executive Mortgage Loan",
          "accountNumber": "•••• 4522",
          "balance": 28900.0,
          "rate": 3.75,
          "monthlyPayment": 850.0,
          "type": "loan",
          "sparklineData": [32000, 31150, 30300, 29450, 28900]
        }
      ]
    }
    ```

---

### 2.2 Get Transaction History
Retrieve the global transaction history. Supports query parameters for search, filtering, and sorting.

*   **API Endpoint**: `GET /api/banking/transactions`
*   **Query Parameters**:
    *   `search` (string): Text filter matching descriptions.
    *   `accountId` (string): Specific account ID.
    *   `category` (string): Category filter (e.g. `Salary`, `Shopping`, `Food & Dining`).
    *   `type` (string): Flow direction (`deposit`, `withdrawal`, `transfer_in`, `transfer_out`).
    *   `sortBy` (string): Ordering (`date-desc`, `date-asc`, `amount-desc`, `amount-asc`).
*   **Success Response** (Status Code: `200 OK`):
    ```json
    {
      "success": true,
      "transactions": [
        {
          "id": "tx-101",
          "accountId": "acc-checking",
          "type": "deposit",
          "amount": 4200.0,
          "category": "Salary",
          "description": "FinVerse Group Payroll Direct Dep",
          "date": "2026-06-04T07:05:00.000Z"
        },
        {
          "id": "tx-102",
          "accountId": "acc-checking",
          "type": "withdrawal",
          "amount": 124.5,
          "category": "Food & Dining",
          "description": "The Prime Steakhouse & Lounge",
          "date": "2026-06-03T07:05:00.000Z"
        }
      ]
    }
    ```

---

## 👥 3. Beneficiaries & Payees APIs

### 3.1 Fetch Beneficiary Registry
Get the saved beneficiary contacts.

*   **API Endpoint**: `GET /api/banking/beneficiaries`
*   **Success Response** (Status Code: `200 OK`):
    ```json
    {
      "success": true,
      "beneficiaries": [
        {
          "id": "ben-1",
          "name": "Sita Sharma",
          "accountNumber": "1098273645",
          "bankName": "Global Reserve Bank",
          "nickname": "Sita S",
          "email": "sita.sharma@example.com",
          "avatarColor": "#ec4899"
        }
      ]
    }
    ```

---

### 3.2 Create Beneficiary Payee
Register a new payee contact.

*   **API Endpoint**: `POST /api/banking/beneficiaries`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Payload**:
    ```json
    {
      "name": "Sita Sharma",
      "accountNumber": "1098273645",
      "bankName": "Global Reserve Bank",
      "nickname": "Sita S",
      "email": "sita.sharma@example.com"
    }
    ```
*   **Success Response** (Status Code: `201 Created`):
    ```json
    {
      "success": true,
      "message": "Sita Sharma has been added to your saved beneficiaries.",
      "data": {
        "id": "ben-1717754321000",
        "name": "Sita Sharma",
        "accountNumber": "1098273645",
        "bankName": "Global Reserve Bank",
        "nickname": "Sita S",
        "email": "sita.sharma@example.com",
        "avatarColor": "#ec4899"
      }
    }
    ```

---

### 3.3 Edit Beneficiary Payee
Update an existing beneficiary nickname or details.

*   **API Endpoint**: `PUT /api/banking/beneficiaries/{id}`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Payload**:
    ```json
    {
      "name": "Sita Sharma",
      "accountNumber": "1098273645",
      "bankName": "Global Reserve Bank",
      "nickname": "Sita Sharma (Work)",
      "email": "sita.sharma@work.com"
    }
    ```
*   **Success Response** (Status Code: `200 OK`):
    ```json
    {
      "success": true,
      "message": "Successfully updated profile details for Sita Sharma."
    }
    ```

---

### 3.4 Delete Beneficiary Payee
Remove a payee from saved records.

*   **API Endpoint**: `DELETE /api/banking/beneficiaries/{id}`
*   **Success Response** (Status Code: `200 OK`):
    ```json
    {
      "success": true,
      "message": "Beneficiary deleted successfully."
    }
    ```

---

## 💸 4. Fund Transfer APIs

### 4.1 Authorize and Process Transfer
Deduct the amount from the source bank account and record the transaction.

*   **API Endpoint**: `POST /api/banking/transfers`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Payload**:
    ```json
    {
      "sourceAccountId": "acc-checking",
      "beneficiaryId": "ben-1",
      "amount": 450.0,
      "remarks": "Services rendered",
      "category": "Transfer"
    }
    ```
*   **Success Response** (Status Code: `200 OK`):
    ```json
    {
      "success": true,
      "message": "Transfer processed successfully.",
      "data": {
        "transactionId": "tx-1717754900000",
        "reference": "TXN98201104",
        "date": "2026-06-07T07:18:27.000Z"
      }
    }
    ```
*   **Error Response** (Status Code: `400 Bad Request`):
    ```json
    {
      "success": false,
      "message": "Insufficient funds in the selected account."
    }
    ```

---

## ⚙️ 5. Preferences & Settings APIs

### 5.1 Save System Preferences
Save currency, theme mode, and notification channels.

*   **API Endpoint**: `PUT /api/preferences`
*   **Request Headers**: `Content-Type: application/json`
*   **Request Payload**:
    ```json
    {
      "theme": "dark",
      "currency": "EUR",
      "notificationPrefs": {
        "email": true,
        "sms": false,
        "push": true
      }
    }
    ```
*   **Success Response** (Status Code: `200 OK`):
    ```json
    {
      "success": true,
      "message": "Preferences updated successfully."
    }
    ```
