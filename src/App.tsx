import React from 'react';
import {
  Container, Typography, TextField, Button, Paper, Stack, Alert,
} from '@mui/material';
import MaTranInput from './components/ma-tran-input';
import DanhSachBaiToan from './components/list-ma-tran';
import { nhapMaTran, layKetQua, type BaiToanDto } from './api';

export default function App() {
  const [n, setN] = React.useState(3);
  const [m, setM] = React.useState(3);
  const [p, setP] = React.useState(3);
  const [maTran, setMaTran] = React.useState<number[][]>(
    Array.from({ length: 3 }, () => Array(3).fill(1))
  );
  const [error, setError] = React.useState<string | null>(null);
  const [detail, setDetail] = React.useState<any | null>(null);

  React.useEffect(() => {
    setMaTran(Array.from({ length: n }, () => Array(m).fill(1)));
  }, [n, m]);

  const onChangeCell = (r: number, c: number, val: number) => {
    setMaTran(prev => {
      const cp = prev.map(row => row.slice());
      cp[r][c] = val;
      return cp;
    });
  };

  const validate = () => {
    if (n < 1 || n > 500) return 'n phải trong 1..500';
    if (m < 1 || m > 500) return 'm phải trong 1..500';
    if (p < 1 || p > n * m) return 'p phải trong 1..n*m';

    const counts = new Set<number>();
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < m; c++) {
        const v = maTran[r]?.[c];
        if (typeof v !== 'number' || isNaN(v) || v < 1 || v > p)
          return `Giá trị ma trận phải trong 1..${p}`;
        counts.add(v);
      }
    }
    for (let i = 1; i <= p; i++) {
      if (!counts.has(i)) return `Ma trận phải chứa đủ các giá trị từ 1 đến ${p}`;
    }

    return null;
  };

  const submit = async () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setError(null);
    try {
      const res = await nhapMaTran({ soHang: n, soCot: m, soP: p, maTran });
      const det = await layKetQua(res.id);
      setDetail(det);
    } catch (e: any) {
      setError(e.message || String(e));
    }
  };

  const onSelectSaved = async (bai: BaiToanDto) => {
    setN(bai.soHang);
    setM(bai.soCot);
    setP(bai.soP);
    try {
      const matrix = JSON.parse(bai.maTranJson);
      if (Array.isArray(matrix)) {
        setMaTran(matrix);
        setError(null);
        setDetail(null); 
  
        const ketQua = await layKetQua(bai.id);
        setDetail(ketQua);
      } else {
        setError('Ma trận không hợp lệ');
        setDetail(null);
      }
    } catch {
      setError('Không thể chuyển đổi thành ma trận');
      setDetail(null);
    }
  };
  

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Tìm kho báu</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField type="number" label="n (rows)" value={n} onChange={e => setN(Number(e.target.value))} />
          <TextField type="number" label="m (cols)" value={m} onChange={e => setM(Number(e.target.value))} />
          <TextField type="number" label="p (max)" value={p} onChange={e => setP(Number(e.target.value))} />
          <Button variant="contained" onClick={submit}>Lưu & Giải</Button>
        </Stack>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Typography variant="h6" sx={{ mt: 2 }}>Nhập ma trận (1..p)</Typography>
        <MaTranInput n={n} m={m} p={p} values={maTran} onChange={onChangeCell} />
      </Paper>

      {detail && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">Kết quả</Typography>
          <Typography>Nhiên liệu nhỏ nhất: <b>{detail.nhienLieu}</b></Typography>
        </Paper>
      )}

      <Paper sx={{ p: 2 }}>
        {/* <Typography variant="h6" gutterBottom>Danh sách ma trận đã lưu</Typography> */}
        <DanhSachBaiToan onSelect={onSelectSaved} />
      </Paper>
    </Container>
  );
}
