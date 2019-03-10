<?php
header('content-type: application/json');
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // return string wrap in single quotes if value exists or NULL as string
    function wrapInSingleQuotes($val)
    {
        //escape ' for sql
        $val = str_replace("'", "''", $val);
        return $val ? "'" . $val . "'" : "NULL";
    }

    $rootDir = dirname(dirname(dirname(__DIR__)));
    include $rootDir . '/vendor/autoload.php';

    //load environment variables
    $dotenv = Dotenv\Dotenv::create($rootDir);
    if (file_exists($rootDir . '/.env')) {
        $dotenv->load();
    }

    $con = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PWD'], $_ENV['DB_NAME'], $_ENV['DB_PORT']);

    if ($con->connect_error) {
        http_response_code(500);
        echo ($con->connect_error);
    }

    $data = json_decode(file_get_contents('php://input'));

    if (!$data->messageType || !($data == 'custom' || $data == 'promo' || $data == 'delivered' || $data == 'shipped')) {
        http_response_code(400);
        echo (json_encode(array('error' => 'Invalid messageType, should be one of promo|delivered|shipped|custom')));
    } else if (!$data->customerID) {
        http_response_code(400);
        echo (json_encode(array('error' => 'Invalid customerID, Please pass the customerID')));
    } else {
        if ($data->messageType == 'promo') {
            $message = 'Hi, use coupon OFF30 to get flat 30% off on all our range.';
        } else if ($data->messageType == 'delivered') {
            $message = 'Hi, your order with order no 123 was successfully delivered';
        } else if ($data->messageType == 'shipped') {
            $message = 'Hi, your order with order no 123 was successfully shipped';
        } else {
            $message = $data->message;
            if (!$message) {
                echo (json_encode(array('error' => 'Invalid message, need to pass message parameter with custom messageType')));
            }
        }
    }

    $dbQuery = "UPDATE CUSTOMERS SET sent_message=" . wrapInSingleQuotes($data->message) . "WHERE id=" . wrapInSingleQuotes($data->customerID);
    $res = $con->query($customersQuery);
    if (!res) {
        http_response_code(500);
        echo (json_encode(array('error' => 'Internal Server Error')));
    } else {
        echo (json_encode(array('message' => 'SMS sent successfully')));
    }
}
