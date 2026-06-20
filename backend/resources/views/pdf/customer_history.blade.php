<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Customer Buying Report</title>
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
        <h2>Customer Buying Report</h2>
        <p><strong>Customer:</strong> {{ $customer->name }}</p>
        <p><strong>Generated on:</strong> {{ $date }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Crop Name</th>
                <th>Farmer Name</th>
                <th>Location</th>
                <th>Mobile</th>
                <th>Date</th>
                <th>Quantity (kg)</th>
                <th>Rate (₹)</th>
                <th>Amount (₹)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($history as $item)
                <tr>
                    <td>{{ ucfirst($item['crop_name']) }}</td>
                    <td>{{ $item['farmer_name'] }}</td>
                    <td>{{ $item['location'] }}</td>
                    <td>{{ $item['farmer_mobile'] }}</td>
                    <td>{{ \Carbon\Carbon::parse($item['date'])->format('Y-m-d') }}</td>
                    <td>{{ number_format($item['buy_quantity'], 2) }}</td>
                    <td>{{ number_format($item['buying_price'], 2) }}</td>
                    <td>{{ number_format($item['amount'], 2) }}</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="7" style="text-align: right;">Total Purchase Amount:</td>
                <td>₹ {{ number_format($total_buying_amount, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        Generated securely by Smart Agricultural Portal
    </div>
</body>

</html>