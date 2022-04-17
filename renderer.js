const { ipcRenderer } = require('electron');
const dialog = require('electron').dialog;

const installed = document.getElementById("installedDiv");
installed.innerHTML = '<p>This is a electron demo! </p>';

// 渲染进程主进程通信
const ret = ipcRenderer.sendSync('getInstalledInfo');
if (ret.code == 0) {
    //installed.innerHTML = '<p>'+JSON.stringify(ret.data)+'</p>';
    for (let appInfo of ret.data) {
        if (appInfo.DisplayName != null) {
            let div = document.createElement('div');
            div.innerHTML = 'DisplayName:' + appInfo.DisplayName + ' '
                + 'DisplayVersion:' + appInfo.DisplayVersion + ' '
                + 'Publisher:' + appInfo.Publisher + ' '
                + 'InstallDate:' + appInfo.InstallDate;
            installed.appendChild(div);
        }
    }
} else {
    alert(ret.message);
}
