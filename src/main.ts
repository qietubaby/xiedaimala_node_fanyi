import * as https from 'https';
import * as querystring from 'querystring';
import {appId, appSecret} from './private';
import md5 from 'md5';

type ErrorMap = {
    [key:string] : string | undefined
}
const errorMap: ErrorMap = {
    52003: '用户认证失败',
    52004: 'error2',
    52005: 'error3'
};

export const translate = (word:string) => {
    const salt = Math.random();
    const sign = md5(appId + word + salt + appSecret);
    let from, to;
    if (/[a-zA-Z]/.test(word[0])) {
        // 英译中
        from = 'en';
        to = 'zh';
    } else {
        from = 'zh';
        to = 'en';
    }
    const query: string = querystring.stringify({
        q: word,
        sign,
        from,
        to,
        appid: appId,
        salt
    });
    const options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: `/api/trans/vip/translate?` + query,
        method: 'GET'
    };

    const request = https.request(options, (response) => {
        // console.log('状态码:', res.statusCode);
        // console.log('请求头:', res.headers);
        let chunks:Buffer[] = [];
        response.on('data', (chunk:Buffer) => {
            // process.stdout.write(d);
            chunks.push(chunk);
        });
        response.on('end', () => {
            const string = Buffer.concat(chunks).toString();
            type BaiduResult = { // 声明类型
                error_code?: string;
                error_msg?: string;
                form: string;
                to: string;
                trans_result: { src: string; dst: string; }[] //表示trans_result是一个数组，数组的每一项是 { src: string; dst: string; }
            }
            const object: BaiduResult = JSON.parse(string);
            if (object.error_code) {
                console.error(errorMap[object.error_code] || object.error_msg);
                process.exit(2);
            } else {
                object.trans_result.map(obj => {
                    console.log(obj.dst);
                });
                process.exit(2);
            }

        });
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();

};


