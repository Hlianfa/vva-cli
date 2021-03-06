<template>
  <div class="overview-wrap">
    <panel title="总览" class="view-box">
      <div class="view-detail">
        <div class="view-detail-bar">
          <div>{{ formateNum(total.views) }}</div>
          <div>浏览量</div>
        </div>
        <div class="view-detail-bar">
          <div>{{ formateNum(total.contents) }}</div>
          <div>内容总数</div>
        </div>
        <div class="view-detail-bar">
          <div>{{ formateNum(total.registers) }}</div>
          <div>注册用户</div>
        </div>
      </div>
      <div id="totalChart" class="view-chart"></div>
    </panel>
    <panel title="访客" class="view-box">
      <el-select
        class="view-option"
        size="mini"
        v-model="viewerTime"
        @change="onViewChange"
      >
        <el-option
          v-for="item in viewerOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div id="viewerChart" class="view-chart"></div>
    </panel>
    <panel title="页面" class="view-box">
      <el-select
        class="view-option"
        size="mini"
        v-model="pageTime"
        @change="onPageChange"
      >
        <el-option
          v-for="item in pageOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div id="pageChart" class="view-chart"></div>
    </panel>
    <panel title="内容" class="view-box">
      <el-select
        class="view-option"
        size="mini"
        v-model="contentTime"
        @change="onContentChange"
      >
        <el-option
          v-for="item in contentOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div id="contentChart" class="view-chart"></div>
    </panel>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { ElSelect, ElOption } from "element-plus";
import panel from "components/panel/index.vue";
import { formateNum } from "helper/utils";
import usePageChart from "./hooks/usePageChart";
import useViewerChart from "./hooks/useViewerChart";
import useContentChart from "./hooks/useContentChart";
import useTotalChart from "./hooks/useTotalChart";

export default defineComponent({
  components: {
    panel,
    ElSelect,
    ElOption,
  },
  setup() {
    const chartColors = ["#37A2DA", "#67E0E3", "#9FE6B8", "#32C5E9", "#FFDB5C"];
    // 总览
    const { total, render: totalRender } = useTotalChart(
      "totalChart",
      chartColors
    );
    // 页面
    const { config: pageConfig, render: pageRender } = usePageChart(
      "pageChart",
      chartColors
    );
    // 访客
    const { config: viewerConfig, render: viewerRender } = useViewerChart(
      "viewerChart",
      chartColors
    );
    // 内容
    const { config: contentConfig, render: contentRender } = useContentChart(
      "contentChart",
      chartColors
    );
    onMounted(() => {
      totalRender();
      pageRender();
      viewerRender();
      contentRender();
    });
    return {
      total,
      formateNum,
      ...pageConfig,
      ...viewerConfig,
      ...contentConfig,
    };
  },
});
</script>
<style lang="scss" scoped>
.overview-wrap {
  display: flex;
  flex-wrap: wrap;
  .view-box {
    margin-right: 10px;
    padding: 10px;
    .view-option {
      width: 88px;
      float: right;
    }
    .view-chart {
      width: 600px;
      height: 300px;
      clear: both;
      margin: 0 auto;
    }
    &:nth-of-type(1) .view-chart {
      width: 500px;
      height: 200px;
    }
    &:nth-of-type(2) .view-chart {
      width: 700px;
    }
    .view-detail {
      display: flex;
      justify-content: space-between;
      margin-top: 28px;
      &-bar {
        width: 33.33%;
        text-align: center;
        div {
          font-size: 18px;
          color: #90979c;
        }
        div:nth-of-type(1) {
          font: {
            size: 28px;
            weight: bold;
          }
          padding: 18px 0;
        }
        &:nth-of-type(1) div:nth-of-type(1) {
          color: #37a2da;
        }
        &:nth-of-type(2) div:nth-of-type(1) {
          color: #9fe6b8;
        }
        &:nth-of-type(3) div:nth-of-type(1) {
          color: #ffdb5c;
        }
      }
    }
  }
}
</style>
