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
        <!-- <FormItem>
          <Button type="primary" @click="handleSubmit('formAddColum')">Signin</Button>
        </FormItem> -->
      </Form>
    </Modal>
    <Modal v-model="modelAddRow" title="添加一行模态框" width='400' @on-ok="okAddRow" @on-cancel="cancelAddRow">
      <!-- <Form ref="formAddRow" :model="formAddRow" :rules="formAddRowRule">
        <FormItem prop="name">
          <Input type="text" v-model="formAddRow.name" placeholder="name">
          <span slot="prepend">姓名</span>
          </Input>
        </FormItem>
      </Form> -->
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
            <!-- <Checkbox label="Sleep">sdfb</Checkbox>
            <Checkbox label="Run"></Checkbox>
            <Checkbox label="Movie"></Checkbox> -->
          </CheckboxGroup>
        </FormItem>

        <FormItem>
          <!-- <Button type="primary" @click="handleSubmit('formDelHead')">Submit</Button>
          <Button @click="handleReset('formDelHead')" style="margin-left: 8px">Reset</Button> -->
        </FormItem>
      </Form>
      <br> <br>
    </Modal>
    <!-- <Modal v-model="modelAmendRow" title="修改一行模态框" width='400' @on-ok="okAmendRow" @on-cancel="cancelAmendRow">
      <Form ref="formDynamicAmendRow" :model="formDynamicAmendRow">
        <FormItem v-for="(item, index) in formDynamicAmendRow.lists" :key="index" :prop="'lists.' + index + '.addValue'"
          :rules="{required: true, message: item.amendTitle  +' 不能为空', trigger: 'blur'}">
          <Input type="text" v-model="item.amendValue" placeholder="Enter something...">
          <span slot="prepend">{{item.amendTitle}}</span>
          </Input>
        </FormItem>
      </Form>
    </Modal> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      formDynamicAddRow: {
        lists: [
          // {
          //   addValue: "",
          //   addTitle: "姓名",
          //   index: 1
          // },
          // {
          //   addValue: "",
          //   addTitle: "年龄",
          //   index: 2
          // }
        ]
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
                      console.log("表格原有内容", params.row);
                      console.log("动态表头", this.initHeadData);
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
      console.log("我是头部信息");
      this.initColum = [];
      this.initHeadData = [];
      this.$axios.get("http://localhost:3456/head").then(res => {
        console.log(res);
        res.data.map(item => {
          (item["align"] = "center"), (item["width"] = 100);
          this.initHeadData.push(item);
        });
        console.log(this.initHeadData);
        // localStorage.setItem(
        //   "headColumDynamic",
        //   JSON.stringify(this.initHeadData)
        // );
        // let newHead = JSON.parse(localStorage.getItem("headColumDynamic"));
        // this.initColum = newHead.concat(this.initColumRender);
        // this.initColum = this.initHeadData.concat(this.initColumRender);

        this.initColum.push(...this.initHeadData, ...this.initColumRender);
        console.log(this.initColum);
      });
    },
    initContent() {
      console.log("我是内容信息");
      this.$axios.get("http://localhost:3456/content").then(res => {
        console.log(res);
        this.initData = res.data;
      });
    },
    okAddColum() {
      console.log(this.formAddColum.title);
      let params = {
        id: new Date().getTime(),
        title: this.formAddColum.title,
        key: new Date().getTime() + "newKey"
      };
      this.$axios.post("http://localhost:3456/head", params).then(res => {
        console.log(res);
        // this.initColum = [];
        // this.initHeadData = [];
        this.initHead();

        // let newHead = JSON.parse(localStorage.getItem("headColumDynamic"));
        // newHead.push(res.data);
        // console.log(newHead);
        // this.initColum = newHead.concat(this.initColumRender);
        // console.log(this.initColum);
        // localStorage.setItem("headColumDynamic", JSON.stringify(newHead));

        // this.initHeadData.push(res.data);
        // this.initColum = this.initHeadData.concat(this.initColumRender);
        // console.log(this.initColum);

        // this.initColum = [];
        // this.initHeadData.push(res.data);
        // this.initColum.push(this.initHeadData);
        // this.initColum.push(this.initColumRender);
        // this.initColum.push(...this.initHeadData, ...this.initColumRender);
        console.log(this.initColum);
      });
    },
    cancelAddColum() {
      console.log("添加一列列列取消按钮");
    },
    okAddRow() {
      console.log("添加一行行行确定按钮");
      console.log("当前最新表头数据", this.initHeadData);
      console.log("动态表格添加一列数据的内容", this.formDynamicAddRow.lists);
      let newParams = {};
      let len = this.initHeadData.length;
      for (let i = 0; i < len; i++) {
        console.log(i);
        newParams[this.initHeadData[i].key] = this.formDynamicAddRow.lists[
          i
        ].addValue;
      }
      console.log(newParams);

      let params = {
        id: new Date().getTime(),
        ...newParams
        // name: "朱文龙",
        // age: 183,
        // province: "江西省"
      };
      this.$axios.post("http://localhost:3456/content", params).then(res => {
        console.log(res);
        // this.initData = res.data;
        this.initContent();
        this.$Message.info("数据添加成功");
      });
    },
    cancelAddRow() {
      console.log("添加一行行行取消按钮");
    },
    okDelColum() {
      console.log("删除一列列列确定按钮");
      console.log(this.formDelHead.dynamicHead);
      // this.formDelHead.dynamicHead.map(item => {
      //   this.$axios.delete("http://localhost:3456/head/" + item).then(res => {
      //     console.log(res);
      //     // this.initHead();
      //   });
      // });
      // this.initHead();

      this.$axios
        .delete("http://localhost:3456/head/" + this.formDelHead.dynamicHead)
        .then(res => {
          console.log(res);
          this.initHead();
        });
    },
    cancelDelColum() {
      console.log("删除一列列列取消按钮");
    },
    show(index) {
      console.log(index, "修改");
    },
    removeRow(index) {
      console.log(index, "删除");
      this.$axios.delete("http://localhost:3456/content/" + index).then(res => {
        console.log(res);
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
      console.log("添加一行");
      console.log("当前最新表头数据", this.initHeadData);
      console.log("动态表格原有数据清空", this.formDynamicAddRow.lists);
      this.formDynamicAddRow.lists = [];
      this.initHeadData.map(item => {
        let obj = {};
        obj.addTitle = item.title;
        obj.addValue = "";
        obj.index = item.__id;
        this.formDynamicAddRow.lists.push(obj);
      });
      console.log("动态表格获取表头数据之后", this.formDynamicAddRow.lists);
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
