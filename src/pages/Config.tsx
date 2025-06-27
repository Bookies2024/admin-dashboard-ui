import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridRowModes,
  GridActionsCellItem,
  GridRowId,
} from '@mui/x-data-grid';
import { Delete, Edit, Save, Cancel, Add } from '@mui/icons-material';
import PageLayout from '../layout/PageLayout';
import { useDispatch, useSelector } from 'react-redux';
import { setConfig } from '../store/auth/auth-slice';
import { RootState } from '../store/store';
import { useUpdateConfigMutation } from '../store/app/app-api-slice';
import { useNavigate } from 'react-router-dom';
import { CONFIG_HEADERS } from '../util/constants';

type ConfigRow = {
  id: number;
  type: 'city' | 'email';
  key: string;
  value: string;
  footerImage: string;
};

const Config: React.FC = () => {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [newRow, setNewRow] = useState<Omit<ConfigRow, 'id'>>({
    type: 'city',
    key: '',
    value: '',
    footerImage: '',
  });
  const { config: reduxConfig, city } = useSelector((state: RootState) => state.auth);
  const [updateConfig] = useUpdateConfigMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    if (!city?.toLowerCase().includes('mumbai')) {
      navigate('/')
    }
  }, [city, navigate]);

  const rows: ConfigRow[] = useMemo(
    () =>
      reduxConfig?.map((cfg, index) => ({
        id: index + 1,
        type: cfg.Type as 'city' | 'email',
        key: cfg.Key,
        value: cfg.Value,
        footerImage: cfg[CONFIG_HEADERS.FOOTER_IMAGE] ?? '',
        qrPrefix: cfg[CONFIG_HEADERS.QR_PREFIX] ?? '',
      })) ?? [],
    [reduxConfig]
  );

  const syncAndUpdate = async (updatedRows: ConfigRow[]) => {
    const updated = updatedRows.map(row => ({
      Type: row.type,
      Key: row.key,
      Value: row.value,
      ...(row.type === 'city' ? { 'Footer Image': row.footerImage } : {}),
    }));

    dispatch(setConfig({ config: updated, city }));
    await updateConfig({ config: updated });
  };

  const handleEditClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleDeleteClick = async (id: GridRowId) => {
    const updated = rows.filter((row) => row.id !== id);
    await syncAndUpdate(updated);
  };

  const processRowUpdate = async (updatedRow: ConfigRow) => {
    const updated = rows.map((row) => (row.id === updatedRow.id ? updatedRow : row));
    await syncAndUpdate(updated);
    return updatedRow;
  };

  const handleAddRow = async () => {
    if (!newRow.type || !newRow.key || !newRow.value) return;
    const newId = rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    const newRows = [...rows, { ...newRow, id: newId }];
    await syncAndUpdate(newRows);
    setNewRow({ type: 'city', key: '', value: '', footerImage: '' });
  };

  const columns: GridColDef<ConfigRow>[] = useMemo(
    () => [
      {
        field: 'type',
        headerName: 'Type',
        flex: 1,
        editable: true,
        type: 'singleSelect',
        valueOptions: ['city', 'email'],
      },
      { field: 'key', headerName: 'Key', flex: 2, editable: true },
      {
        field: 'value',
        headerName: 'Value',
        flex: 1.5,
        editable: true,
        renderCell: (params) => {
          const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
          return isInEditMode ? (
            params.value
          ) : (
            <span style={{ fontFamily: 'monospace', letterSpacing: 2 }}>••••••••</span>
          );
        },
      },
      {
        field: 'footerImage',
        headerName: 'Mail Footer Image',
        flex: 2,
        editable: true,
        renderCell: (params) =>
          params.row.type === 'email' ? (
            <span style={{ color: 'gray' }}>—</span>
          ) : params.value ? (
            <a href={params.value} target="_blank" rel="noreferrer">
              {params.value}
            </a>
          ) : (
            <em style={{ color: 'gray' }}>None</em>
          ),
      },
      { field: 'qrPrefix', headerName: 'QR Prefix', flex: 2, editable: true },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          return isInEditMode
            ? [
              <GridActionsCellItem icon={<Save />} label="Save" onClick={() => handleSaveClick(id)} />,
              <GridActionsCellItem icon={<Cancel />} label="Cancel" onClick={() => handleCancelClick(id)} />,
            ]
            : [
              <GridActionsCellItem icon={<Edit />} label="Edit" onClick={() => handleEditClick(id)} />,
              <GridActionsCellItem icon={<Delete />} label="Delete" onClick={() => handleDeleteClick(id)} />,
            ];
        },
      },
    ],
    [rowModesModel]
  );

  if (!city?.toLowerCase().includes('mumbai')) return

  return (
    <PageLayout title="Config">
      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
        <TextField
          label="Type"
          select
          value={newRow.type}
          size="small"
          onChange={(e) => setNewRow({ ...newRow, type: e.target.value as 'city' | 'email' })}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="city">city</MenuItem>
          <MenuItem value="email">email</MenuItem>
        </TextField>

        <TextField
          label="Key"
          size="small"
          value={newRow.key}
          onChange={(e) => setNewRow({ ...newRow, key: e.target.value })}
          sx={{ minWidth: 200 }}
        />

        <TextField
          label="Value"
          size="small"
          value={newRow.value}
          onChange={(e) => setNewRow({ ...newRow, value: e.target.value })}
          sx={{ minWidth: 150 }}
        />

        {newRow.type === 'city' && (
          <TextField
            label="Footer Image"
            size="small"
            value={newRow.footerImage}
            onChange={(e) => setNewRow({ ...newRow, footerImage: e.target.value })}
            sx={{ minWidth: 250 }}
          />
        )}

        <Button
          variant="contained"
          onClick={handleAddRow}
          sx={{ alignSelf: 'center', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
          startIcon={<Add />}
        >
          Add
        </Button>
      </Stack>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
          disableColumnFilter
          disableColumnMenu
          hideFooterPagination
          hideFooter
          disableRowSelectionOnClick
        />
      </Box>
    </PageLayout>
  );
};

export default Config;
