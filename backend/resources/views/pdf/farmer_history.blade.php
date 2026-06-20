<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Farmer Sales Report</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h1 {
            margin: 0;
            padding: 0;
            color: #166534;
        }

        .header p {
            margin: 5px 0;
            color: #4b5563;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        table th,
        table td {
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: left;
        }

        table th {
            background-color: #f3f4f6;
            color: #1f2937;
        }

        .total-row {
            font-weight: bold;
            background-color: #ecfdf5;
        }

        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 10px;
            color: #9ca3af;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Smart Agricultural Portal</h1>
        <h2>Farmer Sales Report</h2>
        <p><strong>Farmer:</strong> {{ $farmer->name }}</p>
        <p><strong>Generated on:</strong> {{ $date }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Crop Name</th>
                <th>Total Quantity (kg)</th>
                <th>Sold (kg)</th>
                <th>Listing Price (₹)</th>
                <th>Selling Price (₹)</th>
                <th>Status</th>
                <th>Date</th>
                <th>Total Earnings (₹)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($crops as $crop)
                <tr>
                    <td>{{ ucfirst($crop->crop_name) }}</td>
                    <td>{{ number_format($crop->quantity, 2) }}</td>
                    <td>{{ number_format($crop->sold_quantity, 2) }}</td>
                    <td>{{ number_format($crop->listing_price, 2) }}</td>
                    <td>{{ number_format($crop->selling_price, 2) }}</td>
                    <td>{{ ucfirst(str_replace('_', ' ', $crop->status)) }}</td>
                    <td>{{ $crop->created_at->format('Y-m-d') }}</td>
                    <td>{{ number_format($crop->total_amount, 2) }}</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="7" style="text-align: right;">Grand Total Earnings:</td>
                <td>₹ {{ number_format($totalEarnings, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        Generated securely by Smart Agricultural Portal
    </div>
</body>

</html>