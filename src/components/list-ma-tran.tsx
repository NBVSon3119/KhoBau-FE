import React, { useState } from 'react';
import { layDanhSach, type BaiToanDto } from '../api';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Pagination } from '@mui/material';

type Props = {
  onSelect: (bai: BaiToanDto) => void;
};

const PAGE_SIZE = 3;

export default function DanhSachBaiToan({ onSelect }: Props) {
  const [ds, setDs] = useState<BaiToanDto[]>([]);
  const [page, setPage] = useState(1);

  const handleLoad = async () => {
    try {
      const data = await layDanhSach();
      setDs(data);
      setPage(1);
    } catch (err) {
      alert('Lỗi khi lấy danh sách');
    }
  };

  const pageCount = Math.ceil(ds.length / PAGE_SIZE);
  const currentPageData = ds.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <Button variant="contained" onClick={handleLoad}>Lấy danh sách ma trận đã lưu</Button>

      {ds.length > 0 && (
        <>
          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Kích thước</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageData.map((bai) => (
                <TableRow key={bai.id}>
                  <TableCell>{bai.id}</TableCell>
                  <TableCell>{bai.soHang}x{bai.soCot}</TableCell>
                  <TableCell>{new Date(bai.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button onClick={() => onSelect(bai)}>Xem</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} />
        </>
      )}
    </div>
  );
}
