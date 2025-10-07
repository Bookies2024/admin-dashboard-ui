import React, { useState, useMemo } from 'react';
import PageLayout from '../layout/PageLayout';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import Stats from '../components/Stats';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortModel,
  GridFilterAltIcon,
} from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  useGetAllMembersQuery,
  useGetAllSessionsQuery,
} from '../store/app/app-api-slice';

type MemberRow = {
  id: number;
  bookiesId: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  age: number;
  totalSessions: number;
};

const Dashboard = () => {
  const { city } = useSelector((state: RootState) => state.auth);
  const [date, setDate] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [columnFilters, setColumnFilters] = useState<GridFilterModel['items']>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0,
  });

  const { data, isFetching } = useGetAllMembersQuery({
    city,
    date,
    searchKey,
    columnFilters,
    page: paginationModel.page + 1, // 1-based for backend
    pageSize: paginationModel.pageSize,
    sortField: sortModel[0]?.field || '',
    sortOrder: sortModel[0]?.sort || '',
  });

  const { data: sessions, isLoading: isSessionsLoading } = useGetAllSessionsQuery({ city });

  const rows: MemberRow[] = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((member, index) => ({
      id: paginationModel.page * paginationModel.pageSize + index + 1,
      bookiesId: member['Bookies ID'],
      name: `${member['First Name']?.trim() || ''} ${member['Last Name']?.trim() || ''}`,
      email: member.Email,
      phoneNumber: member['Phone Number'],
      gender: member.Gender,
      age: member.age,
      totalSessions: member.attendedSessionsCount,
    }));
  }, [data, paginationModel]);

  const columns: GridColDef<MemberRow>[] = [
    { field: 'bookiesId', headerName: 'Bookies ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1.2 },
    { field: 'gender', headerName: 'Gender', flex: 0.8 },
    { field: 'age', headerName: 'Age', flex: 0.6, type: 'number' },
    { field: 'totalSessions', headerName: 'Attended Sessions', flex: 1, type: 'number' },
  ];

  const handlePaginationModelChange = (model: typeof paginationModel) => {
    setPaginationModel(model);
  };

  const handleFilterModelChange = (filterModel: GridFilterModel) => {
    const quickSearch = filterModel.quickFilterValues?.[0] || '';
    setSearchKey(quickSearch);
    setColumnFilters(filterModel.items || []);
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  };

  return (
    <PageLayout title="Dashboard">
      <Box>
        <Stats />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 5fr',
          height: 'calc(100vh - 310px)',
          mt: 2,
        }}
      >
        <Box
          sx={{
            border: '1px solid rgba(0,0,0,0.15)',
            overflowY: 'auto',
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2, color: date ? 'gray' : 'lightgray' }}>
            <Typography sx={{ p: 2, position: 'sticky', top: 0, bgcolor: 'white', color: 'black' }}>
              Sessions
            </Typography>
            <GridFilterAltIcon />
          </Box>

          <List sx={{ px: 2, pt: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {isSessionsLoading
              ? Array.from({ length: 12 }).map((_, i) => (
                <ListItem key={i} disablePadding>
                  <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
                </ListItem>
              ))
              : [...sessions?.sessions || []].reverse().map((e: string, i: number) => (
                <ListItem key={i} disablePadding>
                  <ListItemButton
                    sx={{ borderRadius: 1 }}
                    onClick={() => {
                      setDate(date === e ? '' : e);
                      setPaginationModel(prev => ({ ...prev, page: 0 }));
                    }}
                    selected={date === e}
                  >
                    <ListItemText primary={e} />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Box>

        <Box sx={{ height: '100%', overflow: 'auto' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            rowHeight={51}
            loading={isFetching}
            showToolbar
            paginationMode="server"
            sortingMode="server"
            rowCount={data?.total || 0}
            paginationModel={paginationModel}
            sortModel={sortModel}
            onPaginationModelChange={handlePaginationModelChange}
            onSortModelChange={handleSortModelChange}
            onFilterModelChange={handleFilterModelChange}
            pageSizeOptions={[10, 20, 50]}
          />
        </Box>
      </Box>
    </PageLayout>
  );
};

export default Dashboard;
