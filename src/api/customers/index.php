<?php
header('content-type: application/json');
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    //load dependencies

    include dirname(dirname(__DIR__)) . '/customer.php';
    $rootDir = dirname(dirname(dirname(__DIR__)));
    include $rootDir . '/vendor/autoload.php';

    //load environment variables
    $dotenv = Dotenv\Dotenv::create($rootDir);
    if (file_exists($rootDir . '.env')) {
        $dotenv->load();
    }

    $con = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PWD'], $_ENV['DB_NAME'], $_ENV['DB_PORT']);

    if ($con->connect_error) {
        echo ($con->connect_error);
        http_response_code(500);
    }

    $url = $actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    $parts = parse_url($url);
    parse_str($parts['query'], $query);

    $limit = is_numeric($query['limit']) ? $query['limit'] : 100;
    $offset = is_numeric($query['offset']) ? $query['offset'] : 0;

    // get by id
    $condition = is_numeric($query['id']) ? " and CUSTOMERS.id='" . $query['id'] . "'" : "";

    $customersQuery = "SELECT *
    , CASE WHEN CUSTOMERS.sent_message IS NULL THEN 0 ELSE 1 END AS is_sms_sent FROM CUSTOMERS,ADDRESSES
    WHERE CUSTOMERS.id=ADDRESSES.customer_id" . $condition . " LIMIT " . $offset . "," . $limit;
    $res = $con->query($customersQuery);

    $custArr = array();

    while ($row = $res->fetch_assoc()) {
        $address = new CustomerAddress($row['id'], $row['street_address'], $row['city'], $row['province'], $row['zip'], $row['country'], $row['country_code']);
        $cust = new Customer($row['customer_id'], $row['first_name'], $row['last_name'], $row['phone'], $row['email'], $row['is_sms_sent'], $address);
        array_push($custArr, $cust);
    }

    $customersCountQuery = "SELECT COUNT(*) as count FROM CUSTOMERS";
    $res = $con->query($customersCountQuery);

    while ($row = $res->fetch_assoc()) {
        $totalCustomersCount = intval($row['count']);
    }

    $resp = array();
    $resp['customers'] = $custArr;
    $resp['customerCount'] = count($custArr);
    $resp['totalCustomersCount'] = $totalCustomersCount;
    echo (json_encode($resp));
}
