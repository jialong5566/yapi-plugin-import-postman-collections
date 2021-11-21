import { message } from 'antd';

function postmanCollections(importDataModule) {
  function run(res) {
    try {
      return yieldYapiJson(JSON.parse(res));
    } catch (e) {
      console.log(e);
      message.error('文件格式解析失败');
    }
    return null;
  }

  if (!importDataModule || typeof importDataModule !== 'object') {
    console.error('obj参数必需是一个对象');
    return null;
  }
  importDataModule.postmanCollections = {
    name: 'PostmanCollections',
    run: run,
    desc: '注意：集合中相同的接口只能导入一个'
  };
}

function yieldYapiJson(postmanJson) {
  const time = Math.ceil(new Date().valueOf()/1000);
  const yapiJsonObj = {
    apis: [],
    basePath: "/",
    cats: []
  }
  const { info, item} = postmanJson;
  const name = info.name;
  const yapiJsonItem = {
    "index": 0,
    name,
    "desc": name,
    "add_time": time,
    "up_time": time
  };
  yapiJsonObj.cats.push(yapiJsonItem);
  item.forEach(ele => {
    const path = '/' + ele.request.url.path.join('/');
    const method = ele.request.method;

    const headers = Array.isArray(ele.request.header) ? ele.request.header : [];
    const req_headers = headers.map(h => ({
      "required": "1",
      "name": h.key,
      "value": h.value,
      "desc": h.description
    }));
    const req_body_other = ele.request.body && ele.request.body.raw || "";
    const res_body = Array.isArray(ele.response) ? (ele.response[0] && ele.response[0].body) :"";
    const query = Array.isArray(ele.request.url.query) ? ele.request.url.query : [];
    const req_query = query.map(queryItem => ({
      "required": "1",
      "name": queryItem.key,
      "example": queryItem.value,
      "desc": queryItem.description
    }));
    const listItem = {
      catname: name,
      "query_path": {
        path,
        "params": []
      },
      "edit_uid": 0,
      "status": "undone",
      "type": "static",
      "req_body_is_json_schema": false,
      "res_body_is_json_schema": false,
      "api_opened": false,
      "index": 0,
      "tag": [],
      method,
      "title": path,
      path,
      "req_params": [],
      "req_body_form": [],
      req_headers,
      req_query,
      "req_body_type": "raw",
      "res_body_type": "json",
      res_body,
      "add_time": time,
      "up_time": time,
      "__v": 0,
      "desc": "",
      "markdown": "",
      req_body_other
    };
    yapiJsonObj.apis.push(listItem);
  });
  return yapiJsonObj;
}


module.exports = function() {
  this.bindHook('import_data', postmanCollections);
};
