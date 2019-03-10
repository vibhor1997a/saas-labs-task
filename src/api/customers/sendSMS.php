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
        die();
    }

    $data = json_decode(file_get_contents('php://input'));

    if (!$data->messageType || !($data->messageType == 'custom' || $data->messageType == 'promo' || $data->messageType == 'delivered' || $data->messageType == 'shipped')) {
        http_response_code(400);
        echo (json_encode(array('error' => 'Invalid messageType, should be one of promo|delivered|shipped|custom')));
        die();
    } else if (!$data->customerID) {
        http_response_code(400);
        echo (json_encode(array('error' => 'Invalid customerID, Please pass the customerID')));
        die();
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
                http_response_code(400);
                echo (json_encode(array('error' => 'Invalid message, need to pass message parameter with custom messageType')));
                die();
            }
        }
        $dbQuery = "UPDATE CUSTOMERS SET sent_message=" . wrapInSingleQuotes($message) . " WHERE id=" . wrapInSingleQuotes($data->customerID) . "AND phone IS NOT NULL";
        $res = $con->query($dbQuery);
        if (!res) {
            http_response_code(409);
            echo (json_encode(array('error' => 'Can\'t send SMS, already sent')));
            die();
        } else {
            echo (json_encode(array('message' => 'SMS sent successfully')));
            die();
        }
    }
}
