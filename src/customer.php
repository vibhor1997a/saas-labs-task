<?php

class CustomerAddress
{
    public $id, $streetAddress, $city, $province, $postalCode, $country, $countryCode;
    public function __construct($id, $streetAddress, $city, $province, $postalCode, $country, $countryCode)
    {
        $this->id = $id;
        $this->streetAddress = $streetAddress;
        $this->city = $city;
        $this->province = $province;
        $this->postalCode = $postalCode;
        $this->country = $country;
        $this->countryCode = $countryCode;
    }
}

class Customer
{

    public $id, $firstName, $lastName, $phone, $email, $isSMSSent, $address;

    public function __construct($id, $firstName, $lastName, $phone, $email, $isSMSSent, $address)
    {
        $this->id = $id;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->phone = $phone;
        $this->email = $email;
        $this->isSMSSent = $isSMSSent == '1' ? true : false;
        $this->address = $address;
    }

    //
    public function sendSMS()
    {
        printf("hello");
    }
}
