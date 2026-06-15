<template>
  <AgGridVue
    :columnDefs="columnDefs"
    :rowData="rowData"
    :treeData="true"
    :groupDefaultExpanded="-1"
    :autoGroupColumnDef="autoGroupColumnDef"
    :getRowId="getRowId"
    :defaultColDef="defaultColDef"
    treeDataParentIdField="parent"
    style="height: 600px"
    @row-data-updated="onRowDataUpdated"
  />
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3';
import { useTreeGrid } from './useTestGrid.ts';

const {
  rowData,
  columnDefs,
  autoGroupColumnDef,
  defaultColDef,
  getRowId,
  onRowDataUpdated,
} = useTreeGrid();
</script>
