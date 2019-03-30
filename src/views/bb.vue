<template>
  <div class="home">
    <h2>bb(自定义表单***清爽版)</h2>
    <br>
    <router-link to="/">home(首页)</router-link> <span>****</span>
    <router-link to="/aa">aa(自定义表单)</router-link><span>****</span>
    <router-link to="/bb">bbb(自定义表单***清爽版)</router-link><span>****</span>
    <hr>
    <br>
    <br><br>
    <Button type="info" @click="addColumOpen">添加一列</Button><span>****</span>
    <Button type="success" @click="addRowOpen">添加一行</Button><span>****</span>
    <Button type="warning" @click="delColumOpen">删除一列</Button><span>****</span>
    <br><br>
    <Table class="initTable" border :columns="initColum" :data="initData"></Table>

    <Modal v-model="modelAddColum" title="添加一列模态框" @on-ok="okAddColum" @on-cancel="cancelAddColum">
      <Form ref="formAddColum" :model="formAddColum" :rules="formAddColumRule">
        <FormItem prop="title">
          <Input type="text" v-model="formAddColum.title" placeholder="表头的标题">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="modelAddRow" title="添加一行模态框" width='400' @on-ok="okAddRow" @on-cancel="cancelAddRow">
      <Form ref="formDynamicAddRow" :model="formDynamicAddRow">
        <FormItem v-for="(item, index) in formDynamicAddRow.lists" :key="index" :prop="'lists.' + index + '.addValue'"
          :rules="{required: true, message: item.addTitle  +' 不能为空', trigger: 'blur'}">
          <Input type="text" v-model="item.addValue" placeholder="Enter something...">
          <span slot="prepend">{{item.addTitle}}</span>
          </Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="modelDelColum" title="删除一列模态框" @on-ok="okDelColum" @on-cancel="cancelDelColum">
      <br> <br>
      <Form ref="formDelHead" :model="formDelHead" :rules="formDelHeadRule" :label-width="80">
        <FormItem label="表头字段" prop="dynamicHead">
          <CheckboxGroup v-model="formDelHead.dynamicHead">
            <Checkbox v-for="(item,index) in initHeadData" :key="index" :label="item.id">{{item.title}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <br> <br>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formDynamicAddRow: {
        lists: []
      },
      formAddRow: {
        name: ""
      },
      formAddColum: {
        title: ""
      },
      formAddColumRule: {
        title: [
          {
            required: true,
            message: "添加一列的标题为必填字段",
            trigger: "blur"
          }
        ]
      },
      formDelHead: {
        dynamicHead: []
      },
      formDelHeadRule: {
        dynamicHead: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "最少选择一项",
            trigger: "change"
          }
        ]
      },
      modelAddColum: false,
      modelAddRow: false,
      modelDelColum: false,
      initColum: [],
      initColumRender: [
        {
          title: "Action",
          key: "action",
          fixed: "right",
          width: 220,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.removeRow(params.row.id);
                    }
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                },
                "修改"
              )
            ]);
          }
        }
      ],
      initData: [],
      initHeadData: []
    };
  },
  created() {
    this.initContent();
    this.initHead();
  },
  watch: {},
  methods: {
    initHead() {
      this.initColum = [];
      this.initHeadData = [];
      this.$axios.get("http://localhost:3456/head").then(res => {
        res.data.map(item => {
          (item["align"] = "center"), (item["width"] = 100);
          this.initHeadData.push(item);
        });
        this.initColum.push(...this.initHeadData, ...this.initColumRender);
      });
    },
    initContent() {
      this.$axios.get("http://localhost:3456/content").then(res => {
        this.initData = res.data;
      });
    },
    okAddColum() {
      let params = {
        id: new Date().getTime(),
        title: this.formAddColum.title,
        key: new Date().getTime() + "newKey"
      };
      this.$axios.post("http://localhost:3456/head", params).then(() => {
        this.initHead();
      });
    },
    cancelAddColum() {
      console.log("添加一列列列取消按钮");
    },
    okAddRow() {
      let newParams = {};
      let len = this.initHeadData.length;
      for (let i = 0; i < len; i++) {
        newParams[this.initHeadData[i].key] = this.formDynamicAddRow.lists[
          i
        ].addValue;
      }

      let params = {
        id: new Date().getTime(),
        ...newParams
      };
      this.$axios.post("http://localhost:3456/content", params).then(() => {
        this.initContent();
        this.$Message.info("成功添加一行数据");
      });
    },
    cancelAddRow() {
      console.log("添加一行行行取消按钮");
    },
    okDelColum() {
      this.$axios
        .delete("http://localhost:3456/head/" + this.formDelHead.dynamicHead)
        .then(() => {
          this.initHead();
          this.$Message.info("成功删除一列数据");
        });
    },
    cancelDelColum() {
      console.log("删除一列列列取消按钮");
    },
    show(index) {
      console.log(index, "修改");
    },
    removeRow(index) {
      this.$axios.delete("http://localhost:3456/content/" + index).then(() => {
        this.initContent();
        this.$Message.info("成功删除一行数据");
      });
    },
    addColumOpen() {
      this.modelAddColum = true;
      console.log("添加一列");
    },
    delColumOpen() {
      this.modelDelColum = true;
      console.log("删除一列");
    },
    addRowOpen() {
      this.modelAddRow = true;
      this.formDynamicAddRow.lists = [];
      this.initHeadData.map(item => {
        let obj = {};
        obj.addTitle = item.title;
        obj.addValue = "";
        obj.index = item.__id;
        this.formDynamicAddRow.lists.push(obj);
      });
    }
  }
};
</script>

<style>
.home {
  margin: 30px;
}
.initTable {
  /* min-width: 600px; */
  width: 600px;
  /* height: 400px; */
}
</style>
