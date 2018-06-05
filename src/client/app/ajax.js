function createXHR() {
    //typescript seems to dislike IE compatibility
    return new XMLHttpRequest();
}
function AjaxRequest(url,
                     data,
                     successCallback,
                     failCallback,
                     headers) {
    if (typeof failCallback !== "function") {
        throw TypeError("Fail callback must be function, is "+failCallback);
    }
    let xhr = createXHR();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 0){ //cross-origin request blocked
                AjaxRequest(
                    'https://cors-anywhere.herokuapp.com/'+url,
                    data,
                    successCallback,
                    failCallback
                )
            }
            else if (xhr.status === 200) {
                successCallback(xhr);
            }
            else {
                failCallback(xhr);
            }
        }
    };
    xhr.open(data === undefined ? "GET" : "POST", url, true);
    if (headers !== undefined){
        for (let key in headers){
            xhr.setRequestHeader(key, headers[key]);
        }
    }
    xhr.send(data === undefined ? data : JSON.stringify(data));
}

export function JsonRequest(url,
                     data,
                     successCallback,
                     failCallback) {
    AjaxRequest(url, data,
        function (xhr) {
            successCallback(JSON.parse(xhr.responseText))
        },
        failCallback);
}