import { ExpenseCategory, SampleEmailReceipt, ExpenseTransaction } from "./types";

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  "Food & Dining": "#10B981", // Emerald
  "Groceries": "#059669",     // Deep Emerald
  "Transportation": "#3B82F6", // Blue
  "Shopping": "#F59E0B",      // Amber
  "Entertainment": "#8B5CF6", // Purple
  "Bills & Utilities": "#EF4444", // Rose
  "Healthcare": "#EC4899",    // Pink
  "Education": "#6366F1",     // Indigo
  "Travel": "#06B6D4",        // Cyan
  "Subscriptions": "#14B8A6", // Teal
  "Other": "#64748B",         // Slate
};

export const SAMPLE_RECEIPT_EMAILS: SampleEmailReceipt[] = [
  {
    id: "msg_starbucks_2026",
    sender: "order@starbucks.com",
    senderName: "Starbucks Coffee",
    subject: "Your Starbucks E-Receipt — Order #2891",
    date: "2026-09-18",
    receivedTime: "8:42 AM",
    preview: "Thanks for visiting Starbucks store #4912. Your payment of $8.40 was processed successfully.",
    rawBody: `STARBUCKS STORE #4912
Market Street, Suite 100
Transaction: 8492019482
Date: September 18, 2026  8:39 AM

1x Grande Caffe Latte              $4.95
   - Whole Milk, 1 Pump Vanilla
1x Butter Croissant                $3.45

Subtotal:                          $8.40
Tax:                               $0.00 (Included)
TOTAL CHARGED TO VISA (...4912):   $8.40

Cardholder: Awais Raza
Thank you for your business! Star Balance: 142 Stars`,
    expectedMerchant: "Starbucks",
    expectedAmount: 8.40,
    expectedCategory: "Food & Dining",
    status: "unread",
  },
  {
    id: "msg_uber_2026",
    sender: "receipts@uber.com",
    senderName: "Uber Receipts",
    subject: "Your Friday morning trip with Uber — Trip #UB-94812",
    date: "2026-09-18",
    receivedTime: "10:15 AM",
    preview: "Thanks for riding, Awais. Total charged: $18.20 on your Apple Pay card.",
    rawBody: `Uber Technologies Inc.
TRIP RECEIPT #UB-94812
Date: September 18, 2026

Trip Fare (UberX):                $14.50
Tolls & Surcharges:                $1.70
Booking Fee:                       $2.00
-----------------------------------------
Total Paid:                       $18.20
Payment Method: Apple Pay (Visa ending in 4912)

Pickup: Downtown Terminal (9:52 AM)
Dropoff: Innovation Hub (10:14 AM)
Distance: 4.8 miles | Duration: 22 mins`,
    expectedMerchant: "Uber",
    expectedAmount: 18.20,
    expectedCategory: "Transportation",
    status: "unread",
  },
  {
    id: "msg_netflix_2026",
    sender: "billing@netflix.com",
    senderName: "Netflix",
    subject: "Your Netflix subscription invoice for September 2026",
    date: "2026-09-17",
    receivedTime: "12:00 AM",
    preview: "Your monthly subscription has renewed. Amount: $15.49. Next billing date: Oct 17, 2026.",
    rawBody: `Netflix Services US LLC
Invoice #: NFLX-901848201
Billing Cycle: Sep 17, 2026 - Oct 16, 2026

Description:
Standard Plan (HD streaming on 2 screens)
Monthly recurring charge:          $15.49
Tax:                               $0.00
-----------------------------------------
Total Paid:                       $15.49
Billed to: Visa ...4912

Manage membership: netflix.com/youraccount`,
    expectedMerchant: "Netflix",
    expectedAmount: 15.49,
    expectedCategory: "Subscriptions",
    status: "unread",
  },
  {
    id: "msg_walmart_2026",
    sender: "help@walmart.com",
    senderName: "Walmart Supercenter",
    subject: "Walmart Store Receipt: $74.32 in Store #3129",
    date: "2026-09-16",
    receivedTime: "5:30 PM",
    preview: "Your e-receipt from Walmart Store #3129. Organic produce, dairy, bakery items. Total: $74.32.",
    rawBody: `WALMART SUPERCENTER #3129
Manager: D. Robinson
ST# 03129  OP# 008129  TE# 14  TR# 09412
Date: 09/16/2026  17:28:44

ORGANIC BANANAS 2.4 LB             $1.89
GV WHOLE MILK 1 GAL                $3.78
CAGE FREE EGGS 18CT                $5.12
HONEY CRISP APPLES                 $6.44
CHICKEN BREAST FAMILY PACK        $14.80
SOURDOUGH BREAD ARTISAN            $4.25
TIDE PODS SPRING MEADOW           $18.99
SPARKLING WATER 12PK               $5.99
ORGANIC SPINACH 16OZ               $4.49
AVOCADOS HASS 4PK                  $4.98
-----------------------------------------
SUBTOTAL                          $70.73
SALES TAX                          $3.59
TOTAL                             $74.32
DEBIT CARD TEND                   $74.32`,
    expectedMerchant: "Walmart",
    expectedAmount: 74.32,
    expectedCategory: "Groceries",
    status: "unread",
  },
  {
    id: "msg_amazon_2026",
    sender: "auto-confirm@amazon.com",
    senderName: "Amazon.com",
    subject: "Your Amazon.com order #114-98218-3829 of Anker USB-C Fast Charger",
    date: "2026-09-15",
    receivedTime: "2:18 PM",
    preview: "Order Confirmed: Anker 65W GaN Fast Charger with 6ft Braided Cable. Total: $42.99.",
    rawBody: `Amazon.com Order Confirmation
Order #114-98218-3829
Placed on September 15, 2026

Items Ordered:
1 of Anker 65W GaN Fast Wall Charger (Dual Port)
Condition: New
Sold by: AnkerOfficial
Price:                             $39.99

Shipping & Handling:               $0.00 (Prime Free)
Estimated Tax:                     $3.00
-----------------------------------------
Grand Total:                      $42.99
Payment: Amazon Prime Rewards Visa (ending 4912)`,
    expectedMerchant: "Amazon",
    expectedAmount: 42.99,
    expectedCategory: "Shopping",
    status: "unread",
  },
  {
    id: "msg_coned_2026",
    sender: "customerservice@coned.com",
    senderName: "Con Edison",
    subject: "Your Con Edison bill payment confirmation - $86.50",
    date: "2026-09-14",
    receivedTime: "11:04 AM",
    preview: "Thank you for your payment of $86.50 for residential electricity & gas service.",
    rawBody: `Consolidated Edison Company
Payment Confirmation #CN-4910283
Account Number: 849-291-0012

Service Address: 454 Columbus Ave
Service Period: Aug 12 - Sep 11, 2026

Charges:
Electric Supply & Delivery:        $62.30
Gas Service:                       $24.20
-----------------------------------------
Total Amount Paid:                $86.50
Payment Processed: Bank ACH (Checking ...8812)`,
    expectedMerchant: "Con Edison",
    expectedAmount: 86.50,
    expectedCategory: "Bills & Utilities",
    status: "unread",
  },
  {
    id: "msg_delta_2026",
    sender: "ticketreceipt@delta.com",
    senderName: "Delta Air Lines",
    subject: "Delta Flight Confirmation - E-Ticket #006-281940182",
    date: "2026-09-12",
    receivedTime: "3:40 PM",
    preview: "Your flight reservation is confirmed: JFK New York to SFO San Francisco. Total: $312.00.",
    rawBody: `DELTA AIR LINES PASSENGER RECEIPT
Ticket Number: 006-281940182
Booking Reference: DL-9J42K1
Passenger: Awais Raza

Flight DL 418 | Non-stop Main Cabin
Depart: JFK New York (8:00 AM)
Arrive: SFO San Francisco (11:35 AM)

Airfare:                          $274.00
Federal Excise Tax:                $20.55
Passenger Facility Charge:          $4.50
September 11 Security Fee:          $5.60
Segment Fee:                        $7.35
-----------------------------------------
Total Ticket Cost:               $312.00
Billed to: American Express (...3019)`,
    expectedMerchant: "Delta Air Lines",
    expectedAmount: 312.00,
    expectedCategory: "Travel",
    status: "unread",
  },
  {
    id: "msg_spotify_2026",
    sender: "no-reply@spotify.com",
    senderName: "Spotify",
    subject: "Spotify Premium Receipt — Your monthly bill",
    date: "2026-09-10",
    receivedTime: "9:00 AM",
    preview: "Thanks for listening! Your monthly Premium Individual subscription of $10.99 has been paid.",
    rawBody: `Spotify USA Inc.
Receipt #: 841920-SPOTIFY-2026
Plan: Premium Individual
Date: September 10, 2026

Subscription:                      $10.99
Taxes:                              $0.00
-----------------------------------------
Total:                             $10.99
Card: Master Card ending in 4912
Next renewal: October 10, 2026`,
    expectedMerchant: "Spotify",
    expectedAmount: 10.99,
    expectedCategory: "Subscriptions",
    status: "unread",
  },
  {
    id: "msg_cvs_2026",
    sender: "rx-receipts@cvs.com",
    senderName: "CVS Pharmacy",
    subject: "CVS Pharmacy Digital Receipt - Rx & Health items",
    date: "2026-09-08",
    receivedTime: "6:15 PM",
    preview: "Your purchase receipt at CVS Pharmacy #1829. Prescription co-pay and health vitamins: $23.15.",
    rawBody: `CVS PHARMACY STORE #1829
Rx Pick Up & Over-the-counter
Register 02  Trans 7491  Date 09/08/2026

1x Prescription Co-pay (Rx #4921) $10.00
1x Nature Made Multi-Vitamin       $8.99
1x Band-Aid Tough Strips           $4.16
-----------------------------------------
Subtotal                          $23.15
Tax                                $0.00 (Exempt items)
Total                             $23.15
Paid by: Apple Pay (Visa ...4912)`,
    expectedMerchant: "CVS Pharmacy",
    expectedAmount: 23.15,
    expectedCategory: "Healthcare",
    status: "unread",
  },
  {
    id: "msg_coursera_2026",
    sender: "billing@coursera.org",
    senderName: "Coursera",
    subject: "Coursera Plus Monthly Membership Receipt - $49.00",
    date: "2026-09-05",
    receivedTime: "1:00 PM",
    preview: "Your Coursera Plus subscription renewed successfully for $49.00.",
    rawBody: `Coursera Inc.
Billing Statement #CR-9120491
Date: September 5, 2026

Subscription: Coursera Plus Monthly
Access: Full catalog of Professional Certificates and Courses
Amount:                            $49.00
Tax:                                $0.00
-----------------------------------------
Total Billed:                      $49.00
Payment Method: Visa ending in 4912`,
    expectedMerchant: "Coursera",
    expectedAmount: 49.00,
    expectedCategory: "Education",
    status: "unread",
  },
];

// Initial pre-loaded approved and synced transactions to make dashboard look populated right away,
// while letting user run the demo scanner on remaining items or reset at will!
export const INITIAL_SYNCED_EXPENSES: ExpenseTransaction[] = [
  {
    id: "exp_1",
    merchant: "Walmart Supercenter",
    amount: 74.32,
    currency: "USD",
    date: "2026-09-16",
    category: "Groceries",
    description: "Produce, Pantry & Household items",
    confidence: 0.95,
    gmailMessageId: "msg_walmart_2026",
    orderId: "TR# 09412",
    senderEmail: "help@walmart.com",
    isSubscription: false,
    status: "synced_to_sheets",
    syncedAt: "2026-09-16T17:35:00Z",
  },
  {
    id: "exp_2",
    merchant: "Con Edison",
    amount: 86.50,
    currency: "USD",
    date: "2026-09-14",
    category: "Bills & Utilities",
    description: "Electric & Gas Monthly Bill",
    confidence: 0.94,
    gmailMessageId: "msg_coned_2026",
    orderId: "CN-4910283",
    senderEmail: "customerservice@coned.com",
    isSubscription: false,
    status: "synced_to_sheets",
    syncedAt: "2026-09-14T11:10:00Z",
  },
  {
    id: "exp_3",
    merchant: "Delta Air Lines",
    amount: 312.00,
    currency: "USD",
    date: "2026-09-12",
    category: "Travel",
    description: "Flight Confirmation JFK to SFO",
    confidence: 0.97,
    gmailMessageId: "msg_delta_2026",
    orderId: "006-281940182",
    senderEmail: "ticketreceipt@delta.com",
    isSubscription: false,
    status: "synced_to_sheets",
    syncedAt: "2026-09-12T15:45:00Z",
  },
  {
    id: "exp_4",
    merchant: "CVS Pharmacy",
    amount: 23.15,
    currency: "USD",
    date: "2026-09-08",
    category: "Healthcare",
    description: "Prescription & Wellness items",
    confidence: 0.92,
    gmailMessageId: "msg_cvs_2026",
    orderId: "Trans 7491",
    senderEmail: "rx-receipts@cvs.com",
    isSubscription: false,
    status: "synced_to_sheets",
    syncedAt: "2026-09-08T18:20:00Z",
  },
  {
    id: "exp_5",
    merchant: "Coursera",
    amount: 49.00,
    currency: "USD",
    date: "2026-09-05",
    category: "Education",
    description: "Data Science Specialization monthly membership",
    confidence: 0.95,
    gmailMessageId: "msg_coursera_2026",
    orderId: "CR-9120491",
    senderEmail: "billing@coursera.org",
    isSubscription: true,
    status: "synced_to_sheets",
    syncedAt: "2026-09-05T13:05:00Z",
  },
];
