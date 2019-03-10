<?php
//load dependencies
require __DIR__ . '/vendor/autoload.php';

//load environment variables
$dotenv = Dotenv\Dotenv::create(__DIR__);
if (file_exists(__DIR__ . '.env')) {
    $dotenv->load();
}

$con = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PWD'], $_ENV['DB_NAME'], $_ENV['DB_PORT']);

if ($con->connect_error) {
    echo ($con->connect_error);
}

// return string wrap in single quotes if value exists or NULL as string
function wrapInSingleQuotes($val)
{
    //escape ' for sql
    $val = str_replace("'", "''", $val);
    return $val ? "'" . $val . "'" : "NULL";
}

$sinceID = 0;

while (true) {
    $ch = curl_init('https://my-store00000.myshopify.com/admin/customers.json?limit=250&since_id=' . $sinceID);
    curl_setopt($ch, CURLOPT_USERPWD, $_ENV['SHOPIFY_USER'] . ':' . $_ENV['SHOPIFY_PWD']);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('content-type', 'application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $raw_result = curl_exec($ch);

    $res = json_decode($raw_result);

    $customers = $res->customers;
    $customerCount = count($customers);

    foreach ($customers as $customer) {
        $customerQuery = "INSERT INTO CUSTOMERS values(" . wrapInSingleQuotes($customer->id) .
        "," . wrapInSingleQuotes($customer->first_name) .
        "," . wrapInSingleQuotes($customer->last_name) .
        "," . wrapInSingleQuotes($customer->phone) .
        "," . wrapInSingleQuotes($customer->email) .
            ",NULL)";
        if (!$con->query($customerQuery)) {
            echo ("Error: " . $customerQuery . $con->error);
        }
        $address = $customer->default_address;
        $addressQuery = "INSERT INTO ADDRESSES values("
        . wrapInSingleQuotes($address->id) .
        "," . wrapInSingleQuotes($address->address1) .
        "," . wrapInSingleQuotes($address->city) .
        "," . wrapInSingleQuotes($address->country) .
        "," . wrapInSingleQuotes($address->country_code) .
        "," . wrapInSingleQuotes($address->zip) .
        "," . wrapInSingleQuotes($address->customer_id) .
        "," . wrapInSingleQuotes($address->province) . ")";
        if (!$con->query($addressQuery)) {
            echo ("Error: " . $addressQuery . $con->error);
        }
    }
    $sinceID = $customers[$customerCount - 1]->id;
    if ($customerCount < 250) {
        break;
    }
}

echo ("Records saved successfully!");
