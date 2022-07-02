// // Module Manager for registering the modules of the chart
// import { ModuleManager } from 'igniteui-webcomponents-core';
// // Bullet Graph Module
// import { IgcRadialGaugeCoreModule } from 'igniteui-webcomponents-gauges';
// import { IgcRadialGaugeModule } from 'igniteui-webcomponents-gauges';

// // register the modules
// ModuleManager.register(
//     IgcRadialGaugeCoreModule,
//     IgcRadialGaugeModule,
//     FS
// );

'use strict';

var fs = require('fs');
var cp = require('child_process');
var path = require('path');

if (process.argv.length != 3) {
    console.log("Usage: %s <package name>[@version]", process.argv[1]);
    console.log("\nExamples:");
    console.log("\tnode pack.js react");
    console.log("\tnode pack.js angular@1.5.5");
    console.log("\tnode pack.js @angular/core@2.0.1");
    process.exit(0);
}

var fullPackageStr = process.argv[2]; // might include @version suffix
// extracts package or @scope/package name, removing the possible @version suffix
var packageName = fullPackageStr.match(/^(@?[\w\/]+)(@.*)?$/)[1];

// Copy dependencies to bundleDependencies
function rewritePackageJSON(fileName) {
    var contents = fs.readFileSync(fileName);
    var json = JSON.parse(contents);
    if (json.dependencies) {
        json.bundleDependencies = Object.keys(json.dependencies);
        fs.writeFileSync(fileName, JSON.stringify(json, null, 2));
    }
}

// Install the package from the online registry
var installProcess = cp.exec('npm install ' + fullPackageStr, function (err, stdout) {
    if (err) {
        console.log("\n✘ Error executing npm install:", err);
        process.exit(0);
    }

    // console.log(stdout)

    // Set bundleDependencies for the package
    rewritePackageJSON(path.join('node_modules', packageName, 'package.json'));

    // Create a new .tgz file which bundles all dependencies
    var packProcess = cp.exec('npm pack ' + path.join('node_modules', packageName), function (err) {
        if (err) {
            console.log("\n✘ Error executing npm pack:", err);
        }
        else {
            console.log("\n✔ Bundled package", fullPackageStr);
        }
    });

    pipeToProcessOutputs(packProcess);
});

pipeToProcessOutputs(installProcess);

function pipeToProcessOutputs(aChildProcess) {
    aChildProcess.stderr.pipe(process.stderr);
    aChildProcess.stdout.pipe(process.stdout);
}