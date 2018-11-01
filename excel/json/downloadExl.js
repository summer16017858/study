var jsono = [
  {
    //测试数据
    id: 1, //A
    name: '岳麓区', //B
    code: '43012210', //C
    school: '岳麓区一小', //D
    schoolCode: '4301210001' //E
  },
  {
    id: 2, //A
    name: '岳麓区', //B
    code: '43012220', //C
    school: '岳麓区二小', //D
    schoolCode: '4301210002' //E
  },
  {
    id: 3, //A
    name: '岳麓区', //B
    code: '43012230', //C
    school: '岳麓区三小', //D
    schoolCode: '4301210003' //E
  },
  {
    id: 4, //A
    name: '岳麓区', //B
    code: '43012240', //C
    school: '岳麓区四小', //D
    schoolCode: '4301210004' //E
  }
];

function exportsEXCL() {
  this.wopts = {
    bookType: 'xlsx',
    bookSST: true,
    type: 'binary',
    cellStyles: true
  };

  this.borderAll = {  //单元格外侧框线
    top: {
      style: 'thin'
    },
    bottom: {
      style: 'thin'
    },
    left: {
      style: 'thin'
    },
    right: {
      style: 'thin'
    }
  };

  this.downloadExl = ({ header = {}, data = [], title = '导出数据', type }) => {
    var json = this.filerHeader(header, data);
    var tmpdata = json[0];
    json.unshift({});
    var keyMap = []; //获取keys
    for (var k in tmpdata) {
      keyMap.push(k);
      json[0][k] = k;
    }
    var tmpdata = []; //用来保存转换好的json
    json
      .map((v, i) =>
        keyMap.map((k, j) =>
          Object.assign(
            {},
            {
              v: v[k],
              position:
                (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) +
                (i + 1)
            }
          )
        )
      )
      .reduce((prev, next) => prev.concat(next))
      .forEach(
        (v, i) =>
          (tmpdata[v.position] = {
            v: v.v
          })
      );
    var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
    this.setExlStyle(tmpdata);
    tmpdata['!merges'] = [
      {
        s: { c: 1, r: 0 },
        e: { c: 2, r: 0 }
      },
      {
        s: { c: 3, r: 0 },
        e: { c: 4, r: 0 }
      }
    ]; //<====合并单元格
    var tmpWB = {
      SheetNames: ['mySheet'], //保存的表标题
      Sheets: {
        mySheet: Object.assign(
          {},
          tmpdata, //内容
          {
            '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
          }
        )
      }
    };
    tmpDown = new Blob(
      [
        this.s2ab(
          XLSX.write(
            tmpWB,
            {
              bookType: type == undefined ? 'xlsx' : type,
              bookSST: false,
              type: 'binary'
            } //这里的数据是用来定义导出的格式类型
          )
        )
      ],
      {
        type: ''
      }
    );
    this.saveAs(
      tmpDown,
      `${title}` +
        '.' +
        (this.wopts.bookType == 'biff2' ? 'xls' : this.wopts.bookType)
    );
  };

  // 转换表头数据
  this.filerHeader = (header, data) => {
    let filterData = data.reduce((arr, v) => {
      let o = {};
      for (let key in header) {
        if (v[key]) {
          o[header[key]] = v[key];
          arr.push(o);
        }
      }
      return arr;
    }, []);
    return filterData;
  };

  // 设置样式
  this.setExlStyle = (data) => {   
    data['!cols'] = [];
    for (let key in data) {
      data[key].s = {
        border: this.borderAll
      }
      data['!cols'].push({wpx: 100});
    }
    return data;
  }

  // 保存文件
  this.saveAs = (obj, fileName) => {
    let tmpa = document.createElement('a');
    tmpa.download = fileName || '下载';
    tmpa.href = URL.createObjectURL(obj);
    tmpa.click();
    setTimeout(function() {
      URL.revokeObjectURL(obj);
    }, 100);
  };

  this.getCharCol = n => {
    let temCol = '',
      s = '',
      m = 0;
    while (n > 0) {
      m = (n % 26) + 1;
      s = String.fromCharCode(m + 64) + s;
      n = (n - m) / 26;
    }
    return s;
  };

  this.s2ab = s => {
    if (typeof ArrayBuffer !== 'undefined') {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    } else {
      var buf = new Array(s.length);
      for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }
  };
}

let down = new exportsEXCL();

const header = { id: 'ID', name: '名称', school: '学校' };