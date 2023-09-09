import packageJson from '@/../package.json';
const {version} = packageJson;
import axios from "axios";

async function fetchVersion(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(url);
            const version = response.data.tag_name
            resolve(version);
        } catch (err) {
            reject(err);
        }
    })
}

export function getLatestVersion() {
    const api = {
        github: 'https://api.github.com/repos/jiang-taibai/markdown-renumber/releases/latest',
        gitee: 'https://gitee.com/api/v5/repos/jiang-taibai/markdown-renumber/releases/latest'
    }
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'production') {
            fetchVersion(api.github).then(version => {
                resolve(version);
            }).catch(err => {
                fetchVersion(api.gitee).then(version => {
                    resolve(version);
                }).catch(err => {
                    reject(err);
                })
            })
        } else {
            resolve('v1.0.2');
        }
    })
}

export function getLocalVersion() {
    return 'v' + version;
}
