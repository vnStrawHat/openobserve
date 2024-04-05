<template>
  <q-card class="column full-height no-wrap">
    <!-- Header -->
    <div style="width: 40vw" class="q-px-sm q-py-md">
      <q-card-section class="q-pb-sm q-px-sm q-pt-none">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-body1 text-bold" data-test="queryList-title-text">
              {{ t("queries.queryList") }}
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              v-close-popup="true"
              data-test="queryList-cancel"
              round
              flat
              icon="cancel"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator />
    </div>

    <q-table
      class="my-sticky-virtscroll-table"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      dense
      :rows="getRows(schemaData)"
      hide-bottom
      hide-header
      row-key="index"
      wrap-cells
    >
    </q-table>
  </q-card>
</template>

<script lang="ts">
import type { QTableProps } from "quasar";
import { computed, defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "QueryList",
  components: {},
  props: {
    schemaData: Object,
  },
  emits: ["save"],
  setup(props: any) {
    const { t } = useI18n();
    const queryData = props.metaData?.queries || [];

    const getRows = (query: any) => {
      console.log(query, "query");

      const querystartTime = query?.query_start_time;
      const formattedQueryStartTime = new Date(querystartTime / 1000);
      const queryStartTimeEntry = `${querystartTime} (${formattedQueryStartTime})`;

      const timestampOfStartTime = query?.start_time;
      const formattedStartTime = new Date(timestampOfStartTime / 1000);
      const startTimeEntry = `${timestampOfStartTime} (${formattedStartTime})`;

      const timestampOfEndTime = query?.end_time;
      const formattedEndTime = new Date(timestampOfEndTime / 1000);
      const endTimeEntry = `${timestampOfEndTime} (${formattedEndTime})`;

      const rows: any[] = [
        ["Session ID", query?.session_id],
        ["Query Start Time", queryStartTimeEntry],
        ["Is Query Queue", query?.is_queue],
        ["User ID", query?.user_id],
        ["Org ID", query?.org_id],
        ["Stream Type", query?.stream_type],
        ["Sql", query?.sql],
        ["Start Time", startTimeEntry],
        ["End Time", endTimeEntry],
      ];

      return rows;
    };
    // const totalQueries = computed(() => queryData.length);
    // const dataTitle = computed(() => props.data.title);

    return {
      queryData,
      t,
      getRows,
      //   totalQueries,
      //   dataTitle,
      pagination: ref({
        rowsPerPage: 0,
      }),
    };
  },
});
</script>

<style scoped></style>
