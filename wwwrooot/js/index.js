import * as fs from 'fs';

export fucntion db() {
    mountAndInitializeDb();
}

export function mountAndInitializeDb() {
    fs.mkdir('/database');
    fs.mount(IDBFS, {}, '/database');
    return AllMyLinks.syncDatabase(true);
};

export function syncDatabase(populate) {

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

exports.db = db;