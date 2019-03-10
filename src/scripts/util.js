// get the # of current customer
function getCurrentCustomerNo(pageNo, pageSize, index) {
    return (pageNo - 1) * pageSize + Number(index) + 1;
}

//set the cust data into table
function setDataIntoTable(customers, pageNo, pageSize) {
    let html = '';
    for (let [i, customer] of customers.entries()) {
        html += getTableRow(customer, getCurrentCustomerNo(pageNo, pageSize, i));
    }
    $('#cust-data>tbody').html(html);
}

// get cust data from the api acc to limit and offset
function getCustomers(options, cb) {
    let { limit, offset, phoneExists } = options;
    limit = limit || 10;
    offset = offset || 0;
    $.ajax('/api/customers/', {
        data: {
            limit,
            offset,
            phoneExists
        },
        method: 'GET',
        success: (data) => {
            cb(undefined, data);
        },
        error: err => {
            cb(err);
        }
    });
}

function getTableRow(customer, count) {
    return `<tr>
    <td>
    ${count}
    </td>
    <td>
    ${customer.firstName || ''} ${customer.lastName || ''}
    </td>
    <td>
    ${customer.email || 'unknown'}
    </td>
    <td>
    ${customer.phone || 'unknown'}
    </td>
    <td class="dropdown" id="${customer.id}">
    ${smsCheck(customer)}
    </td>
    <td>
    ${customer.address.streetAddress || ''} ${customer.address.city || ''} ${(customer.address.postalCode || '')} ${customer.address.country || ''}
    </td>
    </tr>`;
}

function smsCheck(customer) {
    return !customer.phone ? '<span class="text-danger">Phone not registered</span>' : customer.isSMSSent ? `<span class="text-success">SMS sent</span>` : `
    <button class="btn btn-primary send-sms" data-toggle="dropdown">Send SMS</button>
        <div class="dropdown-menu">
            <button class="dropdown-item sms-shipped" type="button">Order Shipped</button>
            <button class="dropdown-item sms-delivered" type="button">Order Delivered</button>
            <button class="dropdown-item sms-promo" type="button">Promotion</button>
            <button class="dropdown-item sms-custom" type="button">Custom Message</button>
    </div >`;
}

/**
 * Get the cust from api and set the in table
 * @param {*} options 
 * @param {*} cb 
 */
function handleCustomers(options, cb) {
    getCustomers({
        limit: options.pageSize,
        offset: options.pageStart - 1,
        phoneExists: options.phoneExists
    }, (err, data) => {
        if (err) {
            cb(err);
        }
        else {
            $('#total-rec').text(data.totalCustomersCount);
            $('#start-rec-no').text(options.pageStart);
            $('#end-rec-no').text(options.pageEnd);
            $('#page-loc').show();
            setDataIntoTable(data.customers, options.pageNo, options.pageSize);
            $('')
            $('.send-sms').on('click', function () {
                const customerID = $(this).parent().attr('id');
                $(`#${customerID}>div>.sms-shipped`).on('click', function () {
                    sendSMS({
                        messageType: 'shipped',
                        customerID
                    }, (err, data) => {
                        if (err) {
                            alert('Something went wrong!');
                        }
                    });
                });
                $(`#${customerID}>div>.sms-delivered`).on('click', function () {
                    sendSMS({
                        messageType: 'delivered',
                        customerID
                    }, (err, data) => {
                        if (err) {
                            alert('Something went wrong!');
                        }
                    });
                });
                $(`#${customerID}>div>.sms-promo`).on('click', function () {
                    sendSMS({
                        messageType: 'promo',
                        customerID
                    }, (err, data) => {
                        if (err) {
                            alert('Something went wrong!');
                        }
                    });
                });
                $(`#${customerID}>div>.sms-custom`).on('click', function () {
                    $('#custom-sms-modal').modal('toggle');
                    const message = $('#sms-custom-msg').val();
                    $('#sms-custom-msg').val('');
                    $('#send-cust-btn').on('click', () => {
                        sendSMS({
                            messageType: 'custom',
                            customerID,
                            message
                        }, (err, data) => {
                            if (err) {
                                alert('Something went wrong!');
                            }
                            else {
                                $('#custom-sms-modal').modal('toggle');
                            }
                        });
                    });
                });
            });
            cb(undefined, data);
        }
    });
}

function sendSMS(options, cb) {
    const { messageType, customerID, message } = options;
    if (!(messageType && customerID)) {
        cb(new TypeError('invalid options!'));
    }
    else {
        $.ajax('/api/customers/sendSMS', {
            data: JSON.stringify({
                messageType,
                customerID,
                message
            }),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            success: data => {
                $(`#${customerID}`).html(`<span class="text-success">SMS sent</span>`);
                cb(undefined, data);
            },
            error: err => {
                cb(err);
            }
        });
    }
}