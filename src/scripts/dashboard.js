$(document).ready(() => {

    let pageNo = 1;
    let pageSize = Number($('#no-of-rows').val());

    let pageStart = getCurrentCustomerNo(pageNo, pageSize, 0);
    let pageEnd = getCurrentCustomerNo(pageNo, pageSize, pageSize - 1);

    let phoneExists = $('#mobile-filter-chkb').is(':checked');

    //
    $('#mobile-filter').on('click', e => {
        const checkBox = $('#mobile-filter-chkb');
        if (!$(e.target).is(':checkbox')) {
            checkBox.click();
        }
        pageNo = 1;
        pageSize = Number($('#no-of-rows').val());
        pageStart = getCurrentCustomerNo(pageNo, pageSize, 0);
        pageEnd = getCurrentCustomerNo(pageNo, pageSize, pageSize - 1);
        phoneExists = checkBox.is(":checked");
        handleCustomers({
            phoneExists,
            pageStart,
            pageEnd,
            pageNo,
            pageSize
        }, (err, data) => {
            if (err) {
                alert('Something went wrong!');
            }
        });
    });

    //
    $('#no-of-rows').on('change', function () {
        pageNo = 1;
        pageSize = Number($(this).val());
        pageStart = getCurrentCustomerNo(pageNo, pageSize, 0);
        pageEnd = getCurrentCustomerNo(pageNo, pageSize, pageSize - 1);
        handleCustomers({
            phoneExists,
            pageStart,
            pageEnd,
            pageNo,
            pageSize
        }, (err, data) => {
            if (err) {
                alert('Something went wrong!');
            }
        });
    });

    //handling while first load
    handleCustomers({
        phoneExists,
        pageStart,
        pageEnd,
        pageNo,
        pageSize
    }, (err, data) => {
        if (err) {
            alert('Something went wrong!');
        }
    });

    $('#pg-first').click(function () {
        pageNo = 1;
        pageStart = getCurrentCustomerNo(pageNo, pageSize, 0);
        pageEnd = getCurrentCustomerNo(pageNo, pageSize, pageSize - 1);
        handleCustomers({
            phoneExists,
            pageStart,
            pageEnd,
            pageNo,
            pageSize
        }, (err, data) => {
            if (err) {
                alert('Something went wrong!');
            }
            else {
                $('#pg-last, #pg-next').each(function () {
                    $(this).removeClass('disabled');
                });
                $('#pg-first, #pg-prev').each(function () {
                    $(this).addClass('disabled');
                });
            }
        });
    });
    $('#pg-prev').click(function () {
        pageNo -= 1;
        pageStart = getCurrentCustomerNo(pageNo, pageSize, 0);
        pageEnd = getCurrentCustomerNo(pageNo, pageSize, pageSize - 1);
        handleCustomers({
            phoneExists,
            pageStart,
            pageEnd,
            pageNo,
            pageSize
        }, (err, data) => {
            if (err) {
                alert('Something went wrong!');
            }
            else {
                $('#pg-last, #pg-next').each(function () {
                    $(this).removeClass('disabled');
                });
            }
        });
    });

    $('#pg-next').click(function () {
        pageNo += 1;
        pageStart = getCurrentCustomerNo(pageNo, pageSize, 0);
        pageEnd = getCurrentCustomerNo(pageNo, pageSize, pageSize - 1);
        handleCustomers({
            phoneExists,
            pageStart,
            pageEnd,
            pageNo,
            pageSize
        }, (err, data) => {
            if (err) {
                alert('Something went wrong!');
            }
            else {
                $('#pg-prev, #pg-first').each(function () {
                    $(this).removeClass('disabled');
                });
            }
        });
    });

    $('#pg-last').click(function () {
        // last page
        pageNo = Math.ceil(Number($('#total-rec').text()) / pageSize);
        pageStart = getCurrentCustomerNo(pageNo, pageSize, 0);
        pageEnd = getCurrentCustomerNo(pageNo, pageSize, pageSize - 1);
        handleCustomers({
            phoneExists,
            pageStart,
            pageEnd,
            pageNo,
            pageSize
        }, (err, data) => {
            if (err) {
                alert('Something went wrong!');
            }
            else {
                $('#pg-last, #pg-next').each(function () {
                    $(this).addClass('disabled');
                });
                $('#pg-first, #pg-prev').each(function () {
                    $(this).removeClass('disabled');
                });
            }
        });
    });
});

