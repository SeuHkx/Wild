/**
 * Created by Hekx on 16/2/24.
 */
var jsonData = [
    {
        id: "78b58204-e704-1121e4-8c63-c81f66f585f9",
        name: "设计图",
        type: "folder",
        properties: [{name: "创建人:", value: "张三"}, {name: "创建日期:", value: "2015-01-01"}, {name: "分类:", value: "艺术创作/音乐"}],
        url:"/originalService/app/group/documentList/78b58204-e704-11e4-8c63-c81f66f585f9",
        buttons : [{name:"编辑",func : 'Edit'},{name:"移动",func : 'Move'},{name:"删除",func:'Del'},{name:'下载'}],
        empty : true
    },
    {
        id: "78b58204-e704-1121e4-8c63-c81f66f585f9",
        name: "我的音乐",
        type: "folder",
        properties: [{name: "创建人:", value: "张三"}, {name: "创建日期:", value: "2015-01-01"}, {name: "分类:", value: "艺术创作/音乐"}],
        url:"/originalService/app/group/documentList/78b58204-e704-11e4-8c63-c81f66f585f9",
        buttons : [{name:"编辑",func : 'Edit'},{name:"移动",func : 'Move'},{name:"删除",func:'Del'},{name:'下载'}],
        empty : true
    }
]
window.jsonData = jsonData;