const fs = require('fs');

function mountAndInitializeDb() {
    fs.mkdir('/database');
    fs.mount(IDBFS, {}, '/database');
    return AllMyLinks.syncDatabase(true);
};

function syncDatabase(populate) {

    return new Promise((resolve, reject) => {
        fs.syncfs(populate, (err) => {
            if (err) {
                console.log('syncfs failed. Error:', err);
                reject(err);
            }
            else {
                console.log('synced successfull.');
                resolve();
            }
        });
    });
}
