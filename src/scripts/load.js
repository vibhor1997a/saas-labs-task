$(document).ready(() => {

    let pageNo = 1;
    let pageSize = 10;

    let pageStart = getCurrentCustomerNo(pageNo, pageSize, 0);
    let pageEnd = getCurrentCustomerNo(pageNo, pageSize, pageSize - 1);

    getCustomers(10, 0, (err, data) => {
        if (err) {
            alert('Something went wrong!');
        }
        else {
            $('#total-rec').text(data.totalCustomersCount);
            $('#start-rec-no').text(pageStart);
            $('#end-rec-no').text(pageEnd);
            $('#page-loc').show();
            setDataIntoTable(data.customers, pageNo, pageSize);
        }
    });
});

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
function getCustomers(limit, offset, cb) {
    $.ajax('/api/customers', {
        data: {
            limit: limit,
            offset: offset
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