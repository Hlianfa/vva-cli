<template>
  <div class="filter-group">
    <el-form
      ref="filterForm"
      :inline="true"
      :model="proxy.form"
      size="small"
      label-width="77px"
    >
      <el-form-item
        v-for="filter in filters"
        :key="filter.prop"
        :label="filter.label"
        :prop="filter.prop"
      >
        <el-input
          v-if="filter.renderType == 'input'"
          v-model="proxy.form[filter.prop]"
          clearable
          :placeholder="
            filter.placeholder ? filter.placeholder : `请输入${filter.label}`
          "
          @input="changeHandle"
        ></el-input>
        <select-box
          v-if="filter.renderType == 'select'"
          v-model="proxy.form[filter.prop]"
          :multiple="(filter.config || {}).multiple"
          :placeholder="filter.placeholder || `请选择${filter.label}`"
          :filterable="(filter.config || {}).filterable"
          :all="(filter.config || {}).all"
          :readonly="!!filter.readonly"
          :options="filter.options || []"
          :optionConfig="(filter.config || {}).optionConfig"
          @input="changeHandle"
        />
        <smart-box
          v-if="filter.renderType == 'smartbox'"
          v-model="proxy.form[filter.prop]"
          :config="filter.config"
          :placeholder="
            filter.placeholder ? filter.placeholder : `请选择${filter.label}`
          "
          :multiple="(filter.config || {}).multiple"
          :disabled="!!filter.readonly"
          @input="changeHandle"
        />
        <el-date-picker
          v-if="filter.renderType == 'datepicker'"
          :type="(filter.config || {}).type"
          :placeholder="filter.placeholder ? filter.placeholder : '请选择日期'"
          v-model="proxy.form[filter.prop]"
          @change="changeHandle"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="filter-group-btn">
      <el-button size="small" type="primary" @click="search">搜 索</el-button>
      <el-button size="small" @click="reset">重 置</el-button>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent, reactive, watch, PropType } from "vue";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElDatePicker,
  ElButton,
} from "element-plus";
import smartBox from "components/smartBox/index.vue";
import selectBox from "components/selectBox/index.vue";
import { cusToRefs } from "helper/utils";
import { FilterItem } from "components/filterGroup/index";

export default defineComponent({
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElDatePicker,
    ElButton,
    smartBox,
    selectBox,
  },
  props: {
    filters: {
      type: Array as PropType<FilterItem[]>,
      default: () => [],
    },
    modelValue: { default: () => ({}) },
  },
  emits: ["update:modelValue", "search"],
  setup(props, { emit }) {
    const proxy = reactive({
      form: {},
    });
    watch(
      () => props.modelValue,
      (val) => {
        proxy.form = val;
      }
    );
    // 清空表单
    const filterForm = ref<typeof ElForm | null>(null);
    function reset() {
      if (typeof filterForm !== null) {
        filterForm.value.resetFields();
        emit("search", cusToRefs(proxy.form));
      }
    }
    // 搜索
    function search() {
      emit("search", cusToRefs(proxy.form));
    }
    function changeHandle() {
      emit("update:modelValue", proxy.form);
    }
    return {
      proxy,
      filterForm,
      reset,
      search,
      changeHandle,
    };
  },
});
</script>
<style lang="scss">
.filter-group {
  padding: 18px 8px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 7px 0 rgba(147, 162, 175, 0.2);
  user-select: none;
  .el-input--small {
    width: 203px;
  }
  &-btn {
    margin-top: 18px;
    text-align: center;
  }
}
</style>
