/**
 * Created by Hekx on 16/2/1.
 */
var jsonData = [
    {
        id: "78b58204-e704-11e4-8c63-c81f66f585f9",
        name: "我的音乐",
        type: "folder",
        properties: [{name: "创建人", value: "张三"}, {name: "创建日期", value: "2015-01-01"}, {name: "分类", value: "艺术创作/音乐"}],
        url:"/originalService/app/group/documentList/78b58204-e704-11e4-8c63-c81f66f585f9",
        buttons : [{name:"编辑",href:"javascript:hbox.open({width:600,height:300,title:'编辑项目信息',id:'project',url:'/originalService/app/group/modifyProject/78b58204-e704-11e4-8c63-c81f66f585f9?groupId=29c94a6b-b844-11e5-a288-02000a671f06'})"}]
    },
    {
        id:"4be10198-5ad2-11e5-a590-c81f66f585f9",
        name:"20160111171229.mp4",
        iconImg:"/originalService/temp/docthumb/2ff84f51-b844-11e5-a288-02000a671f06",
        type:"file",
        properties: [
            {name:"创建人",value:"张三"},
            {name:"创建日期",value:"2015-01-01"},
            {name:"分类",value:"艺术创作/音乐"},
            {name:"原文件名",value:"123.mp4"},
            {name:"认证时间",value:"2015-01-01 22:12"}
        ],
        imgs:[
            {title:"已认证",url:"/originalService/opstyles/v2/images/print.png"},
            {title:"已公示",url:"/originalService/opstyles/makerIpcss/images/main/view.png"}
        ],
        url :"/originalService/app/document/viewdoc/4be10198-5ad2-11e5-a590-c81f66f585f9",
        target:"_blank",
        buttons:[

        ]
    }
];