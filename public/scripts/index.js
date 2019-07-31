/**
 * Sends an ajax query containing the current data on the webpage
 * @param url the URL of the page the request is sent from
 * @param data the data being sent from the webpage
 */
function sendAjaxQuery(url, data) {
    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (result) {
            console.log(result);
            // reoads the current page on completioo of the Ajax query
            window.location.reload();
        },
        error: function (xhr, status, error) {
            window.location.reload();
        }
    });
}

/**
 * handles the instance a form on a webpage is submitted
 * @param url the URL of the page the request is sent from
 */
function onSubmit(url) {
    var formArray = $("form").serializeArray();
    var data = {};
    for (index in formArray) {
        data[formArray[index].name] = formArray[index].value;
    }
    sendAjaxQuery(url, data);
    event.preventDefault();
}
