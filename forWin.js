const { exec} = require('child_process');
//const { Buffer } = require('buffer');
const fs = require('fs')

function fetchInstalled() {
  return new Promise((resolve, reject) => {
    //直接输出到stdout有中文乱码问题没解决，先输出到文件再从文件读取  
    //exec('chcp 65001;Get-ItemProperty HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName,DisplayVersion,Publisher,InstallDate | ConvertTo-Json ', {'shell':'powershell.exe','encoding':'utf8'}, (error, stdout, stderr)=> {
    //exec('Get-ItemProperty HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName,DisplayVersion,Publisher,InstallDate | ConvertTo-Json ', {'shell':'powershell.exe','encoding':'utf8'}, (error, stdout, stderr)=> {
    exec('Get-ItemProperty HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName,DisplayVersion,Publisher,InstallDate | ConvertTo-Json |Out-File -Encoding utf8 -FilePath ./outputFromJs', { 'shell': 'powershell.exe', 'encoding': 'utf8' }, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return error;
      }
      if (fileExists('./outputFromJs')) {
        fs.readFile('./outputFromJs', { encoding: 'utf8' }, (err, data) => {
          try {
            if (err) throw err;
            const installInfo = JSON.parse(data.trim());
            //console.dir(installInfo);
            resolve(installInfo);
          } catch (err) {
            console.log('Read file error!' + err);
            throw err;
          }
        })
      } else {
        console.log('No outputFile !');
        reject("No output file!")
      }
    });
    //console.log(`stdout: ${stdout}`);
    // console.error(`stderr: ${stderr}`);
    // const buff = Buffer.from(stdout,'latin1');
    // const installed = buff.toString('utf8');
    //const installed = stdout;
    // return installed;
  });
}

function fileExists(filePathName) {
  var exists = true;
  try {
    fs.accessSync(filePathName, fs.constants.R_OK);
  } catch (err) {
    exists = false;
  }
  return exists;
}

module.exports = { fetchInstalled }

