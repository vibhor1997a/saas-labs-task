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
    return `<tr id="${customer.id}">
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
    <td>
    ${customer.address.streetAddress || ''} ${customer.address.city || ''} ${(customer.address.postalCode || '')} ${customer.address.country || ''}
    </td>
    </tr>`;
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
            cb(undefined, data);
        }
    });
}