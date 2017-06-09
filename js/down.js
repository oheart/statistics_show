function downImg() {
    download("http://image.cqcb.com/d/file/p/2017-01-13/b05bdbf9b725cd3e33a35d8d0ad2b035.jpg", saveStream, "D:\\zydwa.jpg");
}

download("http://www.google.cn", saveText);

function download(url, callback, saveto) {
    var xmlhttp;

    var Versions = ['Microsoft.XMLHTTP',
        'Microsoft.XMLHTTP.1.0',
        'Msxml2.ServerXMLHTTP',
        'Msxml2.ServerXMLHTTP.3.0',
        'Msxml2.ServerXMLHTTP.4.0',
        'Msxml2.ServerXMLHTTP.5.0',
        'Msxml2.ServerXMLHTTP.6.0',
        'Msxml2.XMLHTTP',
        'Msxml2.XMLHTTP.3.0',
        'Msxml2.XMLHTTP.4.0',
        'Msxml2.XMLHTTP.5.0',
        'Msxml2.XMLHTTP.6.0'];

    try {
        if (window.ActiveXObject) {
            for (var i = 0; i < Versions.length; i++) {
                try {
                    xmlhttp = new ActiveXObject(Versions[i]);
                    break;
                } catch (e) {
                }
            }
        }
        else if (document.implementation && document.implementation.createDocument) {
            try {
                xmlhttp = document.implementation.createDocument('', '', null);
            } catch (e) {
                xmlhttp = new window.XMLHttpRequest();
            }
        }
        else {
            alert("load data error");
        }
    }
    catch (e) {
        alert(e.message);
    }


    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var Contents = xmlhttp.responseBody;
                callback(xmlhttp, saveto);
            }
        }
    }
    xmlhttp.open("GET", url, false);
    //xmlhttp.send();
    xmlhttp.send(xmlhttp);
}

//下载文件的函数
function saveStream(xmlhttp, path) {
    var stream = xmlhttp.responseBody;
    var ados = new ActiveXObject("ADODB.Stream");
    ados.Mode = 3;
    ados.Type = 1;
    ados.Open();
    ados.Write(stream);
    ados.SaveToFile(path, 2);
}

//下载网页代码的函数
function saveText(xmlhttp) {
    var text = xmlhttp.responseText;
    WScript.Echo(text);
}

