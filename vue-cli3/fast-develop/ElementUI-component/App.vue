<template>
  <el-row class="app">
    <el-button type="primary" @click="exportExcel">导出</el-button>
    <el-button type="primary" @click="printExcel">打印</el-button>
    <CusTable
      :headerConfig="headerConfig"
      :colModel="colModel"
      :selectable="selectable"
      @selection-change="handleSelectionChange"
      @paging="getPaging"
      :editChage="editChage"
      ref="custable"
    >
      <el-table-column slot="multi" label="区域">
        <el-table-column label="省份" prop="province"></el-table-column>
        <el-table-column label="城市" prop="city"></el-table-column>
      </el-table-column>
      <el-table-column slot="opt" label="操作">
        <el-button size="mini" slot-scope="{ row }" @click="getRow(row)">查看</el-button>
      </el-table-column>
    </CusTable>
    <el-col :span="6">
      <h3>数据</h3>
      <pre>{{headerConfig}}</pre>
    </el-col>
    <el-col :span="6">
      <h3>查看</h3>
      <pre>{{seeData}}</pre>
    </el-col>
    <el-col :span="6">
      <h3>选中数据</h3>
      <pre>{{multipleSelection}}</pre>
    </el-col>
    <el-col :span="6">
      <h3>当前页</h3>
      <pre>{{currentPage}}</pre>
    </el-col>
  </el-row>
</template>

<script>
/* eslint-disable */
import CusTable from './components/table/index.vue';
import TextComponent from './components/component';
import { ExportExcelDom, ExportExcelJson } from './utils/exportExcel.js';
import { getLodop } from './lib/LodopFuncs.js';

const exportExcel = new ExportExcelDom();

export default {
  components: {
    CusTable
  },
  data() {
    const timeRanges = (row, col, cell, index) => {
      console.log(row, cell, col, index);
      return cell.val;
    };

    const checkSelect = row => {
      console.log(row);
      return false;
    };
    return {
      colModel: [
        {
          label: '姓名',
          prop: 'name',
          align: 'center',
          headerAlign: 'left'
        },
        { label: '组件', component: TextComponent },
        { label: '合并', solt: 'multi' },
        { label: '日期', prop: 'date', formatter: timeRanges, sortable: true },
        {
          label: '地址',
          prop: 'address',
          isEdit: true,
          regx: /^\d+$/,
          editType: 'select',
          valKey: { label: 'name', value: 'val' },
          options: [
            {
              val: '999',
              name: '黄金糕'
            },
            {
              val: '选项2',
              name: '双皮奶'
            },
            {
              val: '666',
              name: '蚵仔煎'
            },
            {
              val: '选项4',
              name: '龙须面'
            },
            {
              val: '选项5',
              name: '北京烤鸭'
            }
          ]
        },
        {
          label: '门牌号',
          prop: 'num',
          isEdit: true,
          regx: /^\d+$/,
          errClassName: 'input-error'
        },
        {
          label: '隐藏',
          prop: 'hide',
          hidden: true,
          headerAlign: 'left'
        },
        { label: '操作', solt: 'opt' }
      ],
      headerConfig: {
        data: [
          {
            date: { val: '2016-05-04' },
            name: '张三',
            address: '999',
            num: 155555,
            province: '上海',
            city: '普陀区',
            hide: '呵呵'
          },
          {
            date: { val: '2016-05-01' },
            name: '李四',
            address: '选项4',
            num: '错误的regx',
            province: '上海',
            city: '普陀区',
            hide: '哒哒'
          },
          {
            date: { val: '2016-05-02' },
            name: '王五',
            address: '上海市普陀区金沙江路 1519 弄',
            province: '上海',
            city: '普陀区',
            hide: '呵呵'
          },
          {
            date: { val: '2016-05-03' },
            name: '赵六',
            address: '666',
            province: '上海',
            city: '普陀区',
            hide: '哒哒'
          }
        ],
        border: true,
        selection: true,
        rownum: true,
        rownumName: '行号'
      },
      seeData: {},
      multipleSelection: [],
      currentPage: {}
    };
  },
  methods: {
    getRow(row) {
      this.seeData = { ...row };
    },
    handleSelectionChange(val) {
      this.multipleSelection = [...val];
    },
    selectable(row, index) {
      return row.address === '1519';
    },
    getPaging(paging) {
      this.currentPage = { ...paging };
    },
    editChage(val, cell, row, e) {
      console.log(val, cell, row, e);
    },
    exportExcel() {
      const $dom = this.$refs.custable.$refs.table.$el;
      exportExcel.init({ dom: $dom });
    },
    printExcel() {
      const $dom = this.$refs.custable.$refs.table.$el;
      const LODOP = getLodop();
      console.log($dom);

      // 打印页面设置
      LODOP.PRINT_INIT('打印');
      LODOP.SET_PRINT_PAGESIZE(1, 0, 0, 'A4');

      // 打印的表格
      LODOP.ADD_PRINT_TABLE(170, '5%', '90%', 290, $dom.innerHTML);
      LODOP.SET_PRINT_STYLEA(0, 'Vorient', 3);

      // 打印页面
      LODOP.ADD_PRINT_HTM(18, '5%', '90%', 400, $dom.innerHTML);
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1);
      LODOP.SET_PRINT_STYLEA(0, 'LinkedItem', 1);

      LODOP.NewPageA();
      LODOP.PREVIEW();
    }
  }
};
</script>

<style scoped>
.pull-left {
  float: left;
}
</style>