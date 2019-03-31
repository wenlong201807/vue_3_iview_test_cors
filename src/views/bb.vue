<template>
  <div class="home">
    <h2>aa(自定义表单)</h2>
    <br>
    <router-link to="/">home(首页)</router-link> <span>****</span>
    <router-link to="/aa">aa(自定义表单)</router-link><span>****</span>
    <router-link to="/bb">bbb(自定义表单***清爽版)</router-link><span>****</span>
    <hr>
    <br>
    <br><br>
    <Button type="info" @click="addColum">添加一列</Button><span>****</span>
    <Button type="success" @click="addRow">添加一行</Button><span>****</span>
    <Button type="warning" @click="delColum">删除一列</Button><span>****</span>
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
    <Modal v-model="modelAddRow" title="添加一行模态框" width='400' footer-hide>
      <Form ref="formDynamicAddRow" :model="formDynamicAddRow">
        <FormItem v-for="(item, index) in formDynamicAddRow.lists" :key="index" :prop="'lists.' + index + '.addValue'"
          :rules="{required: true, message: item.addTitle  +' 不能为空', trigger: 'blur'}">
          <Input type="text" v-model="item.addValue" placeholder="Enter something...">
          <span slot="prepend">{{item.addTitle}}</span>
          </Input>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="okAddRow('formDynamicAddRow')">提交</Button>
          <Button @click="cancelAddRow('formDynamicAddRow')" style="margin-left: 8px">取消</Button>
        </FormItem>

      </Form>
    </Modal>
    <Modal v-model="modelDelColum" title="删除一列模态框" @on-ok="okDelColum" @on-cancel="cancelDelColum">
      <Form ref="formDelHead" :model="formDelHead" :rules="formDelHeadRule" :label-width="80">
        <FormItem label="表头字段" prop="dynamicHead">
          <CheckboxGroup v-model="formDelHead.dynamicHead">
            <Checkbox v-for="(item,index) in initHeadData" :key="index" :label="item.id">{{item.title}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="modelAmendRow" title="修改一行模态框" width='400' @on-ok="okAmendRow" @on-cancel="cancelAmendRow">
      <Form ref="formDynamicAmendRow" :model="formDynamicAmendRow">
        <FormItem v-for="(item, index) in formDynamicAmendRow.lists" :key="index" :prop="'lists.' + index + '.addValue'"
          :rules="{required: true, message: item.amendTitle  +' 不能为空', trigger: 'blur'}">
          <Input type="text" v-model="item.amendValue" placeholder="Enter something...">
          <span slot="prepend">{{item.amendTitle}}</span>
          </Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formDynamicAmendRow: {
        lists: []
      },
      formDynamicAddRow: {
        lists: []
      },
      formAddRow: {
        name: ""
      },
      formAddRowRule: {
        name: [
          {
            required: true,
            message: "Please fill in the name.",
            trigger: "blur"
          }
        ]
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
      currentAmendId: 1,
      modelAddColum: false,
      modelAddRow: false,
      modelAmendRow: false,
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
                      this.modelAmendRow = true;
                      this.formDynamicAmendRow.lists = [];
                      this.currentAmendId = params.row.id;
                      this.initHeadData.map((item, index) => {
                        console.log(index);
                        for (let [key, value] of Object.entries(params.row)) {
                          let objAmend = {};
                          if (key == item.key) {
                            objAmend["amendTitle"] = item.title;
                            objAmend["index"] = item.id;
                            objAmend["amendValue"] = value;
                            objAmend["key"] = item.key;
                            this.formDynamicAmendRow.lists.push(objAmend);
                          }
                        }
                      });
                      console.log(
                        "修改表单中的数据",
                        this.formDynamicAmendRow.lists
                      );
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
    cancelAmendRow() {
      console.log("cancelAmendRow");
    },
    okAmendRow() {
      console.log("okAmendRow", this.currentAmendId);
      console.log(this.formDynamicAmendRow.lists);

      let newParams = {};
      let len = this.formDynamicAmendRow.lists.length;
      for (let i = 0; i < len; i++) {
        console.log(
          i,
          this.formDynamicAmendRow.lists[i].key,
          this.formDynamicAmendRow.lists[i].amendValue
        );
        newParams[
          this.formDynamicAmendRow.lists[i].key
        ] = this.formDynamicAmendRow.lists[i].amendValue;
      }
      this.$axios
        .put("http://localhost:3456/content/" + this.currentAmendId, newParams)
        .then(() => {
          this.$refs["formDynamicAmendRow"].resetFields();
          this.initContent();
          this.$Message.info("数据修改成功");
        });
    },
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
    okAddRow(name) {
      let newParams = {};
      let len = this.initHeadData.length;
      for (let i = 0; i < len; i++) {
        newParams[this.initHeadData[i].key] = this.formDynamicAddRow.lists[
          i
        ].addValue;
      }

      this.$refs[name].validate(valid => {
        if (valid) {
          let params = {
            id: new Date().getTime(),
            ...newParams
          };
          this.$axios.post("http://localhost:3456/content", params).then(() => {
            this.initContent();
            this.$Message.info("数据添加成功");
            this.modelAddRow = true;
          });
        } else {
          this.$Message.error("数据添加失败");
        }
      });
    },
    cancelAddRow(name) {
      console.log("添加一行行行取消按钮");
      this.modelAddRow = false;
      this.$refs[name].resetFields();
    },
    okDelColum() {
      this.$axios
        .delete("http://localhost:3456/head/" + this.formDelHead.dynamicHead)
        .then(() => {
          this.initHead();
        });
    },
    cancelDelColum() {
      console.log("删除一列列列取消按钮");
    },
    removeRow(index) {
      this.$axios.delete("http://localhost:3456/content/" + index).then(() => {
        this.initContent();
      });
    },
    addColum() {
      this.modelAddColum = true;
      console.log("添加一列");
    },
    delColum() {
      this.modelDelColum = true;
      console.log("删除一列");
    },
    addRow() {
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
  width: 600px;
  /* margin: 0 auto; */
}
</style>
