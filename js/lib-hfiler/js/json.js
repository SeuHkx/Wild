/**
 * Created by Hekx on 16/2/22.
 */
var jsonData = [
    {
        id:"4be10198-5ad2-11e5-a590-c81f66f585f92112",
        name:"活着.mp4",
        icon:"http://i.k1982.com/design_img/201011/20101115222155796.jpg",
        type:"file",
        properties: [
            {name:"创建人:",value:"张三"},
            {name:"创建日期:",value:"2015-01-01"},
            {name:"分类:",value:"艺术创作/音乐"},
            {name:"原文件名:",value:"活着.mp4"},
            {name:"认证时间:",value:"2015-01-01 22:12"}
        ],
        url :"http://i.k1982.com/design_img/201011/20101115222155796.jpg",
        target:"_blank",
        images:[{title:'认证',url:'x.png',klass : 'rz'}],
        buttons : [{name:"编辑",func : 'Edit'},{name:"移动",func : 'Move'},{name:"删除",func:'Del'},{name:'下载',href:'www.baidu.com'}]
    },
    {
        id: "78b58204-e704-1121e4-8c63-c81f66f585f9",
        name: "我的音乐1",
        type: "folder",
        properties: [{name: "创建人:", value: "张三"}, {name: "创建日期:", value: "2015-01-01"}, {name: "分类:", value: "艺术创作/音乐"}],
        url:"/originalService/app/group/documentList/78b58204-e704-11e4-8c63-c81f66f585f9",
        buttons : [{name:"编辑",func : 'Edit'},{name:"移动",func : 'Move'},{name:"删除",func:'Del'},{name:'下载'}],
        empty : true
    },
    {
        id: "78b58204-e704-1121e4-8c63-c81f66f585f9",
        name: "我的音乐2",
        type: "folder",
        properties: [{name: "创建人:", value: "张三"}, {name: "创建日期:", value: "2015-01-01"}, {name: "分类:", value: "艺术创作/音乐"}],
        url:"/originalService/app/group/documentList/78b58204-e704-11e4-8c63-c81f66f585f9",
        buttons : [{name:"编辑",func : 'Edit'},{name:"移动",func : 'Move'},{name:"删除",func:'Del'},{name:'下载'}],
        empty : true
    },
    {
        type: "folder",
        id: "78b58204-e704-11e4-8c63-32ds21ad2WESD2",
        name: "我的音乐3",
        properties: [{name: "创建人:", value: "张三"}, {name: "创建日期:", value: "2015-01-01"}, {name: "分类:", value: "艺术创作/音乐"}],
        url:"/originalService/app/group/documentList/78b58204-e704-11e4-8c63-c81f66f585f9",
        buttons : [{name:"编辑",func : 'Edit',href:'www.google.com'},{name:"移动",func : 'Move'},{name:"删除",func:'Del'},{name:'下载',href :'www.baidu.com',target :'_blank'}],
        empty: false
    },
    {
        id:"4be10198-5ad2-11e5-a590-c81f66f5852112f9",
        name:"演员.mp4",
        icon:"https://attachments.tower.im/tower/aa793f94a5e2433eb41b506a08ce1e06?version=medium&filename=1_pic_default.jpg",
        type:"file",
        properties: [
            {name:"创建人:",value:"张三"},
            {name:"创建日期:",value:"2015-01-01"},
            {name:"分类:",value:"艺术创作/音乐"},
            {name:"原文件名:",value:"演员.mp4"},
            {name:"认证时间:",value:"2015-01-01 22:12"}
        ],
        url :"/originalService/app/document/viewdoc/4be10198-5ad2-11e5-a590-c81f66f585f9",
        target:"_blank",
        images:[{title:'认证',url:'x.png',klass : 'rz'},{title:'公示',url:'x.png',klass:'gs'},{title:'新文件',url:'x.png',klass:'new'}],
        buttons : [{name:"编辑",func : 'Edit'},{name:"移动",func : 'Move'},{name:"删除",func:'Del'},{name:'下载'}]
    }
];

window.jsonData = jsonData;