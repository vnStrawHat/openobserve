<template>
  <div class="running-queries-page">
    <q-table
      data-test="running-queries-table"
      ref="qTable"
      :rows="queries"
      :columns="columns"
      row-key="session_id"
      style="width: 100%"
    >
      <template #no-data>
        <div v-if="!loadingState" class="text-center full-width full-height">
          <NoData />
        </div>
        <div v-else class="text-center full-width full-height q-mt-lg">
          <q-spinner-hourglass color="primary" size="lg" />
        </div>
      </template>
      <template #header-selection="scope">
        <q-checkbox v-model="scope.selected" size="sm" color="secondary" />
      </template>
      <template #body-selection="scope">
        <q-checkbox v-model="scope.selected" size="sm" color="secondary" />
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            icon="list_alt"
            :title="t('logStream.schemaHeader')"
            class="q-ml-xs"
            padding="sm"
            unelevated
            size="sm"
            round
            flat
            @click="listSchema(props)"
          />
          <q-btn
            :icon="outlinedDelete"
            :title="t('logStream.delete')"
            class="q-ml-xs"
            padding="sm"
            unelevated
            size="sm"
            round
            flat
            @click="confirmDeleteAction(props)"
          />
        </q-td>
      </template>

      <template #top>
        <div class="flex justify-between items-center full-width">
          <div class="q-table__title" data-test="log-stream-title-text">
            {{ t("queries.runningQueries") }}
          </div>
          <div class="flex items-start">
            <!-- <div class="flex justify-between items-end q-px-md">
              <div
                style="
                  border: 1px solid #cacaca;
                  padding: 4px;
                  border-radius: 2px;
                "
              >
                <template
                  v-for="visual in streamFilterValues"
                  :key="visual.value"
                >
                  <q-btn
                    :color="
                      visual.value === selectedStreamType ? 'primary' : ''
                    "
                    :flat="visual.value === selectedStreamType ? false : true"
                    dense
                    emit-value
                    no-caps
                    class="visual-selection-btn"
                    style="height: 30px; padding: 4px 12px"
                    @click="onChangeStreamFilter(visual.value)"
                  >
                    {{ visual.label }}</q-btn
                  >
                </template>
              </div>
            </div> -->
            <div data-test="streams-search-stream-input">
              <q-input
                v-model="filterQuery"
                borderless
                filled
                dense
                class="q-ml-auto q-mb-xs no-border search-input"
                :placeholder="t('queries.search')"
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </div>
        <q-table-pagination
          data-test="log-stream-table-pagination"
          :scope="scope"
          :pageTitle="t('logStream.header')"
          :resultTotal="resultTotal"
          :perPageOptions="perPageOptions"
          position="top"
          @update:changeRecordPerPage="changePagination"
        />
      </template>

      <template #bottom="scope">
        <q-table-pagination
          data-test="log-stream-table-pagination"
          :scope="scope"
          :resultTotal="resultTotal"
          :perPageOptions="perPageOptions"
          position="bottom"
          @update:changeRecordPerPage="changePagination"
        />
      </template>
    </q-table>
    <confirm-dialog
      v-model="deleteDialog.show"
      :title="deleteDialog.title"
      :message="deleteDialog.message"
      @confirm="deleteQuery"
    />
    <q-dialog
      v-model="showListSchemaDialog"
      position="right"
      full-height
      maximized
      data-test="list-schema-dialog"
    >
      <QueryList v-model="schemaData" />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import ConfirmDialog from "@/components/ConfirmDialog.vue";
// import SearchService from "@/services/search";
import {
  onBeforeMount,
  ref,
  type Ref,
  defineComponent,
  defineAsyncComponent,
} from "vue";
// import { useQuasar, type QTableProps } from "quasar";
// import QTablePagination from "@/components/shared/grid/Pagination.vue";
import { useI18n } from "vue-i18n";
import { outlinedDelete } from "@quasar/extras/material-icons-outlined";
import NoData from "@/components/shared/grid/NoData.vue";
import { timestampToTimezoneDate } from "@/utils/zincutils";
import { useStore } from "vuex";
import QueryList from "@/components/queries/QueryList.vue";

export default defineComponent({
  name: "RunningQueriesList",
  components: { QueryList },
  setup() {
    const store = useStore();
    const schemaData = ref({
      session_id: "",
      sql: "",
      stream_type: "",
    });
    const loadingState = ref(false);
    const queries = ref([
      {
        "#": 1,
        session_id: "2eXewV09OrUO0BxXjvpZ0EQ6GAN",
        query_start_time: 1712055588728556,
        is_queue: false,
        user_id: "root@example.com",
        org_id: "default",
        stream_type: "logs",
        sql: "select * from 'default'",
        start_time: 1706429989000000,
        end_time: 1706429989005000,
      },
      {
        "#": 2,
        session_id: "2eXewV09OrUO0BxXjvpZ0EQ6GEN",
        query_start_time: 1712055588728556,
        is_queue: false,
        user_id: "root@example.com",
        org_id: "default",
        stream_type: "logs",
        sql: "select * from 'default'",
        start_time: 1706429989000000,
        end_time: 1706429989050000,
      },
    ]);
    const deleteDialog = ref({
      show: false,
      title: "Delete Running Query",
      message: "Are you sure you want to delete this running query?",
      data: null,
    });
    // const qTable: any = ref(null);
    const { t } = useI18n();
    const showListSchemaDialog = ref(false);

    const listSchema = (props: any) => {
      console.log("listSchema");

      console.log(props.row);

      schemaData.value.session_id = props.row.session_id;
      schemaData.value.sql = props.row.sql;
      schemaData.value.stream_type = props.row.stream_type;
      showListSchemaDialog.value = true;
      console.log(
        schemaData.value,
        "schemaData.value",
        "showListSchemaDialog.value",
        showListSchemaDialog.value
      );

      // segment.track("Button Click", {
      //   button: "Actions",
      //   user_org: store.state.selectedOrganization.identifier,
      //   user_id: store.state.userInfo.email,
      //   stream_name: props.row.session_id,
      //   page: "Settings",
      // });
    };

    const perPageOptions: any = [
      { label: "5", value: 5 },
      { label: "10", value: 10 },
      { label: "20", value: 20 },
      { label: "50", value: 50 },
      { label: "100", value: 100 },
    ];
    const maxRecordToReturn = ref(100);
    const selectedPerPage = ref(20);
    const pagination: any = ref({
      rowsPerPage: 20,
    });
    const changePagination = (val: { label: string; value: any }) => {
      selectedPerPage.value = val.value;
      pagination.value.rowsPerPage = val.value;
      qTable.value.setPagination(pagination.value);
    };
    const filterQuery = ref("");

    // const q = useQuasar();

    const columns = ref<QTableProps["columns"]>([
      {
        name: "#",
        label: "#",
        field: "#",
        align: "left",
      },
      {
        name: "user_id",
        field: "user_id",
        label: t("user.email"),
        align: "left",
        sortable: true,
      },
      {
        name: "org_id",
        field: "org_id",
        label: t("organization.id"),
        align: "left",
        sortable: true,
      },
      {
        name: "query_start_time",
        label: t("queries.initiatedAt"),
        align: "left",
        sortable: true,
        field: (row: any) =>
          timestampToTimezoneDate(
            row.query_start_time / 1000,
            store.state.timezone,
            "yyyy-MM-dd HH:mm:ss.SSS"
          ),
        prop: (row: any) =>
          timestampToTimezoneDate(
            row.query_start_time / 1000,
            store.state.timezone,
            "yyyy-MM-dd HH:mm:ss.SSS"
          ),
      },
      {
        name: "query",
        field: "query",
        label: t("queries.query"),
        align: "left",
        sortable: true,
      },
      {
        name: "stream_type",
        field: "stream_type",
        label: t("alerts.streamType"),
        align: "left",
        sortable: true,
      },
      {
        name: "start_time",
        label: t("common.startTime"),
        align: "left",
        sortable: true,
        field: (row: any) =>
          timestampToTimezoneDate(
            row["start_time"] / 1000,
            store.state.timezone,
            "yyyy-MM-dd HH:mm:ss.SSS"
          ),
        prop: (row: any) =>
          timestampToTimezoneDate(
            row["start_time"] / 1000,
            store.state.timezone,
            "yyyy-MM-dd HH:mm:ss.SSS"
          ),
      },
      {
        name: "end_time",
        label: t("common.endTime"),
        align: "left",
        sortable: true,
        field: (row: any) =>
          timestampToTimezoneDate(
            row["end_time"] / 1000,
            store.state.timezone,
            "yyyy-MM-dd HH:mm:ss.SSS"
          ),
        prop: (row: any) =>
          timestampToTimezoneDate(
            row["end_time"] / 1000,
            store.state.timezone,
            "yyyy-MM-dd HH:mm:ss.SSS"
          ),
      },
      {
        name: "actions",
        field: "actions",
        label: t("common.actions"),
        align: "center",
      },
    ]);

    onBeforeMount(() => {
      // getRunningQueries();
    });

    const getRunningQueries = () => {
      const dismiss = q.notify({
        message: "Fetching running queries...",
        color: "primary",
        position: "bottom",
        spinner: true,
      });
      SearchService.get_running_queries()
        .then((response: any) => {
          console.log("response", response);
          
          queries.value = response.data;
        })
        .catch((error: any) => {
          q.notify({
            message:
              error.response?.data?.message ||
              "Failed to fetch running queries",
            color: "negative",
            position: "bottom",
            timeout: 2500,
          });
        })
        .finally(() => {
          dismiss();
        });
    };

    const deleteQuery = () => {
      SearchService.delete_running_query(deleteDialog.value.data.id)
        .then(() => {
          getRunningQueries();
          deleteDialog.value.show = false;
          q.notify({
            message: "Running query deleted successfully",
            color: "positive",
            position: "bottom",
            timeout: 2500,
          });
        })
        .catch((error: any) => {
          q.notify({
            message:
              error.response?.data?.message || "Failed to delete running query",
            color: "negative",
            position: "bottom",
            timeout: 2500,
          });
        });
    };

    const filterData = (rows: any, terms: any) => {
      return queries.value;
      // var filtered = [];
      // terms = terms.toLowerCase();

      // for (var i = 0; i < duplicateStreamList.value.length; i++) {
      //   if (
      //     (selectedStreamType.value ===
      //       duplicateStreamList.value[i]["stream_type"] ||
      //       selectedStreamType.value === "all") &&
      //     (duplicateStreamList.value[i]["name"].toLowerCase().includes(terms) ||
      //       duplicateStreamList.value[i]["stream_type"]
      //         .toLowerCase()
      //         .includes(terms))
      //   ) {
      //     filtered.push(duplicateStreamList.value[i]);
      //   }
      // }
      // return filtered;
    };

    const confirmDeleteAction = (props: any) => {
      console.log(props);
      deleteDialog.value.data = props.row.session_id;
      deleteDialog.value.show = true;
    };
    return {
      t,
      store,
      queries,
      columns,
      getRunningQueries,
      deleteQuery,
      filterData,
      confirmDeleteAction,
      deleteDialog,
      perPageOptions,
      listSchema,
      showListSchemaDialog,
      filterQuery,
      changePagination,
      outlinedDelete,
      schemaData,
      loadingState
    };
  },
});
</script>

<style scoped></style>

<style lang="scss">
.running-queries-page {
  .search-input {
    width: 400px;
  }
}
</style>
