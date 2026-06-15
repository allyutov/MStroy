import { computed, ref } from 'vue';
import type { GetRowIdParams, ColDef, AutoGroupColumnDef } from 'ag-grid-community';
import { TreeStore } from '@/entities/tree-store/TreeStore';

export function useTreeGrid() {
  const items = ref([
    { id: 1, parent: null, label: 'Айтем 1' },
    { id: '91064cee', parent: 1, label: 'Айтем 2' },
    { id: 3, parent: 1, label: 'Айтем 3' },
    { id: 4, parent: '91064cee', label: 'Айтем 4' },
    { id: 5, parent: '91064cee', label: 'Айтем 5' },
    { id: 6, parent: '91064cee', label: 'Айтем 6' },
    { id: 7, parent: 4, label: 'Айтем 7' },
    { id: 8, parent: 4, label: 'Айтем 8' },
  ]);

  const store = new TreeStore(items.value);

  const rowData = computed(() =>
    store.getAll().map((item) => ({
      ...item,
      category: store.getChildren(item.id).length ? 'Группа' : 'Элемент',
    }))
  );

  const columnDefs: ColDef[] = [
    {
      headerName: '№ П/П',
      field: 'rowNumber',
      width: 90,
      pinned: 'left',
      suppressMovable: true,
      resizable: false,
    },
    {
      headerName: 'Наименование',
      field: 'label',
      flex: 1,
      resizable: false,
    },
  ];

  const autoGroupColumnDef: AutoGroupColumnDef = {
    headerName: 'Категория',
    field: 'category',
    flex: 1,
    resizable: false,
    cellRendererParams: {
      suppressCount: true,
    },
  };

  const defaultColDef = {
    suppressHeaderMenuButton: true,
  };

  const getRowId = (params: GetRowIdParams) =>
    String(params.data.id);

  const onRowDataUpdated = (params: any) => {
    let i = 1;

    params.api.forEachNodeAfterFilterAndSort((node: any) => {
      node.setDataValue('rowNumber', i++);
    });
  };

  return {
    rowData,
    columnDefs,
    autoGroupColumnDef,
    defaultColDef,
    getRowId,
    onRowDataUpdated,
  };
}
