import React, { useState, useEffect, useRef } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, InputAdornment, IconButton, Select, MenuItem, FormControl, InputLabel,
  TableSortLabel, Box, Button, CircularProgress, Typography, Alert, Snackbar,
  TablePagination, AppBar, Toolbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { api, API_URL, UPLOAD_API_URL } from './api'; // api.js からインポート

function AppContent({ isLoggedIn, username, handleLogout }) {
  const [influencers, setInfluencers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState('followers');
  const [order, setOrder] = useState('desc');
  const [uploading, setUploading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fileInputRef = useRef(null);

  const fetchInfluencers = async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const params = {
        page: page,
        rowsPerPage: rowsPerPage,
        orderBy: orderBy,
        orderDirection: order,
        searchTerm: searchTerm,
        selectedRegion: selectedRegion
      };
      const response = await api.get(API_URL, { params });
      setInfluencers(response.data.items);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      console.error("Failed to fetch influencers:", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
        setSnackbarMessage("セッションが切れました。再度ログインしてください。");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("インフルエンサーデータの取得に失敗しました。");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchInfluencers();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, page, rowsPerPage, orderBy, order, searchTerm, selectedRegion]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setSnackbarMessage("Excelファイル（.xlsx または .xls）のみアップロードできます。");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setSnackbarMessage("ファイルをアップロード中...");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);

    try {
      const response = await api.post(UPLOAD_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSnackbarMessage(response.data.message || "ファイルのアップロードとインポートが成功しました！");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setPage(0);
      fetchInfluencers();
    } catch (error) {
      console.error("File upload failed:", error);
      const errorMessage = error.response?.data?.error || "ファイルのアップロードに失敗しました。";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            インフルエンサーランキング
          </Typography>
          {username && (
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              ようこそ, {username}さん
            </Typography>
          )}
          <Button color="inherit" onClick={handleLogout}>
            ログアウト
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          label="キーワード検索"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>地域</InputLabel>
          <Select
            value={selectedRegion}
            onChange={handleRegionChange}
            label="地域"
          >
            <MenuItem value="">
              <em>全て</em>
            </MenuItem>
            <MenuItem value="東京">東京</MenuItem>
            <MenuItem value="大阪">大阪</MenuItem>
            <MenuItem value="福岡">福岡</MenuItem>
            <MenuItem value="札幌">札幌</MenuItem>
          </Select>
        </FormControl>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".xlsx, .xls"
        />
        <Button
          variant="contained"
          component="span"
          startIcon={<FileUploadIcon />}
          onClick={handleUploadButtonClick}
          disabled={uploading}
        >
          {uploading ? <CircularProgress size={24} color="inherit" /> : 'Excelアップロード'}
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="influencer ranking table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'id'}
                      direction={orderBy === 'id' ? order : 'asc'}
                      onClick={() => handleRequestSort('id')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'username'}
                      direction={orderBy === 'username' ? order : 'asc'}
                      onClick={() => handleRequestSort('username')}
                    >
                      ユーザー名
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'followers'}
                      direction={orderBy === 'followers' ? order : 'asc'}
                      onClick={() => handleRequestSort('followers')}
                    >
                      フォロワー数
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'storeName'}
                      direction={orderBy === 'storeName' ? order : 'asc'}
                      onClick={() => handleRequestSort('storeName')}
                    >
                      店舗名
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'popularity'}
                      direction={orderBy === 'popularity' ? order : 'asc'}
                      onClick={() => handleRequestSort('popularity')}
                    >
                      人気度
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'region'}
                      direction={orderBy === 'region' ? order : 'asc'}
                      onClick={() => handleRequestSort('region')}
                    >
                      地域
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {influencers.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      表示するデータがありません。
                    </TableCell>
                  </TableRow>
                ) : (
                  influencers.map((influencer) => (
                    <TableRow key={influencer.id}>
                      <TableCell>{influencer.id}</TableCell>
                      <TableCell>{influencer.username}</TableCell>
                      <TableCell>{influencer.followers.toLocaleString()}</TableCell>
                      <TableCell>{influencer.storeName}</TableCell>
                      <TableCell>{influencer.popularity}</TableCell>
                      <TableCell>{influencer.region}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="表示件数:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} 件中 ${count !== -1 ? count : `約 ${to}`}`
            }
          />
        </Paper>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AppContent;